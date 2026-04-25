#!/usr/bin/env node
/**
 * Kingsfoil Health — Technical SEO validation
 *
 * Runs after `astro build` on every built HTML page.
 * Fails the build if any page is missing a required SEO element.
 * Warns (but does not fail) on soft-rule violations.
 *
 * Source of truth: SEO_CHECKLIST.md at repo root.
 * To add a new rule: extend CHECKS below. Keep each check small and focused.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';

// Pages that skip the full checklist (intentionally noindex / error pages)
const EXEMPT_PATHS = new Set([
  '/404',
  '/learn/resources/rate-shock-thank-you',
  '/admin',
]);

// Per-rule severity: 'error' fails the build; 'warn' prints but passes.
const RULES = {
  title: 'error',
  titleLength: 'warn',           // recommended 10-65
  description: 'error',
  descriptionLength: 'warn',     // recommended 50-170
  canonical: 'error',
  viewport: 'error',
  htmlLang: 'error',
  h1Exactly1: 'error',
  ogTitle: 'error',
  ogDescription: 'error',
  ogImage: 'error',
  ogUrl: 'error',
  ogType: 'error',
  ogSiteName: 'error',
  ogLocale: 'warn',
  twitterCard: 'error',
  twitterImage: 'error',
  organizationJsonLd: 'error',
  breadcrumbJsonLd: 'warn',      // not expected on homepage
  imgAlt: 'error',
};

function* walkHtml(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) yield* walkHtml(full);
    else if (full.endsWith('.html')) yield full;
  }
}

function urlPathFor(htmlPath) {
  // dist/about/index.html -> /about
  // dist/index.html -> /
  const rel = relative(DIST, htmlPath).split(sep).join('/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
}

function extractMeta(html, selector) {
  // supports: name="x", property="x", rel="x"
  const re = new RegExp(`<${selector.tag}[^>]*\\s${selector.attr}=["']${selector.value}["'][^>]*>`, 'i');
  const match = html.match(re);
  if (!match) return null;
  // Back-reference ensures we match the same quote type that opened the value,
  // so apostrophes/quotes inside the value don't terminate the match early.
  const contentMatch = match[0].match(/\s(?:content|href)=(["'])([\s\S]*?)\1/i);
  return contentMatch ? contentMatch[2] : '';
}

function countMatches(html, regex) {
  const matches = html.match(regex);
  return matches ? matches.length : 0;
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try { blocks.push(JSON.parse(m[1].trim())); } catch { /* ignore malformed */ }
  }
  return blocks;
}

function validatePage(urlPath, html) {
  const findings = [];
  const add = (rule, message) => findings.push({ rule, severity: RULES[rule], message });

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch?.[1]?.trim();
  if (!title) add('title', 'Missing <title>');
  else if (title.length < 10 || title.length > 65) {
    add('titleLength', `Title length ${title.length} (expected 10-65): "${title}"`);
  }

  // Description
  const desc = extractMeta(html, { tag: 'meta', attr: 'name', value: 'description' });
  if (!desc) add('description', 'Missing <meta name="description">');
  else if (desc.length < 50 || desc.length > 170) {
    add('descriptionLength', `Description length ${desc.length} (expected 50-170)`);
  }

  // Canonical
  if (!extractMeta(html, { tag: 'link', attr: 'rel', value: 'canonical' })) {
    add('canonical', 'Missing <link rel="canonical">');
  }

  // Viewport
  if (!extractMeta(html, { tag: 'meta', attr: 'name', value: 'viewport' })) {
    add('viewport', 'Missing viewport meta');
  }

  // HTML lang
  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) {
    add('htmlLang', 'Missing lang attribute on <html>');
  }

  // H1 count (exactly 1)
  const h1Count = countMatches(html, /<h1\b[^>]*>/gi);
  if (h1Count !== 1) add('h1Exactly1', `Expected 1 <h1>, found ${h1Count}`);

  // OG tags
  if (!extractMeta(html, { tag: 'meta', attr: 'property', value: 'og:title' })) add('ogTitle', 'Missing og:title');
  if (!extractMeta(html, { tag: 'meta', attr: 'property', value: 'og:description' })) add('ogDescription', 'Missing og:description');
  if (!extractMeta(html, { tag: 'meta', attr: 'property', value: 'og:image' })) add('ogImage', 'Missing og:image');
  if (!extractMeta(html, { tag: 'meta', attr: 'property', value: 'og:url' })) add('ogUrl', 'Missing og:url');
  if (!extractMeta(html, { tag: 'meta', attr: 'property', value: 'og:type' })) add('ogType', 'Missing og:type');
  if (!extractMeta(html, { tag: 'meta', attr: 'property', value: 'og:site_name' })) add('ogSiteName', 'Missing og:site_name');
  if (!extractMeta(html, { tag: 'meta', attr: 'property', value: 'og:locale' })) add('ogLocale', 'Missing og:locale');

  // Twitter
  if (!extractMeta(html, { tag: 'meta', attr: 'name', value: 'twitter:card' })) add('twitterCard', 'Missing twitter:card');
  if (!extractMeta(html, { tag: 'meta', attr: 'name', value: 'twitter:image' })) add('twitterImage', 'Missing twitter:image');

  // JSON-LD presence
  const jsonLd = extractJsonLdBlocks(html);
  const hasOrg = jsonLd.some(b => {
    const types = Array.isArray(b['@type']) ? b['@type'] : [b['@type']];
    return types.includes('Organization') || types.includes('InsuranceAgency');
  });
  if (!hasOrg) add('organizationJsonLd', 'Missing Organization/InsuranceAgency JSON-LD');

  if (urlPath !== '/') {
    const hasBreadcrumb = jsonLd.some(b => b['@type'] === 'BreadcrumbList');
    if (!hasBreadcrumb) add('breadcrumbJsonLd', 'Missing BreadcrumbList JSON-LD (expected on all non-homepage pages)');
  }

  // Image alt attributes — every <img> must have alt=""
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  imgTags.forEach((tag, i) => {
    if (!/\salt\s*=/i.test(tag)) {
      const srcMatch = tag.match(/\ssrc=["']([^"']*)["']/i);
      const src = srcMatch ? srcMatch[1] : `<img #${i + 1}>`;
      add('imgAlt', `<img> missing alt attribute (src: ${src})`);
    }
  });

  return findings;
}

// ---- main ----
const pages = [...walkHtml(DIST)];
const errors = [];
const warnings = [];

for (const htmlPath of pages) {
  const urlPath = urlPathFor(htmlPath);
  if (EXEMPT_PATHS.has(urlPath)) continue;

  const html = readFileSync(htmlPath, 'utf-8');
  const findings = validatePage(urlPath, html);
  for (const f of findings) {
    const row = { urlPath, ...f };
    if (f.severity === 'error') errors.push(row);
    else warnings.push(row);
  }
}

const checked = pages.length;
if (warnings.length) {
  console.log(`\nSEO warnings (${warnings.length}):`);
  warnings.forEach(w => console.log(`  ${w.urlPath} [${w.rule}] ${w.message}`));
}
if (errors.length) {
  console.error(`\nSEO validation FAILED (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
  errors.forEach(e => console.error(`  ${e.urlPath} [${e.rule}] ${e.message}`));
  console.error(`\nChecked ${checked} pages. See SEO_CHECKLIST.md for rules and fixes.\n`);
  process.exit(1);
}
console.log(`\nSEO validation passed. Checked ${checked} pages. ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.\n`);
