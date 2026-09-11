import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import GameOverScreen from './components/GameOverScreen'
import GameHUD from './components/GameHUD'
import HomeScreen from './components/HomeScreen'
import { GameBridge, type HudState } from './game/GameBridge'
import { load, save } from './utils/storage'
import './styles/ui.css'

type AppState = 'MENU' | 'PLAYING' | 'GAME_OVER'

const BEST_SCORE_KEY = 'sha-gao-ju:best-score'
const INITIAL_HUD: HudState = { score: 0, timeLeft: 60, lives: 3 }
const PhaserGame = lazy(() => import('./components/PhaserGame'))

export default function App() {
  const [screen, setScreen] = useState<AppState>('MENU')
  const [bridge, setBridge] = useState(() => new GameBridge())
  const [hud, setHud] = useState(INITIAL_HUD)
  const [finalScore, setFinalScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => load(BEST_SCORE_KEY, 0))
  const [isNewBest, setIsNewBest] = useState(false)

  const startGame = useCallback(() => {
    setHud(INITIAL_HUD)
    setIsNewBest(false)
    setBridge(new GameBridge())
    setScreen('PLAYING')
  }, [])

  useEffect(() => {
    if (screen !== 'PLAYING') return
    const stopHud = bridge.on('hud', setHud)
    const stopGameOver = bridge.on('gameOver', ({ score }) => {
      const nextBest = Math.max(bestScore, score)
      const hasNewBest = score > bestScore
      if (hasNewBest) {
        setBestScore(nextBest)
        save(BEST_SCORE_KEY, nextBest)
      }
      setFinalScore(score)
      setIsNewBest(hasNewBest)
      setScreen('GAME_OVER')
    })
    return () => {
      stopHud()
      stopGameOver()
    }
  }, [bestScore, bridge, screen])

  useEffect(() => {
    if (screen !== 'MENU') return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') startGame()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, startGame])

  return (
    <div className="app-shell">
      {screen === 'MENU' && <HomeScreen bestScore={bestScore} onStart={startGame} />}
      {screen === 'PLAYING' && (
        <main className="game-stage">
          <Suspense fallback={<div className="game-loading">正在摆糕...</div>}>
            <PhaserGame bridge={bridge} />
          </Suspense>
          <GameHUD score={hud.score} timeLeft={hud.timeLeft} lives={hud.lives} />
        </main>
      )}
      {screen === 'GAME_OVER' && (
        <GameOverScreen
          score={finalScore}
          bestScore={bestScore}
          isNewBest={isNewBest}
          onRestart={startGame}
          onHome={() => setScreen('MENU')}
        />
      )}
    </div>
  )
}
