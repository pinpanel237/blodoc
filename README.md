# 🌿 BLODOC - Obsidian 마크다운 커스텀 블로그 템플릿

**옵시디언(Obsidian)** 노트를 **GitHub 저장소**에 올리면, 정적 HTML로 자동 변환하여 **웹사이트**에서 런타임 오류 없이 초고속으로 자동 호스팅하는 **오픈소스 블로그 템플릿**입니다.

---

## ✨ 주요 특징

- **🚀 초고속 정적 사이트 생성**: Vercel 배포 시 파일 시스템(`fs`) 접근 런타임 에러가 발생하지 않는 완전한 정적 HTML 렌더링.
- **🖼️ 무료 이미지 호스팅**: 옵시디언 첨부 이미지(`content/assets/`)를 웹 경로(`public/assets/`)로 자동 복사 및 렌더링.
- **🧪 Obsidian 특화 문법 지원**: 
  - Wikilinks (`[[다른 문서]]` $\rightarrow$ `/posts/slug` 라우팅)
  - Callouts (`> [!note]`, `> [!warning]`, `> [!tip]`, `> [!important]`)
  - Frontmatter (제목, 날짜, 태그, 카테고리, 요약, 임시저장)
- **🎨 모던 UI/UX**: Glassmorphism 헤더, 다크/라이트 테마 스위처, 목차(TOC) 자동 생성, 가독성 높은 Typography.
- **⚙️ 쉬운 커스텀**: `src/site.config.ts` 파일 하나로 블로그 정보 1초 만에 변경.

---

## 🚀 3분 만에 시작하기 (가이드)

### 1단계: 저장소 가져오기 (Fork / Template)
1. 상단의 **`Use this template`** 또는 **`Fork`** 버튼을 클릭하여 본인의 GitHub 계정으로 저장소를 생성합니다.

### 2단계: 옵시디언(Obsidian) 설정
1. 생성한 GitHub 저장소를 컴퓨터 로컬로 `git clone` 받거나 옵시디언 보관소(Vault)와 연결합니다.
2. Obsidian 설정 $\rightarrow$ `Files and links`:
   - `Default location for new attachments`: `In subfolder under current folder`
   - `Subfolder name`: `assets` (또는 `content/assets`)
3. Obsidian 플러그인 중 **`Obsidian Git`**을 설치하면 글 작성 후 버튼 하나로 GitHub에 자동 커밋/푸시됩니다.

### 3단계: Vercel 자동 배포
1. [Vercel](https://vercel.com)에 로그인하고 **`Add New Project`**를 클릭합니다.
2. 방금 생성한 GitHub 저장소를 선택합니다.
3. Framework Preset은 **Next.js**로 자동 인식되며, **`Deploy`** 버튼을 누르면 1분 이내로 블로그 생성이 완료됩니다!

---

## ⚙️ 개인 설정 변경 (`src/site.config.ts`)

`src/site.config.ts` 파일에서 블로그 이름, 설명, 소셜 링크를 자유롭게 변경하세요.

```typescript
export const siteConfig = {
  title: '내 기술 블로그',
  description: 'Obsidian으로 작성하는 개인 기술 블로그입니다.',
  author: 'pinpanel237',
  social: {
    github: 'https://github.com/pinpanel237/blodoc',
  },
};
```

---

## 🛠️ 개발 및 빌드 명령어

```bash
# 로컬 개발 서버 실행 (이미지 자동 복사 포함)
npm run dev

# 정적 사이트 빌드 검증
npm run build
```
