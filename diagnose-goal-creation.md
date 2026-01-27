# 目标创建失败诊断指南

## 问题描述
Dify API 调用成功，但创建目标时提示：**服务器内部错误，请检查后端日志和数据库连接**

## 已修复的问题

### 1. BigInt 序列化问题
**问题**：PostgreSQL 的 `BigInt` 类型无法直接序列化为 JSON
**修复**：添加了 `serializeGoal` 函数，将所有 Goal 对象的 `totalPausedDuration` 转换为字符串

### 2. 数据字段处理
**问题**：前端传递的数据可能包含 undefined 或未定义的字段
**修复**：在创建目标时显式指定所有字段，使用默认值处理空值

### 3. 错误日志增强
**修复**：添加了详细的错误日志，包括：
- Prisma 错误代码
- 完整的错误堆栈
- 准备的数据库数据

## 排查步骤

### 步骤 1：查看后端日志

在服务器上执行：
```bash
# 查看最新的 100 行日志
docker logs minna-backend --tail=100 -f

# 或者查看所有日志
docker logs minna-backend
```

**关键信息**：
- 是否有 Prisma 错误代码（如 P2002, P2003 等）
- 是否有字段类型不匹配的错误
- 是否有数据库连接错误

### 步骤 2：检查数据库连接

```bash
# 进入后端容器
docker exec -it minna-backend sh

# 测试数据库连接
npx prisma db pull

# 查看数据库状态
npx prisma studio
```

### 步骤 3：手动测试 API

在服务器上执行：
```bash
curl -X POST http://localhost:8001/api/goals \
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
    "targetSkills": ["React"],
    "successCriteria": ["完成功能"],
    "generatedData": {
      "inputData": {
        "myInputs": [],
        "aiInputs": []
      },
      "outputData": {
        "myOutputs": [],
        "aiOutputs": []
      }
    }
  }'
```

### 步骤 4：检查常见错误

#### 错误 1：Prisma 客户端未生成
**错误信息**：`@prisma/client did not initialize yet`
**解决方法**：
```bash
docker exec -it minna-backend npx prisma generate
docker restart minna-backend
```

#### 错误 2：数据库迁移未运行
**错误信息**：`Table 'Goal' does not exist`
**解决方法**：
```bash
docker exec -it minna-backend npx prisma migrate deploy
```

#### 错误 3：JSON 字段格式错误
**错误信息**：`Invalid JSON`
**原因**：`generatedData` 字段格式不正确
**检查**：确保传递的是有效的 JSON 对象

#### 错误 4：BigInt 序列化错误
**错误信息**：`Do not know how to serialize a BigInt`
**状态**：已修复（使用 serializeGoal 函数）

#### 错误 5：必填字段缺失
**错误信息**：`Missing required fields`
**检查**：确保传递了 title, description, startDate, endDate

## 前端请求数据格式

正确的请求格式应该是：
```json
{
  "title": "学习目标",
  "description": "详细描述",
  "category": "technical",
  "priority": "medium",
  "duration": 7,
  "startDate": "2025-01-27",
  "endDate": "2025-02-03",
  "status": "planning",
  "progress": 0,
  "targetSkills": ["skill1", "skill2"],
  "successCriteria": ["标准1", "标准2"],
  "milestones": null,
  "generatedData": {
    "inputData": {
      "myInputs": [],
      "aiInputs": []
    },
    "outputData": {
      "myOutputs": [],
      "aiOutputs": []
    }
  }
}
```

## 下一步

如果问题仍然存在，请提供：
1. 后端日志的完整错误信息
2. 浏览器控制台的网络请求详情（Request Payload）
3. 数据库连接测试结果

## 快速重启

如果需要完全重启服务：
```bash
# 停止所有服务
docker-compose down

# 清理并重启
docker-compose up -d --force-recreate

# 查看启动日志
docker-compose logs -f
```
