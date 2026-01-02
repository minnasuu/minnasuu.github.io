import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../shared/contexts/LanguageContext";
import BackButton from "../../../shared/components/BackButton";
import { CraftNode, categoryLabels } from "../components/CraftNode";
import { DotMatrixTitle } from "../components/DotMatrixTitle";
import type { Craft } from "../components/CraftNode";
import "../styles/CraftsPage.scss";
import { Icon, LandButton } from "@suminhan/land-design";
import { mockCrafts } from "../mock";

// 关系类型标签
const relationLabels: Record<string, { zh: string; en: string; color: string }> = {
  extends: { zh: "扩展自", en: "Extends", color: "#8ca9ff" },    // Bright Indigo
  inspiredBy: { zh: "灵感源于", en: "Inspired by", color: "#f875aa" }, // Bright Pink
  variant: { zh: "同源变体", en: "Variant of", color: "#8ce4ff" },     // Bright Teal
  uses: { zh: "使用", en: "Uses", color: "#73af6f" },         // Bright Amber
  relatedTo: { zh: "相关概念", en: "Related to", color: "#ccc" },   // Soft Lavender
};


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

// 计算节点位置 - 使用随机分布 + 力导向优化保持均匀间距
const calculateNodePositions = (
  crafts: Craft[],
  containerWidth: number,
  containerHeight: number
) => {
  const positions: Map<string, { x: number; y: number; ring: number }> = new Map();
  const padding = 100; // 边界留白
  
  // 第一步：随机初始化位置
  crafts.forEach((craft) => {
    positions.set(craft.id, {
      x: padding + Math.random() * (containerWidth - padding * 2),
      y: padding + Math.random() * (containerHeight - padding * 2),
      ring: 0,
    });
  });

  // 第二步：力导向调整，保持均匀间距
  const iterations = 80; // 增加迭代次数以达到更稳定的布局
  const idealDistance = 800; // 理想节点间距
  const minDistance = 800; // 最小间距（防止重叠）
  const maxDistance = 1200; // 最大间距（防止过于分散）
  
  for (let iter = 0; iter < iterations; iter++) {
    const forces = new Map<string, { x: number; y: number }>();
    
    // 初始化力
    crafts.forEach((craft) => {
      forces.set(craft.id, { x: 0, y: 0 });
    });
    
    // 对所有节点对计算力
    for (let i = 0; i < crafts.length; i++) {
      for (let j = i + 1; j < crafts.length; j++) {
        const craft1 = crafts[i];
        const craft2 = crafts[j];
        const pos1 = positions.get(craft1.id)!;
        const pos2 = positions.get(craft2.id)!;
        
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
          let force = 0;
          
          // 距离小于最小值：强排斥
          if (dist < minDistance) {
            force = -((minDistance - dist) / minDistance) * 3;
          }
          // 距离在最小和理想之间：轻微排斥
          else if (dist < idealDistance) {
            force = -((idealDistance - dist) / idealDistance) * 0.8;
          }
          // 距离在理想和最大之间：轻微吸引
          else if (dist < maxDistance) {
            force = ((dist - idealDistance) / (maxDistance - idealDistance)) * 0.5;
          }
          // 距离大于最大值：强吸引
          else {
            force = ((dist - maxDistance) / maxDistance) * 1.5;
          }
          
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          const f1 = forces.get(craft1.id)!;
          const f2 = forces.get(craft2.id)!;
          f1.x += fx;
          f1.y += fy;
          f2.x -= fx;
          f2.y -= fy;
        }
      }
    }
    
    // 对有关系的节点施加额外的轻微吸引力
    crafts.forEach((craft) => {
      if (!craft.relations) return;
      
      const pos1 = positions.get(craft.id)!;
      craft.relations.forEach((rel) => {
        const pos2 = positions.get(rel.targetId);
        if (!pos2) return;
        
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > idealDistance) {
          // 轻微吸引，让相关节点更接近理想距离
          const force = ((dist - idealDistance) / dist) * 0.3;
          const fx = dx * force;
          const fy = dy * force;
          
          const f1 = forces.get(craft.id)!;
          f1.x += fx;
          f1.y += fy;
        }
      });
    });
    
    // 应用力并更新位置（使用阻尼减少震荡）
    const damping = 0.5; // 阻尼系数，随迭代次数递减
    const dampingFactor = damping * (1 - iter / iterations);
    
    crafts.forEach((craft) => {
      const pos = positions.get(craft.id)!;
      const force = forces.get(craft.id)!;
      
      // 应用阻尼后更新位置
      pos.x += force.x * (0.5 + dampingFactor);
      pos.y += force.y * (0.5 + dampingFactor);
      
      // 限制在边界内
      pos.x = Math.max(padding, Math.min(containerWidth - padding, pos.x));
      pos.y = Math.max(padding, Math.min(containerHeight - padding, pos.y));
    });
  }

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
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  // 搜索过滤
  const filteredCrafts = useMemo(() => {
    if (!searchQuery.trim()) return crafts;
    
    const query = searchQuery.toLowerCase();
    return crafts.filter(craft => 
      craft.name.toLowerCase().includes(query) ||
      craft.description.toLowerCase().includes(query) ||
      craft.technologies.some(tech => tech.toLowerCase().includes(query)) ||
      categoryLabels[craft.category].zh.toLowerCase().includes(query) ||
      categoryLabels[craft.category].en.toLowerCase().includes(query)
    );
  }, [crafts, searchQuery]);

  // 搜索结果 ID 集合（用于高亮）
  const searchResultIds = useMemo(() => {
    return new Set(filteredCrafts.map(c => c.id));
  }, [filteredCrafts]);

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
    return calculateNodePositions(crafts, canvasWidth, canvasHeight);
  }, [crafts, canvasWidth, canvasHeight]);

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

  // 居中到搜索结果
  const centerToSearchResults = useCallback(() => {
    if (filteredCrafts.length === 0 || dimensions.width === 0) return;
    
    // 计算所有搜索结果的中心点
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    
    filteredCrafts.forEach(craft => {
      const pos = nodePositions.get(craft.id);
      if (pos) {
        sumX += pos.x;
        sumY += pos.y;
        count++;
      }
    });
    
    if (count > 0) {
      const centerX = sumX / count;
      const centerY = sumY / count;
      
      const newOffset = {
        x: dimensions.width / 2 - centerX,
        y: dimensions.height / 2 - centerY,
      };
      
      setViewOffset(clampViewOffset(newOffset));
    }
  }, [filteredCrafts, nodePositions, dimensions, clampViewOffset]);

  // 当搜索结果变化时，自动居中到结果
  useEffect(() => {
    if (layoutMode === "canvas" && searchQuery.trim() && filteredCrafts.length > 0) {
      // 延迟一小段时间以确保布局已完成
      const timer = setTimeout(() => {
        centerToSearchResults();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, filteredCrafts.length, layoutMode, centerToSearchResults]);

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
        
        {/* 搜索框 */}
        <div className="search-container">
          <Icon name="search" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={language === "zh" ? "搜索作品、技术、分类..." : "Search crafts, tech, category..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <Icon name="close" />
            </button>
          )}
        </div>

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
            {searchQuery ? (
              <>
                {filteredCrafts.length} / {crafts.length} {language === "zh" ? "个作品" : "crafts"}
              </>
            ) : (
              <>
                {crafts.length} {language === "zh" ? "个作品" : "crafts"}
              </>
            )}
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
              const isSearchResult = searchResultIds.has(craft.id);
              const isDimmed = (relatedNodes.size > 0 && !isRelated) || (searchQuery.trim() !== "" && !isSearchResult);
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
            {searchQuery ? (
              <>
                {filteredCrafts.length} / {crafts.length} {language === "zh" ? "个作品" : "crafts"}
              </>
            ) : (
              <>
                {crafts.length} {language === "zh" ? "个作品" : "crafts"}
              </>
            )}
          </div>
        </div>
          <div className="grid-layout">
            {filteredCrafts.length > 0 ? (
              filteredCrafts.map((craft) => (
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
              ))
            ) : (
              <div className="no-results">
                <Icon name="search" className="no-results-icon" />
                <p className="no-results-text">
                  {language === "zh" ? "未找到匹配的作品" : "No crafts found"}
                </p>
                <p className="no-results-hint">
                  {language === "zh" ? "尝试使用其他关键词" : "Try different keywords"}
                </p>
              </div>
            )}
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
                  height: "2px",
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
                  <span className="legend-arrow" style={{ color: style.color,fontWeight: type === 'extends' ? 'bold':'normal'}}>→</span>
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
