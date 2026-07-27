# 📋 BLODOC 기능 현황

> 옵시디언(Obsidian) 마크다운 기반 Next.js 정적 블로그 — 구현 완료 / 구현 예정 기능 추적 문서

---

## ✅ 구현 완료된 기능

### 🏗️ 핵심 인프라 & SSG 파이프라인

- [x] **Pure SSG(정적 사이트 생성) 파이프라인 구축**  
  Vercel 서버리스 환경에서 런타임 `fs` 오류 방지를 위해 `export const dynamic = 'force-static'` 적용  
  → [`src/app/page.tsx#L6`](../src/app/page.tsx), [`src/app/posts/[slug]/page.tsx#L11`](../src/app/posts/%5Bslug%5D/page.tsx)

- [x] **`generateStaticParams()` 기반 동적 라우트 정적 빌드**  
  `content/posts/` 폴더 내 모든 마크다운 파일을 빌드 시점에 슬러그별 정적 HTML로 생성  
  → [`src/app/posts/[slug]/page.tsx#L14-L19`](../src/app/posts/%5Bslug%5D/page.tsx)

- [x] **빌드 전 에셋 자동 복사 스크립트**  
  `content/assets/` → `public/assets/`로 이미지 파일을 자동 복사 (`prebuild`, `dev` npm 스크립트에 연동)  
  → [`scripts/copy-assets.mjs`](../scripts/copy-assets.mjs)

- [x] **디렉토리 자동 초기화 가드**  
  `content/posts/`, `content/layout/` 폴더가 없을 경우 자동 생성하여 빌드 오류 방지  
  → [`src/lib/posts.ts#L32-L39`](../src/lib/posts.ts)

---

### 📖 Obsidian 특화 마크다운 파서

- [x] **`gray-matter` Frontmatter 파싱**  
  `title`, `date`, `category`, `tags`, `summary`, `draft`, `thumbnail` 메타데이터 추출  
  → [`src/lib/posts.ts#L90-L103`](../src/lib/posts.ts)

- [x] **임시저장(draft) 포스트 필터링**  
  `draft: true`인 포스트는 목록 및 빌드에서 자동 제외  
  → [`src/lib/posts.ts#L105-L107`](../src/lib/posts.ts)

- [x] **Obsidian Embed 이미지 변환 (`![[image.png]]`)**  
  옵시디언 첨부 이미지 문법 → `/assets/image.png` 절대 경로로 자동 변환  
  → [`src/lib/obsidian.ts#L10-L14`](../src/lib/obsidian.ts)

- [x] **상대 경로 이미지 변환 (`![](assets/photo.png)`)**  
  `assets/` 상대 경로 → `/assets/` 절대 경로로 자동 변환  
  → [`src/lib/obsidian.ts#L16-L19`](../src/lib/obsidian.ts)

- [x] **Wikilinks 변환 (`[[link-slug]]`, `[[link-slug|커스텀 레이블]]`)**  
  옵시디언 위키링크 → 블로그 내부 `/posts/slug` 경로의 `<a class="wikilink">` 태그로 변환  
  → [`src/lib/obsidian.ts#L21-L26`](../src/lib/obsidian.ts)

- [x] **Obsidian Callout 블록 파싱**  
  `> [!note]`, `> [!warning]`, `> [!tip]`, `> [!info]`, `> [!caution]`, `> [!quote]` → 커스텀 `<div class="callout callout-{type}">` 블록으로 변환  
  → [`src/lib/obsidian.ts#L28-L33`](../src/lib/obsidian.ts)

- [x] **GFM(GitHub Flavored Markdown) 지원**  
  `remark-gfm`을 통해 표(테이블), 체크리스트, 취소선 등 GFM 문법 지원  
  → [`src/app/posts/[slug]/page.tsx#L41-L44`](../src/app/posts/%5Bslug%5D/page.tsx)

- [x] **대소문자 무관 슬러그 매칭**  
  파일명과 URL 슬러그의 대소문자가 다를 경우에도 정상적으로 포스트 탐색  
  → [`src/lib/posts.ts#L129-L141`](../src/lib/posts.ts)

---

### 🎨 UI 컴포넌트 & 디자인 시스템

- [x] **Astryx Design System 연동**  
  `@astryxdesign/core`, `@astryxdesign/theme-neutral`, `@astryxdesign/cli` 패키지 기반 디자인 토큰 적용  
  → [`package.json#L13-L15`](../package.json), [`src/app/page.tsx#L15`](../src/app/page.tsx)

- [x] **다크/라이트 모드 테마 토글**  
  `localStorage` 기반 테마 상태 영속화, 시스템 프리퍼런스 자동 감지, Framer Motion 전환 애니메이션  
  → [`src/components/ThemeToggle.tsx`](../src/components/ThemeToggle.tsx)

