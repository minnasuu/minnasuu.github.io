FROM node:18-alpine

WORKDIR /app

# 1. 安装 Prisma 在 Alpine 上需要的系统依赖
RUN apk add --no-cache openssl

# 2. 复制依赖文件
COPY package*.json ./
COPY prisma ./prisma/

# 3. 安装所有依赖（包括 prisma CLI，需要用于 db push）
RUN npm config set registry https://registry.npmmirror.com && npm install

# 4. 复制后端源码
COPY . .

# 5. 生成 Prisma Client（必须在 COPY 之后，否则会被覆盖）
RUN npx prisma generate

# 6. 确保启动脚本有执行权限
RUN chmod +x docker-entrypoint.sh

# 7. 暴露端口
EXPOSE 8001

# 8. 使用启动脚本：数据迁移 → db push → 启动服务
CMD ["sh", "docker-entrypoint.sh"]
