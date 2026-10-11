import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { JsonLd } from '../lib/seo';
import { useLanguage } from '../lib/i18n';


const siteName = 'Carlos Giordano Giroldi';

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  element.setAttribute('data-seo-managed', 'true');
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  element.setAttribute('data-seo-managed', 'true');
}

function renderJsonLd(jsonLd: JsonLd[]) {
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((element) => element.remove());

  jsonLd.forEach((schema, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-jsonld', String(index));
    script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c');
    document.head.appendChild(script);
  });
}

export default function Seo() {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    let isCurrent = true;

    import('../lib/seo').then(({ absoluteUrl, getSeoForPath }) => {
      if (!isCurrent) return;

      const seo = getSeoForPath(location.pathname);
      const canonical = absoluteUrl(seo.pathname);
      const image = absoluteUrl(seo.image || '/demo/scene-4.svg');
      const robots = seo.robots || 'noindex,nofollow';
      const ogType = seo.type === 'profile' ? 'profile' : seo.type === 'article' ? 'article' : 'website';

      document.documentElement.lang = language;
      document.title = seo.title;


      upsertMeta('meta[name="description"]', { name: 'description', content: seo.description });
      upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
      upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });

      upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: language === 'en' ? 'en_US' : 'it_IT' });
      upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteName });
      upsertMeta('meta[property="og:type"]', { property: 'og:type', content: ogType });
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
      upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
      upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
      upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
      upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });

      upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
      upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
      upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

      renderJsonLd(seo.jsonLd || []);
    });

    return () => {
      isCurrent = false;
    };
  }, [language, location.pathname]);

  return null;
}
