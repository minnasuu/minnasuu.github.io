#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  启动 I'm Minna 项目${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker 未运行，请先启动 Docker${NC}"
    exit 1
fi

# 检查 .env 文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env 文件不存在，将使用默认配置${NC}"
fi

# 停止并删除旧容器（如果存在）
echo -e "${YELLOW}🔄 清理旧容器...${NC}"
docker-compose down 2>/dev/null

# 启动数据库
echo -e "${YELLOW}📦 启动数据库...${NC}"
docker-compose up -d db

# 等待数据库启动
echo -e "${YELLOW}⏳ 等待数据库启动...${NC}"
sleep 5

# 启动后端
echo -e "${YELLOW}🚀 启动后端服务...${NC}"
docker-compose up -d backend

# 等待后端健康检查
echo -e "${YELLOW}⏳ 等待后端服务就绪...${NC}"
sleep 10

# 启动前端
echo -e "${YELLOW}🎨 启动前端服务...${NC}"
docker-compose up -d frontend

# 显示状态
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 项目启动成功！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "📊 服务状态："
docker-compose ps
echo ""
echo -e "🌐 访问地址："
echo -e "  - 前端: ${GREEN}http://localhost${NC}"
echo -e "  - 后端: ${GREEN}http://localhost:8001${NC}"
echo ""
echo -e "📝 查看日志："
echo -e "  ${YELLOW}docker-compose logs -f${NC}"
echo ""
echo -e "🛑 停止服务："
echo -e "  ${YELLOW}npm run stop${NC} 或 ${YELLOW}./stop.sh${NC}"
echo ""
