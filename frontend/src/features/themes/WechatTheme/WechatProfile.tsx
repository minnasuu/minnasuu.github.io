import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { personalDataMultiLang } from '../../../data/personalData';
import { fetchArticles, fetchCrafts } from '../../../shared/utils/backendClient';
import type { Article } from '../../../shared/types';
import type { Craft } from '../../crafts/components/CraftNode';
import avatarImg from '../../../assets/images/wechat-avatar.jpg';
import qrCodeImg from '../../../assets/images/wechat-contact.jpg';

interface WechatProfileProps {
  isOpen?: boolean;
}

interface MomentPhoto {
  id: string;
  coverImage: string;
}

interface MiniProgramItem {
  id: string;
  name: string;
  coverImage?: string;
}

const WechatProfile: React.FC<WechatProfileProps> = ({ isOpen = true }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const data = personalDataMultiLang[language];
  const [momentsPhotos, setMomentsPhotos] = useState<MomentPhoto[]>([]);
  const [miniPrograms, setMiniPrograms] = useState<MiniProgramItem[]>([]);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const loadArticleCovers = async () => {
      try {
        const articles = await fetchArticles();
        // 提取有封面的文章封面，最多取 5 张
        const photos = articles
          .filter((article: Article) => article.coverImage)
          .map((article: Article) => ({
            id: article.id,
            coverImage: article.coverImage as string
          }))
          .slice(0, 5);
        
        if (photos.length > 0) {
          setMomentsPhotos(photos);
        }
      } catch (error) {
        console.error('Failed to load articles for moments:', error);
      }
    };

    const loadCrafts = async () => {
      try {
        const crafts = await fetchCrafts();
        const items = crafts
          .map((craft: Craft) => ({
            id: craft.id,
            name: craft.name,
            coverImage: craft.coverImage
          }))
          .slice(0, 4);
        setMiniPrograms(items);
      } catch (error) {
        console.error('Failed to load crafts:', error);
      }
    };

    loadArticleCovers();
    loadCrafts();
  }, []);

  const handleArticleClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/articles/${id}`);
  };

  const handleCraftClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/crafts/${id}`);
  };

  const handleMomentsRowClick = () => {
    navigate('/articles');
  };

  const handleMiniProgramRowClick = () => {
    navigate('/crafts');
  };

  return (
    <div className={`wechat-profile ${!isOpen ? 'collapsed' : ''}`}>
      {/* 二维码弹窗 */}
      {showQR && (
        <div className="qr-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-container" onClick={(e) => e.stopPropagation()}>
            <img src={qrCodeImg} alt="WeChat QR Code" className="qr-image" />
          </div>
        </div>
      )}
      {/* 头部信息区 */}
      <div className="profile-header-new">
        <img src={avatarImg} alt="avatar" className="header-avatar" />
        <div className="header-info">
          <h2 className="display-name">SUU</h2>
          <div className="wechat-id">
            {language === "zh" ? "微信号" : "WeChat ID"}: {data.info.wechat}
          </div>
          <div className="region">
            {language === "zh" ? "地区" : "Region"}: {data.info.location}
          </div>
        </div>
      </div>

      <div className="section-divider-line"></div>

      {/* 朋友圈区域 - 文档 */}
      {momentsPhotos.length > 0 && (
        <div className="group profile-row-new moments-row" onClick={handleMomentsRowClick}>
          <div className="row-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="4" fill="currentColor"/>
            </svg>
          </div>
          <div className="row-label-new">{language === "zh" ? "朋友圈" : "Moments"}</div>
          <div className="moments-photos">
            {momentsPhotos.map((photo) => (
              <img 
                key={photo.id} 
                src={photo.coverImage} 
                alt={`moment-${photo.id}`} 
                className="moment-img" 
                onClick={(e) => handleArticleClick(photo.id, e)}
              />
            ))}
          </div>
          <div className="group-hover:opacity-100 opacity-0 row-arrow transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      )}

      <div className="section-divider-line"></div>

      {/* 小程序区域 - Crafts */}
      {miniPrograms.length > 0 && (
        <div className="group profile-row-new miniprogram-row" onClick={handleMiniProgramRowClick}>
          <div className="row-icon miniprogram-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 3A3.5 3.5 0 0 1 21 6.5v11a3.5 3.5 0 0 1-3.5 3.5h-11A3.5 3.5 0 0 1 3 17.5v-11A3.5 3.5 0 0 1 6.5 3h11zm-6 5.5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-5a1 1 0 0 0-1-1zm4 2a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1zm-8-1a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0v-4a1 1 0 0 0-1-1z" fill="currentColor"/>
            </svg>
          </div>
          <div className="row-label-new">{language === "zh" ? "小程序" : "Mini Programs"}</div>
          <div className="miniprogram-list">
            {miniPrograms.map((item) => (
              <div 
                key={item.id} 
                className="miniprogram-item"
                onClick={(e) => handleCraftClick(item.id, e)}
              >
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.name} className="miniprogram-icon-img" />
                ) : (
                  <div className="miniprogram-icon-placeholder">
                    <span>{item.name.charAt(0)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="group-hover:opacity-100 opacity-0 row-arrow transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      )}

      <div className="section-divider-line"></div>

      {/* 收藏 - 项目 */}
      {data.projects.length > 0 && (
        <div className="group profile-row-new collection-row">
          <div className="row-icon collection-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
            </svg>
          </div>
          <div className="row-label-new">{language === "zh" ? "收藏" : "Favorites"}</div>
          <div className="collection-tags">
            {data.projects.slice(0, 3).map((project, index) => (
              <a 
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="collection-tag"
                onClick={(e) => e.stopPropagation()}
              >
                {project.name}
              </a>
            ))}
            {data.projects.length > 3 && (
              <span className="collection-more">+{data.projects.length - 3}</span>
            )}
          </div>
        </div>
      )}

      <div className="section-divider-line"></div>

      {/* 卡包 - 技能 */}
      {data.skills.length > 0 && (
        <div className="group profile-row-new cards-row">
          <div className="row-icon cards-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="row-label-new">{language === "zh" ? "卡包" : "Cards"}</div>
          <div className="cards-tags">
            {data.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="card-tag">{skill.name}</span>
            ))}
            {data.skills.length > 4 && (
              <span className="cards-more">+{data.skills.length - 4}</span>
            )}
          </div>
        </div>
      )}

      <div className="section-divider-line"></div>

      {/* 相册 - 兴趣爱好 */}
      {data.interests.length > 0 && (
        <div className="group profile-row-new album-row">
          <div className="row-icon album-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <path d="M21 15l-5-5-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="row-label-new">{language === "zh" ? "相册" : "Albums"}</div>
          <div className="album-tags">
            {data.interests.slice(0, 3).map((interest, index) => (
              <span key={index} className="album-tag">{interest.name}</span>
            ))}
            {data.interests.length > 3 && (
              <span className="album-more">+{data.interests.length - 3}</span>
            )}
          </div>
        </div>
      )}

      <div className="section-divider-line"></div>

      {/* 底部操作区 */}
      <div className="profile-footer-new">
        <div className="add-contact-btn" onClick={() => setShowQR(true)}>
          <span className="btn-text">{language === "zh" ? "添加到通讯录" : "Add to Contacts"}</span>
        </div>
      </div>
    </div>
  );
};

export default WechatProfile;
