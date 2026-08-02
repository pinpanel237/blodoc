# 📝 Obsidian 마크다운 기반 커스텀 블로그 아키텍처 & 개발 분석서

이 문서는 **Obsidian(옵시디언)** 노트를 **GitHub 저장소**에 올리고, **Next.js + Vercel** 파이프라인을 통해 정적 웹사이트(HTML)로 자동 변환 및 호스팅하는 시스템의 분석 및 설계 문서입니다.

---

## 📍 1. 프로젝트 목표 & 전체 아키텍처

### 🎯 핵심 목표
1. **옵시디언 편의성 유지**: 옵시디언에서 작성한 `.md` 노트 및 이미지를 수정 없이 GitHub 저장소에 Push하는 것만으로 블로그 업데이트.
2. **Vercel 완전 배포 안정성**: 런타임 파일 접근 에러가 발생하지 않는 Pure SSG(Static Site Generation) 방식 연동.
3. **무료 이미지 호스팅**: 별도 이미지 서버 없이 GitHub 저장소 내 이미지 폴더를 웹 자원으로 자동 파싱 및 제공.
4. **Obsidian 고유 문법 지원**: Wikilink(`[[문서]]`), Callout(`> [!note]`), Frontmatter YAML, 수식, 코드 하이라이트 완벽 지원.

### 🔄 전체 데이터 흐름 (Workflow)

```mermaid
flowchart TD
    subgraph 1. Obsidian App / Real Content Repo
        A[마크다운 노트 작성] -->|이미지 첨부| B[assets/photo.png]
        A & B -->|Git Push| Repo[운영용 Git 콘텐츠 저장소]
    end

    subgraph 2. Local Dev Environment
        LocalContent[content/ (로컬 테스트 마크다운)] --> Dev[Next.js Dev Server]
    end

    subgraph 3. Vercel Build Step
        Repo -->|CONTENT_GIT_REPO 변수 참조| E[Next.js Build Trigger]
        E --> F1[Script: fetch-content.mjs 원격 Clone]
        F1 --> F2[Script: content/assets -> public/assets 자동 복사]
        F2 --> G[Remark/Rehype Parser: Wikilink, Callout, Image 경로 변환]
        G --> H[Pure SSG: generateStaticParams HTML 사전 생성]
    end

    subgraph 4. Web Hosting
        H --> I[Vercel CDN Edge 배포 & 글로벌 호스팅]
    end
```

---

## 🛡️ 2. Vercel + Next.js 배포 트러블슈팅 사전 대책

Next.js 앱을 Vercel에 배포할 때 자주 발생하는 빌드 실패 및 런타임 오류 방지책입니다.

| 문제 유형 | 원인 | **기술적 해결 대책** |
| :--- | :--- | :--- |
| **Serverless `fs` 접근 에러** | Vercel 런타임 환경에서 로컬 파일 시스템 읽기 시도 | **Pure SSG 모드 적용**.<br>`export const dynamic = 'force-static'` 및 `generateStaticParams()`를 적용해 모든 마크다운을 빌드 타임에 HTML로 완전 렌더링. |
| **Frontmatter / 파싱 문법 오류** | 마크다운 내 비표준 문법이나 메타데이터 누락 | **Safe Parser (오류 래퍼 함수)** 적용.<br>Frontmatter 파싱 실패 시 기본값(생성일, 제목 등)을 제공하고 빌드 중단을 방지. |
| **상대 경로 이미지 깨짐** | 옵시디언의 `![[photo.png]]` 링크가 웹 경로와 불일치 | **Custom Remark Image Plugin** 적용.<br>옵시디언 이미지 표기를 웹 접근 가능 경로(`/assets/photo.png`)로 자동 변환. |
| **동적 경로 404 발생** | 새로운 글 작성 시 Static Fallback 미비 | `export const dynamicParams = false` 설정 및 정적 파라미터 사전 생성 처리. |

---

## 🖼️ 3. GitHub 기반 이미지 저장 및 처리 구조

별도의 Cloud storage (S3, Cloudinary 등) 없이 **GitHub 저장소 하나로 이미지까지 자동 처리**하며, 게시글별 독립 서브폴더 관리도 지원합니다.

1. **Obsidian 설정 & 이미지 관리 패턴**:
   * **단일 에셋 폴더 방식**: `content/assets/my-image.png`
   * **게시글별 서브폴더 방식 (권장)**: `content/assets/my-post-name/my-image.png`
   * **게시글 번들(Page Bundle) 방식**: `content/posts/my-post-name/my-image.png`
2. **Next.js 파이프라인 (재귀 탐색 및 자동 변환)**:
   * 빌드 시작 시 `scripts/copy-assets.mjs`가 `content/` 내 모든 하위 폴더의 이미지를 재귀적(Recursive)으로 탐색하여 `public/assets/` 이하 동일 구조로 자동 복사합니다.
   * 커스텀 마크다운 파서(`src/lib/obsidian.ts`)가 `![[my-post-name/photo.png]]`, `![](assets/my-post-name/photo.png)`, `![](./photo.png)` 구문을 HTML `<img src="/assets/my-post-name/photo.png" />` 주소로 자동 호스팅 정규화합니다.

