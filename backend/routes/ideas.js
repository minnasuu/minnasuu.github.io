const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all ideas
router.get('/', async (req, res) => {
  console.log('API Request: GET /api/ideas - Start');
  try {
    const ideas = await prisma.idea.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`API Request: GET /api/ideas - Found ${ideas.length} ideas`);
    res.json(ideas);
  } catch (error) {
    console.error('API Error: Error fetching ideas:', error.message);
    res.status(500).json({ error: 'Failed to fetch ideas', details: error.message });
  }
});

// GET idea by ID
router.get('/:id', async (req, res) => {
  console.log(`API Request: GET /api/ideas/${req.params.id} - Start`);
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id }
    });
    if (!idea) {
      console.log(`API Request: GET /api/ideas/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Idea not found' });
    }
    console.log(`API Request: GET /api/ideas/${req.params.id} - Found`);
    res.json(idea);
  } catch (error) {
    console.error(`API Error: Error fetching idea ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

// POST create idea
router.post('/', async (req, res) => {
  console.log('API Request: POST /api/ideas - Start');
  try {
    const { 
      name, 
      description, 
      category, 
      weight, 
      image, 
      video, 
      linkUrl,
      useCase,
      group,
      relations 
    } = req.body;
    
    const idea = await prisma.idea.create({
      data: {
        name,
        description,
        category,
        weight: parseInt(weight) || 1,
        image: image || null,
        video: video || null,
        linkUrl: linkUrl || null,
        useCase: useCase || null,
        group: group || null,
        relations: relations || null
      }
    });
    console.log(`API Request: POST /api/ideas - Created idea ${idea.id}`);
    res.json(idea);
  } catch (error) {
    console.error('API Error: Error creating idea:', error);
    res.status(500).json({ error: 'Failed to create idea', details: error.message });
  }
});

// PUT update idea
router.put('/:id', async (req, res) => {
  console.log(`API Request: PUT /api/ideas/${req.params.id} - Start`);
  try {
    const { 
      name, 
      description, 
      category, 
      weight, 
      image, 
      video, 
      linkUrl,
      useCase,
      group,
      relations 
    } = req.body;
    
    // 先检查是否存在
    const existingIdea = await prisma.idea.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingIdea) {
      console.log(`API Request: PUT /api/ideas/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const idea = await prisma.idea.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        category,
        weight: parseInt(weight) || 1,
        image: image === undefined ? null : image,
        video: video === undefined ? null : video,
        linkUrl: linkUrl === undefined ? null : linkUrl,
        useCase: useCase === undefined ? null : useCase,
        group: group === undefined ? null : group,
        relations: relations || null
      }
    });
    console.log(`API Request: PUT /api/ideas/${req.params.id} - Updated`);
    res.json(idea);
  } catch (error) {
    console.error(`API Error: Error updating idea ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update idea', details: error.message });
  }
});

// DELETE idea
router.delete('/:id', async (req, res) => {
  console.log(`API Request: DELETE /api/ideas/${req.params.id} - Start`);
  try {
    // 先检查是否存在
    const existingIdea = await prisma.idea.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingIdea) {
      console.log(`API Request: DELETE /api/ideas/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    await prisma.idea.delete({
      where: { id: req.params.id }
    });
    console.log(`API Request: DELETE /api/ideas/${req.params.id} - Deleted`);
    res.json({ message: 'Idea deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`API Error: Error deleting idea ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
});

// POST add relation to idea
router.post('/:id/relations', async (req, res) => {
  console.log(`API Request: POST /api/ideas/${req.params.id}/relations - Start`);
  try {
    const { targetId, type } = req.body;
    
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id }
    });
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // 验证 targetId 存在
    const targetIdea = await prisma.idea.findUnique({
      where: { id: targetId }
    });
    
    if (!targetIdea) {
      return res.status(404).json({ error: 'Target idea not found' });
    }
    
    const currentRelations = idea.relations || [];
    // 检查是否已存在相同关系
    const exists = currentRelations.some(r => r.targetId === targetId && r.type === type);
    if (exists) {
      return res.status(400).json({ error: 'Relation already exists' });
    }
    
    const updatedRelations = [...currentRelations, { targetId, type }];
    
    const updatedIdea = await prisma.idea.update({
      where: { id: req.params.id },
      data: { relations: updatedRelations }
    });
    
    console.log(`API Request: POST /api/ideas/${req.params.id}/relations - Added relation to ${targetId}`);
    res.json(updatedIdea);
  } catch (error) {
    console.error(`API Error: Error adding relation:`, error);
    res.status(500).json({ error: 'Failed to add relation' });
  }
});

// DELETE relation from idea
router.delete('/:id/relations/:targetId', async (req, res) => {
  console.log(`API Request: DELETE /api/ideas/${req.params.id}/relations/${req.params.targetId} - Start`);
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id }
    });
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const currentRelations = idea.relations || [];
    const updatedRelations = currentRelations.filter(r => r.targetId !== req.params.targetId);
    
    const updatedIdea = await prisma.idea.update({
      where: { id: req.params.id },
      data: { relations: updatedRelations }
    });
    
    console.log(`API Request: DELETE /api/ideas/${req.params.id}/relations/${req.params.targetId} - Removed`);
    res.json(updatedIdea);
  } catch (error) {
    console.error(`API Error: Error removing relation:`, error);
    res.status(500).json({ error: 'Failed to remove relation' });
  }
});

module.exports = router;
