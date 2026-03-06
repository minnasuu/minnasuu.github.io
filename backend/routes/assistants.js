const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all assistants
router.get('/', async (req, res) => {
  console.log('API Request: GET /api/assistants - Start');
  try {
    const assistants = await prisma.assistant.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`API Request: GET /api/assistants - Found ${assistants.length} assistants`);
    res.json(assistants);
  } catch (error) {
    console.error('API Error: Error fetching assistants:', error.message);
    res.status(500).json({ error: 'Failed to fetch assistants', details: error.message });
  }
});

// GET assistant by ID
router.get('/:id', async (req, res) => {
  console.log(`API Request: GET /api/assistants/${req.params.id} - Start`);
  try {
    const assistant = await prisma.assistant.findUnique({
      where: { id: req.params.id }
    });
    if (!assistant) {
      console.log(`API Request: GET /api/assistants/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Assistant not found' });
    }
    console.log(`API Request: GET /api/assistants/${req.params.id} - Found`);
    res.json(assistant);
  } catch (error) {
    console.error(`API Error: Error fetching assistant ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch assistant' });
  }
});

// POST create assistant
router.post('/', async (req, res) => {
  console.log('API Request: POST /api/assistants - Start');
  try {
    const {
      assistantId,
      name,
      role,
      description,
      accent,
      systemPrompt,
      skills,
      item,
      catColors,
      messages
    } = req.body;

    const assistant = await prisma.assistant.create({
      data: {
        assistantId,
        name,
        role,
        description,
        accent,
        systemPrompt,
        skills: skills || [],
        item,
        catColors: catColors || {},
        messages: messages || []
      }
    });
    console.log(`API Request: POST /api/assistants - Created assistant ${assistant.id}`);
    res.json(assistant);
  } catch (error) {
    console.error('API Error: Error creating assistant:', error);
    res.status(500).json({ error: 'Failed to create assistant', details: error.message });
  }
});

// PUT update assistant
router.put('/:id', async (req, res) => {
  console.log(`API Request: PUT /api/assistants/${req.params.id} - Start`);
  try {
    const {
      assistantId,
      name,
      role,
      description,
      accent,
      systemPrompt,
      skills,
      item,
      catColors,
      messages
    } = req.body;

    const existingAssistant = await prisma.assistant.findUnique({
      where: { id: req.params.id }
    });

    if (!existingAssistant) {
      console.log(`API Request: PUT /api/assistants/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Assistant not found' });
    }

    const assistant = await prisma.assistant.update({
      where: { id: req.params.id },
      data: {
        assistantId,
        name,
        role,
        description,
        accent,
        systemPrompt,
        skills: skills || [],
        item,
        catColors: catColors || {},
        messages: messages || []
      }
    });
    console.log(`API Request: PUT /api/assistants/${req.params.id} - Updated`);
    res.json(assistant);
  } catch (error) {
    console.error(`API Error: Error updating assistant ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update assistant', details: error.message });
  }
});

// DELETE assistant
router.delete('/:id', async (req, res) => {
  console.log(`API Request: DELETE /api/assistants/${req.params.id} - Start`);
  try {
    const existingAssistant = await prisma.assistant.findUnique({
      where: { id: req.params.id }
    });

    if (!existingAssistant) {
      console.log(`API Request: DELETE /api/assistants/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Assistant not found' });
    }

    await prisma.assistant.delete({
      where: { id: req.params.id }
    });
    console.log(`API Request: DELETE /api/assistants/${req.params.id} - Deleted`);
    res.json({ message: 'Assistant deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`API Error: Error deleting assistant ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete assistant' });
  }
});

// POST seed initial assistants from frontend mock data
router.post('/seed', async (req, res) => {
  console.log('API Request: POST /api/assistants/seed - Start');
  try {
    const { assistants: assistantData } = req.body;

    if (!Array.isArray(assistantData) || assistantData.length === 0) {
      return res.status(400).json({ error: 'assistants array is required' });
    }

    const results = [];
    for (const a of assistantData) {
      const existing = await prisma.assistant.findUnique({
        where: { assistantId: a.assistantId || a.id }
      });

      if (existing) {
        // 已存在则更新
        const updated = await prisma.assistant.update({
          where: { assistantId: a.assistantId || a.id },
          data: {
            name: a.name,
            role: a.role,
            description: a.description,
            accent: a.accent,
            systemPrompt: a.systemPrompt,
            skills: a.skills || [],
            item: a.item,
            catColors: a.catColors || {},
            messages: a.messages || []
          }
        });
        results.push({ ...updated, action: 'updated' });
      } else {
        // 不存在则创建
        const created = await prisma.assistant.create({
          data: {
            assistantId: a.assistantId || a.id,
            name: a.name,
            role: a.role,
            description: a.description,
            accent: a.accent,
            systemPrompt: a.systemPrompt,
            skills: a.skills || [],
            item: a.item,
            catColors: a.catColors || {},
            messages: a.messages || []
          }
        });
        results.push({ ...created, action: 'created' });
      }
    }

    console.log(`API Request: POST /api/assistants/seed - Processed ${results.length} assistants`);
    res.json({ message: `Seeded ${results.length} assistants`, results });
  } catch (error) {
    console.error('API Error: Error seeding assistants:', error);
    res.status(500).json({ error: 'Failed to seed assistants', details: error.message });
  }
});

module.exports = router;
