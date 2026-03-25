import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kingsfoilhealth.com', // Replace with actual domain
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
