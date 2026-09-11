import type { CakeConfig, CakeId } from '../types'
export type { CakeConfig } from '../types'

/** Static cake tuning. Texture values are Phaser texture keys, not external URLs. */
export const CAKES: readonly CakeConfig[] = [
  { id: 'osmanthus', name: '桂花糕', score: 10, texture: 'cake-osmanthus-whole', leftTexture: 'cake-osmanthus-left', rightTexture: 'cake-osmanthus-right', particleType: 'petal', weight: 1, scale: 0.96, hitRadius: 28, colors: ['#f3dba8', '#fff1d0', '#d5aa70'] },
  { id: 'mung-bean', name: '绿豆糕', score: 10, texture: 'cake-mung-bean-whole', leftTexture: 'cake-mung-bean-left', rightTexture: 'cake-mung-bean-right', particleType: 'crumb', weight: 1.05, scale: 0.94, hitRadius: 27, colors: ['#bddbb6', '#eff8de', '#82a77e'] },
  { id: 'brown-sugar-rice', name: '红糖年糕', score: 10, texture: 'cake-brown-sugar-rice-whole', leftTexture: 'cake-brown-sugar-rice-left', rightTexture: 'cake-brown-sugar-rice-right', particleType: 'sugar', weight: 1.2, scale: 1.02, hitRadius: 31, colors: ['#b87966', '#f0b899', '#7c4a48'] },
  { id: 'strawberry-cream', name: '草莓奶油糕', score: 10, texture: 'cake-strawberry-cream-whole', leftTexture: 'cake-strawberry-cream-left', rightTexture: 'cake-strawberry-cream-right', particleType: 'cream', weight: 0.8, scale: 1, hitRadius: 30, colors: ['#f2a3b8', '#fff9f2', '#c96980'] },
  { id: 'peach-blossom', name: '桃花酥', score: 10, texture: 'cake-peach-blossom-whole', leftTexture: 'cake-peach-blossom-left', rightTexture: 'cake-peach-blossom-right', particleType: 'petal', weight: 0.7, scale: 0.98, hitRadius: 29, colors: ['#e9b6cc', '#fff0f2', '#ad6b91'] },
  { id: 'mooncake', name: '月饼', score: 10, texture: 'cake-mooncake-whole', leftTexture: 'cake-mooncake-left', rightTexture: 'cake-mooncake-right', particleType: 'moon', weight: 0.45, scale: 1.04, hitRadius: 33, colors: ['#e4b866', '#fff0c6', '#9d6b4d'] },
] as const

export const CAKE_CONFIGS: Readonly<Record<CakeId, CakeConfig>> = Object.fromEntries(
  CAKES.map((cake) => [cake.id, cake]),
) as Record<CakeId, CakeConfig>

export function getCakeConfig(id: CakeId): CakeConfig {
  return CAKE_CONFIGS[id]
}
