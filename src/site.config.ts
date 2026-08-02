export const siteConfig = {
  title: 'BLODOC',
  description: '옵시디언(Obsidian) 노트를 나만의 개인 웹 블로그로 자동 변환해 주는 커스텀 블로그 템플릿',
  author: 'pinpanel237',
  domain: 'https://github.com/pinpanel237/blodoc',
  social: {
    github: 'https://github.com/pinpanel237/blodoc',
    twitter: '',
    email: '',
  },
  // 원 저작자 크레딧 (MIT License Attribution)
  credits: {
    showTemplateCredit: true,
    originalAuthor: 'pinpanel237',
    originalRepo: 'https://github.com/pinpanel237/blodoc',
    license: 'MIT License',
  },
  obsidian: {
    postsDir: 'contents/posts',
    assetsDir: 'contents/assets',
  },
  // 통계 및 수집 기능 활성화/비활성화 스위치 (On/Off)
  analytics: {
    enabled: false, // true로 설정 시 방문자 수 및 통계 수집 활성화
  },
};

export type SiteConfig = typeof siteConfig;
