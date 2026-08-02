'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PostMetaData } from '@/lib/posts';

export default function PostCard({ post }: { post: PostMetaData }) {
  const router = useRouter();
  const thumbnailSrc = post.thumbnail || '/assets/blog-demo.png';

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/?category=${encodeURIComponent(post.category)}`);
  };

  return (
    <Link href={`/posts/${post.slug}`} className="visual-post-card astryx-card">
      <div className="card-img-wrapper">
        <img src={thumbnailSrc} alt={post.title} />
      </div>

      <div className="card-body">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span
              className="card-category astryx-badge"
              onClick={handleCategoryClick}
              style={{ cursor: 'pointer' }}
              title={`${post.category} 카테고리로 필터링`}
            >
              {post.category ? post.category.split('/').join(' › ') : ''}
            </span>
          </div>

          <h3 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.4rem 0 0.6rem', lineHeight: 1.35, wordBreak: 'keep-all', maxWidth: '100%' }}>
            {post.title}
          </h3>
          <p className="card-summary" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {post.summary}
          </p>
        </div>

        <div className="card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {post.date}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center', minHeight: '1.6rem', marginTop: '0.25rem' }}>
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag-pill astryx-token-tag" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

