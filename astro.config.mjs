// @ts-check
// Astro settings. The only thing you'll likely change here is `site`
// once you have a domain (e.g. 'https://leahhomanart.com').
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://leahhomanart.netlify.app',
  output: 'static',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});
