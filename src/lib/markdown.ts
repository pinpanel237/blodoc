import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import hljs from 'highlight.js';
import { parseObsidianMarkdown } from './obsidian';

// 언어 표시명 및 키 표준화 맵
const LANGUAGE_MAP: Record<string, { label: string; key: string }> = {
  js: { label: 'JAVASCRIPT', key: 'js' },
  javascript: { label: 'JAVASCRIPT', key: 'js' },
  jsx: { label: 'REACT JSX', key: 'jsx' },
  ts: { label: 'TYPESCRIPT', key: 'ts' },
  typescript: { label: 'TYPESCRIPT', key: 'ts' },
  tsx: { label: 'REACT TSX', key: 'tsx' },
  py: { label: 'PYTHON', key: 'python' },
  python: { label: 'PYTHON', key: 'python' },
  html: { label: 'HTML', key: 'html' },
  htm: { label: 'HTML', key: 'html' },
  css: { label: 'CSS', key: 'css' },
  scss: { label: 'SCSS', key: 'css' },
  sass: { label: 'SASS', key: 'css' },
  json: { label: 'JSON', key: 'json' },
  json5: { label: 'JSON', key: 'json' },
  sh: { label: 'SHELL', key: 'bash' },
  bash: { label: 'BASH', key: 'bash' },
  zsh: { label: 'ZSH', key: 'bash' },
  shell: { label: 'SHELL', key: 'bash' },
  terminal: { label: 'TERMINAL', key: 'bash' },
  sql: { label: 'SQL', key: 'sql' },
  cpp: { label: 'C++', key: 'cpp' },
  c: { label: 'C', key: 'cpp' },
  cs: { label: 'C#', key: 'cpp' },
  csharp: { label: 'C#', key: 'cpp' },
  rust: { label: 'RUST', key: 'rust' },
  rs: { label: 'RUST', key: 'rust' },
  go: { label: 'GO', key: 'go' },
  golang: { label: 'GO', key: 'go' },
  java: { label: 'JAVA', key: 'java' },
  kt: { label: 'KOTLIN', key: 'java' },
  kotlin: { label: 'KOTLIN', key: 'java' },
  md: { label: 'MARKDOWN', key: 'md' },
  markdown: { label: 'MARKDOWN', key: 'md' },
  yml: { label: 'YAML', key: 'json' },
  yaml: { label: 'YAML', key: 'json' },
};

/**
 * 하이라이팅된 코드를 각 줄 단위(<span class="code-line">)로 래핑하고, 
 * 라인 번호(.line-number)와 텍스트 영역(.line-content)을 명확하게 분리
 */
function wrapCodeLines(highlightedHtml: string): string {
  if (!highlightedHtml) return '';

  const lines = highlightedHtml.split(/\r?\n/);
  if (lines.length > 1 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  return lines
    .map((line, idx) => {
      const lineNum = idx + 1;
      const lineContent = line === '' ? ' ' : line;
      return `<span class="code-line"><span class="line-number">${lineNum}</span><span class="line-content">${lineContent}</span></span>`;
    })
    .join('\n');
}

/**
 * 마크다운 코드 블록 HTML 내의 <pre><code class="language-xyz">...</code></pre> 구문을
 * 아이콘 없는 순수 언어 이름 텍스트 파스텔 겹침 탭 배지 구조로 후처리 변환
 */
function processCodeBlocks(htmlContent: string): string {
  // <pre...> 및 <code...> 태그 전체 속성과 공백/줄바꿈을 완벽하게 포착하는 견고한 정규식
  const codeBlockRegex = /<pre(\s+[^>]*)?>\s*<code(\s+[^>]*)?>([\s\S]*?)<\/code>\s*<\/pre>/gi;

  return htmlContent.replace(codeBlockRegex, (match, preAttrs = '', codeAttrs = '', rawCode) => {
    // html 엔티티 디코딩
    const unescapedCode = rawCode
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // preAttrs 및 codeAttrs 모두에서 class 속성 추출
    const combinedAttrs = `${preAttrs} ${codeAttrs}`;
    const classMatches = combinedAttrs.matchAll(/class=["']([^"']*)["']/gi);
    let classAttrString = '';
    for (const m of classMatches) {
      classAttrString += ' ' + m[1];
    }

    // language-xxx 또는 lang-xxx 패턴 추출
    const langMatch = classAttrString.match(/(?:language|lang)-([^\s"':]+)/i);
    let rawLang = langMatch ? langMatch[1].toLowerCase() : '';

    // 접두사가 없는 경우 단어 중 지원되는 언어 식별자 검색
    if (!rawLang) {
      const words = classAttrString.trim().split(/\s+/);
      for (const w of words) {
        const lower = w.toLowerCase();
        if (LANGUAGE_MAP[lower] || (hljs.getLanguage && hljs.getLanguage(lower))) {
          rawLang = lower;
          break;
        }
      }
    }

    if (!rawLang) {
      rawLang = 'text';
    }

    const langInfo = LANGUAGE_MAP[rawLang] || {
      label: rawLang !== 'text' ? rawLang.toUpperCase() : 'CODE',
      key: rawLang,
    };

    let highlightedCode = '';
    let validLangClass = `hljs language-${langInfo.key}`;

    if (rawLang && rawLang !== 'text' && hljs.getLanguage(rawLang)) {
      try {
        highlightedCode = hljs.highlight(unescapedCode, { language: rawLang }).value;
      } catch {
        highlightedCode = hljs.highlightAuto(unescapedCode).value;
      }
    } else {
      try {
        const autoResult = hljs.highlightAuto(unescapedCode);
        highlightedCode = autoResult.value;
      } catch {
        highlightedCode = unescapedCode
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
    }

    const lineWrappedHtml = wrapCodeLines(highlightedCode);

    return `
<div class="code-block-wrapper" data-language="${langInfo.key}">
  <div class="code-block-header">
    <div class="code-block-header-left">
      <div class="code-block-tag lang-tag-${langInfo.key}">
        <span class="tag-label">${langInfo.label}</span>
      </div>
    </div>
  </div>
  <pre><code class="${validLangClass}">${lineWrappedHtml}</code></pre>
</div>`.trim();
  });
}

/**
 * 옵시디언 특화 마크다운 파싱 및 Syntax Highlighting이 포함된 HTML 생성 유틸
 */
export async function renderMarkdown(markdownContent: string): Promise<string> {
  if (!markdownContent) return '';

  // 1. Obsidian 문법 변환 (Wikilinks, Callouts, Images)
  const obsidianParsed = parseObsidianMarkdown(markdownContent);

  // 2. Remark 마크다운 -> 기본 HTML 변환
  const processed = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(obsidianParsed);

  const rawHtml = processed.toString();

  // 3. Syntax Highlighting, 라인 번호 및 순수 언어 이름 탭 주입
  return processCodeBlocks(rawHtml);
}
