import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import avatarImg from '../../../assets/images/wechat-avatar.jpg';
import { sendMessageToBackend } from '../../../shared/utils/backendClient';
import { Icon } from "@suminhan/land-design";
import {
  saveChatMessages,
  loadChatMessages,
  saveConversationId,
  loadConversationId,
} from '../../../shared/utils/chatCache';

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
  displayText?: string;
}

interface WechatChatInterfaceProps {
  onToggleProfile?: () => void;
  isProfileOpen?: boolean;
}

const WechatChatInterface: React.FC<WechatChatInterfaceProps> = ({ onToggleProfile, isProfileOpen }) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 保存消息到 localStorage
  useEffect(() => {
    if (isCacheLoaded && messages.length > 0) {
      saveChatMessages(messages);
    }
  }, [messages, isCacheLoaded]);

  // 保存会话 ID
  useEffect(() => {
    if (conversationId) {
      saveConversationId(conversationId);
    }
  }, [conversationId]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeText =
      language === "zh"
        ? `嗨！我是小苏 👋`
        : `Hi! I'm Minna 👋`;

    const welcomeMessage: Message = {
      id: "welcome",
      text: welcomeText,
      sender: "ai",
      timestamp: new Date(),
      isTyping: false,
      displayText: welcomeText,
    };

    const cachedMessages = loadChatMessages();
    const cachedConversationId = loadConversationId();

    if (cachedMessages && cachedMessages.length > 0) {
      setMessages([welcomeMessage, ...cachedMessages]);
      if (cachedConversationId) {
        setConversationId(cachedConversationId);
      }
    } else {
      setMessages([welcomeMessage]);
    }

    setIsCacheLoaded(true);
  }, [language]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // 创建 AbortController
    abortControllerRef.current = new AbortController();

    let aiResponseText = "";

    try {
      const response = await sendMessageToBackend(
        inputText,
        conversationId,
        abortControllerRef.current.signal
      );

      if (abortControllerRef.current?.signal.aborted) {
        setIsTyping(false);
        return;
      }

      aiResponseText = response.answer;
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setIsTyping(false);
        return;
      }

      console.error("Backend API Error:", error);
      aiResponseText = language === "zh"
        ? "抱歉，我暂时无法回复。请稍后再试。"
        : "Sorry, I can't reply right now. Please try again later.";
    }

    const aiMessageId = (Date.now() + 1).toString();
    const aiResponse: Message = {
      id: aiMessageId,
      text: aiResponseText,
      sender: "ai",
      timestamp: new Date(),
      isTyping: false,
      displayText: aiResponseText,
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="wechat-chat-interface">
      <div className="wechat-chat-header">
        <div className="chat-name">SUU</div>
        <div className="chat-header-actions">
          <button className="header-action-btn" title="发起视频通话">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </button>
          <button className="header-action-btn" title="发起语音通话">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
            </svg>
          </button>
          <button 
            className={`header-action-btn ${!isProfileOpen ? 'active' : ''}`} 
            title={isProfileOpen ? "隐藏详情" : "显示详情"}
            onClick={onToggleProfile}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="wechat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`wechat-message ${message.sender}`}>
            <div className={`message-avatar ${message.sender === "user" ? "user-avatar" : ""}`}>
              {message.sender === "ai" ? (
                <img src={avatarImg} alt="avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  <Icon name='avatar' size={20} />
                </div>
              )}
            </div>
            <div className="message-wrapper">
              <div className="message-bubble">
                {message.displayText || message.text}
              </div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="wechat-message ai">
            <div className="message-avatar">
              <img src={avatarImg} alt="avatar" />
            </div>
            <div className="message-wrapper">
              <div className="message-bubble typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="wechat-input-area">
        <div className="input-toolbar">
          <button className="toolbar-btn" title="表情">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-5 5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </button>
          <button className="toolbar-btn" title="发送文件">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 16H5V5h14v14zm0-12h-4V5h4v2zm0 10h-4v-4h4v4z"/>
              </svg>
          </button>
          <button className="toolbar-btn" title="键盘">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v2H7v-2zm0 4h2v2H7v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
            </svg>
          </button>
          <button className="toolbar-btn" title="聊天记录">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.53.72-1.18-3.5-2.08V8h-1.5z"/>
            </svg>
          </button>
        </div>
        <div className="input-wrapper">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === "zh" ? "发送消息" : "Send a message"}
            disabled={isTyping}
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="send-btn"
          >
            {language === "zh" ? "发送" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WechatChatInterface;

