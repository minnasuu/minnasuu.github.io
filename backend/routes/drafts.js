const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all drafts
router.get('/', async (req, res) => {
  console.log('API Request: GET /api/drafts - Start');
  try {
    const drafts = await prisma.draft.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    console.log(`API Request: GET /api/drafts - Found ${drafts.length} drafts`);
    res.json(drafts);
  } catch (error) {
    console.error('API Error: Error fetching drafts:', error.message);
    res.status(500).json({ error: 'Failed to fetch drafts', details: error.message });
  }
});

// GET draft by ID
router.get('/:id', async (req, res) => {
  console.log(`API Request: GET /api/drafts/${req.params.id} - Start`);
  try {
    const draft = await prisma.draft.findUnique({
      where: { id: req.params.id }
    });
    if (!draft) {
      console.log(`API Request: GET /api/drafts/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Draft not found' });
    }
    console.log(`API Request: GET /api/drafts/${req.params.id} - Found`);
    res.json(draft);
  } catch (error) {
    console.error(`API Error: Error fetching draft ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch draft' });
  }
});

// POST create draft
router.post('/', async (req, res) => {
  console.log('API Request: POST /api/drafts - Start');
  try {
    const { title, summary, content, publishDate, tags, readTime, coverImage, link, type } = req.body;
    
    const draft = await prisma.draft.create({
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
    console.log(`API Request: POST /api/drafts - Created draft ${draft.id}`);
    res.json(draft);
  } catch (error) {
    console.error('API Error: Error creating draft:', error);
    res.status(500).json({ error: 'Failed to create draft' });
  }
});

// PUT update draft
router.put('/:id', async (req, res) => {
  console.log(`API Request: PUT /api/drafts/${req.params.id} - Start`);
  try {
    const { title, summary, content, publishDate, tags, readTime, coverImage, link, type } = req.body;
    
    const existingDraft = await prisma.draft.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingDraft) {
      console.log(`API Request: PUT /api/drafts/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Draft not found' });
    }
    
    const draft = await prisma.draft.update({
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
    console.log(`API Request: PUT /api/drafts/${req.params.id} - Updated`);
    res.json(draft);
  } catch (error) {
    console.error(`API Error: Error updating draft ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update draft' });
  }
});

// DELETE draft
router.delete('/:id', async (req, res) => {
  console.log(`API Request: DELETE /api/drafts/${req.params.id} - Start`);
  try {
    const existingDraft = await prisma.draft.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingDraft) {
      console.log(`API Request: DELETE /api/drafts/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Draft not found' });
    }
    
    await prisma.draft.delete({
      where: { id: req.params.id }
    });
    console.log(`API Request: DELETE /api/drafts/${req.params.id} - Deleted`);
    res.json({ message: 'Draft deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`API Error: Error deleting draft ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete draft' });
  }
});

module.exports = router;
