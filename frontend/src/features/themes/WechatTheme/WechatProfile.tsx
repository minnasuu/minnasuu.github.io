import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { personalDataMultiLang } from '../../../data/personalData';
import { fetchArticles } from '../../../shared/utils/backendClient';
import type { Article } from '../../../shared/types';
import avatarImg from '../../../assets/images/wechat-avatar.jpg';
import qrCodeImg from '../../../assets/images/wechat-contact.jpg';

interface WechatProfileProps {
  isOpen?: boolean;
}

interface MomentPhoto {
  id: string;
  coverImage: string;
}

const WechatProfile: React.FC<WechatProfileProps> = ({ isOpen = true }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const data = personalDataMultiLang[language];
  const [momentsPhotos, setMomentsPhotos] = useState<MomentPhoto[]>([]);
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

    loadArticleCovers();
  }, []);

  const handleArticleClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/articles/${id}`);
  };

  const handleMomentsRowClick = () => {
    navigate('/articles');
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

      {/* 朋友圈区域 */}
      {momentsPhotos.length > 0 && <div className="group profile-row-new moments-row" onClick={handleMomentsRowClick}>
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
      </div>}

      <div className="section-divider-line"></div>

      {/* 底部操作区 */}
      <div className="profile-footer-new">
        <div className="send-message-btn" onClick={() => setShowQR(true)}>
          <svg className="msg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="#576B95"/>
          </svg>
          <span className="btn-text">{language === "zh" ? "发消息" : "Send Message"}</span>
        </div>
      </div>
    </div>
  );
};

export default WechatProfile;
