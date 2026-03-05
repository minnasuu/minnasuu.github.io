import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CatSVG from '../components/CatSVG';
import '../styles/AssistantPage.scss';
import { assistants } from '../data';


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
