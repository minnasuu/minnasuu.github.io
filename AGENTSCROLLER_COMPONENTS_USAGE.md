# AgentScroller 系列组件使用指南

已成功将 AgentScrollerLayout 目录下的 13 个组件导出到交互组件预设中。

## 📦 新增组件列表

### 🔵 AgentScroller 系列（6个）

1. **BlinkOutput** - 闪烁输出
   - 带闪烁光标的逐字输出效果演示
   - 语法：`:::component{type="blinkOutput"}`

2. **AgentScroller1** - Agent滚动1
   - 基础滚动容器，展示历史会话
   - 语法：`:::component{type="agentScroller1"}`

3. **AgentScroller2** - Agent滚动2
   - 问答对话滚动，带打字机效果
   - 语法：`:::component{type="agentScroller2"}`

4. **AgentScroller3** - Agent滚动3
   - 带Markdown渲染的对话滚动
   - 语法：`:::component{type="agentScroller3"}`

5. **AgentScroller4** - Agent滚动4
   - 翻转布局的对话滚动
   - 支持参数：`fix`（固定高度）、`scale`（缩放模式）
   - 语法：`:::component{type="agentScroller4" fix="true" scale="false"}`

6. **AgentScroller5** - Agent滚动5
   - 反向布局的对话滚动，支持自动输出
   - 支持参数：`fix`（固定高度）、`autoOutPut`（自动输出）、`customContent`（自定义内容）
   - 语法：`:::component{type="agentScroller5" autoOutPut="true" customContent="自定义文本"}`

### 🟢 HistoryScroller 系列（5个）

7. **HistoryScroller1** - 历史滚动1
   - 带历史记录加载的对话滚动，支持向上加载更多
   - 语法：`:::component{type="historyScroller1"}`

8. **HistoryScroller2** - 历史滚动2
   - 反向布局的历史对话滚动
   - 支持参数：`fix`（固定高度）
   - 语法：`:::component{type="historyScroller2" fix="false"}`

9. **HistoryScroller3** - 历史滚动3
   - 翻转布局的历史对话滚动
   - 支持参数：`fix`（固定高度）
   - 语法：`:::component{type="historyScroller3" fix="false"}`

10. **HistoryScrollerDemo1** - 历史滚动Demo1
    - 简单的历史记录加载示例（正向）
    - 语法：`:::component{type="historyScrollerDemo1"}`

11. **HistoryScrollerDemo2** - 历史滚动Demo2
    - 简单的历史记录加载示例（反向）
    - 语法：`:::component{type="historyScrollerDemo2"}`

### 🟡 FixScroller 系列（2个）

12. **FixScroller1** - 固定滚动1
    - 可展开/收起的思考过程节点，带滚动位置修正
    - 支持参数：`fix`（修正滚动位置）
    - 语法：`:::component{type="fixScroller1" fix="true"}`

13. **FixScroller2** - 固定滚动2
    - 简单的展开/收起节点
    - 语法：`:::component{type="fixScroller2"}`

## 🎯 使用方法

### 方式1：通过编辑器UI插入

1. 点击工具栏的 **"插入交互组件"** 按钮（📦 图标）
2. 在弹出的组件选择器中选择对应的组件
3. 配置组件参数（如有）
4. 点击"插入"按钮

### 方式2：手动编写语法

在 Markdown 编辑器中直接输入组件语法：

```markdown
# 文章标题

这是一段普通文字。

:::component{type="agentScroller2"}

这是另一段文字。

:::component{type="historyScroller1"}

## 使用带参数的组件

:::component{type="agentScroller5" autoOutPut="true" customContent="自定义内容"}

:::component{type="fixScroller1" fix="true"}
```

## 📝 参数说明

### Boolean 类型参数
- 使用 `"true"` 或 `"false"` 字符串
- 示例：`fix="true"`

### String 类型参数
- 直接用引号包裹
- 示例：`customContent="这是自定义内容"`

### Number 类型参数
- 直接使用数字字符串
- 示例：`initial="0"`

## 🎨 组件特点

### AgentScroller 系列
- 专注于 AI 对话界面的滚动交互
- 支持打字机效果、Markdown 渲染
- 多种布局方式（正向、反向、翻转）

### HistoryScroller 系列
- 历史记录懒加载功能
- 向上滚动自动加载更多
- 保持滚动位置的智能处理

### FixScroller 系列
- 可展开/收起的内容节点
- 滚动位置自动修正
- 适合展示思考过程等需要折叠的内容

## 💡 使用建议

1. **AgentScroller2** 和 **AgentScroller3** 适合展示 AI 对话效果
2. **HistoryScroller1** 适合展示完整的对话历史功能
3. **FixScroller1** 适合展示 AI 思考过程的展开/收起效果
4. **BlinkOutput** 适合简单的打字机效果演示
5. **Demo 系列** 适合简单的交互原理演示

## 🔧 技术细节

所有组件已注册在 `frontend/src/features/articles/components/interactive/index.tsx` 中，支持：

- ✅ 编辑器预览实时渲染
- ✅ 文章详情页正常显示
- ✅ 组件状态管理
- ✅ 自动清理（unmount）
- ✅ Props 类型验证

## 🚀 快速开始

在文章编辑器中试试：

```markdown
# AI 对话演示

下面是一个 AI 对话的演示效果：

:::component{type="agentScroller2"}

这个组件会自动演示一个问答对话过程。
```

保存后，在预览区和发布后的文章中都能看到交互效果！
