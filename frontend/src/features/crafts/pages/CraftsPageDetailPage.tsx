import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../../shared/contexts/LanguageContext";
import BackButton from "../../../shared/components/BackButton";
import { Icon } from "@suminhan/land-design";
import { fetchCraftById } from "../../../shared/utils/backendClient";
import type { Craft, ConfigItem } from "../components/CraftNode";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import "../styles/CraftsDetailPage.scss";

const categoryLabels: Record<Craft["category"], { zh: string; en: string }> = {
  component: { zh: "组件", en: "Component" },
  effect: { zh: "视觉", en: "Effect" },
  control: { zh: "控件", en: "Control" },
  demo: { zh: "交互", en: "Interaction" },
  experiment: { zh: "动画", en: "Animation" },
};

/** 将配置值注入 HTML，通过 postMessage 传递给 iframe */
const injectConfigToHtml = (html: string, config: Record<string, any>): string => {
  const configScript = `
<script>
  window.__CRAFT_CONFIG__ = ${JSON.stringify(config)};
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === '__CRAFT_CONFIG_UPDATE__') {
      window.__CRAFT_CONFIG__ = e.data.config;
      if (typeof window.__onConfigChange__ === 'function') {
        window.__onConfigChange__(e.data.config);
      }
    }
  });
</script>`;
  // 在 </head> 或 <body> 前注入，如果都没有就在最前面
  if (html.includes('</head>')) {
    return html.replace('</head>', configScript + '</head>');
  } else if (html.includes('<body')) {
    return html.replace('<body', configScript + '<body');
  }
  return configScript + html;
};

