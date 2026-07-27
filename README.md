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

- **Blog Posts**: Add your markdown notes under `content/posts/*.md`.
- **Layout & Home Config**: Customize main banner text, description, and GitHub links via `content/layout/home.md`.
- **Image Assets**: Place images in `content/assets/`, which are automatically synced to `public/assets/` during build.

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

## Environment Variables Setup (`NEXT_PUBLIC_SITE_URL`)

Use environment variables to configure site domain URLs for development and production (Vercel) environments. If not set, defaults to `http://localhost:3000` in development and default Vercel URLs in production.

### 1. Local Environment Setup (`.env.local`)
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

### 2. Vercel Deployment Setup
In Vercel Dashboard (`Settings -> Environment Variables`), add the following key:
- **Key**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://your-blog-domain.vercel.app` (or custom domain)
