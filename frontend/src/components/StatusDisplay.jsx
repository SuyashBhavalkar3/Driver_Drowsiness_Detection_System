import { useEffect } from 'react'
import './StatusDisplay.css'
import { audioAlert } from '../utils/audioAlert'

export default function StatusDisplay({ result }) {
  const { ear, mar, drowsy, yawning, annotated_image } = result

  // Play alert sound when result shows drowsiness or yawning
  useEffect(() => {
    if (drowsy && yawning) {
      audioAlert.alertCritical()
    } else if (drowsy) {
      audioAlert.alertDrowsy()
    } else if (yawning) {
      audioAlert.alertYawning()
    }
  }, [drowsy, yawning])

  const getAlertStatus = () => {
    if (drowsy && yawning) return { text: '⚠️ CRITICAL: Drowsy & Yawning', color: 'critical' }
    if (drowsy) return { text: '⚠️ DROWSY', color: 'danger' }
    if (yawning) return { text: '⚠️ YAWNING', color: 'warning' }
    return { text: '✅ ALERT', color: 'success' }
  }

  const status = getAlertStatus()
  const earRisks = ear < 0.25 ? 'High Risk' : 'Normal'
  const marRisks = mar > 0.7 ? 'High Risk' : 'Normal'

  return (
    <div className="result-container">
      <div className="result-card">
        <div className={`status-badge ${status.color}`}>
          {status.text}
        </div>

        {annotated_image && (
          <div className="annotated-image-container">
            <img src={annotated_image} alt="Annotated" className="annotated-image" />
          </div>
        )}

        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-label">Eye Aspect Ratio (EAR)</div>
            <div className={`metric-value ${ear < 0.25 ? 'danger' : 'success'}`}>
              {ear.toFixed(3)}
            </div>
            <div className={`metric-risk ${ear < 0.25 ? 'risk' : ''}`}>
              {earRisks}
            </div>
            <div className="metric-threshold">Threshold: 0.25</div>
          </div>

          <div className="metric-item">
            <div className="metric-label">Mouth Aspect Ratio (MAR)</div>
            <div className={`metric-value ${mar > 0.7 ? 'danger' : 'success'}`}>
              {mar.toFixed(3)}
            </div>
            <div className={`metric-risk ${mar > 0.7 ? 'risk' : ''}`}>
              {marRisks}
            </div>
            <div className="metric-threshold">Threshold: 0.70</div>
          </div>
        </div>

        <div className="indicators">
          <div className={`indicator ${drowsy ? 'active' : ''}`}>
            <span className="indicator-dot"></span>
            <span>Drowsiness Detected: {drowsy ? 'YES' : 'NO'}</span>
          </div>
          <div className={`indicator ${yawning ? 'active' : ''}`}>
            <span className="indicator-dot"></span>
            <span>Yawning Detected: {yawning ? 'YES' : 'NO'}</span>
          </div>
        </div>

        <div className="info-box">
          <h3>ℹ️ What do these metrics mean?</h3>
          <ul>
            <li><strong>EAR (Eye Aspect Ratio):</strong> Measures eye opening. Lower values indicate closed eyes (drowsiness).</li>
            <li><strong>MAR (Mouth Aspect Ratio):</strong> Measures mouth opening. Higher values indicate wider mouth (yawning).</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
