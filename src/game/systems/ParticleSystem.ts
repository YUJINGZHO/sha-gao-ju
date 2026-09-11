import Phaser from 'phaser'

export type ParticleType = 'crumb' | 'spark' | 'powder' | 'petal' | 'sugar' | 'cream' | 'moon'

const PARTICLE_TEXTURES: Record<ParticleType, string> = {
  crumb: 'particle-crumb',
  spark: 'particle-spark',
  powder: 'particle-powder',
  petal: 'particle-petal',
  sugar: 'particle-sugar',
  cream: 'particle-cream',
  moon: 'particle-moon',
}

export class ParticleSystem {
  private readonly scene: Phaser.Scene
  private readonly emitters = new Set<Phaser.GameObjects.Particles.ParticleEmitter>()

  public constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public burst(x: number, y: number, particleType: ParticleType, intensity = 1): void {
    const texture = PARTICLE_TEXTURES[particleType]
    const count = Math.min(24, Math.max(4, Math.round(8 * Math.max(0.25, intensity))))
    const emitter = this.scene.add.particles(0, 0, texture, {
      emitting: false,
      quantity: count,
      lifespan: { min: 260, max: 560 },
      speed: { min: 45, max: 145 },
      angle: { min: 200, max: 340 },
      gravityY: 170,
      scale: { start: 1, end: 0.15 },
      alpha: { start: 0.9, end: 0 },
      rotate: { min: -180, max: 180 },
      blendMode: Phaser.BlendModes.NORMAL,
    })
    this.emitters.add(emitter)
    emitter.explode(count, x, y)
    this.scene.time.delayedCall(700, () => {
      this.emitters.delete(emitter)
      emitter.destroy()
    })
  }

  public dispose(): void {
    this.emitters.forEach((emitter) => emitter.destroy())
    this.emitters.clear()
  }
}
