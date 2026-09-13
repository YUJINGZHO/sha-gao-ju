import Phaser from 'phaser'
import { CAKES, type CakeConfig } from '../data/cakes'
import type { CakeId } from '../types'

const SIZE = 76
type Variant = 'whole' | 'left' | 'right'

const toColor = (hex: string): number => Number.parseInt(hex.replace('#', ''), 16)

function ensureTexture(
  scene: Phaser.Scene,
  key: string,
  draw: (graphics: Phaser.GameObjects.Graphics) => void,
  width = SIZE,
  height = SIZE,
): void {
  if (scene.textures.exists(key)) return
  const graphics = scene.add.graphics()
  draw(graphics)
  graphics.generateTexture(key, width, height)
  graphics.destroy()
}

function boxGeometry(variant: Variant): { x: number; width: number; cut: 'none' | 'left' | 'right' } {
  if (variant === 'left') return { x: 8, width: 31, cut: 'right' }
  if (variant === 'right') return { x: 36, width: 31, cut: 'left' }
  return { x: 8, width: 59, cut: 'none' }
}

function drawIsometricBox(
  graphics: Phaser.GameObjects.Graphics,
  cake: CakeConfig,
  variant: Variant,
  kind: 'square' | 'rice' | 'cream',
): void {
  const [base, light, dark] = cake.colors.map(toColor)
  const { x, width, cut } = boxGeometry(variant)
  const topY = kind === 'rice' ? 25 : 17
  const faceY = topY + 9
  const bottomY = kind === 'rice' ? 55 : 61
  const slant = Math.min(8, Math.max(5, width * 0.18))

  graphics.fillStyle(0x9f7b85, 0.16)
  graphics.fillEllipse(x + width / 2 + 3, bottomY + 5, width + 8, 13)

  graphics.fillStyle(base, 1)
  graphics.fillPoints([
    new Phaser.Geom.Point(x, faceY),
    new Phaser.Geom.Point(x + width - slant, faceY),
    new Phaser.Geom.Point(x + width - slant, bottomY),
    new Phaser.Geom.Point(x, bottomY),
  ], true)

  graphics.fillStyle(dark, 0.78)
  graphics.fillPoints([
    new Phaser.Geom.Point(x + width - slant, faceY),
    new Phaser.Geom.Point(x + width, topY),
    new Phaser.Geom.Point(x + width, bottomY - slant),
    new Phaser.Geom.Point(x + width - slant, bottomY),
  ], true)

  graphics.fillStyle(light, 1)
  graphics.fillPoints([
    new Phaser.Geom.Point(x, faceY),
    new Phaser.Geom.Point(x + slant, topY),
    new Phaser.Geom.Point(x + width, topY),
    new Phaser.Geom.Point(x + width - slant, faceY),
  ], true)

  graphics.lineStyle(1, dark, 0.3)
  graphics.strokePoints([
    new Phaser.Geom.Point(x, faceY),
    new Phaser.Geom.Point(x + slant, topY),
    new Phaser.Geom.Point(x + width, topY),
    new Phaser.Geom.Point(x + width, bottomY - slant),
    new Phaser.Geom.Point(x + width - slant, bottomY),
    new Phaser.Geom.Point(x, bottomY),
  ], true)

  if (kind === 'rice') {
    graphics.fillStyle(light, 0.62)
    graphics.fillRect(x + 1, faceY + 10, Math.max(7, width - slant - 2), 7)
    graphics.lineStyle(2, 0xfff5df, 0.52)
    graphics.lineBetween(x + 5, topY + 4, x + width - 10, topY + 4)
    graphics.lineBetween(x + 9, topY + 8, x + width - 14, topY + 8)
  }

  // A restrained highlight keeps the procedural stand-in closer to glazed patisserie icing.
  graphics.fillStyle(0xffffff, 0.2)
  graphics.fillEllipse(x + width * 0.31, topY + 2, Math.max(11, width * 0.42), 5)
  graphics.fillStyle(0xffffff, 0.1)
  graphics.fillEllipse(x + width * 0.2, faceY + 16, Math.max(7, width * 0.18), 10)

  if (kind === 'cream') {
    graphics.fillStyle(0xfff7e9, 0.92)
    graphics.fillRect(x + 1, faceY + 5, Math.max(7, width - slant - 2), 9)
    graphics.fillStyle(base, 0.95)
    graphics.fillRect(x + 1, faceY + 17, Math.max(7, width - slant - 2), 7)
    graphics.fillStyle(0xffe7bd, 0.95)
    graphics.fillRect(x + 1, faceY + 27, Math.max(7, width - slant - 2), 7)
    if (variant === 'whole') {
      graphics.fillStyle(0xfff9f2, 1)
      graphics.fillCircle(27, topY - 1, 7)
      graphics.fillCircle(39, topY - 3, 8)
      graphics.fillCircle(51, topY, 6)
      graphics.fillStyle(dark, 1)
      graphics.fillCircle(40, topY - 4, 4)
      graphics.fillStyle(0x4f7b45, 1)
      graphics.fillTriangle(38, topY - 9, 42, topY - 9, 43, topY - 16)
      graphics.fillStyle(base, 1)
      graphics.fillCircle(48, topY - 1, 3)
    }
  }

  if (kind === 'square') {
    if (cake.id === 'mung-bean' && variant === 'whole') {
      graphics.lineStyle(1, dark, 0.28)
      graphics.strokeEllipse(38, topY + 5, 22, 11)
      graphics.lineBetween(31, topY + 5, 45, topY + 5)
    } else if (cake.id === 'osmanthus' && variant === 'whole') {
      graphics.fillStyle(0xfff8e5, 0.95)
      graphics.fillCircle(27, topY + 2, 3)
      graphics.fillCircle(33, topY - 1, 3)
      graphics.fillCircle(39, topY + 2, 3)
      graphics.fillCircle(33, topY + 5, 3)
      graphics.fillStyle(0xd5aa70, 1)
      graphics.fillCircle(33, topY + 2, 1.6)
    } else {
      graphics.fillStyle(dark, 0.82)
      for (let index = 0; index < 5; index += 1) {
        graphics.fillCircle(x + slant + 5 + (index * 9) % Math.max(10, width - slant - 7), topY + 3 + (index % 2) * 4, 1.6)
      }
    }
  }

  if (cut !== 'none') {
    const cutX = cut === 'right' ? x + width - slant - 2 : x + 2
    graphics.fillStyle(light, 1)
    graphics.fillRect(cutX, faceY + 3, 4, bottomY - faceY - 6)
    graphics.lineStyle(1, dark, 0.46)
    graphics.lineBetween(cutX + 2, faceY + 4, cutX + 2, bottomY - 4)
  }
}

