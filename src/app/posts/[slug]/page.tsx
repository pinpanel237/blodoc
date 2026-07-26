import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { parseObsidianMarkdown } from '@/lib/obsidian';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import TOC from '@/components/TOC';

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Next.js 15/16 App Router 비동기 params 처리 (Promise)
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

  // 1. Obsidian 문법 파싱 (Wikilink, Callout, Asset 이미지)
  const obsidianParsed = parseObsidianMarkdown(post.content);

  // 2. Remark -> HTML 변환
  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(obsidianParsed);

  const contentHtml = processedContent.toString();

  return (
    <div className="main-container post-detail-container" style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '3rem', paddingTop: '6.5rem' }}>
      <article>
        <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.75rem' }}>
          <span className="card-category astryx-badge">{post.category}</span>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, margin: '0.75rem 0', lineHeight: 1.25, letterSpacing: '-0.03em' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            <span>📅 {post.date}</span>
            <span>🏷️ {post.tags.join(', ')}</span>
          </div>
        </header>

        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      <TOC />
    </div>
  );
}
