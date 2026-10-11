import { artworkCategories, type ArtworkCategory } from '../data/artworkCategories';
import { exhibitions, type Exhibition } from '../data/exhibitions';
import { newsArticles } from '../data/news';
import { videos } from '../data/videos';

export const siteUrl = 'https://example.com';
export const siteName = 'Carlos Giordano Giroldi';
export const defaultImagePath = '/demo/scene-4.svg';
export const artistProfileImagePath = '/demo/scene-1.svg';
export const googleVerificationCode = '-bmfMiavfCtbFQflREnqsY9fm-2U6MMOmrNnpq8lZOs';
export const managedSeoStart = '<!-- SEO_PRIMARY_START -->';
export const managedSeoEnd = '<!-- SEO_PRIMARY_END -->';

const defaultDescription =
  'Sito ufficiale di Carlos Giordano Giroldi: opere, acquerelli, inchiostri, mostre, testi critici e contatti dello studio a Milano.';

const defaultRobots = 'noindex,nofollow';

export type JsonLd = Record<string, unknown>;

export type SeoRoute = {
  pathname: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  robots?: string;
  jsonLd?: JsonLd[];
  images?: Array<{ url: string; title?: string; caption?: string }>;
  videos?: Array<{ title: string; description: string; thumbnail: string; playerUrl: string; contentUrl?: string }>;
};

export type StaticSeoRoute = {
  pathname: string;
  seo: SeoRoute;
};

function trimDescription(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) return normalized;

  return normalized.slice(0, maxLength - 1).replace(/\s+\S*$/, '') + '…';
}

export function normalizePathname(pathname: string) {
  const withoutQuery = pathname.split('?')[0].split('#')[0] || '/';
  const normalized = withoutQuery.startsWith('/') ? withoutQuery : '/' + withoutQuery;

  if (normalized === '/') return '/';

  return normalized.replace(/\/+$/, '');
}

export function absoluteUrl(pathname = '/') {
  return new URL(pathname, siteUrl).href;
}

function imageUrl(pathname?: string) {
  return absoluteUrl(pathname || defaultImagePath);
}

function artistJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absoluteUrl('/#carlos-giordano-giroldi'),
    name: 'Carlos Giordano Giroldi',
    alternateName: 'Carlos Giordano',
    jobTitle: 'Pittore contemporaneo',
    description:
      'Pittore contemporaneo argentino con studio a Milano, attivo tra figura umana, still life, paesaggio, astrazione e acquerello.',
    url: absoluteUrl('/'),
    image: imageUrl(artistProfileImagePath),
    email: 'mailto:hello@example.com',
    sameAs: ['https://example.com'],
    knowsAbout: [
      'acquerello',
      'inchiostro su carta',
      'arte contemporanea',
      'figura umana',
      'still life',
      'paesaggio',
      'astrazione',
    ],
    homeLocation: {
      '@type': 'Place',
      name: 'Milano, Italia',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Via G. Biancardi 2',
        postalCode: '20149',
        addressLocality: 'Milano',
        addressRegion: 'MI',
        addressCountry: {
          '@type': 'Country',
          name: 'IT',
        },
      },
    },
  };
}

function webSiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: siteName,
    url: absoluteUrl('/'),
    inLanguage: 'it-IT',
    publisher: { '@id': absoluteUrl('/#carlos-giordano-giroldi') },
  };
}

function webPageJsonLd(seo: SeoRoute, pageType = 'WebPage'): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': pageType,
    '@id': absoluteUrl(seo.pathname) + '#webpage',
    url: absoluteUrl(seo.pathname),
    name: seo.title,
    description: seo.description,
    inLanguage: 'it-IT',
    isPartOf: { '@id': absoluteUrl('/#website') },
    about: { '@id': absoluteUrl('/#carlos-giordano-giroldi') },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: imageUrl(seo.image),
    },
  };
}

function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function collectionItemList(items: Array<{ name: string; path: string; image?: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
      image: item.image ? imageUrl(item.image) : undefined,
    })),
  };
}

function visualArtworkList(category: ArtworkCategory): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: category.artworks.slice(0, 24).map((artwork, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'VisualArtwork',
        name: artwork.title,
        creator: { '@id': absoluteUrl('/#carlos-giordano-giroldi') },
        artMedium: artwork.medium,
        dateCreated: artwork.year,
        image: imageUrl(artwork.src),
        url: absoluteUrl(`/opere/${category.id}?artwork=${encodeURIComponent(artwork.src)}`),
      },
    })),
  };
}

