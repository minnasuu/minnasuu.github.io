const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// 创建 SMTP transporter（懒初始化）
let transporter = null;

function getTransporter() {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error('SMTP 环境变量未配置 (SMTP_HOST / SMTP_USER / SMTP_PASS)');
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return transporter;
}

/**
 * POST /api/email/send
 * body: { to, subject, html, text? }
 */
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ error: '缺少必填字段: to, subject, html/text' });
    }

    const transport = getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    const info = await transport.sendMail({
      from: `"Minna 猫猫团队 🐱" <${from}>`,
      to,
      subject,
      text: text || '',
      html: html || '',
    });

    console.log(`[email] 邮件已发送 → ${to} (messageId: ${info.messageId})`);

    res.json({
      success: true,
      messageId: info.messageId,
      to,
      subject,
    });
  } catch (err) {
    console.error('[email] 发送失败:', err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
