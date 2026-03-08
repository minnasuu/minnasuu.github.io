const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 导入路由
const chatRoutes = require('./routes/chat');
const healthRoutes = require('./routes/health');
const articleRoutes = require('./routes/articles');
const draftRoutes = require('./routes/drafts');
const craftRoutes = require('./routes/crafts');
const ideaRoutes = require('./routes/ideas');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const goalRoutes = require('./routes/goals');
const difyRoutes = require('./routes/dify');
const emailRoutes = require('./routes/email');
const workflowRoutes = require('./routes/workflows');
const workflowRunRoutes = require('./routes/workflowRuns');
const assistantRoutes = require('./routes/assistants');

// 加载环境变量 - 尝试多个可能的位置
const possibleEnvPaths = [
  path.join(__dirname, '..', '.env'),   // 根目录的 .env (Docker 部署)
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.error('⚠️  未找到环境变量文件，尝试的路径:', possibleEnvPaths);
}

const app = express();
const PORT = process.env.PORT || 8001;

// 中间件
app.use(cors({
  origin: function (origin, callback) {
    // 允许没有 origin 的请求 (比如移动端应用或 curl)
    if (!origin) return callback(null, true);
    // 允许 localhost (任何端口)
    if (origin.match(/^https?:\/\/localhost:\d+$/) || origin.match(/^https?:\/\/127\.0\.0\.1:\d+$/)) {
      return callback(null, true);
    }

    // 检查是否匹配配置的 FRONTEND_URL
    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (origin === allowedOrigin) {
      return callback(null, true);
    }

    // 检查 ALLOWED_ORIGINS 环境变量（逗号分隔的域名列表，忽略端口差异）
    const allowedOrigins = process.env.ALLOWED_ORIGINS;
    if (allowedOrigins) {
      const origins = allowedOrigins.split(',').map(o => o.trim()).filter(Boolean);
      // 提取 origin 的 协议+主机名（去掉端口）
      const getHost = (u) => { try { const url = new URL(u); return url.protocol + '//' + url.hostname; } catch { return u; } };
      const originHost = getHost(origin);
      if (origins.some(o => o === origin || getHost(o) === originHost)) {
        return callback(null, true);
      }
    }

    console.log('Blocked CORS for:', origin, '| FRONTEND_URL:', allowedOrigin, '| ALLOWED_ORIGINS:', allowedOrigins);
    callback(null, false);
  },
  credentials: true
}));
// 增加请求体大小限制以支持大文件上传
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// 静态文件服务 - 提供上传的图片访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 挂载路由
app.use('/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/crafts', craftRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/dify', difyRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/workflow-runs', workflowRunRoutes);
app.use('/api/assistants', assistantRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Dify Proxy Server is running on http://localhost:${PORT}`);
  // console.log(`📝 Health check: http://localhost:${PORT}/health`);
  // console.log(`🌐 CORS allowed origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  // console.log(`🔑 DIFY_API_KEY configured: ${process.env.DIFY_API_KEY ? '✅ Yes' : '❌ No'}`);
  // console.log(`🔗 DIFY_API_URL: ${process.env.DIFY_API_URL || 'https://api.dify.ai/v1'}`);
  // console.log(`🔐 EDITOR_PASSWORD configured: ${process.env.EDITOR_PASSWORD ? '✅ Yes' : '❌ No (using default)'}`);
});
