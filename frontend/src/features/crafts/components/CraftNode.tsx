import React from "react";
import { Icon } from "@suminhan/land-design";

/** 单个配置项定义 */
export interface ConfigItem {
  /** 配置项标识（传递给 HTML 的变量名） */
  key: string;
  /** 显示名称 */
  label: string;
  /** 配置项类型 */
  type: "range" | "color" | "select" | "toggle" | "number";
  /** 默认值 */
  defaultValue: number | string | boolean;
  /** range/number 最小值 */
  min?: number;
  /** range/number 最大值 */
  max?: number;
  /** range/number 步长 */
  step?: number;
  /** select 选项 */
  options?: { label: string; value: string | number }[];
}

// Craft 类型定义
export interface Craft {
  /** 唯一标识 */
  id: string;
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 分类 */
  category: "component" | "effect" | "control" | "demo" | "experiment";
  /** 技术栈 */
  technologies: string[];
  /** 创建时间 */
  createdAt: string;
  /** 是否为特色作品 */
  featured?: boolean;
  /** 权重：默认为1 */
  weight: number;
  /** 关系 */
  relations?: {
    targetId: string;
    type: "extends" | "inspiredBy" | "variant" | "uses" | "relatedTo";
  }[];
  /** 是否为AI生成 */
  isAI?: boolean;
  
  /** demo封面图 */
  coverImage?: string;
  /** HTML代码（包含样式和逻辑的完整HTML，用于渲染Craft Demo） */
  htmlCode?: string;
  /** 配置项 Schema（JSON 描述可调节参数，用于实时预览） */
  configSchema?: ConfigItem[];
  /** 适用场景 */
  useCase?: string;
  /** GitHub 地址 */
  githubUrl?: string;
  /** 详细内容 */
  content?: string;
}

// 分类标签
export const categoryLabels: Record<Craft["category"], { zh: string; en: string }> = {
  component: { zh: "组件", en: "Component" },
  effect: { zh: "视觉", en: "Effect" },
  control: { zh: "控件", en: "Control" },
  demo: { zh: "交互", en: "Interaction" },
  experiment: { zh: "动画", en: "Animation" },
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
  animIndex?: number; // 动画索引，用于错落有致的浮动效果
  onAddNode?: (craftId: string, direction: 'top' | 'right' | 'bottom' | 'left') => void;
  onDelete?: (craftId: string) => void; // 删除节点回调
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
  animIndex = 0,
  onAddNode,
  onDelete,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const hasRelations = craft.relations && craft.relations.length > 0;
  const weightLevel = getWeightLevel(effectiveWeight, maxWeight);

  // 基于 animIndex 确定性计算差异化动画参数
  const floatVariant = (animIndex % 3) + 1; // 1, 2, 3 三组运动轨迹
  const floatDelay = -((animIndex * 1.7) % 6); // 错开的负延迟，0~-6s
  const floatDuration = 5 + (animIndex * 0.7) % 3; // 5s~8s 不同周期
  const floatAmplitude = 12 + (animIndex * 3.1) % 16; // 12px~28px 不同幅度

  const handleAddClick = (e: React.MouseEvent, direction: 'top' | 'right' | 'bottom' | 'left') => {
    e.stopPropagation();
    if (onAddNode) {
      onAddNode(craft.id, direction);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(craft.id);
    }
  };

  return (
    <div
      className={`craft-node float-variant-${floatVariant} ${isActive ? "active" : ""} ${isRelated ? "related" : ""} ${isHovered ? "hovered" : ""} weight-${weightLevel}`}
      style={{
        left: position.x,
        top: position.y,
        opacity: isDimmed ? 0.3 : 1,
        '--float-delay': `${floatDelay}s`,
        '--float-duration': `${floatDuration}s`,
        '--float-y': `${floatAmplitude}px`,
      } as React.CSSProperties}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="node-inner">
        {craft.coverImage && craft.coverImage !== '__PENDING_DELETE__' ? (
          <img src={craft.coverImage} alt={craft.name} />
        ) : craft.htmlCode ? (
          <div className="node-html-wrapper">
            <iframe 
            srcDoc={craft.htmlCode} 
            title={craft.name}
            className="node-inner-iframe"
            sandbox="allow-scripts"
          /></div>
        ) : null}
        <div className="node-overlay">
          <span className="node-category">
            {categoryLabels[craft.category]?.[language] || craft.category}
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

export default CraftNode;
