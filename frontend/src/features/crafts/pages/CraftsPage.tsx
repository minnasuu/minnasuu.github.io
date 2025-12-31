import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../shared/contexts/LanguageContext";
import BackButton from "../../../shared/components/BackButton";
import { CraftNode, categoryLabels } from "../components/CraftNode";
import { DotMatrixTitle } from "../components/DotMatrixTitle";
import type { Craft } from "../components/CraftNode";
import "../styles/CraftsPage.scss";
import { Icon, LandButton } from "@suminhan/land-design";

// 关系类型标签
const relationLabels: Record<string, { zh: string; en: string; color: string }> = {
  extends: { zh: "扩展自", en: "Extends", color: "#8ca9ff" },    // Bright Indigo
  inspiredBy: { zh: "灵感源于", en: "Inspired by", color: "#f875aa" }, // Bright Pink
  variant: { zh: "同源变体", en: "Variant of", color: "#8ce4ff" },     // Bright Teal
  uses: { zh: "使用", en: "Uses", color: "#73af6f" },         // Bright Amber
  relatedTo: { zh: "相关概念", en: "Related to", color: "#ccc" },   // Soft Lavender
};

// 示例数据 - 包含关系
const mockCrafts: Craft[] = [
  {
    id: "1",
    name: "Glassmorphism Card",
    description: "A beautiful frosted glass effect card component with blur and transparency",
    category: "component",
    technologies: ["React", "CSS", "Backdrop-filter"],
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    createdAt: "2024-12-20",
    featured: true,
    weight: 2,
  },
  {
    id: "2",
    name: "Magnetic Button",
    description: "Interactive button that follows cursor with magnetic effect",
    category: "effect",
    technologies: ["React", "Framer Motion", "TypeScript"],
    coverImage: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600",
    createdAt: "2024-12-15",
    weight: 1.5,
    relations: [{ targetId: "6", type: "uses" }],
  },
  {
    id: "3",
    name: "Infinite Scroll Gallery",
    description: "Smooth infinite scrolling image gallery with lazy loading",
    category: "component",
    technologies: ["React", "Intersection Observer", "CSS Grid"],
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600",
    createdAt: "2024-12-10",
    featured: true,
    weight: 1.5,
    relations: [{ targetId: "1", type: "extends" }],
  },
  {
    id: "4",
    name: "3D Flip Card",
    description: "Card component with smooth 3D flip animation on hover",
    category: "effect",
    technologies: ["CSS 3D", "Transform", "Perspective"],
    coverImage: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600",
    createdAt: "2024-12-05",
    weight: 1,
    relations: [
      { targetId: "1", type: "variant" },
      { targetId: "7", type: "inspiredBy" },
    ],
  },
  {
    id: "5",
    name: "Custom Range Slider",
    description: "Fully customizable range slider with gradient track",
    category: "control",
    technologies: ["React", "CSS Variables", "TypeScript"],
    coverImage: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600",
    createdAt: "2024-11-28",
    weight: 1,
  },
  {
    id: "6",
    name: "Particle System",
    description: "Interactive particle animation system with mouse interaction",
    category: "experiment",
    technologies: ["Canvas", "JavaScript", "RequestAnimationFrame"],
    coverImage: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600",
    createdAt: "2024-11-20",
    featured: true,
    weight: 2,
  },
  {
    id: "7",
    name: "Morphing Shapes",
    description: "SVG shapes that smoothly morph between different forms",
    category: "experiment",
    technologies: ["SVG", "GSAP", "React"],
    coverImage: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600",
    createdAt: "2024-11-15",
    weight: 1.2,
    relations: [{ targetId: "6", type: "relatedTo" }],
  },
  {
    id: "8",
    name: "Drag & Drop List",
    description: "Smooth drag and drop reorderable list component",
    category: "control",
    technologies: ["React", "Framer Motion", "TypeScript"],
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    createdAt: "2024-11-10",
    weight: 1,
    relations: [{ targetId: "2", type: "uses" }],
  },
  {
    id: "9",
    name: "Animated Counter",
    description: "Number counter with smooth spring animations",
    category: "component",
    technologies: ["React", "Framer Motion"],
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
    createdAt: "2024-11-05",
    weight: 1,
  },
  {
    id: "10",
    name: "Spotlight Effect",
    description: "Mouse-following spotlight reveal effect",
    category: "effect",
    technologies: ["CSS", "JavaScript", "Clip-path"],
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    createdAt: "2024-10-28",
    weight: 1,
    relations: [{ targetId: "2", type: "relatedTo" }],
  },
  {
    id: "11",
    name: "Toast Notifications",
    description: "Stackable toast notification system",
    category: "component",
    technologies: ["React", "TypeScript", "CSS"],
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600",
    createdAt: "2024-10-20",
    weight: 1,
  },
  {
    id: "12",
    name: "Skeleton Loader",
    description: "Animated skeleton loading placeholders",
    category: "component",
    technologies: ["React", "CSS Animation"],
    coverImage: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600",
    createdAt: "2024-10-15",
    weight: 1,
    relations: [{ targetId: "1", type: "extends" }],
  },
];

