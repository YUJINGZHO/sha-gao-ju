export function addScore(currentScore: number, amount: number): number {
  return Math.max(0, currentScore + amount)
}

export function applyPlatePenalty(currentScore: number, penalty: number): number {
  return addScore(currentScore, -Math.abs(penalty))
}