export const CraftsPageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [craft, setCraft] = useState<Craft | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'preview' | 'code'>('preview');
  const [configValues, setConfigValues] = useState<Record<string, any>>({});
  const [configPanelOpen, setConfigPanelOpen] = useState(true);
  const codeSectionRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadCraft = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchCraftById(id);
        setCraft(data);
        // 初始化配置默认值
        if (data?.configSchema && data.configSchema.length > 0) {
          const defaults: Record<string, any> = {};
          data.configSchema.forEach((item: ConfigItem) => {
            defaults[item.key] = item.defaultValue;
          });
          setConfigValues(defaults);
        }
      } catch (error) {
        console.error('Failed to load craft:', error);
        setCraft(null);
      } finally {
        setLoading(false);
      }
    };
    loadCraft();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 配置变更时通知 iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: '__CRAFT_CONFIG_UPDATE__',
        config: configValues,
      }, '*');
    }
  }, [configValues]);

  // 滚动到代码区域
  const scrollToCode = () => {
    codeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection('code');
  };

  // 监听滚动切换 section
  useEffect(() => {
    const handleScroll = () => {
      if (!codeSectionRef.current) return;
      const codeTop = codeSectionRef.current.getBoundingClientRect().top;
      setActiveSection(codeTop < window.innerHeight / 2 ? 'code' : 'preview');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 复制 HTML 代码
  const handleCopyCode = useCallback(() => {
    if (craft?.htmlCode) {
      navigator.clipboard.writeText(craft.htmlCode);
    }
  }, [craft?.htmlCode]);

  // 更新单个配置值
  const updateConfig = useCallback((key: string, value: any) => {
    setConfigValues(prev => ({ ...prev, [key]: value }));
  }, []);

  // 重置配置到默认值
  const resetConfig = useCallback(() => {
    if (!craft?.configSchema) return;
    const defaults: Record<string, any> = {};
    craft.configSchema.forEach((item: ConfigItem) => {
      defaults[item.key] = item.defaultValue;
    });
    setConfigValues(defaults);
  }, [craft?.configSchema]);

  // 带配置注入的 HTML
  const injectedHtml = useMemo(() => {
    if (!craft?.htmlCode) return '';
    if (!craft.configSchema || craft.configSchema.length === 0) return craft.htmlCode;
    return injectConfigToHtml(craft.htmlCode, configValues);
  }, [craft?.htmlCode, craft?.configSchema, configValues]);

  const hasConfig = craft?.configSchema && craft.configSchema.length > 0;

  if (loading) {
    return (
      <div className="crafts-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!craft) {
    return (
      <div className="crafts-detail-page">
        <div className="error-state">
          <h2>{language === "zh" ? "作品未找到" : "Craft not found"}</h2>
          <BackButton to="/crafts" />
        </div>
      </div>
    );
  }

  return (
    <div className="crafts-detail-page">
      {/* 固定导航 */}
      <header className="detail-header">
        <div className="header-content">
          <BackButton to="/crafts" />
          
          {/* Section 切换 */}
          <nav className="section-nav">
            <button 
              className={`nav-item ${activeSection === 'preview' ? 'active' : ''}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {language === "zh" ? "预览" : "Preview"}
            </button>
            {craft.htmlCode && (
              <button 
                className={`nav-item ${activeSection === 'code' ? 'active' : ''}`}
                onClick={scrollToCode}
              >
                {language === "zh" ? "代码" : "Code"}
              </button>
            )}
          </nav>

          <div className="header-actions">
            {craft.githubUrl && (
              <a
                href={craft.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn"
              >
                <Icon name="code" />
                <span>Source</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 第一屏：预览 + 配置 */}
      <section className="preview-section">
        {/* 预览区域 */}
        <div className={`preview-area ${hasConfig && configPanelOpen ? 'with-config' : ''}`}>
          {craft.htmlCode ? (
            <div className="preview-frame">
              <iframe
                ref={iframeRef}
                srcDoc={injectedHtml}
                title={craft.name}
                sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
              />
            </div>
          ) : craft.coverImage ? (
            <div className="preview-cover">
              <img src={craft.coverImage} alt={craft.name} />
            </div>
          ) : (
            <div className="preview-empty">
              <Icon name="image" />
              <p>{language === "zh" ? "暂无预览" : "No preview available"}</p>
            </div>
          )}

          {/* 预览底部信息栏 */}
          <div className="preview-info-bar">
            <div className="preview-info-left">
              <span className="preview-category">
                {categoryLabels[craft.category]?.[language] || craft.category}
              </span>
              <h2 className="preview-title">{craft.name}</h2>
            </div>
            <div className="preview-info-right">
              {craft.technologies.slice(0, 4).map((tech, idx) => (
                <span key={idx} className="preview-tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 配置面板 */}
        {hasConfig && (
          <div className={`config-panel ${configPanelOpen ? 'open' : 'closed'}`}>
            <button 
              className="config-toggle"
              onClick={() => setConfigPanelOpen(!configPanelOpen)}
            >
              <Icon name={configPanelOpen ? "arrow-line" : "setting"} 
                style={configPanelOpen ? { transform: 'rotate(-90deg)' } : undefined}
              />
            </button>
            
            {configPanelOpen && (
              <div className="config-content">
                <div className="config-header">
                  <h3>{language === "zh" ? "配置项" : "Configuration"}</h3>
                  <button className="config-reset" onClick={resetConfig}>
                    <Icon name="refresh" size={14} />
                    <span>{language === "zh" ? "重置" : "Reset"}</span>
                  </button>
                </div>

                <div className="config-items">
                  {craft.configSchema!.map((item: ConfigItem) => (
                    <div key={item.key} className="config-item">
                      <label className="config-label">
                        <span>{item.label}</span>
                        {item.type === 'range' && (
                          <span className="config-value">{configValues[item.key]}</span>
                        )}
                      </label>
                      
                      {item.type === 'range' && (
                        <input
                          type="range"
                          min={item.min}
                          max={item.max}
                          step={item.step}
                          value={configValues[item.key] ?? item.defaultValue}
                          onChange={(e) => updateConfig(item.key, parseFloat(e.target.value))}
                          className="config-range"
                        />
                      )}
                      
                      {item.type === 'number' && (
                        <input
                          type="number"
                          min={item.min}
                          max={item.max}
                          step={item.step}
                          value={configValues[item.key] ?? item.defaultValue}
                          onChange={(e) => updateConfig(item.key, parseFloat(e.target.value))}
                          className="config-number"
                        />
                      )}
                      
                      {item.type === 'color' && (
                        <div className="config-color-wrapper">
                          <input
                            type="color"
                            value={configValues[item.key] ?? item.defaultValue}
                            onChange={(e) => updateConfig(item.key, e.target.value)}
                            className="config-color"
                          />
                          <span className="config-color-value">{configValues[item.key]}</span>
                        </div>
                      )}
                      
                      {item.type === 'select' && (
                        <select
                          value={configValues[item.key] ?? item.defaultValue}
                          onChange={(e) => updateConfig(item.key, e.target.value)}
                          className="config-select"
                        >
                          {item.options?.map(opt => (
                            <option key={String(opt.value)} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {item.type === 'toggle' && (
                        <button
                          className={`config-toggle-btn ${configValues[item.key] ? 'active' : ''}`}
                          onClick={() => updateConfig(item.key, !configValues[item.key])}
                        >
                          <span className="toggle-knob" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* 信息摘要 */}
                <div className="config-info">
                  <p className="config-description">{craft.description}</p>
                  {craft.featured && (
                    <span className="config-featured">
                      <Icon name="star-fill" size={12} />
                      {language === "zh" ? "精选" : "Featured"}
                    </span>
                  )}
                  {craft.useCase && (
                    <div className="config-usecase">
                      <span className="usecase-label">{language === "zh" ? "适用场景" : "Use Case"}</span>
                      <p>{craft.useCase}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 无配置面板时，显示浮动信息卡片 */}
        {!hasConfig && (
          <div className="preview-overlay-info">
            <p className="overlay-description">{craft.description}</p>
            {craft.content && <p className="overlay-content">{craft.content}</p>}
            {craft.useCase && (
              <div className="overlay-usecase">
                <span>{language === "zh" ? "适用场景" : "Use Case"}</span>
                <p>{craft.useCase}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 第二屏：代码 + 详细信息 */}
      {craft.htmlCode && (
        <section className="code-section" ref={codeSectionRef}>
          <div className="code-header">
            <div className="code-header-left">
              <h2 className="code-title">
                {language === "zh" ? "源代码" : "Source Code"}
              </h2>
              <span className="code-lang-badge">HTML</span>
            </div>
            <div className="code-header-actions">
              <button
                className="copy-code-btn"
                onClick={handleCopyCode}
              >
                <Icon name="copy" />
                <span>{language === "zh" ? "复制代码" : "Copy Code"}</span>
              </button>
            </div>
          </div>
          
          <div className="code-body">
            <div className="code-main">
              <SyntaxHighlighter
                language="html"
                customStyle={{
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  padding: "20px",
                  margin: 0,
                }}
              >
                {craft.htmlCode?.trim() || ""}
              </SyntaxHighlighter>
            </div>
            
            {/* 代码区右侧信息 */}
            <div className="code-sidebar">
              <div className="sidebar-section">
                <h3>{language === "zh" ? "关于" : "About"}</h3>
                <p>{craft.description}</p>
              </div>

              {craft.content && (
                <div className="sidebar-section">
                  <h3>{language === "zh" ? "详细说明" : "Details"}</h3>
                  <p>{craft.content}</p>
                </div>
              )}

              <div className="sidebar-section">
                <h3>{language === "zh" ? "技术栈" : "Tech Stack"}</h3>
                <div className="sidebar-tags">
                  {craft.technologies.map((tech, idx) => (
                    <span key={idx} className="sidebar-tag">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h3>{language === "zh" ? "信息" : "Info"}</h3>
                <div className="sidebar-meta">
                  <div className="meta-row">
                    <span className="meta-label">{language === "zh" ? "分类" : "Category"}</span>
                    <span className="meta-value">{categoryLabels[craft.category]?.[language] || craft.category}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">{language === "zh" ? "创建时间" : "Created"}</span>
                    <span className="meta-value">
                      {new Date(craft.createdAt).toLocaleDateString(
                        language === "zh" ? "zh-CN" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </span>
                  </div>
                  {craft.featured && (
                    <div className="meta-row">
                      <span className="meta-label">{language === "zh" ? "状态" : "Status"}</span>
                      <span className="meta-value featured">
                        <Icon name="star-fill" size={12} />
                        {language === "zh" ? "精选" : "Featured"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {craft.githubUrl && (
                <a
                  href={craft.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-link"
                >
                  <Icon name="code" />
                  <span>{language === "zh" ? "查看源码仓库" : "View Repository"}</span>
                  <Icon name="arrow-line" style={{ transform: 'rotate(-90deg)' }} />
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 无代码时的信息展示 */}
      {!craft.htmlCode && (
        <section className="info-only-section">
          <div className="info-only-content">
            <div className="info-only-meta">
              <span className="info-category">
                {categoryLabels[craft.category]?.[language] || craft.category}
              </span>
              {craft.featured && (
                <span className="info-featured">
                  <Icon name="star-fill" size={12} />
                  {language === "zh" ? "精选" : "Featured"}
                </span>
              )}
            </div>
            <h1 className="info-title">{craft.name}</h1>
            <p className="info-description">{craft.description}</p>
            {craft.content && <p className="info-detail">{craft.content}</p>}
            <div className="info-tech">
              {craft.technologies.map((tech, idx) => (
                <span key={idx} className="info-tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CraftsPageDetailPage;
