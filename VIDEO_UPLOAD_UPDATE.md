# 视频上传功能更新

## 概述
将 Ideas 页面的视频输入从 URL 输入框改为本地文件上传，与图片上传保持一致。

## 修改内容

### 1. 前端 - backendClient.ts
**文件**: `frontend/src/shared/utils/backendClient.ts`

- ✅ 新增 `UploadVideoResponse` 接口
- ✅ 新增 `uploadVideo()` 函数，支持视频文件上传
  - 支持 Mock 模式（转换为 Base64）
  - 调用后端 `/api/upload` 接口
  - 自动处理相对路径转换

### 2. 前端 - IdeasPage.tsx
**文件**: `frontend/src/features/ideas/pages/IdeasPage.tsx`

- ✅ 导入 `uploadVideo` 函数
- ✅ 新增 `videoInputRef` 引用
- ✅ 新增视频上传处理函数：
  - `handleVideoUpload()` - 新建节点时上传视频
  - `handleRemoveVideo()` - 移除视频
  - `handleEditVideoUpload()` - 编辑模式上传视频
  - `handleEditRemoveVideo()` - 编辑模式移除视频
- ✅ 修改 UI：
  - 移除 `LandInput` 文本输入框
  - 添加文件上传组件（点击上传）
  - 视频预览（`<video>` 标签）
  - 删除按钮

### 3. 后端 - upload.js
**文件**: `backend/routes/upload.js`

- ✅ 更新文件名生成逻辑：
  - 图片：`img-{timestamp}-{random}.ext`
  - 视频：`video-{timestamp}-{random}.ext`
- ✅ 更新文件过滤器：
  - 支持图片：`jpeg, jpg, png, gif, webp`
  - **新增视频支持**：`mp4, webm, ogg, mov, avi, mkv`
- ✅ 增加文件大小限制：从 5MB 提升到 **50MB**（适应视频文件）
- ✅ 更新上传路由：支持 `image` 和 `video` 两种字段名

## 使用方式

### 上传视频
1. 点击"预览视频"下方的上传区域
2. 选择视频文件（支持 mp4, webm, ogg, mov, avi, mkv）
3. 自动上传到服务器
4. 显示视频预览

### 删除视频
- 点击视频预览右上角的删除按钮

## 技术细节

### 文件上传流程
```
用户选择视频 → uploadVideo() → FormData → /api/upload → multer处理 
→ 保存到 uploads/ → 返回URL → 更新表单状态 → 显示预览
```

### Mock 模式
- 开发环境支持 Mock 模式
- 视频转换为 Base64 格式
- 模拟 1 秒上传延迟

### 文件限制
- **图片**：最大 5MB
- **视频**：最大 50MB
- 支持的视频格式：mp4, webm, ogg, mov, avi, mkv

## 测试建议

1. **功能测试**：
   - 上传不同格式的视频文件
   - 测试删除功能
   - 测试编辑模式和新建模式

2. **边界测试**：
   - 上传超过 50MB 的文件
   - 上传非视频文件
   - 重复上传相同文件

3. **UI 测试**：
   - 视频预览是否正常显示
   - 上传中状态提示
   - 错误提示

## 部署注意事项

1. 确保 `backend/uploads/` 目录有写入权限
2. 生产环境可能需要配置 CDN 加速视频加载
3. 考虑添加视频转码功能（可选）
4. 监控服务器存储空间

## 未来优化

- [ ] 视频压缩/转码
- [ ] 多视频上传支持
- [ ] 视频缩略图生成
- [ ] 进度条显示
- [ ] CDN 集成
