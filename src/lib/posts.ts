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

export interface LayoutPageData {
  title: string;
  summary?: string;
  content: string;
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
 * content/layout/ 하위 마크다운 파일(예: credits.md) 데이터 추출
 */
export function getLayoutPage(filename: string): LayoutPageData | null {
  ensureDirectoriesExist();
  const filePath = path.join(layoutDirectory, filename.endsWith('.md') ? filename : `${filename}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      title: data.title || path.basename(filename, '.md'),
      summary: data.summary || data.description || undefined,
      content: content.trim(),
    };
  } catch (error) {
    console.error(`Error reading layout file ${filename}:`, error);
    return null;
  }
}

/**
 * 재귀적으로 content/posts/ 하위의 모든 마크다운 파일 목록 수집
 */
function getMarkdownFilesRecursively(dir: string, baseDir: string = dir): { fullPath: string; relativeSlug: string }[] {
  let results: { fullPath: string; relativeSlug: string }[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getMarkdownFilesRecursively(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // postsDirectory 대비 상대 경로 계산 (예: "dev/intro.md" -> "dev/intro" 또는 "intro")
      const relPath = path.relative(baseDir, fullPath);
      let slug = relPath.replace(/\.md$/, '').replace(/\\/g, '/');

      // index.md 인 경우 부모 폴더명을 slug로 사용 (page bundle 패턴)
      if (path.basename(fullPath) === 'index.md' && path.dirname(relPath) !== '.') {
        slug = path.dirname(relPath).replace(/\\/g, '/');
      }

      results.push({ fullPath, relativeSlug: slug });
    }
  }

  return results;
}

/**
 * 모든 일반 블로그 포스트 목록 반환 (content/posts/ 내 마크다운 파일, 하위 폴더 재귀 탐색)
 */
export function getAllPosts(): PostMetaData[] {
  ensureDirectoriesExist();

  const files = getMarkdownFilesRecursively(postsDirectory);
  const allPostsData: PostMetaData[] = [];

  for (const { fullPath, relativeSlug } of files) {
    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // slug 내 / 가 포함되어 있으면 URL 호환용 슬러그 변환 (예: "dev/intro" -> "dev-intro" 또는 단순 이름)
      const cleanSlug = relativeSlug.replace(/\//g, '-').toLowerCase();

      const post: PostMetaData = {
        slug: cleanSlug,
        title: data.title || path.basename(fullPath, '.md').replace(/-/g, ' '),
        date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
        category: data.category || (relativeSlug.includes('/') ? relativeSlug.split('/')[0] : 'General'),
        tags: Array.isArray(data.tags) ? data.tags : [],
        summary: data.summary || content.slice(0, 120).replace(/[#*`>]/g, '').trim() + '...',
        draft: Boolean(data.draft),
        thumbnail: data.thumbnail || undefined,
      };

      if (!post.draft) {
        allPostsData.push(post);
      }
    } catch (error) {
      console.error(`Error parsing markdown file ${fullPath}:`, error);
    }
  }

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * 단일 포스트 원본 데이터 가져오기
 */
export function getPostBySlug(slug: string): PostDetail | null {
  ensureDirectoriesExist();

  if (!slug) return null;

  try {
    const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();
    const files = getMarkdownFilesRecursively(postsDirectory);

    const targetFile = files.find(({ relativeSlug }) => {
      const cleanSlug = relativeSlug.replace(/\//g, '-').toLowerCase();
      const fileNameOnly = path.basename(relativeSlug).toLowerCase();
      return cleanSlug === decodedSlug || fileNameOnly === decodedSlug;
    });

    if (!targetFile) {
      console.warn(`Post not found for slug: ${slug}`);
      return null;
    }

    const fileContents = fs.readFileSync(targetFile.fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const cleanSlug = targetFile.relativeSlug.replace(/\//g, '-').toLowerCase();

    return {
      slug: cleanSlug,
      title: data.title || path.basename(targetFile.fullPath, '.md').replace(/-/g, ' '),
      date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
      category: data.category || (targetFile.relativeSlug.includes('/') ? targetFile.relativeSlug.split('/')[0] : 'General'),
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
