import { useEffect, useRef } from 'react'
import './WebcamMonitor.css'

export default function WebcamMonitor({ status }) {
  const frameIntervalRef = useRef(null)
  const frameImgRef = useRef(null)

  // Fetch live frame image
  useEffect(() => {
    frameIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:8000/frame')
        if (response.ok) {
          const data = await response.json()
          if (frameImgRef.current && data.frame) {
            frameImgRef.current.src = data.frame
          }
        }
      } catch (error) {
        console.error('Failed to fetch frame:', error)
      }
    }, 100)  // Update frame every 100ms (10 FPS)

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current)
      }
    }
  }, [])

  if (!status) {
    return (
      <div className="monitor-container">
        <div className="monitor-card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Connecting to webcam feed...</p>
          </div>
        </div>
      </div>
    )
  }

  const { ear, mar, drowsy, yawning } = status
  const isAlert = drowsy || yawning
  const earStatus = ear < 0.25 ? 'Closed' : 'Open'
  const marStatus = mar > 0.7 ? 'Open' : 'Closed'

  return (
    <div className="monitor-container">
      <div className="monitor-card">
        <div className={`live-feed ${isAlert ? 'alert' : ''}`}>
          <div className="feed-header">
            <span className={`status-indicator ${isAlert ? 'active' : ''}`}></span>
            <span>Live Webcam Feed</span>
          </div>
          <div className="feed-placeholder">
            <img 
              ref={frameImgRef}
              alt="Live Feed" 
              className="live-image"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="metrics-section">
          <h2>Real-Time Metrics</h2>
          
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">👁️</span>
                <span className="metric-name">Eyes</span>
              </div>
              <div className="metric-display">
                <div className="metric-bar">
                  <div className={`bar-fill ${earStatus === 'Open' ? 'open' : 'closed'}`}
                       style={{ width: `${Math.min(ear * 100, 100)}%` }}>
                  </div>
                </div>
              </div>
              <div className="metric-info">
                <span className="metric-value">{ear.toFixed(3)}</span>
                <span className={`metric-status ${earStatus.toLowerCase()}`}>{earStatus}</span>
              </div>
              <div className="metric-detail">EAR Threshold: 0.25</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">👄</span>
                <span className="metric-name">Mouth</span>
              </div>
              <div className="metric-display">
                <div className="metric-bar">
                  <div className={`bar-fill ${marStatus === 'Open' ? 'open' : 'closed'}`}
                       style={{ width: `${Math.min(mar * 100, 100)}%` }}>
                  </div>
                </div>
              </div>
              <div className="metric-info">
                <span className="metric-value">{mar.toFixed(3)}</span>
                <span className={`metric-status ${marStatus.toLowerCase()}`}>{marStatus}</span>
              </div>
              <div className="metric-detail">MAR Threshold: 0.70</div>
            </div>
          </div>
        </div>

        <div className="alerts-section">
          <h2>Detection Status</h2>
          <div className="alerts-grid">
            <div className={`alert-badge ${drowsy ? 'active' : ''}`}>
              <span className="alert-icon">😴</span>
              <span className="alert-text">Drowsiness</span>
              <span className="alert-value">{drowsy ? 'DETECTED' : 'Normal'}</span>
            </div>
            <div className={`alert-badge ${yawning ? 'active' : ''}`}>
              <span className="alert-icon">🥱</span>
              <span className="alert-text">Yawning</span>
              <span className="alert-value">{yawning ? 'DETECTED' : 'Normal'}</span>
            </div>
          </div>
        </div>

        <div className="status-panel">
          <div className="status-row">
            <span className="status-label">Overall Status:</span>
            <span className={`status-value ${isAlert ? 'alert' : 'safe'}`}>
              {isAlert ? '⚠️ ALERT' : '✅ SAFE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
