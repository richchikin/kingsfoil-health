# Kingsfoil Health Website

Production marketing website for Kingsfoil Health. Built with [Astro](https://astro.build), deployed to [Netlify](https://netlify.com).

## What is Astro?

Astro is a static site generator (like Hugo or Eleventy, but more modern). You write pages using `.astro` components (similar to HTML with a few extras), and Astro builds them into plain HTML files. The result is a fast website with zero JavaScript by default.

**Key things to know:**
- `.astro` files are mostly just HTML with a frontmatter block at the top (between `---` lines)
- CSS can be scoped to a component with a `<style>` tag inside the file
- Content (articles) lives as markdown files in `src/content/articles/`
- When you push to GitHub, Netlify builds and deploys automatically

## Stack

- **Framework:** Astro 5 (static site generator)
- **Hosting:** Netlify
- **Analytics:** Google Analytics 4
- **Forms:** Netlify Forms (free tier, 100 submissions/month) or Formspree
- **Content:** Markdown files with frontmatter (no CMS needed yet)

## Project Structure

```
kh-site/
├── _reference/              ← Production-ready standalone HTML pages
│   ├── kh-homepage.html         (copy sections into Astro pages)
│   ├── kh-solutions.html
│   ├── kh-talk-to-us.html
│   ├── kh-about.html
│   ├── kh-learn-hub.html
│   ├── kh-track-template.html
│   ├── kh-article-template.html
│   └── kh-resources.html
├── public/                  ← Static assets (copied as-is to built site)
│   ├── images/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Nav.astro        ← Shared navigation (mobile menu included)
│   │   └── Footer.astro     ← Shared footer
│   ├── content/
│   │   ├── articles/        ← Markdown articles
│   │   │   └── why-premiums-keep-climbing.md
│   │   └── config.ts        ← Content collection schema
│   ├── layouts/
│   │   ├── BaseLayout.astro     ← HTML shell (head, GA4, nav, footer)
│   │   └── ArticleLayout.astro  ← Article page with track context
│   ├── pages/
│   │   ├── index.astro          ← Homepage
│   │   ├── solutions.astro
│   │   ├── about.astro
│   │   ├── talk-to-us.astro
│   │   ├── 404.astro
│   │   └── learn/
│   │       ├── index.astro          ← Learn hub
│   │       ├── business-case.astro  ← Business Case track
│   │       ├── hr-playbook.astro    ← HR Playbook track
│   │       ├── resources.astro      ← Gated content
│   │       └── [...slug].astro      ← Dynamic article pages
│   └── styles/
│       └── tokens.css       ← Design tokens (colors, typography, spacing)
├── netlify.toml             ← Netlify build config + redirects
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) version 20 or later
- A terminal (PowerShell, Git Bash, or Windows Terminal)

### Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/kingsfoil-health.git
cd kingsfoil-health

# Install dependencies
npm install

# Start dev server (opens at http://localhost:4321)
npm run dev

# Build for production (output goes to dist/)
npm run build

# Preview the production build locally
npm run preview
```

## Integrating the HTML Pages into Astro

The `_reference/` folder contains 8 standalone HTML files. Each is a complete, production-ready page you can open in a browser. The Astro pages in `src/pages/` are stubs that reference them. To integrate:

### For each page:

1. Open the standalone HTML file (e.g., `_reference/kh-homepage.html`)
2. Open the matching Astro page (e.g., `src/pages/index.astro`)
3. Copy everything between `<main>` and `</main>` from the HTML file
4. Paste it into the Astro page, replacing the placeholder content
5. Copy the page-specific CSS from the HTML `<style>` block
6. Paste it into a `<style>` block at the bottom of the Astro file
7. **Remove** from pasted CSS: token-level styles (color ramps, typography, spacing, buttons, reset) — already in `tokens.css`
8. **Remove** from pasted CSS: nav and footer styles — already in their components

**Do NOT copy:** `<html>`, `<head>`, `<body>`, `<nav>`, `<footer>`, or mobile menu `<script>` — BaseLayout handles all of those.

### Mapping Table

| HTML File | Astro Page |
|---|---|
| `kh-homepage.html` | `src/pages/index.astro` |
| `kh-solutions.html` | `src/pages/solutions.astro` |
| `kh-about.html` | `src/pages/about.astro` |
| `kh-talk-to-us.html` | `src/pages/talk-to-us.astro` |
| `kh-learn-hub.html` | `src/pages/learn/index.astro` |
| `kh-track-template.html` | `src/pages/learn/business-case.astro` + `hr-playbook.astro` |
| `kh-article-template.html` | `src/layouts/ArticleLayout.astro` (already integrated) |
| `kh-resources.html` | `src/pages/learn/resources.astro` |

## Adding New Articles

Create a markdown file in `src/content/articles/`:

```markdown
---
title: "Your Article Title"
type: blog
excerpt: "150-300 character summary of the article."
publishedDate: 2026-04-15
audienceTags: ["Business Leaders"]
topicTags: ["Cost Management"]
difficulty: beginner
learningTrack: business-case
trackOrder: 2
isFeatured: false
---

Your article body in markdown. Use ## for headings, **bold** for emphasis,
> blockquotes for callouts, and [links](https://example.com) as normal.
```

Push to main → Netlify builds → article is live at `/learn/your-article-slug/`.

## Deploying to Netlify

### First-time setup:

1. Push this repo to GitHub
2. Log into [app.netlify.com](https://app.netlify.com)
3. Click **Add new site** → **Import an existing project**
4. Connect your GitHub account and select this repo
5. Netlify auto-detects the config from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **Deploy site**

### Custom domain:

1. In Netlify: **Site settings** → **Domain management** → **Add a domain**
2. Enter `kingsfoilhealth.com`
3. Netlify provides DNS records — add them at your domain registrar
4. SSL is automatic once DNS propagates

### After setup:

Every push to `main` triggers an automatic build and deploy (~1-2 minutes). Pull requests get a preview URL you can review before merging.

## Google Analytics 4

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (looks like `G-XXXXXXXXXX`)
3. Replace `G-XXXXXXXXXX` in `src/layouts/BaseLayout.astro` (appears twice)

### Custom events (pre-configured in BaseLayout):

| Event | Trigger |
|---|---|
| `cta_click` | Any CTA button click |
| `form_submit` | Any form submission |
| `article_read` | 75% scroll depth on article pages |
| `track_start` | Click on learning track cards |

## Form Handling

Forms currently point to `action="#"`. Two options:

### Option A: Netlify Forms (recommended — you're already on Netlify)

Add the `data-netlify="true"` attribute to any form:

```html
<form method="POST" data-netlify="true" name="contact">
```

Submissions show up in your Netlify dashboard under **Forms**. Free tier includes 100 submissions/month. You can set up email notifications in Netlify to get notified on each submission.

### Option B: Formspree

1. Create a form at [formspree.io](https://formspree.io)
2. Replace `action="#"` with `action="https://formspree.io/f/YOUR_FORM_ID"`

## Pre-Launch Checklist

- [ ] All HTML sections integrated into Astro pages
- [ ] `G-XXXXXXXXXX` replaced with real GA4 Measurement ID
- [ ] Forms activated (add `data-netlify="true"` or connect Formspree)
- [ ] Favicon added to `public/favicon.svg`
- [ ] OG images created and added to `public/images/`
- [ ] Photo placeholders replaced with real images
- [ ] Partner logos added
- [ ] Domain updated in `robots.txt` and `astro.config.mjs`
- [ ] Custom domain configured in Netlify
- [ ] All pages tested at 375px, 768px, 1024px+
- [ ] All links verified
- [ ] Privacy policy and terms pages created
- [ ] Lighthouse audit (target: 95+ performance, 100 accessibility)
