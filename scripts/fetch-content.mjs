import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * 환경 변수 CONTENT_GIT_REPO 가 설정되어 있는 경우,
 * 빌드 시점에 원격 Obsidian 마크다운 저장소를 content/ 폴더로 clone 합니다.
 */
const repoUrl = process.env.CONTENT_GIT_REPO;
const contentDir = path.join(process.cwd(), 'content');

if (repoUrl) {
  console.log(`🚀 [fetch-content] 원격 Git 저장소로부터 콘텐츠 다운로드 시도: ${repoUrl}`);

  // 기존 content 폴더가 존재하면 Clean Up
  if (fs.existsSync(contentDir)) {
    console.log('🧹 [fetch-content] 기존 content/ 폴더 정리 중...');
    fs.rmSync(contentDir, { recursive: true, force: true });
  }

  try {
    // 빌드 속도 및 용량 최적화를 위해 --depth 1 사용
    execSync(`git clone --depth 1 ${repoUrl} "${contentDir}"`, { stdio: 'inherit' });
    console.log('✅ [fetch-content] 원격 콘텐츠 저장소 동기화 완료!');
  } catch (error) {
    console.error('❌ [fetch-content] 원격 Git 저장소 Clone 실패:', error);
    process.exit(1);
  }
} else {
  console.log('ℹ️ [fetch-content] CONTENT_GIT_REPO 환경 변수가 없습니다. 로컬 content/ 폴더를 유지합니다.');
}
