/**
 * useWebcamFrame - Hook for fetching and displaying live webcam frames
 */

import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api'

export const useWebcamFrame = (enabled = true, interval = 100) => {
  const frameImgRef = useRef(null)
  const frameIntervalRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!enabled) {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current)
      }
      return
    }

    const fetchFrame = async () => {
      try {
        const data = await api.getFrame()
        if (frameImgRef.current && data.frame) {
          frameImgRef.current.src = data.frame
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Frame fetch error:', error)
        setIsConnected(false)
      }
    }

    // Fetch frame periodically
    frameIntervalRef.current = setInterval(fetchFrame, interval)

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current)
      }
    }
  }, [enabled, interval])

  return { frameImgRef, isConnected }
}
