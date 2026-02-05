# 视频上传功能修复

## 问题描述
部署后视频上传功能失败。

## 问题原因
后端的 `upload.js` 路由处理存在严重问题：

1. **嵌套的 multer 调用导致请求体被重复消费**
   - 原代码尝试先用 `upload.single('image')` 处理，失败后再用 `upload.single('video')` 处理
   - 但第一次调用已经消费了请求体，第二次调用无法再读取数据

2. **缺乏详细的调试日志**
   - 无法准确定位上传失败的具体原因

## 修复方案

### 1. 重写路由处理逻辑 (`backend/routes/upload.js`)

**修改前**：
```javascript
// 嵌套调用，导致请求体被消费两次
router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (!req.file && !err) {
      upload.single('video')(req, res, (videoErr) => {
        handleUploadResponse(req, res, videoErr);
      });
    } else {
      handleUploadResponse(req, res, err);
    }
  });
});
```

**修改后**：
```javascript
// 使用 fields 方法一次性处理多个字段
router.post('/', (req, res) => {
  const uploadMiddleware = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]);
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    // 检查上传了哪种类型的文件
    let file = null;
    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) {
        file = req.files['image'][0];
      } else if (req.files['video'] && req.files['video'][0]) {
        file = req.files['video'][0];
      }
    }
    
    if (!file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    res.json({
      success: true,
      url: `/uploads/${file.filename}`,
      filename: file.filename
    });
  });
});
```

### 2. 增强文件过滤器日志

```javascript
const fileFilter = (req, file, cb) => {
  console.log(`File filter - Field: ${file.fieldname}, Mimetype: ${file.mimetype}, Original name: ${file.originalname}`);
  
  // 修复扩展名提取问题（去除点号）
  const extname = path.extname(file.originalname).toLowerCase().replace('.', '');
  
  const isImage = allowedImageTypes.test(extname) && file.mimetype.startsWith('image/');
  const isVideo = allowedVideoTypes.test(extname) && file.mimetype.startsWith('video/');

  console.log(`File validation - Extension: ${extname}, isImage: ${isImage}, isVideo: ${isVideo}`);

  if (isImage || isVideo) {
    return cb(null, true);
  } else {
    cb(new Error(`不支持的文件类型。文件: ${file.originalname}, MIME: ${file.mimetype}`));
  }
};
```

## 测试步骤

### 1. 重启后端服务
```bash
cd backend
npm install  # 确保依赖已安装
node index.js
```

### 2. 使用测试脚本验证
```bash
chmod +x test-video-upload.sh
./test-video-upload.sh [BACKEND_URL]
```

### 3. 在前端测试
1. 启动前端应用
2. 进入编辑模式
3. 尝试上传视频文件
4. 检查浏览器控制台和后端日志

## 验证要点

✅ **图片上传**：使用 `image` 字段上传图片文件
✅ **视频上传**：使用 `video` 字段上传视频文件
✅ **文件类型验证**：只允许指定的图片和视频格式
✅ **文件大小限制**：最大 50MB
✅ **错误处理**：清晰的错误提示信息
✅ **日志记录**：详细的上传过程日志

## 支持的文件格式

### 图片
- jpeg/jpg
- png
- gif
- webp

### 视频
- mp4
- webm
- ogg
- mov
- avi
- mkv

## 注意事项

1. **上传目录权限**：确保 `backend/uploads` 目录存在且有写入权限
2. **文件大小限制**：当前限制为 50MB，可在 `upload.js` 中调整
3. **MIME 类型检查**：同时检查文件扩展名和 MIME 类型
4. **生产环境**：建议使用云存储服务（如 OSS、S3）替代本地存储

## 部署注意事项

### Docker 部署
确保在 `docker-compose.yml` 中挂载 uploads 目录：
```yaml
volumes:
  - ./backend/uploads:/app/backend/uploads
```

### Nginx 配置
如果使用 Nginx，确保正确配置了文件上传大小限制：
```nginx
client_max_body_size 50M;
```

## 回滚方案

如果修复导致问题，可以暂时禁用视频上传功能：
1. 在前端隐藏视频上传按钮
2. 使用旧版本的 `upload.js`

## 相关文件

- `backend/routes/upload.js` - 上传路由处理
- `frontend/src/shared/utils/backendClient.ts` - 前端上传API
- `frontend/src/features/ideas/pages/IdeasPage.tsx` - 前端上传UI

## 修复日期
2026-02-05
