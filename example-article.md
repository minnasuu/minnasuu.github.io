---
title: 示例文章：Markdown 上传功能
summary: 这是一篇通过上传 Markdown 文件创建的示例文章
tags: [React, Markdown, 编辑器]
type: tech
date: 2025-12-25
readTime: 5
coverImage: https://images.unsplash.com/photo-1499750310107-5fef28a66643
---

# Markdown 上传功能使用指南

这是一篇通过 **Markdown 文件上传** 功能创建的示例文章。

## 功能特性

### 1. Frontmatter 支持

在 Markdown 文件顶部使用 YAML frontmatter 格式定义文章元数据：

```yaml
---
title: 文章标题
summary: 文章摘要
tags: [标签1, 标签2, 标签3]
type: tech  # 或 essay
date: 2025-12-25
readTime: 5
coverImage: 图片URL
link: 外部链接
---
```

### 2. 自动字段映射

系统会自动将 frontmatter 中的字段映射到文章属性：

- `title` → 标题
- `summary` / `description` → 摘要
- `tags` → 标签（支持数组格式）
- `type` → 类型（tech/essay）
- `date` / `publishDate` → 发布日期
- `readTime` / `read_time` → 阅读时长
- `coverImage` / `cover` / `image` → 封面图片
- `link` / `url` → 外部链接

### 3. 内容解析

Frontmatter 下方的所有内容都会被解析为文章正文，支持完整的 Markdown 语法。

## 使用方法

1. 点击编辑器顶部的 **上传** 按钮（📤 图标）
2. 选择一个 `.md` 或 `.markdown` 文件
3. 系统自动解析并填充所有字段
4. 检查并调整内容后点击 **发布**

## 代码示例

```javascript
// 示例代码块
const greeting = (name) => {
  return `Hello, ${name}!`;
};

console.log(greeting('World'));
```

## 列表示例

- 支持无序列表
- 支持有序列表
- 支持任务列表

1. 第一项
2. 第二项
3. 第三项

## 引用示例

> 这是一段引用文字。
> 可以跨多行显示。

## 总结

Markdown 文件上传功能让文章创建变得更加便捷，特别适合：

- 从其他平台迁移文章
- 批量导入内容
- 使用本地 Markdown 编辑器编写后上传

尽情享受这个新功能吧！🎉
