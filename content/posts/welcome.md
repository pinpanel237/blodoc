---
title: "나만의 옵시디언 블로그에 오신 것을 환영합니다!"
date: "2026-07-26"
category: "General"
tags: ["Obsidian", "Next.js", "Blog", "Vercel"]
summary: "Obsidian 마크다운 노트를 GitHub에 올리면 자동으로 파싱하여 호스팅되는 커스텀 블로그 시스템입니다."
draft: false
---

# 🎉 나만의 커스텀 블로그 오픈!

안녕하세요! 이 블로그는 **Obsidian**에서 작성한 마크다운 파일과 이미지 첨부파일을 GitHub 저장소에 올리면, Next.js SSG 파이프라인을 통해 정적 웹사이트로 변환 및 호스팅되는 커스텀 블로그입니다.

---

## 🚀 주요 특징

1. **Obsidian 완벽 동기화**: `Obsidian Git` 플러그인을 통해 작성 글을 푸시하기만 하면 됩니다.
2. **Pure SSG 지원**: Vercel 배포 시 파일 시스템(`fs`) 접근 런타임 오류 없이 초고속으로 작동합니다.
3. **무료 이미지 호스팅**: GitHub 저장소에 포함된 첨부 이미지를 자동으로 복사 및 제공합니다.

> [!tip]
> 옵시디언의 다양한 콜아웃(`> [!note]`, `> [!warning]` 등)과 위키링크 `[[obsidian-syntax-test]]` 기능을 블로그 본문에서도 동일하게 이용할 수 있습니다.

---

## 💻 코드 하이라이팅 예시

```typescript
// src/lib/posts.ts
export async function getPostBySlug(slug: string) {
  console.log(`Fetching post: ${slug}`);
  return {
    slug,
    title: "Safe Markdown Parser"
  };
}
```

더 많은 옵시디언 특화 문법 테스트는 [[obsidian-syntax-test]] 글에서 확인해 보세요!
