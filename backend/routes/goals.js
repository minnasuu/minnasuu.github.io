const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// 辅助函数：将 BigInt 转换为字符串以便 JSON 序列化
const serializeGoal = (goal) => {
  if (!goal) return null;
  return {
    ...goal,
    totalPausedDuration: goal.totalPausedDuration ? goal.totalPausedDuration.toString() : '0'
  };
};

const serializeGoals = (goals) => {
  return goals.map(serializeGoal);
};

// 获取当前活跃的目标
router.get('/current', async (req, res) => {
  try {
    const goal = await prisma.goal.findFirst({
      where: {
        OR: [
          { status: 'planning' },
          { status: 'active' },
          { status: 'paused' }
        ]
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    res.json(serializeGoal(goal));
  } catch (error) {
    console.error('Error fetching current goal:', error);
    res.status(500).json({ error: 'Failed to fetch current goal' });
  }
});

// 获取所有目标（支持筛选和分页）
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = {};
    
    // 支持多个状态，用逗号分隔
    if (status) {
      const statuses = status.split(',').map(s => s.trim());
      if (statuses.length === 1) {
        where = { status: statuses[0] };
      } else {
        where = {
          OR: statuses.map(s => ({ status: s }))
        };
      }
    }
    
    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
        where,
        orderBy: {
          updatedAt: 'desc'
        },
        skip,
        take: parseInt(limit)
      }),
      prisma.goal.count({ where })
    ]);
    
    res.json({
      goals: serializeGoals(goals),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// 获取单个目标
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await prisma.goal.findUnique({
      where: { id }
    });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    res.json(serializeGoal(goal));
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ error: 'Failed to fetch goal' });
  }
});

// 创建新目标
router.post('/', async (req, res) => {
  try {
    const goalData = req.body;
    
    console.log('Creating goal with data:', JSON.stringify(goalData, null, 2));
    
    // 验证必填字段
    if (!goalData.title || !goalData.description || !goalData.startDate || !goalData.endDate) {
      console.error('Missing required fields:', { 
        hasTitle: !!goalData.title, 
        hasDescription: !!goalData.description,
        hasStartDate: !!goalData.startDate,
        hasEndDate: !!goalData.endDate
      });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'title, description, startDate, and endDate are required' 
      });
    }
    
    // 准备数据库数据
    const dbData = {
      title: goalData.title,
      description: goalData.description,
      category: goalData.category,
      priority: goalData.priority,
      status: goalData.status || 'planning',
      progress: goalData.progress || 0,
      duration: goalData.duration,
      startDate: goalData.startDate,
      endDate: goalData.endDate,
      targetSkills: goalData.targetSkills || [],
      successCriteria: goalData.successCriteria || [],
      // 空数组转换为 null，因为 Prisma Json 字段不接受空数组
      milestones: (goalData.milestones && goalData.milestones.length > 0) ? goalData.milestones : null,
      generatedData: goalData.generatedData || null,
      actualStartDate: goalData.actualStartDate || null,
      pausedAt: goalData.pausedAt || null,
      totalPausedDuration: BigInt(goalData.totalPausedDuration || 0)
    };
    
    console.log('Prepared database data:', {
      ...dbData,
      totalPausedDuration: dbData.totalPausedDuration.toString()
    });
    
    const goal = await prisma.goal.create({
      data: dbData
    });
    
    console.log('Goal created successfully:', goal.id);
    
    res.status(201).json(serializeGoal(goal));
  } catch (error) {
    console.error('Error creating goal:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // 检查是否是 Prisma 错误
    if (error.code) {
      console.error('Prisma error code:', error.code);
      console.error('Prisma error meta:', error.meta);
    }
    
    res.status(500).json({ 
      error: 'Failed to create goal',
      message: error.message,
      code: error.code || 'UNKNOWN',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 更新目标
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goalData = req.body;
    
    // 准备更新数据
    const updateData = { ...goalData };
    
    // 将 totalPausedDuration 转换为 BigInt
    if (updateData.totalPausedDuration !== undefined) {
      updateData.totalPausedDuration = BigInt(updateData.totalPausedDuration);
    }
    
    const goal = await prisma.goal.update({
      where: { id },
      data: updateData
    });
    
    res.json(serializeGoal(goal));
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// 删除目标
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.goal.delete({
      where: { id }
    });
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

// 更新目标状态
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actualStartDate, pausedAt, totalPausedDuration } = req.body;
    
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    if (actualStartDate !== undefined) {
      updateData.actualStartDate = actualStartDate;
    }
    if (pausedAt !== undefined) {
      updateData.pausedAt = pausedAt;
    }
    if (totalPausedDuration !== undefined) {
      updateData.totalPausedDuration = BigInt(totalPausedDuration);
    }
    
    const goal = await prisma.goal.update({
      where: { id },
      data: updateData
    });
    
    res.json(serializeGoal(goal));
  } catch (error) {
    console.error('Error updating goal status:', error);
    res.status(500).json({ error: 'Failed to update goal status' });
  }
});

// 更新目标进度
router.patch('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    
    const goal = await prisma.goal.update({
      where: { id },
      data: {
        progress: parseInt(progress),
        updatedAt: new Date()
      }
    });
    
    res.json(serializeGoal(goal));
  } catch (error) {
    console.error('Error updating goal progress:', error);
    res.status(500).json({ error: 'Failed to update goal progress' });
  }
});

module.exports = router;
