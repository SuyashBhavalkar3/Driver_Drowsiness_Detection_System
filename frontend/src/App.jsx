import { useState } from 'react'
import './App.css'
import { Header } from './components/common'
import { ImageUploadPage, WebcamMonitorPage, AnalysisResultsPage } from './components/pages'

function App() {
  const [activeTab, setActiveTab] = useState('webcam')
  const [analysisResult, setAnalysisResult] = useState(null)

  return (
    <div className="app">
      <Header />

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3 style={{ color: "red" }}>
          ⚠️ Realtime webcam detection will not work on this website.
        </h3>
        <p>
          This is because Render’s free plan does not support WebSockets. 
          You can still upload images to test the drowsiness detection feature.
        </p>
      </div>

      <main className="app-main">
        {/* Tab Navigation */}
        <nav className="tab-nav">
          <button
            className={`tab-button ${activeTab === 'webcam' ? 'active' : ''}`}
            onClick={() => setActiveTab('webcam')}
            aria-label="Switch to webcam monitoring"
          >
            📹 Webcam Monitor
          </button>
          <button
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
            aria-label="Switch to image upload"
          >
            📤 Upload Image
          </button>
        </nav>

        {/* Tab Content */}
        <section className="tab-content">
          {activeTab === 'webcam' && <WebcamMonitorPage />}

          {activeTab === 'upload' && (
            <div>
              <ImageUploadPage onResultChange={setAnalysisResult} />
              {analysisResult && <AnalysisResultsPage result={analysisResult} />}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>🚗 Driver Drowsiness Detection System • Real-time AI Safety Monitoring</p>
      </footer>
    </div>
  )
}

export default App
