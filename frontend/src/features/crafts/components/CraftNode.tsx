import React from "react";
import { Icon } from "@suminhan/land-design";

// Craft 类型定义
export interface Craft {
  id: string;
  name: string;
  description: string;
  category: "component" | "effect" | "control" | "demo" | "experiment";
  technologies: string[];
  coverImage?: string;
  createdAt: string;
  /** 是否为特色作品 */
  featured?: boolean;
  weight?: number; // 人工调节权重，默认1
  relations?: {
    targetId: string;
    type: "extends" | "inspiredBy" | "variant" | "uses" | "relatedTo";
  }[];
}

// 分类标签
export const categoryLabels: Record<Craft["category"], { zh: string; en: string }> = {
  component: { zh: "组件", en: "Component" },
  effect: { zh: "效果", en: "Effect" },
  control: { zh: "控件", en: "Control" },
  demo: { zh: "演示", en: "Demo" },
  experiment: { zh: "实验", en: "Experiment" },
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

interface CraftNodeProps {
  craft: Craft;
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
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const CraftNode: React.FC<CraftNodeProps> = ({
  craft,
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
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const hasRelations = craft.relations && craft.relations.length > 0;
  const weightLevel = getWeightLevel(effectiveWeight, maxWeight);

  const handleAddClick = (e: React.MouseEvent, direction: 'top' | 'right' | 'bottom' | 'left') => {
    e.stopPropagation();
    if (onAddNode) {
      onAddNode(craft.id, direction);
    }
  };

  return (
    <div
      className={`craft-node ${isActive ? "active" : ""} ${isRelated ? "related" : ""} ${isHovered ? "hovered" : ""} weight-${weightLevel}`}
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
        {craft.coverImage && (
          <img src={craft.coverImage} alt={craft.name} />
        )}
        <div className="node-overlay">
          <span className="node-category">
            {categoryLabels[craft.category][language]}
          </span>
        </div>
        {hasRelations && (
          <div className="node-relation-indicator">
            <span>{craft.relations!.length}</span>
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
      <div className="node-label">{craft.name}</div>
    </div>
  );
};

export default CraftNode;
