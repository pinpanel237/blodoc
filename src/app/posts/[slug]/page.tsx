import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { renderMarkdown } from '@/lib/markdown';
import TOC from '@/components/TOC';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import CodeCopyButtons from '@/components/CodeCopyButtons';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await renderMarkdown(post.content);
  const coverImgSrc = post.thumbnail || '/assets/hero-banner.png';

  return (
    <div className="astryx-theme-root">
      {/* 📖 스크롤 읽기 진행률 바 */}
      <ReadingProgressBar />

      {/* 🌿 포스트 상단 감성 비주얼 배경 헤더 배너 (Post Hero Cover Header) */}
      <section className="post-hero-banner">
        <img
          src={coverImgSrc}
          alt={post.title}
          className="post-hero-bg-img"
        />
        <div className="post-hero-inner">
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem' }}>
            <Link
              href={`/?category=${encodeURIComponent(post.category)}`}
              className="card-category astryx-badge"
              style={{ textDecoration: 'none' }}
            >
              {post.category ? post.category.split('/').join(' › ') : ''}
            </Link>
          </div>

          <h1 className="post-hero-title">
            {post.title}
          </h1>

          <div className="post-hero-meta">
            <span>작성일: {post.date}</span>
            <span>태그: {post.tags.join(', ')}</span>
          </div>
        </div>
      </section>

      {/* 📖 본문 아티클 영역 */}
      <div className="main-container post-content-container">
        <div className="post-detail-layout">
          <article className="post-main-article">
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            {/* 🖱️ 코드 블록 복사 버튼 동적 주입 */}
            <CodeCopyButtons />
          </article>

          <div className="post-toc-aside">
            <TOC />
          </div>
        </div>
      </div>
    </div>
  );
}
