'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TOC() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3')
    );
    const items = elements.map((elem, index) => {
      const id = elem.id || `heading-${index}`;
      elem.id = id;
      return { id, text: elem.textContent || '', level: Number(elem.tagName.replace('H', '')) };
    });
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 보이는 항목 중 가장 위에 있는 것을 활성화
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-10% 0px -65% 0px' }
    );

    elements.forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, []);

  // 인디케이터 위치 동적 업데이트
  useEffect(() => {
    if (activeRef.current && indicatorRef.current) {
      const li = activeRef.current.closest('li');
      const aside = indicatorRef.current.closest('aside');
      if (li && aside) {
        const liRect = li.getBoundingClientRect();
        const asideRect = aside.getBoundingClientRect();
        indicatorRef.current.style.transform = `translateY(${liRect.top - asideRect.top + li.offsetHeight / 2 - 8}px)`;
      }
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  return (
    <aside
      style={{ position: 'sticky', top: '5rem', alignSelf: 'start', minWidth: '220px' }}
    >
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.85rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>TABLE OF CONTENTS</span>
      </div>

      <div style={{ position: 'relative', display: 'flex' }}>
        {/* 왼쪽 트랙 바 */}
        <div
          style={{
            width: '2px',
            marginRight: '0.75rem',
            background: 'var(--border-color)',
            borderRadius: '2px',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {/* 슬라이딩 활성 인디케이터 */}
          <div
            ref={indicatorRef}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '2px',
              height: '16px',
              borderRadius: '2px',
              background: 'linear-gradient(to bottom, #6366F1, #A855F7)',
              boxShadow: '0 0 6px rgba(99, 102, 241, 0.7)',
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        <ul
          style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            fontSize: '0.875rem',
            flex: 1,
          }}
        >
          {headings.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}>
                <motion.a
                  ref={isActive ? activeRef : null}
                  href={`#${item.id}`}
                  animate={{
                    color: isActive ? '#A5B4FC' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 400,
                    x: isActive ? 2 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'block',
                    padding: '0.25rem 0',
                    lineHeight: 1.5,
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.text}
                </motion.a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
