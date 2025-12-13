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

      <H1>It Will Not Work On Website Realtime Beacuse Renders Free Plan Doesnt Support Web Sockets You Can Try Out With Images</H1>

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
