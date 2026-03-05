import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CatSVG from '../components/CatSVG';
import '../styles/AssistantPage.scss';

// Mock data for the assistants
const assistants = [
  {
    id: 'analytics',
    name: 'Data Neko',
    role: 'Analysis',
    description: '网站流量和用户行为分析。',
    accent: '#96BAFF',
    item: 'laptop',
    catColors: {
      body: '#3D3D3D',
      bodyDark: '#2A2A2A',
      belly: '#E8E8E8',
      earInner: '#E8909A',
      eyes: '#542615',
      nose: '#542615',
      blush: '#F28686',
      stroke: '#1A1A1A',
      apron: '#7EB8DA',
      apronLight: '#D6EAF5',
      apronLine: '#7EB8DA',
      desk: '#C8D8E8',
      deskDark: '#8BA4BD',
      deskLeg: '#A6BCCF',
    },
    messages: [
      '今日UV上涨12%~ 📈',
      '跳出率有点高呢...',
      '让我分析一下数据!',
      '转化率创新高了! ✨',
      '用户画像已更新~',
    ]
  },
  {
    id: 'email',
    name: 'Postman',
    role: 'Newsletter',
    description: '将重要的数据结果送达您的邮箱。',
    accent: '#F2A5B9',
    item: 'mail',
    catColors: {
      body: '#F7AC5E',
      bodyDark: '#D3753E',
      belly: '#FCEFD9',
      earInner: '#F28686',
      eyes: '#542615',
      nose: '#542615',
      blush: '#F28686',
      stroke: '#542615',
      apron: '#BDBDBD',
      apronLight: '#FEFFFE',
      apronLine: '#BDBDBD',
      desk: '#EBA87A',
      deskDark: '#B76C4F',
      deskLeg: '#D38A61',
    },
    messages: [
      '有3封新邮件! 📬',
      '周报已送达~',
      '订阅者又增加了!',
      '邮件送达率99%! 💌',
      '通知已全部发出~',
    ]
  },
  {
    id: 'writer',
    name: 'Sensei',
    role: 'Article Master',
    description: '文章润色、大纲生成与创意写作。',
    accent: '#FF6B6B',
    item: 'notebook',
    catColors: {
      body: '#F5F5F5',
      bodyDark: '#D5D5D5',
      belly: '#FFFFFF',
      earInner: '#FFB5C5',
      eyes: '#542615',
      nose: '#542615',
      blush: '#FFB5C5',
      stroke: '#333333',
      apron: '#E8A0BF',
      apronLight: '#FCE4EC',
      apronLine: '#E8A0BF',
      desk: '#E8C8D8',
      deskDark: '#C4919E',
      deskLeg: '#D4A8B5',
    },
    messages: [
      '灵感来了! ✍️',
      '这段话可以更好~',
      '大纲已经拟好了!',
      '文章润色完成~ 📝',
      '要来点创意写作吗?',
    ]
  },
  {
    id: 'crafts',
    name: 'Artisan',
    role: 'Crafts Gen',
    description: '生成精美的创意组件代码。',
    accent: '#A0D8B3',
    item: 'palette',
    catColors: {
      body: '#EFEBE9',
      bodyDark: '#A1887F',
      belly: '#FFF8E1',
      earInner: '#FFAB91',
      eyes: '#542615',
      nose: '#3E2723',
      blush: '#FFAB91',
      stroke: '#3E2723',
      apron: '#A5D6A7',
      apronLight: '#E8F5E9',
      apronLine: '#A5D6A7',
      desk: '#C8DEC4',
      deskDark: '#8DB889',
      deskLeg: '#A6CCA2',
    },
    messages: [
      '新组件出炉了! 🎨',
      '配色方案已生成~',
      '这个动画很流畅!',
      '代码已优化完毕~ ✨',
      '要做点什么创意?',
    ]
  }
];

const BUBBLE_DISPLAY_DURATION = 3000;
const BUBBLE_CYCLE_INTERVAL = 5000;
const BUBBLE_STAGGER_OFFSET = 1200;

interface BubbleState {
  visible: boolean;
  messageIndex: number;
}

const AssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<Record<string, BubbleState>>(() => {
    const initial: Record<string, BubbleState> = {};
    assistants.forEach((a) => {
      initial[a.id] = { visible: false, messageIndex: 0 };
    });
    return initial;
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const indicesRef = useRef<Record<string, number>>(
    assistants.reduce<Record<string, number>>((m, a) => { m[a.id] = 0; return m; }, {})
  );

  const showBubble = useCallback((id: string) => {
    const assistant = assistants.find((a) => a.id === id);
    if (!assistant) return;

    const idx = (indicesRef.current as Record<string, number>)[id] ?? 0;
    setBubbles((prev) => ({
      ...prev,
      [id]: { visible: true, messageIndex: idx },
    }));

    if (timersRef.current[`hide_${id}`]) clearTimeout(timersRef.current[`hide_${id}`]);
    timersRef.current[`hide_${id}`] = setTimeout(() => {
      setBubbles((prev) => ({
        ...prev,
        [id]: { ...prev[id], visible: false },
      }));
    }, BUBBLE_DISPLAY_DURATION);

    (indicesRef.current as Record<string, number>)[id] = (idx + 1) % assistant.messages.length;
  }, []);

  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];

    assistants.forEach((assistant, i) => {
      const startDelay = setTimeout(() => {
        showBubble(assistant.id);
        const interval = setInterval(() => {
          showBubble(assistant.id);
        }, BUBBLE_CYCLE_INTERVAL);
        intervals.push(interval);
      }, i * BUBBLE_STAGGER_OFFSET);

      timersRef.current[`start_${assistant.id}`] = startDelay;
    });

    return () => {
      intervals.forEach(clearInterval);
      Object.values(timersRef.current).forEach((t) => clearTimeout(t));
    };
  }, [showBubble]);

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredId(id);
    showBubble(id);
  }, [showBubble]);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const handleAssistantClick = (id: string) => {
    console.log(`Clicked on assistant: ${id}`);
    if (id === 'crafts') {
        navigate('/crafts');
    } else if (id === 'writer') {
        navigate('/articles');
    }
  };

  return (
    <div className="assistant-page">

      <div className="office-grid">
        {assistants.map((assistant) => {
          const bubble = bubbles[assistant.id];
          const isHovered = hoveredId === assistant.id;
          const showBubbleNow = bubble?.visible || isHovered;
          const currentMessage = assistant.messages[bubble?.messageIndex ?? 0];

          return (
          <div 
            key={assistant.id}
            className="desk-workspace"
            onClick={() => handleAssistantClick(assistant.id)}
            onMouseEnter={() => handleMouseEnter(assistant.id)}
            onMouseLeave={handleMouseLeave}
            style={{ '--accent': assistant.accent } as React.CSSProperties}
          >
            {/* Speech Bubble */}
            <div className={`speech-bubble ${showBubbleNow ? 'visible' : ''}`}>
              <span className="speech-text">{currentMessage}</span>
            </div>

            {/* The Cat (SVG) */}
            <div className="cat-worker">
              <CatSVG colors={assistant.catColors} className="cat-svg" />
            </div>

            {/* Name Plate */}
            <div className="name-plate">
              <span className="name-text">{assistant.name}</span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssistantPage;
