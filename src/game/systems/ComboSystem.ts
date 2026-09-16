import type { ComboResult } from '../types'

const BONUS_BY_COUNT: Readonly<Record<number, number>> = { 1: 0, 2: 10, 3: 30, 4: 60, 5: 100 }

const MESSAGE_BY_COUNT: Readonly<Record<number, string>> = {
  2: '双糕出动！',
  3: '三糕撒花！',
  4: '甜甜连击！',
  5: '糕糕大胜利！',
}

/** Counts slices belonging to one drag/gesture, then awards its combo once. */
export class ComboSystem {
  private gestureCount = 0
  private gestureActive = false

  beginGesture(): void {
    this.gestureCount = 0
    this.gestureActive = true
  }

  /** Alias kept for scenes that model a pointer-down as "start". */
  startGesture(): void { this.beginGesture() }

  addSlice(): number {
    if (!this.gestureActive) this.beginGesture()
    this.gestureCount += 1
    return this.gestureCount
  }

  registerSlice(): number { return this.addSlice() }

  endGesture(): ComboResult {
    const count = this.gestureActive ? this.gestureCount : 0
    const tier = Math.min(count, 5)
    const bonusScore = count > 0 ? (BONUS_BY_COUNT[tier] ?? 0) : 0
    const displayMessage = count < 2 ? '' : (MESSAGE_BY_COUNT[tier] ?? '')
    this.gestureCount = 0
    this.gestureActive = false
    return { count, bonusScore, displayMessage }
  }

  reset(): void {
    this.gestureCount = 0
    this.gestureActive = false
  }
}

export const COMBO_BONUSES = BONUS_BY_COUNT
