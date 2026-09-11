import { useEffect, useRef } from 'react'
import { createGame } from '../game/createGame'
import type { GameBridge } from '../game/GameBridge'

interface PhaserGameProps {
  bridge: GameBridge
}

export default function PhaserGame({ bridge }: PhaserGameProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!parentRef.current) return
    const game = createGame(parentRef.current, bridge)
    return () => game.destroy(true)
  }, [bridge])

  return <div className="game-canvas" ref={parentRef} aria-label="杀糕局游戏区域" />
}
