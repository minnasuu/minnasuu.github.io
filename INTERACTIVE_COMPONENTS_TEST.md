# 🎉 交互组件功能测试

## 快速测试步骤

### 1. 启动项目
```bash
cd frontend
npm start
```

### 2. 访问编辑器
打开浏览器访问：`http://localhost:3000/editor`

输入编辑器密码（如果需要）

### 3. 插入组件
1. 点击工具栏的 **"插入交互组件"** 按钮（方块图标 📦）
2. 选择一个组件（如"计数器"）
3. 配置属性
4. 点击"插入"

### 4. 查看效果
- **编辑模式**: 显示为 `:::component{...}` 文本
- **预览模式**: 点击编辑器工具栏的眼睛图标，切换到预览，可以看到渲染的交互组件

### 5. 测试示例

在编辑器中粘贴以下内容：

```markdown
# 交互组件测试

这是一个计数器：

:::component{type="counter" label="点击次数" initial="0"}

这是一个成功提示：

:::component{type="alert" type="success" message="恭喜！测试成功"}

这是一个警告提示：

:::component{type="alert" type="warning" message="请注意这个重要信息"}

更多文字内容...
```

### 6. 发布测试
1. 点击"发布"按钮
2. 访问文章详情页查看效果
3. 组件应该正常渲染并可交互

## 自定义组件示例

### 添加一个简单的按钮组件

编辑 `frontend/src/features/articles/components/interactive/index.tsx`:

```typescript
// 1. 创建组件
const SimpleButton: React.FC<{ text?: string; color?: string }> = ({ 
  text = '点击我', 
  color = 'blue' 
}) => {
  const [clicked, setClicked] = React.useState(false);
  
  return (
    <div className="my-4 flex items-center gap-3">
      <button
        onClick={() => setClicked(!clicked)}
        className={\`px-4 py-2 bg-\${color}-500 text-white rounded hover:bg-\${color}-600\`}
      >
        {text}
      </button>
      {clicked && <span className="text-green-600">✓ 已点击</span>}
    </div>
  );
};

// 2. 在 INTERACTIVE_COMPONENTS 中添加
button: {
  id: 'button',
  name: '按钮',
  description: '一个可点击的按钮',
  icon: 'cursor',
  component: SimpleButton,
  defaultProps: {
    text: '点击我',
    color: 'blue',
  },
  propsSchema: {
    text: {
      type: 'string',
      label: '按钮文字',
      default: '点击我',
      placeholder: '输入按钮文字...',
    },
    color: {
      type: 'string',
      label: '颜色',
      default: 'blue',
      placeholder: 'blue, green, red...',
    },
  },
},
```

### 使用自定义按钮

```markdown
:::component{type="button" text="立即体验" color="green"}
```

## 验证清单

- [ ] 能够打开组件选择器
- [ ] 能够选择组件并配置属性
- [ ] 组件标记正确插入到光标位置
- [ ] 预览模式下组件正确渲染
- [ ] 组件可以正常交互（如计数器可以点击）
- [ ] 发布后文章详情页也能正常显示组件
- [ ] 编辑已发布文章时组件标记完整保留
- [ ] 多个组件可以同时存在并独立工作

## 常见问题

### Q: 预览时组件不显示？
A: 确保切换到了预览模式（点击工具栏的眼睛图标）

### Q: 组件显示为文本？
A: 检查语法是否正确：`:::component{type="xxx" ...}`

### Q: 组件无法交互？
A: 确保组件代码正确实现了交互逻辑和状态管理

### Q: 发布后组件消失？
A: 检查 `ArticleMarkdown.tsx` 是否正确集成了组件渲染逻辑

## 性能注意事项

- 建议每篇文章不超过 10 个交互组件
- 复杂组件（如图表）应做防抖处理
- 大量数据应考虑懒加载

## 下一步

查看完整文档：
- `INTERACTIVE_COMPONENTS_GUIDE.md` - 使用指南
- `INTERACTIVE_COMPONENTS_IMPLEMENTATION.md` - 实现细节
