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
    <div className="sg-artboard sg-game-over-artboard">
      <div className="sg-over-scene" aria-hidden="true" />
      <section className="sg-over-panel sg-result-frame">
        <h1 id="sg-over-title" className="sg-over-title">这局，切得很漂亮。</h1>
        <div className="sg-result-stats" aria-label="本局成绩">
          <div className="sg-result-metric sg-result-metric-primary">
            <span className="sg-result-label">本局得分</span>
            <strong>{score.toLocaleString('zh-CN')}</strong>
          </div>
          <div className="sg-result-metric sg-result-best-metric">
            <span className="sg-result-label">历史最高</span>
            <strong>{bestScore.toLocaleString('zh-CN')}</strong>
            {isNewBest && <em className="sg-result-record">新纪录</em>}
          </div>
        </div>
        <div className="sg-action-row">
          <button className="sg-button sg-button-primary" type="button" onClick={onRestart}>
            再来一局
          </button>
          <button className="sg-button sg-button-quiet" type="button" onClick={onHome}>
            返回首页
          </button>
        </div>
      </section>
    </div>
  </main>
)

export default GameOverScreen
