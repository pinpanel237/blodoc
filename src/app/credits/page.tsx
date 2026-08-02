import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLayoutPage } from '@/lib/posts';
import { renderMarkdown } from '@/lib/markdown';
import CodeCopyButtons from '@/components/CodeCopyButtons';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '저작권 및 출처 | blodoc',
  description: 'blodoc 블로그에 사용된 공통 배경 이미지, 썸네일 및 오픈소스 폰트·디자인 시스템 출처 안내입니다.',
};

export default async function CreditsPage() {
  const pageData = getLayoutPage('credits.md');

  if (!pageData) {
    notFound();
  }

  const contentHtml = await renderMarkdown(pageData.content);

  return (
    <div className="astryx-theme-root">
      {/* 히어로 배너 */}
      <section className="post-hero-banner">
        <img
          src="/assets/hero-banner.png"
          alt={pageData.title}
          className="post-hero-bg-img"
        />
        <div className="post-hero-inner">
          <div style={{ marginBottom: '0.8rem' }}>
            <Link href="/" className="category-pill" style={{ display: 'inline-block' }}>
              ← 메인으로 돌아가기
            </Link>
          </div>
          <h1 className="post-detail-title">{pageData.title}</h1>
          {pageData.summary && (
            <p className="post-detail-summary" style={{ marginTop: '0.5rem', opacity: 0.85 }}>
              {pageData.summary}
            </p>
          )}
        </div>
      </section>

      {/* 본문 콘텐츠 */}
      <div className="flouna-detail-container" style={{ maxWidth: '840px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <article className="markdown-body">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          <CodeCopyButtons />
        </article>
      </div>
    </div>
  );
}
