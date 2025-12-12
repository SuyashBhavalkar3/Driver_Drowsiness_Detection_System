import './Metric.css'

export const MetricBox = ({ icon, label, value, status = 'normal', threshold = null }) => {
  return (
    <div className={`metric-box metric-${status}`}>
      <div className="metric-header">
        <span className="metric-icon">{icon}</span>
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-value">{value}</div>
      {threshold && (
        <div className="metric-threshold">Threshold: {threshold}</div>
      )}
    </div>
  )
}
