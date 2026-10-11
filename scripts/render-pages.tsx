import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../src/lib/i18n';
import SiteRoutes from '../src/SiteRoutes';

export function renderPage(pathname: string) {
  const markup = renderToString(
    <LanguageProvider>
      <MemoryRouter initialEntries={[pathname]}>
        <SiteRoutes />
      </MemoryRouter>
    </LanguageProvider>,
  );
  if (!markup.includes('<h1')) throw new Error(`Missing primary heading: ${pathname}`);
  return markup;
}
