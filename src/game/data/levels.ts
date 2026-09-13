import type { LevelConfig } from '../types'

export const LEVELS: readonly LevelConfig[] = [
  {
    id: 'first-serving',
    durationMs: 60_000,
    maxLives: 3,
    cakeIds: ['osmanthus', 'mung-bean', 'brown-sugar-rice', 'strawberry-cream', 'peach-blossom', 'mooncake'],
    platePenalty: 50,
    difficulty: [
      { untilSecond: 15, interval: 860, minCount: 1, maxCount: 1, hazardChance: 0.1, maxActive: 6 },
      { untilSecond: 30, interval: 700, minCount: 1, maxCount: 2, hazardChance: 0.12, maxActive: 8 },
      { untilSecond: 45, interval: 565, minCount: 1, maxCount: 3, hazardChance: 0.14, maxActive: 10 },
      { untilSecond: Number.POSITIVE_INFINITY, interval: 470, minCount: 2, maxCount: 4, hazardChance: 0.16, maxActive: 13 },
    ],
  },
]

export const DEFAULT_LEVEL = LEVELS[0]
