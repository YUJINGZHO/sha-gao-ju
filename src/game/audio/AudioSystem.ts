type AudioContextConstructor = new () => AudioContext

/** Small WebAudio synth; no audio files or external assets are required. */
export class AudioSystem {
  private context: AudioContext | null = null
  private disposed = false

  unlock(): void {
    if (this.disposed) return
    if (this.context) {
      if (this.context.state === 'suspended') void this.context.resume().catch(() => undefined)
      return
    }
    try {
      if (typeof window === 'undefined') return
      const ctor = (window.AudioContext ?? (window as Window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext) as AudioContextConstructor | undefined
      if (!ctor) return
      this.context = new ctor()
      void this.context.resume().catch(() => undefined)
    } catch { this.context = null }
  }

  playSlice(): void { this.tone(520, 0.055, 'triangle') }
  playCombo(count: number): void { this.tone(520 + Math.min(count, 8) * 55, 0.11, 'sine') }
  playHazard(): void { this.tone(130, 0.16, 'sawtooth') }
  playMiss(): void { this.tone(190, 0.1, 'square') }

  dispose(): void {
    this.disposed = true
    const context = this.context
    this.context = null
    if (context) void context.close().catch(() => undefined)
  }

  private tone(frequency: number, duration: number, type: OscillatorType): void {
    if (this.disposed || !this.context) return
    try {
      const now = this.context.currentTime
      const oscillator = this.context.createOscillator()
      const gain = this.context.createGain()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, now)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
      oscillator.connect(gain).connect(this.context.destination)
      oscillator.start(now)
      oscillator.stop(now + duration + 0.01)
    } catch { /* Audio is an optional enhancement. */ }
  }
}
