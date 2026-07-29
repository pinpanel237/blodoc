import Link from 'next/link';
import { getAllPosts, getHomePost } from '@/lib/posts';
import HeroTypewriter from '@/components/HeroTypewriter';
import FilteredPostGrid from '@/components/FilteredPostGrid';

export const dynamic = 'force-static';

export default function HomePage() {
  const posts = getAllPosts();
  const homeData = getHomePost();
  const featuredPost = posts[0];
  const subPosts = posts.slice(1, 3);

  return (
    <div className="astryx-theme-root">
      {/* 1. 상단 히로 배너 섹션 */}
      <section className="flouna-full-bleed-hero astryx-banner">
        <img
          src="/assets/hero-banner.png"
          alt="Blog Hero Banner"
          className="flouna-hero-bg-img"
        />
        <div className="flouna-hero-inner">
          {/* 3-3. 타이핑 효과 히어로 타이틀 */}
          <HeroTypewriter title={homeData.title} description={homeData.description} />
        </div>
      </section>

      <div className="main-container">
        {/* 2. 최신 포스트 섹션 */}
        {featuredPost && (
          <section id="posts" style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  최신 포스트
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  최근 작성된 포스트 목록입니다.
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
                    <span className="badge-featured astryx-badge-pill">최신 포스트</span>
                    <h3 className="featured-title">{featuredPost.title}</h3>
                    <p className="featured-summary">{featuredPost.summary}</p>
                  </div>
                  <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div className="author-avatar">OP</div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{featuredPost.date}</span>
                    </div>
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
                    <div className="card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', minHeight: '1.5rem', marginTop: '0.25rem' }}>
                        <span className="tag-pill astryx-token-tag" style={{ fontSize: '0.75rem' }}>#{post.tags[0] || 'Note'}</span>
                      </div>
                    </div>
                  </Link>
                ))}

                {subPosts.length < 2 && (
                  <div className="bento-card-sub astryx-card-sub" style={{ background: 'var(--gradient-glow)', justifyContent: 'center', textAlign: 'center' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                      블로그 메모
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

        {/* 3. 전체 포스트 섹션 (동적 카테고리 필터링 적용) */}
        <FilteredPostGrid posts={posts} />
      </div>
    </div>
  );
}

