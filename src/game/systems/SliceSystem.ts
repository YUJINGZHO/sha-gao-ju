import Phaser from 'phaser'
import { segmentIntersectsCircle } from '../math/segmentCircle'

export type SliceTarget = {
  active: boolean
  x: number
  y: number
  hitRadius: number
  kind: 'cake' | 'hazard'
  sliced: boolean
  id: string
}

type TrailPoint = { x: number; y: number; time: number; speed: number }

interface SliceSystemOptions {
  getTargets: () => SliceTarget[]
  onSlice: (target: SliceTarget, angle: number, speed: number) => void
  onGestureEnd: () => void
}

const TRAIL_LIFETIME = 165
const MAX_POINTS = 22
const MIN_SEGMENT = 3

export class SliceSystem {
  private readonly scene: Phaser.Scene
  private readonly trail: Phaser.GameObjects.Graphics
  private readonly options: SliceSystemOptions
  private points: TrailPoint[] = []
  private slicedIds = new Set<string>()
  private isDrawing = false

  constructor(scene: Phaser.Scene, options: SliceSystemOptions) {
    this.scene = scene
    this.options = options
    this.trail = scene.add.graphics().setDepth(100)

    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handleDown, this)
    scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.handleMove, this)
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.handleUp, this)
    scene.input.on(Phaser.Input.Events.GAME_OUT, this.handleGameOut, this)
  }

  update(time: number): void {
    this.points = this.points.filter((point) => time - point.time <= TRAIL_LIFETIME)
    this.drawTrail(time)
  }

  dispose(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.handleDown, this)
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.handleMove, this)
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.handleUp, this)
    this.scene.input.off(Phaser.Input.Events.GAME_OUT, this.handleGameOut, this)
    this.trail.destroy()
  }

  private handleDown(pointer: Phaser.Input.Pointer): void {
    if (!pointer.isDown) return
    this.isDrawing = true
    this.points = [{ x: pointer.worldX, y: pointer.worldY, time: this.scene.time.now, speed: 0 }]
    this.slicedIds.clear()
  }

  private handleMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isDrawing || !pointer.isDown) return
    const previous = this.points[this.points.length - 1]
    if (!previous) return

    const current = { x: pointer.worldX, y: pointer.worldY }
    const distance = Phaser.Math.Distance.Between(previous.x, previous.y, current.x, current.y)
    if (distance < MIN_SEGMENT) return

    const elapsed = Math.max(8, this.scene.time.now - previous.time)
    const speed = distance / elapsed
    const next: TrailPoint = { ...current, time: this.scene.time.now, speed }
    this.points.push(next)
    if (this.points.length > MAX_POINTS) this.points.shift()

    const angle = Phaser.Math.Angle.Between(previous.x, previous.y, next.x, next.y)
    for (const target of this.options.getTargets()) {
      if (!target.active || target.sliced || this.slicedIds.has(target.id)) continue
      if (this.segmentHitsCircle(previous, next, target)) {
        this.slicedIds.add(target.id)
        this.options.onSlice(target, angle, speed)
      }
    }
  }

  private handleUp(): void {
    this.finishGesture()
  }

  private handleGameOut(): void {
    if (this.isDrawing && !this.scene.input.activePointer.isDown) this.finishGesture()
  }

  private finishGesture(): void {
    if (!this.isDrawing) return
    this.isDrawing = false
    this.options.onGestureEnd()
    this.slicedIds.clear()
  }

  private segmentHitsCircle(a: TrailPoint, b: TrailPoint, target: SliceTarget): boolean {
    const speedPadding = Math.min(12, Math.hypot(b.x - a.x, b.y - a.y) * 0.035)
    return segmentIntersectsCircle(a, b, { x: target.x, y: target.y, radius: target.hitRadius }, speedPadding)
  }

  private drawTrail(time: number): void {
    this.trail.clear()
    if (this.points.length < 2) return

    for (let index = 1; index < this.points.length; index += 1) {
      const previous = this.points[index - 1]
      const point = this.points[index]
      const age = Phaser.Math.Clamp((time - point.time) / TRAIL_LIFETIME, 0, 1)
      const alpha = (1 - age) * (index / this.points.length)
      const width = Phaser.Math.Clamp(3 + point.speed * 5.5, 4, 11)

      this.trail.lineStyle(width + 3, 0x263329, alpha * 0.18)
      this.trail.beginPath()
      this.trail.moveTo(previous.x, previous.y)
      this.trail.lineTo(point.x, point.y)
      this.trail.strokePath()

      this.trail.lineStyle(width, 0xfff8df, alpha * 0.95)
      this.trail.beginPath()
      this.trail.moveTo(previous.x, previous.y)
      this.trail.lineTo(point.x, point.y)
      this.trail.strokePath()
    }
  }
}
