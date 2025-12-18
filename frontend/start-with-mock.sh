#!/bin/bash

# 启动前端开发服务器（Mock 数据模式）

echo "🚀 启动前端开发服务器（Mock 数据模式）..."
echo ""
echo "✨ 特性："
echo "  - 使用本地 Mock 数据"
echo "  - 无需后端服务"
echo "  - 数据保存在浏览器 localStorage"
echo ""

# 检查 .env.local 是否存在
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local 文件不存在，正在创建..."
    echo "VITE_USE_MOCK=true" > .env.local
    echo "✅ 已创建 .env.local 文件"
fi

# 确保 Mock 模式已启用
if grep -q "VITE_USE_MOCK=true" .env.local; then
    echo "✅ Mock 模式已启用"
else
    echo "⚙️  正在启用 Mock 模式..."
    sed -i '' 's/VITE_USE_MOCK=false/VITE_USE_MOCK=true/' .env.local 2>/dev/null || echo "VITE_USE_MOCK=true" >> .env.local
    echo "✅ Mock 模式已启用"
fi

echo ""
echo "📦 启动中..."
echo ""

npm run dev
