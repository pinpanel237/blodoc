import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMetaData {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  draft: boolean;
  readingTime?: string;
  thumbnail?: string;
}

export interface PostDetail extends PostMetaData {
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

/**
 * 모든 마크다운 포스트 목록 반환 (Draft 제외, 날짜 내림차순 정렬)
 */
export function getAllPosts(): PostMetaData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: PostMetaData[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;

    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);

    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Safe Fallback 처리 (메타데이터 누락 시 기본값 대체)
      const post: PostMetaData = {
        slug,
        title: data.title || slug.replace(/-/g, ' '),
        date: data.date ? String(data.date) : '2026-01-01',
        category: data.category || 'General',
        tags: Array.isArray(data.tags) ? data.tags : [],
        summary: data.summary || content.slice(0, 120).replace(/[#*`>]/g, '') + '...',
        draft: Boolean(data.draft),
        thumbnail: data.thumbnail || undefined,
      };

      if (!post.draft) {
        allPostsData.push(post);
      }
    } catch (error) {
      console.error(`Error parsing markdown file ${fileName}:`, error);
    }
  }

  // 날짜 기준 내림차순 정렬
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * 단일 포스트 원본 데이터 가져오기
 */
export function getPostBySlug(slug: string): PostDetail | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug.replace(/-/g, ' '),
      date: data.date ? String(data.date) : '2026-01-01',
      category: data.category || 'General',
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: data.summary || content.slice(0, 120) + '...',
      draft: Boolean(data.draft),
      thumbnail: data.thumbnail || undefined,
      content,
    };
  } catch (error) {
    console.error(`Error reading post slug ${slug}:`, error);
    return null;
  }
}
