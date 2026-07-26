import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.css';
import '@/styles/markdown.css';
import Header from '@/components/Header';
import { siteConfig } from '@/site.config';
import { getHomePost } from '@/lib/posts';

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
  const homeData = getHomePost();
  const githubUrl = homeData.github || siteConfig.social.github;

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
        <main>{children}</main>

        {/* 🏛️ 슬림 가로 인라인 푸터 (GitHub 링크만 동적 커스텀 가능) */}
        <footer className="astryx-footer slim-footer">
          <div className="slim-footer-inner">
            <div className="slim-footer-left">
              <span className="logo-text" style={{ fontSize: '1.1rem' }}>
                {siteConfig.title}
              </span>
              <span className="footer-copyright">
                © {new Date().getFullYear()} {siteConfig.title}. All rights reserved.
              </span>
              {siteConfig.credits.showTemplateCredit && (
                <span className="footer-credit">
                  Template by{' '}
                  <a
                    href={siteConfig.credits.originalRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'underline', color: 'var(--accent-indigo)', fontWeight: 600 }}
                  >
                    {siteConfig.credits.originalAuthor}
                  </a>
                </span>
              )}
            </div>

            <div className="slim-footer-links">
              <Link href="/">홈</Link>
              <Link href="/#posts">최신 포스트</Link>
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
