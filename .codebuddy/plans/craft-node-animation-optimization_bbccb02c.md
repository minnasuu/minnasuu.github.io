---
name: craft-node-animation-optimization
overview: 优化 Craft 节点在画布中的漂浮动画（错落有致、参差不齐）和画布移动交互体验（平滑过渡、惯性滑动）。
todos:
  - id: float-anim
    content: 重构节点漂浮动画：在 CraftNode.tsx 新增 animIndex prop 并输出 CSS 自定义属性，在 CraftsPage.scss 中定义 3 组差异化 keyframes 并通过 CSS 变量控制延迟/周期/幅度，在 CraftsPage.tsx 渲染节点时传入 animIndex
    status: completed
  - id: inertia
    content: 实现画布拖拽惯性效果：在 CraftsPage.tsx 中新增速度追踪逻辑（记录最近几帧位移），mouseUp 时启动 rAF 惯性衰减循环，mouseDown/wheel 时中断惯性，移除拖拽时的 CSS transition
    status: completed
---

## 用户需求

优化 Craft 节点在画布中的漂浮动画和画布移动交互体验。

## 产品概述

Craft 画布是一个展示作品节点的力导向布局画布，用户可以拖拽/滚轮平移浏览。当前所有节点使用完全相同的浮动动画参数，导致视觉上齐刷刷地同步上下运动，缺乏生命感。需要让节点漂浮动画错落有致，同时优化画布移动交互的流畅性。

## 核心功能

1. **节点漂浮动画错落有致**：每个节点拥有不同的动画延迟、周期、幅度和运动轨迹，形成自然、有机的漂浮效果，像水面上的浮叶一样错落起伏
2. **画布移动交互优化**：为拖拽松手后和滚轮滑动增加惯性衰减效果，让画布移动更丝滑自然，而非立即停止

## 技术栈

- 前端框架：React + TypeScript
- 样式：SCSS
- 动画方式：CSS animation + 内联 style（animation-delay / 自定义属性）
- 惯性物理：requestAnimationFrame + 速度衰减

## 实现方案

### 一、节点漂浮动画错落有致

**当前问题**：所有节点共享同一个 `animation: float 6s ease-in-out infinite`，没有延迟差异，导致所有节点同步浮动。

**方案**：通过节点索引为每个节点生成差异化的动画参数，传入 CraftNode 组件，利用 CSS 自定义属性（CSS Variables）驱动错落效果：

1. **多种漂浮 keyframes**：定义 3 组不同运动轨迹的 keyframes（纯 Y 轴、椭圆轨迹、微旋转），节点根据索引选择不同动画
2. **差异化参数**：每个节点基于索引计算不同的 `animation-delay`（0~-6s 错开）、`animation-duration`（5s~8s 随机周期）、浮动幅度（通过 CSS 变量 `--float-y` 控制）
3. **传参方式**：在 CraftsPage 渲染节点时计算 `animIndex`（节点在列表中的索引），传给 CraftNode，CraftNode 在外层 div 的 style 中设置 CSS 自定义属性

**关键决策**：

- 使用 CSS 自定义属性而非动态生成 className，避免大量动态类名和样式膨胀
- 基于节点索引确定性计算参数（不用 Math.random），保证每次渲染结果一致、无闪烁
- 保持现有 hover/active 时的 transform 效果不受影响，浮动动画作用在外层包裹上

### 二、画布移动惯性效果

**当前问题**：拖拽松手后画布立即停止，滚轮操作也是即时响应无惯性，体验生硬。

**方案**：在 mouseUp 时记录拖拽末速度，用 requestAnimationFrame 驱动惯性衰减动画：

1. **速度追踪**：在 mouseMove 中记录最近几帧的位移，计算松手瞬间的速度向量
2. **惯性滑动**：mouseUp 时启动 rAF 循环，每帧将速度乘以衰减系数（0.92），叠加到 viewOffset，直到速度低于阈值停止
3. **中断惯性**：新的 mouseDown 或滚轮事件立即中断正在进行的惯性动画
4. **移除 canvas-container 的 CSS transition**：拖拽时 transition 会造成延迟跟手感，改为无 transition（拖拽时）+ 惯性动画接管

**性能考量**：

- 惯性动画使用 rAF + useRef 存储速度/动画帧 ID，避免在 state 上高频 setState
- 速度追踪仅保留最后 3 帧，计算量极小
- 惯性衰减系数 0.92 + 阈值 0.5px/frame，约 30 帧（~0.5s）内自然停止

## 实现注意事项

- **浮动动画与 hover transform 冲突**：当前 `.craft-node` 的 float 动画和 hover 的 `transform: scale(1.08) translateY(-4px)` 都作用于同一元素。解决方案：将浮动动画应用在 `.craft-node` 上（已是如此），hover 效果应用在 `.node-inner` 上（已是如此），两者不冲突
- **编辑模式下保持动画**：漂浮动画在编辑模式下也应保持，不需要特殊处理
- **向后兼容**：不改变节点的定位逻辑和布局算法，仅影响视觉动画
- **惯性与 clampViewOffset 兼容**：惯性动画每帧都经过 clampViewOffset 限制，到达边界自然停止

## 架构设计

### 数据流

```
节点索引(index) → 计算动画参数 → CraftNode props(animIndex) → CSS 自定义属性 → CSS animation 差异化表现
拖拽速度追踪 → mouseUp 触发惯性 → rAF 循环衰减 → setViewOffset → 画布平滑滑动
```

### 模块影响

- `CraftNode.tsx`：新增 `animIndex` prop，在 style 中输出 CSS 自定义属性
- `CraftsPage.tsx`：传递 `animIndex`；新增惯性物理逻辑（速度追踪、rAF 惯性循环）
- `CraftsPage.scss`：重构浮动 keyframes，利用 CSS 变量实现差异化动画

## 目录结构

```
frontend/src/features/crafts/
├── components/
│   └── CraftNode.tsx          # [MODIFY] 新增 animIndex prop，输出 CSS 自定义属性驱动差异化浮动
├── pages/
│   └── CraftsPage.tsx         # [MODIFY] 传递 animIndex；新增拖拽惯性物理逻辑（速度追踪 + rAF 衰减）
└── styles/
    └── CraftsPage.scss        # [MODIFY] 重构浮动动画 keyframes，支持 CSS 变量控制幅度/周期/延迟，新增多组运动轨迹
```

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 在实现前快速确认 CraftNode 的 props 接口、CraftsPage 中节点渲染逻辑和惯性相关的 ref 变量命名，避免与现有代码冲突
- Expected outcome: 确认无命名冲突，获取精确的代码位置用于修改