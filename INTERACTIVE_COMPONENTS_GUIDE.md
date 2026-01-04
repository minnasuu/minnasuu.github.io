# 交互组件使用指南

## 功能说明

文章编辑器现已支持插入 React 交互组件，让你的文章更具互动性！

## 使用方法

### 1. 插入组件

1. 点击工具栏的 **"插入交互组件"** 按钮（方块图标）
2. 从组件库中选择你需要的组件
3. 配置组件属性（如标签、初始值等）
4. 点击 **"插入"** 按钮

### 2. 组件语法

组件会以特殊标记的形式插入到 Markdown 中：

```markdown
:::component{type="counter" label="点击次数" initial="0"}
```

### 3. 预览效果

切换到预览模式，组件会自动渲染为可交互的 React 组件。

## 预设组件

### 1. 计数器 (counter)

一个简单的计数器组件，可以增加或减少数值。

**属性：**
- `label`: 标签文字（默认："点击次数"）
- `initial`: 初始值（默认：0）

**示例：**
```markdown
:::component{type="counter" label="我的计数器" initial="10"}
```

### 2. 提示框 (alert)

显示不同类型的提示信息。

**属性：**
- `type`: 类型 - info/warning/error/success（默认："info"）
- `message`: 提示内容（默认："这是一条提示信息"）

**示例：**
```markdown
:::component{type="alert" type="warning" message="注意：这是一条警告信息"}
```

## 添加自定义组件

你可以在 `frontend/src/features/articles/components/interactive/index.tsx` 中添加自己的组件：

```typescript
// 1. 创建组件
const MyComponent: React.FC<{ title?: string }> = ({ title = 'Default' }) => {
  return <div>{title}</div>;
};

// 2. 注册到组件库
export const INTERACTIVE_COMPONENTS: Record<string, ComponentConfig> = {
  myComponent: {
    id: 'myComponent',
    name: '我的组件',
    description: '这是一个自定义组件',
    icon: 'box',
    component: MyComponent,
    defaultProps: {
      title: 'Hello',
    },
    propsSchema: {
      title: {
        type: 'string',
        label: '标题',
        default: 'Hello',
        placeholder: '输入标题...',
      },
    },
  },
  // ... 其他组件
};
```

## 注意事项

1. **组件状态不持久化**：刷新页面后，组件的交互状态会重置
2. **属性限制**：组件属性会被序列化为字符串，复杂对象需要特殊处理
3. **编辑器兼容**：组件标记在编辑模式下显示为文本，预览模式下渲染为组件
4. **发布后可见**：发布的文章会包含组件标记，需要在文章详情页也实现相应的渲染逻辑

## 示例效果

下面是实际的组件示例：

:::component{type="counter" label="尝试点击" initial="0"}

:::component{type="alert" type="info" message="这是一个信息提示框"}

:::component{type="alert" type="success" message="恭喜！操作成功"}

---

更多功能正在开发中...
