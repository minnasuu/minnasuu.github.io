import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { personalDataMultiLang } from '../../../data/personalData'
import { useTranslations } from '../../../shared/hooks/useTranslations'
import StackedCardList from '../../../shared/components/themes/StackedCardList/StackedCardList'
import type { StackedCardItem } from '../../../shared/components/themes/StackedCardList/StackedCardList'
import { fetchArticles } from '../../../shared/utils/backendClient'
import type { Article } from '../../../shared/types'

export default function AISidebar() {
  const { language } = useLanguage()
  const { t } = useTranslations()
  const data = personalDataMultiLang[language]
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoadingArticles, setIsLoadingArticles] = useState(true)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchArticles(false)
        setArticles(fetchedArticles)
      } catch (error) {
        console.error('Failed to load articles:', error)
        setArticles([])
      } finally {
        setIsLoadingArticles(false)
      }
    }

    loadArticles()
  }, [])

  return (
    <div className="ai-sidebar">
      {/* 系统信息 */}
      <div className="ai-sidebar-section">
        <div className="section-header">
          <h3>👧 {t("common.systemInfo")}</h3>
        </div>
        <div className="info-item avatar-item">
          <img src={data.info.avatar} alt="avatar" className="avatar" />
        </div>
        <div className="info-item">
          <span className="label">{t("common.name")}:</span>
          <span className="value">{data.info.name}</span>
        </div>
        <div className="info-item">
          <span className="label">{t("common.role")}:</span>
          <span
            className="value"
            dangerouslySetInnerHTML={{
              __html: data.info.title
                .replace(
                  /腾讯/g,
                  '<a href="https://www.tencent.com" target="_blank" rel="noopener noreferrer" style="color: #10b981; text-decoration: underline;">腾讯</a>'
                )
                .replace(
                  /Tencent/g,
                  '<a href="https://www.tencent.com" target="_blank" rel="noopener noreferrer" style="color: #10b981; text-decoration: underline;">Tencent</a>'
                ),
            }}
          />
        </div>
        <div className="info-item">
          <span className="label">{t("common.location")}:</span>
          <span className="value">{data.info.location}</span>
        </div>
        <div className="info-item">
          <span className="label">{t("common.wechat")}:</span>
          <span className="value">{data.info.wechat}</span>
        </div>
        <div className="info-item">
          <span className="label">{t("common.email")}:</span>
          <span className="value">{data.info.email}</span>
        </div>
      </div>

      {/* 链接 */}
      <div className="ai-sidebar-section">
        <div className="section-header">
          <h3>🧲 {t("common.socialLinks")}</h3>
        </div>
        {data.info.socialLinks.map((socialLink, index) =>
          socialLink.url && (
            <div className="social-link-item" key={index}>
              {socialLink.name}：
              <a
                href={socialLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                {socialLink.abbreviation || socialLink.url}
              </a>
            </div>
          )
        )}
      </div>

      {/* AI Assistants */}
      <div className="ai-sidebar-section">
        <div className="section-header">
          <h3>
            <Link to="/assistant" style={{ color: 'inherit', textDecoration: 'none' }}>
              🤖 AI 助手
            </Link>
          </h3>
        </div>
      </div>

      {/* 技能 */}
      <div className="ai-sidebar-section">
        <div className="section-header">
          <h3>⚡️ {t("skills.title")}</h3>
        </div>
        <div className="interest-list">
          {data.skills.map((skill, index) => (
            <div
              key={index}
              className={`label-item ${skill.link ? "with-link" : ""}`}
            >
              {skill.link ? (
                <a
                  href={skill.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="skill-name-link"
                >
                  <span className="interest-name">{skill.name}</span>
                </a>
              ) : (
                <span className="interest-name">{skill.name}</span>
              )}
              {skill.link && <span className="interest-link">🔗</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 文章 - 卡片形式 */}
      <div className="ai-sidebar-section">
        <div className="section-header">
          <h3>📄 {t("文档")}</h3>
        </div>
        {isLoadingArticles ? (
          <div className="text-center py-4 text-sm text-gray-500">
            {t("common.loading") || "Loading..."}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            {t("articles.noArticles") || "No articles yet"}
          </div>
        ) : (
          <StackedCardList
            items={articles
              .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
              .map((article): StackedCardItem => ({
                id: article.id,
                title: article.title,
                coverImage: article.coverImage,
                link: `/articles/${article.id}`,
                meta: {
                  date: article.publishDate,
                  readTime: article.readTime,
                },
              }))}
            maxVisibleItems={10}
            cardWidth={120}
            overlapOffset={30}
            viewMoreLink="/articles"
            viewMoreText={t("articles.viewAll")}
          />
        )}
      </div>

      {/* 项目 - 卡片形式 */}
      <div className="ai-sidebar-section">
        <div className="section-header">
          <h3>💎 {t("projects.title")}</h3>
        </div>
        <div className="interest-list">
          {data.projects.map((project, index) => (
            <div key={index} className={`label-item ${project.link ? "with-link" : ""}`}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-title-link"
              >
                <span className="interest-name">{project.name}</span>
              </a>
              {project.imgPopUrl && (
                <div className='img-pop-container'>
                  <img src={project.imgPopUrl} alt="img-pop" className='img-pop' />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 作品 - 卡片形式 */}
      <div className="ai-sidebar-section">
        <div className="section-header">
          <h3>♾️ {t("crafts.title")}</h3>
        </div>
        <div className="craft-list">
          {data.crafts.map((craft, index) => (
            <div
              key={index}
              className={`craft-item ${craft.link ? "with-link" : ""}`}
            >
              <a
                href={craft.link}
                target="_blank"
                rel="noopener noreferrer"
                className="craft-title-link"
              >
                <span className="craft-name">{craft.name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

       {/* 兴趣爱好 */}
      <div className="ai-sidebar-section">
        <div className="section-header">
          <h3>📸 {t("interests.title")}</h3>
        </div>
        <div className="interest-list">
          {data.interests.map((interest, index) => (
            <div
              key={index}
              className={`label-item ${interest.link ? "with-link" : ""}`}
            >
              <span className="interest-name">{interest.name}</span>
              {interest.link && <Link to={`/journals/${interest.link}`} className="interest-link">🔗</Link>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
