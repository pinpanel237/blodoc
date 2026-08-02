# blodoc - Obsidian & Markdown Blog

<p align="center">
  <a href="README.md"><b>English</b></a> |
  <a href="README.ko.md"><b>한국어</b></a>
</p>

---

옵시디언(Obsidian) 마크다운 노트를 푸시하면 Next.js 정적 파이프라인을 통해 정적 HTML로 자동 생성하여 Vercel 등에서 안정적으로 자동 호스팅되는 마크다운 블로그 템플릿입니다.

## 핵심 기능

- **Obsidian 파이프라인**: Wikilink (`[[Link]]`), Obsidian Callout (`> [!note]`), 첨부 이미지 자동 변환.
- **Pure SSG (Static Site Generation)**: Vercel 서버리스 런타임 파일 접근 에러가 없는 100% 정적 생성.
- **내장 디자인 시스템**: Astryx Design System (`@astryxdesign/core`) 기반 에디토리얼 레이아웃.
- **다국어 README 및 안전 파싱**: Frontmatter 파싱 오류 방지 및 최신 Next.js 16 비동기 파라미터 완벽 지원.

---

## 빠른 시작 가이드

### 1. 저장소 클론 및 패키지 설치
```bash
git clone https://github.com/pinpanel237/blodoc.git
cd blodoc
npm install
```

### 2. 로컬 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

### 3. 정적 빌드 및 에셋 복사 검증
```bash
npm run build
```

---

## 마크다운 작성 및 관리 구조

- **일반 블로그 포스트**: `content/posts/*.md`에 마크다운 문서를 작성합니다. (하위 서브 폴더 분류도 자동 지원)
- **메인 배너 & 레이아웃 설정**: `content/layout/home.md` 문서에서 메인 배너 대제목, 설명글, GitHub 링크를 변경할 수 있습니다.
- **첨부 이미지 관리**:
  - **단일 에셋 폴더 방식**: `content/assets/photo.png`
  - **게시글별 서브폴더 방식 (권장)**: `content/assets/게시글명/photo.png` 또는 `content/posts/게시글명/photo.png`
  - 이미지 파일은 빌드 시 `public/assets/` 이하 동일 구조로 자동 재귀 복사되어 `![[게시글명/photo.png]]` 형태로 자연스럽게 연동됩니다.

---

## 메인 배너 문구 및 레이아웃 설정 (`content/layout/home.md`)

`content/layout/home.md` 문서의 Frontmatter(YAML)를 수정하여 블로그 상단 히어로 배너의 문구 및 링크를 설정할 수 있습니다:

```yaml
---
title: 생각과 기록을 정리하는 개인 공간입니다   # 메인 히어로 타이핑 타이틀
summary: 옵시디언 마크다운 노트를 기반으로 메인 페이지 내용이 자동 연동됩니다.  # 블로그 대표 소개글
github: https://github.com/your-username/blodoc   # GitHub 프로필/저장소 링크
---
```

---

## 콘텐츠 작성, 로컬 테스트 및 실제 운영 사용법

### 1. 로컬 테스트 (Local Development)
- **포스트 작성**: `content/posts/*.md` 위치에 노트를 작성합니다. (카테고리, 태그, 날짜 등 Frontmatter 입력)
- **이미지 첨부**: `content/assets/` 폴더에 이미지를 넣으면 `![[photo.png]]` 구문이 자동 연동됩니다.
- **로컬 서버 실행**:
  ```bash
  npm run dev
  ```
  `http://localhost:3000`에서 작성한 노트를 실시간으로 확인하고 테스트할 수 있습니다.
- **정적 빌드 검증**:
  ```bash
  npm run build
  ```

### 2. 실제 운영 및 자동 배포 (Production Deployment)
1. **GitHub 저장소 연동**: 본인의 GitHub 저장소에 코드를 푸시합니다.
2. **Vercel 자동 배포**: Vercel에 GitHub 저장소를 연결합니다.
3. **Obsidian 자동 퍼블리싱**:
   - 옵시디언 앱의 `Obsidian Git` 커뮤니티 플러그인을 설치합니다.
   - 옵시디언에서 글을 작성하고 저장/푸시(`git push`)를 실행하면, Vercel이 이를 감지하여 **약 30초~1분 이내에 자동으로 웹 블로그에 발행**합니다.

---

## 환경 변수 설정 가이드 (`NEXT_PUBLIC_SITE_URL` & `CONTENT_GIT_REPO`)

개발 환경과 운영(Vercel) 환경의 사이트 도메인 주소 및 원격 콘텐츠 저장소를 설정하기 위해 환경 변수를 사용합니다.

### 1. 주요 환경 변수 목록

