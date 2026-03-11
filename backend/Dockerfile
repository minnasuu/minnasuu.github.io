FROM node:18-alpine

WORKDIR /app

# 1. 复制依赖文件
COPY package*.json ./
COPY prisma ./prisma/

# 2. 安装生产依赖（使用镜像加速）
RUN npm config set registry https://registry.npmmirror.com && npm install --production

# 3. 单独安装 Prisma CLI（只在构建时需要）
RUN npm install prisma --save-dev

# 4. 生成 Prisma Client
RUN npx prisma generate

# 5. 复制后端源码
COPY . .

# 6. 暴露端口
EXPOSE 8001

# 7. 先运行数据迁移脚本（在 db push 前迁移 Draft 数据，避免被 db push 删掉）
#    然后用 db push 同步数据库结构（--accept-data-loss 允许非交互式环境中的破坏性变更）
CMD ["sh", "-c", "node migrate-data.js && npx prisma db push --skip-generate --accept-data-loss && node index.js"]
