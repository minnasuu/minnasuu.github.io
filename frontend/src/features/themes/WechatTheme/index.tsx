import React from 'react';
import './wechatTheme.scss';
import WechatChatInterface from './WechatChatInterface';
import WechatProfile from './WechatProfile';
import ThemeSwitcher from '../../../shared/components/ThemeSwitcher';
import LanguageSwitcher from "../../../shared/components/LanguageSwitcher";

interface WechatThemeProps {
  fontColor?: string;
}

const WechatTheme: React.FC<WechatThemeProps> = ({ fontColor }) => {
  const [showProfile, setShowProfile] = React.useState(true);
  const themeStyle = fontColor ? { '--wechat-text-primary': fontColor } as React.CSSProperties : {};

  return (
    <div className="wechat-theme" style={themeStyle}>
      <div className={`fixed top-2.5 right-4 flex gap-2 ${showProfile ? 'max-md:translate-y-15':'translate-y-15'} transition-transform duration-200`}>
        <LanguageSwitcher />
        <ThemeSwitcher />
        </div>
      <div className="wechat-content">
        <WechatChatInterface onToggleProfile={() => setShowProfile(!showProfile)} isProfileOpen={showProfile} />
        <WechatProfile isOpen={showProfile} />
      </div>
    </div>
  );
};

export default WechatTheme;
