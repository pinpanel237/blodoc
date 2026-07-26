# 🌿 blodoc - Obsidian & Next.js Pure SSG Blog

<p align="center">
  <a href="README.md"><b>한국어</b></a> |
  <a href="README.en.md"><b>English</b></a> |
  <a href="README.ja.md"><b>日本語</b></a> |
  <a href="README.zh.md"><b>中文</b></a>
</p>

---

ObsidianのマークダウンノートをGitHubにプッシュするだけで、Next.js Pure SSGパイプラインを通じて静的HTMLに自動パースし、Vercel等で安定してホスティングできるブログテンプレートです。

## ✨ 主な機能

- **Obsidianパイプライン**: Wikilink (`[[Link]]`)、Obsidian Callout (`> [!note]`)、添付画像パスの自動変換。
- **Pure SSG (Static Site Generation)**: Vercelサーバーレスランタイム環境での`fs`アクセスエラーが発生しない100%静的生成。
- **デザインシステム**: Astryx Design System (`@astryxdesign/core`) を活用した洗練されたエディトリアルレイアウト。
- **安全なパース機能**: Next.js 16の非同期パラメータ対応およびFrontmatterパースエラーガード機能。

---

## 🚀 クイックスタートガイド

### 1. リポジトリのクローンとパッケージインストール
```bash
git clone https://github.com/pinpanel237/blodoc.git
cd blodoc
npm install
```

### 2. ローカル開発サーバーの起動
```bash
npm run dev
```
ブラウザで `http://localhost:3000` にアクセスして確認します。

### 3. 静的ビルドの検証
```bash
npm run build
```

---

## 📂 コンテンツ管理構造

- **ブログ記事**: `content/posts/*.md` 内にマークダウンノートを配置します。
- **メインバナー & レイアウト設定**: `content/layout/home.md` ファイルでメインバナーのタイトル、説明文、GitHubリンクを変更できます。
- **添付画像**: `content/assets/` に画像を配置すると、ビルド時に `public/assets/` へ自動コピーされます。

---

## 📄 クレジット表示

- **テンプレート制作者**: [pinpanel237](https://github.com/pinpanel237)
