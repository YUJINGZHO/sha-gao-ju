import Phaser from 'phaser'
import { CAKES, getCakeConfig, type CakeConfig } from './data/cakes'
import { DEFAULT_LEVEL } from './data/levels'
import { AudioSystem } from './audio/AudioSystem'
import { Cake } from './entities/Cake'
import { Hazard } from './entities/Hazard'
import type { GameBridge } from './GameBridge'
import { createAssetSplitTextures, createPlaceholderTextures } from './render/createTextures'
import { ComboSystem } from './systems/ComboSystem'
import { ParticleSystem, type ParticleType } from './systems/ParticleSystem'
import { SliceSystem, type SliceTarget } from './systems/SliceSystem'
import { addScore, applyPlatePenalty } from './systems/scoreRules'
import type { LevelConfig } from './types'
const CHINESE_UI_FONT = 'STKaiti, Kaiti SC, KaiTi, Songti SC, serif'
const DISPLAY_SCORE_FONT = 'Bodoni Moda Variable, Bodoni Moda, Georgia, Times New Roman, serif'

type FlyingObject = Cake | Hazard

export class GameScene extends Phaser.Scene {
  private readonly bridge: GameBridge
  private readonly level: LevelConfig
  private readonly cakes = new Set<Cake>()
  private readonly hazards = new Set<Hazard>()
  private readonly fragments = new Set<Phaser.Physics.Arcade.Image>()
  private readonly targets = new Map<string, FlyingObject>()
  private sliceSystem?: SliceSystem
  private comboSystem?: ComboSystem
  private particleSystem?: ParticleSystem
  private audioSystem?: AudioSystem
  private background?: Phaser.GameObjects.Graphics
  private backgroundImage?: Phaser.GameObjects.Image
  private elapsedMs = 0
  private lastSpawnMs = -700
  private lastShownSecond: number
  private score = 0
  private lives: number
  private objectSequence = 0
  private isEnding = false

  constructor(bridge: GameBridge, level: LevelConfig = DEFAULT_LEVEL) {
    super('game')
    this.bridge = bridge
    this.level = level
    this.lastShownSecond = Math.ceil(level.durationMs / 1000)
    this.lives = level.maxLives
  }

  preload(): void {
    this.load.image('reference-gameplay-portrait', '/art/reference-gameplay-portrait.png')
    this.load.image('reference-gameplay-landscape', '/art/reference-gameplay-landscape.png')
    CAKES.forEach((cake) => {
      this.load.image(cake.texture, `/art/cakes/${cake.id}.png`)
      this.load.image(cake.leftTexture, `/art/cakes/${cake.id}-left.png`)
      this.load.image(cake.rightTexture, `/art/cakes/${cake.id}-right.png`)
    })
    this.load.image('hazard-plate', '/art/cakes/hazard-plate.png')
  }

