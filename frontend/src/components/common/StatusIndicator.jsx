import './StatusIndicator.css'

export const StatusIndicator = ({ status, label }) => {
  const getConfig = () => {
    if (status === 'critical') {
      return { color: 'critical', emoji: '⚠️', text: '🔴 CRITICAL ALERT' }
    }
    if (status === 'drowsy') {
      return { color: 'danger', emoji: '⚠️', text: '🟠 DROWSY' }
    }
    if (status === 'yawning') {
      return { color: 'warning', emoji: '😴', text: '🟡 YAWNING' }
    }
    return { color: 'success', emoji: '✅', text: '🟢 NORMAL' }
  }

  const config = getConfig()

  return (
    <div className={`status-indicator status-${config.color}`}>
      <span className="indicator-dot"></span>
      <span className="indicator-text">
        {config.emoji} {config.text}
      </span>
      {label && <span className="indicator-label">{label}</span>}
    </div>
  )
}
