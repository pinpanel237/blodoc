import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.css';
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
  const headerGithubUrl = homeData.github || siteConfig.social.github;
  const footerGithubUrl = siteConfig.social.github;
  const blogName = homeData.blogName || siteConfig.title;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: blogName,
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
        <Header blogName={blogName} githubUrl={headerGithubUrl} />
        <main>{children}</main>

        {/* 🏛️ 슬림 가로 인라인 푸터 (GitHub 링크만 동적 커스텀 가능) */}
        <footer className="astryx-footer slim-footer">
          <div className="slim-footer-inner">
            <div className="slim-footer-left">
              <span className="logo-text" style={{ fontSize: '1.1rem' }}>
                {blogName}
              </span>
              <span className="footer-copyright">
                © {new Date().getFullYear()} {blogName}. All rights reserved.
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
              <Link href="/credits">저작권 안내</Link>
              {footerGithubUrl && (
                <a href={footerGithubUrl} target="_blank" rel="noopener noreferrer">
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
