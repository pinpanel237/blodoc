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
    postsDir: 'content/posts',
    assetsDir: 'content/assets',
  },
};

export type SiteConfig = typeof siteConfig;
