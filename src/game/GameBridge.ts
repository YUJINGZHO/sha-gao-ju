export interface HudState {
  score: number
  timeLeft: number
  lives: number
}

export interface GameOverResult {
  score: number
  reason: 'time' | 'lives'
}

type GameEvents = {
  hud: HudState
  gameOver: GameOverResult
}

type Listener<K extends keyof GameEvents> = (payload: GameEvents[K]) => void

export class GameBridge {
  private listeners = new Map<keyof GameEvents, Set<(payload: never) => void>>()

  on<K extends keyof GameEvents>(event: K, listener: Listener<K>): () => void {
    const bucket = this.listeners.get(event) ?? new Set()
    bucket.add(listener as (payload: never) => void)
    this.listeners.set(event, bucket)
    return () => bucket.delete(listener as (payload: never) => void)
  }

  emit<K extends keyof GameEvents>(event: K, payload: GameEvents[K]): void {
    this.listeners.get(event)?.forEach((listener) => listener(payload as never))
  }

  clear(): void {
    this.listeners.clear()
  }
}
