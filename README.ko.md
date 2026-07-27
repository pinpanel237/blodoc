# blodoc - Obsidian & Markdown Blog

<p align="center">
  <a href="README.md"><b>English</b></a> |
  <a href="README.ko.md"><b>한국어</b></a> |
  <a href="README.ja.md"><b>日本語</b></a> |
  <a href="README.zh.md"><b>中文</b></a>
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

- **일반 블로그 포스트**: `content/posts/*.md`에 마크다운 문서를 작성합니다.
- **메인 배너 & 레이아웃 설정**: `content/layout/home.md` 문서에서 메인 배너 대제목, 설명글, GitHub 링크를 변경할 수 있습니다.
- **첨부 이미지**: `content/assets/` 폴더에 이미지를 넣으면 빌드 시 `public/assets/`로 자동 복사됩니다.

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

## 환경 변수 설정 가이드 (`NEXT_PUBLIC_SITE_URL`)

개발 환경과 운영(Vercel) 환경의 사이트 도메인 주소를 설정하기 위해 환경 변수를 사용합니다. 미설정 시 개발 환경은 `http://localhost:3000`, 운영 환경은 기본 Vercel URL이 자동으로 적용됩니다.

### 1. 로컬 환경 변수 설정 (`.env.local`)
프로젝트 루트 디렉토리에 `.env.local` 파일 생성:
```env
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

### 2. Vercel 배포 환경 변수 설정
Vercel 대시보드의 `Settings -> Environment Variables`에 아래 환경 변수를 등록하면 `sitemap.xml` 및 `robots.txt`에 해당 도메인이 자동 반영됩니다:
- **Key**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://your-blog-domain.vercel.app` (또는 커스텀 도메인)
