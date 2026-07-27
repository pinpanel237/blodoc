'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { PostMetaData } from '@/lib/posts';

// 한 페이지당 노출할 포스트 개수 (Bento 3컬럼 그리드 고려)
const POSTS_PER_PAGE = 6;

interface FilteredPostGridProps {
  posts: PostMetaData[];
}

function PostGridContent({ posts }: FilteredPostGridProps) {
  const searchParams = useSearchParams();

  // 모든 포스트에서 유니크한 카테고리 목록 동적 수집
  const categories = [
    '전체',
    ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean))).sort(),
  ];

  const categoryParam = searchParams.get('category');
  const pageParam = searchParams.get('page');

  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 카테고리 및 페이지 파라미터 상태 동기화
  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('전체');
    }

    const parsedPage = parseInt(pageParam || '1', 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      setCurrentPage(parsedPage);
    } else {
      setCurrentPage(1);
    }
  }, [categoryParam, pageParam, categories]);

  // SEO 친화적 URL 생성 헬퍼 (검색엔진 크롤러가 <a href="...">를 수집할 수 있음)
  const createPageUrl = (page: number, category: string) => {
    const params = new URLSearchParams();
    if (category !== '전체') {
      params.set('category', category);
    }
    if (page > 1) {
      params.set('page', String(page));
    }
    const queryString = params.toString();
    return queryString ? `/?${queryString}#all-articles` : '/#all-articles';
  };

  // 선택된 카테고리에 맞는 포스트 필터링
  const filteredPosts =
    selectedCategory === '전체'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  // 페이지 계산
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  // 현재 페이지에 해당하는 포스트 슬라이싱
  const startIndex = (validCurrentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <section id="all-articles" style={{ scrollMarginTop: '2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            전체 포스트
          </h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {selectedCategory === '전체'
              ? `총 ${posts.length}개 중 ${validCurrentPage}/${totalPages} 페이지`
              : `'${selectedCategory}' 카테고리 ${filteredPosts.length}개 중 ${validCurrentPage}/${totalPages} 페이지`}
          </span>
        </div>
      </div>

      {/* 동적 카테고리 필터 바 (SEO Link 기반) */}
      <div
        className="category-filter-bar"
        style={{ marginBottom: '2.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          const count =
            category === '전체'
              ? posts.length
              : posts.filter((p) => p.category === category).length;

          // 카테고리 변경 시 페이지는 1페이지로 리셋
          const targetUrl = createPageUrl(1, category);

          return (
            <Link
              key={category}
              href={targetUrl}
              className={`chip-btn astryx-chip ${isActive ? 'active' : ''}`}
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {category}
              <span style={{ marginLeft: '0.35rem', fontSize: '0.75rem', opacity: 0.7 }}>
                ({count})
              </span>
            </Link>
          );
        })}
      </div>

      {/* 포스트 카드 그리드 */}
      {paginatedPosts.length > 0 ? (
        <div className="dribbble-posts-grid">
          {paginatedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
            borderRadius: '1rem',
            border: '1px dashed var(--border-color)',
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            선택하신 <strong>'{selectedCategory}'</strong> 카테고리의 게시글이 없습니다.
          </p>
        </div>
      )}

      {/* 📖 SEO 최적화 페이지네이션 바 (맨처음, 이전, 번호, 다음, 맨끝) */}
      {totalPages > 1 && (
        <nav aria-label="포스트 페이지네이션" className="pagination-nav">
          {/* 맨처음 페이지 (<<) */}
          {validCurrentPage > 1 ? (
            <Link
              href={createPageUrl(1, selectedCategory)}
              className="page-link-btn astryx-chip"
              title="첫 페이지로 이동"
              aria-label="첫 페이지"
            >
              « 첫페이지
            </Link>
          ) : (
            <span className="page-link-btn astryx-chip disabled" aria-hidden="true">
              « 첫페이지
            </span>
          )}

          {/* 이전 페이지 (<) */}
          {validCurrentPage > 1 ? (
            <Link
              href={createPageUrl(validCurrentPage - 1, selectedCategory)}
              rel="prev"
              className="page-link-btn astryx-chip"
              title="이전 페이지로 이동"
              aria-label="이전 페이지"
            >
              ‹ 이전
            </Link>
          ) : (
            <span className="page-link-btn astryx-chip disabled" aria-hidden="true">
              ‹ 이전
            </span>
          )}

          {/* 페이지 번호 링크들 (하이라이팅 적용) */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isCurrent = pageNum === validCurrentPage;
            return (
              <Link
                key={pageNum}
                href={createPageUrl(pageNum, selectedCategory)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`page-link-btn astryx-chip ${isCurrent ? 'active' : ''}`}
                title={`${pageNum} 페이지로 이동`}
              >
                {pageNum}
              </Link>
            );
          })}

          {/* 다음 페이지 (>) */}
          {validCurrentPage < totalPages ? (
            <Link
              href={createPageUrl(validCurrentPage + 1, selectedCategory)}
              rel="next"
              className="page-link-btn astryx-chip"
              title="다음 페이지로 이동"
              aria-label="다음 페이지"
            >
              다음 ›
            </Link>
          ) : (
            <span className="page-link-btn astryx-chip disabled" aria-hidden="true">
              다음 ›
            </span>
          )}

          {/* 맨끝 페이지 (>>) */}
          {validCurrentPage < totalPages ? (
            <Link
              href={createPageUrl(totalPages, selectedCategory)}
              className="page-link-btn astryx-chip"
              title="마지막 페이지로 이동"
              aria-label="마지막 페이지"
            >
              마지막 »
            </Link>
          ) : (
            <span className="page-link-btn astryx-chip disabled" aria-hidden="true">
              마지막 »
            </span>
          )}
        </nav>
      )}
    </section>
  );
}

export default function FilteredPostGrid({ posts }: FilteredPostGridProps) {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>포스트를 불러오는 중입니다...</p>
        </div>
      }
    >
      <PostGridContent posts={posts} />
    </Suspense>
  );
}
