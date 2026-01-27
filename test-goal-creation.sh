#!/bin/bash

# 测试目标创建 API
# 使用方法: ./test-goal-creation.sh [backend_url]

BACKEND_URL=${1:-"http://localhost:8001"}

echo "========================================="
echo "测试目标创建 API"
echo "Backend URL: $BACKEND_URL"
echo "========================================="
echo ""

# 1. 测试健康检查
echo "1. 测试健康检查..."
curl -s "${BACKEND_URL}/health" | jq '.' || echo "健康检查失败或后端未运行"
echo ""
echo ""

# 2. 测试创建目标
echo "2. 测试创建目标..."
RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/goals" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试目标",
    "description": "这是一个测试目标",
    "category": "technical",
    "priority": "medium",
    "duration": 7,
    "startDate": "2025-01-27",
    "endDate": "2025-02-03",
    "status": "planning",
    "progress": 0,
    "targetSkills": ["React", "TypeScript"],
    "milestones": [],
    "successCriteria": ["完成基本功能", "通过测试"],
    "generatedData": null
  }')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "Response: $RESPONSE"
echo ""
echo ""

# 3. 测试获取当前目标
echo "3. 测试获取当前目标..."
curl -s "${BACKEND_URL}/api/goals/current" | jq '.' || echo "获取当前目标失败"
echo ""
echo ""

echo "========================================="
echo "测试完成"
echo "========================================="
