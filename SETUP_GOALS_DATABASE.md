# 目标管理数据库设置指南

## 步骤 1: 运行数据库迁移

在项目根目录执行以下命令：

```bash
cd backend
npx prisma migrate dev --name add_goal_model
```

这将创建 `Goal` 表并应用到数据库。

## 步骤 2: 生成 Prisma Client

```bash
npx prisma generate
```

## 步骤 3: 重启后端服务

```bash
cd ..
npm run stop
npm run start
```

或者如果在开发模式：

```bash
cd backend
npm run dev
```

## 步骤 4: 配置环境变量

在项目根目录创建 `.env` 文件（如果还没有），添加以下配置：

```env
# Backend Dify API Configuration
DIFY_API_KEY=your_actual_dify_api_key_here
DIFY_API_URL=https://api.dify.ai/v1

# Frontend API URL (for connecting to backend)
VITE_API_URL=http://localhost:8001

# Database (如果需要修改)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Other configurations
FRONTEND_URL=http://localhost:5173
PORT=8001
```

**重要说明**：
- `DIFY_API_KEY` 和 `DIFY_API_URL` 配置在**后端**，前端无法访问
- 这样更安全，API Key 不会暴露到浏览器
- 如果不配置 `DIFY_API_KEY`，系统会自动使用模拟数据

## API 端点

创建成功后，以下 API 端点将可用：

- `GET /api/goals/current` - 获取当前活跃目标
- `GET /api/goals` - 获取所有目标（支持分页和筛选）
- `GET /api/goals/:id` - 获取单个目标
- `POST /api/goals` - 创建新目标
- `PUT /api/goals/:id` - 更新目标
- `DELETE /api/goals/:id` - 删除目标
- `PATCH /api/goals/:id/status` - 更新目标状态
- `PATCH /api/goals/:id/progress` - 更新目标进度

## 功能说明

1. **创建目标**: 填写目标信息后，系统会调用 Dify API 生成专业的输入输出任务列表
2. **编辑目标**: 可以修改目标信息，数据会同步到数据库
3. **状态管理**: 
   - `planning`: 规划状态（创建后的初始状态）
   - `active`: 活跃状态（点击"开始"后）
   - `paused`: 暂停状态
   - `completed`: 完成状态
4. **数据持久化**: 所有目标数据都保存在 PostgreSQL 数据库中
5. **输入输出管理**: 创建目标后即可编辑输入输出任务，初始状态为未完成

## 故障排除

### 如果迁移失败

1. 检查数据库连接：
```bash
cd backend
npx prisma studio
```

2. 重置数据库（⚠️ 会删除所有数据）：
```bash
npx prisma migrate reset
```

3. 查看迁移状态：
```bash
npx prisma migrate status
```

### 如果 API 无法访问

1. 检查后端服务是否运行：
```bash
npm run status
```

2. 查看后端日志：
```bash
npm run logs:backend
```

3. 确认端口 8001 没有被占用

## 开发建议

- 开发时可以使用 Prisma Studio 查看和编辑数据：`npx prisma studio`
- 在 `.env` 中配置 `VITE_DIFY_API_KEY` 后可以使用真实的 AI 生成功能
- 如果不配置 API Key，系统会自动使用模拟数据
