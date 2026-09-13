# 可爱杀糕局 · Visual Direction

> 这是正式项目唯一的视觉方向来源。`visual-explorations/` 只保存历史探索，不覆盖本文件。

## 核心方向

**中式糕点铺 × Coquette aesthetic**。玩家进入一间被柔和自然光照亮的精品糕点铺：精致迷你糕点是绝对主角，蕾丝、缎带、珍珠、花朵、瓷器、茶具和中式窗棂只作为环境与材质点缀。

禁止回到 editorial / zine / printmaking / ink / paper texture / retro arcade / flat poster / SaaS card 的旧方向。页面要像一个可玩的甜品世界，而不是平面网页。

## 场景基准

- 当前 `public/art/reference-gameplay-portrait.png` 与 `reference-gameplay-landscape.png` 是 Gameplay 背景基准，不重做、不加复杂装饰。
- 背景保持低对比、奶油白与淡 blush 色温、柔焦窗光、软 bokeh 和轻微建筑轮廓。
- 镜内 Gameplay 区必须比外部环境更安静；可操作糕点是镜内最清晰、最容易辨认的物体。
- 保持前景 / 中景 / 背景层次，但不得让装饰性糕点混入玩法区域。

## 糕点资产

六种糕点使用同一位插画师的 soft hand-painted 2.5D 语言：低饱和、粉质/水彩或 gouache 纹理、柔和边缘、奶油高光、暖色 rim light 和轻阴影。资产必须是透明 PNG（后续可替换为 WebP），在实际游戏尺寸仍需保持清晰轮廓。

- 桂花糕：半透明奶黄色方糕、桂花花簇。
- 绿豆糕：淡鼠尾草绿、花形压纹、粉质表面。
- 红糖年糕：焦糖棕、Q 弹高光、黏糯切面。
- 草莓奶油糕：象牙奶油、草莓夹层、粉色裱花。
- 桃花酥：六瓣粉色酥皮、花瓣层次、酥屑反馈。
- 月饼：奶油金色、细腻压纹、月兔/花朵纹样。

所有切割和碰撞逻辑继续由现有 `Cake` / `SliceSystem` 负责；视觉资产不得改变 hit radius、物理参数或计分规则。

## Typography

- `--font-chinese-ui`：`STKaiti`, `Kaiti SC`, `KaiTi`, `Songti SC`, serif。所有中文 UI、HUD label、提示和结算标签统一使用它。
- `--font-display-score`：本地开源 **Bodoni Moda**，回退 `Georgia`, `Times New Roman`, serif。用于分数与少量英文 display，不使用粗重几何 sans、街机字体或手写体。
- `--font-latin-ui`：系统 sans-serif 回退，仅用于极小的功能性英文信息。
- 分数通过字级、留白和优雅衬线获得焦点，不依赖极端字重。

## UI / Game Feel

- HUD 轻量、半透明、悬浮在镜内，不使用大面积白色 pill、统一圆角卡片或 SaaS 仪表盘结构。
- Combo、浮动分数、slash trail、粒子和 screen shake 保持快速、柔和、有甜品材质感。
- Home 与 Game Over 可以使用瓷牌、缎带、雕花边框，但装饰必须服务于层级与可读性。
- 移动端与桌面端都保持足够大的切割区域和清晰的糕点轮廓。

## 工程边界

视觉改动不得重写 React 状态流、Phaser lifecycle、Arcade Physics、pointer gesture、line-segment collision、计分、Combo、生命或 60 秒倒计时。任何新资产都必须通过 manifest / texture key 接入，方便未来替换。
