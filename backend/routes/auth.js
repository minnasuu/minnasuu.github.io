const express = require('express');
const router = express.Router();

// 密码验证接口
router.post('/verify-editor-password', (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: '请输入密码'
      });
    }

    // 从环境变量获取密码
    const correctPassword = process.env.VITE_EDITOR_PASSWORD || 'minna1125';

    if (password === correctPassword) {
      return res.json({
        success: true,
        message: '验证成功',
        token: 'editor-authenticated' // 可以生成真实的 JWT token
      });
    } else {
      return res.status(401).json({
        success: false,
        message: '密码错误，请重试'
      });
    }
  } catch (error) {
    console.error('密码验证错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

module.exports = router;
