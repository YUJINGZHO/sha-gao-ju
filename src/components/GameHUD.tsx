import type { FC } from 'react'

interface GameHUDProps {
  score: number
  timeLeft: number
  lives: number
  comboText?: string
}

const GameHUD: FC<GameHUDProps> = ({ score, timeLeft, lives, comboText }) => {
  const safeLives = Math.max(0, Math.min(3, lives))
  const timerClass = timeLeft <= 5 ? 'sg-hud-timer sg-hud-timer-alert' : 'sg-hud-timer'

  return (
    <header className="sg-hud" aria-label="游戏状态">
      <div className="sg-hud-block sg-hud-score-block">
        <span className="sg-hud-label">得分</span>
        <strong className="sg-hud-score">{score.toLocaleString('zh-CN')}</strong>
      </div>

      <div className={timerClass} aria-label={`剩余 ${timeLeft} 秒`}>
        <span className="sg-hud-label">时间</span>
        <strong>{Math.max(0, timeLeft).toString().padStart(2, '0')}<small>s</small></strong>
      </div>

      <div className="sg-hud-block sg-lives-block" aria-label={`剩余 ${safeLives} 条生命`}>
        <span className="sg-hud-label">生命</span>
        <span className="sg-lives" aria-hidden="true">
          {Array.from({ length: 3 }, (_, index) => (
            <span className={index < safeLives ? 'sg-heart sg-heart-active' : 'sg-heart'} key={index}>♥</span>
          ))}
        </span>
      </div>

      {comboText && <span className="sg-combo-text" aria-live="polite">{comboText}</span>}
    </header>
  )
}

export default GameHUD
