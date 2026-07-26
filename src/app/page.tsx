import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-static';

export default function HomePage() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const subPosts = posts.slice(1, 3);

  return (
    <div className="astryx-theme-root">
      {/* 🚀 3D Visual Hero Showcase Banner */}
      <section className="showcase-banner astryx-banner">
        <img
          src="/assets/hero-banner.png"
          alt="Obsidian Digital Garden Hero Banner"
          className="banner-bg-img"
        />
        <div className="banner-content">
          <div className="banner-pill astryx-badge-pill">
            ✨ Obsidian Automatic Sync Engine v1.0
          </div>
          <h1 className="banner-title">
            생각과 노트를 한눈에 <br />
            <span className="banner-title-gradient">디지털 가든으로 발행하세요</span>
          </h1>
          <p className="banner-desc">
            옵시디언 마크다운 노트를 GitHub 저장소에 푸시하면 Vercel SSG 파이프라인을 통해 초고속 정적 블로그로 자동 변환됩니다.
          </p>
          <div className="banner-cta-group">
            <Link href="#posts" className="btn-primary astryx-btn-primary">
              🚀 포스트 구경하기
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary astryx-btn-secondary"
            >
              📖 Obsidian Setup 가이드
            </a>
          </div>
        </div>
      </section>

      {/* 🌟 Dribbble Style Bento Grid Magazine Hero */}
      {featuredPost && (
        <section className="bento-hero-grid" id="posts">
          {/* Main Featured Bento Card */}
          <Link href={`/posts/${featuredPost.slug}`} className="bento-card-featured astryx-card-featured">
            <div className="bento-img-container">
              <img
                src={featuredPost.thumbnail || '/assets/blog-demo.png'}
                alt={featuredPost.title}
                className="bento-img"
              />
            </div>
            <div className="bento-content">
              <div>
                <span className="badge-featured astryx-badge-pill">🔥 Featured Story</span>
                <h2 className="featured-title">{featuredPost.title}</h2>
                <p className="featured-summary">{featuredPost.summary}</p>
              </div>
              <div className="card-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div className="author-avatar">OP</div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{featuredPost.date}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱️ 5 min read</span>
              </div>
            </div>
          </Link>

          {/* Sub Bento Stack */}
          <div className="bento-secondary-stack">
            {subPosts.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="bento-card-sub astryx-card-sub">
                <div>
                  <span className="card-category astryx-badge" style={{ fontSize: '0.7rem' }}>
                    {post.category}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.4rem 0', lineHeight: 1.35 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.summary}
                  </p>
                </div>
                <div className="card-footer" style={{ borderTop: 'none', paddingTop: 0, marginTop: '0.8rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.date}</span>
                  <span className="tag-pill astryx-token-tag">#{post.tags[0] || 'Note'}</span>
                </div>
              </Link>
            ))}

            {subPosts.length < 2 && (
              <div className="bento-card-sub astryx-card-sub" style={{ background: 'var(--gradient-glow)', justifyContent: 'center', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  🌿 Obsidian Digital Garden
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  옵시디언 마크다운 노트를 GitHub에 푸시하여 실시간으로 발행하세요.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 🏷️ Category Filter Chips Bar */}
      <div className="category-filter-bar">
        <button className="chip-btn astryx-chip active">✨ All Stories</button>
        <button className="chip-btn astryx-chip">🔮 Obsidian</button>
        <button className="chip-btn astryx-chip">⚡ Next.js</button>
        <button className="chip-btn astryx-chip">🎨 Design</button>
        <button className="chip-btn astryx-chip">💻 Dev Logs</button>
      </div>

      {/* 📰 Dribbble Visual Card Grid */}
      <div className="dribbble-posts-grid">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
