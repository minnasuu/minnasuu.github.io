# Idea节点关系编辑功能

## 功能概述
在Idea节点编辑面板中新增了完整的关系管理功能，支持增删改节点间的关系。

## 新增功能

### 1. 关系编辑UI
在节点详情编辑面板中新增"节点关系"编辑区域，位于"适用场景"字段之后。

**功能包括**：
- ✅ 显示当前节点的所有关系
- ✅ 添加新关系
- ✅ 编辑现有关系（修改关系类型和目标节点）
- ✅ 删除关系
- ✅ 实时显示目标节点的分类信息

### 2. 关系类型支持
支持5种关系类型，每种类型都有独特的颜色标识：

| 关系类型 | 中文 | 英文 | 颜色 | 说明 |
|---------|------|------|------|------|
| `extends` | 扩展自 | Extends | #8ca9ff | 表示继承或扩展关系 |
| `inspiredBy` | 灵感源于 | Inspired by | #f875aa | 表示灵感来源 |
| `variant` | 同源变体 | Variant of | #8ce4ff | 表示同源的不同变体 |
| `uses` | 使用 | Uses | #73af6f | 表示使用或依赖关系 |
| `relatedTo` | 相关概念 | Related to | #ccc | 表示一般关联 |

### 3. 交互设计

#### 添加关系
1. 点击"节点关系"标题旁的 ➕ 按钮
2. 自动添加一个新的空关系项
3. 默认关系类型为"相关概念"（relatedTo）

#### 编辑关系
- **关系类型**：通过下拉选择器选择，使用对应颜色高亮显示
- **目标节点**：通过下拉选择器选择，自动过滤掉当前节点
- **分类标签**：选择目标节点后，自动显示目标节点的分类

#### 删除关系
点击关系项右侧的删除按钮（🗑️图标）

### 4. 数据验证
- 空的关系（未选择目标节点）在保存时会被自动过滤
- 关系会与节点其他信息一起保存到数据库

## 技术实现

### 前端修改

#### 1. 类型定义更新
```typescript
// editNodeForm 添加 relations 字段
const [editNodeForm, setEditNodeForm] = useState<{
  name: string;
  description: string;
  category: Idea['category'];
  weight: number;
  image: string;
  originalImage: string;
  video: string;
  useCase: string;
  linkUrl: string;
  relations: { targetId: string; type: "extends" | "inspiredBy" | "variant" | "uses" | "relatedTo" }[];
} | null>(null);
```

#### 2. 新增处理函数
- `handleAddRelation()` - 添加新关系
- `handleRemoveRelation(index)` - 删除指定索引的关系
- `handleUpdateRelation(index, field, value)` - 更新关系字段

#### 3. 更新保存逻辑
在 `handleUpdateCraft()` 函数中，relations字段会：
- 编辑模式：添加到临时变更队列
- 非编辑模式：直接调用API更新

#### 4. UI组件
新增关系编辑器组件，包含：
- 关系列表（`.relations-list`）
- 关系项（`.relation-item`）
- 类型选择器（`.relation-type-select`）
- 目标选择器（`.relation-target-select`）
- 删除按钮（`.remove-relation-btn`）

### 样式设计

#### 特点
- 🎨 简洁现代的卡片式设计
- 🌈 关系类型使用对应的品牌色
- ✨ 流畅的hover和focus交互效果
- 🌓 支持深色模式
- 📱 响应式布局

#### 关键样式
```scss
.relations-editor {
  .relations-header {
    // 头部：标题 + 添加按钮
  }
  
  .no-relations {
    // 空状态提示
  }
  
  .relations-list {
    // 关系列表容器
  }
  
  .relation-item {
    // 单个关系项
    // 包含：类型选择器 + 目标选择器 + 删除按钮
  }
}
```

### 后端API

后端已有完整的关系管理API（无需修改）：

```javascript
// 创建/更新 idea，包含 relations 字段
PUT /api/ideas/:id
{
  name: string,
  description: string,
  category: string,
  weight: number,
  relations: Array<{ targetId: string, type: string }>
}
```

## 使用场景

### 场景1：建立技术依赖关系
```
前端组件 --[uses]--> 设计系统
前端组件 --[extends]--> 基础组件
```

### 场景2：记录灵感来源
```
新设计 --[inspiredBy]--> 优秀案例
新设计 --[variant]--> 原始设计
```

### 场景3：组织知识网络
```
概念A --[relatedTo]--> 概念B
概念A --[relatedTo]--> 概念C
```

## 工作流程

1. **进入编辑模式**
   - 点击编辑按钮进入Idea编辑模式

2. **选择节点**
   - 点击要编辑的节点，右侧显示详情面板

3. **编辑关系**
   - 滚动到"节点关系"部分
   - 点击 ➕ 添加新关系
   - 选择关系类型和目标节点
   - 可继续添加更多关系

4. **保存更改**
   - 点击"保存"按钮保存当前节点
   - 或点击工具栏的"保存"按钮保存所有更改

## 视觉效果

### 关系列表
- 每个关系项显示为独立卡片
- 关系类型用彩色标签表示
- 目标节点名称清晰显示
- 悬停时有视觉反馈

### 空状态
当没有关系时，显示友好的空状态提示：
```
┌─────────────────────────┐
│                         │
│      暂无关系           │
│                         │
└─────────────────────────┘
```

### 添加按钮
右上角圆形 ➕ 按钮，悬停时有放大效果

## 注意事项

1. **循环关系**：系统不会自动检测循环关系，需要用户自行管理
2. **重复关系**：前端允许添加重复关系，但建议避免
3. **目标节点筛选**：自动排除当前节点，防止自引用
4. **空关系过滤**：保存时会自动过滤掉未选择目标的关系

## 未来优化方向

- [ ] 添加关系验证（避免循环、重复）
- [ ] 关系可视化预览
- [ ] 批量管理关系
- [ ] 反向关系自动建立
- [ ] 关系搜索和过滤
- [ ] 关系强度权重
- [ ] 关系历史记录

## 相关文件

### 前端
- `frontend/src/features/ideas/pages/IdeasPage.tsx` - 主要逻辑和UI
- `frontend/src/features/ideas/styles/IdeasEditorPage.scss` - 样式定义
- `frontend/src/features/ideas/components/IdeaNode.tsx` - 节点类型定义

### 后端
- `backend/routes/ideas.js` - API路由（已有）
- `backend/routes/crafts.js` - 参考实现

## 更新日期
2026-02-05

## 作者
AI Assistant
