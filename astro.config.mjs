import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4321 },
});