// 计算每个节点的分支数（出度 + 入度）
const calculateBranchCounts = (crafts: Craft[]): Map<string, number> => {
  const counts = new Map<string, number>();
  
  // 初始化所有节点的分支数为0
  crafts.forEach(craft => counts.set(craft.id, 0));
  
  // 计算分支数
  crafts.forEach(craft => {
    const outDegree = craft.relations?.length || 0;
    counts.set(craft.id, (counts.get(craft.id) || 0) + outDegree);
    
    // 计算入度（被引用次数）
    craft.relations?.forEach(rel => {
      counts.set(rel.targetId, (counts.get(rel.targetId) || 0) + 1);
    });
  });
  
  return counts;
};

// 计算实际权重 = weight * (分支数 + 1)
const calculateEffectiveWeights = (crafts: Craft[]): Map<string, number> => {
  const branchCounts = calculateBranchCounts(crafts);
  const weights = new Map<string, number>();
  
  crafts.forEach(craft => {
    const baseWeight = craft.weight || 1;
    const branchCount = branchCounts.get(craft.id) || 0;
    // 实际权重 = 人工权重 * (分支数 + 1)，+1 确保无分支节点也有权重
    weights.set(craft.id, baseWeight * (branchCount + 1));
  });
  
  return weights;
};

// 计算节点位置 - 使用力导向布局思想
const calculateNodePositions = (
  crafts: Craft[],
  containerWidth: number,
  containerHeight: number,
  effectiveWeights: Map<string, number>
) => {
  const positions: Map<string, { x: number; y: number; ring: number }> = new Map();
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // 根据实际权重排序，权重高的在内圈
  const craftsByWeight = [...crafts].sort((a, b) => {
    const aWeight = effectiveWeights.get(a.id) || 1;
    const bWeight = effectiveWeights.get(b.id) || 1;
    return bWeight - aWeight;
  });

  // 分配到不同的环
  const rings = [
    { radius: Math.min(containerWidth, containerHeight) * 0.15, count: 0, maxCount: 3 },
    { radius: Math.min(containerWidth, containerHeight) * 0.28, count: 0, maxCount: 5 },
    { radius: Math.min(containerWidth, containerHeight) * 0.4, count: 0, maxCount: 8 },
    { radius: Math.min(containerWidth, containerHeight) * 0.52, count: 0, maxCount: 12 },
  ];

  craftsByWeight.forEach((craft) => {
    // 找到可用的环
    let ringIndex = rings.findIndex((r) => r.count < r.maxCount);
    if (ringIndex === -1) ringIndex = rings.length - 1;

    const ring = rings[ringIndex];
    const angleOffset = (ring.count / Math.max(ring.maxCount, ring.count + 1)) * Math.PI * 2;
    const jitter = (Math.random() - 0.5) * 0.3; // 添加一些随机偏移

    positions.set(craft.id, {
      x: centerX + Math.cos(angleOffset + jitter) * ring.radius,
      y: centerY + Math.sin(angleOffset + jitter) * ring.radius,
      ring: ringIndex,
    });

    ring.count++;
  });

  return positions;
};

type LayoutMode = "canvas" | "grid";