---

## 🛠️ 4. 기술 스택 및 파서 구성

* **Core Framework**: Next.js 14+ (App Router, TypeScript)
* **Styling**: Vanilla CSS (CSS Modules) - Modern Dark/Light Theme & Glassmorphism
* **Markdown Pipeline**:
  * `gray-matter`: YAML 메타데이터 안전 추출
  * `remark-gfm`: GitHub Flavored Markdown (테이블, 체크박스 등)
  * `remark-math` & `rehype-katex`: LaTeX 수식 지원
  * **Custom Obsidian Plugin**: `[[Wikilink]]` $\rightarrow$ `/posts/slug` 변환, Callout(`> [!note]`) $\rightarrow$ Callout Component 변환
  * `rehype-pretty-code` / `shiki`: 고성능 구문 강조 (Code Highlighting)
  * `rehype-slug`, `rehype-autolink-headings`: 목차(TOC) 앵커 자동 생성

---

## 📂 5. 디렉토리 구조 제안

```text
blodoc/
├── docs/                     <-- [현재 폴더] 분석 및 문서화 자료
│   ├── blog-architecture-analysis.md
│   └── feature-roadmap.md
├── content/                  <-- Obsidian 연동 마크다운 및 이미지 저장소
│   ├── assets/               <-- Obsidian 첨부 이미지
│   ├── posts/                <-- 마크다운 포스트 파일들 (원형 유지를 위한 사용자 전용)
│   ├── comments/             <-- 수집 댓글 마크다운 노트 (target: "[[slug]]" 위키링크 연동)
│   └── analytics/            <-- 일일 방문자/좋아요 통합 요약 마크다운 노트
├── scripts/
│   ├── fetch-content.mjs     <-- 빌드 타임 원격 Git 콘텐츠 동기화 스크립트 (환경변수 참조)
│   └── copy-assets.mjs       <-- 빌드 타임 이미지 자동 복사 스크립트
├── public/
│   └── assets/               <-- 복사 완료된 호스팅용 이미지
├── src/
│   ├── app/
│   │   ├── layout.tsx        <-- 글로벌 레이아웃 (헤더, 푸터, 다크모드)
│   │   ├── page.tsx          <-- 메인 블로그 포스트 리스트
│   │   └── posts/[slug]/page.tsx <-- 포스트 상세 보기 (SSG)
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── TOC.tsx           <-- Floating Table of Contents
│   │   ├── Callout.tsx       <-- Obsidian Callout UI
│   │   └── ThemeToggle.tsx   <-- 다크/라이트 모드 스위치
│   ├── lib/
│   │   ├── posts.ts          <-- 마크다운 수집 & Safe Parsing SSG 함수
│   │   └── obsidian.ts       <-- 옵시디언 전용 커스텀 파서
│   └── styles/
│       ├── globals.css       <-- 디자인 토큰 및 다크모드 변수
│       └── markdown.css      <-- 본문 읽기 최적화 가독성 스타일
├── package.json
└── tsconfig.json
```

---

## 🔗 7. 원격 Git 저장소 분리 및 환경변수 연동 가이드

블로그 웹앱 저장소와 별개로 옵시디언 마크다운 전용 Git 저장소를 사용하는 구조입니다. Private 저장소인 경우 환경변수를 통한 인증 정보 전달이 필수적입니다.

### 1) 환경 변수 기본 설정 (`CONTENT_GIT_REPO`)
* **로컬 환경**: `.env.local`을 비워 두거나 작성하지 않으면 기존 `/content` 폴더의 로컬 테스트 마크다운을 사용합니다.
* **Public 저장소**: `CONTENT_GIT_REPO=https://github.com/username/obsidian-content.git`

---

### 2) Private Git 저장소 인증 및 환경변수 지정 방법

#### ① GitHub Personal Access Token (PAT)을 URL에 직접 포함
가장 간편하게 빌드 환경(Vercel, CI/CD)에 적용할 수 있는 방식입니다.
```env
# Vercel / CI 환경변수 설정
CONTENT_GIT_REPO=https://<GITHUB_PAT_TOKEN>@github.com/username/obsidian-content.git
```
> **참고**: GitHub 계정 **Settings > Developer Settings > Personal Access Tokens**에서 `repo` 읽기 권한을 가진 토큰을 생성하여 사용합니다.

#### ② 토큰과 URL 환경변수를 분리하여 `git config insteadOf` 활용 (추천)
보안 및 관리를 위해 토큰(`GH_TOKEN`)과 저장소 주소(`CONTENT_GIT_REPO`)를 분리하여 지정하는 방법입니다.

1. **환경변수 등록**:
   * `GH_TOKEN`: `ghp_xxxxxxxxxxxx` (Personal Access Token)
   * `CONTENT_GIT_REPO`: `https://github.com/username/obsidian-content.git`

