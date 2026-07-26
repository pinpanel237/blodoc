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
  // Next.js 16 호환: params가 Promise일 수 있으므로 await 처리
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '3rem' }}>
      <article>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <span className="card-category astryx-badge">{post.category}</span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0.5rem 0', lineHeight: 1.2 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
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
