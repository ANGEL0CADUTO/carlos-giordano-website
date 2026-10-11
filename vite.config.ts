import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const routePreview: Plugin = {
  name: 'prerendered-route-preview',
  configurePreviewServer(server) {
    const dist = resolve(server.config.build.outDir);
    server.middlewares.use((request, _response, next) => {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const candidate = resolve(dist, `.${url.pathname}`, 'index.html');
      if (candidate.startsWith(dist + sep) && existsSync(candidate)) {
        request.url = url.pathname.replace(/\/$/, '') + '/index.html' + url.search;
      }
      next();
    });
  },
};

export default defineConfig({
  publicDir: 'src/public',
  plugins: [react(), tailwindcss(), routePreview],
});
