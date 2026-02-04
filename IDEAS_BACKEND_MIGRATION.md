# Ideas 独立后端迁移指南

## 📋 概述

本次更新为 Ideas 功能创建了独立的后端 API，与 Crafts 分离。这样可以让两个功能独立演进，互不影响。

## 🎯 主要变更

### 1. 数据库层 (Prisma Schema)

**新增 `Idea` 模型** (`backend/prisma/schema.prisma`)
```prisma
model Idea {
  id            String   @id @default(uuid())
  name          String
  description   String   @db.Text
  category      String   // component, effect, control, demo, experiment
  weight        Int      @default(1)
  image         String?
  video         String?
  linkUrl       String?
  useCase       String?  @db.Text
  relations     Json?    // 存储关系数组 [{targetId, type}]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**字段说明**：
- 移除了 Crafts 的字段：`technologies[]`, `featured`, `coverImage`, `demoUrl`, `githubUrl`, `content`
- 新增 Ideas 专用字段：`image`, `video`, `linkUrl`
- 保留字段：`name`, `description`, `category`, `weight`, `useCase`, `relations`

### 2. 后端路由

**新建文件** `backend/routes/ideas.js`
- `GET /api/ideas` - 获取所有 ideas
- `GET /api/ideas/:id` - 获取单个 idea
- `POST /api/ideas` - 创建 idea
- `PUT /api/ideas/:id` - 更新 idea
- `DELETE /api/ideas/:id` - 删除 idea
- `POST /api/ideas/:id/relations` - 添加关系
- `DELETE /api/ideas/:id/relations/:targetId` - 删除关系

**更新** `backend/index.js`
- 导入 ideas 路由
- 挂载到 `/api/ideas` 路径

### 3. 前端 API 客户端

**更新** `frontend/src/shared/utils/backendClient.ts`

新增 Ideas API 函数：
- `fetchIdeas()` - 获取所有 ideas
- `fetchIdeaById(id)` - 获取单个 idea
- `createIdea(idea)` - 创建 idea
- `updateIdea(id, idea)` - 更新 idea
- `deleteIdea(id)` - 删除 idea
- `addIdeaRelation(ideaId, targetId, type)` - 添加关系
- `removeIdeaRelation(ideaId, targetId)` - 删除关系

新增类型定义：
```typescript
export interface CreateIdeaRequest {
  name: string;
  description: string;
  category: string;
  weight?: number;
  image?: string;
  video?: string;
  useCase?: string;
  linkUrl?: string;
  relations?: { targetId: string; type: string }[];
}
```

### 4. 前端页面

**更新** `frontend/src/features/ideas/pages/IdeasPage.tsx`
- 将所有 `fetchCrafts` 替换为 `fetchIdeas`
- 将所有 `createCraft` 替换为 `createIdea`
- 将所有 `updateCraft` 替换为 `updateIdea`
- 将所有 `deleteCraft` 替换为 `deleteIdea`

## 🚀 部署步骤

### 步骤 1: 数据库迁移

在后端目录运行 Prisma 迁移：

```bash
cd backend

# 生成迁移文件
npx prisma migrate dev --name add_idea_model

# 或者如果在生产环境
npx prisma migrate deploy
```

这将：
- 在数据库中创建 `Idea` 表
- 生成新的 Prisma Client 代码

### 步骤 2: 重启后端服务

```bash
# 开发环境
npm run dev

# 或生产环境
npm start
```

### 步骤 3: 重启前端服务

```bash
cd frontend

# 开发环境
npm run dev

# 或构建生产版本
npm run build
```

### 步骤 4: 验证部署

1. **检查后端健康**：
   ```bash
   curl http://localhost:8001/health
   ```

2. **测试 Ideas API**：
   ```bash
   # 获取所有 ideas
   curl http://localhost:8001/api/ideas
   
   # 创建测试 idea
   curl -X POST http://localhost:8001/api/ideas \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Idea",
       "description": "This is a test",
       "category": "component",
       "weight": 1
     }'
   ```

3. **测试前端**：
   - 访问 Ideas 页面
   - 尝试创建、编辑、删除操作
   - 验证图片上传功能

## 📊 数据迁移（可选）

如果你想将现有的 Crafts 数据迁移到 Ideas：

```javascript
// 在 backend 目录创建迁移脚本 migrate-crafts-to-ideas.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateCraftsToIdeas() {
  try {
    const crafts = await prisma.craft.findMany();
    
    for (const craft of crafts) {
      await prisma.idea.create({
        data: {
          name: craft.name,
          description: craft.description,
          category: craft.category,
          weight: craft.weight,
          image: craft.coverImage || null,
          video: null,
          linkUrl: craft.demoUrl || null,
          useCase: craft.useCase || null,
          relations: craft.relations || null,
          createdAt: craft.createdAt,
          updatedAt: craft.updatedAt
        }
      });
    }
    
    console.log(`✅ 成功迁移 ${crafts.length} 条数据`);
  } catch (error) {
    console.error('❌ 迁移失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCraftsToIdeas();
```

运行迁移：
```bash
node migrate-crafts-to-ideas.js
```

## ⚠️ 注意事项

1. **数据分离**：Ideas 和 Crafts 现在使用独立的数据表，互不影响
2. **API 路径**：Ideas 使用 `/api/ideas`，Crafts 使用 `/api/crafts`
3. **类型兼容**：前端 `Idea` 类型（IdeaNode.tsx）和 `Craft` 类型（CraftNode.tsx）字段不同
4. **备份**：执行迁移前请备份数据库

## 🔧 回滚方案

如果需要回滚：

```bash
# 回滚最后一次迁移
cd backend
npx prisma migrate rollback

# 恢复代码
git revert <commit-hash>
```

## 📝 后续工作

- [ ] 为 Ideas 添加独立的详情页面
- [ ] 优化 Ideas 的搜索和过滤功能
- [ ] 添加 Ideas 的导入/导出功能
- [ ] 考虑为 Ideas 添加标签系统

## 🐛 故障排查

**问题：Prisma Client 找不到 `idea` 模型**
```bash
npx prisma generate
```

**问题：数据库连接失败**
- 检查 `.env` 文件中的 `DATABASE_URL`
- 确认数据库服务运行正常

**问题：前端 API 调用失败**
- 检查后端服务是否运行
- 查看浏览器控制台网络请求
- 检查 CORS 配置

## ✅ 完成清单

- [x] 创建 Prisma Idea 模型
- [x] 创建后端 ideas 路由
- [x] 更新 index.js 挂载路由
- [x] 创建前端 Ideas API 函数
- [x] 更新 IdeasPage.tsx 使用新 API
- [x] 所有 TypeScript 错误已修复
- [ ] 执行数据库迁移
- [ ] 重启服务
- [ ] 功能测试通过
