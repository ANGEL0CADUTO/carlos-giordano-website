import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';
import {
  absoluteUrl,
  createSeoHeadMarkup,
  getStaticSeoRoutes,
  managedSeoEnd,
  managedSeoStart,
  siteName,
} from '../src/lib/seo.ts';

const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');
// Omit lastmod until a verified per-page content modification date is available.

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function injectSeoHead(html: string, seoHead: string) {
  const managedBlockPattern = new RegExp(
    String.raw`\s*${managedSeoStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\s\S]*?${managedSeoEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
  );

  if (managedBlockPattern.test(html)) {
    return html.replace(managedBlockPattern, '\n' + seoHead);
  }

  return html.replace('</head>', seoHead + '\n  </head>');
}

function outputPathForRoute(pathname: string) {
  if (pathname === '/') return indexPath;

  return path.join(distDir, pathname.slice(1), 'index.html');
}

function writeRouteHtml(baseHtml: string, renderPage: (pathname: string) => string) {
  const routes = getStaticSeoRoutes();

  routes.forEach(({ pathname, seo }) => {
    const routeOutputPath = outputPathForRoute(pathname);
    const routeHtml = injectSeoHead(baseHtml, createSeoHeadMarkup(seo)).replace('<div id="root"></div>', () => '<div id="root">' + renderPage(pathname) + '</div>');

    mkdirSync(path.dirname(routeOutputPath), { recursive: true });
    writeFileSync(routeOutputPath, routeHtml);
  });
}

function writeSitemap() {
  const routes = getStaticSeoRoutes();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
    ...routes.map(({ seo }) => {
      const images = (seo.images || [])
        .slice(0, 20)
        .map((image) => {
          const imageLines = [
            '    <image:image>',
            `      <image:loc>${xmlEscape(absoluteUrl(image.url))}</image:loc>`,
            image.title ? `      <image:title>${xmlEscape(image.title)}</image:title>` : '',
            image.caption ? `      <image:caption>${xmlEscape(image.caption)}</image:caption>` : '',
            '    </image:image>',
          ].filter(Boolean);

          return imageLines.join('\n');
        })
        .join('\n');
      const videoEntries = (seo.videos || [])
        .slice(0, 20)
        .map((video) => {
          return [
            '    <video:video>',
            `      <video:thumbnail_loc>${xmlEscape(absoluteUrl(video.thumbnail))}</video:thumbnail_loc>`,
            `      <video:title>${xmlEscape(video.title.slice(0, 100))}</video:title>`,
            `      <video:description>${xmlEscape(video.description)}</video:description>`,
            video.contentUrl
              ? `      <video:content_loc>${xmlEscape(video.contentUrl)}</video:content_loc>`
              : `      <video:player_loc>${xmlEscape(video.playerUrl)}</video:player_loc>`,
            '    </video:video>',
          ].join('\n');
        })
        .join('\n');

      return [
        '  <url>',
        `    <loc>${xmlEscape(absoluteUrl(seo.pathname))}</loc>`,
        images,
        videoEntries,
        '  </url>',
      ].filter(Boolean).join('\n');
    }),
    '</urlset>',
  ].join('\n');

  writeFileSync(path.join(distDir, 'sitemap.xml'), xml + '\n');
}

function writeRobots() {
  const robots = [
    `# ${siteName}`,
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
  ].join('\n');

  writeFileSync(path.join(distDir, 'robots.txt'), robots + '\n');
}

const baseHtml = readFileSync(indexPath, 'utf8');

const server = await createServer({ mode: 'production', server: { middlewareMode: true }, appType: 'custom' });
try {
  const { renderPage } = await server.ssrLoadModule('/scripts/render-pages.tsx');
  writeRouteHtml(baseHtml, renderPage);
  writeSitemap();
  writeRobots();
} finally {
  await server.close();
}
