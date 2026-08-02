<!-- BEGIN:nextjs-agent-rules -->
# 기존 학습 데이터와 다른 Next.js 가이드

이 버전은 주요 API, 규칙 및 파일 구조에 변경 사항이 있을 수 있습니다. 코드를 작성하기 전에 `node_modules/next/dist/docs/`의 관련 가이드를 읽고 사용 중단(Deprecation) 안내를 확인하세요.
<!-- END:nextjs-agent-rules -->

# 🤖 AI 에이전트 & 도우미 작업 가이드 (AGENTS.md)

이 디렉토리(`.agents/`)는 본 옵시디언(Obsidian) 기반 커스텀 블로그 프로젝트를 수행하는 AI 에이전트들을 위한 아키텍처 사양, 지침 및 컨텍스트를 담고 있습니다.

---

## 📌 1. 문서 작성 및 Git 커밋 기본 원칙 (중요)

> [!IMPORTANT]
> **모든 문서, 주석, 분석서 및 설명 자료는 반드시 한글(Korean)로 작성합니다.**

> [!CAUTION]
> 🚨 **[최우선 엄금 대원칙] 자의적인 Git 커밋 및 푸시 절대 금지 (무조건 개별 승인 필수)**
> - AI 에이전트는 사용자의 **명시적인 개별 지시나 요청(예: "커밋해줘", "푸시해줘")이 매번 직접 내려지기 전까지는 절대로 `git commit`이나 `git push`를 자의적으로 수행하지 않습니다.**
> - 이전 턴에서 푸시 승인을 받았더라도, **새로운 코드 수정이 발생할 때마다 반드시 로컬 검증 및 보고만 진행하고 매번 새로 사용자의 명시적 지시를 받아야 합니다.**
> - 사용자의 직접적인 지시 없이 커밋/푸시를 수행하는 것은 심각한 수칙 위반입니다.

### 📌 Git 커밋 메시지 규격 (사용자 지시 시 수행)
- **커밋 타입 (Prefix)**: Conventional Commits 표준 영문 타입 사용 (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore` 등)
- **커밋 메시지 본문**: **반드시 한글(Korean)로 상세히 작성**
- **커밋 예시**:
  - `feat: Obsidian 마크다운 파서 및 Vercel Pure SSG 파이프라인 구축`
  - `docs: .agents 디렉토리 내 시스템 분석서 작성`
  - `style: Dribbble Bento Grid 및 Astryx 디자인 시스템 연동`

---

## 📌 2. 프로젝트 개요
- **프로젝트명**: `blodoc` (Obsidian 마크다운 기반 커스텀 블로그)
- **목표**: 옵시디언 마크다운 노트와 첨부 이미지를 GitHub에 푸시하면, Next.js SSG 파이프라인을 통해 정적 HTML로 파싱하여 Vercel에서 런타임 오류 없이 안정적으로 자동 호스팅합니다.

---

## 🏗️ 3. 핵심 아키텍처 & 기술 스택

1. **프레임워크**: Next.js 14+ (App Router, TypeScript)
2. **렌더링 모드**: **Pure SSG (Static Site Generation)**
   - `contents/posts/` 폴더 내의 모든 마크다운 파일은 빌드 시점에 `generateStaticParams()`를 통해 정적 HTML로 생성되어야 합니다.
   - Vercel 서버리스 런타임 환경에서 `fs` 파일 접근 오류를 방지하기 위해 `export const dynamic = 'force-static'`을 반드시 적용합니다.
3. **디자인 시스템**: **Astryx Design System** (`@astryxdesign/core`, `@astryxdesign/theme-neutral`, `@astryxdesign/cli`)
4. **이미지 & 에셋 파이프라인**:
   - 옵시디언 첨부 이미지는 `contents/assets/` 폴더에 동기화됩니다.
   - 빌드 스크립트 `scripts/copy-assets.mjs`가 `contents/assets/` $\rightarrow$ `public/assets/`로 파일을 자동 복사합니다.
   - 커스텀 파서가 마크다운 내 `![[photo.png]]` 또는 `![](assets/photo.png)`를 `<img src="/assets/photo.png" />` 경로로 자동 변환합니다.
5. **Obsidian 특화 파서**:
   - `gray-matter`: Frontmatter (제목, 날짜, 태그, 카테고리, 임시저장 여부) 추출.
   - Wikilink (`[[Link]]`) $\rightarrow$ `/posts/slug` 블로그 라우팅 변환.
   - Obsidian Callout (`> [!note]`) $\rightarrow$ 커스텀 React Callout 컴포넌트 변환.
   - 코드 하이라이트: `rehype-pretty-code` / `shiki`.

---

## 📁 4. 주요 디렉토리 & 문서 안내

- `docs/`: AI 에이전트 및 작성자가 생성한 모든 시스템 분석, 정리 문서, 기능 로드맵이 위치하는 디렉토리입니다.
  - `docs/blog-architecture-analysis.md`: 상세 시스템 아키텍처 분석 및 Vercel 문제 해결 가이드 문서.
  - `docs/feature-roadmap.md`: 블로그 기능 로드맵 및 백로그 문서.
- `contents/posts/`: 원본 옵시디언 마크다운 포스트 파일들.
- `contents/assets/`: 원본 옵시디언 첨부 이미지 파일들.
- `src/lib/posts.ts`: 마크다운 Safe Parsing 및 SSG 데이터 추출 로직.
- `src/lib/obsidian.ts`: 옵시디언 전용 커스텀 파서 로직.

---

## ⚠️ 5. 에이전트 행동 지침

1. **모든 문서는 한글 작성**: 모든 가이드, 분석서, 문서화 및 코드 주석은 한글로 작성합니다.
2. **정리/분석 문서 저장 위치**: AI 에이전트가 새롭게 작성하는 모든 정리 문서, 시스템 분석서, 로드맵 문서 등은 반드시 `docs/` 디렉토리 내에 생성 및 저장합니다.
3. **🚨 자의적 Git 커밋/푸시 절대 금지 (개별 매회 승인)**: 사용자가 매 수정 건마다 "커밋/푸시해라"고 직접 명시적 지시를 내리기 전까지 `git commit`이나 `git push`를 자의적으로 절대로 실행하지 않습니다. 로컬 변경 상태를 보고하고 사용자의 지시를 기다립니다.
4. **원본 콘텐츠 직접 수정 금지**: `contents/` 폴더는 사용자가 옵시디언 앱에서 작성하여 Push하는 영역이므로 구조를 훼손하지 않습니다.
5. **안전한 파싱 (Safe Parsing) 준수**: 마크다운 파서 및 Frontmatter 파싱 시 에러 예방 가드를 적용하여 잘못된 마크다운으로 인해 빌드가 깨지지 않도록 합니다.
6. **Pure SSG 준수**: 런타임 서버리스 동적 파일 파싱 로직을 절대 도입하지 않습니다.
