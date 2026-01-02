const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all crafts
router.get('/', async (req, res) => {
  console.log('API Request: GET /api/crafts - Start');
  try {
    const crafts = await prisma.craft.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`API Request: GET /api/crafts - Found ${crafts.length} crafts`);
    res.json(crafts);
  } catch (error) {
    console.error('API Error: Error fetching crafts:', error.message);
    res.status(500).json({ error: 'Failed to fetch crafts', details: error.message });
  }
});

// GET craft by ID
router.get('/:id', async (req, res) => {
  console.log(`API Request: GET /api/crafts/${req.params.id} - Start`);
  try {
    const craft = await prisma.craft.findUnique({
      where: { id: req.params.id }
    });
    if (!craft) {
      console.log(`API Request: GET /api/crafts/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Craft not found' });
    }
    console.log(`API Request: GET /api/crafts/${req.params.id} - Found`);
    res.json(craft);
  } catch (error) {
    console.error(`API Error: Error fetching craft ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch craft' });
  }
});

// POST create craft
router.post('/', async (req, res) => {
  console.log('API Request: POST /api/crafts - Start');
  try {
    const { 
      name, 
      description, 
      category, 
      technologies, 
      featured, 
      weight, 
      coverImage, 
      demoUrl, 
      useCase,
      githubUrl,
      content,
      relations 
    } = req.body;
    
    const craft = await prisma.craft.create({
      data: {
        name,
        description,
        category,
        technologies: technologies || [],
        featured: featured || false,
        weight: parseInt(weight) || 1,
        coverImage,
        demoUrl,
        useCase,
        githubUrl,
        content,
        relations: relations || null
      }
    });
    console.log(`API Request: POST /api/crafts - Created craft ${craft.id}`);
    res.json(craft);
  } catch (error) {
    console.error('API Error: Error creating craft:', error);
    res.status(500).json({ error: 'Failed to create craft', details: error.message });
  }
});

// PUT update craft
router.put('/:id', async (req, res) => {
  console.log(`API Request: PUT /api/crafts/${req.params.id} - Start`);
  try {
    const { 
      name, 
      description, 
      category, 
      technologies, 
      featured, 
      weight, 
      coverImage, 
      demoUrl, 
      useCase,
      githubUrl,
      content,
      relations 
    } = req.body;
    
    // 先检查是否存在
    const existingCraft = await prisma.craft.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingCraft) {
      console.log(`API Request: PUT /api/crafts/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Craft not found' });
    }
    
    const craft = await prisma.craft.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        category,
        technologies: technologies || [],
        featured: featured || false,
        weight: parseInt(weight) || 1,
        coverImage,
        demoUrl,
        useCase,
        githubUrl,
        content,
        relations: relations || null
      }
    });
    console.log(`API Request: PUT /api/crafts/${req.params.id} - Updated`);
    res.json(craft);
  } catch (error) {
    console.error(`API Error: Error updating craft ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update craft', details: error.message });
  }
});

// DELETE craft
router.delete('/:id', async (req, res) => {
  console.log(`API Request: DELETE /api/crafts/${req.params.id} - Start`);
  try {
    // 先检查是否存在
    const existingCraft = await prisma.craft.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingCraft) {
      console.log(`API Request: DELETE /api/crafts/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Craft not found' });
    }
    
    await prisma.craft.delete({
      where: { id: req.params.id }
    });
    console.log(`API Request: DELETE /api/crafts/${req.params.id} - Deleted`);
    res.json({ message: 'Craft deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`API Error: Error deleting craft ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete craft' });
  }
});

// POST add relation to craft
router.post('/:id/relations', async (req, res) => {
  console.log(`API Request: POST /api/crafts/${req.params.id}/relations - Start`);
  try {
    const { targetId, type } = req.body;
    
    const craft = await prisma.craft.findUnique({
      where: { id: req.params.id }
    });
    
    if (!craft) {
      return res.status(404).json({ error: 'Craft not found' });
    }
    
    // 验证 targetId 存在
    const targetCraft = await prisma.craft.findUnique({
      where: { id: targetId }
    });
    
    if (!targetCraft) {
      return res.status(404).json({ error: 'Target craft not found' });
    }
    
    const currentRelations = craft.relations || [];
    // 检查是否已存在相同关系
    const exists = currentRelations.some(r => r.targetId === targetId && r.type === type);
    if (exists) {
      return res.status(400).json({ error: 'Relation already exists' });
    }
    
    const updatedRelations = [...currentRelations, { targetId, type }];
    
    const updatedCraft = await prisma.craft.update({
      where: { id: req.params.id },
      data: { relations: updatedRelations }
    });
    
    console.log(`API Request: POST /api/crafts/${req.params.id}/relations - Added relation to ${targetId}`);
    res.json(updatedCraft);
  } catch (error) {
    console.error(`API Error: Error adding relation:`, error);
    res.status(500).json({ error: 'Failed to add relation' });
  }
});

// DELETE relation from craft
router.delete('/:id/relations/:targetId', async (req, res) => {
  console.log(`API Request: DELETE /api/crafts/${req.params.id}/relations/${req.params.targetId} - Start`);
  try {
    const craft = await prisma.craft.findUnique({
      where: { id: req.params.id }
    });
    
    if (!craft) {
      return res.status(404).json({ error: 'Craft not found' });
    }
    
    const currentRelations = craft.relations || [];
    const updatedRelations = currentRelations.filter(r => r.targetId !== req.params.targetId);
    
    const updatedCraft = await prisma.craft.update({
      where: { id: req.params.id },
      data: { relations: updatedRelations }
    });
    
    console.log(`API Request: DELETE /api/crafts/${req.params.id}/relations/${req.params.targetId} - Removed`);
    res.json(updatedCraft);
  } catch (error) {
    console.error(`API Error: Error removing relation:`, error);
    res.status(500).json({ error: 'Failed to remove relation' });
  }
});

module.exports = router;
