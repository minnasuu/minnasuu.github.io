import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { getComponentConfig } from './interactive';

interface InteractiveMarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * 解析 Markdown 中的交互组件标记
 * 语法：:::component{type="counter" label="点击次数" initial="0"}
 */
const parseInteractiveComponents = (html: string): {
  html: string;
  components: Array<{ id: string; type: string; props: Record<string, any> }>;
} => {
  const components: Array<{ id: string; type: string; props: Record<string, any> }> = [];
  let componentIndex = 0;

  // 替换 HTML 中的占位符为可挂载的 div
  const processedHtml = html.replace(
    /:::component\{([^}]+)\}/g,
    (match, propsString) => {
      try {
        // 解析 props 字符串
        const props: Record<string, any> = {};
        const propsRegex = /(\w+)="([^"]*)"/g;
        let propMatch;

        while ((propMatch = propsRegex.exec(propsString)) !== null) {
          const [, key, value] = propMatch;
          // 尝试解析数字和布尔值
          if (value === 'true') props[key] = true;
          else if (value === 'false') props[key] = false;
          else if (!isNaN(Number(value)) && value !== '') props[key] = Number(value);
          else props[key] = value;
        }

        const type = props.type;
        delete props.type;

        if (!type) {
          console.error('Component type is required');
          return match;
        }

        const componentId = `interactive-component-${componentIndex++}`;
        components.push({ id: componentId, type, props });

        return `<div id="${componentId}" class="interactive-component-placeholder"></div>`;
      } catch (error) {
        console.error('Failed to parse component props:', error);
        return match;
      }
    }
  );

  return { html: processedHtml, components };
};

/**
 * 交互式 Markdown 渲染器
 * 将 Markdown 中的组件标记渲染为真实的 React 组件
 */
const InteractiveMarkdownRenderer: React.FC<InteractiveMarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Map<string, ReactDOM.Root>>(new Map());

  useEffect(() => {
    if (!containerRef.current) return;

    const { html, components } = parseInteractiveComponents(content);

    // 设置 HTML 内容
    containerRef.current.innerHTML = html;

    // 清理旧的 React roots
    rootsRef.current.forEach((root) => {
      try {
        root.unmount();
      } catch (error) {
        console.error('Failed to unmount root:', error);
      }
    });
    rootsRef.current.clear();

    // 渲染组件
    components.forEach(({ id, type, props }) => {
      const placeholder = document.getElementById(id);
      if (!placeholder) {
        console.warn(`Placeholder not found for component: ${id}`);
        return;
      }

      const config = getComponentConfig(type);
      if (!config) {
        console.error(`Unknown component type: ${type}`);
        placeholder.innerHTML = `<div class="text-red-500 text-sm p-2 border border-red-300 rounded">未知组件类型: ${type}</div>`;
        return;
      }

      try {
        const root = ReactDOM.createRoot(placeholder);
        root.render(React.createElement(config.component, props));
        rootsRef.current.set(id, root);
      } catch (error) {
        console.error(`Failed to render component ${type}:`, error);
        placeholder.innerHTML = `<div class="text-red-500 text-sm p-2 border border-red-300 rounded">组件渲染失败: ${type}</div>`;
      }
    });

    // 清理函数
    return () => {
      rootsRef.current.forEach((root) => {
        try {
          root.unmount();
        } catch (error) {
          console.error('Failed to unmount root:', error);
        }
      });
      rootsRef.current.clear();
    };
  }, [content]);

  return <div ref={containerRef} className={className} />;
};

export default InteractiveMarkdownRenderer;
