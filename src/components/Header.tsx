'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import SearchModal from './SearchModal';
import { siteConfig } from '@/site.config';

interface HeaderProps {
  blogName?: string;
}

export default function Header({ blogName }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className={`site-header ${isHomePage ? 'header-on-home' : 'header-on-post'}`}>
        <div className="header-container">
          <Link href="/" className="logo-text">
            {blogName || siteConfig.title}
          </Link>

          <nav className="nav-links">
            <button
              type="button"
              className="search-trigger-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="게시글 검색"
            >
              <svg
                width="15"
                height="15"
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
              <span className="search-btn-label">검색</span>
            </button>

            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-item"
              >
                GitHub
              </a>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}