function exhibitionSummary(exhibition: Exhibition) {
  const intro = exhibition.paragraphs[0] || exhibition.type || 'Mostra di Carlos Giordano Giroldi.';

  return trimDescription(`${exhibition.title}, ${exhibition.year}. ${intro}`, 155);
}

function homeSeo(): SeoRoute {
  const seo: SeoRoute = {
    pathname: '/',
    title: 'Carlos Giordano Giroldi | Pittore contemporaneo a Milano',
    description: defaultDescription,
    image: defaultImagePath,
    jsonLd: [],
    images: [{ url: defaultImagePath, title: siteName }],
  };

  seo.jsonLd = [artistJsonLd(), webSiteJsonLd(), webPageJsonLd(seo)];
  return seo;
}

function worksSeo(): SeoRoute {
  const topLevelCategories = artworkCategories.filter((category) => !category.parentId);
  const seo: SeoRoute = {
    pathname: '/opere',
    title: 'Opere | Carlos Giordano Giroldi',
    description:
      'Catalogo delle opere di Carlos Giordano Giroldi: figura umana, still life, misteri marini, astratti, paesaggi e video.',
    image: artworkCategories[0]?.cover || defaultImagePath,
    jsonLd: [],
    images: topLevelCategories.map((category) => ({ url: category.cover, title: category.name })),
  };

  seo.jsonLd = [
    webPageJsonLd(seo, 'CollectionPage'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Opere', path: '/opere' },
    ]),
    collectionItemList([
      ...topLevelCategories.map((category) => ({
        name: category.name,
        path: `/opere/${category.id}`,
        image: category.cover,
      })),
      { name: 'Video', path: '/opere/video', image: videos[0]?.thumbnail },
    ]),
  ];
  return seo;
}

function categorySeo(category: ArtworkCategory): SeoRoute {
  const parent = artworkCategories.find((item) => item.id === category.parentId);
  const children = artworkCategories.filter((item) => item.parentId === category.id);
  const artworkCount = category.artworks.length + children.reduce((count, child) => count + child.artworks.length, 0);
  const seo: SeoRoute = {
    pathname: `/opere/${category.id}`,
    title: `${category.name} | Opere di Carlos Giordano Giroldi`,
    description: trimDescription(`${category.description} Selezione di ${artworkCount} opere di Carlos Giordano Giroldi.`),
    image: category.cover,
    jsonLd: [],
    images: category.artworks.slice(0, 12).map((artwork) => ({ url: artwork.src, title: artwork.title })),
  };

  seo.jsonLd = [
    webPageJsonLd(seo, 'CollectionPage'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Opere', path: '/opere' },
      ...(parent ? [{ name: parent.name, path: `/opere/${parent.id}` }] : []),
      { name: category.name, path: `/opere/${category.id}` },
    ]),
    visualArtworkList(category),
    ...(children.length ? [collectionItemList(children.map((child) => ({
      name: child.name,
      path: `/opere/${child.id}`,
      image: child.cover,
    })))] : []),
  ];
  return seo;
}

function videosSeo(): SeoRoute {
  const seo: SeoRoute = {
    pathname: '/opere/video',
    title: 'Video | Carlos Giordano Giroldi',
    description:
      'Video, interviste, documenti di mostra e materiali sul processo artistico di Carlos Giordano Giroldi.',
    image: videos[0]?.thumbnail || defaultImagePath,
    jsonLd: [],
    images: videos.slice(0, 8).map((video) => ({ url: video.thumbnail, title: video.title })),
    videos: videos.map((video) => ({
      title: video.title,
      description: `Video e materiali d'archivio sul lavoro artistico di Carlos Giordano Giroldi: ${video.title}.`,
      thumbnail: video.thumbnail,
      playerUrl: absoluteUrl(video.embedUrl),
      contentUrl: video.sourceUrl ? absoluteUrl(video.sourceUrl) : undefined,
    })),
  };

  seo.jsonLd = [
    webPageJsonLd(seo, 'CollectionPage'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Opere', path: '/opere' },
      { name: 'Video', path: '/opere/video' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: videos.map((video, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: video.title,
          image: imageUrl(video.thumbnail),
          url: absoluteUrl(video.embedUrl),
          publisher: { '@id': absoluteUrl('/#carlos-giordano-giroldi') },
        },
      })),
    },
  ];
  return seo;
}

