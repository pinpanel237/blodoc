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

export interface HomePostData {
  title: string;
  badge: string;
  description: string;
  github?: string;
  content?: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');
const layoutDirectory = path.join(process.cwd(), 'content', 'layout');

function ensureDirectoriesExist() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
  if (!fs.existsSync(layoutDirectory)) {
    fs.mkdirSync(layoutDirectory, { recursive: true });
  }
}

/**
 * 기본 레이아웃 메인 설정 문서(content/layout/home.md) 데이터 추출
 */
export function getHomePost(): HomePostData {
  ensureDirectoriesExist();
  const homePath = path.join(layoutDirectory, 'home.md');

  const defaultHome: HomePostData = {
    badge: '개인 기술 블로그 & 기록 공간',
    title: '생각과 기록을 정리하는 개인 블로그입니다',
    description: '옵시디언에서 작성한 마크다운 노트를 기반으로 생성된 정적 블로그 공간입니다.',
  };

  if (!fs.existsSync(homePath)) {
    return defaultHome;
  }

  try {
    const fileContents = fs.readFileSync(homePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      badge: data.badge || defaultHome.badge,
      title: data.title || defaultHome.title,
      description: data.summary || data.description || content.trim() || defaultHome.description,
      github: data.github || undefined,
      content: content.trim(),
    };
  } catch (error) {
    console.error('Error reading content/layout/home.md:', error);
    return defaultHome;
  }
}

/**
 * 모든 일반 블로그 포스트 목록 반환 (content/posts/ 내 마크다운 파일)
 */
export function getAllPosts(): PostMetaData[] {
  ensureDirectoriesExist();

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
 * 단일 포스트 원본 데이터 가져오기 (content/posts/ 내 파일 대상)
 */
export function getPostBySlug(slug: string): PostDetail | null {
  ensureDirectoriesExist();

  if (!slug) return null;

  try {
    const decodedSlug = decodeURIComponent(slug).trim();
    let targetFileName = `${decodedSlug}.md`;
    let fullPath = path.join(postsDirectory, targetFileName);

    if (!fs.existsSync(fullPath)) {
      const files = fs.readdirSync(postsDirectory);
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
