# blodoc - Obsidian & Markdown Blog

<p align="center">
  <a href="README.md"><b>English</b></a> |
  <a href="README.ko.md"><b>한국어</b></a> |
  <a href="README.ja.md"><b>日本語</b></a> |
  <a href="README.zh.md"><b>中文</b></a>
</p>

---

这是一个基于 Next.js App Router 的 Pure SSG 静态博客模板。只需将 Obsidian Markdown 笔记推送至 GitHub，即可通过静态编译自动生成 HTML，在 Vercel 等平台无缝托管。

## 核心特性

- **Obsidian 语法支持**: 原生支持 Wikilink (`[[Link]]`)、Obsidian Callout (`> [!note]`) 以及附件图片自动解析。
- **Pure SSG (静态站点生成)**: 100% 预渲染静态页面，彻底避免 Vercel 无服务器环境下的 `fs` 运行时文件读取错误。
- **设计系统集成**: 基于 Astryx Design System (`@astryxdesign/core`) 构建的现代期刊风格布局。
- **安全解析与兼容**: 完美兼容 Next.js 16 异步参数，并具备 Frontmatter 解析容错机制。

---

## 快速开始

### 1. 克隆仓库与安装依赖
```bash
git clone https://github.com/pinpanel237/blodoc.git
cd blodoc
npm install
```

### 2. 启动本地开发服务器
```bash
npm run dev
```
在浏览器中打开 `http://localhost:3000` 即可预览。

### 3. 验证静态构建
```bash
npm run build
```

---

## 内容管理结构

- **博客文章**: 将 Markdown 笔记放置在 `content/posts/*.md` 目录下。
- **首页与布局配置**: 可在 `content/layout/home.md` 中修改首页横幅标题、说明文字及 GitHub 链接。
- **图片附件**: 将图片放入 `content/assets/`，构建时会自动同步至 `public/assets/`。
