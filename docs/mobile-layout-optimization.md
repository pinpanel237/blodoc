# 📱 모바일 화면 레이아웃 최적화 보고서

본 문서는 `blodoc` 블로그의 모바일 화면 레이아웃 뭉개짐 및 잘림 현상의 원인을 분석하고, 이를 최적화하기 위한 상세 계획과 변경 내역을 정리한 문서입니다.

---

## 1. 🔍 주요 문제 원인 분석

1. **포스트 상세 보기 레이아웃 (TOC와 본문)**
   - `src/app/posts/[slug]/page.tsx` 내에서 본문과 TOC가 `<div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '3.5rem' }}>` 인라인 스타일로 고정되어 있습니다.
   - 모바일 화면(1024px 미만)에서도 가로 240px의 TOC가 화면을 우측에서 강제로 점유하고 있어, 본문 영역이 심각하게 뭉개지거나 화면 밖으로 잘려 나가는 가로 스크롤 현상이 발생합니다.

2. **Dribbble 포스트 카드 그리드 너비 제약**
   - `.dribbble-posts-grid`의 `grid-template-columns` 설정이 `repeat(auto-fill, minmax(360px, 1fr))`로 지정되어 있습니다.
   - 360px보다 좁은 모바일 기기(예: iPhone SE 320px, 일반 모바일 360px)에서 카드 한 장조차 화면 너비를 초과하여 화면 우측이 잘리고 가로 스크롤이 발생합니다.

3. **헤더 네비게이션 요소 충돌**
   - 모바일 화면에서 로고 텍스트 크(1.4rem)와 검색 버튼, 메뉴 아이템(포스트, GitHub), 다크모드 토글 스위치가 한 줄에 배치되어 간격이 부족해지면서 겹치거나 줄바꿈되어 깨지는 현상이 발생합니다.

4. **마크다운 테이블 및 긴 코드 블록**
   - 마크다운 본문에 삽입된 테이블(`<table>`)이 반응형 처리가 되어있지 않아, 내용이 길어질 경우 가로 화면을 밀어내 레이아웃을 붕괴시킵니다.
   - 모바일 기기에서 코드 블록(`pre`) 내부 패딩과 폰트 크기가 데스크톱 기준으로 너무 커서 가독성이 저하됩니다.

5. **하단 푸터 레이아웃**
   - 푸터 요소가 `flex-wrap: wrap`에 의존하고 있어 모바일 기기에서 텍스트와 메뉴 링크들이 어설프게 줄바꿈되어 정렬이 일그러집니다.

---

## 🛠️ 2. 최적화 해결 방안 및 계획

### A. CSS/TSX 구조적 반응형 개선
- 포스트 상세 화면(`src/app/posts/[slug]/page.tsx`)의 인라인 그리드 스타일을 제거하고, 반응형 클래스(`.post-detail-layout`)를 추가합니다.
- `1024px` 이하 화면에서는 **TOC 영역을 완전히 숨기고(`display: none`) 아티클 본문이 화면 전체 너비(100%)를 차지**하도록 구현합니다.

### B. 그리드 시스템 및 카드 패딩 개선
- `dribbble-posts-grid`의 최솟값을 `360px`에서 모바일 안전 크기인 `280px` 또는 `100%`로 반응형 조정합니다.
- 모바일 뷰포트에서 주요 Bento 카드 패딩과 히어로 타이틀 폰트 크기를 기기 크기에 맞춰 축소합니다.

### C. 헤더 컴포넌트 반응형 최적화
- 모바일 화면에서 검색 버튼의 텍스트 라벨('검색')을 숨기고 **돋보기 아이콘만 남겨** 너비를 확보합니다.
- 로고의 폰트 크기를 미세하게 조정하고 간격(gap)을 최적화합니다.

### D. 마크다운 에셋 & 요소 최적화
- `markdown.css`에 테이블(`table`) 반응형 가로 스크롤을 강제하는 스타일을 주입합니다 (`display: block; overflow-x: auto;`).
- 모바일 화면용 코드 블록 폰트 사이즈 및 복사 버튼 크기를 컴팩트하게 조절합니다.

### E. 푸터 모바일 정렬 전환
- 모바일 화면(640px 이하)에서는 푸터를 `flex-direction: column`으로 일관되게 수직 정렬하고 간격을 조정합니다.

---

## 📝 3. 변경 내역 및 파일별 상세 수정 사항

### 1) [src/app/posts/[slug]/page.tsx](file:///Users/mypc/projects/blodoc/src/app/posts/[slug]/page.tsx)
- 인라인 그리드 스타일을 `className="post-detail-layout"`, `className="post-main-article"`, `className="post-toc-aside"`로 리팩토링.

### 2) [src/styles/globals.css](file:///Users/mypc/projects/blodoc/src/styles/globals.css)
- 모바일 반응형 미디어 쿼리 신설:
  - TOC 숨김 및 1단 레이아웃 전환 (`@media (max-width: 1024px)`)
  - 포스트 카드 그리드 반응형 축소 (`@media (max-width: 768px)`, `@media (max-width: 480px)`)
  - 헤더 텍스트 라벨 생략 및 알약 버튼 크기 축소 (`@media (max-width: 640px)`)
  - 모바일 히어로 패딩 및 타이틀 최적화
  - 푸터 세로 정렬 (`@media (max-width: 640px)`)

### 3) [src/styles/markdown.css](file:///Users/mypc/projects/blodoc/src/styles/markdown.css)
- 테이블 가로 스크롤 활성화 (`table { display: block; overflow-x: auto; }`)
- 코드 블록 패딩 및 복사 버튼 컴팩트화 미디어 쿼리 추가.
