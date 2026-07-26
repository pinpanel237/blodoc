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
      {/* 1️⃣ [상단 히로 배너 섹션] 🚀 플랫폼 안내 및 동기화 소개 */}
      <section className="flouna-full-bleed-hero astryx-banner">
        <img
          src="/assets/hero-banner.png"
          alt="Obsidian Digital Garden Hero Banner"
          className="flouna-hero-bg-img"
        />
        <div className="flouna-hero-inner">
          <div className="flouna-badge astryx-badge-pill">
            🌱 Obsidian Digital Garden & Editorial Space
          </div>
          <h1 className="flouna-hero-title">
            생각의 파편을 <br />
            <span className="flouna-title-gradient">시원하고 깊이 있게 기록합니다</span>
          </h1>
          <p className="flouna-hero-desc">
            옵시디언 마크다운 노트를 GitHub 저장소에 푸시하면 Vercel 정적 파이프라인을 통해 탁 트인 감성적인 디지털 가든으로 자동 발행됩니다.
          </p>
          <div className="flouna-cta-group">
            <Link href="#featured" className="btn-primary astryx-btn-primary">
              🚀 추천 포스트 읽기
            </Link>
            <a
              href="https://github.com/pinpanel237/blodoc"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary astryx-btn-secondary"
            >
              📖 GitHub 저장소 구경하기
            </a>
          </div>
        </div>
      </section>

      <div className="main-container">
        {/* 2️⃣ [추목할 스토리 섹션] 🔥 Featured & Highlight Articles */}
        {featuredPost && (
          <section id="featured" style={{ marginBottom: '4.5rem' }}>
            <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-indigo)', marginBottom: '0.3rem' }}>
                HIGHLIGHTED STORIES
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                  🔥 주목할 대표 이야기 (Featured Articles)
                </h2>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
                  가장 깊이 있게 다루어진 이 주의 메인 아티클입니다.
                </p>
              </div>
            </div>

            <div className="bento-hero-grid">
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
                    <span className="badge-featured astryx-badge-pill">🔥 Main Highlight</span>
                    <h3 className="featured-title">{featuredPost.title}</h3>
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
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.4rem 0', lineHeight: 1.35 }}>
                        {post.title}
                      </h4>
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
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                      🌿 Obsidian Digital Garden
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      옵시디언 마크다운 노트를 GitHub에 푸시하여 실시간으로 발행하세요.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3️⃣ [카테고리 탐색 & 전체 글 리스트 섹션] 📚 All Published Articles */}
        <section id="articles">
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-purple)', marginBottom: '0.3rem' }}>
              ALL ARTICLES & TOPICS
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                📚 전체 포스트 탐색 (All Articles)
              </h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                총 {posts.length}개의 마크다운 노트
              </span>
            </div>
          </div>

          {/* 🏷️ Category Filter Chips Bar */}
          <div className="category-filter-bar" style={{ marginBottom: '2.5rem' }}>
            <button className="chip-btn astryx-chip active">✨ 전체 (All)</button>
            <button className="chip-btn astryx-chip">🔮 Obsidian 사용법</button>
            <button className="chip-btn astryx-chip">⚡ Next.js / 웹 개발</button>
            <button className="chip-btn astryx-chip">🎨 디자인 시스템</button>
            <button className="chip-btn astryx-chip">💻 개발 일지</button>
          </div>

          {/* 📰 Dribbble Visual Card Grid */}
          <div className="dribbble-posts-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
