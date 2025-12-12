/**
 * useAlerts - Hook for managing alert sounds based on status changes
 */

import { useEffect, useRef } from 'react'
import { audioAlert } from '../utils/audioAlert'

export const useAlerts = (status, enabled = true) => {
  const lastAlertStateRef = useRef({ drowsy: false, yawning: false })

  useEffect(() => {
    if (!enabled || !status) return

    const { drowsy, yawning } = status
    const lastState = lastAlertStateRef.current

    // Trigger alerts on state transitions only
    const isCritical = drowsy && yawning
    const wasCritical = lastState.drowsy && lastState.yawning

    if (isCritical && !wasCritical) {
      audioAlert.alertCritical()
    } else if (drowsy && !lastState.drowsy) {
      audioAlert.alertDrowsy()
    } else if (yawning && !lastState.yawning) {
      audioAlert.alertYawning()
    }

    // Update last known state
    lastAlertStateRef.current = { drowsy, yawning }
  }, [status, enabled])
}
