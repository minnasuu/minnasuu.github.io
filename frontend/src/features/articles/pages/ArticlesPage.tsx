import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../shared/contexts/LanguageContext";
import { fetchArticles } from "../../../shared/utils/backendClient";
import type { Article } from "../../../shared/types";
import "../styles/ArticlesPage.scss"; // 引入新的 SCSS 文件
import BackButton from "../../../shared/components/BackButton";

const ArticlesPage: React.FC = () => {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (error) {
        console.error("Failed to load articles:", error);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  // 按时间排序
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      return (
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    });
  }, [articles]);

  if (loading) {
    return (
      <div
        className="articles-page"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="articles-page">
      {/* 顶部导航区域 */}
      <header className="articles-header">
        <div className="header-content">
          <BackButton to="/" />
        </div>
      </header>

      <main className="articles-container">
        <div className="articles-hero">
          {/* 背景装饰图形 */}
          <div className="hero-graphics">
            <div className="graphic-blob"></div>
            <div className="graphic-line"></div>
            <div className="graphic-circle"></div>
          </div>

          <h1 className="hero-title">
            {language === "zh" ? (
              <div className="title-wrapper zh">
                <span className="text-line">成长</span>
                <span className="divider-dot">·</span>
                <span className="text-line">札记</span>
              </div>
            ) : (
              <div className="title-wrapper en">
                <span className="text-line">Gowth</span>
                <span className="divider-line"></span>
                <span className="text-line italic">Journal</span>
              </div>
            )}
          </h1>
          
          <div className="hero-subtitle-container">
            <p className="hero-subtitle">
              {language === "zh" ? (
                <>把今天过成昨天想要的明天。</>
              ) : (
                <>Make today the yesterday you wanted tomorrow.</>
              )}
            </p>
          </div>
        </div>

        <div className="articles-list">
          {sortedArticles.map((article) => (
            <article key={article.id} className="article-item">
              <Link
                to={`/articles/${article.id}`}
                className="article-link-wrapper"
              >
                {/* 文本区域 */}
                <div className="article-content">
                  {/* 日期显示在左侧固定位置 */}
                  <time className="article-date-timeline">
                    {new Date(article.publishDate).toLocaleDateString(
                      language === "zh" ? "zh-CN" : "en-US",
                      { year: "numeric", month: "2-digit", day: "2-digit" }
                    )}
                  </time>

                  {/* 标题行：包含类型标签 */}
                  <div className="article-meta-top">
                    <h2 className="article-title">{article.title}</h2>
                    <span 
                      className="article-type-badge"
                      data-type={article.type}
                    >
                      {article.type}
                    </span>
                  </div>

                  {/* 摘要 */}
                  <div className="article-summary">
                    <p>{article.summary}</p>
                  </div>

                  {/* 标签作为外部链接 */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="article-tags">
                      {article.tags.map((tag, idx) => (
                        <span key={idx} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                 {/* 图片区域 */}
                <div className="article-visual">
                  <div className="visual-inner">
                    {article.coverImage?.endsWith(".mp4") ? (
                      <video
                        src={article.coverImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={article.coverImage || ""}
                        alt={article.title}
                      />
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ArticlesPage;