function aboutSeo(): SeoRoute {
  const seo: SeoRoute = {
    pathname: '/chi-sono',
    title: 'Biografia | Carlos Giordano Giroldi',
    description:
      'Biografia di Carlos Giordano Giroldi: formazione a Buenos Aires, New York e Parigi, studio a Milano e collezioni internazionali.',
    image: artistProfileImagePath,
    type: 'profile',
    jsonLd: [],
    images: [{ url: artistProfileImagePath, title: 'Carlos Giordano Giroldi' }],
  };

  const artist = artistJsonLd();
  const profilePage = {
    ...webPageJsonLd(seo, 'ProfilePage'),
    mainEntity: artist,
  };

  seo.jsonLd = [
    artist,
    profilePage,
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Biografia', path: '/chi-sono' },
    ]),
  ];
  return seo;
}

function exhibitionsSeo(): SeoRoute {
  const seo: SeoRoute = {
    pathname: '/mostre',
    title: 'Mostre | Carlos Giordano Giroldi',
    description:
      'Archivio delle mostre di Carlos Giordano Giroldi: esposizioni personali, collettive, immagini, testi critici e materiali video.',
    image: exhibitions[0]?.image || defaultImagePath,
    jsonLd: [],
    images: exhibitions.slice(0, 12).map((exhibition) => ({ url: exhibition.image, title: exhibition.title })),
  };

  seo.jsonLd = [
    webPageJsonLd(seo, 'CollectionPage'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Mostre', path: '/mostre' },
    ]),
    collectionItemList(
      exhibitions.map((exhibition) => ({
        name: `${exhibition.title} (${exhibition.year})`,
        path: `/mostre/${exhibition.slug}`,
        image: exhibition.image,
      })),
    ),
  ];
  return seo;
}

