import React from 'react';
import InputSection, { InputSectionRef } from './InputSection';
import type { AIToDoListDataType, MyToDoListDataType, ThemeStyle } from '../../../shared/types';

interface OutputSectionProps {
  goalTitle: string;
  theme?: ThemeStyle;
  // AI生成的初始数据
  initialMyOutputs?: MyToDoListDataType[];
  initialAIOutputs?: AIToDoListDataType[];
  // 数据变更回调
  onMyOutputsChange?: (inputs: MyToDoListDataType[]) => void;
  onAIOutputsChange?: (inputs: AIToDoListDataType[]) => void;
  // 是否只读模式
  readonly?: boolean;
}

// 导出相同的 ref 接口
export interface OutputSectionRef extends InputSectionRef {}

const OutputSection = React.forwardRef<OutputSectionRef, OutputSectionProps>(({
  goalTitle='输出',
  theme='light',
  initialAIOutputs,
  initialMyOutputs,
  onMyOutputsChange,
  onAIOutputsChange,
}, ref) => {
  return (
    <InputSection
      ref={ref}
      goalTitle={goalTitle}
      theme={theme}
      initialAIInputs={initialAIOutputs}
      initialMyInputs={initialMyOutputs}
      onAIInputsChange={onAIOutputsChange}
      onMyInputsChange={onMyOutputsChange}
    />
  );
});

OutputSection.displayName = 'OutputSection';

export default OutputSection;