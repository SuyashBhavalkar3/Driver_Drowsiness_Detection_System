import { useEffect } from 'react'
import { Card, StatusIndicator, MetricBox } from '../common'
import { useAlerts } from '../../hooks'
import './AnalysisResultsPage.css'

export const AnalysisResultsPage = ({ result }) => {
  const { ear, mar, drowsy, yawning, annotated_image } = result || {}

  useAlerts(result, true)

  if (!result) return null

  const getAlertStatus = () => {
    if (drowsy && yawning) return 'critical'
    if (drowsy) return 'drowsy'
    if (yawning) return 'yawning'
    return 'normal'
  }

  const getMetricStatus = (value, threshold, isHigher = false) => {
    if (isHigher) return value > threshold ? 'danger' : 'normal'
    return value < threshold ? 'danger' : 'normal'
  }

  return (
    <div className="results-page">
      <Card className="status-card">
        <StatusIndicator status={getAlertStatus()} />
      </Card>

      {annotated_image && (
        <Card className="image-card">
          <h3>📸 Annotated Frame</h3>
          <img src={annotated_image} alt="Annotated" className="annotated-image" />
        </Card>
      )}

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

      <Card className="info-card">
        <h3>ℹ️ Detection Results</h3>
        <div className="result-details">
          <div className={`result-item ${drowsy ? 'active' : ''}`}>
            <span className="result-icon">😴</span>
            <span className="result-label">Drowsiness Detected</span>
            <span className="result-value">{drowsy ? '✅ YES' : '❌ NO'}</span>
          </div>
          <div className={`result-item ${yawning ? 'active' : ''}`}>
            <span className="result-icon">🥱</span>
            <span className="result-label">Yawning Detected</span>
            <span className="result-value">{yawning ? '✅ YES' : '❌ NO'}</span>
          </div>
        </div>

        <div className="info-section">
          <h4>What do these metrics mean?</h4>
          <ul>
            <li>
              <strong>EAR (Eye Aspect Ratio):</strong> Measures eye opening. Lower values
              indicate closed or closing eyes, a key indicator of drowsiness.
            </li>
            <li>
              <strong>MAR (Mouth Aspect Ratio):</strong> Measures mouth opening. Higher
              values indicate a wider mouth opening, typical during yawning.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
