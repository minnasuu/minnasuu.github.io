import React from "react";
import { Icon } from "@suminhan/land-design";

// Craft 类型定义
export interface Idea {
  /** 唯一标识 */
  id: string;
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 分类 */
  category: "concept" | "interaction" | "visual" | "animation" | "website"|"tool"|"technology"|"AI";
  /** 创建时间 */
  createdAt: string;
  /** 权重：默认为1 */
  weight: number;
  /** 关系 */
  relations?: {
    targetId: string;
    type: "extends" | "inspiredBy" | "variant" | "uses" | "relatedTo";
  }[];
  
  /** 预览图片 */
  image?: string;
  /** 预览视频 */
  video?: string;
  /** 适用场景 */
  useCase?: string;
  /** 来源链接 */
  linkUrl?: string;
}

// 分类标签
export const categoryLabels: Record<Idea["category"], { zh: string; en: string }> = {
  concept: { zh: "概念", en: "Concept" },
  interaction: { zh: "交互", en: "Interaction" },
  visual: { zh: "视觉", en: "Visual" },
  animation: { zh: "动画", en: "Animation" },
  website: { zh: "网站", en: "Website" },
  tool: { zh: "工具", en: "Tool" },
    technology: { zh: "技术", en: "Technology" },
    AI: { zh: "AI", en: "AI" },
};

// 根据实际权重计算显示等级 (1-5)
export const getWeightLevel = (effectiveWeight: number, maxWeight: number): number => {
  if (maxWeight <= 0) return 3;
  const ratio = effectiveWeight / maxWeight;
  if (ratio >= 0.8) return 5;
  if (ratio >= 0.6) return 4;
  if (ratio >= 0.4) return 3;
  if (ratio >= 0.2) return 2;
  return 1;
};

interface IdeaNodeProps {
  idea: Idea;
  position: { x: number; y: number; ring: number };
  effectiveWeight: number; // 实际权重 = weight * 分支数
  maxWeight: number; // 最大权重，用于归一化
  isActive: boolean;
  isRelated: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  language: "zh" | "en";
  editorMode?: boolean; // 是否为编辑模式
  onAddNode?: (craftId: string, direction: 'top' | 'right' | 'bottom' | 'left') => void;
  onDelete?: (craftId: string) => void; // 删除节点回调
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const IdeaNode: React.FC<IdeaNodeProps> = ({
  idea,
  position,
  effectiveWeight,
  maxWeight,
  isActive,
  isRelated,
  isHovered,
  isDimmed,
  language,
  editorMode = false,
  onAddNode,
  onDelete,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const hasRelations = idea.relations && idea.relations.length > 0;
  const weightLevel = getWeightLevel(effectiveWeight, maxWeight);

  const handleAddClick = (e: React.MouseEvent, direction: 'top' | 'right' | 'bottom' | 'left') => {
    e.stopPropagation();
    if (onAddNode) {
      onAddNode(idea.id, direction);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(idea.id);
    }
  };

  return (
    <div
      className={`crafts-node ${isActive ? "active" : ""} ${isRelated ? "related" : ""} ${isHovered ? "hovered" : ""} weight-${weightLevel}`}
      style={{
        left: position.x,
        top: position.y,
        opacity: isDimmed ? 0.3 : 1,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="node-inner">
        {idea.image && idea.image !== '__PENDING_DELETE__' ? (
          <img src={idea.image} alt={idea.name} />
        ) : idea.linkUrl ? (
          <div className="w-full h-full overflow-hidden">
            <iframe 
            src={idea.linkUrl} 
            title={idea.name}
            className="node-inner-iframe"
          /></div>
        ) : null}
        <div className="node-overlay">
          <span className="node-category">
            {categoryLabels[idea.category][language]}
          </span>
        </div>
        {hasRelations && (
          <div className="node-relation-indicator">
            <span>{idea.relations!.length}</span>
          </div>
        )}
        
        {/* 编辑模式：添加节点按钮 - 放在 node-inner 内部 */}
        {editorMode && (
          <div className="node-add-buttons">
            <button 
              className="add-btn add-top" 
              onClick={(e) => handleAddClick(e, 'top')}
              title="Add node above"
            >
              <Icon name="add" strokeWidth={4}/>
            </button>
            <button 
              className="add-btn add-right" 
              onClick={(e) => handleAddClick(e, 'right')}
              title="Add node to the right"
            >
              <Icon name="add" strokeWidth={4}/>
            </button>
            <button 
              className="add-btn add-bottom" 
              onClick={(e) => handleAddClick(e, 'bottom')}
              title="Add node below"
            >
              <Icon name="add" strokeWidth={4}/>
            </button>
            <button 
              className="add-btn add-left" 
              onClick={(e) => handleAddClick(e, 'left')}
              title="Add node to the left"
            >
              <Icon name="add" strokeWidth={4}/>
            </button>
          </div>
        )}
      </div>
      <div className="node-label">{idea.name}</div>
      
      {/* 编辑模式：删除按钮 - 放在节点下方 */}
      {editorMode && (
        <button 
          className="node-delete-btn"
          onClick={handleDeleteClick}
          title={language === "zh" ? "删除节点" : "Delete node"}
        >
          <Icon name="delete" size={14} />
        </button>
      )}
    </div>
  );
};

export default IdeaNode;
