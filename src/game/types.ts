/** Identifiers shared by the data, scene and UI layers. */
export type CakeId =
  | 'osmanthus'
  | 'mung-bean'
  | 'brown-sugar-rice'
  | 'strawberry-cream'
  | 'peach-blossom'
  | 'mooncake'

export type ParticleType = 'petal' | 'crumb' | 'sugar' | 'cream' | 'spark' | 'moon'

export interface CakeConfig {
  id: CakeId
  name: string
  score: number
  texture: string
  leftTexture: string
  rightTexture: string
  particleType: ParticleType
  weight: number
  scale: number
  hitRadius: number
  colors: readonly [string, string, string]
}

export interface ComboResult {
  count: number
  bonusScore: number
  displayMessage: string
}
