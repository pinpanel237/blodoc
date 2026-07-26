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
 * 디렉토리 및 개발용 샘플 마크다운 자동 초기화 (404 방지)
 */
function ensurePostsExist() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

/**
 * 모든 마크다운 포스트 목록 반환 (Draft 제외, 날짜 내림차순 정렬)
 */
export function getAllPosts(): PostMetaData[] {
  ensurePostsExist();

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: PostMetaData[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;

    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);

    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const post: PostMetaData = {
        slug,
        title: data.title || slug.replace(/-/g, ' '),
        date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
        category: data.category || 'General',
        tags: Array.isArray(data.tags) ? data.tags : [],
        summary: data.summary || content.slice(0, 120).replace(/[#*`>]/g, '').trim() + '...',
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

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * 단일 포스트 원본 데이터 가져오기 (Safe Matching)
 */
export function getPostBySlug(slug: string): PostDetail | null {
  ensurePostsExist();

  if (!slug) return null;

  try {
    const decodedSlug = decodeURIComponent(slug).trim();
    let targetFileName = `${decodedSlug}.md`;
    let fullPath = path.join(postsDirectory, targetFileName);

    // 1. 정확한 파일 존재 여부 확인
    if (!fs.existsSync(fullPath)) {
      const files = fs.readdirSync(postsDirectory);
      // 2. 대소문자 구별 없이 매칭되는 파일 검색
      const matched = files.find(
        (f) => f.endsWith('.md') && f.replace(/\.md$/, '').toLowerCase() === decodedSlug.toLowerCase()
      );

      if (matched) {
        fullPath = path.join(postsDirectory, matched);
      } else {
        console.warn(`Post not found for slug: ${slug} (decoded: ${decodedSlug})`);
        return null;
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const actualSlug = path.basename(fullPath, '.md');

    return {
      slug: actualSlug,
      title: data.title || actualSlug.replace(/-/g, ' '),
      date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
      category: data.category || 'General',
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: data.summary || content.slice(0, 120).trim() + '...',
      draft: Boolean(data.draft),
      thumbnail: data.thumbnail || undefined,
      content,
    };
  } catch (error) {
    console.error(`Error reading post slug ${slug}:`, error);
    return null;
  }
}
