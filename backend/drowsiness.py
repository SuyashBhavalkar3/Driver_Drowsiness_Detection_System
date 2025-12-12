import base64
import io
import threading
import time
from typing import Tuple

import cv2
import mediapipe as mp
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
MOUTH = [78, 82, 13, 312, 311, 402]

EAR_THRESHOLD = 0.25
MAR_THRESHOLD = 0.7

status_data = {"ear": 0.0, "mar": 0.0, "drowsy": False, "yawning": False}


def euclidean(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    return float(np.linalg.norm(np.array(a) - np.array(b)))


def calculate_ear(landmarks, eye_indices) -> float:
    pts = [(landmarks[i].x, landmarks[i].y) for i in eye_indices]
    A = euclidean(pts[1], pts[5])
    B = euclidean(pts[2], pts[4])
    C = euclidean(pts[0], pts[3])
    return (A + B) / (2.0 * C) if C != 0 else 0.0


def calculate_mar(landmarks, mouth_indices) -> float:
    pts = [(landmarks[i].x, landmarks[i].y) for i in mouth_indices]
    A = euclidean(pts[1], pts[5])
    B = euclidean(pts[2], pts[4])
    C = euclidean(pts[0], pts[3])
    return (A + B) / (2.0 * C) if C != 0 else 0.0


def annotate_frame(frame: np.ndarray, ear: float, mar: float, drowsy: bool, yawning: bool) -> np.ndarray:
    h, w = frame.shape[:2]
    text = f"EAR: {ear:.3f}  MAR: {mar:.3f}"
    status = []
    if drowsy:
        status.append("DROWSY")
    if yawning:
        status.append("YAWN")
    status_text = " | ".join(status) if status else "Alert"
    color = (0, 255, 0) if not drowsy and not yawning else (0, 0, 255)
    cv2.rectangle(frame, (0, 0), (w, 36), (0, 0, 0), -1)
    cv2.putText(frame, text, (8, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
    cv2.putText(frame, status_text, (8, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    return frame


app = FastAPI(title="Drowsiness Detection API")


@app.on_event("startup")
def startup():
    
    mp_face_mesh = mp.solutions.face_mesh
    app.state.face_mesh = mp_face_mesh.FaceMesh(
        max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.5, min_tracking_confidence=0.5
    )
    
    try:
        start_webcam_background()
    except Exception:
        # If background cannot start, continue without crashing the app
        pass


@app.on_event("shutdown")
def shutdown():
    if hasattr(app.state, "face_mesh"):
        app.state.face_mesh.close()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...), ear_threshold: float = EAR_THRESHOLD, mar_threshold: float = MAR_THRESHOLD):
    """Accepts an image upload and returns EAR, MAR, flags and annotated image (base64 PNG)."""
    data = await file.read()
    arr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image"})

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    face_mesh = app.state.face_mesh
    results = face_mesh.process(rgb)

    ear = 0.0
    mar = 0.0
    drowsy = False
    yawning = False

    if results.multi_face_landmarks:
        landmarks = results.multi_face_landmarks[0].landmark
        left = calculate_ear(landmarks, LEFT_EYE)
        right = calculate_ear(landmarks, RIGHT_EYE)
        ear = float((left + right) / 2.0)
        mar = float(calculate_mar(landmarks, MOUTH))
        drowsy = ear < ear_threshold
        yawning = mar > mar_threshold

    status_data.update({"ear": float(ear), "mar": float(mar), "drowsy": bool(drowsy), "yawning": bool(yawning)})

    annotated = annotate_frame(img.copy(), ear, mar, drowsy, yawning)
    _, buf = cv2.imencode('.png', annotated)
    b64 = base64.b64encode(buf).decode('ascii')
    b64_uri = f"data:image/png;base64,{b64}"

    return {"ear": ear, "mar": mar, "drowsy": drowsy, "yawning": yawning, "annotated_image": b64_uri}


@app.get("/status")
def get_status():
    return status_data


# --- Optional: keep previous webcam loop support ---
def webcam_loop():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Cannot open webcam")
        return
    # Wait for app.state.face_mesh to be set by FastAPI startup
    face_mesh = None
    while True:
        try:
            face_mesh = app.state.face_mesh
            break
        except AttributeError:
            time.sleep(0.05)
    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        try:
            results = face_mesh.process(rgb)
        except Exception:
            # If face_mesh was closed or not ready, retry after a short delay
            time.sleep(0.05)
            continue
        if results.multi_face_landmarks:
            landmarks = results.multi_face_landmarks[0].landmark
            left_ear = calculate_ear(landmarks, LEFT_EYE)
            right_ear = calculate_ear(landmarks, RIGHT_EYE)
            ear = (left_ear + right_ear) / 2.0
            mar = calculate_mar(landmarks, MOUTH)
            status_data.update({
                "ear": float(ear),
                "mar": float(mar),
                "drowsy": bool(ear < EAR_THRESHOLD),
                "yawning": bool(mar > MAR_THRESHOLD),
            })
        else:
            status_data.update({"ear": 0.0, "mar": 0.0, "drowsy": False, "yawning": False})
        time.sleep(0.03)


def start_webcam_background():
    threading.Thread(target=webcam_loop, daemon=True).start()


def start():
    """Compatibility alias previously named `start()` in older code."""
    start_webcam_background()