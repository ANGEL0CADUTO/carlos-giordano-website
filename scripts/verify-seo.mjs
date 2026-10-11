import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]));
assert.equal(urls.length, 32, 'Preserve all published routes, including Botaniche');
assert.equal(new Set(urls.map(u => u.pathname)).size, urls.length);
assert(!sitemap.includes('<lastmod>'), 'Do not claim every page was updated on every build');
const paths = new Set(urls.map(u => u.pathname));
let checkedImages = 0;
for (const url of urls) {
  const file = path.join('dist', url.pathname === '/' ? 'index.html' : url.pathname.slice(1) + '/index.html');
  const html = readFileSync(file, 'utf8');
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${url}: exactly one primary heading`);
  assert(html.includes(`<link rel="canonical" href="${url.href}"`), `${url}: canonical`);
  assert(!html.includes('<div id="root"></div>'), `${url}: rendered content`);
  assert(!html.includes('opacity:0;') && !html.includes('opacity:0"'), `${url}: content must be visible without JS`);
  for (const [, source] of html.matchAll(/<img[^>]*src="([^"]+)"/g)) {
    if (!source.startsWith('/')) continue;
    assert(existsSync(path.join('dist', decodeURIComponent(source.replaceAll('&amp;', '&').split('?')[0]))), `${url}: missing image ${source}`);
    checkedImages++;
  }
  for (const [, href] of html.matchAll(/<a[^>]*href="([^"]+)"/g)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = new URL(href.replaceAll('&amp;', '&'), url);
    assert(paths.has(target.pathname) || existsSync(path.join('dist', decodeURIComponent(target.pathname))), `${url}: broken link ${href}`);
  }
}
console.log(`SEO checks passed: ${urls.length} pages, ${checkedImages} image references, canonical URLs, headings and internal links.`);