function drawPeachPastry(graphics: Phaser.GameObjects.Graphics, cake: CakeConfig, variant: Variant): void {
  const [base, light, dark] = cake.colors.map(toColor)
  const petals = variant === 'left' ? [2, 3, 4] : variant === 'right' ? [0, 1, 5] : [0, 1, 2, 3, 4, 5]
  graphics.fillStyle(0x9f7b85, 0.14)
  graphics.fillEllipse(39, 61, 58, 15)
  graphics.fillStyle(dark, 0.86)
  petals.forEach((index) => {
    const angle = (Math.PI * 2 * index) / 6
    graphics.fillCircle(39 + Math.cos(angle) * 17, 41 + Math.sin(angle) * 15 + 7, 13)
  })
  graphics.fillStyle(base, 1)
  petals.forEach((index) => {
    const angle = (Math.PI * 2 * index) / 6
    graphics.fillCircle(37 + Math.cos(angle) * 17, 38 + Math.sin(angle) * 15, 13)
  })
  graphics.fillStyle(light, 1)
  graphics.fillCircle(37, 38, variant === 'whole' ? 12 : 9)
  graphics.fillStyle(dark, 0.88)
  graphics.fillCircle(37, 38, 4)
  graphics.lineStyle(1, light, 0.5)
  petals.forEach((index) => {
    const angle = (Math.PI * 2 * index) / 6
    graphics.lineBetween(37, 38, 37 + Math.cos(angle) * 18, 38 + Math.sin(angle) * 15)
  })
  graphics.fillStyle(0xffffff, 0.22)
  graphics.fillEllipse(29, 31, 14, 6)
}

