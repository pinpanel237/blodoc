'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function TOC() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const containerRef = useRef<HTMLUListElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3')
    ) as HTMLElement[];

    if (elements.length === 0) return;

    const items = elements.map((elem, index) => {
      const id = elem.id || `heading-${index}`;
      elem.id = id;
      return { id, text: elem.textContent || '', level: Number(elem.tagName.replace('H', '')) };
    });
    setHeadings(items);

    // 스크롤 위치 기반으로 현재 가장 적합한 헤딩 id를 계산하는 알고리즘
    const updateActiveHeading = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. 페이지 최하단 바닥 도달 시 -> 무조건 마지막 헤딩 활성화
      if (windowHeight + scrollPosition >= documentHeight - 50) {
        if (items.length > 0) {
          setActiveId(items[items.length - 1].id);
        }
        return;
      }

      // 2. 각 헤딩의 top 위치 계산 (상단 오프셋 고려: 120px)
      const HEADER_OFFSET = 120;
      let currentActiveId = items[0]?.id || '';

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const rect = element.getBoundingClientRect();

        if (rect.top <= HEADER_OFFSET) {
          currentActiveId = element.id;
        } else {
          break;
        }
      }

      setActiveId(currentActiveId);
    };

    // 초기 렌더링 시 스크롤 위치 계산
    updateActiveHeading();

    window.addEventListener('scroll', updateActiveHeading, { passive: true });
    window.addEventListener('resize', updateActiveHeading, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveHeading);
      window.removeEventListener('resize', updateActiveHeading);
    };
  }, []);

  // 인디케이터(막대기) 위치 동적 슬라이딩 갱신
  useEffect(() => {
    if (!activeId || !containerRef.current || !indicatorRef.current) return;

    const activeLi = containerRef.current.querySelector<HTMLElement>(
      `[data-heading-id="${CSS.escape(activeId)}"]`
    );
    if (activeLi) {
      // containerRef (ul) 기준 오프셋 계산으로 100% 일치하는 수직 Y 위치 구함
      const targetTop = activeLi.offsetTop + activeLi.offsetHeight / 2 - 8;
      indicatorRef.current.style.transform = `translateY(${targetTop}px)`;
    }
  }, [activeId, headings]);

  if (headings.length === 0) return null;

  return (
    <aside style={{ position: 'sticky', top: '5rem', alignSelf: 'start', minWidth: '220px' }}>
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
          {/* 플랫(flat) 스타일의 슬라이딩 활성 인디케이터 (막대기) */}
          <div
            ref={indicatorRef}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '2px',
              height: '16px',
              borderRadius: '2px',
              background: '#6366F1',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform',
            }}
          />
        </div>

        <ul
          ref={containerRef}
          style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            fontSize: '0.875rem',
            flex: 1,
            position: 'relative',
          }}
        >
          {headings.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={item.id}
                data-heading-id={item.id}
                style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
              >
                <motion.a
                  href={`#${item.id}`}
                  animate={{
                    color: isActive ? '#6366F1' : 'var(--text-secondary)',
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
