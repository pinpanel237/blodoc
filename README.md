# blodoc - Obsidian & Markdown Blog

<p align="center">
  <a href="README.md"><b>English</b></a> |
  <a href="README.ko.md"><b>한국어</b></a> |
  <a href="README.ja.md"><b>日本語</b></a> |
  <a href="README.zh.md"><b>中文</b></a>
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

- **Blog Posts**: Add your markdown notes under `content/posts/*.md` (subdirectories supported).
- **Layout & Home Config**: Customize main banner text, description, and GitHub links via `content/layout/home.md`.
- **Image Assets**:
  - **Single Assets Directory**: `content/assets/photo.png`
  - **Per-Post Subdirectories (Recommended)**: `content/assets/post-name/photo.png` or `content/posts/post-name/photo.png`
  - Images are automatically copied recursively to `public/assets/` during build and seamlessly linked via `![[post-name/photo.png]]` or relative paths.

---

## Main Banner & Layout Config (`content/layout/home.md`)

Edit Frontmatter (YAML) in `content/layout/home.md` to customize hero banner text and profile links:

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
- **Write Posts**: Create markdown files under `content/posts/*.md` with Frontmatter (`category`, `tags`, `date`).
- **Attach Images**: Add images in `content/assets/`, which automatically links `![[photo.png]]` syntax.
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
> If `CONTENT_GIT_REPO` is specified, the build process (`prebuild`) will automatically clone the remote repository into the `content/` folder before generating static HTML pages. If left unset, it falls back to using local `/content` files for testing.

### 2. Local Environment Setup (`.env.local`)
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# CONTENT_GIT_REPO=https://github.com/username/your-obsidian-repo.git
```

### 3. Vercel Deployment Environment Setup
In your Vercel Dashboard (`Settings -> Environment Variables`), add key-value pairs:
- **Key**: `NEXT_PUBLIC_SITE_URL` / **Value**: `https://your-blog-domain.vercel.app`
- **Key**: `CONTENT_GIT_REPO` / **Value**: `https://github.com/username/your-obsidian-repo.git` (For private repos, combine with GitHub PAT: `https://<PAT>@github.com/username/repo.git`)

---

## 📋 Roadmap & Feature Tracking

Check completed milestones and upcoming feature roadmaps (Full-text search, 1-day batch markdown-based analytics & comments pipeline) in the roadmap documentation:
- 🗺️ **[Feature Roadmap (docs/feature-roadmap.md)](docs/feature-roadmap.md)**

