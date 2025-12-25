import type { ThemeStyle } from '../shared/types';

// 主题背景色配置
export const themeBackgrounds: Record<ThemeStyle, string> = {
  terminal: '#0a0a0a',
  ai: '#ffffff',
  wechat: '#ededed'
};

// 主题背景渐变配置
export const themeBackgroundGradients: Record<ThemeStyle, string> = {
  terminal: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  ai: '#ffffff',
  wechat: '#ededed'
};

// 主题文字颜色配置
export const themeTextColors: Record<ThemeStyle, string> = {
  terminal: '#00ff00',
  ai: '#374151',
  wechat: '#000000'
};

// 主题过渡动画配置
export const themeTransitions: Record<ThemeStyle, string> = {
  terminal: 'all 0.1s ease',
  ai: 'all 0.3s ease',
  wechat: 'all 0.3s ease'
};

// 应用主题背景色到body
export const applyThemeBackground = (theme: ThemeStyle) => {
  const body = document.body;
  const root = document.getElementById('root');
  
  if (body) {
    // 使用渐变背景
    body.style.background = themeBackgroundGradients[theme];
    body.style.color = themeTextColors[theme];
    body.style.transition = themeTransitions[theme];
    
    // 移除所有主题类名
    body.classList.remove('theme-minimal', 'theme-pixel', 'theme-terminal', 'theme-magazine', 'theme-neon', 'theme-ai', 'theme-wechat');
    // 添加当前主题类名
    body.classList.add(`theme-${theme}`);
  }
  
  if (root) {
    root.style.background = themeBackgroundGradients[theme];
    root.style.transition = themeTransitions[theme];
  }
};

// 重置主题背景色
export const resetThemeBackground = () => {
  const body = document.body;
  const root = document.getElementById('root');
  
  if (body) {
    body.style.backgroundColor = '';
    body.style.color = '';
    body.style.transition = '';
    // 移除所有主题类名
    body.classList.remove('theme-minimal', 'theme-pixel', 'theme-terminal', 'theme-magazine', 'theme-neon', 'theme-ai', 'theme-wechat');
  }
  
  if (root) {
    root.style.backgroundColor = '';
    root.style.transition = '';
  }
};
