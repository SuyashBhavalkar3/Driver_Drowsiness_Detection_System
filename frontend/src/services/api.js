/**
 * API Service - HTTP APIs only
 * WebSocket is handled separately
 */

const API_BASE_URL = 'https://drowsiness-backend-kq31.onrender.com'

class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const api = {
  /**
   * Analyze uploaded image for drowsiness/yawning
   */
  async analyzeImage(file) {
    if (!file) {
      throw new ApiError('No file provided', 400)
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new ApiError(
          `Analysis failed: ${response.statusText}`,
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError(`Network error: ${error.message}`)
    }
  },
}

export { ApiError }
