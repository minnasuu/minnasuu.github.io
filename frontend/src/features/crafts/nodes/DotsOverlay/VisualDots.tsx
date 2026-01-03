import React, { useEffect, useRef } from 'react';

interface VisualDotsProps {
  /** 点的颜色 */
  dotColor?: string;
  /** 点的大小（半径，单位：px） */
  dotSize?: number;
  /** 点的密度（点之间的间距，单位：px） */
  dotSpacing?: number;
  /** 是否启用鼠标交互效果，默认 false */
  enableInteraction?: boolean;
  /** 鼠标交互半径（单位：px） */
  interactionRadius?: number;
  /** 排斥力强度（0-1，数值越大排斥越远） */
  repulsionStrength?: number;
  /** 交互监听目标层级（向上查找几层父元素），默认 1（直接父元素） */
  interactionTargetLevel?: number;
  /** 是否启用出场动画，默认 false */
  enableEntrance?: boolean;
  /** 出场动画持续时间（单位：ms），默认 1000 */
  entranceDuration?: number;
  /** 容器类名 */
  className?: string;
  /** 容器样式 */
  style?: React.CSSProperties;
}

const VisualDots: React.FC<VisualDotsProps> = ({
  dotColor = '#EBEBEB',
  dotSize = 0.8,
  dotSpacing = 6,
  enableInteraction = true,
  interactionRadius = 100,
  repulsionStrength = 0.15,
  interactionTargetLevel = 2,
  enableEntrance = false,
  entranceDuration = 1000,
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // 缓存点的位置信息（原始位置、当前位置和透明度）
  const dotsCache = useRef<Array<{
    originalX: number;
    originalY: number;
    currentX: number;
    currentY: number;
    opacity: number;
    showTime: number;
  }>>([]);

  // 初始化点阵布局
  const initializeDots = (width: number, height: number) => {
    const dots: Array<{
      originalX: number;
      originalY: number;
      currentX: number;
      currentY: number;
      opacity: number;
      showTime: number;
    }> = [];

    for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
      for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
        dots.push({
          originalX: x,
          originalY: y,
          currentX: x,
          currentY: y,
          opacity: enableEntrance ? 0 : 1,
          showTime: 0,
        });
      }
    }

    // 如果启用出场动画，为每个点分配随机的显示时间
    if (enableEntrance) {
      const shuffledIndices = dots.map((_, i) => i).sort(() => Math.random() - 0.5);
      const timeStep = entranceDuration / dots.length;

      shuffledIndices.forEach((index, order) => {
        dots[index].showTime = order * timeStep;
      });
    }

    dotsCache.current = dots;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // 获取交互监听目标元素（向上查找指定层级）
    let interactionTarget: HTMLElement = parent;
    for (let i = 1; i < interactionTargetLevel; i++) {
      const nextParent = interactionTarget.parentElement;
      if (!nextParent) break;
      interactionTarget = nextParent;
    }

    // 获取上下文
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // 设置画布大小
    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // 重新设置画布尺寸会自动重置变换矩阵
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // 设置缩放比例以适配高分辨率屏幕
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // 重新初始化点阵
      initializeDots(width, height);
    };

    resize();

    // 使用 ResizeObserver 监听父容器尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resizeObserver.observe(parent);

    // 同时保留 window resize 监听作为备用
    window.addEventListener('resize', resize);

    // 在交互目标元素上监听鼠标事件（仅在启用交互时）
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    if (enableInteraction) {
      interactionTarget.addEventListener('mousemove', handleMouseMove);
      interactionTarget.addEventListener('mouseleave', handleMouseLeave);
    }

    // 绘制循环
    const startTime = Date.now();
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;
      const currentTime = Date.now() - startTime;

      // 清空画布
      ctx.clearRect(0, 0, width, height);

      // 更新并绘制所有点
      dotsCache.current.forEach((dot) => {
        // 更新出场动画透明度
        if (enableEntrance) {
          if (currentTime >= dot.showTime) {
            const fadeInDuration = 200; // 每个点淡入持续时间
            const timeSinceShow = currentTime - dot.showTime;
            dot.opacity = Math.min(1, timeSinceShow / fadeInDuration);
          }
        }

        if (enableInteraction) {
          // 计算鼠标到原始点位置的距离
          const dx = mouse.x - dot.originalX;
          const dy = mouse.y - dot.originalY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // 计算排斥力和新位置
          let offsetX = 0;
          let offsetY = 0;

          if (distance < interactionRadius && distance > 0) {
            // 计算排斥强度（离鼠标越近，排斥力越强）
            const force = (1 - distance / interactionRadius) * interactionRadius * repulsionStrength;

            // 计算排斥方向（远离鼠标）
            const angle = Math.atan2(dy, dx);
            offsetX = -Math.cos(angle) * force;
            offsetY = -Math.sin(angle) * force;
          }

          // 使用缓动动画平滑过渡到目标位置
          const targetX = dot.originalX + offsetX;
          const targetY = dot.originalY + offsetY;
          const easing = 0.15;

          dot.currentX += (targetX - dot.currentX) * easing;
          dot.currentY += (targetY - dot.currentY) * easing;
        } else {
          // 无交互时，点保持在原始位置
          dot.currentX = dot.originalX;
          dot.currentY = dot.originalY;
        }

        // 绘制点（考虑透明度）
        if (dot.opacity > 0) {
          // 解析颜色并应用透明度
          const color = dotColor;
          let fillColor = color;

          if (dot.opacity < 1) {
            // 如果是 rgba 格式
            if (color.startsWith('rgba')) {
              fillColor = color.replace(/[\d.]+\)$/g, `${dot.opacity})`);
            }
            // 如果是 rgb 格式
            else if (color.startsWith('rgb')) {
              fillColor = color.replace('rgb', 'rgba').replace(')', `, ${dot.opacity})`);
            }
            // 如果是十六进制格式
            else if (color.startsWith('#')) {
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const b = parseInt(color.slice(5, 7), 16);
              fillColor = `rgba(${r}, ${g}, ${b}, ${dot.opacity})`;
            }
          }

          ctx.fillStyle = fillColor;
          ctx.beginPath();
          ctx.arc(dot.currentX, dot.currentY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // 启动动画循环
    draw();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      if (enableInteraction) {
        interactionTarget.removeEventListener('mousemove', handleMouseMove);
        interactionTarget.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dotColor, dotSize, dotSpacing, enableInteraction, interactionRadius, repulsionStrength, interactionTargetLevel, enableEntrance, entranceDuration]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

export default VisualDots;
