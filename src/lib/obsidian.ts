/**
 * Obsidian 마크다운 특화 문법 (Wikilinks, Callouts, Image Embeds) 파싱 헬퍼
 */

export function parseObsidianMarkdown(markdown: string): string {
  if (!markdown) return '';

  let parsed = markdown;

  // 1. Obsidian Embed Image: ![[image.png]] -> ![](assets/image.png)
  parsed = parsed.replace(/!\[\[(.*?)\]\]/g, (match, imageName) => {
    const cleanName = imageName.trim();
    return `![${cleanName}](/assets/${cleanName})`;
  });

  // 2. Standard Obsidian Image relative path: ![](assets/image.png) -> ![](/assets/image.png)
  parsed = parsed.replace(/!\[(.*?)\]\(assets\/(.*?)\)/g, (match, alt, filename) => {
    return `![${alt}](/assets/${filename})`;
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
