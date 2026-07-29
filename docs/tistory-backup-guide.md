# 📝 티스토리 블로그 마크다운 백업 및 자동화 가이드

본 문서는 티스토리 블로그의 모든 글과 첨부 이미지를 옵시디언(Obsidian) 및 `blodoc` 프로젝트 호환 마크다운 파일로 자동 변환하여 저장하는 범용 백업 가이드입니다.

---

## 📌 1. 백업 원리 및 파이프라인

티스토리 블로그는 검색엔진 수집을 위한 `sitemap.xml`을 자동으로 제공합니다.

1. **포스트 목록 추출**: `https://<블로그주소>/sitemap.xml` 분석 
   - 숫자 형태의 포스트 ID (예: `/445`, `/444`, ...) URL 전체 목록 수집.
2. **HTML 본문 및 메타데이터 수집**:
   - 제목 (`og:title` 또는 `h1`)
   - 작성일 (`article:published_time`)
   - 카테고리 (`category`)
   - 태그 (`tags`)
   - 본문 HTML (`.tt_article_useless_p_margin` 영역)
3. **이미지 추출 및 저장**:
   - 본문 내 `<img>` 태그의 이미지 URL 수집 및 로컬 디렉토리(`content/assets/`)에 다운로드.
4. **마크다운(Markdown) 변환 & Frontmatter 생성**:
   - 본문 HTML을 마크다운 문법으로 변환.
   - 이미지 링크를 옵시디언/블로그 규격(`![[tistory_445_1.png]]`)으로 치환.
   - 상단에 YAML Frontmatter (`title`, `date`, `category`, `tags` 등) 첨부.

---

## 📌 2. 백업 스크립트 실행 방법

누구나 자신의 블로그 주소(URL 또는 아이디)를 인자(Argument)로 전달하여 실행할 수 있습니다.

### 1) 필요한 파이썬 라이브러리 설치
```bash
pip install requests beautifulsoup4
```

### 2) 백업 스크립트 실행 (블로그 주소/아이디 인자 전달)

아래 방식 중 편하신 입력 형태로 실행할 수 있습니다:

```bash
# 방식 A: 블로그 아이디만 입력
python scripts/backup_tistory.py your-blog-id

# 방식 B: 도메인 전체 입력
python scripts/backup_tistory.py your-blog-id.tistory.com

# 방식 C: https 포함 URL 입력
python scripts/backup_tistory.py https://your-blog-id.tistory.com
```

---

## 📌 3. 저장 결과 확인 및 연동
- **마크다운 문서**: `content/posts/{entry_id}_{title}.md` 경로에 수집 저장됩니다.
- **이미지 첨부 파일**: `content/assets/tistory_{entry_id}_{index}.png` 경로로 다운로드됩니다.
- 다운로드된 포스트는 `blodoc` 프로젝트의 SSG 빌드 파이프라인에 그대로 연결되어 블로그로 재호스팅될 수 있습니다.
