import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kingsfoilhealth.com', // Replace with actual domain
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname.replace(/\/$/, '') || '/';

        // Homepage — highest priority
        if (path === '/') {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }
        // Pillar articles — deep hub content
        if (path.startsWith('/learn/pillars/')) {
          return { ...item, priority: 0.9, changefreq: 'monthly' };
        }
        // Top-level marketing pages
        if (['/solutions', '/brokerage', '/about', '/learn', '/partners', '/talk-to-us'].includes(path)) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        // Learning track indexes and resources
        if (['/learn/business-case', '/learn/hr-playbook', '/learn/resources'].includes(path)) {
          return { ...item, priority: 0.7, changefreq: 'monthly' };
        }
        // Legal pages — rarely change, low SEO priority
        if (['/privacy', '/terms'].includes(path)) {
          return { ...item, priority: 0.3, changefreq: 'yearly' };
        }
        // Individual articles (default)
        if (path.startsWith('/learn/')) {
          return { ...item, priority: 0.6, changefreq: 'monthly' };
        }
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
