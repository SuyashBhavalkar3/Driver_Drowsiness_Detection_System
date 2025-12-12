/**
 * useStatus - Hook for fetching live status metrics
 */

import { useEffect, useState, useRef } from 'react'
import { api } from '../services/api'

export const useStatus = (enabled = true, interval = 500) => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const fetchStatus = async () => {
      try {
        setLoading(true)
        const data = await api.getStatus()
        setStatus(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Status fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    // Fetch immediately
    fetchStatus()

    // Set up polling
    intervalRef.current = setInterval(fetchStatus, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval])

  return { status, loading, error }
}
