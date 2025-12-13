import cv2
import mediapipe as mp
import numpy as np
from typing import Tuple
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, HTTPException

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
MOUTH = [78, 82, 13, 312, 311, 402]

EAR_THRESHOLD = 0.25
MAR_THRESHOLD = 0.7


def euclidean(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    return float(np.linalg.norm(np.array(a) - np.array(b)))


def calculate_ear(landmarks, eye_indices) -> float:
    pts = [(landmarks[i].x, landmarks[i].y) for i in eye_indices]
    A = euclidean(pts[1], pts[5])
    B = euclidean(pts[2], pts[4])
    C = euclidean(pts[0], pts[3])
    return (A + B) / (2.0 * C) if C else 0.0


def calculate_mar(landmarks, mouth_indices) -> float:
    pts = [(landmarks[i].x, landmarks[i].y) for i in mouth_indices]
    A = euclidean(pts[1], pts[5])
    B = euclidean(pts[2], pts[4])
    C = euclidean(pts[0], pts[3])
    return (A + B) / (2.0 * C) if C else 0.0


def analyze_frame(frame, face_mesh):
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    ear = mar = 0.0
    drowsy = yawning = False

    if results.multi_face_landmarks:
        landmarks = results.multi_face_landmarks[0].landmark
        ear = (calculate_ear(landmarks, LEFT_EYE) +
                calculate_ear(landmarks, RIGHT_EYE)) / 2.0
        mar = calculate_mar(landmarks, MOUTH)
        drowsy = ear < EAR_THRESHOLD
        yawning = mar > MAR_THRESHOLD

    return {
        "ear": round(float(ear), 3),
        "mar": round(float(mar), 3),
        "drowsy": drowsy,
        "yawning": yawning
    }


app = FastAPI(title="Drowsiness Detection WS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    mp_face = mp.solutions.face_mesh
    app.state.face_mesh = mp_face.FaceMesh(
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )


@app.on_event("shutdown")
def shutdown():
    app.state.face_mesh.close()


@app.websocket("/ws/webcam")
async def webcam_ws(ws: WebSocket):
    await ws.accept()
    face_mesh = app.state.face_mesh

    while True:
        data = await ws.receive_bytes()
        frame = cv2.imdecode(
            np.frombuffer(data, np.uint8),
            cv2.IMREAD_COLOR
        )

        if frame is None:
            continue

        result = analyze_frame(frame, face_mesh)
        await ws.send_json(result)

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # Read uploaded file
    data = await file.read()
    frame = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # Optional: resize large images for faster processing
    max_dim = 640
    h, w = frame.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        frame = cv2.resize(frame, (int(w*scale), int(h*scale)))

    # Analyze frame using face mesh
    result = analyze_frame(frame, app.state.face_mesh)

    # Check if a face was detected
    if result["ear"] == 0.0 and result["mar"] == 0.0 and not result["drowsy"] and not result["yawning"]:
        raise HTTPException(status_code=404, detail="No face detected in the image")

    return result