function fillHalfEllipse(
  graphics: Phaser.GameObjects.Graphics,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  left: boolean,
): void {
  const start = left ? Math.PI / 2 : -Math.PI / 2
  const points: Phaser.Geom.Point[] = []
  for (let index = 0; index <= 16; index += 1) {
    const angle = start + (Math.PI * index) / 16
    points.push(new Phaser.Geom.Point(centerX + Math.cos(angle) * radiusX, centerY + Math.sin(angle) * radiusY))
  }
  graphics.fillPoints(points, true)
}

function drawMooncake(graphics: Phaser.GameObjects.Graphics, cake: CakeConfig, variant: Variant): void {
  const [base, light, dark] = cake.colors.map(toColor)
  const left = variant !== 'right'
  const right = variant !== 'left'
  graphics.fillStyle(0x9f7b85, 0.15)
  graphics.fillEllipse(39, 61, variant === 'whole' ? 61 : 34, 13)
  graphics.fillStyle(dark, 1)
  if (variant === 'whole') graphics.fillEllipse(38, 45, 58, 42)
  else fillHalfEllipse(graphics, 38, 45, 29, 21, left)
  graphics.fillStyle(base, 1)
  if (variant === 'whole') graphics.fillEllipse(37, 35, 58, 42)
  else fillHalfEllipse(graphics, 37, 35, 29, 21, left)
  graphics.lineStyle(1, light, 0.58)
  if (variant === 'whole') {
    graphics.strokeEllipse(37, 35, 46, 31)
    graphics.strokeEllipse(37, 35, 21, 14)
    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8
      graphics.lineBetween(37 + Math.cos(angle) * 13, 35 + Math.sin(angle) * 8, 37 + Math.cos(angle) * 21, 35 + Math.sin(angle) * 14)
    }
    graphics.lineStyle(1, light, 0.65)
    graphics.strokeCircle(37, 35, 6)
    graphics.lineBetween(33, 29, 31, 24)
    graphics.lineBetween(41, 29, 43, 24)
  } else {
    graphics.fillStyle(light, 1)
    graphics.fillRect(left ? 35 : 37, 20, 4, 35)
  }
  if (!right && !left) graphics.fillCircle(37, 35, 2)
}

function drawCake(graphics: Phaser.GameObjects.Graphics, cake: CakeConfig, variant: Variant): void {
  const renderers: Record<CakeId, () => void> = {
    osmanthus: () => drawIsometricBox(graphics, cake, variant, 'square'),
    'mung-bean': () => drawIsometricBox(graphics, cake, variant, 'square'),
    'brown-sugar-rice': () => drawIsometricBox(graphics, cake, variant, 'rice'),
    'strawberry-cream': () => drawIsometricBox(graphics, cake, variant, 'cream'),
    'peach-blossom': () => drawPeachPastry(graphics, cake, variant),
    mooncake: () => drawMooncake(graphics, cake, variant),
  }
  renderers[cake.id]()
}

function drawPlate(graphics: Phaser.GameObjects.Graphics): void {
  graphics.fillStyle(0x9f7b85, 0.16)
  graphics.fillEllipse(41, 51, 66, 20)
  graphics.fillStyle(0xc9b7c1, 0.8)
  graphics.fillEllipse(39, 45, 64, 27)
  graphics.fillStyle(0xfffbf2, 1)
  graphics.fillEllipse(37, 35, 64, 47)
  graphics.lineStyle(4, 0x9daec4, 0.95)
  graphics.strokeEllipse(37, 35, 59, 42)
  graphics.lineStyle(2, 0xc39aad, 0.9)
  graphics.strokeEllipse(37, 35, 42, 28)
  graphics.fillStyle(0xc39aad, 1)
  graphics.fillCircle(37, 35, 4)
  for (let index = 0; index < 8; index += 1) {
    const angle = (Math.PI * 2 * index) / 8
    graphics.lineBetween(37, 35, 37 + Math.cos(angle) * 16, 35 + Math.sin(angle) * 10)
  }
  graphics.fillStyle(0xffffff, 0.2)
  graphics.fillEllipse(27, 27, 15, 6)
}

