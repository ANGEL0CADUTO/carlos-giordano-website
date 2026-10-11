import { next } from '@vercel/functions';


export const config = {
  matcher: [
    '/((?!assets/|favicon\\.ico$|favicon\\.png$|og-image\\.png$|robots\\.txt$|sitemap\\.xml$|manifest\\.webmanifest$|.*\\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico|woff|woff2|ttf|otf|css|js|map|json|xml|txt)$).*)',
  ],
};


const canonicalHost = 'carlosgiordano.net';


const legacyHosts = new Set([
  'www.carlosgiordano.net',
  'example.com',
  'example.com',
]);


const realPagePaths = new Set([
  '/',
  '/opere',
  '/opere/figura-umana',
  '/opere/still-life',
  '/opere/still-life/botaniche',
  '/opere/misteri-marini',
  '/opere/astratti',
  '/opere/paesaggi',
  '/opere/video',
  '/chi-sono',
  '/mostre',
  '/mostre/ricordi-di-un-pianeta',
  '/mostre/mostra-padova',
  '/mostre/carla-carlos-una-tecnica-due-visioni',
  '/mostre/fuorisalone-2019',
  '/mostre/welcome',
  '/mostre/metamorfosi',
  '/mostre/sublimi-contrasti',
  '/mostre/con-turbante-ii',
  '/mostre/arte-in-tavola',
  '/mostre/con-turbante',
  '/mostre/i-colori-della-primavera',
  '/mostre/luci-della-natura-ii',
  '/mostre/body-and-soul',
  '/mostre/luci-della-natura',
  '/mostre/sguardi-vegetali',
  '/mostre/arte-e-moda-e-arte',
  '/mostre/sguardi-sul-cinema',
  '/mostre/life-and-still-life',
  '/dicono-di-me',
  '/news',
  '/contatti',
]);


const technicalPaths = new Set([
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/manifest.webmanifest',
  '/demo/scene-4.svg',
  '/robots.txt',
  '/sitemap.xml',
  '/videos/botaniche.mp4',
]);


const legacyRedirects = new Map([
  ['/figura-umana', '/opere/figura-umana'],
  ['/paesaggi', '/opere/paesaggi'],
  ['/still-life', '/opere/still-life'],
  ['/misteri-marini', '/opere/misteri-marini'],
  ['/astratti', '/opere/astratti'],
  ['/video', '/opere/video'],
  ['/en/abstracts', '/opere/astratti'],
  ['/en/still-life', '/opere/still-life'],
  ['/en/marine-mysteries', '/opere/misteri-marini'],
  ['/en/landscapes', '/opere/paesaggi'],
  ['/en/figurative', '/opere/figura-umana'],
  ['/en/human-figure', '/opere/figura-umana'],
  ['/en/opere/night-feather', '/opere'],
]);


const oldWordPressQueryKeys = new Set(['author', 'cat', 'p', 'page_id']);
const viteAssetPattern = /^\/assets\/.+\.(?:css|ico|jpe?g|js|json|png|svg|webp|woff2?)$/i;
const publicImageFilePattern = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;


const publicAssetPrefixes = [
  '/archivio/',
  '/astratti/',
  '/figura%20umana/',
  '/misteri%20marini/',
  '/mostre/',
  '/paesaggi/',
  '/still%20life/',
  '/video-thumbnails/',
];


const topLevelPublicFiles = new Set([
  '/demo/logo.svg',
  '/demo/scene-1.svg',
  '/demo/logo.svg',
  '/demo/scene-4.svg',
]);


function normalizePath(pathname: string) {
  if (pathname === '/') return '/';


  return pathname.replace(/\/+$/, '');
}


function hasOldWordPressQuery(searchParams: URLSearchParams) {
  for (const key of searchParams.keys()) {
    if (oldWordPressQueryKeys.has(key.toLowerCase())) {
      return true;
    }
  }


  return false;
}


function isStaticFileOrAsset(pathname: string) {
  if (technicalPaths.has(pathname)) {
    return true;
  }


  if (viteAssetPattern.test(pathname)) {
    return true;
  }


  if (topLevelPublicFiles.has(pathname)) {
    return true;
  }


  return publicImageFilePattern.test(pathname) && publicAssetPrefixes.some((prefix) => pathname.startsWith(prefix));
}


function redirectTo(url: URL, pathname: string) {
  url.pathname = pathname;


  return Response.redirect(url, 308);
}


function gone() {
  return new Response('Gone', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  });
}


export default function middleware(request: Request) {
  const url = new URL(request.url);


  if (legacyHosts.has(url.hostname)) {
    url.hostname = canonicalHost;


    return Response.redirect(url, 308);
  }


  const pathname = normalizePath(url.pathname);


  if (hasOldWordPressQuery(url.searchParams)) {
    return gone();
  }


  if (url.pathname !== pathname && realPagePaths.has(pathname)) {
    return redirectTo(url, pathname);
  }


  const legacyDestination = legacyRedirects.get(pathname);


  if (legacyDestination) {
    return redirectTo(url, legacyDestination);
  }


  if (realPagePaths.has(pathname) || isStaticFileOrAsset(pathname)) {
    return next();
  }


  return gone();
}
