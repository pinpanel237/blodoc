# 🌿 blodoc - Obsidian & Next.js Pure SSG Blog

<p align="center">
  <a href="README.md"><b>한국어</b></a> |
  <a href="README.en.md"><b>English</b></a> |
  <a href="README.ja.md"><b>日本語</b></a> |
  <a href="README.zh.md"><b>中文</b></a>
</p>

---

A modern static blog template that automatically parses Obsidian markdown notes into pure static HTML pages powered by Next.js App Router and hosted seamlessly on Vercel.

## ✨ Key Features

- **Obsidian Pipeline**: Native support for Wikilinks (`[[Link]]`), Obsidian Callouts (`> [!note]`), and attached image asset copying.
- **Pure SSG (Static Site Generation)**: 100% pre-rendered static site with zero serverless `fs` runtime errors on Vercel.
- **Design System Integration**: Built with Astryx Design System (`@astryxdesign/core`) for sleek editorial layouts.
- **Safe Parsing**: Full compatibility with Next.js 16 async params and graceful Frontmatter error guards.

---

## 🚀 Quick Start Guide

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

## 📂 Content Management

- **Blog Posts**: Add your markdown notes under `content/posts/*.md`.
- **Layout & Home Config**: Customize main banner text, description, and GitHub links via `content/layout/home.md`.
- **Image Assets**: Place images in `content/assets/`, which are automatically synced to `public/assets/` during build.

---

## 📄 Attribution & Credit

- **Template Author**: [pinpanel237](https://github.com/pinpanel237)
