/**
 * API Service - Centralized API communication
 * Handles all backend requests with proper error handling and types
 */

const API_BASE_URL = 'http://localhost:8000'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export const api = {
  /**
   * Fetch live status metrics (EAR, MAR, drowsy, yawning)
   */
  async getStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      })
      
      if (!response.ok) {
        throw new ApiError(
          `Failed to fetch status: ${response.statusText}`,
          response.status
        )
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError(
        `Network error: ${error.message}`,
        0
      )
    }
  },

  /**
   * Get current webcam frame
   */
  async getFrame() {
    try {
      const response = await fetch(`${API_BASE_URL}/frame`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      })
      
      if (!response.ok) {
        throw new ApiError(
          `Failed to fetch frame: ${response.statusText}`,
          response.status
        )
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError(
        `Network error: ${error.message}`,
        0
      )
    }
  },

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
      throw new ApiError(
        `Network error: ${error.message}`,
        0
      )
    }
  },
}

export { ApiError }
