# blodoc - Obsidian & Markdown Blog

<p align="center">
  <a href="README.md"><b>English</b></a> |
  <a href="README.ko.md"><b>한국어</b></a>
</p>

---

A modern markdown blog template that automatically parses Obsidian markdown notes into static HTML pages powered by Next.js App Router and hosted seamlessly on Vercel.

## Key Features

- **Obsidian Pipeline**: Native support for Wikilinks (`[[Link]]`), Obsidian Callouts (`> [!note]`), and attached image asset copying.
- **Pure SSG (Static Site Generation)**: 100% pre-rendered static site with zero serverless `fs` runtime errors on Vercel.
- **Design System Integration**: Built with Astryx Design System (`@astryxdesign/core`) for sleek editorial layouts.
- **Safe Parsing**: Full compatibility with Next.js 16 async params and graceful Frontmatter error guards.

---

## Quick Start Guide

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/pinpanel237/blodoc.git
cd blodoc
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build Verification
```bash
npm run build
```

---

## Content Management

- **Blog Posts**: Add your markdown notes under `contents/posts/*.md` (subdirectories supported).
- **Layout & Home Config**: Customize main banner text, description, and GitHub links via `contents/layout/home.md`.
- **Image Assets**:
  - **Single Assets Directory**: `contents/assets/photo.png`
  - **Per-Post Subdirectories (Recommended)**: `contents/assets/post-name/photo.png` or `contents/posts/post-name/photo.png`
  - Images are automatically copied recursively to `public/assets/` during build and seamlessly linked via `![[post-name/photo.png]]` or relative paths.

---

## Main Banner & Layout Config (`contents/layout/home.md`)

Edit Frontmatter (YAML) in `contents/layout/home.md` to customize hero banner text and profile links:

```yaml
---
title: Personal space for thoughts and notes   # Main hero typewriter title
summary: Powered by Obsidian markdown notes synced automatically.  # Main blog description
github: https://github.com/your-username/blodoc   # GitHub profile/repo link
---
```

---

## Content Writing, Local Testing & Production Workflow

### 1. Local Development & Testing
- **Write Posts**: Create markdown files under `contents/posts/*.md` with Frontmatter (`category`, `tags`, `date`).
- **Attach Images**: Add images in `contents/assets/`, which automatically links `![[photo.png]]` syntax.
- **Run Local Server**:
  ```bash
  npm run dev
  ```
  Preview notes live at `http://localhost:3000`.
- **Verify Build**:
  ```bash
  npm run build
  ```

### 2. Production Deployment Workflow
1. **Push to GitHub**: Push your repository code to GitHub.
2. **Connect to Vercel**: Import your repository in Vercel for automated deployments.
3. **Automated Publishing via Obsidian**:
   - Install the `Obsidian Git` community plugin in your Obsidian app.
   - Simply write notes and trigger `git push` in Obsidian — Vercel detects updates and **publishes your blog automatically in ~30 seconds**.

---

## Environment Variables Setup (`NEXT_PUBLIC_SITE_URL` & `CONTENT_GIT_REPO`)

Use environment variables to configure site domain URLs and remote Obsidian Git repositories for development and production (Vercel) environments.

### 1. Key Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Main blog domain (used for sitemap.xml & SEO) | `https://your-blog-domain.vercel.app` |
| `CONTENT_GIT_REPO` | **(Optional)** Remote Obsidian Git repository URL for production | `https://github.com/username/obsidian-content.git` |

> [!TIP]
> **Remote Content Git Repo (`CONTENT_GIT_REPO`)**:
> If `CONTENT_GIT_REPO` is specified, the build process (`prebuild`) will automatically clone the remote repository into the `contents/` folder before generating static HTML pages. If left unset, it falls back to using local `/contents` files for testing.

### 2. Local Environment Setup (`.env.local`)
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# CONTENT_GIT_REPO=https://github.com/username/your-obsidian-repo.git
```

### 3. Vercel Deployment Environment Setup
In your Vercel Dashboard (`Settings -> Environment Variables`), add key-value pairs:
- **Key**: `NEXT_PUBLIC_SITE_URL` / **Value**: `https://your-blog-domain.vercel.app`
- **Key**: `CONTENT_GIT_REPO` / **Value**: Refer to Private Repository Setup below

> [!IMPORTANT]
> **Private Git Repository Setup**:
> If your repository is private, configure authentication using one of the following methods:
> 1. **Direct PAT Embed in URL**:
>    `CONTENT_GIT_REPO=https://<PAT_TOKEN>@github.com/username/your-obsidian-repo.git`
> 2. **Token Separation with `git config insteadOf` (Recommended)**:
>    - `GH_TOKEN`: `ghp_xxxxxxxxxxxx`
>    - `CONTENT_GIT_REPO`: `https://github.com/username/your-obsidian-repo.git`
>    - Pre-build command: `git config --global url."https://${GH_TOKEN}@github.com/".insteadOf "https://github.com/"`
> 3. **SSH Key via `GIT_SSH_COMMAND`**:
>    - Inject `GIT_SSH_COMMAND="ssh -i /path/to/key -o StrictHostKeyChecking=no"` and use SSH URL (`git@github.com:username/repo.git`)

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

## 📋 Roadmap & Feature Tracking

Check completed milestones and upcoming feature roadmaps (Full-text search, 1-day batch markdown-based analytics & comments pipeline) in the roadmap documentation:
- 🗺️ **[Feature Roadmap (docs/feature-roadmap.md)](docs/feature-roadmap.md)**

