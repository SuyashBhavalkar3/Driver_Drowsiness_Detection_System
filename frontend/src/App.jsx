import { useState, useEffect, useRef } from 'react'
import './App.css'
import ImageUpload from './components/ImageUpload'
import StatusDisplay from './components/StatusDisplay'
import WebcamMonitor from './components/WebcamMonitor'

function App() {
  const [activeTab, setActiveTab] = useState('upload')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [liveStatus, setLiveStatus] = useState(null)
  const statusIntervalRef = useRef(null)

  // Fetch live status every 500ms
  useEffect(() => {
    if (activeTab === 'webcam') {
      statusIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:8000/status')
          if (response.ok) {
            const data = await response.json()
            setLiveStatus(data)
          }
        } catch (error) {
          console.error('Failed to fetch status:', error)
        }
      }, 500)
    }

    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current)
      }
    }
  }, [activeTab])

  return (
    <div className="app-container">
      <header className="header">
        <h1>🚗 Driver Drowsiness Detection System</h1>
        <p>Detect driver drowsiness and yawning in real-time</p>
      </header>

      <nav className="tabs">
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Image
        </button>
        <button
          className={`tab-button ${activeTab === 'webcam' ? 'active' : ''}`}
          onClick={() => setActiveTab('webcam')}
        >
          📹 Webcam Monitor
        </button>
      </nav>

      <main className="content">
        {activeTab === 'upload' && (
          <ImageUpload setAnalysisResult={setAnalysisResult} />
        )}
        {activeTab === 'webcam' && (
          <WebcamMonitor status={liveStatus} />
        )}
      </main>

      {analysisResult && activeTab === 'upload' && (
        <StatusDisplay result={analysisResult} />
      )}
    </div>
  )
}

export default App
