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

# 7. 使用 db push：不会阻塞、不会报错、不依赖 migrations
CMD ["sh", "-c", "npx prisma db push && node index.js"]
