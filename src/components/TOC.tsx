'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TOC() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3'));
    const items: TOCItem[] = elements.map((elem, index) => {
      const id = elem.id || `heading-${index}`;
      elem.id = id;
      return {
        id,
        text: elem.textContent || '',
        level: Number(elem.tagName.replace('H', '')),
      };
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -70% 0px' }
    );

    elements.forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside style={{ position: 'sticky', top: '5rem', alignSelf: 'start', minWidth: '220px' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
        Table of Contents
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
        {headings.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}>
            <a
              href={`#${item.id}`}
              style={{
                color: activeId === item.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontWeight: activeId === item.id ? 700 : 400,
                transition: 'color 0.2s ease',
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
