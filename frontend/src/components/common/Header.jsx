import './Header.css'

export const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-icon">🚗</div>
        <div>
          <h1>Driver Drowsiness Detection</h1>
          <p>Real-time AI-powered driver safety monitoring system</p>
        </div>
      </div>
    </header>
  )
}
