import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');
const destAssetsDir = path.join(process.cwd(), 'public', 'assets');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.ico']);

/**
 * 디렉터리를 재귀적으로 순회하며 이미지 파일들을 destAssetsDir로 복사합니다.
 * content/assets/my-post/photo.png -> public/assets/my-post/photo.png
 * content/posts/my-post/photo.png  -> public/assets/my-post/photo.png
 */
export function copyAssets() {
  if (!fs.existsSync(contentDir)) {
    console.log('No content directory found. Skipping asset copy.');
    return;
  }

  if (!fs.existsSync(destAssetsDir)) {
    fs.mkdirSync(destAssetsDir, { recursive: true });
  }

  let count = 0;

  function processDirectory(currentDir, relativeSubPath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        processDirectory(fullPath, path.join(relativeSubPath, entry.name));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.has(ext)) {
          // content/assets/... 또는 content/posts/my-post/... 형태에 따라 대상 경로 설정
          let relativeDest = path.join(relativeSubPath, entry.name);

          // 'assets' 또는 'posts' 접두어 제거 (경로 깔끔하게 처리)
          if (relativeDest.startsWith('assets' + path.sep)) {
            relativeDest = relativeDest.substring(7);
          } else if (relativeDest.startsWith('posts' + path.sep)) {
            relativeDest = relativeDest.substring(6);
          }

          const targetPath = path.join(destAssetsDir, relativeDest);
          const targetDir = path.dirname(targetPath);

          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          fs.copyFileSync(fullPath, targetPath);
          count++;
        }
      }
    }
  }

  processDirectory(contentDir);
  console.log(`✅ Successfully copied ${count} image asset(s) to public/assets (including subdirectories)`);
}

// Run if called directly
if (process.argv[1]?.includes('copy-assets')) {
  copyAssets();
}
