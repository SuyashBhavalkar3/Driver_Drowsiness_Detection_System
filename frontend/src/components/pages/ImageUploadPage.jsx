import { useCallback, useState } from 'react'
import { Card, Button, ErrorAlert } from '../common'
import { useImageAnalysis, useAlerts } from '../../hooks'
import './ImageUploadPage.css'

export const ImageUploadPage = ({ onResultChange }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const { result, loading, error, analyze, reset } = useImageAnalysis()

  useAlerts(result, true)

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    onResultChange(null)
  }, [onResultChange])

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return
    try {
      const data = await analyze(selectedFile)
      onResultChange(data)
    } catch (err) {
      console.error('Analysis failed:', err)
    }
  }, [selectedFile, analyze, onResultChange])

  const handleClear = useCallback(() => {
    setSelectedFile(null)
    setPreview(null)
    reset()
    onResultChange(null)
  }, [reset, onResultChange])

  return (
    <div className="upload-page">
      <Card className="upload-card">
        <h2>📤 Upload Image for Analysis</h2>

        <div className="upload-area">
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <div className="preview-overlay">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClear}
                  disabled={loading}
                >
                  Change Image
                </Button>
              </div>
            </div>
          ) : (
            <label className="upload-placeholder">
              <div className="upload-icon">📁</div>
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                disabled={loading}
              />
            </label>
          )}
        </div>

        {error && (
          <ErrorAlert
            message={error}
            onClose={() => setSelectedFile(null)}
          />
        )}

        <div className="button-group">
          {preview && (
            <Button
              variant="secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={handleAnalyze}
            isLoading={loading}
            disabled={!selectedFile || loading}
          >
            🔍 Analyze Image
          </Button>
        </div>
      </Card>
    </div>
  )
}
