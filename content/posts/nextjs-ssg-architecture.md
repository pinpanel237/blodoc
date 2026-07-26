---
title: "Next.js 14 Pure SSG 파이프라인 구축 및 Vercel 배포기"
date: "2026-07-25"
category: "Development"
tags: ["Nextjs", "SSG", "Vercel", "Performance"]
summary: "Vercel 서버리스 런타임에서 파일 시스템 fs 접근 에러 없이 초고속으로 작동하는 정적 사이트 파이프라인 설계서입니다."
draft: false
---

# ⚡ Next.js Pure SSG Architecture

Vercel 환경에서 로컬 마크다운 파일 파싱 시 발생하는 `fs` 파일 시스템 런타임 오류를 완벽하게 회피하는 정적 빌드 구조입니다.

---

## 🛠️ 핵심 해결책

1. **`export const dynamic = 'force-static'`**: 모든 페이지가 서버리스 동적 파싱을 시도하지 않도록 고정합니다.
2. **`generateStaticParams()`**: 빌드 타임에 모든 마크다운 파일 목록을 미리 읽어 static path HTML로 출력을 완료합니다.
3. **Asset Copy Engine**: `content/assets`의 첨부 파일들을 `public/assets`로 빌드 전 스크립트로 사전 복사합니다.

```typescript
// src/app/posts/[slug]/page.tsx
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

> [!important]
> 이 구조를 적용하면 Vercel 서버리스 요금 폭탄이나 런타임 500 오류가 100% 방지됩니다.