- [x] **사이트 헤더 (투명 → 불투명 전환)**  
  홈/포스트 페이지에 따라 `header-on-home` / `header-on-post` CSS 클래스 전환, 내비게이션 + GitHub 링크 + 테마 토글 포함  
  → [`src/components/Header.tsx`](../src/components/Header.tsx)

- [x] **히어로 배너 섹션 (풀블리드 커버 이미지)**  
  홈페이지 상단 풀블리드 히어로 배너 (`/assets/hero-banner.png`)  
  → [`src/app/page.tsx#L17-L27`](../src/app/page.tsx)

- [x] **HeroTypewriter 타이핑 효과 애니메이션**  
  히어로 섹션의 타이틀을 글자 단위로 타이핑하는 효과 컴포넌트  
  → [`src/components/HeroTypewriter.tsx`](../src/components/HeroTypewriter.tsx)

- [x] **Bento Grid 피처드 포스트 레이아웃**  
  최신 포스트 1개(대형 카드) + 서브 포스트 2개(소형 카드 스택) Bento Grid 배치  
  → [`src/app/page.tsx#L44-L103`](../src/app/page.tsx)

- [x] **전체 포스트 카드 그리드 (`PostCard`)**  
  썸네일 이미지, 카테고리 배지, 제목, 요약, 날짜, 태그 필 포함 카드 컴포넌트  
  → [`src/components/PostCard.tsx`](../src/components/PostCard.tsx)

- [x] **포스트 상세 페이지 히어로 커버**  
  포스트 썸네일 또는 기본 배너를 활용한 풀블리드 커버 + 제목, 카테고리, 날짜, 태그 메타 영역  
  → [`src/app/posts/[slug]/page.tsx#L55-L77`](../src/app/posts/%5Bslug%5D/page.tsx)

- [x] **목차(TOC) 사이드바 — Intersection Observer 기반**  
  포스트 내 `h1`~`h3` 헤딩을 자동 추출, 스크롤 위치에 따라 활성 항목 하이라이트, 슬라이딩 인디케이터 + Framer Motion 애니메이션  
  → [`src/components/TOC.tsx`](../src/components/TOC.tsx)

- [x] **스크롤 읽기 진행률 바 (`ReadingProgressBar`)**  
  페이지 스크롤에 따라 상단에 읽기 진행률을 표시하는 바  
  → [`src/components/ReadingProgressBar.tsx`](../src/components/ReadingProgressBar.tsx)

- [x] **코드 블록 복사 버튼 (`CodeCopyButtons`)**  
  마크다운 렌더링 후 모든 `<pre><code>` 블록에 "복사" 버튼을 동적으로 주입  
  → [`src/components/CodeCopyButtons.tsx`](../src/components/CodeCopyButtons.tsx)

- [x] **인터랙티브 배경 (`InteractiveBackground`)**  
  마우스 커서를 따라 반응하는 배경 파티클/글로우 효과 컴포넌트  
  → [`src/components/InteractiveBackground.tsx`](../src/components/InteractiveBackground.tsx)

- [x] **슬림 인라인 푸터**  
  사이트 저작권, 내비게이션 링크, GitHub 동적 연동 (MIT 크레딧 선택적 표시 포함)  
  → [`src/app/layout.tsx#L54-L88`](../src/app/layout.tsx)

---

### ⚙️ 사이트 설정 & SEO

- [x] **사이트 전역 설정 파일 (`site.config.ts`)**  
  사이트 타이틀, 설명, 저자, 도메인, 소셜 링크, 크레딧 옵션을 단일 파일에서 관리  
  → [`src/site.config.ts`](../src/site.config.ts)

- [x] **OpenGraph 메타 태그 자동 적용**  
  `siteConfig` 기반으로 `og:title`, `og:description`, `og:type`, `og:url` 자동 삽입  
  → [`src/app/layout.tsx#L9-L18`](../src/app/layout.tsx)

- [x] **Schema.org JSON-LD 구조화 데이터**  
  `WebSite` + `Person` 타입 구조화 데이터를 레이아웃에 자동 삽입하여 검색엔진 SEO 강화  
  → [`src/app/layout.tsx#L28-L46`](../src/app/layout.tsx)

- [x] **`content/layout/home.md` 홈 콘텐츠 커스터마이징**  
  옵시디언에서 `home.md`를 작성하면 히어로 배지, 타이틀, 설명, GitHub 링크가 동적으로 반영  
  → [`src/lib/posts.ts#L44-L73`](../src/lib/posts.ts)

---

### 📦 의존성 패키지 (구현에 사용된 주요 라이브러리)

