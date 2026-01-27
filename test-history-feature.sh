#!/bin/bash

# 历史记录功能测试脚本

echo "🧪 开始测试历史记录功能..."
echo ""

# 1. 测试获取历史记录 API
echo "📋 测试 1: 获取历史记录（已完成和已取消）"
echo "请求: GET /api/goals?status=completed,cancelled&page=1&limit=10"
curl -s "http://localhost:8001/api/goals?status=completed,cancelled&page=1&limit=10" | jq '.'
echo ""

# 2. 测试获取单个已完成的目标
echo "📋 测试 2: 获取单个目标详情"
echo "请求: GET /api/goals/<goal_id>"
echo "提示: 请手动测试，将 <goal_id> 替换为实际的目标 ID"
echo ""

# 3. 测试删除目标
echo "📋 测试 3: 删除目标"
echo "请求: DELETE /api/goals/<goal_id>"
echo "提示: 请手动测试，将 <goal_id> 替换为实际的目标 ID"
echo ""

echo "✅ 基础 API 测试完成"
echo ""
echo "📝 前端测试步骤："
echo "1. 访问 http://localhost:5173/ai-log"
echo "2. 点击'历史记录'标签"
echo "3. 查看历史记录列表是否正确显示"
echo "4. 点击任意记录查看详情"
echo "5. 确认详情对话框为只读模式"
echo "6. 尝试删除一条记录"
echo "7. 测试分页加载功能"
echo ""
echo "🎨 样式测试："
echo "1. 测试响应式布局（调整窗口大小）"
echo "2. 切换深色/浅色主题"
echo "3. 切换中英文语言"
echo ""
echo "🐛 边界情况测试："
echo "1. 空历史记录状态"
echo "2. 网络错误情况（断开网络）"
echo "3. 删除失败处理"
echo ""
