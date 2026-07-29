import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { getSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // 개발(a) vs 운영(b) 환경을 자동 감지하는 사이트 주소
  const baseUrl = getSiteUrl();

  // 모든 마크다운 블로그 포스트 가져오기
  const posts = getAllPosts();

  // 모든 포스트 페이지 동적 URL 매핑
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const parsedDate = new Date(post.date);
    const isValidDate = !isNaN(parsedDate.getTime());
    return {
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: isValidDate ? parsedDate : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  // 메인 페이지 및 기본 경로
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  return [...routes, ...postUrls];
}
