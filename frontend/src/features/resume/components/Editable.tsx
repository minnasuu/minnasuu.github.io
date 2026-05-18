import React, { useEffect, useRef } from "react";

interface EditableProps {
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

/**
 * 通用可编辑文本组件
 * - editing=false：渲染只读节点
 * - editing=true：用 contentEditable 实现内联编辑，blur 时回写
 */
const Editable: React.FC<EditableProps> = ({
  value,
  editing,
  onChange,
  as = "span",
  className,
  placeholder,
  multiline = false,
}) => {
  const ref = useRef<HTMLElement | null>(null);

  // editing 切换 / 外部值变化时同步 DOM
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value, editing]);

  const Tag = as as React.ElementType;

  if (!editing) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      className={`${className || ""} resume-editable`.trim()}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const next = e.currentTarget.innerText.replace(/\u00A0/g, " ");
        if (next !== value) onChange(next);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    />
  );
};

export default Editable;
