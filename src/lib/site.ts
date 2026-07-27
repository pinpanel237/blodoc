/**
 * 개발 환경(Development)과 운영 환경(Production)을 자동 감지하여
 * 알맞은 사이트 도메인 URL을 반환하는 유틸리티
 */
export function getSiteUrl(): string {
  // 1. 명시적 환경 변수가 설정된 경우 최우선 사용
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 2. Vercel 배포 자동 주소 (운영 배포 시 Vercel이 기본 제공)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // 3. NODE_ENV 분기: 개발(a) vs 운영(b)
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // [a] 개발 환경 기본 주소
    return 'http://localhost:3000';
  }

  // [b] 운영 환경 기본 주소 (기본값)
  return 'https://blodoc.vercel.app';
}
