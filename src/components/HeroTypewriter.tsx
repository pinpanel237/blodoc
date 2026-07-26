'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeroTypewriterProps {
  title: string;
  description: string;
}

export default function HeroTypewriter({ title, description }: HeroTypewriterProps) {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    // 0.4초 딜레이 후 타이핑 시작 (히어로 등장 후 자연스럽게)
    const delay = setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < title.length) {
          setDisplayedTitle(title.slice(0, index + 1));
          index++;
        } else {
          setIsTypingComplete(true);
          clearInterval(timer);
        }
      }, 55);
      return () => clearInterval(timer);
    }, 400);

    return () => clearTimeout(delay);
  }, [title]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* 타이핑 타이틀 */}
      <motion.h1
        className="flouna-hero-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0 4px' }}
      >
        <span>{displayedTitle}</span>
        <motion.span
          animate={{ opacity: isTypingComplete ? [1, 0, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 0.85, ease: 'easeInOut' }}
          style={{
            display: 'inline-block',
            width: '3px',
            height: '0.85em',
            background: 'linear-gradient(to bottom, #818CF8, #C084FC)',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(129,140,248,0.7)',
            verticalAlign: 'middle',
            marginLeft: '2px',
            flexShrink: 0,
          }}
        />
      </motion.h1>

      {/* 설명 텍스트 */}
      <motion.p
        className="flouna-hero-desc"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isTypingComplete ? 1 : 0, y: isTypingComplete ? 0 : 4 }}
        transition={{ duration: 0.5 }}
      >
        {description}
      </motion.p>

    </div>
  );
}
