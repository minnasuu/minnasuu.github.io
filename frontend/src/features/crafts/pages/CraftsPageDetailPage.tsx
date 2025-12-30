import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../../shared/contexts/LanguageContext";
import BackButton from "../../../shared/components/BackButton";
import { Icon } from "@suminhan/land-design";
import "../styles/CraftsDetailPage.scss";

// Craft 类型定义
interface Craft {
  id: string;
  name: string;
  description: string;
  category: "component" | "effect" | "control" | "demo" | "experiment";
  technologies: string[];
  coverImage?: string;
  createdAt: string;
  featured?: boolean;
  githubUrl?: string;
  demoUrl?: string;
  content?: string;
}

// 示例数据 - 与列表页保持一致
const mockCrafts: Craft[] = [
  {
    id: "1",
    name: "Glassmorphism Card",
    description: "A beautiful frosted glass effect card component with blur and transparency. This component demonstrates modern CSS techniques including backdrop-filter for creating stunning glass-like effects.",
    category: "component",
    technologies: ["React", "CSS", "Backdrop-filter", "TypeScript"],
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
    createdAt: "2024-12-20",
    featured: true,
    githubUrl: "https://github.com",
    demoUrl: "#",
    content: "This glassmorphism card component uses CSS backdrop-filter to create a frosted glass effect. It's perfect for creating modern, elegant UI elements that stand out while maintaining readability.",
  },
  {
    id: "2",
    name: "Magnetic Button",
    description: "Interactive button that follows cursor with magnetic effect. Built with Framer Motion for smooth animations.",
    category: "effect",
    technologies: ["React", "Framer Motion", "TypeScript"],
    coverImage: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200",
    createdAt: "2024-12-15",
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    name: "Infinite Scroll Gallery",
    description: "Smooth infinite scrolling image gallery with lazy loading and optimized performance.",
    category: "component",
    technologies: ["React", "Intersection Observer", "CSS Grid"],
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200",
    createdAt: "2024-12-10",
    featured: true,
  },
  {
    id: "4",
    name: "3D Flip Card",
    description: "Card component with smooth 3D flip animation on hover",
    category: "effect",
    technologies: ["CSS 3D", "Transform", "Perspective"],
    coverImage: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1200",
    createdAt: "2024-12-05",
  },
  {
    id: "5",
    name: "Custom Range Slider",
    description: "Fully customizable range slider with gradient track",
    category: "control",
    technologies: ["React", "CSS Variables", "TypeScript"],
    coverImage: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200",
    createdAt: "2024-11-28",
  },
  {
    id: "6",
    name: "Particle System",
    description: "Interactive particle animation system with mouse interaction",
    category: "experiment",
    technologies: ["Canvas", "JavaScript", "RequestAnimationFrame"],
    coverImage: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200",
    createdAt: "2024-11-20",
    featured: true,
  },
];

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

  useEffect(() => {
    // 模拟 API 请求
    const loadCraft = async () => {
      setLoading(true);
      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = mockCrafts.find((c) => c.id === id);
      setCraft(found || null);
      setLoading(false);
    };
    loadCraft();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
      {/* 顶部导航 */}
      <header className="detail-header">
        <div className="header-content">
          <BackButton to="/crafts" />
          <div className="header-actions">
            {craft.githubUrl && (
              <a
                href={craft.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn"
              >
                <Icon name="github" />
                <span>Source</span>
              </a>
            )}
            {craft.demoUrl && (
              <a
                href={craft.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn primary"
              >
                <Icon name="play" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero 区域 */}
      <div className="detail-hero">
        {craft.coverImage && (
          <div className="hero-image">
            <img src={craft.coverImage} alt={craft.name} />
            <div className="image-overlay"></div>
          </div>
        )}

        <div className="hero-content">
          <div className="craft-meta">
            <span className="craft-category">
              {categoryLabels[craft.category][language]}
            </span>
            <span className="craft-date">
              {new Date(craft.createdAt).toLocaleDateString(
                language === "zh" ? "zh-CN" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
          </div>

          <h1 className="craft-title">{craft.name}</h1>
          <p className="craft-description">{craft.description}</p>

          <div className="craft-technologies">
            {craft.technologies.map((tech, idx) => (
              <span key={idx} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <main className="detail-content">
        <div className="content-wrapper">
          {/* Demo 展示区 */}
          <section className="demo-section">
            <h2 className="section-title">
              {language === "zh" ? "效果预览" : "Preview"}
            </h2>
            <div className="demo-container">
              <div className="demo-placeholder">
                <Icon name="play" />
                <p>{language === "zh" ? "组件演示区域" : "Component Demo Area"}</p>
              </div>
            </div>
          </section>

          {/* 详细说明 */}
          {craft.content && (
            <section className="description-section">
              <h2 className="section-title">
                {language === "zh" ? "详细说明" : "Details"}
              </h2>
              <div className="description-content">
                <p>{craft.content}</p>
              </div>
            </section>
          )}

          {/* 技术栈 */}
          <section className="tech-section">
            <h2 className="section-title">
              {language === "zh" ? "技术栈" : "Tech Stack"}
            </h2>
            <div className="tech-grid">
              {craft.technologies.map((tech, idx) => (
                <div key={idx} className="tech-item">
                  <span className="tech-name">{tech}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CraftsPageDetailPage;