2. **빌드 스크립트 실행 전 `git config` 자동 전환**:
   ```bash
   git config --global url."https://${GH_TOKEN}@github.com/".insteadOf "https://github.com/"
   ```
   이 설정을 적용하면 `git clone https://github.com/username/obsidian-content.git` 호출 시 Git이 자동으로 `${GH_TOKEN}` 인증 토큰을 삽입하여 처리합니다.

#### ③ SSH Private Key 방식 (`GIT_SSH_COMMAND` 활용)
SSH 키를 환경변수로 넘겨 Private 저장소에 접근하는 방식입니다.

```bash
# 환경변수에 Base64로 인코딩된 SSH Private Key 등록 (예: SSH_PRIVATE_KEY)
echo "$SSH_PRIVATE_KEY" | base64 -d > /tmp/deploy_key
chmod 600 /tmp/deploy_key

export GIT_SSH_COMMAND="ssh -i /tmp/deploy_key -o StrictHostKeyChecking=no"
git clone git@github.com:username/obsidian-content.git
```

---

### 3) 동기화 동작 원리 (`scripts/fetch-content.mjs`)
* `npm run build` 또는 `npm run prebuild` 실행 시 `CONTENT_GIT_REPO` 환경변수 유무를 체크합니다.
* 환경변수가 등록되어 있으면 기존 `/content` 폴더를 초기화한 후 원격 Git 저장소를 `git clone --depth 1`로 다운로드 받아 빌드에 사용합니다.

---

## 📦 8. 원격 콘텐츠 GitHub 저장소 (`CONTENT_GIT_REPO`) 디렉토리 구조 규격

옵시디언(Obsidian) 앱에서 직접 작성하고 푸시(Git Push)하는 **독립 원격 콘텐츠 저장소**의 표준 폴더 레이아웃 구조 및 명세입니다. (이 저장소의 루트 전체가 빌드 타임에 `content/` 폴더로 1:1 동기화됩니다.)

```text
obsidian-content-repo/           <-- (CONTENT_GIT_REPO 원격 저장소 루트)
├── posts/                      <-- [필수] 블로그 포스트 마크다운 노트 (.md)
│   ├── tech/                   <-- (선택) 카테고리별 하위 폴더 분류 가능
│   │   └── nextjs-ssg.md
│   ├── daily/
│   │   └── 2026-07-log.md
│   └── page-bundle-example/    <-- (선택) 게시글 번들 방식
│       ├── index.md
│       └── local-image.png
├── layout/                     <-- [필수] 메인 블로그 대문/배너 설정 문서
│   └── home.md                 <-- 메인 히어로 타이핑 타이틀 & 소개글 Frontmatter
├── assets/                     <-- [필수] 옵시디언 첨부 이미지 & 미디어
│   ├── profile.png
│   └── tech/                   <-- 카테고리/게시글별 서브 에셋 폴더
│       └── architecture.png
├── comments/                   <-- [선택] 마크다운 기반 방문자 댓글 데이터
└── analytics/                  <-- [선택] 1일 1회 집계 일일 방문자/좋아요 요약 노트
```

### 📌 주요 구성 요도 설명

1. **`posts/` (포스트 노트)**:
   - 옵시디언에서 작성한 실제 마크다운 블로그 포스트가 저장됩니다.
   - Frontmatter (`title`, `date`, `tags`, `category`, `draft` 등) 표준 표기를 사용합니다.
   - 서브 폴더 깊이에 상관없이 파서가 재귀적으로 탐색하여 동적 슬러그(`/posts/slug`)를 생성합니다.
2. **`layout/home.md` (메인 배너 설정)**:
   - 블로그 메인 화면 상단 히어로 배너의 대제목, 대표 소개글, GitHub 프로필 링크를 정의하는 마크다운 파일입니다.
3. **`assets/` (첨부 미디어 자원)**:
   - 옵시디언 노트 내 `![[photo.png]]` 또는 `![[tech/architecture.png]]` 형태로 삽입된 이미지가 저장됩니다.
   - 빌드 시 `public/assets/`로 자동 복사되어 정적 URL로 서빙됩니다.

---

## 📋 6. 단계별 구현 마일스톤

1. **Step 1: 프로젝트 환경 셋업**
   - Next.js 14 App Router (TypeScript) 기반 초기화 및 기본 디자인 토큰 CSS 구축.
2. **Step 2: 마크다운 & 이미지 파이프라인 수립**
   - `scripts/copy-assets.mjs` 구현 및 `content/` 디렉토리 파싱 로직 (`lib/posts.ts`) 구축.
3. **Step 3: Obsidian 전용 커스텀 파서 구현**
   - Wikilink, Callout, Frontmatter Safe Parser, Code Highlighting 적용.
4. **Step 4: UI/UX & 디자인 구현**
   - 다크/라이트 모드, 반응형 포스트 레이아웃, Floating TOC, 카테고리/태그 필터링.
5. **Step 5: Vercel 배포 및 Obsidian Git 연동 검증**
   - Pure SSG 빌드 확인, Vercel 배포 및 Obsidian 노트 푸시 시 자동 반영 테스트.
