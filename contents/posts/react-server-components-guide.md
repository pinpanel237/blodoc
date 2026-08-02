---
title: "React Server Components와 정적 블로그 아키텍처"
date: "2026-07-27"
category: "Development"
tags: ["React", "Nextjs", "RSC", "Architecture"]
summary: "Next.js App Router의 React Server Components와 SSG 정적 렌더링 파이프라인의 성능적 이점을 조명합니다."
draft: false
---

# ⚡ React Server Components와 정적 블로그 아키텍처

Next.js App Router 환경에서는 **서버 컴포넌트(Server Components)**와 **클라이언트 컴포넌트(Client Components)**의 적절한 역할 분담이 핵심입니다.

---

## 🎨 1. 서버 컴포넌트의 이점

1. **Zero Bundle Size**: 클라이언트 자바스크립트 번들에 포함되지 않아 초동 로딩 속도가 획기적으로 향상됩니다.
2. **보안 및 안전한 데이터 접근**: 빌드 타임에 파일 시스템(`fs`)에 직접 접근하여 옵시디언 마크다운 문서를 안심하고 파싱할 수 있습니다.
3. **Pure SSG 파이프라인과의 조화**: `export const dynamic = 'force-static'` 설정으로 Vercel 정적 호스팅 시 최상의 호환성을 보장합니다.

---

## 💡 2. 클라이언트 컴포넌트와의 상호작용

필터링이나 검색, 페이징과 같이 사용자의 인터랙션이 요구되는 영역은 `'use client'` 지시어를 통해 경량 클라이언트 컴포넌트로 분리하여 조합합니다.