| 패키지 | 역할 |
|--------|------|
| `next@16.2.12` | 프레임워크 (App Router, SSG) |
| `gray-matter@4.0.3` | Frontmatter 파싱 |
| `remark` + `remark-gfm` + `remark-html` | 마크다운 → HTML 변환 |
| `remark-math` + `rehype-katex` | 수식(LaTeX) 렌더링 (설치 완료, 활성화 대기) |
| `framer-motion@12` | 애니메이션 |
| `reading-time@1.5.0` | 읽기 시간 계산 (설치 완료, 활성화 대기) |
| `@astryxdesign/core` | 디자인 시스템 |
| `lucide-react` | 아이콘 |

---

## 🔲 구현 예정 기능

### 🔍 검색 & 필터링

- [ ] **카테고리 필터 동작 구현**  
  현재 홈 화면 카테고리 버튼 UI는 존재하나 실제 필터링 로직 미구현 (하드코딩된 버튼)  
  → [`src/app/page.tsx#L121-L127`](../src/app/page.tsx)

- [ ] **태그 기반 포스트 필터링**  
  태그 클릭 시 해당 태그가 포함된 포스트만 필터링하는 기능

- [ ] **클라이언트사이드 전문 검색(Full-text Search)**  
  `Fuse.js` 또는 `pagefind` 기반 키워드 검색 기능 (정적 빌드 호환)

---

### 📑 포스트 상세 기능

- [ ] **실제 읽기 시간 계산 표시**  
  `reading-time` 패키지가 설치되어 있으나 현재 "3분 읽기" 하드코딩 상태  
  → [`src/components/PostCard.tsx#L17`](../src/components/PostCard.tsx), [`src/app/posts/[slug]/page.tsx#L64`](../src/app/posts/%5Bslug%5D/page.tsx)

- [ ] **LaTeX 수식 렌더링 활성화**  
  `remark-math` + `rehype-katex` 패키지가 설치되어 있으나 파싱 파이프라인에 미연동  
  → [`src/app/posts/[slug]/page.tsx#L41-L44`](../src/app/posts/%5Bslug%5D/page.tsx)

- [ ] **코드 블록 구문 하이라이팅**  
  `rehype-pretty-code` / `shiki` 기반 코드 하이라이팅 (현재 기본 스타일만 적용)

- [ ] **이전/다음 포스트 내비게이션**  
  포스트 하단에 인접한 포스트로 이동하는 Prev/Next 버튼

- [ ] **Callout 멀티라인 본문 파싱 개선**  
  현재 Callout 파서는 헤더 라인만 처리하며, 이어지는 `> ` 인용 라인을 callout-content로 감싸는 로직 미구현  
  → [`src/lib/obsidian.ts#L28-L33`](../src/lib/obsidian.ts)

---

### 🗺️ 라우팅 & 페이지

- [ ] **카테고리별 목록 페이지 (`/category/[name]`)**  
  카테고리별로 포스트를 모아 보여주는 전용 페이지

- [ ] **태그별 목록 페이지 (`/tags/[tag]`)**  
  태그를 클릭하면 해당 태그의 포스트 목록으로 이동

- [ ] **아카이브 페이지 (`/archive`)**  
  날짜(연/월) 단위로 포스트를 타임라인 형식으로 정렬하여 표시

- [ ] **About 페이지 (`/about`)**  
  `content/layout/about.md`를 활용한 자기소개 / 프로젝트 소개 정적 페이지

- [ ] **404 커스텀 오류 페이지**  
  존재하지 않는 슬러그 접근 시 보여줄 커스텀 디자인 404 페이지

---

### 🖼️ 이미지 & 에셋

- [ ] **Next.js `<Image>` 컴포넌트로 마이그레이션**  
  현재 `<img>` 태그 사용 → `next/image`로 교체하여 자동 최적화(WebP 변환, lazy loading) 적용

- [ ] **OG(Open Graph) 이미지 자동 생성**  
  포스트별 동적 OG 이미지 생성 (`next/og` 활용)

- [ ] **서브디렉토리 에셋 복사 지원**  
  현재 `copy-assets.mjs`는 최상위 파일만 복사 (재귀적 서브폴더 복사 미지원)  
  → [`scripts/copy-assets.mjs#L20-L29`](../scripts/copy-assets.mjs)

---

### 🌐 SEO & 메타데이터

- [ ] **포스트별 개별 메타 태그 (`generateMetadata`)**  
  포스트 상세 페이지에서 `title`, `description`, OG 메타태그를 포스트 데이터로 동적 생성

- [x] **사이트맵 자동 생성 (`sitemap.xml`)**  
  `app/sitemap.ts`를 통해 전체 포스트 목록 기반 XML 사이트맵 자동 생성

- [ ] **RSS 피드 생성 (`rss.xml`)**  
  RSS 2.0 형식의 피드를 정적 빌드 시 자동 생성

---

### 💅 UX & 접근성

