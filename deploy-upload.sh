#!/bin/bash

# ===========================================
# 图片上传功能快速部署脚本
# ===========================================

set -e  # 遇到错误立即退出

echo "🚀 开始部署图片上传功能..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 创建 uploads 目录
echo -e "${YELLOW}📁 创建 uploads 目录...${NC}"
mkdir -p backend/uploads
chmod 755 backend/uploads
echo -e "${GREEN}✅ uploads 目录创建成功${NC}"

# 2. 检查是否在 Docker 环境
if command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}🐳 检测到 Docker，使用 Docker 部署...${NC}"
    
    # 停止旧服务
    echo -e "${YELLOW}⏹️  停止旧服务...${NC}"
    docker-compose down
    
    # 重新构建后端
    echo -e "${YELLOW}🔨 重新构建后端服务...${NC}"
    docker-compose build backend
    
    # 启动所有服务
    echo -e "${YELLOW}▶️  启动所有服务...${NC}"
    docker-compose up -d
    
    # 等待服务启动
    echo -e "${YELLOW}⏳ 等待服务启动 (30秒)...${NC}"
    sleep 30
    
    # 检查服务状态
    echo -e "${YELLOW}📊 检查服务状态...${NC}"
    docker-compose ps
    
    echo -e "${GREEN}✅ Docker 部署完成！${NC}"
    
else
    echo -e "${YELLOW}📦 使用传统方式部署...${NC}"
    
    # 安装后端依赖
    echo -e "${YELLOW}📥 安装后端依赖...${NC}"
    cd backend
    npm install
    cd ..
    
    # 重新构建前端
    echo -e "${YELLOW}🔨 重新构建前端...${NC}"
    cd frontend
    npm install
    npm run build
    cd ..
    
    echo -e "${GREEN}✅ 构建完成！${NC}"
    echo -e "${YELLOW}⚠️  请手动重启后端和前端服务${NC}"
fi

# 3. 测试上传接口
echo -e "${YELLOW}🧪 测试上传接口...${NC}"
sleep 5

# 检查健康检查
if curl -f http://localhost:8001/health &> /dev/null; then
    echo -e "${GREEN}✅ 后端服务健康检查通过${NC}"
else
    echo -e "${RED}❌ 后端服务未就绪，请检查日志${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo ""
echo "📝 下一步："
echo "   1. 在浏览器中打开文章编辑器"
echo "   2. 点击设置按钮"
echo "   3. 尝试上传图片"
echo ""
echo "📊 查看日志："
echo "   docker-compose logs -f backend"
echo ""
echo "🔧 如有问题，请查看："
echo "   DEPLOY_UPLOAD_FEATURE.md"
