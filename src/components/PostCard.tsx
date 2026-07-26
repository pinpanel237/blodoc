import Link from 'next/link';
import { PostMetaData } from '@/lib/posts';

export default function PostCard({ post }: { post: PostMetaData }) {
  const thumbnailSrc = post.thumbnail || '/assets/blog-demo.png';

  return (
    <Link href={`/posts/${post.slug}`} className="visual-post-card astryx-card">
      <div className="card-img-wrapper">
        <img src={thumbnailSrc} alt={post.title} />
      </div>

      <div className="card-body">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span className="card-category astryx-badge">{post.category}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3분 읽기</span>
          </div>

          <h3 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.4rem 0 0.6rem', lineHeight: 1.35 }}>
            {post.title}
          </h3>
          <p className="card-summary" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {post.summary}
          </p>
        </div>

        <div className="card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div className="author-avatar">OP</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {post.date}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag-pill astryx-token-tag" style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
