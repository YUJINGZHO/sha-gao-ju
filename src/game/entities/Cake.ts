import Phaser from 'phaser'
import type { CakeConfig } from '../data/cakes'

export class Cake extends Phaser.Physics.Arcade.Sprite {
  readonly config: CakeConfig
  readonly hitRadius: number
  isSliced = false

  constructor(scene: Phaser.Scene, x: number, y: number, config: CakeConfig) {
    const texture = scene.textures.exists(config.texture) ? config.texture : 'cake-fallback'
    super(scene, x, y, texture)
    this.config = config
    this.hitRadius = config.hitRadius * config.scale

    scene.add.existing(this)
    scene.physics.add.existing(this)
    // Generated production PNGs are high-resolution; normalize them to the
    // original gameplay footprint so hit radii and spawn rhythm stay intact.
    this.setScale((76 / Math.max(this.width, 1)) * config.scale)
    this.setDepth(10)
    this.setCircle(
      Math.max(12, config.hitRadius),
      Math.max(0, this.width / 2 - config.hitRadius),
      Math.max(0, this.height / 2 - config.hitRadius),
    )
  }
}
