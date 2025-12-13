import { useState } from 'react'
import { Card, StatusIndicator, MetricBox, ErrorAlert } from '../common'
import { useWebcamFrame, useAlerts } from '../../hooks'
import './WebcamMonitorPage.css'

export const WebcamMonitorPage = () => {
  const {
    videoRef,
    canvasRef,
    analysis,
    isConnected,
  } = useWebcamFrame(true, 10)

  const [alertsEnabled, setAlertsEnabled] = useState(true)

  useAlerts(analysis, alertsEnabled)

  if (!analysis) {
    return (
      <Card className="loading-card">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Connecting to webcam...</p>
        </div>
      </Card>
    )
  }

  const { ear, mar, drowsy, yawning } = analysis

  const alertStatus =
    drowsy && yawning
      ? 'critical'
      : drowsy
      ? 'drowsy'
      : yawning
      ? 'yawning'
      : 'normal'

  const getMetricStatus = (value, threshold, isHigher = false) => {
    if (value === undefined || value === null) return 'normal'
    if (isHigher) return value > threshold ? 'danger' : 'normal'
    return value < threshold ? 'danger' : 'normal'
  }

  return (
    <div className="webcam-page">
      <div className="page-header">
        <h2>📹 Live Webcam Monitor</h2>
        <div className="connection-status">
          <span
            className={`status-dot ${
              isConnected ? 'connected' : 'disconnected'
            }`}
          ></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {!isConnected && (
        <ErrorAlert message="WebSocket disconnected. Please refresh." />
      )}

      <Card className="feed-card">
        <div className={`live-feed ${alertStatus}`}>
          {}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="feed-image"
          />

          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className="feed-overlay">
            <StatusIndicator status={alertStatus} />
          </div>
        </div>
      </Card>

      <div className="controls-row">
        <Card className="alert-control">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={alertsEnabled}
              onChange={(e) => setAlertsEnabled(e.target.checked)}
            />
            <span>Enable Audio Alerts</span>
          </label>
        </Card>
      </div>

      <div className="metrics-grid">
        <MetricBox
          icon="👁️"
          label="Eye Aspect Ratio"
          value={ear?.toFixed(3)}
          status={getMetricStatus(ear, 0.25)}
          threshold="0.25"
        />
        <MetricBox
          icon="👄"
          label="Mouth Aspect Ratio"
          value={mar?.toFixed(3)}
          status={getMetricStatus(mar, 0.7, true)}
          threshold="0.70"
        />
      </div>

      <Card className="indicators-card">
        <h3>Detection Status</h3>
        <div className="indicators">
          <div className={`indicator ${drowsy ? 'active' : ''}`}>
            <span className="indicator-dot"></span>
            <span>Drowsiness: {drowsy ? '🚨 DETECTED' : '✅ NONE'}</span>
          </div>
          <div className={`indicator ${yawning ? 'active' : ''}`}>
            <span className="indicator-dot"></span>
            <span>Yawning: {yawning ? '🚨 DETECTED' : '✅ NONE'}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}