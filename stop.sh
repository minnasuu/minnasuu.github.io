#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  停止 I'm Minna 项目${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker 未运行${NC}"
    exit 1
fi

# 显示当前运行的容器
echo -e "${YELLOW}📊 当前运行的服务：${NC}"
docker-compose ps
echo ""

# 停止所有服务
echo -e "${YELLOW}🛑 停止所有服务...${NC}"
docker-compose down

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 所有服务已停止${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "💡 提示："
echo -e "  - 如需重新启动: ${YELLOW}npm run start${NC} 或 ${YELLOW}./start.sh${NC}"
echo -e "  - 如需清理数据卷: ${YELLOW}docker-compose down -v${NC}"
echo ""
