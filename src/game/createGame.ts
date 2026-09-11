import Phaser from 'phaser'
import type { GameBridge } from './GameBridge'
import { GameScene } from './GameScene'

export function createGame(parent: HTMLElement, bridge: GameBridge): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#f2e9cf',
    transparent: false,
    antialias: true,
    render: { roundPixels: false, powerPreference: 'high-performance' },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: parent.clientWidth,
      height: parent.clientHeight,
    },
    input: { activePointers: 2 },
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 920 }, debug: false },
    },
    scene: [new GameScene(bridge)],
  })
}
