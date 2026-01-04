const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all articles
router.get('/', async (req, res) => {
  console.log('API Request: GET /api/articles - Start');
  try {
    const articles = await prisma.article.findMany({
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

// POST create article (Simple implementation, essentially for the author)
router.post('/', async (req, res) => {
  console.log('API Request: POST /api/articles - Start');
  try {
    const { title, summary, content, publishDate, tags, readTime, coverImage, link, type } = req.body;
    
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
        type: type || 'Engineering'
      }
    });
    console.log(`API Request: POST /api/articles - Created article ${article.id}`);
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
    const { title, summary, content, publishDate, tags, readTime, coverImage, link, type } = req.body;
    
    // 先检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingArticle) {
      console.log(`API Request: PUT /api/articles/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Article not found' });
    }
    
    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: {
        title,
        summary,
        content,
        publishDate: new Date(publishDate),
        tags: tags || [],
        readTime: parseInt(readTime) || 0,
        coverImage,
        link,
        type: type || 'Engineering'
      }
    });
    console.log(`API Request: PUT /api/articles/${req.params.id} - Updated`);
    res.json(article);
  } catch (error) {
    console.error(`API Error: Error updating article ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update article' });
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
