# 🌿 blodoc - Obsidian & Next.js Pure SSG Blog

<p align="center">
  <a href="README.md"><b>English</b></a> |
  <a href="README.ko.md"><b>한국어</b></a> |
  <a href="README.ja.md"><b>日本語</b></a> |
  <a href="README.zh.md"><b>中文</b></a>
</p>

---

옵시디언(Obsidian) 마크다운 노트를 푸시하면 Next.js Pure SSG 파이프라인을 통해 정적 HTML로 자동 생성하여 Vercel 등에서 안정적으로 자동 호스팅되는 정적 블로그 템플릿입니다.

## ✨ 핵심 기능

- **Obsidian 파이프라인**: Wikilink (`[[Link]]`), Obsidian Callout (`> [!note]`), 첨부 이미지 자동 변환.
- **Pure SSG (Static Site Generation)**: Vercel 서버리스 런타임 파일 접근 에러가 없는 100% 정적 생성.
- **내장 디자인 시스템**: Astryx Design System (`@astryxdesign/core`) 기반 에디토리얼 레이아웃.
- **다국어 README 및 안전 파싱**: Frontmatter 파싱 오류 방지 및 최신 Next.js 16 비동기 파라미터 완벽 지원.

---

## 🚀 빠른 시작 가이드

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

## 📂 마크다운 작성 및 관리 구조

- **일반 블로그 포스트**: `content/posts/*.md`에 마크다운 문서를 작성합니다.
- **메인 배너 & 레이아웃 설정**: `content/layout/home.md` 문서에서 메인 배너 대제목, 설명글, GitHub 링크를 변경할 수 있습니다.
- **첨부 이미지**: `content/assets/` 폴더에 이미지를 넣으면 빌드 시 `public/assets/`로 자동 복사됩니다.
