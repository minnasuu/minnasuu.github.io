const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保 uploads 目录存在
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名：时间戳 + 随机数 + 原始扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    // 根据文件类型决定前缀
    let prefix = 'file-';
    if (file.fieldname === 'image') {
      prefix = 'img-';
    } else if (file.fieldname === 'video') {
      prefix = 'video-';
    }
    cb(null, prefix + uniqueSuffix + ext);
  }
});

// 文件过滤器 - 允许图片和视频
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|webm|ogg|mov|avi|mkv/;
  const extname = path.extname(file.originalname).toLowerCase();
  
  const isImage = allowedImageTypes.test(extname) && file.mimetype.startsWith('image/');
  const isVideo = allowedVideoTypes.test(extname) && file.mimetype.startsWith('video/');

  if (isImage || isVideo) {
    return cb(null, true);
  } else {
    cb(new Error('只允许上传图片 (jpeg, jpg, png, gif, webp) 或视频 (mp4, webm, ogg, mov, avi, mkv) 文件'));
  }
};

// 配置 multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 限制 50MB (视频需要更大空间)
  }
});

// POST 上传图片或视频
router.post('/', (req, res) => {
  // 使用动态字段名处理
  const uploadSingle = upload.single('image') || upload.single('video');
  
  // 先尝试作为 image 上传
  upload.single('image')(req, res, (err) => {
    if (!req.file && !err) {
      // 如果不是 image，尝试作为 video 上传
      upload.single('video')(req, res, (videoErr) => {
        handleUploadResponse(req, res, videoErr);
      });
    } else {
      handleUploadResponse(req, res, err);
    }
  });
});

// 处理上传响应的辅助函数
function handleUploadResponse(req, res, err) {
  console.log('API Request: POST /api/upload - Start');
  
  if (err) {
    console.error('API Error: Upload error:', err);
    return res.status(400).json({ error: err.message });
  }
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    // 返回文件的访问 URL
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log(`API Request: POST /api/upload - File uploaded: ${fileUrl}`);
    
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('API Error: Error uploading file:', error);
    res.status(500).json({ error: '文件上传失败' });
  }
}

// DELETE 删除文件（图片或视频）
router.delete('/:filename', async (req, res) => {
  console.log(`API Request: DELETE /api/upload/${req.params.filename} - Start`);
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件不存在' });
    }

    // 删除文件
    fs.unlinkSync(filePath);
    console.log(`API Request: DELETE /api/upload/${filename} - Deleted`);
    
    res.json({ success: true, message: '文件删除成功' });
  } catch (error) {
    console.error(`API Error: Error deleting file ${req.params.filename}:`, error);
    res.status(500).json({ error: '文件删除失败' });
  }
});

module.exports = router;
