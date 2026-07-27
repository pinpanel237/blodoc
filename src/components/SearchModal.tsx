'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PostMetaData } from '@/lib/posts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<PostMetaData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 검색 인덱스 데이터 불러오기 (첫 모달 오픈 시 1회 로드)
  useEffect(() => {
    if (isOpen && posts.length === 0) {
      setLoading(true);
      fetch('/api/search')
        .then((res) => res.json())
        .then((data: PostMetaData[]) => {
          setPosts(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load search index:', err);
          setLoading(false);
        });
    }
  }, [isOpen, posts.length]);

  // 모달이 열리면 포커스
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // 검색 필터링 로직
  const filteredPosts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(q);
      const summaryMatch = post.summary.toLowerCase().includes(q);
      const categoryMatch = post.category.toLowerCase().includes(q);
      const tagMatch = post.tags.some((t) => t.toLowerCase().includes(q));
      return titleMatch || summaryMatch || categoryMatch || tagMatch;
    }).slice(0, 8); // 최대 8개 표시
  }, [posts, query]);

  // 키보드 조작 (Up, Down, Enter, Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredPosts.length > 0 ? (prev + 1) % filteredPosts.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredPosts.length > 0 ? (prev - 1 + filteredPosts.length) % filteredPosts.length : 0
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredPosts.length > 0 && filteredPosts[selectedIndex]) {
          const target = filteredPosts[selectedIndex];
          onClose();
          router.push(`/posts/${target.slug}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredPosts, selectedIndex, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="포스트 제목, 태그, 카테고리 검색..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button
            type="button"
            className="search-close-btn"
            onClick={onClose}
            aria-label="닫기"
          >
            닫기
          </button>
        </div>

        <div className="search-results">
          {loading && <div className="search-empty">검색 데이터를 불러오는 중...</div>}

          {!loading && query.trim() !== '' && filteredPosts.length === 0 && (
            <div className="search-empty">
              &quot;{query}&quot; 검색 결과가 없습니다.
            </div>
          )}

          {!loading && query.trim() === '' && (
            <div className="search-hint">
              <span>찾으시는 포스트의 제목, 태그 또는 카테고리를 입력하세요.</span>
            </div>
          )}

          {!loading && filteredPosts.length > 0 && (
            <ul className="search-result-list">
              {filteredPosts.map((post, idx) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className={`search-result-item ${idx === selectedIndex ? 'selected' : ''}`}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="search-result-header">
                      <span className="search-result-title">{post.title}</span>
                      <span className="search-result-category">{post.category}</span>
                    </div>
                    <p className="search-result-summary">{post.summary}</p>
                    {post.tags.length > 0 && (
                      <div className="search-result-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="search-result-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
