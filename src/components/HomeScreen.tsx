import type { FC } from 'react'

interface HomeScreenProps {
  bestScore: number
  onStart: () => void
}

const HomeScreen: FC<HomeScreenProps> = ({ bestScore, onStart }) => (
  <main className="sg-screen sg-home-screen" aria-labelledby="sg-home-title">
    <div className="sg-bakery-backdrop" aria-hidden="true">
      <span className="sg-backdrop-window" />
      <span className="sg-backdrop-lantern" />
      <span className="sg-backdrop-cloud sg-backdrop-cloud-one" />
      <span className="sg-backdrop-cloud sg-backdrop-cloud-two" />
    </div>
    <section className="sg-home-panel">
      <div className="sg-brand-row">
        <span className="sg-brand-mark" aria-hidden="true">花</span>
        <span className="sg-kicker">MINI CAKE PATISSERIE</span>
      </div>
      <h1 id="sg-home-title" className="sg-display-title"><span>杀糕</span><em>局</em></h1>
      <p className="sg-roman-title">SHA GAO JU</p>
      <p className="sg-home-lede">今天，切一块最漂亮的糕。</p>

      <div className="sg-home-meta" aria-label={`历史最高分 ${bestScore} 分`}>
        <span className="sg-meta-label">BEST TODAY</span>
        <strong className="sg-score-value">{bestScore.toLocaleString('zh-CN')}</strong>
      </div>

      <button className="sg-button sg-button-primary" type="button" onClick={onStart}>
        开糕
        <span className="sg-button-mark" aria-hidden="true">✦</span>
      </button>
      <p className="sg-key-hint"><kbd>ENTER</kbd> 或轻触开始</p>
    </section>
    <aside className="sg-treats-card" aria-label="今日糕单">
      <span className="sg-meta-label">今日糕单</span>
      <div className="sg-treats-list">
        <span>桂花糕</span><span>绿豆糕</span><span>红糖年糕</span>
        <span>草莓奶油糕</span><span>桃花酥</span><span>月饼</span>
      </div>
    </aside>
    <p className="sg-home-footer">60 秒 · 划动切糕 · 小心糕盘</p>
  </main>
)

export default HomeScreen
