/**
 * useWebcamFrame - WebSocket-based live webcam streaming hook
 */

import { useEffect, useRef, useState } from 'react'

export const useWebcamFrame = (enabled = true, fps = 10) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const wsRef = useRef(null)

  const [isConnected, setIsConnected] = useState(false)
  const [analysis, setAnalysis] = useState({
    ear: 0,
    mar: 0,
    drowsy: false,
    yawning: false,
  })

  useEffect(() => {
    if (!enabled) return

    let stream
    let frameTimer

    const start = async () => {
      try {
        // 1️⃣ Get browser webcam
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
        videoRef.current.srcObject = stream
        await videoRef.current.play()

        // 2️⃣ Setup WebSocket
        wsRef.current = new WebSocket("wss://drowsiness-backend-kq31.onrender.com/ws/webcam");

        wsRef.current.onopen = () => {
          setIsConnected(true)
        }

        wsRef.current.onclose = () => {
          setIsConnected(false)
        }

        wsRef.current.onerror = () => {
          setIsConnected(false)
        }

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data)
          setAnalysis(data)
        }

        // 3️⃣ Send frames
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        frameTimer = setInterval(() => {
          if (
            wsRef.current?.readyState !== WebSocket.OPEN ||
            !videoRef.current.videoWidth
          ) return

          canvas.width = videoRef.current.videoWidth
          canvas.height = videoRef.current.videoHeight
          ctx.drawImage(videoRef.current, 0, 0)

          canvas.toBlob(
            (blob) => blob && wsRef.current.send(blob),
            'image/jpeg',
            0.7
          )
        }, 1000 / fps)
      } catch (err) {
        console.error('Webcam WS error:', err)
        setIsConnected(false)
      }
    }

    start()

    return () => {
      clearInterval(frameTimer)
      wsRef.current?.close()
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [enabled, fps])

  return {
    videoRef,
    canvasRef,
    analysis,
    isConnected,
  }
}