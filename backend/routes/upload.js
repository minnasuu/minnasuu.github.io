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
    cb(null, 'cover-' + uniqueSuffix + ext);
  }
});

// 文件过滤器 - 只允许图片
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'));
  }
};

// 配置 multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  }
});

// POST 上传图片
router.post('/', upload.single('image'), async (req, res) => {
  console.log('API Request: POST /api/upload - Start');
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
});

// DELETE 删除图片（可选）
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
