import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.css';
import '@/styles/markdown.css';
import Header from '@/components/Header';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
    url: siteConfig.domain,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.domain,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
  };

  return (
    <html lang="ko" data-theme="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <div className="ambient-glow" />
        <Header />
        <main className="main-container">{children}</main>

        {/* 🏛️ Astryx Style Clean Editorial Footer with License Attribution */}
        <footer className="astryx-footer">
          <div className="footer-grid">
            <div>
              <div className="logo-text" style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>
                ✨ {siteConfig.title}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                {siteConfig.description}
              </p>
            </div>

            <div className="footer-links-group">
              <div className="footer-title">Navigation</div>
              <Link href="/">Home</Link>
              <Link href="#posts">All Posts</Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>

            <div className="footer-links-group">
              <div className="footer-title">Obsidian Architecture</div>
              <span>Pure SSG Pipeline</span>
              <span>Asset Copy Engine</span>
              <span>Wikilink & Callouts</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {siteConfig.title}. Built with Next.js & Obsidian.</span>
            
            {siteConfig.credits.showTemplateCredit && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Template by{' '}
                <a
                  href={siteConfig.credits.originalRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline', color: 'var(--accent-indigo)', fontWeight: 600 }}
                >
                  {siteConfig.credits.originalAuthor}
                </a>{' '}
                ({siteConfig.credits.license})
              </span>
            )}
          </div>
        </footer>
      </body>
    </html>
  );
}
