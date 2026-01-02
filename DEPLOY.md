# 部署指南

## 项目结构

```
project/
├─ docker-compose.yml
├─ frontend/      # 前端项目 (React + Vite)
│  ├─ src/
│  ├─ public/
│  ├─ Dockerfile
│  ├─ nginx.conf
│  └─ package.json
│  └─ .env
└─ backend/       # 后端服务 (Node.js + Express)
   ├─ routes/
   ├─ prisma/
   ├─ Dockerfile
   └─ package.json
```

## 1. 准备工作

确保服务器已安装：
- Docker
- Docker Compose

## 2. 文件传输

将整个项目目录上传到服务器（例如 `/app/minna-blog`），不需要上传：
- `node_modules/`
- `dist/`
- `.vite/`

## 3. 环境变量配置

在项目根目录创建 `.env` 文件：

```bash
# Dify API Configuration
DIFY_API_KEY=your_dify_api_key_here
DIFY_API_URL=https://api.dify.ai/v1

# Frontend URL (for CORS)
# 如果有域名，填写真实域名；本地测试可用 http://localhost
FRONTEND_URL=http://your-server-ip-or-domain

# Editor Authentication
# 设置编辑器访问密码（用于 /articles-editor 和 /crafts-editor）
EDITOR_PASSWORD=your-secure-password-here
```

或者复制示例文件并修改：

```bash
cp .env.example .env
# 然后编辑 .env 文件填写实际值
```

## 4. 启动服务

在项目根目录下运行：

```bash
# 构建并后台启动
docker-compose up -d --build
```

## 5. 验证

- 前端访问：`http://your-server-ip:80`
- 后端 API：`http://your-server-ip:8001/health`

## 6. 常用命令

- 查看日志：
  ```bash
  docker-compose logs -f
  ```
- 重启后端（代码更新后）：
  ```bash
  docker-compose restart backend
  ```
- 停止所有服务：
  ```bash
  docker-compose down
  ```
- 彻底清理（包括数据卷）：
  ```bash
  docker-compose down -v
  ```

## 7. 开发环境

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
npm install
npm run dev
```