- [ ] **모바일 반응형 목차(TOC) — 플로팅 버튼으로 전환**  
  모바일 화면에서 사이드바 TOC 대신 플로팅 버튼 → 드로어 방식으로 표시

- [ ] **포스트 북마크 / 좋아요 (로컬 스토리지)**  
  `localStorage` 기반으로 포스트를 북마크하거나 좋아요 표시

- [ ] **다국어(i18n) 지원**  
  `next-intl` 기반 다국어 블로그 지원

- [ ] **접근성(a11y) 개선**  
  aria-label, focus-visible 스타일, 키보드 내비게이션 전체 검토 및 보완

---

### 📊 통계 & 접속 분석 (Analytics & Metrics)

- [ ] **수집 기능 On/Off 토글 스위치 설정 (`site.config.ts` / 환경 변수)**  
  방문자 수 수집, 좋아요 및 댓글 기록 파이프라인 전체를 사용자가 원할 때 언제든지 쉽게 키거나 끌 수 있는(On/Off) 전역 설정 옵션 지원
- [ ] **독립 댓글/통계 마크다운 문서 분리 & Obsidian 위키링크(`[[slug]]`) 자동 연결 구조**  
  Git 충돌을 100% 예방하고 원본 글을 보호하기 위해 게시글 원본(`content/posts/`)을 직접 변경하지 않고, 독립된 `content/comments/[slug].md` 및 `content/analytics/stats.md` 마크다운 파일로 기록을 분리 관리하며 `target_post: "[[slug]]"` 위키링크를 자동 연동하는 아키텍처
- [ ] **마크다운 문서 기반 접속자 통계 및 댓글 자동 기록 파이프라인**  
  웹사이트 방문자 수, 일별/월별 접속 통계, 포스트별 조회수(PV), 좋아요 및 댓글 목록을 독립 마크다운 문서에 일괄 기록하는 파이프라인
- [ ] **하루 1회 배치 커밋 파이프라인 (GitHub Actions Cron)**  
  낮 동안 발생한 방문자/좋아요/댓글 이력을 서버리스 KV(Upstash/Vercel KV 등)에 실시간 임시 수집한 후, 매일 밤 12시 GitHub Action이 실행되어 단 1회의 깔끔한 일일 통합 커밋(`chore(analytics): YYYY-MM-DD 일일 통계 및 댓글 마크다운 동기화`)으로 GitHub에 푸시하는 기능 (Git 히스토리 오염 방지)
- [ ] **옵시디언 마크다운 동기화 & 통계 요약 뱃지 표시**  
  마크다운에 기록된 통계, 좋아요 수, 댓글 수를 바탕으로 포스트 상단 및 메인 페이지에 총 방문자 수, 인기 게시글 순위 및 통계 요약 뱃지 표시






---

## 📁 관련 파일 구조 참조

```
blodoc/
├── content/
│   ├── posts/          # ✍️ 옵시디언 마크다운 포스트 (사용자 작성 영역)
│   ├── comments/       # 💬 게시글별 자동 수집 댓글 마크다운 노트 ([[slug]] 위키링크 연동)
│   ├── analytics/      # 📊 방문자 수 / 좋아요 통합 일일 요약 마크다운 노트
│   ├── assets/         # 🖼️ 옵시디언 첨부 이미지 (빌드 시 public/assets/로 복사)
│   └── layout/
│       └── home.md     # 🏠 홈 히어로 콘텐츠 커스터마이징
├── scripts/
│   └── copy-assets.mjs # 📋 에셋 자동 복사 스크립트
├── src/
│   ├── app/
│   │   ├── layout.tsx  # 전역 레이아웃 (헤더, 푸터, SEO)
│   │   ├── page.tsx    # 홈 페이지 (Bento Grid, 포스트 목록)
│   │   └── posts/[slug]/page.tsx  # 포스트 상세 페이지 (SSG)
│   ├── components/
│   │   ├── Header.tsx              # 내비게이션 헤더
│   │   ├── ThemeToggle.tsx         # 다크/라이트 모드 전환
│   │   ├── HeroTypewriter.tsx      # 타이핑 효과 히어로
│   │   ├── InteractiveBackground.tsx # 인터랙티브 배경
│   │   ├── PostCard.tsx            # 포스트 카드
│   │   ├── TOC.tsx                 # 목차 사이드바
│   │   ├── ReadingProgressBar.tsx  # 읽기 진행률 바
│   │   └── CodeCopyButtons.tsx     # 코드 복사 버튼
│   ├── lib/
│   │   ├── posts.ts    # Frontmatter 파싱, SSG 데이터 추출
│   │   └── obsidian.ts # Obsidian 전용 문법 파서
│   └── site.config.ts  # 사이트 전역 설정
└── docs/
    └── FEATURES.md     # 📋 현재 파일
```

---

*최종 업데이트: 2026-07-27*
