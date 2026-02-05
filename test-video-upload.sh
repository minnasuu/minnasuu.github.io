#!/bin/bash

# 测试视频上传功能
echo "🎬 测试视频上传功能"
echo "===================="

# 检查是否有测试视频文件
if [ ! -f "test-video.mp4" ]; then
  echo "⚠️  找不到 test-video.mp4 文件"
  echo "请创建一个测试视频文件，或使用以下命令创建一个空的测试文件："
  echo "touch test-video.mp4"
  exit 1
fi

# 后端URL（可以通过参数传入）
BACKEND_URL=${1:-"http://localhost:8001"}

echo ""
echo "📤 上传测试视频到: ${BACKEND_URL}/api/upload"
echo ""

# 执行上传
curl -X POST \
  -F "video=@test-video.mp4" \
  "${BACKEND_URL}/api/upload" \
  -v

echo ""
echo ""
echo "✅ 测试完成"
