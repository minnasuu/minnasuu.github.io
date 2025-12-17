#!/bin/bash

# ========================================
# 服务器部署脚本 - 确保 dist 文件更新
# ========================================

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  服务器部署 - 强制更新所有内容${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. 拉取最新代码
echo -e "${YELLOW}📥 拉取最新代码...${NC}"
git pull origin main
echo -e "${GREEN}✅ 代码已更新${NC}"
echo ""

# 2. 停止所有服务
echo -e "${YELLOW}🛑 停止所有服务...${NC}"
docker compose down
echo -e "${GREEN}✅ 服务已停止${NC}"
echo ""

# 3. 删除旧镜像
echo -e "${YELLOW}🗑️  删除旧镜像...${NC}"
docker rmi i-m-minna-frontend 2>/dev/null || echo "前端镜像不存在，跳过"
docker rmi i-m-minna-backend 2>/dev/null || echo "后端镜像不存在，跳过"
echo -e "${GREEN}✅ 旧镜像已删除${NC}"
echo ""

# 4. 清理 Docker 缓存
echo -e "${YELLOW}🧹 清理 Docker 缓存...${NC}"
docker builder prune -f
echo -e "${GREEN}✅ 缓存已清理${NC}"
echo ""

# 5. 无缓存重新构建
echo -e "${YELLOW}🔨 开始构建（不使用缓存）...${NC}"
echo -e "${YELLOW}   这可能需要几分钟，请耐心等待...${NC}"
docker compose build --no-cache --pull
echo -e "${GREEN}✅ 构建完成${NC}"
echo ""

# 6. 启动服务
echo -e "${YELLOW}🚀 启动服务...${NC}"
docker compose up -d
echo -e "${GREEN}✅ 服务已启动${NC}"
echo ""

# 7. 等待服务就绪
echo -e "${YELLOW}⏳ 等待服务就绪...${NC}"
sleep 10

# 8. 验证部署
echo -e "${YELLOW}🔍 验证部署状态...${NC}"
echo ""

# 检查容器状态
echo -e "${BLUE}📦 容器状态：${NC}"
docker compose ps
echo ""

# 检查后端健康
if curl -f http://localhost:8001/health &> /dev/null; then
    echo -e "${GREEN}✅ 后端健康检查通过${NC}"
else
    echo -e "${RED}❌ 后端健康检查失败${NC}"
fi

# 检查前端
if curl -f http://localhost &> /dev/null; then
    echo -e "${GREEN}✅ 前端服务正常${NC}"
else
    echo -e "${RED}❌ 前端服务异常${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}📝 重要提示：${NC}"
echo -e "  1. 浏览器访问时请强制刷新: ${BLUE}Ctrl+Shift+R${NC}"
echo -e "  2. 前端地址: ${GREEN}http://your-server-ip${NC}"
echo -e "  3. 后端地址: ${GREEN}http://your-server-ip:8001${NC}"
echo -e "  4. 查看日志: ${BLUE}docker compose logs -f${NC}"
echo ""

# 9. 验证 dist 文件是否更新
echo -e "${YELLOW}🔍 验证前端 dist 文件...${NC}"
CONTAINER_ID=$(docker compose ps -q frontend)
if [ -n "$CONTAINER_ID" ]; then
    echo -e "${BLUE}前端容器中的文件:${NC}"
    docker exec $CONTAINER_ID ls -lh /usr/share/nginx/html/ | head -10
    echo ""
    echo -e "${BLUE}文件最后修改时间:${NC}"
    docker exec $CONTAINER_ID stat /usr/share/nginx/html/index.html | grep Modify
fi
echo ""
