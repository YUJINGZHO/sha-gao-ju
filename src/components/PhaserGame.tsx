import { useEffect, useRef } from 'react'
import { createGame } from '../game/createGame'
import type { GameBridge } from '../game/GameBridge'
import type { LevelConfig } from '../game/types'

interface PhaserGameProps {
  bridge: GameBridge
  level?: LevelConfig
}

export default function PhaserGame({ bridge, level }: PhaserGameProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!parentRef.current) return
    const game = createGame(parentRef.current, bridge, level)
    return () => game.destroy(true)
  }, [bridge, level])

  return <div className="game-canvas" ref={parentRef} aria-label="可爱杀糕局游戏区域" />
}
