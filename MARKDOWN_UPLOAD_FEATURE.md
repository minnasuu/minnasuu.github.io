# Markdown 文件上传功能说明

## 功能概述

文章编辑器现在支持直接上传 Markdown 文件（`.md` 或 `.markdown`）来创建文章，系统会自动解析文件内容并填充所有相关字段。

## 使用方法

### 1. 访问编辑器
进入文章编辑器页面 (`/editor`)

### 2. 上传 Markdown 文件
- 点击顶部工具栏的 **上传图标** （📤）
- 选择本地的 `.md` 或 `.markdown` 文件
- 系统会自动解析文件内容

### 3. 自动填充
上传成功后，系统会自动填充以下字段：
- 标题
- 摘要
- 正文内容
- 标签
- 发布日期
- 阅读时长
- 封面图片
- 外部链接
- 文章类型

### 4. 编辑和发布
- 检查自动填充的内容
- 根据需要进行调整
- 点击 **发布** 按钮

## Markdown 文件格式

### 基本结构

```markdown
---
title: 文章标题
summary: 文章摘要
tags: [标签1, 标签2, 标签3]
type: tech
date: 2025-12-25
readTime: 5
coverImage: https://example.com/image.jpg
---

# 正文标题

这里是文章正文内容...
```

### Frontmatter 字段说明

| 字段 | 别名 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `title` | - | string | 否 | 文章标题（未设置时使用文件名） |
| `summary` | `description` | string | 否 | 文章摘要 |
| `tags` | - | string[] | 否 | 文章标签，支持数组格式 `[tag1, tag2]` |
| `type` | - | string | 否 | 文章类型：`tech` 或 `essay`（默认：`tech`） |
| `date` | `publishDate` | string | 否 | 发布日期（ISO 格式） |
| `readTime` | `read_time` | number | 否 | 阅读时长（分钟） |
| `coverImage` | `cover`, `image` | string | 否 | 封面图片 URL |
| `link` | `url` | string | 否 | 外部链接 |

### Frontmatter 格式示例

**标准格式**
```yaml
---
title: 我的新文章
summary: 这是一篇关于 React 的文章
tags: [React, JavaScript, 前端开发]
type: tech
date: 2025-12-25
readTime: 10
coverImage: https://example.com/cover.jpg
link: https://example.com/original-post
---
```

**简化格式**
```yaml
---
title: 快速开始
tags: [Tutorial, Guide]
date: 2025-12-25
---
```

**无 Frontmatter**
如果文件没有 frontmatter，系统会使用默认值，文件名作为标题。

## 技术实现

### 前端实现

1. **文件上传处理**
   - 使用 HTML5 File API 读取文件内容
   - 文件大小限制：10MB
   - 支持的文件扩展名：`.md`, `.markdown`

2. **Frontmatter 解析**
   - 使用正则表达式匹配 YAML frontmatter 块
   - 支持基本的 YAML 语法（键值对、数组）
   - 自动类型转换（字符串、数组）

3. **字段映射**
   - 支持多个字段别名（如 `date` 和 `publishDate`）
   - 智能默认值填充
   - 保留未指定字段的现有值

### 代码位置

文件：`frontend/src/features/articles/pages/ArticleEditorPage.tsx`

关键函数：
- `handleMarkdownUpload()` - 处理文件上传
- `parseFrontmatter()` - 解析 frontmatter

## 示例文件

项目根目录下的 `example-article.md` 包含了一个完整的示例，展示了所有支持的功能。

## 注意事项

1. **文件大小限制**：单个 Markdown 文件不能超过 10MB
2. **文件格式**：仅支持 `.md` 和 `.markdown` 扩展名
3. **Frontmatter 格式**：使用标准的 YAML 格式，三个短横线包裹
4. **标签格式**：支持数组格式 `[tag1, tag2]` 或逗号分隔字符串
5. **日期格式**：建议使用 ISO 格式（YYYY-MM-DD）
6. **图片**：coverImage 需要是完整的 URL 或已上传的图片路径

## 后续优化建议

1. 支持更复杂的 YAML 语法（嵌套对象等）
2. 支持从 Markdown 内容中自动提取摘要
3. 支持批量上传多个文件
4. 支持拖拽上传
5. 集成第三方 YAML 解析库以提高兼容性
6. 支持图片自动上传（解析 Markdown 中的本地图片路径）

## 兼容性

- ✅ 支持标准 Jekyll/Hugo 风格的 frontmatter
- ✅ 支持 Hexo 风格的 frontmatter
- ✅ 支持自定义字段（会被忽略但不会报错）
- ✅ 支持无 frontmatter 的纯 Markdown 文件

## 故障排除

**问题：上传后字段没有填充**
- 检查 frontmatter 格式是否正确（三个短横线包裹）
- 确保字段名拼写正确
- 查看浏览器控制台是否有错误信息

**问题：标签没有正确解析**
- 使用数组格式：`tags: [tag1, tag2, tag3]`
- 或使用逗号分隔：`tags: tag1, tag2, tag3`

**问题：日期格式错误**
- 使用标准格式：`2025-12-25` 或 `2025-12-25T10:00:00Z`
- 避免使用中文或其他格式

## 反馈与支持

如有问题或建议，请在项目中提 Issue。
