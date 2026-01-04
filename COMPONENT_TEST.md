# 交互组件测试文档

## 快速测试

在文章编辑器中粘贴以下内容进行测试：

```markdown
# AgentScroller 系列组件测试

## 1. BlinkOutput - 闪烁输出

:::component{type="blinkOutput"}

---

## 2. AgentScroller1 - 基础滚动

:::component{type="agentScroller1"}

---

## 3. AgentScroller2 - 打字机效果

:::component{type="agentScroller2"}

---

## 4. AgentScroller3 - Markdown 渲染

:::component{type="agentScroller3"}

---

## 5. AgentScroller4 - 翻转布局

### 默认配置
:::component{type="agentScroller4"}

### 启用固定高度
:::component{type="agentScroller4" fix="true"}

### 启用缩放模式
:::component{type="agentScroller4" scale="true"}

---

## 6. AgentScroller5 - 反向布局

### 默认配置
:::component{type="agentScroller5"}

### 自动输出
:::component{type="agentScroller5" autoOutPut="true"}

### 自定义内容
:::component{type="agentScroller5" customContent="这是自定义的对话内容"}

---

# HistoryScroller 系列组件测试

## 7. HistoryScroller1 - 历史记录加载

:::component{type="historyScroller1"}

---

## 8. HistoryScroller2 - 反向布局历史

### 默认配置
:::component{type="historyScroller2"}

### 固定高度
:::component{type="historyScroller2" fix="true"}

---

## 9. HistoryScroller3 - 翻转布局历史

### 默认配置
:::component{type="historyScroller3"}

### 固定高度
:::component{type="historyScroller3" fix="true"}

---

## 10. HistoryScrollerDemo1 - 简单示例（正向）

:::component{type="historyScrollerDemo1"}

---

## 11. HistoryScrollerDemo2 - 简单示例（反向）

:::component{type="historyScrollerDemo2"}

---

# FixScroller 系列组件测试

## 12. FixScroller1 - 展开收起（带修正）

### 默认配置
:::component{type="fixScroller1"}

### 启用滚动修正
:::component{type="fixScroller1" fix="true"}

---

## 13. FixScroller2 - 简单展开收起

:::component{type="fixScroller2"}

---

# 测试完成

以上所有组件都应该能正常渲染和交互。
```

## 测试步骤

1. **打开文章编辑器**
   - 访问 `/editor` 路由
   - 输入编辑器密码（如需要）

2. **复制测试内容**
   - 复制上面的 Markdown 内容
   - 粘贴到编辑器中

3. **查看预览**
   - 切换到预览模式
   - 检查所有组件是否正常渲染

4. **测试交互**
   - 点击各组件的按钮
   - 观察动画效果
   - 测试滚动行为

5. **测试参数**
   - 尝试修改参数值
   - 观察组件行为变化

6. **发布测试**
   - 保存草稿或发布文章
   - 在文章详情页查看效果

## 预期结果

✅ 所有 13 个组件都应该：
- 正常渲染
- 交互功能正常
- 参数配置生效
- 编辑器预览正常
- 文章详情页正常显示

## 常见问题

### Q: 组件不显示
**A**: 检查语法是否正确，确保 `type` 参数值与组件 ID 匹配

### Q: 参数不生效
**A**: 确保参数值用引号包裹，如 `fix="true"` 而不是 `fix=true`

### Q: 预览区空白
**A**: 检查浏览器控制台是否有错误，可能是组件依赖未正确加载

### Q: 发布后组件不显示
**A**: 确认 `ArticleMarkdown` 组件已正确更新，支持交互组件渲染

## 性能测试

建议测试场景：
1. 单页面插入 5-10 个组件
2. 快速切换编辑/预览模式
3. 滚动长文章查看渲染性能
4. 同时打开多个包含组件的文章

## 兼容性测试

测试浏览器：
- ✅ Chrome (最新版)
- ✅ Firefox (最新版)
- ✅ Safari (最新版)
- ✅ Edge (最新版)

测试主题：
- ✅ 亮色模式
- ✅ 暗色模式

---

**测试完成后请在此记录结果** 📝
