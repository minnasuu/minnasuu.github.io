# Assistant Page - Vibe Coding 说明文档

## 页面概述

这是一个**猫猫办公室**风格的 AI 助手展示页面。多只不同花色的猫咪坐在各自的办公桌后，扮演不同职能角色（数据分析、邮件、写作、手工、图像生成、管理等），形成一个可爱温暖的虚拟"工作团队"。

---

## 视觉风格

### 整体调性
- **温暖、可爱、日系手绘风**
- 色调以暖白、暖橘、柔粉为主基调
- 圆润感：字体、气泡、铭牌均为圆角设计

### 字体
- **M PLUS Rounded 1c**（Google Fonts），权重 300/500/800
- 圆润的日文/中文友好字体，与猫咪卡通风格统一

### 配色体系
- 背景：暖白色 `#FFFCF7`，配合多层柔和 radial-gradient 光晕
- 文字：棕色系 `#5D4037` / `#555`
- 气泡：暖橙底 `#FFF3E0`，橙色描边 `#FFE0B2`
- 每只猫有独立的 accent 色（蓝、粉、红、绿、蓝紫、暖橙等），影响围裙和桌子配色
- **各猫桌子颜色互不重复**，确保视觉区分度

### 装饰元素
- 页面背景散落猫爪印、小鱼、星星、毛线球、爱心等 SVG 小图标
- 使用 CSS 伪元素 (`::before`/`::after`) 绘制角落处的猫爪印轮廓和彩色散点
- 装饰元素有缓慢浮动动画 (`deco-float`) 和交错淡入效果 (`deco-fade-in`)
- 所有装饰 `pointer-events: none`，不影响交互

---

## 文件结构

```
assistant/
├── components/
│   └── CatSVG.tsx        # 猫咪 SVG 组件（含桌子、身体、头部、爪子等全部绘制）
├── pages/
│   └── AssistantPage.tsx  # 主页面组件（布局、气泡逻辑、装饰渲染）
├── styles/
│   └── AssistantPage.scss # 页面样式（布局、动画、装饰）
├── data.ts                # 所有猫猫助手的配置数据
├── index.ts               # 模块导出
└── VIBE_CODING.md         # 本文件
```

---

## 核心组件说明

### CatSVG.tsx

一个高度可配色的猫咪 SVG 组件，通过 `CatColors` 接口控制所有部位颜色：

| 属性 | 说明 |
|------|------|
| `body` / `bodyDark` | 身体底色 / 深色斑纹 |
| `belly` | 肚子（面部浅色区域） |
| `head` / `headTopLeft` / `headTopRight` | 头部底色 / 左右耳间分区色（多色猫用） |
| `earInner` | 耳朵内侧 |
| `eyes` / `nose` / `blush` | 眼睛 / 鼻子 / 腮红 |
| `faceDark` | 面部深色晕染（高斯模糊） |
| `month` | 嘴巴描边色（留空则用 stroke） |
| `stroke` | 全局描边色 |
| `paw` | 爪垫色，`string` 统一色 或 `string[]` 分别设置 [左脚, 右脚, 左手, 右手] |
| `leg` | 腿/手臂色，同样支持 `string \| string[]` |
| `tail` | 尾巴色 |
| `bodyDarkBottom` | 身体下部斑纹色 |
| `apron` / `apronLight` / `apronLine` | 围裙主色 / 浅色 / 装饰线 |
| `desk` / `deskDark` / `deskLeg` | 桌面 / 桌面深色 / 桌腿 |

### data.ts

导出 `assistants` 数组，每只猫的数据结构：

```ts
{
  id: string;          // 唯一标识，也用于路由跳转判断
  name: string;        // 显示名称
  role: string;        // 角色标签
  description: string; // 功能描述
  accent: string;      // 主题色（CSS 变量 --accent）
  item: string;        // 持有物品类型
  catColors: CatColors; // 完整配色
  messages: string[];  // 气泡台词循环列表
}
```

### AssistantPage.tsx

- **布局**：flex-wrap 网格，`gap: 100px`，最大宽度 1200px 居中
- **气泡系统**：
  - 自动轮播：每只猫按 `BUBBLE_STAGGER_OFFSET`(1200ms) 交错启动，每 `BUBBLE_CYCLE_INTERVAL`(5000ms) 显示一条
  - hover 时立即显示当前消息
  - 气泡有弹性缩放进入动画 (`cubic-bezier`)
- **交互**：hover 时尾巴摇摆动画 (`wag-tail`)，点击跳转对应功能页
- **装饰层**：12 个浮动 SVG 装饰图标，带缓慢上下浮动 + 交错淡入

---

## 添加新猫猫

1. 在 `data.ts` 的 `assistants` 数组中添加新对象
2. 设置独特的 `catColors` 配色（注意桌子颜色与现有猫不重复）
3. 编写 5 条左右的特色台词
4. 如需点击跳转，在 `AssistantPage.tsx` 的 `handleAssistantClick` 中添加路由

### 现有猫猫色系速览

| # | id | 猫种 | 桌子色系 | accent |
|---|-----|------|---------|--------|
| 1 | analytics | 黑猫 | 蓝灰 | `#96BAFF` |
| 2 | email | 橘猫 | 暖灰棕 | `#F2A5B9` |
| 3 | writer | 白猫 | 粉紫 | `#FF6B6B` |
| 4 | crafts | 狸花加白 | 绿色 | `#A0D8B3` |
| 5 | image | 暹罗猫 | 紫色 | `#90CAF9` |
| 6 | manager | 三花猫 | 暖橙 | `#FFB74D` |
| 7 | text | 奶牛猫 | 浅蓝 | `#90CAF9` |
| 8 | sing | 白猫 | 暖黄 | `#90CAF9` |
| 9 | milk | 黑白猫 | 粉红 | `#FFB74D` |

---

## 动画一览

| 动画名 | 用途 | 参数 |
|--------|------|------|
| `wag-tail` | hover 时尾巴摇摆 | 0.6s, ease-in-out, 2次, 0→6°→-6°→0° |
| `deco-float` | 装饰图标缓慢浮动 | 6s, ease-in-out, infinite |
| `deco-fade-in` | 装饰图标交错淡入 | 1s, ease, forwards |

---

## 注意事项

- `paw` 和 `leg` 字段支持 `string | string[]`，数组时按索引对应各爪/各腿
- `faceDark` 使用 SVG feGaussianBlur 实现面部晕染，留空则无效果
- `head` 留空时 fallback 到 `body` 色
- `headTopLeft` / `headTopRight` 留空时 fallback 到 `head` 色（用于三花/双色猫的头顶分区）
- `bodyDarkBottom` 留空时 fallback 到 `bodyDark`（身体下部斑纹）
