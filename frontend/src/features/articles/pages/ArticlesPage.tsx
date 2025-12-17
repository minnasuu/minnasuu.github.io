import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../shared/contexts/LanguageContext";
import { useTranslations } from "../../../shared/hooks/useTranslations";
import { fetchArticles } from "../../../shared/utils/backendClient";
import type { Article } from "../../../shared/types";
import "../styles/ArticlesPage.scss"; // 引入新的 SCSS 文件
import { Icon } from "@suminhan/land-design";
import BackButton from "../../../shared/components/BackButton";

const ArticlesPage: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslations();
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
          <h1 className="hero-title">
            {language === "zh" ? (
              <>
                <span className="text-main">思考</span>
                <span className="text-connector">与</span>
                <span className="text-main">写作</span>
              </>
            ) : (
              <>
                <span className="text-main">Thinking</span>
                <span className="text-connector text-serif">&</span>
                <span className="text-main">Writing</span>
              </>
            )}
          </h1>
          <p className="hero-subtitle">{t("articles.subtitle")}</p>
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
                  <div className="article-meta-top">
                    <span className="article-date">
                      {new Date(article.publishDate).toLocaleDateString(
                        language === "zh" ? "zh-CN" : "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                    <span className="article-type-badge">
                      {article.type === "tech" ? "Technical" : "Essay"}
                    </span>
                  </div>

                  <h2 className="article-title">{article.title}</h2>
                  <p className="article-summary">{article.summary}</p>

                  <div className="article-footer">
                    <div className="article-tags">
                      {article.tags.map((tag, idx) => (
                        <span key={idx} className="tag-pill">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="view-btn">
                      <span className="btn-text">{t("articles.readMore")}</span>
                      <Icon
                        name="arrow-line"
                        className="btn-icon -rotate-90"
                        strokeWidth={4}
                      />
                      {/* 或者使用 LandButton，但为了自定义样式这里简化了 */}
                    </div>
                  </div>
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
