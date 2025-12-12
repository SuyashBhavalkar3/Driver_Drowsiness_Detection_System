import './ErrorAlert.css'

export const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="error-alert">
      <div className="error-content">
        <span className="error-icon">❌</span>
        <span className="error-message">{message}</span>
      </div>
      {onClose && (
        <button className="error-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  )
}
