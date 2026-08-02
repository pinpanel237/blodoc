---
title: "옵시디언 마크다운 특화 문법 및 파싱 테스트"
date: "2026-07-26"
category: "Development"
tags: ["Markdown", "Parser", "Obsidian", "Callout"]
summary: "Obsidian Callouts, Wikilinks, 수식, 이미지 경로 및 코드 구문 강조 파싱 테스트 문서입니다."
draft: false
---

# 🧪 Obsidian Syntax Parser Test

이 문서는 Obsidian 고유 파싱 기능(Callout, Wikilink, 이미지 연동)이 올바르게 웹사이트에 렌더링되는지 확인하기 위한 테스트 페이지입니다.

---

## 1. Obsidian Callouts 테스트

> [!note]
> 이것은 **노트(Note)** 콜아웃입니다. 중요한 기본 설명이나 메모를 남길 때 사용합니다.

> [!warning]
> 이것은 **경고(Warning)** 콜아웃입니다. 주의가 필요한 사안을 강조합니다.

> [!tip]
> 이것은 **팁(Tip)** 콜아웃입니다. 유용한 정보나 성능 최적화 팁을 제공합니다.

> [!important]
> 이것은 **중요(Important)** 콜아웃입니다. 반드시 확인해야 하는 정보입니다.

---

## 2. Wikilinks (`[[Link]]`) 테스트

- 첫 번째 메인 글로 이동하기: [[welcome]]
- 다른 글 링크 테스트: [[obsidian-syntax-test]]

---

## 3. 이미지 연동 테스트

GitHub 저장소의 `content/assets/` 폴더에 동기화된 이미지는 마크다운 파서에 의해 웹 호스팅 이미지로 자동 파싱됩니다.

![[blog-demo.png]]

---

## 4. 수식 (MathJax / KaTeX) 테스트

인라인 수식: $E = mc^2$

블록 수식:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
