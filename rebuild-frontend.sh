#!/bin/bash

echo "🔧 强制重新构建前端容器（清除缓存）..."

# 1. 停止并删除前端容器
echo "📦 停止并删除前端容器..."
docker compose stop frontend
docker compose rm -f frontend

# 2. 删除前端镜像（强制重新构建）
echo "🗑️  删除旧的前端镜像..."
docker rmi i-m-minna-frontend 2>/dev/null || true

# 3. 清理 Docker 构建缓存
echo "🧹 清理构建缓存..."
docker builder prune -f

# 4. 重新构建前端（不使用缓存）
echo "🚀 重新构建前端（无缓存）..."
docker compose build --no-cache frontend

# 5. 启动前端容器
echo "▶️  启动前端容器..."
docker compose up -d frontend

# 6. 查看构建日志
echo ""
echo "📊 容器状态："
docker compose ps

echo ""
echo "📝 查看前端日志："
docker compose logs --tail=50 frontend

echo ""
echo "✅ 重新构建完成！"
echo "访问: http://你的服务器IP:8080"
echo ""
echo "💡 提示: 如果服务器有Nginx，可以配置反向代理："
echo "   location / {"
echo "       proxy_pass http://localhost:8080;"
echo "   }"
