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
    <div className="sg-over-scene" aria-hidden="true" />
    <div className="sg-result-backdrop" aria-hidden="true">
      <span className="sg-result-flower" />
      <span className="sg-result-plate" />
    </div>
    <section className="sg-over-panel sg-result-frame">
      <p className="sg-kicker">甜点台收工</p>
      <h1 id="sg-over-title" className="sg-over-title">这一局，<br />切得很漂亮。</h1>
      <div className="sg-result-stats" aria-label="本局成绩">
        <div className="sg-result-metric sg-result-metric-primary">
          <span className="sg-result-label">本局得分</span>
          <strong>{score.toLocaleString('zh-CN')}</strong>
        </div>
        <div className="sg-result-metric">
          <span className="sg-result-label">历史最高</span>
          <strong>{bestScore.toLocaleString('zh-CN')}</strong>
          {isNewBest && <em className="sg-result-record">新纪录</em>}
        </div>
      </div>
      <p className={isNewBest ? 'sg-result-note sg-result-note-highlight' : 'sg-result-note'}>
        {isNewBest ? '手感正热，把这次记录留在榜首。' : '再来一局，把节奏抢回来。'}
      </p>
      <p className="sg-result-menu-note"><span aria-hidden="true">✿</span> 本局糕单 · 当前关卡</p>
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
