# Kingsfoil Health — SEO Checklist

Every new page and article must pass this checklist. Most of it is enforced automatically by `npm run seo:check` (which runs as part of `npm run build`). The rest is editorial — catch it before merge.

## How enforcement works

1. **Build-time validation** (`scripts/seo-validate.mjs`) runs after every `npm run build`. Fails the build on any hard rule violation. Soft rules emit warnings but let the build pass.
2. **Content schema** (`src/content/config.ts`) enforces required article frontmatter at build time via Zod.
3. **Layout defaults** (`src/layouts/BaseLayout.astro`) provide Organization JSON-LD, OG/Twitter tags, theme-color, and viewport on every page that uses the layout. Don't roll your own `<head>`.

## Hard rules (build fails)

Every page must have:

- `<title>` — non-empty (length is a soft rule)
- `<meta name="description">` — non-empty
- `<link rel="canonical">`
- `<meta name="viewport">`
- `<html lang="...">`
- **Exactly one `<h1>`** — no more, no fewer
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`
- Twitter Card tags: `twitter:card`, `twitter:image`
- Organization or InsuranceAgency JSON-LD
- Every `<img>` must have `alt` attribute (empty is allowed for decorative, but prefer descriptive)

## Soft rules (warnings)

- `<title>` length 10–65 characters
- `<meta name="description">` length 50–170 characters (aim for 150–160)
- `og:locale` present
- `BreadcrumbList` JSON-LD on all pages except the homepage

## Adding a new marketing page (`src/pages/foo.astro`)

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Foo', url: '/foo' },
];
---

<BaseLayout
  title="Short, Keyword-Relevant Title | Kingsfoil Health"
  description="Concise 150-160 char description. Leads with the value, includes one or two primary keywords. Reads like prose, not a keyword list."
  canonicalPath="/foo"
  breadcrumbs={breadcrumbs}
>
  <h1>Exactly one H1 per page</h1>
  <!-- ... page content ... -->
</BaseLayout>
```

Rules for marketing pages:
- Use `<Image>` from `astro:assets` for all photos, importing from `@assets/images/` (auto WebP + responsive srcset)
- Logos and decorative SVGs can stay in `public/images/` as plain `<img>`
- Every image needs a **descriptive** alt — not "stock photo," not "image of team"
- Breadcrumbs required on every page except the homepage
- H2/H3 hierarchy must not skip levels

## Adding a new article (`src/content/articles/<cluster>/slug.md`)

Frontmatter is schema-enforced. Required fields:

```yaml
---
title: "Clear, Scannable Title Under 65 Characters"
type: blog
excerpt: "150-300 char summary. This is the meta description and appears on cards. Lead with the payoff."
publishedDate: 2026-04-24
audienceTags: ["Business Leaders"]  # or HR, CFO, All
topicTags: ["Cost Management"]
difficulty: beginner  # beginner | intermediate | advanced
contentCluster: "Premium Costs"  # see config.ts for full list
keywords: ["primary keyword", "secondary keyword"]
keyTakeaways:
  - "Actionable insight 1"
  - "Actionable insight 2"
  - "Actionable insight 3"
faqs:
  - question: "Common question in natural phrasing?"
    answer: "Concise, quotable answer — 2–3 sentences."
relatedArticles:
  - "cluster/other-article-slug"
  - "cluster/another-slug"
---
```

Rules for articles:
- `excerpt` 150–200 chars ideal (also used as meta description)
- 3–6 `keyTakeaways` (build fails if outside range when set)
- 3–5 `faqs` minimum — feeds FAQPage JSON-LD
- At least 2 `relatedArticles` from same or adjacent cluster for internal linking
- Cite specific stats with real sources — see `~/.claude/skills/kh-content-citations/SKILL.md`

## Before pushing

```bash
npm run build        # builds + runs SEO check + sitemap
npm run seo:check    # run validation only (if build already ran)
```

If `seo:check` fails, it prints `/path [ruleName] reason` for each broken page. Fix and re-run.

## Adding a new hard rule

1. Add the check to `scripts/seo-validate.mjs` — keep each rule small and focused
2. Add the rule name to the `RULES` object with severity `'error'` or `'warn'`
3. Update this checklist to document it
4. Run `npm run seo:check` to catch any existing pages that would fail — fix them before pushing

## What intentionally doesn't enforce

- 404 page (`/404`) — shouldn't be indexed
- Post-conversion thank-you pages (e.g., `/learn/resources/rate-shock-thank-you`) — should have `noindex` meta
- Admin routes (`/admin/*`) — blocked in `robots.txt`

These are listed in `EXEMPT_PATHS` inside the validator. Add new exemptions there with a comment explaining why.
