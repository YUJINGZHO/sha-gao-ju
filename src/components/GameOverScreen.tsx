import type { FC } from 'react'

interface GameOverScreenProps {
  score: number
  bestScore: number
  isNewBest: boolean
  onRestart: () => void
  onHome: () => void
}

const GameOverScreen: FC<GameOverScreenProps> = ({ score, bestScore, isNewBest, onRestart, onHome }) => (
  <main className="sg-screen sg-game-over" aria-labelledby="sg-over-title">
    <div className="sg-result-backdrop" aria-hidden="true">
      <span className="sg-result-flower" />
      <span className="sg-result-plate" />
    </div>
    <section className="sg-over-panel">
      <p className="sg-kicker">甜点台收工</p>
      <h1 id="sg-over-title" className="sg-over-title">今天的手感，<br />很好吃。</h1>
      <div className="sg-result-score">
        <span className="sg-meta-label">本局得分</span>
        <strong>{score.toLocaleString('zh-CN')}</strong>
      </div>
      <div className="sg-result-best">
        <span>{isNewBest ? '新纪录' : '历史最高'}</span>
        <strong>{bestScore.toLocaleString('zh-CN')}</strong>
      </div>
      <p className={isNewBest ? 'sg-result-note sg-result-note-highlight' : 'sg-result-note'}>
        {isNewBest ? '手感正热，把这次记录留在榜首。' : '再来一局，把节奏抢回来。'}
      </p>
      <div className="sg-action-row">
        <button className="sg-button sg-button-primary" type="button" onClick={onRestart}>
          再来一局 <span className="sg-button-mark" aria-hidden="true">✦</span>
        </button>
        <button className="sg-button sg-button-quiet" type="button" onClick={onHome}>
          返回首页
        </button>
      </div>
    </section>
  </main>
)

export default GameOverScreen
