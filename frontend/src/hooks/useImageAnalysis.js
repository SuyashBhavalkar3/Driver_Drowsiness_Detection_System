/**
 * useImageAnalysis - Hook for analyzing uploaded images
 */

import { useState } from 'react'
import { api, ApiError } from '../services/api'

export const useImageAnalysis = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async (file) => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.analyzeImage(file)
      setResult(data)
      return data
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : `Failed to analyze image: ${err.message}`
      setError(message)
      console.error('Analysis error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setLoading(false)
  }

  return { result, loading, error, analyze, reset }
}
