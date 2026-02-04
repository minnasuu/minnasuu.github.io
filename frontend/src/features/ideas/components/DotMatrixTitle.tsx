import React from "react";

// 点阵字体定义 (5x7)
const DOT_PATTERNS: Record<string, number[][]> = {
  C: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  A: [
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  F: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  S: [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
};

interface DotMatrixTitleProps {
  text?: string;
  className?: string;
}

export const DotMatrixTitle: React.FC<DotMatrixTitleProps> = ({ 
  text = "CRAFTS", 
  className = "" 
}) => {
  return (
    <div className={`dot-matrix-title ${className}`}>
      {text.split("").map((char, charIdx) => (
        <div key={charIdx} className="dot-char">
          {DOT_PATTERNS[char]?.map((row, rowIdx) => (
            <div key={rowIdx} className="dot-row">
              {row.map((active, colIdx) => (
                <div
                  key={colIdx}
                  className={`dot ${active ? "active" : "inactive"}`}
                  style={{
                    animationDelay: `${charIdx * 0.1 + rowIdx * 0.05 + colIdx * 0.05}s`
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DotMatrixTitle;
