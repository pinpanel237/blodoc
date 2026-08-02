---
title: "마크다운(Markdown) 종합 포맷팅 & 수식 종합 가이드"
date: "2026-07-23"
category: "General"
tags: ["Markdown", "KaTeX", "Syntax", "Callout"]
summary: "코드 구문 강조, Obsidian 콜아웃, 수식(LaTeX), 표, 이미지 등 지원되는 다양한 마크다운 포맷 테스트 문서입니다."
draft: false
---

# 📝 마크다운 종합 포맷팅 가이드

이 문서는 지원되는 다양한 마크다운 요소와 옵시디언 고유 문법을 확인하기 위한 렌더링 테스트 포스트입니다.

---

## 1. 콜아웃 (Callouts)

> [!note]
> 일반적인 메모 및 노트 설명 콜아웃입니다.

> [!tip]
> 팁이나 유용한 추천 노하우를 전달하는 콜아웃입니다.

> [!warning]
> 주의가 필요한 사안을 강조하는 경고 콜아웃입니다.

> [!important]
> 반드시 확인해야 하는 중요 콜아웃입니다.

---

## 2. 수식 (LaTeX)

인라인 수식: $E = mc^2$

블록 수식:
$$
f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi)\,e^{2\pi i \xi x}\,d\xi
$$

---

## 3. 코드 하이라이트

```typescript
function greet(name: string): string {
  return `Hello, ${name}! Welcome to BLODOC.`;
}
```
