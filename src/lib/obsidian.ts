/**
 * Obsidian 마크다운 특화 문법 (Wikilinks, Callouts, Image Embeds) 파싱 헬퍼
 */

export function parseObsidianMarkdown(markdown: string): string {
  if (!markdown) return '';

  let parsed = markdown;

  // 1. Obsidian Embed Image: ![[subfolder/image.png]] 또는 ![[image.png]]
  parsed = parsed.replace(/!\[\[(.*?)\]\]/g, (match, imagePath) => {
    const cleanPath = imagePath.trim().replace(/^assets\//, '');
    const fileName = cleanPath.split('/').pop() || cleanPath;
    return `![${fileName}](/assets/${cleanPath})`;
  });

  // 2. Standard Markdown Relative Image Paths: ![](assets/subfolder/image.png), !(./image.png), ![](image.png)
  parsed = parsed.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, imageSrc) => {
    const trimmedSrc = imageSrc.trim();
    
    // 외부 HTTP/HTTPS 이미지 링크는 그대로 유지
    if (trimmedSrc.startsWith('http://') || trimmedSrc.startsWith('https://')) {
      return match;
    }

    // assets/ 또는 ./ 접두사 제거 후 /assets/ 호스팅 경로로 변환
    let cleanSrc = trimmedSrc.replace(/^\.\//, '').replace(/^assets\//, '');
    if (!cleanSrc.startsWith('/')) {
      cleanSrc = `/assets/${cleanSrc}`;
    }

    return `![${alt}](${cleanSrc})`;
  });

  // 3. Obsidian Wikilinks: [[link-slug]] or [[link-slug|Custom Label]]
  parsed = parsed.replace(/\[\[(.*?)(?:\|(.*?))?\]\]/g, (match, slug, label) => {
    const displayLabel = label ? label.trim() : slug.trim();
    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');
    return `<a href="/posts/${cleanSlug}" class="wikilink">${displayLabel}</a>`;
  });

  // 4. Obsidian Callouts Parsing: > [!type] Header -> Callout Block
  const calloutRegex = /^>\s*\[!(note|warning|tip|important|info|caution|quote)\]\s*(.*)$/gim;
  parsed = parsed.replace(calloutRegex, (match, type, title) => {
    const calloutTitle = title.trim() || type.toUpperCase();
    return `<div class="callout callout-${type.toLowerCase()}"><div class="callout-title"><span class="callout-icon"></span><strong>${calloutTitle}</strong></div><div class="callout-content">`;
  });

  return parsed;
}