| 환경 변수 | 설명 | 예시 |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | 블로그 대표 사이트 도메인 (sitemap.xml 및 SEO에 활용) | `https://your-blog-domain.vercel.app` |
| `CONTENT_GIT_REPO` | **(선택)** 실제 운영에 사용할 별도 원격 Obsidian Git 저장소 URL | `https://github.com/username/obsidian-content.git` |

> [!TIP]
> **원격 콘텐츠 Git 저장소 연동 (`CONTENT_GIT_REPO`)**:
> `CONTENT_GIT_REPO`가 설정되어 있으면, 빌드 시점(`prebuild`)에 해당 원격 Git 저장소를 `content/` 폴더로 자동 Clone받아 정적 사이트를 빌드합니다. 환경 변수가 비어 있으면 기존 로컬 `/content` 폴더를 사용하여 테스트합니다.

### 2. 로컬 환경 변수 설정 (`.env.local`)
프로젝트 루트 디렉토리에 `.env.local` 파일 생성:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# CONTENT_GIT_REPO=https://github.com/username/your-obsidian-repo.git
```

### 3. Vercel 배포 환경 변수 설정
Vercel 대시보드의 `Settings -> Environment Variables`에 원하는 키/값을 등록합니다:
- **Key**: `NEXT_PUBLIC_SITE_URL` / **Value**: `https://your-blog-domain.vercel.app`
- **Key**: `CONTENT_GIT_REPO` / **Value**: 아래 Private 저장소 설정 방식 참조

> [!IMPORTANT]
> **Private Git 저장소 지정 방법**:
> 저장소가 Private인 경우 다음 방식 중 하나로 지정 및 설정합니다.
> 1. **PAT 직접 조합 (URL 포함)**:
>    `CONTENT_GIT_REPO=https://<PAT_TOKEN>@github.com/username/your-obsidian-repo.git`
> 2. **토큰 분리 및 `git config insteadOf` 활용 (권장)**:
>    - `GH_TOKEN`: `ghp_xxxxxxxxxxxx`
>    - `CONTENT_GIT_REPO`: `https://github.com/username/your-obsidian-repo.git`
>    - 사전 빌드 스크립트: `git config --global url."https://${GH_TOKEN}@github.com/".insteadOf "https://github.com/"`
> 3. **SSH 키 방식 (`GIT_SSH_COMMAND`)**:
>    - `GIT_SSH_COMMAND="ssh -i /path/to/key -o StrictHostKeyChecking=no"` 주입 후 SSH URL 사용 (`git@github.com:username/repo.git`)

---

## 🔄 원격 저장소 동기화 자동화 (Vercel Deploy Hook & GitHub Webhook)

원격 게시글 저장소(`CONTENT_GIT_REPO`)에 새로운 글이 Push될 때 블로그 사이트가 자동으로 다시 빌드되어 게시글이 동기화되도록 설정하는 방법입니다.

### 핵심 연동 3단계

1. **Vercel Deploy Hook 생성**:
   * Vercel Dashboard ➡ 프로젝트 선택 ➡ **Settings** ➡ **Git** 메뉴로 이동합니다.
   * **Deploy Hooks** 섹션에서 새로운 훅(예: 이름 `github-content-sync`, 브랜치 `main`)을 만들고 제공되는 **Deploy Hook URL**을 복사합니다.
2. **GitHub Webhook 등록**:
   * 업로드된 **게시글 GitHub 저장소** ➡ **Settings** ➡ **Webhooks** ➡ **Add webhook**으로 이동합니다.
   * **Payload URL**에 복사한 Vercel Deploy Hook URL을 붙여넣고, **Content type**을 `application/json`으로 지정한 뒤 저장합니다.
3. **환경변수 설정 확인**:
   * Vercel 프로젝트의 **Settings** ➡ **Environment Variables**에 `CONTENT_GIT_REPO` 주소가 올바르게 정의되어 있는지 확인합니다.

> 💡 **상세 설정 및 가이드**:
> 보다 자세한 연동 방식과 인증 토큰 설정 가이드는 [github-webhook-sync-guide.md](file:///Users/mypc/projects/blodoc/docs/github-webhook-sync-guide.md) 문서를 참고해 주세요.

---

## 📋 로드맵 & 기능 추적 문서

프로젝트의 구현 완료 내역 및 향후 개발 예정 기능(검색, 1일 1회 마크다운 기반 통계 및 댓글 동기화 파이프라인 등)은 아래 로드맵 문서에서 상세히 확인하실 수 있습니다:
- 🗺️ **[기능 로드맵 문서 (docs/feature-roadmap.md)](docs/feature-roadmap.md)**

