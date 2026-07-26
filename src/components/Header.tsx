'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { siteConfig } from '@/site.config';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className={`site-header ${isHomePage ? 'header-on-home' : 'header-on-post'}`}>
      <div className="header-container">
        <Link href="/" className="logo-text">
          {siteConfig.title}
        </Link>

        <nav className="nav-links">
          <Link href="/" className="nav-item">
            포스트
          </Link>
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
  );
}