function exhibitionSeo(exhibition: Exhibition): SeoRoute {
  const seo: SeoRoute = {
    pathname: `/mostre/${exhibition.slug}`,
    title: `${exhibition.title} | Mostra ${exhibition.year} | Carlos Giordano`,
    description: exhibitionSummary(exhibition),
    image: exhibition.image,
    type: 'article',
    jsonLd: [],
    images: [
      { url: exhibition.image, title: exhibition.title },
      ...(exhibition.gallery || []).slice(0, 8).map((image) => ({ url: image, title: exhibition.title })),
    ],
  };

  seo.jsonLd = [
    webPageJsonLd(seo),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Mostre', path: '/mostre' },
      { name: exhibition.title, path: `/mostre/${exhibition.slug}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': absoluteUrl(`/mostre/${exhibition.slug}`) + '#exhibition',
      name: exhibition.title,
      dateCreated: exhibition.year,
      description: seo.description,
      image: imageUrl(exhibition.image),
      creator: { '@id': absoluteUrl('/#carlos-giordano-giroldi') },
      locationCreated: exhibition.location,
    },
  ];
  return seo;
}

function pressSeo(): SeoRoute {
  const seo: SeoRoute = {
    pathname: '/dicono-di-me',
    title: 'Dicono di me | Testi critici su Carlos Giordano',
    description:
      'Testi critici, rassegna stampa e contributi storico-artistici sul lavoro di Carlos Giordano Giroldi.',
    image: '/demo/scene-4.svg',
    jsonLd: [],
    images: [{ url: '/demo/scene-4.svg', title: 'Sublimi Contrasti' }],
  };

  seo.jsonLd = [
    webPageJsonLd(seo, 'CollectionPage'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Dicono di me', path: '/dicono-di-me' },
    ]),
  ];
  return seo;
}

function newsSeo(): SeoRoute {
  const seo: SeoRoute = {
    pathname: '/news',
    title: 'News | Carlos Giordano Giroldi',
    description:
      'News dallo studio di Carlos Giordano Giroldi: nuove opere, mostre, archivio, video e riflessioni sul mondo dell’arte.',
    image: newsArticles[0]?.image || defaultImagePath,
    type: 'article',
    jsonLd: [],
    images: newsArticles.slice(0, 8).map((article) => ({ url: article.image, title: article.title })),
  };

  seo.jsonLd = [
    webPageJsonLd(seo, 'CollectionPage'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'News', path: '/news' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: newsArticles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: article.title,
          description: article.excerpt,
          image: imageUrl(article.image),
          creator: { '@id': absoluteUrl('/#carlos-giordano-giroldi') },
        },
      })),
    },
  ];
  return seo;
}

function contactSeo(): SeoRoute {
  const seo: SeoRoute = {
    pathname: '/contatti',
    title: 'Contatti | Studio Carlos Giordano Giroldi a Milano',
    description:
      'Contatta lo studio di Carlos Giordano Giroldi a Milano per informazioni su opere disponibili, mostre e collaborazioni.',
    image: artistProfileImagePath,
    jsonLd: [],
    images: [{ url: artistProfileImagePath, title: siteName }],
  };

  seo.jsonLd = [
    webPageJsonLd(seo, 'ContactPage'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Contatti', path: '/contatti' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPoint',
      contactType: 'studio',
      email: 'hello@example.com',
      areaServed: 'IT',
      availableLanguage: ['Italian', 'English'],
    },
  ];
  return seo;
}

export function getStaticSeoRoutes(): StaticSeoRoute[] {
  return [
    { pathname: '/', seo: homeSeo() },
    { pathname: '/opere', seo: worksSeo() },
    ...artworkCategories.map((category) => ({ pathname: `/opere/${category.id}`, seo: categorySeo(category) })),
    { pathname: '/opere/video', seo: videosSeo() },
    { pathname: '/chi-sono', seo: aboutSeo() },
    { pathname: '/mostre', seo: exhibitionsSeo() },
    ...exhibitions.map((exhibition) => ({ pathname: `/mostre/${exhibition.slug}`, seo: exhibitionSeo(exhibition) })),
    { pathname: '/dicono-di-me', seo: pressSeo() },
    { pathname: '/news', seo: newsSeo() },
    { pathname: '/contatti', seo: contactSeo() },
  ];
}

export function getSeoForPath(pathname: string): SeoRoute {
  const normalized = normalizePathname(pathname);
  const route = getStaticSeoRoutes().find((item) => item.pathname === normalized);

  if (route) return route.seo;

  return {
    pathname: normalized,
    title: 'Pagina non trovata | Carlos Giordano Giroldi',
    description: defaultDescription,
    image: defaultImagePath,
    robots: 'noindex,follow',
    jsonLd: [webSiteJsonLd()],
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeJson(value: JsonLd) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function createSeoHeadMarkup(seo: SeoRoute, indent = '    ') {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = escapeHtml(absoluteUrl(seo.pathname));
  const socialImage = escapeHtml(imageUrl(seo.image));
  const robots = escapeHtml(seo.robots || defaultRobots);
  const ogType = seo.type === 'profile' ? 'profile' : seo.type === 'article' ? 'article' : 'website';
  const jsonLd = seo.jsonLd || [];
  const lines = [
    managedSeoStart,
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" data-seo-managed="true" />`,
    `<meta name="robots" content="${robots}" data-seo-managed="true" />`,
    `<link rel="canonical" href="${canonical}" data-seo-managed="true" />`,
    `<meta property="og:locale" content="it_IT" data-seo-managed="true" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" data-seo-managed="true" />`,
    `<meta property="og:type" content="${ogType}" data-seo-managed="true" />`,
    `<meta property="og:url" content="${canonical}" data-seo-managed="true" />`,
    `<meta property="og:title" content="${title}" data-seo-managed="true" />`,
    `<meta property="og:description" content="${description}" data-seo-managed="true" />`,
    `<meta property="og:image" content="${socialImage}" data-seo-managed="true" />`,
    `<meta property="og:image:width" content="1200" data-seo-managed="true" />`,
    `<meta property="og:image:height" content="630" data-seo-managed="true" />`,
    `<meta name="twitter:card" content="summary_large_image" data-seo-managed="true" />`,
    `<meta name="twitter:title" content="${title}" data-seo-managed="true" />`,
    `<meta name="twitter:description" content="${description}" data-seo-managed="true" />`,
    `<meta name="twitter:image" content="${socialImage}" data-seo-managed="true" />`,
    ...jsonLd.map(
      (schema, index) =>
        `<script type="application/ld+json" data-seo-jsonld="${index}">${safeJson(schema)}</script>`,
    ),
    managedSeoEnd,
  ];

  return lines.map((line) => indent + line).join('\n');
}
