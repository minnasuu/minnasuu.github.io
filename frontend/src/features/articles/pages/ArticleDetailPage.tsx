import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { useLanguage } from "../../../shared/contexts/LanguageContext";
import { fetchArticleById } from "../../../shared/utils/backendClient";
import ArticleMarkdown from "../components/ArticleMarkdown";
import type { Article } from "../../../shared/types";
import "../styles/ArticleDetailPage.scss";
import LineAnchor from "../components/LineAnchor/LineAnchor";
import ArticleSliders from "../components/ArticleSliders/ArticleSliders";
import BackButton from "../../../shared/components/BackButton";

interface ArticleDetailPageProps {
  article?: Article; // 可选的 props，如果没有传入则从 API 获取
}

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article: propArticle,
}) => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();

  const [article, setArticle] = useState<Article | undefined>(propArticle);
  const [loading, setLoading] = useState(!propArticle);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propArticle) {
      setArticle(propArticle);
      setLoading(false);
      return;
    }
    if (!id) return;

    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchArticleById(id);

        // 处理内容：如果是字符串（Markdown），则保留原样，渲染时交给 ArticleMarkdown
        // 如果已经是 ReactNode（不太可能从 API 返回），则直接使用
        const contentString =
          typeof data.content === "string" ? data.content : "";

        setArticle({
          ...data,
          markdownContent: contentString,
          // 如果 content 是 string，我们在渲染时会特殊处理，这里先保持原样或者赋给 markdownContent
          // 为了兼容旧逻辑，我们确保 content 属性存在
          content: data.content,
        });
      } catch (error) {
        console.error("Failed to load article:", error);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id, propArticle]);

  // 页面初始化滚动到顶部
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [id]);

  const [articleAnchors, setArticleAnchors] = useState<
    { key: string; title: string }[]
  >([]);
  const [isSliderView, setIsSliderView] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 提取标题生成目录
  useEffect(() => {
    if (!article) return;

    // 给一点时间让React渲染完成
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const headings = contentRef.current.querySelectorAll("h1, h2");
        const anchors: { key: string; title: string }[] = [];

        headings.forEach((heading, index) => {
          let headingId = heading.id;
          if (!headingId) {
            headingId = `heading-${index + 1}`;
            heading.id = headingId;
          }
          anchors.push({
            key: headingId,
            title: heading.textContent?.trim() || `标题 ${index + 1}`,
          });
        });
        setArticleAnchors(anchors);
      }
    }, 100);
    

    return () => clearTimeout(timer);
  }, [article, isSliderView]);

  if (loading) {
    return (
      <div className="article-detail-page flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-page flex flex-col justify-center items-center h-screen">
        <div className="text-xl text-red-500 mb-4">
          {error || "Article not found"}
        </div>
        <BackButton to="/articles" />
      </div>
    );
  }

  // 决定如何渲染内容
  const renderContent = () => {
    if (typeof article.content === "string") {
      return <ArticleMarkdown>{article.content}</ArticleMarkdown>;
    }
    return article.content;
  };

  return (
    <div className="article-detail-page" id="article-detail-page">
      {!isSliderView && (
        <>
          <div className="article-detail-page-bottom-mask"></div>
          {articleAnchors.length > 0 && (
            <LineAnchor
              anchors={articleAnchors}
              contentRef={contentRef}
              onSectionChange={() => {}}
            />
          )}
          <div className="articles-header">
            <div
              className="header-content"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BackButton to="/articles" />
              {/* 仅当有 markdownContent 时才显示 Slider View 按钮 */}
              {(article.markdownContent ||
                typeof article.content === "string") && (
                <button
                  onClick={() => setIsSliderView(true)}
                  style={{
                    background: "var(--color-bg-2)",
                    border: "1px solid var(--color-border-1)",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    cursor: "pointer",
                    color: "var(--color-text-1)",
                    fontSize: "14px",
                  }}
                >
                  Slider View
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {isSliderView &&
      (article.markdownContent || typeof article.content === "string") ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2000,
            background: "var(--color-bg-1)",
          }}
        >
          <ArticleSliders
            article={{
              ...article,
              markdownContent:
                article.markdownContent ||
                (typeof article.content === "string" ? article.content : ""),
            }}
            onClose={() => setIsSliderView(false)}
          />
        </div>
      ) : (
        <div className="article-detail-container" ref={scrollRef}>
          <header className="article-detail-header">
            <h1 className="article-detail-title">{article.title}</h1>

            <div className="article-meta">
              <span className="article-date">
                {new Date(article.publishDate).toLocaleDateString(
                  language === "zh" ? "zh-CN" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>

              <div className="article-detail-tags">
                {article.tags.map((tag, index) => (
                  <span key={index} className="article-detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {article.coverImage && (
              <div className="article-header-background">
                {article.coverImage.endsWith(".mp4") ? (
                  <video
                    src={article.coverImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="article-header-image"
                    style={{ backgroundImage: `url(${article.coverImage})` }}
                  />
                )}
              </div>
            )}
          </header>

          <div className="article-content">
            <div className="article-detail-body">
              <div className="article-detail-body-content" ref={contentRef}>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ArticleDetailPageWithProps: React.FC<{ article: Article }> = ({
  article,
}) => {
  return <ArticleDetailPage article={article} />;
};

export default ArticleDetailPage;
