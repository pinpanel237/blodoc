import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'content', 'assets');
const destDir = path.join(process.cwd(), 'public', 'assets');

export function copyAssets() {
  if (!fs.existsSync(srcDir)) {
    console.log('No content/assets directory found. Skipping asset copy.');
    return;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);
  let count = 0;

  files.forEach((file) => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    const stat = fs.statSync(srcFile);
    if (stat.isFile()) {
      fs.copyFileSync(srcFile, destFile);
      count++;
    }
  });

  console.log(`✅ Successfully copied ${count} asset(s) from content/assets -> public/assets`);
}

// Run if called directly
if (process.argv[1]?.includes('copy-assets')) {
  copyAssets();
}
