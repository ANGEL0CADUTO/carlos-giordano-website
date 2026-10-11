"use client";

import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import { Instagram } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useLanguage } from '../lib/i18n';

type IubendaApi = {
  getPreferences?: () => IubendaPreferences | undefined;
  openPreferences?: () => void;
  showBanner?: () => void;
};

type IubendaPreferences = {
  cons?: unknown;
  timestamp?: string;
};

function getIubendaApi(): IubendaApi | undefined {
  return (window as typeof window & {
    _iub?: { cs?: { api?: IubendaApi } };
  })._iub?.cs?.api;
}

function hasExpressedCookiePreference(preferences: IubendaPreferences | undefined) {
  return Boolean(preferences?.timestamp && preferences.cons);
}

export default function Layout() {
  const { pathname } = useLocation();
  const { language, t } = useLanguage();
  const footerPrimaryLinks = [
    { path: '/opere', label: t('nav.works') },
    { path: '/chi-sono', label: t('nav.about') },
    { path: '/mostre', label: t('nav.exhibitions') },
    { path: '/dicono-di-me', label: t('nav.press') },
    { path: '/news', label: t('nav.news') },
    { path: '/contatti', label: t('nav.contact') },
  ];
  const footerArtworkLinks = [
    { path: '/opere/figura-umana', label: language === 'en' ? 'Human Figure' : 'Figura Umana' },
    { path: '/opere/still-life', label: 'Still Life' },
    { path: '/opere/misteri-marini', label: language === 'en' ? 'Marine Mysteries' : 'Misteri Marini' },
    { path: '/opere/astratti', label: language === 'en' ? 'Abstracts' : 'Astratti' },
    { path: '/opere/paesaggi', label: language === 'en' ? 'Landscapes' : 'Paesaggi' },
  ];

  function openIubendaPreferences() {
    const iubendaApi = getIubendaApi();

    if (iubendaApi?.openPreferences) {
      iubendaApi.openPreferences();
      return;
    }

    const initializedPreferenceLink = document.querySelector<HTMLElement>(
      'body > .iubenda-cs-preferences-link[data-iub-enabled="1"]',
    );

    initializedPreferenceLink?.click();
  }

  function openCookiePreferences(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    openIubendaPreferences();
  }

  useEffect(() => {
    if (pathname === '/mostre' && window.sessionStorage.getItem('carlos-giordano-mostre-scroll')) {
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let attempts = 0;

    const ensureCookieBanner = window.setInterval(() => {
      attempts += 1;
      const iubendaApi = getIubendaApi();

      if (iubendaApi?.getPreferences && iubendaApi.showBanner) {
        try {
          const preferences = iubendaApi.getPreferences();

          if (!hasExpressedCookiePreference(preferences)) {
            iubendaApi.showBanner();
          }

          window.clearInterval(ensureCookieBanner);
          return;
        } catch {
          // Iubenda may expose the API shortly before preferences are ready.
        }
      }

      if (attempts >= 40) {
        window.clearInterval(ensureCookieBanner);
      }
    }, 250);

    return () => window.clearInterval(ensureCookieBanner);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-ink selection:text-paper">
      <Navbar />
      <main>
        <Outlet />
      </main>

      <footer id="site-footer" className="mt-32 scroll-mt-24 border-t border-stone/30 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(220px,auto)_auto] md:items-start">
          <div className="max-w-xl">
            <h2 className="mb-4 font-serif text-2xl uppercase tracking-widest">Carlos Giordano Giroldi</h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {t('footer.description')}
            </p>
          </div>

          <nav aria-label={language === 'en' ? 'Footer navigation' : 'Navigazione footer'} className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2 md:text-left">
            <div>
              <h3 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted">
                {language === 'en' ? 'Explore' : 'Esplora'}
              </h3>
              <ul className="space-y-3">
                {footerPrimaryLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="transition-opacity hover:opacity-65">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-[11px] uppercase tracking-[0.22em] text-muted">
                {language === 'en' ? 'Works' : 'Opere'}
              </h3>
              <ul className="space-y-3">
                {footerArtworkLinks.map((category) => (
                  <li key={category.path}>
                    <Link to={category.path} className="transition-opacity hover:opacity-65">
                      {category.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/opere/video" className="transition-opacity hover:opacity-65">
                    {t('videos.title')}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="flex flex-col items-start gap-3 text-sm md:items-end md:text-right">
            <a href="mailto:hello@example.com" className="transition-opacity hover:opacity-65">hello@example.com</a>
            <a
              href="https://example.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-65 md:justify-end"
            >
              <Instagram size={15} strokeWidth={1.8} aria-hidden="true" />
              <span>Instagram</span>
            </a>
            <a
              href="https://example.com"
              target="_blank"
              rel="noreferrer"
              className="transition-opacity hover:opacity-65"
              title="Privacy Policy"
            >
              {t('footer.privacyPolicy')}
            </a>
            <a
              href="https://example.com"
              target="_blank"
              rel="noreferrer"
              className="transition-opacity hover:opacity-65"
              title="Cookie Policy"
            >
              {t('footer.cookiePolicy')}
            </a>
            <a
              href="#"
              className="iubenda-cs-preferences-link transition-opacity hover:opacity-65"
              onClick={openCookiePreferences}
            >
              {t('footer.cookiePreferences')}
            </a>
            <span className="pt-3 text-muted">&copy; {new Date().getFullYear()} {t('footer.rights')}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
