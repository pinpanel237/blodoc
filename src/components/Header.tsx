import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { siteConfig } from '@/site.config';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo-text">
          ✨ {siteConfig.title}
        </Link>

        <nav className="nav-links">
          <Link href="/" className="nav-item">
            Posts
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
