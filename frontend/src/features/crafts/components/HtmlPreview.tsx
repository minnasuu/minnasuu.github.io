import React, { useRef, useEffect } from "react";

interface HtmlPreviewProps {
  htmlCode: string;
  title?: string;
  className?: string;
  /** 是否允许脚本执行，默认 true */
  allowScripts?: boolean;
  style?: React.CSSProperties;
}

/**
 * HtmlPreview - 安全渲染 HTML 代码的沙箱组件
 * 使用 iframe srcdoc 将完整的 HTML（含样式和逻辑）渲染在隔离环境中
 */
export const HtmlPreview: React.FC<HtmlPreviewProps> = ({
  htmlCode,
  title = "Craft Preview",
  className,
  allowScripts = true,
  style,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      // 强制刷新 srcdoc 以确保代码变更生效
      iframeRef.current.srcdoc = htmlCode;
    }
  }, [htmlCode]);

  const sandbox = allowScripts
    ? "allow-scripts"
    : "";

  return (
    <iframe
      ref={iframeRef}
      srcDoc={htmlCode}
      title={title}
      className={className}
      style={{
        border: "none",
        width: "100%",
        height: "100%",
        ...style,
      }}
      sandbox={sandbox || undefined}
    />
  );
};

export default HtmlPreview;
