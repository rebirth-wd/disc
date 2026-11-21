import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rebirthwebdesign.com.au',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4321 },
});