export const CraftsPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMinimapDragging, setIsMinimapDragging] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("canvas");
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);

  // 画布尺寸（2倍视口）
  const canvasWidth = dimensions.width * 2;
  const canvasHeight = dimensions.height * 2;

  // 限制画布偏移量，确保不能完全移出边界
  const clampViewOffset = useCallback((offset: { x: number; y: number }) => {
    if (dimensions.width === 0 || dimensions.height === 0) return offset;
    
    // 边界：画布至少有 20% 在视口内
    const minVisibleRatio = 0.2;
    const minX = -(canvasWidth - dimensions.width * minVisibleRatio);
    const maxX = dimensions.width * (1 - minVisibleRatio);
    const minY = -(canvasHeight - dimensions.height * minVisibleRatio);
    const maxY = dimensions.height * (1 - minVisibleRatio);
    
    return {
      x: Math.max(minX, Math.min(maxX, offset.x)),
      y: Math.max(minY, Math.min(maxY, offset.y)),
    };
  }, [dimensions, canvasWidth, canvasHeight]);

  const crafts = mockCrafts;

  // 计算实际权重
  const effectiveWeights = useMemo(() => calculateEffectiveWeights(crafts), [crafts]);
  
  // 计算最大权重（用于归一化）
  const maxWeight = useMemo(() => {
    let max = 0;
    effectiveWeights.forEach(w => { if (w > max) max = w; });
    return max;
  }, [effectiveWeights]);

  // 计算节点位置
  const nodePositions = useMemo(() => {
    if (dimensions.width === 0) return new Map();
    return calculateNodePositions(crafts, canvasWidth, canvasHeight, effectiveWeights);
  }, [crafts, canvasWidth, canvasHeight, effectiveWeights]);

  // 获取与当前节点相关的所有连线
  const getRelatedConnections = useCallback(
    (craftId: string | null) => {
      if (!craftId) return new Set<string>();
      const related = new Set<string>();
      related.add(craftId);

      crafts.forEach((craft) => {
        if (craft.id === craftId) {
          craft.relations?.forEach((r) => related.add(r.targetId));
        }
        if (craft.relations?.some((r) => r.targetId === craftId)) {
          related.add(craft.id);
        }
      });

      return related;
    },
    [crafts]
  );

  const relatedNodes = useMemo(
    () => getRelatedConnections(hoveredId || activeId),
    [hoveredId, activeId, getRelatedConnections]
  );

  // 更新尺寸并初始化居中
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setDimensions({ width, height });
        
        // 首次加载时居中画布
        if (!isInitialized && width > 0 && height > 0) {
          // 画布大小是 dimensions * 2，所以需要偏移 -width/2 和 -height/2 来居中
          setViewOffset({
            x: -width / 2,
            y: -height / 2,
          });
          setIsInitialized(true);
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isInitialized]);

  // 拖拽处理 - 只在画布模式下启用
  const handleMouseDown = (e: React.MouseEvent) => {
    if (layoutMode !== "canvas") return;
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-bg")) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (layoutMode !== "canvas" || !isDragging) return;
    const newOffset = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    setViewOffset(clampViewOffset(newOffset));
  };

  const handleMouseUp = () => {
    if (layoutMode !== "canvas") return;
    setIsDragging(false);
  };

  // 滚轮/触控板处理 - 只在画布模式下移动画布
  const handleWheel = useCallback((e: WheelEvent) => {
    if (layoutMode !== "canvas") return;
    e.preventDefault();
    setViewOffset(prev => clampViewOffset({
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY,
    }));
  }, [clampViewOffset, layoutMode]);

  // 迷你地图拖拽处理
  const handleMinimapMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimapDragging(true);
    updateViewFromMinimap(e);
  };

  const handleMinimapMouseMove = (e: React.MouseEvent) => {
    if (isMinimapDragging) {
      updateViewFromMinimap(e);
    }
  };

  const handleMinimapMouseUp = () => {
    setIsMinimapDragging(false);
  };

  const updateViewFromMinimap = (e: React.MouseEvent) => {
    if (!minimapRef.current || dimensions.width === 0) return;
    
    const rect = minimapRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    
    // 将迷你地图位置转换为画布偏移
    // 点击位置应该成为视口中心
    const newOffset = {
      x: -(relativeX * canvasWidth) + dimensions.width / 2,
      y: -(relativeY * canvasHeight) + dimensions.height / 2,
    };
    setViewOffset(clampViewOffset(newOffset));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  // 点击节点
  const handleNodeClick = (craftId: string) => {
    setActiveId((prev) => (prev === craftId ? null : craftId));
  };

  // 居中到某个节点
  const centerToNode = (craftId: string) => {
    const pos = nodePositions.get(craftId);
    if (pos && dimensions.width > 0) {
      const newOffset = {
        x: dimensions.width / 2 - pos.x,
        y: dimensions.height / 2 - pos.y,
      };
      setViewOffset(clampViewOffset(newOffset));
    }
  };

  // 重置视图
  const resetView = () => {
    setViewOffset(clampViewOffset({ 
      x: -dimensions.width / 2, 
      y: -dimensions.height / 2 
    }));
    setActiveId(null);
  };

  const activeCraft = crafts.find((c) => c.id === activeId);

  // 渲染连线
  const renderConnections = () => {
    const lines: React.ReactElement[] = [];

    crafts.forEach((craft) => {
      const fromPos = nodePositions.get(craft.id);
      if (!fromPos || !craft.relations) return;

      craft.relations.forEach((relation, idx) => {
        const toPos = nodePositions.get(relation.targetId);
        if (!toPos) return;

        // 只有 hover 时才显示相关线条
        const isVisible =
          hoveredId === craft.id || hoveredId === relation.targetId;
        
        if (!isVisible) return;

        const relationStyle = relationLabels[relation.type];

        // 计算贝塞尔曲线控制点
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const curvature = Math.min(dist * 0.2, 50);
        const perpX = -dy / dist * curvature;
        const perpY = dx / dist * curvature;

        // 所有类型都使用贝塞尔曲线
        const pathD = `M ${fromPos.x} ${fromPos.y} Q ${midX + perpX} ${midY + perpY} ${toPos.x} ${toPos.y}`;

        // 根据关系类型设置线条样式
        let strokeWidth: number;
        let strokeDasharray: string;
        let hasArrow: boolean;

        switch (relation.type) {
          case "extends":
            strokeWidth = 2.5; // 粗实线
            strokeDasharray = "none";
            hasArrow = true;
            break;
          case "variant":
            strokeWidth = 1.5; // 波浪线
            strokeDasharray = "none";
            hasArrow = false;
            break;
          case "inspiredBy":
            strokeWidth = 1.5; // 虚线
            strokeDasharray = "6 3";
            hasArrow = true;
            break;
          case "uses":
            strokeWidth = 1.5; // 实线
            strokeDasharray = "none";
            hasArrow = true;
            break;
          case "relatedTo":
            strokeWidth = 1.5; // 点线
            strokeDasharray = "2 4";
            hasArrow = false;
            break;
          default:
            strokeWidth = 1.5;
            strokeDasharray = "none";
            hasArrow = true;
        }

        lines.push(
          <g key={`${craft.id}-${relation.targetId}-${idx}`} className="connection-group">
            {/* variant 类型使用双实线 */}
            {relation.type === "variant" ? (
              <>
                <path
                  d={pathD}
                  fill="none"
                  stroke={relationStyle.color}
                  strokeWidth={1}
                  strokeOpacity={0.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="connection-line"
                  style={{ transform: 'translateY(-2px)' }}
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke={relationStyle.color}
                  strokeWidth={1}
                  strokeOpacity={0.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="connection-line"
                  style={{ transform: 'translateY(2px)' }}
                />
              </>
            ) : (
              <>
                {/* 连线 */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={relationStyle.color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={0.6}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="connection-line"
                />
                {/* 流动箭头（仅在需要时显示） */}
                {hasArrow && (
                  <path
                    d="M-6,-3 L0,0 L-6,3"
                    fill="none"
                    stroke={relationStyle.color}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="connection-arrow"
                  >
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={pathD}
                      rotate="auto"
                    />
                  </path>
                )}
              </>
            )}
          </g>
        );
      });
    });

    return lines;
  };

  return (
    <div
      className="crafts-page"
      ref={containerRef}
      onMouseDown={layoutMode === "canvas" ? handleMouseDown : undefined}
      onMouseMove={layoutMode === "canvas" ? handleMouseMove : undefined}
      onMouseUp={layoutMode === "canvas" ? handleMouseUp : undefined}
      onMouseLeave={layoutMode === "canvas" ? handleMouseUp : undefined}
    >
      {/* 背景 */}
      <div className="crafts-bg">
        <div className="bg-gradient"></div>
        <div className="bg-grid"></div>
      </div>

      {/* 顶部导航 */}
      <header className="crafts-header">
        <BackButton to="/" />
        <div className="header-controls">
            {layoutMode === "canvas" && (
              <LandButton 
                type="fill" 
                status="default" 
                icon={<Icon name="refresh"/>} 
                className="control-btn" 
                onClick={resetView}
              />
            )}
            <LandButton 
              type="fill" 
              status="default" 
              icon={<Icon name={layoutMode === "canvas" ? "application" : "zoom-in"}/>} 
              className="control-btn" 
              onClick={() => setLayoutMode(layoutMode === "canvas" ? "grid" : "canvas")}
            />
        </div>
      </header>

      {/* 中心标题 */}
      {layoutMode === "canvas" && (
        <div className="center-title">
          <DotMatrixTitle />
          <p className="subtitle">
            {language === "zh" ? "拖拽或滑动探索" : "Drag or scroll to explore"}
          </p>
          <div className="craft-count">
            {crafts.length} {language === "zh" ? "个作品" : "crafts"}
          </div>
        </div>
      )}

      {/* 画布 */}
      {layoutMode === "canvas" ? (
        <div
          className="canvas-container"
          ref={canvasRef}
          style={{
            transform: `translate(${viewOffset.x}px, ${viewOffset.y}px)`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <div className="canvas-bg" />

          {/* SVG 连线层 */}
          <svg className="connections-layer" style={{ width: canvasWidth, height: canvasHeight }}>
            <defs>
              {Object.entries(relationLabels).map(([type, style]) => (
                <linearGradient key={type} id={`gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={style.color} stopOpacity="0.3" />
                  <stop offset="50%" stopColor={style.color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={style.color} stopOpacity="0.3" />
                </linearGradient>
              ))}
            </defs>
            {renderConnections()}
          </svg>

          {/* 节点层 */}
          <div className="nodes-layer">
            {crafts.map((craft) => {
              const pos = nodePositions.get(craft.id);
              if (!pos) return null;

              const isActive = activeId === craft.id;
              const isRelated = relatedNodes.has(craft.id);
              const isHovered = hoveredId === craft.id;
              const isDimmed = relatedNodes.size > 0 && !isRelated;
              const craftEffectiveWeight = effectiveWeights.get(craft.id) || 1;

              return (
                <CraftNode
                  key={craft.id}
                  craft={craft}
                  position={pos}
                  effectiveWeight={craftEffectiveWeight}
                  maxWeight={maxWeight}
                  isActive={isActive}
                  isRelated={isRelated}
                  isHovered={isHovered}
                  isDimmed={isDimmed}
                  language={language}
                  onClick={() => handleNodeClick(craft.id)}
                  onMouseEnter={() => setHoveredId(craft.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid-container">
            <div className="grid center-title">
          <DotMatrixTitle />
          <div className="craft-count">
            {crafts.length} {language === "zh" ? "个作品" : "crafts"}
          </div>
        </div>
          <div className="grid-layout">
            {crafts.map((craft) => (
              <div
                key={craft.id}
                className={`grid-card ${activeId === craft.id ? "active" : ""}`}
                onClick={() => handleNodeClick(craft.id)}
              >
                <div className="grid-card-image">
                  {craft.coverImage && (
                    <img src={craft.coverImage} alt={craft.name} />
                  )}
                  {craft.featured && (
                    <div className="featured-badge">
                      {language === "zh" ? "精选" : "Featured"}
                    </div>
                  )}
                </div>
                <div className="grid-card-content">
                  <span className="grid-card-category">
                    {categoryLabels[craft.category][language]}
                  </span>
                  <h3 className="grid-card-name">{craft.name}</h3>
                  <p className="grid-card-description">{craft.description}</p>
                  <div className="grid-card-tech">
                    {craft.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                    {craft.technologies.length > 3 && (
                      <span className="tech-more">+{craft.technologies.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 关系图例 */}
      {layoutMode === "canvas" && (
        <div className="legend">
          <div className="legend-title">{language === "zh" ? "关系类型" : "Relations"}</div>
          {Object.entries(relationLabels).map(([type, style]) => {
            // 根据类型设置不同的线条样式和箭头
            let lineStyle: React.CSSProperties = {};
            let showArrow = true;
            
            switch (type) {
              case "extends":
                lineStyle = {
                  background: style.color,
                  height: "3px",
                };
                break;
              case "variant":
                // 双实线效果
                lineStyle = {
                  background: `linear-gradient(${style.color} 0, ${style.color} 1px, transparent 1px, transparent 3px, ${style.color} 3px, ${style.color} 4px)`,
                  height: "4px",
                  backgroundSize: "100% 4px",
                };
                showArrow = false;
                break;
              case "inspiredBy":
                lineStyle = {
                  background: `repeating-linear-gradient(90deg, ${style.color} 0, ${style.color} 6px, transparent 6px, transparent 9px)`,
                };
                break;
              case "uses":
                lineStyle = {
                  background: style.color,
                };
                break;
              case "relatedTo":
                lineStyle = {
                  background: `repeating-linear-gradient(90deg, ${style.color} 0, ${style.color} 2px, transparent 2px, transparent 6px)`,
                };
                showArrow = false;
                break;
              default:
                lineStyle = { background: style.color };
            }
            
            return (
              <div key={type} className="legend-item">
                <span className="legend-line" style={lineStyle}></span>
                {showArrow && (
                  <span className="legend-arrow" style={{ color: style.color }}>→</span>
                )}
                <span className="legend-label">{style[language]}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 详情面板 */}
      {activeCraft && (
        <div className="detail-panel">
           <LandButton type="background" status="default" icon={<Icon name="close"/>} className="panel-close" onClick={() => setActiveId(null)}/>

          <div className="panel-image">
            {activeCraft.coverImage && (
              <img src={activeCraft.coverImage} alt={activeCraft.name} />
            )}
          </div>

          <div className="panel-content">
            <span className="panel-category">
              {categoryLabels[activeCraft.category][language]}
            </span>
            <h2 className="panel-name">{activeCraft.name}</h2>
            <p className="panel-description">{activeCraft.description}</p>

            <div className="panel-tech">
              {activeCraft.technologies.map((tech, idx) => (
                <span key={idx} className="tech-tag">{tech}</span>
              ))}
            </div>

            {activeCraft.relations && activeCraft.relations.length > 0 && (
              <div className="panel-relations">
                <h4>{language === "zh" ? "关联作品" : "Related Crafts"}</h4>
                {activeCraft.relations.map((rel, idx) => {
                  const targetCraft = crafts.find((c) => c.id === rel.targetId);
                  if (!targetCraft) return null;
                  return (
                    <button
                      key={idx}
                      className="relation-link"
                      onClick={() => {
                        setActiveId(rel.targetId);
                        centerToNode(rel.targetId);
                      }}
                    >
                      <span
                        className="relation-type"
                        style={{ color: relationLabels[rel.type].color }}
                      >
                        {relationLabels[rel.type][language]}
                      </span>
                      <span className="relation-name">{targetCraft.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <Link to={`/crafts/${activeCraft.id}`} className="panel-link">
              {language === "zh" ? "查看详情" : "View Details"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* 迷你地图 */}
      {layoutMode === "canvas" && (
        <div 
          className="minimap"
          ref={minimapRef}
          onMouseDown={handleMinimapMouseDown}
          onMouseMove={handleMinimapMouseMove}
          onMouseUp={handleMinimapMouseUp}
          onMouseLeave={handleMinimapMouseUp}
        >
          <div className="minimap-content">
            {crafts.map((craft) => {
              const pos = nodePositions.get(craft.id);
              if (!pos) return null;
              return (
                <div
                  key={craft.id}
                  className={`minimap-dot ${activeId === craft.id ? "active" : ""}`}
                  style={{
                    left: `${(pos.x / canvasWidth) * 100}%`,
                    top: `${(pos.y / canvasHeight) * 100}%`,
                  }}
                />
              );
            })}
            <div
              className="minimap-viewport"
              style={{
                left: `${(-viewOffset.x / canvasWidth) * 100}%`,
                top: `${(-viewOffset.y / canvasHeight) * 100}%`,
                width: `${(dimensions.width / canvasWidth) * 100}%`,
                height: `${(dimensions.height / canvasHeight) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* 操作提示 */}
      {layoutMode === "canvas" && (
        <div className="hints">
          <span>{language === "zh" ? "拖拽移动" : "Drag to pan"}</span>
          <span>{language === "zh" ? "滑动浏览" : "Scroll to browse"}</span>
          <span>{language === "zh" ? "点击查看" : "Click to select"}</span>
        </div>
      )}
    </div>
  );
};

export default CraftsPage;
