import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AssistantPage.scss';

// Mock data for the assistants
const assistants = [
  {
    id: 'analytics',
    name: 'Data Neko',
    role: 'Analysis',
    description: '网站流量和用户行为分析。',
    catColor: '#000', // Blue Grey
    colors: {
        body: '#000',
        ears: '#000',
        eyes: '#FFD54F',
        nose: '#FFAB91',
        paws: '#ECEFF1',
        tail: '#000',
        blush: 'rgba(255, 183, 178, 0.6)',
        whiskers: '#999',
        stroke: '#263238'
    },
    accent: '#96BAFF',
    accessory: 'glasses',
    item: 'laptop',
    eyeType: 'normal',
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
    catColor: '#FFB74D', // Orange
    colors: {
        body: '#FFB74D',
        ears: '#F57C00',
        eyes: '#4DB6AC',
        nose: '#E57373',
        paws: '#FFF3E0',
        tail: '#FFB74D',
        blush: 'rgba(255, 87, 34, 0.3)',
        whiskers: '#BF360C',
        stroke: '#BF360C'
    },
    accent: '#F2A5B9',
    accessory: 'hat',
    item: 'mail',
    eyeType: 'happy',
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
    catColor: '#fff', // Cow Cat (Black)
    colors: {
        body: '#fff',
        ears: '#fff',
        eyes: '#81C784', // Green eyes
        nose: '#F8BBD0', // Pink nose
        paws: '#FFFFFF', // White socks
        tail: '#fff',
        blush: 'rgba(255, 182, 193, 0.4)',
        whiskers: '#CFD8DC',
        stroke: '#101010'
    },
    accent: '#FF6B6B',
    accessory: 'headphones',
    item: 'notebook',
    eyeType: 'smart',
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
    catColor: '#EFEBE9', // Cream (Body/Head Base)
    colors: {
        body: '#EFEBE9',
        ears: '#3E2723', // Dark Brown
        eyes: '#42A5F5', // Blue
        nose: '#3E2723', // Dark nose
        paws: '#3E2723', // Dark paws
        tail: '#3E2723', // Dark tail
        blush: 'rgba(255, 82, 82, 0.4)',
        whiskers: '#3E2723',
        faceMask: '#5D4037', // Dark mask
        stroke: '#3E2723'
    },
    accent: '#A0D8B3',
    item: 'palette',
    eyeType: 'wide',
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
            style={{ 
                '--cat-base': assistant.catColor, 
                '--cat-body': assistant.colors.body,
                '--cat-ears': assistant.colors.ears,
                '--cat-eyes': assistant.colors.eyes,
                '--cat-nose': assistant.colors.nose,
                '--cat-paws': assistant.colors.paws,
                '--cat-tail': assistant.colors.tail,
                '--cat-blush': assistant.colors.blush,
                '--cat-whiskers': assistant.colors.whiskers,
                '--cat-face-mask': (assistant.colors as any).faceMask || 'transparent',
                '--cat-mask-blur': (assistant.colors as any).maskBlur || '8px',
                '--cat-stroke': (assistant.colors as any).stroke || '#3E2723',
                '--accent': assistant.accent 
            } as React.CSSProperties}
          >
            {/* Speech Bubble */}
            <div className={`speech-bubble ${showBubbleNow ? 'visible' : ''}`}>
              <span className="speech-text">{currentMessage}</span>
            </div>

            {/* The Cat */}
            <div className="cat-worker">
                {/* Ears */}
                <div className="ears">
                    <div className="ear left"></div>
                    <div className="ear right"></div>
                </div>

                {/* Head */}
                <div className="head">
                    {/* Face Features */}
                    <div className="face">
                        {/* Face Mask (for Siamese etc) */}
                        <div className="face-mask"></div>

                        <div className={`eyes ${assistant.eyeType}`}>
                            <div className="eye left">
                                <div className="pupil"></div>
                            </div>
                            <div className="eye right">
                                <div className="pupil"></div>
                            </div>
                        </div>
                        <div className="muzzle">
                            <div className="mouth">
                                <div className="lip left"></div>
                                <div className="lip right"></div>
                            </div>
                            <div className="nose"></div>
                        </div>
                        <div className="blush left"></div>
                        <div className="blush right"></div>
                        <div className="whiskers left">
                            <span></span><span></span><span></span>
                        </div>
                        <div className="whiskers right">
                            <span></span><span></span><span></span>
                        </div>
                    </div>

                    {/* Accessories */}
                    {assistant.accessory === 'glasses' && (
                        <div className="accessory glasses">
                            <div className="lens left"></div>
                            <div className="bridge"></div>
                            <div className="lens right"></div>
                        </div>
                    )}
                    {assistant.accessory === 'hat' && (
                        <div className="accessory hat">
                            <div className="cap"></div>
                            <div className="viser"></div>
                        </div>
                    )}
                    {assistant.accessory === 'headphones' && (
                        <div className="accessory headphones">
                            <div className="band"></div>
                            <div className="muff left"></div>
                            <div className="muff right"></div>
                        </div>
                    )}
                </div>

                {/* Body (sitting behind desk) */}
                <div className="body">
                     {assistant.accessory === 'tie' && (
                        <div className="accessory tie">
                             <div className="knot"></div>
                             <div className="long"></div>
                        </div>
                    )}
                </div>

                {/* Tail (wagging) */}
                <div className="tail"></div>


            </div>

            {/* The Desk */}
            <div className="desk">
                <div className="desk-surface">
                    {/* Items on desk */}
                    {assistant.item === 'laptop' && (
                        <div className="item laptop">
                            <div className="screen">
                                <div className="code-lines">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                            <div className="base"></div>
                        </div>
                    )}
                    {assistant.item === 'mail' && (
                        <div className="item mail-stack">
                            <div className="envelope"></div>
                            <div className="envelope under"></div>
                        </div>
                    )}
                    {assistant.item === 'notebook' && (
                        <div className="item notebook">
                            <div className="cover"></div>
                            <div className="pages"></div>
                            <div className="pen"></div>
                        </div>
                    )}
                    {assistant.item === 'palette' && (
                        <div className="item palette">
                             <div className="paint red"></div>
                             <div className="paint blue"></div>
                             <div className="paint yellow"></div>
                        </div>
                    )}

                    {/* Paws resting on desk */}
                    <div className="paws">
                        <div className="paw left"></div>
                        <div className="paw right"></div>
                    </div>

                    {/* Name Plate */}
                    <div className="name-plate">
                        <span className="name-text">{assistant.name}</span>
                    </div>
                </div>
                <div className="desk-legs">
                    <div className="leg left"></div>
                    <div className="leg right"></div>
                </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssistantPage;
