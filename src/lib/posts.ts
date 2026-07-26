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

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    // 404 방지용 기본 샘플 마크다운 생성
    const defaultWelcome = `---
title: "나만의 옵시디언 블로그에 오신 것을 환영합니다!"
date: "${new Date().toISOString().split('T')[0]}"
category: "General"
tags: ["Obsidian", "Next.js", "Blog"]
summary: "Obsidian 마크다운 노트를 GitHub에 올리면 자동으로 파싱하여 호스팅되는 커스텀 블로그입니다."
draft: false
---

# 🎉 나만의 커스텀 블로그 오픈!

안녕하세요! 이 블로그는 **Obsidian**에서 작성한 마크다운 파일과 이미지 첨부파일을 GitHub 저장소에 올리면 정적 웹사이트로 변환되는 블로그입니다.

> [!tip]
> \`content/posts/\` 폴더에 새로운 \`.md\` 노트를 생성하면 개발 환경에서 바로 테스트하실 수 있습니다.
`;

    fs.writeFileSync(path.join(postsDirectory, 'welcome.md'), defaultWelcome, 'utf8');
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

      // Safe Fallback 처리 (메타데이터 누락 시 기본값 대체)
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
 * 단일 포스트 원본 데이터 가져오기
 */
export function getPostBySlug(slug: string): PostDetail | null {
  ensurePostsExist();

  try {
    const decodedSlug = decodeURIComponent(slug);
    let fullPath = path.join(postsDirectory, `${decodedSlug}.md`);

    // 정확한 파일명이 없으면 대소문자 무시 검색
    if (!fs.existsSync(fullPath)) {
      const files = fs.readdirSync(postsDirectory);
      const matched = files.find((f) => f.toLowerCase() === `${decodedSlug.toLowerCase()}.md`);
      if (matched) {
        fullPath = path.join(postsDirectory, matched);
      } else {
        return null;
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: decodedSlug,
      title: data.title || decodedSlug.replace(/-/g, ' '),
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
