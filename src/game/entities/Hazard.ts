import Phaser from 'phaser'

export class Hazard extends Phaser.Physics.Arcade.Sprite {
  public isHit = false
  public readonly hitRadius = 25

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hazard-plate')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCircle(this.hitRadius, 36 - this.hitRadius, 36 - this.hitRadius)
    this.setDepth(4)
    this.setImmovable(true)
    this.setInteractive({ useHandCursor: false })
  }
}
