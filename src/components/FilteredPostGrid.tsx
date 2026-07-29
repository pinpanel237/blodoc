'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
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

  // 1. 모든 포스트에서 메인 카테고리 및 서브 카테고리 구조 수집
  const { mainCategories, categoryTree } = useMemo(() => {
    const tree: Record<string, Set<string>> = {};

    posts.forEach((p) => {
      if (!p.category) return;
      const parts = p.category.split('/');
      const main = parts[0].trim();
      const sub = parts.slice(1).join('/').trim();

      if (!tree[main]) {
        tree[main] = new Set();
      }
      if (sub) {
        tree[main].add(sub);
      }
    });

    const mains = ['전체', ...Object.keys(tree).sort()];
    return { mainCategories: mains, categoryTree: tree };
  }, [posts]);

  const categoryParam = searchParams.get('category');
  const pageParam = searchParams.get('page');

  // URL Query 파라미터에서 현재 메인 카테고리 & 서브 카테고리 파싱
  const { currentMainCategory, currentSubCategory } = useMemo(() => {
    if (!categoryParam || categoryParam === '전체') {
      return { currentMainCategory: '전체', currentSubCategory: '전체' };
    }

    const parts = categoryParam.split('/');
    const main = parts[0].trim();
    const sub = parts.slice(1).join('/').trim();

    if (mainCategories.includes(main)) {
      return {
        currentMainCategory: main,
        currentSubCategory: sub || '전체',
      };
    }

    return { currentMainCategory: '전체', currentSubCategory: '전체' };
  }, [categoryParam, mainCategories]);

  const [currentPage, setCurrentPage] = useState<number>(1);

  // 페이지 파라미터 상태 동기화
  useEffect(() => {
    const parsedPage = parseInt(pageParam || '1', 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      setCurrentPage(parsedPage);
    } else {
      setCurrentPage(1);
    }
  }, [pageParam]);

  // SEO 친화적 URL 생성 헬퍼
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

  // 선택된 메인 카테고리 & 서브 카테고리에 맞는 포스트 필터링 (하위 카테고리 묶음 포함)
  const filteredPosts = useMemo(() => {
    if (currentMainCategory === '전체') {
      return posts;
    }

    return posts.filter((post) => {
      if (!post.category) return false;
      const parts = post.category.split('/');
      const postMain = parts[0].trim();
      const postSub = parts.slice(1).join('/').trim();

      if (postMain !== currentMainCategory) {
        return false;
      }

      if (currentSubCategory === '전체') {
        // 상위 카테고리 선택 시 하위 카테고리 전체 묶어서 포함
        return true;
      }

      return postSub === currentSubCategory;
    });
  }, [posts, currentMainCategory, currentSubCategory]);

  // 현재 선택된 메인 카테고리의 하위 카테고리 목록
  const availableSubCategories = useMemo(() => {
    if (currentMainCategory === '전체' || !categoryTree[currentMainCategory]) {
      return [];
    }
    const subs = Array.from(categoryTree[currentMainCategory]).sort();
    return subs.length > 0 ? ['전체', ...subs] : [];
  }, [currentMainCategory, categoryTree]);

  // 페이지 계산
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  // 현재 페이지에 해당하는 포스트 슬라이싱
  const startIndex = (validCurrentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // 각 메인 카테고리별 포스트 수 계산 (하위 포스트 전체 포함 묶음 개수)
  const getMainCategoryCount = (mainCat: string) => {
    if (mainCat === '전체') return posts.length;
    return posts.filter((p) => p.category === mainCat || p.category.startsWith(`${mainCat}/`)).length;
  };

  // 서브 카테고리별 포스트 수 계산
  const getSubCategoryCount = (subCat: string) => {
    if (subCat === '전체') return getMainCategoryCount(currentMainCategory);
    const fullCat = `${currentMainCategory}/${subCat}`;
    return posts.filter((p) => p.category === fullCat).length;
  };

  const getCategoryLabel = () => {
    if (currentMainCategory === '전체') return '전체';
    if (currentSubCategory === '전체') return currentMainCategory;
    return `${currentMainCategory} > ${currentSubCategory}`;
  };

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
            {currentMainCategory === '전체'
              ? `총 ${posts.length}개 중 ${validCurrentPage}/${totalPages} 페이지`
              : `'${getCategoryLabel()}' 카테고리 ${filteredPosts.length}개 중 ${validCurrentPage}/${totalPages} 페이지`}
          </span>
        </div>
      </div>

      {/* 1차: 동적 메인 카테고리 필터 바 */}
      <div
        className="category-filter-bar"
        style={{ marginBottom: availableSubCategories.length > 0 ? '0.8rem' : '2.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
      >
        {mainCategories.map((mainCat) => {
          const isActive = currentMainCategory === mainCat;
          const count = getMainCategoryCount(mainCat);
          const targetUrl = createPageUrl(1, mainCat);

          return (
            <Link
              key={mainCat}
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
              {mainCat}
              <span style={{ marginLeft: '0.35rem', fontSize: '0.75rem', opacity: 0.7 }}>
                ({count})
              </span>
            </Link>
          );
        })}
      </div>

      {/* 2차: 서브 카테고리 필터 바 (메인 카테고리에 하위 항목이 존재할 때만 표시) */}
      {availableSubCategories.length > 0 && (
        <div
          className="sub-category-filter-bar"
          style={{
            marginBottom: '2.5rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-secondary)',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            세부 카테고리
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {availableSubCategories.map((subCat) => {
              const isActive = currentSubCategory === subCat;
              const count = getSubCategoryCount(subCat);
              const targetCategoryParam = subCat === '전체' ? currentMainCategory : `${currentMainCategory}/${subCat}`;
              const targetUrl = createPageUrl(1, targetCategoryParam);

              return (
                <Link
                  key={subCat}
                  href={targetUrl}
                  className={`sub-chip-btn ${isActive ? 'active' : ''}`}
                  style={{
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {subCat === '전체' ? '전체 보기' : subCat}
                  <span style={{ marginLeft: '0.3rem', fontSize: '0.72rem', opacity: 0.7 }}>
                    ({count})
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

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
            선택하신 <strong>'{getCategoryLabel()}'</strong> 카테고리의 게시글이 없습니다.
          </p>
        </div>
      )}

      {/* 📖 SEO 최적화 페이지네이션 바 */}
      {totalPages > 1 && (
        <nav aria-label="포스트 페이지네이션" className="pagination-nav">
          {/* 현재 선택된 파라미터 유지 */}
          {(() => {
            const currentCatParam = currentSubCategory === '전체' ? currentMainCategory : `${currentMainCategory}/${currentSubCategory}`;

            return (
              <>
                {/* 맨처음 페이지 (<<) */}
                {validCurrentPage > 1 ? (
                  <Link
                    href={createPageUrl(1, currentCatParam)}
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
                    href={createPageUrl(validCurrentPage - 1, currentCatParam)}
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

                {/* 페이지 번호 링크들 */}
                {(() => {
                  const MAX_PAGES = 9;
                  let startPage = Math.max(1, validCurrentPage - Math.floor(MAX_PAGES / 2));
                  let endPage = Math.min(totalPages, startPage + MAX_PAGES - 1);

                  if (endPage - startPage + 1 < MAX_PAGES) {
                    startPage = Math.max(1, endPage - MAX_PAGES + 1);
                  }

                  const visiblePages = [];
                  for (let p = startPage; p <= endPage; p++) {
                    visiblePages.push(p);
                  }

                  return visiblePages.map((pageNum) => {
                    const isCurrent = pageNum === validCurrentPage;
                    return (
                      <Link
                        key={pageNum}
                        href={createPageUrl(pageNum, currentCatParam)}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={`page-link-btn astryx-chip ${isCurrent ? 'active' : ''}`}
                        title={`${pageNum} 페이지로 이동`}
                      >
                        {pageNum}
                      </Link>
                    );
                  });
                })()}

                {/* 다음 페이지 (>) */}
                {validCurrentPage < totalPages ? (
                  <Link
                    href={createPageUrl(validCurrentPage + 1, currentCatParam)}
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
                    href={createPageUrl(totalPages, currentCatParam)}
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
              </>
            );
          })()}
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

