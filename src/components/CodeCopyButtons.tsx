'use client';

import { useEffect } from 'react';

/**
 * 마크다운 본문의 코드 블록(.code-block-wrapper) 상단 우측에
 * '코드 복사하기' 선명한 불투명 칩 버튼을 주입하는 클라이언트 컴포넌트
 */
export default function CodeCopyButtons() {
  useEffect(() => {
    const codeWrappers = Array.from(document.querySelectorAll('.markdown-body .code-block-wrapper'));

    if (codeWrappers.length > 0) {
      codeWrappers.forEach((wrapper, index) => {
        if (wrapper.querySelector('.code-copy-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.setAttribute('data-index', String(index));
        btn.setAttribute('aria-label', '코드 복사하기');
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span>코드 복사하기</span>
        `;

        btn.onclick = async () => {
          // 라인 번호를 제외하고 순수 코드 텍스트만 추출
          const lineContentElements = Array.from(wrapper.querySelectorAll('pre code .line-content'));
          let codeText = '';

          if (lineContentElements.length > 0) {
            codeText = lineContentElements.map(el => el.textContent || '').join('\n');
          } else {
            codeText = wrapper.querySelector('pre code')?.textContent || '';
          }

          try {
            await navigator.clipboard.writeText(codeText);
            btn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>복사 완료!</span>
            `;
            btn.classList.add('copied');

            setTimeout(() => {
              btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                <span>코드 복사하기</span>
              `;
              btn.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
          }
        };

        const header = wrapper.querySelector('.code-block-header');
        if (header) {
          header.appendChild(btn);
        } else {
          wrapper.appendChild(btn);
        }
      });
      return;
    }

    // 레거시 일반 pre 호환
    const legacyBlocks = Array.from(document.querySelectorAll('.markdown-body pre'));
    legacyBlocks.forEach((pre, index) => {
      if (pre.querySelector('.code-copy-btn') || pre.parentElement?.classList.contains('code-block-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.setAttribute('data-index', String(index));
      btn.setAttribute('aria-label', '코드 복사하기');
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span>코드 복사하기</span>
      `;

      btn.onclick = async () => {
        const codeText = pre.querySelector('code')?.textContent || '';
        try {
          await navigator.clipboard.writeText(codeText);
          btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>복사 완료!</span>
          `;
          btn.classList.add('copied');

          setTimeout(() => {
            btn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              <span>코드 복사하기</span>
            `;
            btn.classList.remove('copied');
          }, 2000);
        } catch {
          // ignore
        }
      };

      wrapper.appendChild(btn);
    });
  }, []);

  return null;
}
