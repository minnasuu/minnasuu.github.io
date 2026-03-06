const express = require('express');
const router = express.Router();

// Dify Workflow 代理端点 - 生成目标数据
router.post('/generate-goal', async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ error: 'Goal is required' });
    }

    const difyApiKey = process.env.DIFY_GOAL_API_KEY;
    const difyApiUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';

    if (!difyApiKey) {
      return res.status(500).json({ error: 'Server configuration error: DIFY_GOAL_API_KEY not set' });
    }

    // 调用 Dify Workflow API
    const response = await fetch(`${difyApiUrl}/workflows/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${difyApiKey}`,
      },
      body: JSON.stringify({
        inputs: {
          goal: goal
        },
        response_mode: 'blocking',
        user: 'user-' + Date.now(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Dify API error',
        details: errorText,
        status: response.status
      });
    }

    const result = await response.json();
    
    console.log('Dify API Response:', JSON.stringify(result, null, 2));
    
    // 尝试多种可能的数据结构
    let difyData;
    
    // 尝试 1: result.data.outputs.text (Dify workflow 返回的文本格式)
    if (result?.data?.outputs?.text) {
      try {
        let textContent = result.data.outputs.text;
        
        // 如果文本包含在 markdown 代码块中，提取 JSON 内容
        const jsonMatch = textContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
          textContent = jsonMatch[1];
        }
        
        difyData = JSON.parse(textContent);
        console.log('Parsed from text field:', difyData);
      } catch (e) {
        console.error('Failed to parse Dify text response:', e);
        return res.status(500).json({ 
          error: 'Failed to parse Dify response',
          details: e.message 
        });
      }
    }
    // 尝试 2: result.data.outputs (直接是对象)
    else if (result?.data?.outputs && typeof result.data.outputs === 'object') {
      difyData = result.data.outputs;
    }
    // 尝试 3: result.outputs
    else if (result?.outputs) {
      difyData = result.outputs;
    }
    // 尝试 4: result 本身就是数据
    else if (result?.professional_input || result?.professional_output) {
      difyData = result;
    }
    // 尝试 5: result.data 本身
    else if (result?.data) {
      difyData = result.data;
    }
    else {
      console.error('Unknown Dify response structure:', result);
      return res.status(500).json({ 
        error: 'Invalid API response structure',
        rawResponse: result 
      });
    }

    console.log('Parsed difyData:', difyData);

    // 验证必需的字段
    if (!difyData.professional_input?.human || !difyData.professional_input?.ai ||
        !difyData.professional_output?.human || !difyData.professional_output?.ai) {
      console.error('Missing required fields in difyData:', {
        professional_input_human: !!difyData.professional_input?.human,
        professional_input_ai: !!difyData.professional_input?.ai,
        professional_output_human: !!difyData.professional_output?.human,
        professional_output_ai: !!difyData.professional_output?.ai,
      });
      return res.status(500).json({ 
        error: 'Invalid API response: missing required fields',
        receivedData: difyData 
      });
    }

    // 返回处理后的数据
    res.json({
      inputData: {
        myInputs: difyData.professional_input.human.map(item => ({
          ...item,
          is_system: false,
          timeSpent: item.timeSpent || 0
        })),
        aiInputs: difyData.professional_input.ai.map(item => ({
          ...item,
          is_system: false,
          timeSpent: item.timeSpent || 0
        }))
      },
      outputData: {
        myOutputs: difyData.professional_output.human.map(item => ({
          ...item,
          is_system: false,
          timeSpent: item.timeSpent || 0
        })),
        aiOutputs: difyData.professional_output.ai.map(item => ({
          ...item,
          is_system: false,
          timeSpent: item.timeSpent || 0
        }))
      }
    });

  } catch (error) {
    console.error('Error in generate-goal endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// 通用 Skill 路由：各 skill 共用 Gemini 模型
// POST /api/dify/skill  body: { taskId, text }

// 延迟加载 GoogleGenAI（ESM-only 包，需用 dynamic import）
let _GoogleGenAI = null;
async function getGoogleGenAI() {
  if (!_GoogleGenAI) {
    const mod = await import('@google/genai');
    _GoogleGenAI = mod.GoogleGenAI;
  }
  return _GoogleGenAI;
}

// 创建 Gemini AI 客户端（支持自定义代理地址）
async function createGeminiClient(apiKey) {
  const GoogleGenAI = await getGoogleGenAI();
  const baseUrl = process.env.GEMINI_BASE_URL; // 可选：自定义代理地址
  const opts = { apiKey };
  if (baseUrl) {
    opts.httpOptions = { baseUrl };
  }
  return new GoogleGenAI(opts);
}

// Skill 对应的系统提示词
const SKILL_SYSTEM_PROMPTS = {
  'site-analyze': `你是一位专业的个人网站诊断顾问。用户会提供他们网站的现有文章和 Crafts 列表，请你：
1. 分析网站内容的完整性和丰富度
2. 指出内容上的不足和改进方向
3. 给出具体、可操作的建议（包括文章选题、Crafts 创意、功能扩展）
4. 用简洁友好的语气回复，适当使用 emoji
请用中文回复，控制在 300-500 字。`,

  'generate-todo': `你是一位项目管理助手，擅长为个人网站制定下周工作计划。根据用户提供的网站现状和诊断结论，生成下周代办清单。
请严格按以下格式输出，每个分类 2-3 项：

**文章选题**
- 具体文章标题和简短描述
- ...

**Crafts 计划**
- 具体 Craft 名称和简短描述
- ...

**功能扩展**
- 具体功能名称和简短描述
- ...

用中文回复，每项简明扼要。`,

  'meeting-notes': `你是一位会议纪要撰写助手。根据用户提供的周会内容（包括产出统计、网站诊断、代办清单、任务分配等），生成结构化的会议纪要。

格式要求（Markdown）：
1. **标题**：根据本次会议实际讨论的核心内容，由你总结一个简洁有力的会议标题（不要写成"周会纪要"之类的泛称，而是提炼出重点）
2. **会议信息**：日期、主持人、参会人 — 这些信息会由系统在输入中提供，请直接使用
3. **本周回顾**（关键产出）
4. **问题与改进**
5. **下周计划**
6. **行动项**（具体责任人和截止日期）

用中文回复，简洁专业，适当使用 emoji。`,

  'assign-task': `你是一位项目任务拆解助手。用户会提供前序步骤的输出内容（可能包含代办清单、网站诊断、产出统计等），你需要从中提取出**最重要、最可执行**的任务，分配到对应分类。

规则：
1. 输出 0-5 个任务，宁缺毋滥，只保留有明确可执行动作的条目
2. 每个任务必须属于以下三个分类之一：文章、Crafts、功能扩展
3. title 简明扼要（10字以内），description 说明具体要做什么
4. 如果前序内容中没有可执行的任务，返回空数组即可

请严格返回 JSON 格式（不要 markdown 代码块包裹），示例：
[
  { "category": "文章", "title": "React 状态管理对比", "description": "撰写一篇 React 状态管理方案对比文章" },
  { "category": "Crafts", "title": "代码雨动效", "description": "开发一个 Matrix 风格的代码雨视觉组件" },
  { "category": "功能扩展", "title": "深色模式", "description": "为个站添加深色模式切换功能" }
]

只返回 JSON 数组，不要添加任何额外文字。`,
};

// Qwen (通义千问) 调用 — 兼容 OpenAI Chat Completions 格式
async function callQwen(systemPrompt, userText) {
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) throw new Error('QWEN_API_KEY not set');

  const baseUrl = process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
  const model = process.env.QWEN_MODEL || 'qwen-plus';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Qwen API ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// 可用模型列表
const AVAILABLE_MODELS = {
  gemini: { name: 'Gemini', provider: 'Google' },
  qwen: { name: 'Qwen', provider: 'Alibaba' },
};

// 获取可用模型列表
router.get('/models', (_req, res) => {
  const models = Object.entries(AVAILABLE_MODELS).map(([id, info]) => {
    let available = false;
    if (id === 'gemini') available = !!process.env.GEMINI_API_KEY;
    if (id === 'qwen') available = !!process.env.QWEN_API_KEY;
    return { id, ...info, available };
  });
  res.json({ models, default: process.env.DEFAULT_AI_MODEL || 'gemini' });
});

router.post('/skill', async (req, res) => {
  try {
    const { taskId, text, model } = req.body;

    if (!taskId || !text) {
      return res.status(400).json({ error: 'taskId and text are required' });
    }

    const systemPrompt = SKILL_SYSTEM_PROMPTS[taskId] || '你是一位专业的 AI 助手，请用中文回复用户的问题。';
    const selectedModel = model || process.env.DEFAULT_AI_MODEL || 'gemini';

    console.log(`[ai/skill] taskId=${taskId}, model=${selectedModel}, text length=${text.length}`);

    let answer = '';

    if (selectedModel === 'qwen') {
      // --- Qwen ---
      answer = await callQwen(systemPrompt, text);
    } else {
      // --- Gemini (默认) ---
      const GoogleGenAI = await getGoogleGenAI();
      if (!GoogleGenAI) {
        return res.status(500).json({ error: 'Server configuration error: @google/genai module not available' });
      }

      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY not set' });
      }

      const ai = await createGeminiClient(geminiApiKey);
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
        contents: text,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      });

      answer = response.text || '';
    }

    console.log(`[ai/skill] taskId=${taskId}, model=${selectedModel}, answer length=${answer.length}`);

    res.json({
      answer,
      model: selectedModel,
      conversationId: `${selectedModel}-${taskId}-${Date.now()}`,
    });
  } catch (error) {
    console.error('[ai/skill] Error:', error);
    res.status(500).json({
      error: 'AI API error',
      message: error.message,
    });
  }
});

module.exports = router;
