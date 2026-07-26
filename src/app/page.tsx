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
      {/* 1. 상단 히로 배너 섹션 (일반적인 텍스트) */}
      <section className="flouna-full-bleed-hero astryx-banner">
        <img
          src="/assets/hero-banner.png"
          alt="Blog Hero Banner"
          className="flouna-hero-bg-img"
        />
        <div className="flouna-hero-inner">
          <div className="flouna-badge astryx-badge-pill">
            개인 기술 블로그 & 기록 공간
          </div>
          <h1 className="flouna-hero-title">
            생각과 기록을 정리하는 <br />
            <span className="flouna-title-gradient">개인 블로그입니다</span>
          </h1>
          <p className="flouna-hero-desc">
            옵시디언에서 작성한 마크다운 노트를 기반으로 정적 페이지를 자동 생성하여 작성된 블로그 공간입니다.
          </p>
          <div className="flouna-cta-group">
            <Link href="#posts" className="btn-primary astryx-btn-primary">
              포스트 목록 보기
            </Link>
            <a
              href="https://github.com/pinpanel237/blodoc"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary astryx-btn-secondary"
            >
              GitHub 저장소
            </a>
          </div>
        </div>
      </section>

      <div className="main-container">
        {/* 2. 주요 포스트 섹션 */}
        {featuredPost && (
          <section id="posts" style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  주요 포스트
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  최근 작성된 대표 포스트 목록입니다.
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
                    <span className="badge-featured astryx-badge-pill">대표 포스트</span>
                    <h3 className="featured-title">{featuredPost.title}</h3>
                    <p className="featured-summary">{featuredPost.summary}</p>
                  </div>
                  <div className="card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div className="author-avatar">OP</div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{featuredPost.date}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>3분 읽기</span>
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

        {/* 3. 전체 포스트 섹션 */}
        <section id="all-articles">
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                전체 포스트
              </h2>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                총 {posts.length}개의 포스트
              </span>
            </div>
          </div>

          {/* 카테고리 필터 바 */}
          <div className="category-filter-bar" style={{ marginBottom: '2.5rem' }}>
            <button className="chip-btn astryx-chip active">전체</button>
            <button className="chip-btn astryx-chip">옵시디언</button>
            <button className="chip-btn astryx-chip">웹 개발</button>
            <button className="chip-btn astryx-chip">디자인</button>
            <button className="chip-btn astryx-chip">일반</button>
          </div>

          {/* 포스트 카드 그리드 */}
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
