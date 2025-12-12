import { useState } from 'react'
import './ImageUpload.css'

export default function ImageUpload({ setAnalysisResult }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setAnalysisResult(data)
    } catch (err) {
      setError(`Failed to analyze image: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Image for Analysis</h2>
        
        <div className="upload-area">
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          ) : (
            <div className="placeholder">
              <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p>Click to upload or drag and drop</p>
              <p className="file-hint">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <div className="button-group">
          {preview && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedFile(null)
                setPreview(null)
                setAnalysisResult(null)
              }}
              disabled={loading}
            >
              Clear Image
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
          >
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Image'}
          </button>
        </div>
      </div>
    </div>
  )
}
