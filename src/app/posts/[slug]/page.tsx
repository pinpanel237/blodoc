import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { parseObsidianMarkdown } from '@/lib/obsidian';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
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

  const obsidianParsed = parseObsidianMarkdown(post.content);

  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(obsidianParsed);

  const contentHtml = processedContent.toString();
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
            <span className="card-category astryx-badge">{post.category}</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>3분 읽기</span>
          </div>

          <h1 className="post-hero-title">
            {post.title}
          </h1>

          <div className="post-hero-meta">
            <span>작성일: {post.date}</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>태그: {post.tags.join(', ')}</span>
          </div>
        </div>
      </section>

      {/* 📖 본문 아티클 영역 */}
      <div className="main-container post-content-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '3.5rem' }}>
          <article>
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            {/* 🖱️ 코드 블록 복사 버튼 동적 주입 */}
            <CodeCopyButtons />
          </article>

          <TOC />
        </div>
      </div>
    </div>
  );
}
