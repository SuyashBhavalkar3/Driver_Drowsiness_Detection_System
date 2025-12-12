// Audio utility for drowsiness alerts
// Creates beep sounds without requiring external audio files

class AudioAlert {
  constructor() {
    this.audioContext = null
    this.lastAlertTime = 0
    this.alertCooldown = 2000 // 2 seconds between alerts
  }

  // Initialize audio context (needed for browser security)
  async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Play a beep sound
  async playBeep(frequency = 800, duration = 200, volume = 0.3) {
    try {
      await this.init()
      
      const now = this.audioContext.currentTime
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(volume, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000)

      oscillator.start(now)
      oscillator.stop(now + duration / 1000)
    } catch (error) {
      console.error('Error playing beep:', error)
    }
  }

  // Play drowsiness alert (low frequency beep)
  async alertDrowsy() {
    const now = Date.now()
    if (now - this.lastAlertTime < this.alertCooldown) {
      return
    }
    this.lastAlertTime = now
    
    // Three quick beeps
    await this.playBeep(600, 150, 0.4)
    await new Promise(r => setTimeout(r, 150))
    await this.playBeep(600, 150, 0.4)
    await new Promise(r => setTimeout(r, 150))
    await this.playBeep(600, 150, 0.4)
  }

  // Play yawning alert (medium frequency beep)
  async alertYawning() {
    const now = Date.now()
    if (now - this.lastAlertTime < this.alertCooldown) {
      return
    }
    this.lastAlertTime = now
    
    // Two quick beeps
    await this.playBeep(800, 200, 0.35)
    await new Promise(r => setTimeout(r, 200))
    await this.playBeep(800, 200, 0.35)
  }

  // Play critical alert (both drowsy and yawning)
  async alertCritical() {
    const now = Date.now()
    if (now - this.lastAlertTime < this.alertCooldown) {
      return
    }
    this.lastAlertTime = now
    
    // Escalating beeps
    await this.playBeep(600, 150, 0.4)
    await new Promise(r => setTimeout(r, 100))
    await this.playBeep(800, 150, 0.45)
    await new Promise(r => setTimeout(r, 100))
    await this.playBeep(1000, 200, 0.5)
  }

  // Play success sound
  async playSuccess() {
    await this.playBeep(1000, 100, 0.3)
    await new Promise(r => setTimeout(r, 100))
    await this.playBeep(1200, 150, 0.3)
  }
}

// Export singleton instance
export const audioAlert = new AudioAlert()
