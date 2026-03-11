const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all articles (supports ?isDraft=true/false filter)
router.get('/', async (req, res) => {
  const isDraftParam = req.query.isDraft;
  const filter = {};
  if (isDraftParam !== undefined) {
    filter.isDraft = isDraftParam === 'true';
  }

  console.log(`API Request: GET /api/articles - Start (filter: ${JSON.stringify(filter)})`);
  try {
    const articles = await prisma.article.findMany({
      where: filter,
      orderBy: { publishDate: 'desc' }
    });
    console.log(`API Request: GET /api/articles - Found ${articles.length} articles`);

    // 尝试先序列化，看看是否会报错
    const jsonStr = JSON.stringify(articles);
    console.log('API Request: GET /api/articles - JSON serialization successful, length:', jsonStr.length);

    res.json(articles);
    console.log('API Request: GET /api/articles - Response sent');
  } catch (error) {
    console.error('API Error: Error fetching articles (Stack):', error.stack);
    console.error('API Error: Error fetching articles (Msg):', error.message);
    // 确保返回 JSON 格式的错误
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch articles', details: error.message });
    }
  }
});

// GET article by ID
router.get('/:id', async (req, res) => {
  console.log(`API Request: GET /api/articles/${req.params.id} - Start`);
  try {
    const article = await prisma.article.findUnique({
      where: { id: req.params.id }
    });
    if (!article) {
        console.log(`API Request: GET /api/articles/${req.params.id} - Not Found`);
        return res.status(404).json({ error: 'Article not found' });
    }
    console.log(`API Request: GET /api/articles/${req.params.id} - Found`);
    res.json(article);
  } catch (error) {
    console.error(`API Error: Error fetching article ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// POST create article
router.post('/', async (req, res) => {
  console.log('API Request: POST /api/articles - Start');
  try {
    const { title, summary, content, publishDate, tags, readTime, coverImage, link, type, isDraft, isAI } = req.body;
    
    const article = await prisma.article.create({
      data: {
        title,
        summary,
        content, // Markdown content
        publishDate: new Date(publishDate),
        tags: tags || [],
        readTime: parseInt(readTime) || 0,
        coverImage,
        link,
        type: type || 'Engineering',
        isDraft: isDraft || false,
        isAI: isAI || false
      }
    });
    console.log(`API Request: POST /api/articles - Created article ${article.id} (isDraft: ${article.isDraft}, isAI: ${article.isAI})`);
    res.json(article);
  } catch (error) {
    console.error('API Error: Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// PUT update article
router.put('/:id', async (req, res) => {
  console.log(`API Request: PUT /api/articles/${req.params.id} - Start`);
  try {
    const { title, summary, content, publishDate, tags, readTime, coverImage, link, type, isDraft, isAI } = req.body;
    
    // 先检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingArticle) {
      console.log(`API Request: PUT /api/articles/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Article not found' });
    }

    const updateData = {
      title,
      summary,
      content,
      publishDate: new Date(publishDate),
      tags: tags || [],
      readTime: parseInt(readTime) || 0,
      coverImage,
      link,
      type: type || 'Engineering'
    };

    // 只有明确传了 isDraft 才更新该字段
    if (isDraft !== undefined) {
      updateData.isDraft = isDraft;
    }

    // 只有明确传了 isAI 才更新该字段
    if (isAI !== undefined) {
      updateData.isAI = isAI;
    }
    
    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: updateData
    });
    console.log(`API Request: PUT /api/articles/${req.params.id} - Updated (isDraft: ${article.isDraft})`);
    res.json(article);
  } catch (error) {
    console.error(`API Error: Error updating article ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// PUT publish a draft (set isDraft to false)
router.put('/:id/publish', async (req, res) => {
  console.log(`API Request: PUT /api/articles/${req.params.id}/publish - Start`);
  try {
    const existingArticle = await prisma.article.findUnique({
      where: { id: req.params.id }
    });

    if (!existingArticle) {
      console.log(`API Request: PUT /api/articles/${req.params.id}/publish - Not Found`);
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: { isDraft: false }
    });
    console.log(`API Request: PUT /api/articles/${req.params.id}/publish - Published`);
    res.json(article);
  } catch (error) {
    console.error(`API Error: Error publishing article ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to publish article' });
  }
});

// DELETE article
router.delete('/:id', async (req, res) => {
  console.log(`API Request: DELETE /api/articles/${req.params.id} - Start`);
  try {
    // 先检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingArticle) {
      console.log(`API Request: DELETE /api/articles/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Article not found' });
    }
    
    await prisma.article.delete({
      where: { id: req.params.id }
    });
    console.log(`API Request: DELETE /api/articles/${req.params.id} - Deleted`);
    res.json({ message: 'Article deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`API Error: Error deleting article ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = router;
