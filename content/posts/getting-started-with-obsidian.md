---
title: "옵시디언(Obsidian) 노트 작성과 블로그 자동 동기화 가이드"
date: "2026-07-26"
category: "Obsidian"
tags: ["Obsidian", "Markdown", "Guide", "DigitalGarden"]
summary: "Obsidian 앱에서 작성한 노트를 GitHub Git 플러그인을 통해 1초 만에 개인 웹 블로그로 자동 발행하는 방법입니다."
draft: false
---

# 🌿 Obsidian 노트 작성과 디지털 가든 구축

옵시디언(Obsidian)은 마크다운 기반의 로컬 폰드 노트 작성 도구로, 문서 간의 연결과 빠른 지식 관리에 특화되어 있습니다.

---

## 🚀 1. 옵시디언 Git 연동 3단계

1. **Obsidian Git 플러그인 설치**: 옵시디언 커뮤니티 플러그인에서 `Obsidian Git`을 검색하여 설치합니다.
2. **자동 커밋 & 푸시 설정**: `Vault backup interval`을 설정하면 작성 중인 노티가 지정된 시간마다 저장소로 푸시됩니다.
3. **첨부 이미지 경로 설정**: `Settings -> Files and links -> Subfolder name`을 `assets`로 지정하면 이미지가 자동으로 동기화됩니다.

> [!tip]
> 단축키 `Ctrl + S` 또는 옵시디언 명령 팔레트에서 `Obsidian Git: Commit all and push`를 실행하면 즉시 발행됩니다!

---

## 🔗 2. 옵시디언 특화 위키링크(Wikilinks) 연동

문서와 문서를 연결할 때는 아래와 같이 위키링크를 사용할 수 있습니다:

- 마크다운 포맷팅 가이드 읽기: [[markdown-formatting-guide]]
- 블로그 오픈 환영 글 읽기: [[welcome]]
