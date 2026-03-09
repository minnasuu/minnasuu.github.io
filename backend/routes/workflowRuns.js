const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all workflow runs (with pagination & filters)
router.get('/', async (req, res) => {
  try {
    const { limit = '50', offset = '0', agentId, workflowId, status } = req.query;

    const where = {};
    if (agentId) where.agentId = agentId;
    if (workflowId) where.workflowId = workflowId;
    if (status) where.status = status;

    const [runs, total] = await Promise.all([
      prisma.workflowRun.findMany({
        where,
        orderBy: { executedAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.workflowRun.count({ where }),
    ]);

    res.json({ runs, total });
  } catch (error) {
    console.error('Error fetching workflow runs:', error.message);
    res.status(500).json({ error: 'Failed to fetch workflow runs', details: error.message });
  }
});

// POST create a workflow run
router.post('/', async (req, res) => {
  try {
    const { workflowId, workflowName, agentId, skillId, stepIndex, summary, result, status, duration, executedAt } = req.body;

    const run = await prisma.workflowRun.create({
      data: {
        workflowId: workflowId || null,
        workflowName: workflowName || '',
        agentId,
        skillId,
        stepIndex: stepIndex ?? 0,
        summary: summary || '',
        result: result || '',
        status: status || 'success',
        duration: duration ?? null,
        executedAt: executedAt ? new Date(executedAt) : new Date(),
      },
    });
    res.json(run);
  } catch (error) {
    console.error('Error creating workflow run:', error.message);
    res.status(500).json({ error: 'Failed to create workflow run', details: error.message });
  }
});

// POST batch create workflow runs
router.post('/batch', async (req, res) => {
  try {
    const { runs } = req.body;
    if (!Array.isArray(runs) || runs.length === 0) {
      return res.status(400).json({ error: 'runs array is required' });
    }

    const created = await prisma.workflowRun.createMany({
      data: runs.map((r) => ({
        workflowId: r.workflowId || null,
        workflowName: r.workflowName || '',
        agentId: r.agentId,
        skillId: r.skillId,
        stepIndex: r.stepIndex ?? 0,
        summary: r.summary || '',
        result: r.result || '',
        status: r.status || 'success',
        duration: r.duration ?? null,
        executedAt: r.executedAt ? new Date(r.executedAt) : new Date(),
      })),
    });

    res.json({ count: created.count });
  } catch (error) {
    console.error('Error batch creating workflow runs:', error.message);
    res.status(500).json({ error: 'Failed to batch create workflow runs', details: error.message });
  }
});

// DELETE a workflow run
router.delete('/:id', async (req, res) => {
  try {
    await prisma.workflowRun.delete({ where: { id: req.params.id } });
    res.json({ message: 'Workflow run deleted', id: req.params.id });
  } catch (error) {
    console.error('Error deleting workflow run:', error.message);
    res.status(500).json({ error: 'Failed to delete workflow run', details: error.message });
  }
});

module.exports = router;
