const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// 默认简历记录 ID（单条）。如未来要支持多份简历，可改为按用户/路径区分
const DEFAULT_ID = 'default';

// 仅校验/规范化输入，避免数据库存到非预期结构
const sanitize = (body) => {
  const data = body || {};
  return {
    basic: data.basic ?? {},
    selfEvaluation: data.selfEvaluation ?? { bullets: [] },
    education: Array.isArray(data.education) ? data.education : [],
    works: Array.isArray(data.works) ? data.works : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
  };
};

// GET /api/resume —— 取默认简历，没有时返回 404 让前端 fallback
router.get('/', async (_req, res) => {
  try {
    const resume = await prisma.resume.findUnique({ where: { id: DEFAULT_ID } });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// PUT /api/resume —— upsert 默认简历
router.put('/', async (req, res) => {
  try {
    const data = sanitize(req.body);
    const resume = await prisma.resume.upsert({
      where: { id: DEFAULT_ID },
      update: data,
      create: { id: DEFAULT_ID, ...data },
    });
    res.json(resume);
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({
      error: 'Failed to save resume',
      message: error.message,
    });
  }
});

// DELETE /api/resume —— 重置（删除记录），下次 GET 会 404，前端走默认数据
router.delete('/', async (_req, res) => {
  try {
    await prisma.resume.deleteMany({ where: { id: DEFAULT_ID } });
    res.json({ message: 'Resume reset successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to reset resume' });
  }
});

module.exports = router;
