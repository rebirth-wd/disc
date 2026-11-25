import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/data/site.ts';

export default defineConfig({
  site: site.url,
  // The site uses no sessions; without this the adapter provisions an unused KV namespace on deploy.
  session: false,
  adapter: cloudflare({ imageService: 'compile' }),
  redirects: {
    '/download': { status: 301, destination: '/services' },
    '/nitro': { status: 301, destination: '/plans' },
    '/ads/quests': { status: 301, destination: '/launch' },
  },
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4321 },
});
