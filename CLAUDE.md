# Kingsfoil Health Website — Developer Notes

## Google Analytics
- **Measurement ID:** `G-FDEL3LJJM9`
- The GA4 tag is in `src/layouts/BaseLayout.astro` inside `<head>`
- All pages use `BaseLayout.astro` (directly or via `ArticleLayout.astro`), so GA is automatically included
- **If you create a new layout that does NOT extend BaseLayout, you MUST add the GA4 snippet to its `<head>`**

## Lead Magnets
- PDFs live in `public/downloads/` (served as static assets)
- Gated landing pages live in `src/pages/learn/resources/` (e.g., `rate-shock.astro`)
- Thank-you pages auto-start the PDF download via JS and provide a manual download button
- Form submissions go through **Netlify Forms** (`data-netlify="true"`) with honeypot spam protection
- Each lead magnet form has a hidden `resource` field for filtering submissions in Netlify
- Form `action` points to the corresponding thank-you page (e.g., `/learn/resources/rate-shock-thank-you`)
- **Standard form fields:** first name, last name, work email, company name, team size (dropdown)
- Add CTA banners in related articles as blockquotes linking to the landing page
