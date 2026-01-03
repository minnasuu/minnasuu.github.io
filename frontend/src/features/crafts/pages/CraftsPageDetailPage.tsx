import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../../shared/contexts/LanguageContext";
import BackButton from "../../../shared/components/BackButton";
import { Icon } from "@suminhan/land-design";
import { fetchCraftById } from "../../../shared/utils/backendClient";
import type { Craft } from "../components/CraftNode";
import "../styles/CraftsDetailPage.scss";

const categoryLabels: Record<Craft["category"], { zh: string; en: string }> = {
  component: { zh: "组件", en: "Component" },
  effect: { zh: "效果", en: "Effect" },
  control: { zh: "控件", en: "Control" },
  demo: { zh: "演示", en: "Demo" },
  experiment: { zh: "实验", en: "Experiment" },
};

export const CraftsPageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [craft, setCraft] = useState<Craft | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'info' | 'demo'>('info');
  const [iframeLoading, setIframeLoading] = useState(true);
  const demoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCraft = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchCraftById(id);
        setCraft(data);
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

  // 滚动到 demo 区域
  const scrollToDemo = () => {
    demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection('demo');
  };

  // 监听滚动切换 section
  useEffect(() => {
    const handleScroll = () => {
      if (!demoSectionRef.current) return;
      const demoTop = demoSectionRef.current.getBoundingClientRect().top;
      setActiveSection(demoTop < window.innerHeight / 2 ? 'demo' : 'info');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              className={`nav-item ${activeSection === 'info' ? 'active' : ''}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {language === "zh" ? "信息" : "Info"}
            </button>
            {craft.demoUrl && (
              <button 
                className={`nav-item ${activeSection === 'demo' ? 'active' : ''}`}
                onClick={scrollToDemo}
              >
                {language === "zh" ? "演示" : "Demo"}
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

      {/* 第一屏：信息展示 */}
      <section className="info-section">
        {/* 封面图 */}
        <div className="cover-area">
          {craft.coverImage ? (
            <div className="cover-image">
              <img src={craft.coverImage} alt={craft.name} />
              <div className="cover-overlay"></div>
            </div>
          ) : (
            <div className="cover-placeholder">
              <Icon name="image" />
            </div>
          )}
        </div>

        {/* 信息内容 */}
        <div className="info-content">
          <div className="info-wrapper">
            {/* 元信息 */}
            <div className="craft-meta">
              <span className="craft-category">
                {categoryLabels[craft.category][language]}
              </span>
              {craft.featured && (
                <span className="featured-badge">
                  <Icon name="star-fill" size={12} />
                  {language === "zh" ? "精选" : "Featured"}
                </span>
              )}
              <span className="craft-date">
                {new Date(craft.createdAt).toLocaleDateString(
                  language === "zh" ? "zh-CN" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            </div>

            {/* 标题 */}
            <h1 className="craft-title">{craft.name}</h1>

            {/* 描述 */}
            <p className="craft-description">{craft.description}</p>

            {/* 详细内容 */}
            {craft.content && (
              <div className="craft-content">
                <p>{craft.content}</p>
              </div>
            )}

            {/* 技术栈 */}
            <div className="tech-stack">
              <h3 className="tech-title">
                {language === "zh" ? "技术栈" : "Tech Stack"}
              </h3>
              <div className="tech-tags">
                {craft.technologies.map((tech, idx) => (
                  <span key={idx} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 查看 Demo 按钮 */}
            {craft.demoUrl && (
              <button className="view-demo-btn" onClick={scrollToDemo}>
                <Icon name="video-pause" />
                <span>{language === "zh" ? "查看演示" : "View Demo"}</span>
                <Icon name="arrow-line" className="arrow-icon" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 第二屏：Demo 展示 */}
      {craft.demoUrl && (
        <section className="demo-section" ref={demoSectionRef}>
          <div className="demo-header">
            <h2 className="demo-title">
              {language === "zh" ? "在线演示" : "Live Demo"}
            </h2>
            <a
              href={craft.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="open-external-btn"
            >
              <Icon name="zoom-in-arrow" />
              <span>{language === "zh" ? "新窗口打开" : "Open in new tab"}</span>
            </a>
          </div>
          
          <div className="demo-container">
            {iframeLoading && (
              <div className="iframe-loading">
                <div className="loading-spinner"></div>
                <p>{language === "zh" ? "加载中..." : "Loading..."}</p>
              </div>
            )}
            <iframe
              src={craft.demoUrl}
              title={`${craft.name} Demo`}
              onLoad={() => setIframeLoading(false)}
              allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          </div>
        </section>
      )}

      {/* 无 Demo 时的占位 */}
      {!craft.demoUrl && (
        <section className="no-demo-section">
          <div className="no-demo-content">
            <Icon name="video-pause" />
            <p>{language === "zh" ? "暂无在线演示" : "No live demo available"}</p>
            {craft.githubUrl && (
              <a
                href={craft.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="view-source-btn"
              >
                <Icon name="code" />
                <span>{language === "zh" ? "查看源码" : "View Source"}</span>
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default CraftsPageDetailPage;
