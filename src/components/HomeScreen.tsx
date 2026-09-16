import type { FC } from 'react'
import { CAKE_CONFIGS } from '../game/data/cakes'
import type { CakeId } from '../game/types'
import { assetUrl } from '../utils/assets'

interface HomeScreenProps {
  bestScore: number
  onStart: () => void
}

const HOME_MENU_IDS: readonly CakeId[] = [
  'osmanthus',
  'brown-sugar-rice',
  'peach-blossom',
  'mung-bean',
  'strawberry-cream',
  'mooncake',
]

const HOME_MENU_ITEMS = HOME_MENU_IDS.map((id) => ({
  id,
  name: CAKE_CONFIGS[id].name,
  image: assetUrl(`cakes/${id}.png`),
}))

const HomeScreen: FC<HomeScreenProps> = ({ bestScore, onStart }) => (
    <main className="sg-screen sg-home-screen" aria-labelledby="sg-home-title">
    <div className="sg-artboard sg-home-artboard">
      <div className="sg-home-scene" aria-hidden="true" />
      <section className="sg-home-panel">
        <div className="sg-brand-row">
          <span className="sg-kicker">MINI CAKE PATISSERIE</span>
        </div>
        <h1 id="sg-home-title" className="sg-display-title"><span>杀糕</span><em>局</em></h1>
        <p className="sg-roman-title">KE AI SHA GAO JU</p>
        <p className="sg-home-lede">今天，切一块最漂亮的糕。</p>

        <div className="sg-home-meta" aria-label={`历史最高分 ${bestScore} 分`}>
          <img className="sg-score-plaque-art" src={assetUrl('home/home-score-plaque.png')} alt="" aria-hidden="true" />
          <span className="sg-meta-label">BEST SCORE</span>
          <strong className="sg-score-value">{bestScore.toLocaleString('zh-CN')}</strong>
        </div>

        <button className="sg-button sg-button-primary" type="button" onClick={onStart}>
          开糕
        </button>
        <p className="sg-key-hint"><kbd>ENTER</kbd> 或轻触开始</p>
      </section>
      <aside className="sg-treats-card" aria-label="今日糕单">
        <div className="sg-menu-content">
          <div className="sg-menu-heading">
            <strong>今日糕单</strong>
            <span>TODAY'S PATISSERIE</span>
          </div>
          <div className="sg-menu-rule" aria-hidden="true"><i />♡<i /></div>
          <ul className="sg-treats-list">
            {HOME_MENU_ITEMS.map((item) => (
              <li className="sg-menu-item" key={item.id}>
                <img src={item.image} alt="" />
                <span className="sg-menu-item-name">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <p className="sg-home-footer">60 秒 · 划动切糕 · 小心糕盘</p>
    </div>
  </main>
)

export default HomeScreen
