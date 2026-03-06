const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all workflows
router.get('/', async (req, res) => {
  console.log('API Request: GET /api/workflows - Start');
  try {
    const workflows = await prisma.workflow.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`API Request: GET /api/workflows - Found ${workflows.length} workflows`);
    res.json(workflows);
  } catch (error) {
    console.error('API Error: Error fetching workflows:', error.message);
    res.status(500).json({ error: 'Failed to fetch workflows', details: error.message });
  }
});

// GET workflow by ID
router.get('/:id', async (req, res) => {
  console.log(`API Request: GET /api/workflows/${req.params.id} - Start`);
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: req.params.id }
    });
    if (!workflow) {
      console.log(`API Request: GET /api/workflows/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Workflow not found' });
    }
    console.log(`API Request: GET /api/workflows/${req.params.id} - Found`);
    res.json(workflow);
  } catch (error) {
    console.error(`API Error: Error fetching workflow ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

// POST create workflow
router.post('/', async (req, res) => {
  console.log('API Request: POST /api/workflows - Start');
  try {
    const {
      name,
      icon,
      description,
      steps,
      color,
      startTime,
      endTime,
      scheduled,
      scheduledEnabled,
      cron,
      persistent
    } = req.body;

    const workflow = await prisma.workflow.create({
      data: {
        name,
        icon,
        description,
        steps: steps || [],
        color,
        startTime: startTime || null,
        endTime: endTime || null,
        scheduled: scheduled || false,
        scheduledEnabled: scheduledEnabled || false,
        cron: cron || null,
        persistent: persistent || false
      }
    });
    console.log(`API Request: POST /api/workflows - Created workflow ${workflow.id}`);
    res.json(workflow);
  } catch (error) {
    console.error('API Error: Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow', details: error.message });
  }
});

// PUT update workflow
router.put('/:id', async (req, res) => {
  console.log(`API Request: PUT /api/workflows/${req.params.id} - Start`);
  try {
    const {
      name,
      icon,
      description,
      steps,
      color,
      startTime,
      endTime,
      scheduled,
      scheduledEnabled,
      cron,
      persistent
    } = req.body;

    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id: req.params.id }
    });

    if (!existingWorkflow) {
      console.log(`API Request: PUT /api/workflows/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const workflow = await prisma.workflow.update({
      where: { id: req.params.id },
      data: {
        name,
        icon,
        description,
        steps: steps || [],
        color,
        startTime: startTime === undefined ? undefined : (startTime || null),
        endTime: endTime === undefined ? undefined : (endTime || null),
        scheduled: scheduled !== undefined ? scheduled : undefined,
        scheduledEnabled: scheduledEnabled !== undefined ? scheduledEnabled : undefined,
        cron: cron === undefined ? undefined : (cron || null),
        persistent: persistent !== undefined ? persistent : undefined
      }
    });
    console.log(`API Request: PUT /api/workflows/${req.params.id} - Updated`);
    res.json(workflow);
  } catch (error) {
    console.error(`API Error: Error updating workflow ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update workflow', details: error.message });
  }
});

// DELETE workflow
router.delete('/:id', async (req, res) => {
  console.log(`API Request: DELETE /api/workflows/${req.params.id} - Start`);
  try {
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id: req.params.id }
    });

    if (!existingWorkflow) {
      console.log(`API Request: DELETE /api/workflows/${req.params.id} - Not Found`);
      return res.status(404).json({ error: 'Workflow not found' });
    }

    await prisma.workflow.delete({
      where: { id: req.params.id }
    });
    console.log(`API Request: DELETE /api/workflows/${req.params.id} - Deleted`);
    res.json({ message: 'Workflow deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`API Error: Error deleting workflow ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

module.exports = router;