  create(): void {
    this.physics.world.gravity.y = this.gravityForHeight(this.scale.height)
    createPlaceholderTextures(this)
    createAssetSplitTextures(this)
    this.drawBackground()

    this.comboSystem = new ComboSystem()
    this.particleSystem = new ParticleSystem(this)
    this.audioSystem = new AudioSystem()
    this.sliceSystem = new SliceSystem(this, {
      getTargets: () => this.getSliceTargets(),
      onSlice: (target, angle, speed) => this.handleSlice(target, angle, speed),
      onGestureEnd: () => this.finishGesture(),
    })

    this.input.addPointer(1)
    this.input.setTopOnly(true)
    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.unlockAudio, this)
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.dispose, this)

    this.add.text(this.scale.width / 2, this.scale.height - 42, '按住并快速划过糕点', {
      fontFamily: CHINESE_UI_FONT,
      fontSize: '14px',
      color: '#8f6973',
      backgroundColor: '#fffdf7e8',
      padding: { x: 12, y: 7 },
    }).setOrigin(0.5).setDepth(90).setName('gesture-hint')

    this.time.delayedCall(3200, () => {
      const hint = this.children.getByName('gesture-hint') as Phaser.GameObjects.Text | null
      if (hint) this.tweens.add({ targets: hint, alpha: 0, y: hint.y + 8, duration: 260, onComplete: () => hint.destroy() })
    })

    this.emitHud()
  }

  update(time: number, delta: number): void {
    if (this.isEnding) return

    this.elapsedMs += Math.min(delta, 100)
    this.sliceSystem?.update(time)
    this.cleanupObjects()

    const remainingMs = Math.max(0, this.level.durationMs - this.elapsedMs)
    const shownSecond = Math.ceil(remainingMs / 1000)
    if (shownSecond !== this.lastShownSecond) {
      this.lastShownSecond = shownSecond
      this.emitHud()
    }

    if (remainingMs <= 0) {
      this.endGame('time')
      return
    }

    const difficulty = this.getDifficulty(this.elapsedMs / 1000)
    if (this.elapsedMs - this.lastSpawnMs >= difficulty.interval && this.cakes.size + this.hazards.size < difficulty.maxActive) {
      this.lastSpawnMs = this.elapsedMs
      this.spawnWave(difficulty.minCount, difficulty.maxCount, difficulty.hazardChance)
    }
  }

  private spawnWave(minCount: number, maxCount: number, hazardChance: number): void {
    const count = Phaser.Math.Between(minCount, maxCount)
    const usableWidth = this.scale.width * 0.7
    const baseX = this.scale.width * 0.15
    for (let index = 0; index < count; index += 1) {
      this.time.delayedCall(index * 58, () => {
        if (this.isEnding) return
        const laneNoise = Phaser.Math.FloatBetween(-0.08, 0.08) * this.scale.width
        const laneX = count === 1
          ? Phaser.Math.FloatBetween(baseX, baseX + usableWidth)
          : baseX + usableWidth * ((index + 0.5) / count) + laneNoise
        if (Math.random() < hazardChance && this.hazards.size < 2) this.spawnHazard(laneX)
        else this.spawnCake(laneX)
      })
    }
  }

  private spawnCake(x: number): void {
    const config = this.pickCake()
    const cake = new Cake(this, x, this.scale.height + 45, config)
    const id = `cake-${this.objectSequence += 1}`
    cake.setData('sliceId', id)
    const body = cake.body as Phaser.Physics.Arcade.Body
    const velocity = this.launchVelocity(x)
    body.setVelocity(velocity.x, velocity.y)
    cake.setAngularVelocity(Phaser.Math.Between(-190, 190))
    this.cakes.add(cake)
    this.targets.set(id, cake)
  }

  private spawnHazard(x: number): void {
    const hazard = new Hazard(this, x, this.scale.height + 45)
    const id = `hazard-${this.objectSequence += 1}`
    hazard.setData('sliceId', id)
    const body = hazard.body as Phaser.Physics.Arcade.Body
    const velocity = this.launchVelocity(x)
    body.setVelocity(velocity.x * 0.82, velocity.y * 0.94)
    hazard.setAngularVelocity(Phaser.Math.Between(-130, 130))
    this.hazards.add(hazard)
    this.targets.set(id, hazard)
  }

  private launchVelocity(x: number): Phaser.Math.Vector2 {
    const width = this.scale.width
    const height = this.scale.height
    const inwardBias = x < width * 0.4 ? 65 : x > width * 0.6 ? -65 : 0
    const vx = Phaser.Math.Between(Math.round(-width * 0.16), Math.round(width * 0.16)) + inwardBias
    const minUp = Math.max(570, Math.min(820, height * 0.78))
    const maxUp = Math.max(700, Math.min(980, height * 0.98))
    return new Phaser.Math.Vector2(vx, -Phaser.Math.Between(Math.round(minUp), Math.round(maxUp)))
  }

  private getSliceTargets(): SliceTarget[] {
    return [...this.targets.entries()].map(([id, object]) => {
      if (object instanceof Cake) {
        return { id, kind: 'cake', active: object.active, x: object.x, y: object.y, hitRadius: object.hitRadius, sliced: object.isSliced }
      }
      return { id, kind: 'hazard', active: object.active, x: object.x, y: object.y, hitRadius: object.hitRadius, sliced: object.isHit }
    })
  }

  private handleSlice(target: SliceTarget, angle: number, speed: number): void {
    const object = this.targets.get(target.id)
    if (!object || !object.active || this.isEnding) return

    if (object instanceof Cake) this.sliceCake(object, angle, speed)
    else this.hitHazard(object)
  }

  private sliceCake(cake: Cake, angle: number, speed: number): void {
    if (cake.isSliced) return
    cake.isSliced = true
    const body = cake.body as Phaser.Physics.Arcade.Body
    const velocity = new Phaser.Math.Vector2(body.velocity.x, body.velocity.y)
    const { x, y, rotation, config } = cake
    this.removeCake(cake)

    this.score = addScore(this.score, config.score)
    this.comboSystem?.registerSlice()
    this.createCakeHalves(config, x, y, rotation, velocity, angle)
    this.particleSystem?.burst(x, y, config.particleType as ParticleType, 1 + Math.min(speed, 2) * 0.25)
    this.showFloatingScore(x, y, `+${config.score}`)
    this.cameras.main.shake(58, 0.0015)
    this.audioSystem?.playSlice()
    this.emitHud()
  }

  private createCakeHalves(
    config: CakeConfig,
    x: number,
    y: number,
    rotation: number,
    velocity: Phaser.Math.Vector2,
    slashAngle: number,
  ): void {
    const direction = Math.cos(slashAngle) >= 0 ? 1 : -1
    const texturePairs = [
      { texture: config.leftTexture, side: -1 },
      { texture: config.rightTexture, side: 1 },
    ]

    texturePairs.forEach(({ texture, side }) => {
      const fragment = this.physics.add.image(x + side * 5, y, texture)
      fragment.setScale((76 / Math.max(fragment.width, 1)) * config.scale)
      fragment.setRotation(rotation)
      fragment.setDepth(9)
      fragment.setVelocity(
        velocity.x + side * direction * Phaser.Math.Between(95, 145),
        velocity.y - Phaser.Math.Between(15, 75),
      )
      fragment.setAngularVelocity(side * Phaser.Math.Between(210, 390))
      this.fragments.add(fragment)
    })
  }

  private hitHazard(hazard: Hazard): void {
    if (hazard.isHit) return
    hazard.isHit = true
    const x = hazard.x
    const y = hazard.y
    hazard.setTint(0xd84a35)
    hazard.setVelocity(hazard.body?.velocity.x ?? 0, 160)
    hazard.setAngularVelocity(520)
    this.particleSystem?.burst(x, y, 'spark', 1.6)
    this.score = applyPlatePenalty(this.score, this.level.platePenalty)
    this.showCallout(x, y, `盘子滑倒了\n-${this.level.platePenalty}`, '#a85661')
    this.cameras.main.shake(120, 0.004)
    this.audioSystem?.playHazard()
    this.emitHud()
  }

  private finishGesture(): void {
    if (this.isEnding || !this.comboSystem) return
    const result = this.comboSystem.endGesture()
    if (result.count < 2) return

    this.score = addScore(this.score, result.bonusScore)
    const label = result.bonusScore > 0
      ? `${result.displayMessage}\n连击 x${result.count}  +${result.bonusScore}`
      : `${result.displayMessage}\n连击 x${result.count}`
    this.showCombo(label, result.count)
    this.particleSystem?.burst(this.scale.width / 2, this.scale.height * 0.35, 'spark', Math.min(2.4, result.count * 0.42))
    this.cameras.main.shake(85 + result.count * 18, Math.min(0.006, 0.0015 + result.count * 0.0007))
    this.audioSystem?.playCombo(result.count)
    this.emitHud()
  }

  private showFloatingScore(x: number, y: number, label: string): void {
    const text = this.add.text(x, y, label, {
      fontFamily: DISPLAY_SCORE_FONT,
      fontSize: '22px',
      color: '#7d5a63',
      stroke: '#fffdf7',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(80)
    this.tweens.add({
      targets: text,
      y: y - 56,
      scale: 1.18,
      alpha: 0,
      duration: 540,
      ease: 'Cubic.Out',
      onComplete: () => text.destroy(),
    })
  }

  private showCallout(x: number, y: number, label: string, color: string): void {
    const text = this.add.text(x, y, label, {
      fontFamily: CHINESE_UI_FONT,
      fontSize: `${Math.max(18, Math.min(28, this.scale.width * 0.04))}px`,
      color,
      stroke: '#fffdf7',
      strokeThickness: 6,
      align: 'center',
    }).setOrigin(0.5).setDepth(85).setAngle(-4)
    this.tweens.add({ targets: text, y: y - 80, alpha: 0, duration: 760, ease: 'Back.Out', onComplete: () => text.destroy() })
  }

  private showCombo(label: string, count: number): void {
    const text = this.add.text(this.scale.width / 2, this.scale.height * 0.36, label, {
      fontFamily: DISPLAY_SCORE_FONT,
      fontSize: `${Math.min(48, 25 + count * 4)}px`,
      color: '#a85661',
      stroke: '#fffdf7',
      strokeThickness: 8,
      align: 'center',
      lineSpacing: 7,
    }).setOrigin(0.5).setDepth(86).setScale(0.55).setAngle(Phaser.Math.Between(-3, 3))
    this.tweens.add({
      targets: text,
      scale: 1,
      duration: 180,
      ease: 'Back.Out',
      yoyo: true,
      hold: 360,
      onComplete: () => text.destroy(),
    })
  }

  private cleanupObjects(): void {
    const bottom = this.scale.height + 105
    for (const cake of this.cakes) {
      const body = cake.body as Phaser.Physics.Arcade.Body | null
      if (!cake.active || cake.y <= bottom || !body || body.velocity.y <= 0) continue
      this.removeCake(cake)
      this.audioSystem?.playMiss()
      this.showCallout(Phaser.Math.Clamp(cake.x, 90, this.scale.width - 90), this.scale.height - 100, '糕糕溜走了', '#a85661')
      this.loseLife()
    }

    for (const hazard of this.hazards) {
      if (!hazard.active || hazard.y <= bottom) continue
      this.removeHazard(hazard)
    }

    for (const fragment of this.fragments) {
      if (!fragment.active || fragment.y <= bottom) continue
      this.fragments.delete(fragment)
      fragment.destroy()
    }
  }

  private loseLife(): void {
    if (this.isEnding) return
    this.lives = Math.max(0, this.lives - 1)
    this.emitHud()
    if (this.lives === 0) this.endGame('lives')
  }

  private removeCake(cake: Cake): void {
    this.cakes.delete(cake)
    this.targets.delete(cake.getData('sliceId') as string)
    cake.destroy()
  }

  private removeHazard(hazard: Hazard): void {
    this.hazards.delete(hazard)
    this.targets.delete(hazard.getData('sliceId') as string)
    hazard.destroy()
  }

  private endGame(reason: 'time' | 'lives'): void {
    if (this.isEnding) return
    this.isEnding = true
    this.input.enabled = false
    this.time.delayedCall(180, () => this.bridge.emit('gameOver', { score: this.score, reason }))
  }

  private emitHud(): void {
    this.bridge.emit('hud', { score: this.score, timeLeft: this.lastShownSecond, lives: this.lives })
  }

  private pickCake(): CakeConfig {
    const cakes = this.level.cakeIds.map((id) => getCakeConfig(id))
    const totalWeight = cakes.reduce((sum, cake) => sum + cake.weight, 0)
    let cursor = Math.random() * totalWeight
    for (const cake of cakes) {
      cursor -= cake.weight
      if (cursor <= 0) return cake
    }
    return cakes[cakes.length - 1] ?? CAKES[CAKES.length - 1]
  }

  private getDifficulty(elapsedSeconds: number): LevelConfig['difficulty'][number] {
    return this.level.difficulty.find(({ untilSecond }) => elapsedSeconds < untilSecond)
      ?? this.level.difficulty[this.level.difficulty.length - 1]
  }

  private gravityForHeight(height: number): number {
    return Phaser.Math.Clamp(height * 0.88, 650, 920)
  }

  private unlockAudio(): void {
    this.audioSystem?.unlock()
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height)
    this.physics.world.gravity.y = this.gravityForHeight(gameSize.height)
    this.drawBackground()
  }

  private drawBackground(): void {
    this.background?.destroy()
    this.backgroundImage?.destroy()
    const width = this.scale.width
    const height = this.scale.height
    const backgroundKey = width < height ? 'reference-gameplay-portrait' : 'reference-gameplay-landscape'
    const backgroundImage = this.add.image(width / 2, height / 2, backgroundKey).setOrigin(0.5).setDepth(-25).setAlpha(0.98)
    backgroundImage.setScale(Math.max(width / backgroundImage.width, height / backgroundImage.height))
    this.backgroundImage = backgroundImage
    const graphics = this.add.graphics().setDepth(-20)
    graphics.fillStyle(0xfffaf7, 0.055)
    graphics.fillRect(0, 0, width, height)
    graphics.fillStyle(0xffdbe0, 0.05)
    graphics.fillCircle(width * 0.52, height * 0.48, Math.min(width, height) * 0.34)
    this.background = graphics
  }

  private dispose(): void {
    this.input.off(Phaser.Input.Events.POINTER_DOWN, this.unlockAudio, this)
    this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this)
    this.sliceSystem?.dispose()
    this.particleSystem?.dispose()
    this.audioSystem?.dispose()
  }
}
