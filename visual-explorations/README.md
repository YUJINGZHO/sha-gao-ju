# 可爱杀糕局 · Coquette Fantasy Patisserie 视觉探索（历史资料）

> 正式项目唯一视觉规范已迁移至根目录 [`../DESIGN.md`](../DESIGN.md)。本目录只用于回看探索过程，不得作为生产视觉方向来源。

这是一个与正式 React / Phaser 游戏完全隔离的静态视觉探索包。它用于比较早期三种 Art Direction，不会被 Vite 入口、正式 UI、GameScene 或游戏机制引用。

## 快速预览

直接打开 [静态视觉画廊](./index.html)。每张板都使用生成的甜品世界底图，并叠加三种状态的轻量 UI 示意：

- **Home**：世界观、主视觉、开糕入口。
- **Playing / HUD**：保留大面积干净飞行区，只放置小而清晰的分数、时间和生命 HUD。
- **Game Over**：突出战绩、甜点台收工和再次开始动机。

画廊里的文字与状态面板由 HTML 后置叠加，底图本身不依赖生成模型绘制可读文字，方便后续替换成正式 UI。

## 三个方向

### 1. Ribbon Window Patisserie

奶油白、ballet pink、金色细边、窗边晨光和大型缎带。蛋糕架、茶杯、瓷盘、蕾丝与月兔细节组成“被晨光照亮的精品甜品店”。

### 2. Conservatory Tea Garden

淡蓝、奶油、鼠尾草绿与温室玻璃。月洞窗、桂花和桃花枝、青花瓷、茶具与花园景深让场景更轻、更通透。

### 3. Powder Room Dessert Atelier

blush pink、ivory、dusty rose 和香槟金高光。蕾丝、珍珠链、玫瑰、天鹅绒、缎带和多层蛋糕展示台带来更高的 Coquette 装饰密度。

## 文件结构

```text
visual-explorations/
├─ index.html                         # 独立静态画廊，不接入 Vite
├─ README.md
├─ boards/
│  ├─ ribbon-window-portrait.png
│  ├─ ribbon-window-landscape.png
│  ├─ conservatory-tea-portrait.png
│  ├─ conservatory-tea-landscape.png
│  ├─ powder-room-portrait.png
│  └─ powder-room-landscape.png
└─ prompts/
   ├─ ribbon-window.md
   ├─ conservatory-tea.md
   └─ powder-room.md
```

## 隔离说明

- 没有修改 `App.tsx`、HomeScreen、GameHUD、GameOverScreen、GameScene、SliceSystem 或正式 CSS。
- 没有引入生产依赖、路由或运行时代码。
- 参考图只用于提取色彩、材质、光线和装饰语言，没有复用其页面布局、模块顺序或具体构图。
- 这些 PNG、HTML 与 prompts 是历史探索资产；生产实现必须遵循根目录 `DESIGN.md`，不得重新采用旧的 editorial / zine / print / arcade 语义。
