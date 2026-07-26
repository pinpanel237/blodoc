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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span className="card-category astryx-badge">{post.category}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3분 읽기</span>
          </div>

          <h3 className="card-title">{post.title}</h3>
          <p className="card-summary">{post.summary}</p>
        </div>

        <div className="card-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="author-avatar">OP</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {post.date}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag-pill astryx-token-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
