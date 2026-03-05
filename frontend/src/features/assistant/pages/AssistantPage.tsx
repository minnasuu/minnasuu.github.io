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
      belly: '#3D3D3D',
      earInner: '#E8909A',
      eyes: '#000',
      nose: '#542615',
      blush: '#F28686',
      stroke: '#1A1A1A',
      apron: '#7EB8DA',
      apronLight: '#D6EAF5',
      apronLine: '#7EB8DA',
      desk: '#C8D8E8',
      deskDark: '#8BA4BD',
      deskLeg: '#A6BCCF',
      paw: '#fff',
       tail: '#3D3D3D',
       faceDark:'',
        month:'',
        head:'',
        bodyDarkBottom:'',
        leg:'',
        headTopLeft:'',
      headTopRight:'',
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
      belly: '',
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
      paw: '',
      tail: '#F7AC5E',
      faceDark:'',
       month:'',
       head:'',
       bodyDarkBottom:'',
        leg:'',
        headTopLeft:'',
      headTopRight:'',
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
      paw: '#FFFFFF',
      tail: '#F5F5F5',
      faceDark:'',
       month:'',
       head:'',
       bodyDarkBottom:'',
       leg:'',
       headTopLeft:'',
      headTopRight:'',
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
      body: '#B0A08A',
      bodyDark: '#5C4A3A',
      belly: '#FFFFFF',
      earInner: '#F4B8B8',
      eyes: '#B2D989',
      nose: '#E8998D',
      blush: '#F4B8B8',
      stroke: '#3E2E1E',
      apron: '#A5D6A7',
      apronLight: '#E8F5E9',
      apronLine: '#A5D6A7',
      desk: '#C8DEC4',
      deskDark: '#8DB889',
      deskLeg: '#A6CCA2',
      paw: '#FFFFFF',
      tail: '#B0A08A',
      faceDark:'',
      month:'',
      head:'',
      bodyDarkBottom:'',
      leg:'',
      headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '新组件出炉了! 🎨',
      '配色方案已生成~',
      '这个动画很流畅!',
      '代码已优化完毕~ ✨',
      '要做点什么创意?',
    ]
  },
  {
    id: 'image',
    name: 'Pixel',
    role: 'Image Gen',
    description: '根据描述生成精美的图片。',
    accent: '#90CAF9',
    item: 'camera',
    catColors: {
      body: '#FAF3EB',
      bodyDark: '#FAF3EB',
      belly: '#FAF3EB',
      earInner: '#4E342E',
      eyes: '#4FC3F7',
      nose: '#333',
      blush: '#FFCCBC',
      stroke: '#4E342E',
      apron: '#B39DDB',
      apronLight: '#EDE7F6',
      apronLine: '#B39DDB',
      desk: '#D1C4E9',
      deskDark: '#9575CD',
      deskLeg: '#B39DDB',
      paw: '#4E342E',
      tail: '#4E342E',
      faceDark:'#4E342E',
      month:'#333',
      head:'',
      bodyDarkBottom:'',
      leg:'',
      headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '画面构图中... 🖼️',
      '色彩搭配完成~',
      '高清大图生成中!',
      '这张图太美了! ✨',
      '想生成什么画面?',
    ]
  },
  {
    id: 'manager',
    name: 'Tama',
    role: 'Manager',
    description: '统筹管理所有小猫助手的工作。',
    accent: '#FFB74D',
    item: 'clipboard',
    catColors: {
      body: '#FAFAFA',
      bodyDark: '',
      belly: '#FFFFFF',
      earInner: '#FFB5C5',
      eyes: '#542615',
      nose: '#E8998D',
      blush: '#FFB5C5',
      stroke: '#5D4037',
      apron: '#FFB74D',
      apronLight: '#FFF3E0',
      apronLine: '#FFB74D',
      desk: '#FFE0B2',
      deskDark: '#FFB74D',
      deskLeg: '#FFCC80',
      paw: ['#5C4A3A','#FAFAFA','#F7AC5E','#FAFAFA'],
      tail: '#5C4A3A',
      faceDark: '',
      month: '',
      head:'#FAFAFA',
      bodyDarkBottom:'#F7AC5E',
      leg: ['#F7AC5E','#FAFAFA','#5C4A3A','#F7AC5E'],
      headTopLeft:'#F7AC5E',
      headTopRight:'#5C4A3A',
    },
    messages: [
      '大家都在努力工作呢~',
      '今天的任务已分配好!',
      '所有猫猫状态良好~',
      '工作进度已更新! 📋',
      '让我来协调一下~',
    ]
  },
   {
    id: 'text',
    name: 'Pixel',
    role: 'Image Gen',
    description: '根据描述生成精美的图片。',
    accent: '#90CAF9',
    item: 'camera',
    catColors: {
      body: '#FAF3EB',
      bodyDark: '#FAF3EB',
      belly: '#FAF3EB',
      earInner: '#F7AC5E',
      eyes: '#A1E0FF',
      nose: '#5D4037',
      blush: '#FFCCBC',
      stroke: '#5D4037',
      apron: '#B39DDB',
      apronLight: '#EDE7F6',
      apronLine: '#B39DDB',
      desk: '#D1C4E9',
      deskDark: '#9575CD',
      deskLeg: '#B39DDB',
      paw: '#F7AC5E',
      tail: '#F7AC5E',
      faceDark:'#F7AC5E',
      month:'#333',
      head:'',
      bodyDarkBottom:'',
      leg:'',
      headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '画面构图中... 🖼️',
      '色彩搭配完成~',
      '高清大图生成中!',
      '这张图太美了! ✨',
      '想生成什么画面?',
    ]
  },
  {
    id: 'sing',
    name: 'Pixel',
    role: 'Image Gen',
    description: '根据描述生成精美的图片。',
    accent: '#90CAF9',
    item: 'camera',
    catColors: {
      body: '#FFF',
      bodyDark: '#FFF',
      belly: '#FFF',
      earInner: '#FFF',
      eyes: '#5D4037',
      nose: '#5D4037',
      blush: '#FFCCBC',
      stroke: '#5D4037',
      apron: '#B39DDB',
      apronLight: '#EDE7F6',
      apronLine: '#B39DDB',
      desk: '#D1C4E9',
      deskDark: '#9575CD',
      deskLeg: '#B39DDB',
      paw: '#FFF',
      tail: '#FFF',
      faceDark:'',
      month:'#333',
      head:'',
      bodyDarkBottom:'',
      leg:'',
      headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '画面构图中... 🖼️',
      '色彩搭配完成~',
      '高清大图生成中!',
      '这张图太美了! ✨',
      '想生成什么画面?',
    ]
  },
  {
    id: 'milk',
    name: 'Tama',
    role: 'Manager',
    description: '统筹管理所有小猫助手的工作。',
    accent: '#FFB74D',
    item: 'clipboard',
    catColors: {
      body: '#FFF',
      bodyDark: '',
      belly: '#FFFFFF',
      earInner: '#FFB5C5',
      eyes: '#000',
      nose: '#E8998D',
      blush: '#FFB5C5',
      stroke: '#5D4037',
      apron: '#FFB74D',
      apronLight: '#FFF3E0',
      apronLine: '#FFB74D',
      desk: '#FFE0B2',
      deskDark: '#FFB74D',
      deskLeg: '#FFCC80',
      paw: ['#333','#FAFAFA','#333','#333'],
      tail: '#333',
      faceDark: '',
      month: '',
      head:'#FFF',
      bodyDarkBottom:'#333',
      leg: ['#FAFAFA','#333','#333','#FAFAFA'],
      headTopLeft:'#333',
      headTopRight:'#333',
    },
    messages: [
      '大家都在努力工作呢~',
      '今天的任务已分配好!',
      '所有猫猫状态良好~',
      '工作进度已更新! 📋',
      '让我来协调一下~',
    ]
  },
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
    } else if (id === 'image') {
        navigate('/image-gen');
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