function drawParticle(graphics: Phaser.GameObjects.Graphics, fill: number, shape: 'crumb' | 'spark' | 'powder'): void {
  graphics.fillStyle(fill, 1)
  if (shape === 'spark') {
    graphics.fillTriangle(6, 0, 12, 6, 6, 12)
    graphics.fillTriangle(0, 6, 6, 0, 6, 12)
  } else if (shape === 'powder') graphics.fillCircle(6, 6, 5)
  else graphics.fillRoundedRect(1, 2, 10, 8, 3)
}

export function createPlaceholderTextures(scene: Phaser.Scene): void {
  CAKES.forEach((cake) => {
    // Production PNGs are loaded in GameScene.preload. Only generate the old
    // procedural set when a browser fails to load a cake asset.
    if (scene.textures.exists(cake.texture)) return
    const variants = [['whole', cake.texture], ['left', cake.leftTexture], ['right', cake.rightTexture]] as const
    variants.forEach(([variant, key]) => ensureTexture(scene, key, (graphics) => drawCake(graphics, cake, variant)))
  })
  ensureTexture(scene, 'cake-fallback', (graphics) => {
    graphics.fillStyle(0xe6c98e, 1)
    graphics.fillRoundedRect(10, 15, 56, 46, 7)
  })
  ensureTexture(scene, 'hazard-plate', drawPlate)
  ensureTexture(scene, 'particle-crumb', (graphics) => drawParticle(graphics, 0xc8b47d, 'crumb'), 12, 12)
  ensureTexture(scene, 'particle-spark', (graphics) => drawParticle(graphics, 0xe6bd91, 'spark'), 12, 12)
  ensureTexture(scene, 'particle-powder', (graphics) => drawParticle(graphics, 0xf6e4df, 'powder'), 12, 12)
  ensureTexture(scene, 'particle-petal', (graphics) => drawParticle(graphics, 0xdca7b6, 'powder'), 12, 12)
  ensureTexture(scene, 'particle-sugar', (graphics) => drawParticle(graphics, 0xb77c67, 'crumb'), 12, 12)
  ensureTexture(scene, 'particle-cream', (graphics) => drawParticle(graphics, 0xfff4e8, 'powder'), 12, 12)
  ensureTexture(scene, 'particle-moon', (graphics) => drawParticle(graphics, 0xd8ad68, 'spark'), 12, 12)
}

function createHalfTexture(
  scene: Phaser.Scene,
  sourceKey: string,
  targetKey: string,
  side: 'left' | 'right',
): void {
  if (scene.textures.exists(targetKey)) return
  const sourceTexture = scene.textures.get(sourceKey)
  const source = sourceTexture.getSourceImage() as HTMLImageElement | HTMLCanvasElement
  const width = source.width || (source as HTMLImageElement).naturalWidth
  const height = source.height || (source as HTMLImageElement).naturalHeight
  if (!width || !height) return
  const canvasTexture = scene.textures.createCanvas(targetKey, width, height)
  if (!canvasTexture) return
  const context = canvasTexture.context
  context.clearRect(0, 0, width, height)
  context.save()
  context.beginPath()
  context.rect(side === 'left' ? 0 : width / 2, 0, width / 2, height)
  context.clip()
  context.drawImage(source, 0, 0, width, height)
  context.restore()
  // A slim cream edge suggests the fresh cut without changing the sprite's hitbox.
  context.fillStyle = 'rgba(255, 246, 231, 0.7)'
  context.fillRect(width / 2 - 2, height * 0.2, 4, height * 0.58)
  canvasTexture.refresh()
}

export function createAssetSplitTextures(scene: Phaser.Scene): void {
  CAKES.forEach((cake) => {
    if (!scene.textures.exists(cake.texture)) return
    createHalfTexture(scene, cake.texture, cake.leftTexture, 'left')
    createHalfTexture(scene, cake.texture, cake.rightTexture, 'right')
  })
}
