import { LandButton } from "@suminhan/land-design";
import React, { type CSSProperties } from "react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type Props = {
  language?: string;
  codeStr?: string;
  style?: CSSProperties;
  className?: string;
};
const ArticleCode: React.FC<Props> = ({
  language = "text",
  codeStr = "",
  style,
  className = "",
}) => {
  // @ts-ignore
  const [isCopied, setIsCopied] = useState<number>(-1);
  const handleCopy = async () => {
    if (!codeStr) return;
    try {
      await navigator.clipboard.writeText(codeStr);
      setIsCopied(1);
    } catch (err) {
      setIsCopied(2);
    }
  };
  return (
    <div
      className={`flex flex-col w-full rounded-lg bg-gray border-box border border-gray-200 bg-white overflow-hidden ${className}`}
      style={{ marginBlock: "12px", ...style }}
    >
      <div
        className="flex items-center justify-between w-full bg-gray-3 border-b border-gray-200 border-box"
        style={{ padding: "8px 16px" }}
      >
        <p className="font-bold" style={{marginBottom:0}}>{language}</p>
        <div className="flex items-center gap-12">
          <LandButton type="transparent" onClick={handleCopy} text="复制" />
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        wrapLongLines
        showLineNumbers
        customStyle={{
          // 自定义容器样式
          borderRadius: "8px",
          backgroundColor: "transparent",
          padding: "20px",
        }}
      >
        {codeStr.trim()}
      </SyntaxHighlighter>
    </div>
  );
};
export default ArticleCode;
