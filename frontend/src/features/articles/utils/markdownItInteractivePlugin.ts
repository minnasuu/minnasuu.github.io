/**
 * MarkdownIt 插件：支持交互组件语法
 * 语法：:::component{type="counter" label="点击次数" initial="0"}
 */

export default function interactiveComponentPlugin(md: any) {
  // 添加自定义规则来识别组件标记
  md.block.ruler.before('fence', 'interactive_component', (state: any, startLine: number, _endLine: number, silent: boolean) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const lineText = state.src.slice(pos, max);

    // 匹配 :::component{...}
    const match = lineText.match(/^:::component\{([^}]+)\}/);
    if (!match) return false;

    if (silent) return true;

    // 解析 props
    const propsString = match[1];
    const props: Record<string, string> = {};
    const propsRegex = /(\w+)="([^"]*)"/g;
    let propMatch;

    while ((propMatch = propsRegex.exec(propsString)) !== null) {
      props[propMatch[1]] = propMatch[2];
    }

    // 生成唯一 ID
    const componentId = `ic-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // 创建 token
    const token = state.push('interactive_component', 'div', 0);
    token.attrs = [
      ['id', componentId],
      ['class', 'interactive-component-placeholder'],
      ['data-component-type', props.type || ''],
      ['data-component-props', JSON.stringify(props)],
    ];
    token.content = '';

    state.line = startLine + 1;
    return true;
  });

  // 渲染规则
  md.renderer.rules.interactive_component = (tokens: any[], idx: number) => {
    const token = tokens[idx];
    const attrs = token.attrs || [];
    const attrStr = attrs.map(([key, value]: [string, string]) => `${key}="${value}"`).join(' ');
    return `<div ${attrStr}></div>`;
  };
}
