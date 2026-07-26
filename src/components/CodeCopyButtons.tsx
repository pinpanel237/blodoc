'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

/**
 * 마크다운 본문의 코드 블록에 복사 버튼을 동적으로 주입하는 클라이언트 컴포넌트
 * 포스트 페이지에서 `<article>` 아래에 삽입합니다.
 */
export default function CodeCopyButtons() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const codeBlocks = Array.from(document.querySelectorAll('.markdown-body pre'));

    codeBlocks.forEach((pre, index) => {
      // 중복 주입 방지
      if (pre.querySelector('.code-copy-btn')) return;

      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.setAttribute('data-index', String(index));
      btn.setAttribute('aria-label', '코드 복사');
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span>복사</span>
      `;

      btn.onclick = async () => {
        const code = pre.querySelector('code')?.textContent || '';
        try {
          await navigator.clipboard.writeText(code);
          btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            <span>복사됨!</span>
          `;
          btn.style.background = 'rgba(34, 197, 94, 0.2)';
          btn.style.borderColor = 'rgba(34, 197, 94, 0.5)';
          btn.style.color = '#86efac';
          btn.style.transform = 'scale(1.05)';

          setTimeout(() => {
            btn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              <span>복사</span>
            `;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.style.transform = '';
          }, 2000);
        } catch {
          // 클립보드 접근 실패 시 무시
        }
      };

      wrapper.appendChild(btn);
    });
  }, []);

  return null;
}
