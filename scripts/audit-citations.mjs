#!/usr/bin/env node
/**
 * audit-citations.mjs
 *
 * Scans articles in src/content/articles/ for specific factual claims that may
 * need source citations. Implements the citation rules documented in
 * CLAUDE.md and ~/.claude/skills/kh-content-citations/SKILL.md.
 *
 * Detects:
 *   - Specific dollar amounts (with thousands separator: $25,572 — these tend
 *     to be specific stats rather than passing references)
 *   - Percentage ranges (15–25%, 10–25%) — almost always speculative
 *   - Single percentages over a threshold that aren't well-known constants
 *   - Named-source attribution claims without a nearby hyperlink
 *
 * Suppression (a finding is downgraded or skipped when):
 *   - The match is inside frontmatter (between --- markers)
 *   - The match is inside a fenced code block
 *   - The match is inside a footnote definition (line starting with [^...])
 *   - The match is in a paragraph that contains a markdown hyperlink (already cited)
 *   - The match is in a paragraph that contains a footnote reference (e.g. [^1])
 *   - The match is in a paragraph using illustrative-marker words (illustrative,
 *     for illustration, imagine, hypothetical, illustrative example)
 *   - The match is a known constant (FICA 7.65%, Medicare 1.45%, Social Security 6.2%)
 *
 * Usage:
 *   node scripts/audit-citations.mjs            # report-only; exit 0 even with findings
 *   node scripts/audit-citations.mjs --strict   # exit 1 if any high-severity findings
 *   node scripts/audit-citations.mjs --json     # output machine-readable JSON
 *
 * Environment variables:
 *   AUDIT_STRICT=1                              # equivalent to --strict
 *   AUDIT_SKIP=1                                # bypass the audit entirely (e.g. in dev)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'src/content/articles');

const ARGS = new Set(process.argv.slice(2));
const STRICT = ARGS.has('--strict') || process.env.AUDIT_STRICT === '1';
const JSON_OUT = ARGS.has('--json');
const SKIP = process.env.AUDIT_SKIP === '1';

if (SKIP) {
  if (!JSON_OUT) console.log('audit-citations: skipped (AUDIT_SKIP=1)');
  process.exit(0);
}

// ---------- Patterns ----------

// Specific dollar amounts WITH thousand separators are very likely to be
// specific stats. ($1,200 / $25,572 / $1,000,000)
// We do NOT flag $300 or $75,000-without-comma in passing because that creates
// too much noise; the comma-delimited variant is the high-signal one.
const RX_DOLLAR_SPECIFIC = /\$\d{1,3}(?:,\d{3})+(?:\.\d+)?/g;

// Percentage ranges like "10-25%" or "15–30%" or "20 to 40%"
const RX_PCT_RANGE = /\b\d+(?:\.\d+)?\s*[-–—]\s*\d+(?:\.\d+)?\s*%/g;

// Single percentage that is NOT a well-known constant. We flag this and let
// the suppression rules filter out the truly uninteresting cases.
const RX_PCT_SINGLE = /\b\d+(?:\.\d+)?\s*%/g;

// Survey/research attribution without a hyperlink in the same paragraph
const RX_ATTRIBUTION = /(according to|reports? that|finds? that|study (?:by|from)|survey (?:by|from)|data from)\b/gi;

// ---------- Suppression / known-constant lists ----------

// Single percentages that are well-known and don't need citation
const KNOWN_PCT_CONSTANTS = new Set([
  '7.65', // FICA combined (Social Security + Medicare)
  '6.2',  // Social Security
  '1.45', // Medicare
  '15.3', // Self-employment combined
  '95',   // ACA "substantially all" threshold (well-known)
  '100',  // 100% (passing references like "100% of self-only")
  '0',    // 0% (passing references)
  '50',   // common split
]);

const ILLUSTRATIVE_MARKERS = [
  'illustrative',
  'for illustration',
  'imagine',
  'hypothetical',
  'illustrative example',
  'consider a',
  'consider an illustrative',
  'illustration:',
  'illustration,',
];

// ---------- Helpers ----------

function getRelative(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue; // ignore _TEMPLATE.md, _strategy.txt etc.
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield full;
    }
  }
}

function splitFrontmatter(text) {
  if (!text.startsWith('---')) return { frontmatter: '', body: text, bodyOffset: 0 };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { frontmatter: '', body: text, bodyOffset: 0 };
  // Body starts after the closing --- and the next newline
  const closing = text.indexOf('\n', end + 4);
  const bodyOffset = closing === -1 ? text.length : closing + 1;
  return {
    frontmatter: text.slice(0, bodyOffset),
    body: text.slice(bodyOffset),
    bodyOffset,
  };
}

// Returns an array of [start, end) ranges (within the body string) that should
// be skipped: code fences, footnote definitions.
function findSkipRanges(body) {
  const ranges = [];

  // Fenced code blocks ```...```
  const codeFenceRe = /```[\s\S]*?```/g;
  for (const m of body.matchAll(codeFenceRe)) {
    ranges.push([m.index, m.index + m[0].length]);
  }

  // Footnote definitions: lines that start with [^name]:
  // We skip the entire line because by definition it's already a citation.
  const lines = body.split('\n');
  let pos = 0;
  for (const line of lines) {
    if (/^\[\^[^\]]+\]:/.test(line)) {
      ranges.push([pos, pos + line.length]);
    }
    pos += line.length + 1; // include the newline
  }

  return ranges;
}

function inAnyRange(idx, ranges) {
  for (const [s, e] of ranges) {
    if (idx >= s && idx < e) return true;
  }
  return false;
}

// Get the paragraph containing index `idx`. Paragraphs are blank-line-separated.
function getParagraph(body, idx) {
  let start = body.lastIndexOf('\n\n', idx);
  start = start === -1 ? 0 : start + 2;
  let end = body.indexOf('\n\n', idx);
  end = end === -1 ? body.length : end;
  return body.slice(start, end);
}

// Get the broader section context — the current paragraph plus 1-2 paragraphs
// before it. This catches cases where an article-level "all numbers are
// illustrative" disclaimer or a section-introduction footnote applies to a
// whole worked example.
function getSectionContext(body, idx, paragraphsBack = 2) {
  let start = idx;
  for (let i = 0; i <= paragraphsBack; i++) {
    const prev = body.lastIndexOf('\n\n', start - 2);
    if (prev === -1) {
      start = 0;
      break;
    }
    start = prev + 2;
  }
  let end = body.indexOf('\n\n', idx);
  end = end === -1 ? body.length : end;
  return body.slice(start, end);
}

function hasHyperlink(text) {
  // Markdown link to an http(s) URL: [text](https://...)
  return /\[[^\]]+\]\(https?:\/\/[^)]+\)/.test(text);
}

function hasFootnoteRef(text) {
  // Footnote reference like [^1] (NOT a definition, just a reference)
  return /\[\^[^\]]+\](?!:)/.test(text);
}

function isIllustrative(text) {
  const lower = text.toLowerCase();
  return ILLUSTRATIVE_MARKERS.some(m => lower.includes(m));
}

// Check if the article body has a top-of-article disclaimer footnote that
// covers all numerical examples (e.g. "All scenarios in this article are
// illustrative" or similar). When detected, this suppresses dollar/percentage
// findings throughout the file.
function hasArticleLevelIllustrativeDisclaimer(body) {
  return /\b(all (?:dollar amounts|scenarios|numbers|figures)|all (?:premiums|attachment points)).*?(?:are illustrative|illustrative example|for explanation)/i.test(body)
    || /\bare illustrative examples? for explanation\b/i.test(body)
    || /\bAll dollar amounts and percentages in (?:this article|worked examples) are illustrative/i.test(body);
}

function lineNumberAt(body, idx, bodyOffset) {
  // Compute line number in the original file (1-indexed)
  const upToHere = body.slice(0, idx);
  // Add 1 for the line we're on, plus any lines in the frontmatter
  const fmLines = bodyOffset > 0
    ? // count newlines in the frontmatter region
      (function () {
        // bodyOffset is the count of chars in frontmatter + closing newline.
        // We need the count of newlines in original text up to bodyOffset.
        // Easier: just count newlines in the source up to (bodyOffset + idx).
        return null;
      })()
    : 0;
  // Simpler: caller passes the full source; we recompute inline.
  return upToHere.split('\n').length;
}

// ---------- Main audit ----------

function auditFile(filepath) {
  const source = fs.readFileSync(filepath, 'utf8');
  const { body, bodyOffset } = splitFrontmatter(source);
  const skipRanges = findSkipRanges(body);
  const findings = [];
  const fmLineCount = source.slice(0, bodyOffset).split('\n').length - 1;
  const articleHasDisclaimer = hasArticleLevelIllustrativeDisclaimer(body);

  function record(match, kind, severity, message) {
    const idx = match.index;
    if (inAnyRange(idx, skipRanges)) return;
    const paragraph = getParagraph(body, idx);
    const section = getSectionContext(body, idx);

    // Suppression rules — check both paragraph and broader section context.
    // (Section context catches article/section-level disclaimers that apply
    // to a whole worked example.)
    if (articleHasDisclaimer) {
      severity = 'low';
      message += ' (article has top-level illustrative disclaimer)';
    } else if (hasHyperlink(paragraph) || hasHyperlink(section)) {
      severity = 'low';
      message += ' (paragraph or nearby section contains a hyperlink — likely already cited)';
    } else if (hasFootnoteRef(paragraph) || hasFootnoteRef(section)) {
      severity = 'low';
      message += ' (paragraph or nearby section has a footnote reference — likely already cited)';
    } else if (isIllustrative(paragraph) || isIllustrative(section)) {
      severity = 'low';
      message += ' (paragraph or nearby section is marked illustrative)';
    }

    if (severity === 'low' && !ARGS.has('--all')) return; // suppress low by default

    const bodyLineNum = body.slice(0, idx).split('\n').length;
    const line = fmLineCount + bodyLineNum;
    const lineText = body.slice(
      Math.max(0, body.lastIndexOf('\n', idx) + 1),
      body.indexOf('\n', idx) === -1 ? body.length : body.indexOf('\n', idx)
    );
    findings.push({
      file: getRelative(filepath),
      line,
      kind,
      severity,
      match: match[0],
      message,
      context: lineText.trim().slice(0, 160),
    });
  }

  // Specific dollar amounts
  for (const m of body.matchAll(RX_DOLLAR_SPECIFIC)) {
    record(m, 'dollar', 'high', `Specific dollar amount "${m[0]}" — verify source or mark illustrative`);
  }

  // Percentage ranges — almost always speculative
  for (const m of body.matchAll(RX_PCT_RANGE)) {
    record(m, 'pct-range', 'high', `Percentage range "${m[0]}" — verify source or soften to directional language`);
  }

  // Single percentages — flag with suppression for known constants
  for (const m of body.matchAll(RX_PCT_SINGLE)) {
    const numeric = m[0].replace(/[^\d.]/g, '');
    if (KNOWN_PCT_CONSTANTS.has(numeric)) continue;
    // Skip if this match is part of a percentage range we already flagged
    // (the range regex already covered "10-25%")
    const idx = m.index;
    const before = body.slice(Math.max(0, idx - 8), idx);
    if (/\d\s*[-–—]\s*$/.test(before)) continue;
    record(m, 'pct-single', 'high', `Percentage "${m[0]}" — verify source or replace with directional language`);
  }

  // Attribution claims without nearby citation
  for (const m of body.matchAll(RX_ATTRIBUTION)) {
    const paragraph = getParagraph(body, m.index);
    const section = getSectionContext(body, m.index);
    if (hasHyperlink(paragraph) || hasHyperlink(section)) continue;
    if (hasFootnoteRef(paragraph) || hasFootnoteRef(section)) continue;
    record(m, 'attribution', 'high', `Attribution phrase "${m[0]}" without a nearby hyperlink — add source link`);
  }

  return findings;
}

// ---------- Run ----------

const allFindings = [];
const files = [...walk(ARTICLES_DIR)];
for (const f of files) {
  allFindings.push(...auditFile(f));
}

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ findings: allFindings, total: allFindings.length }, null, 2));
  process.exit(STRICT && allFindings.length > 0 ? 1 : 0);
}

// Human-readable output
const byFile = new Map();
for (const f of allFindings) {
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}Auditing ${files.length} articles for unsourced claims...${RESET}\n`);

if (allFindings.length === 0) {
  console.log(`${BOLD}\x1b[32m✓${RESET} No unsourced claims detected.`);
  process.exit(0);
}

for (const [file, findings] of byFile) {
  console.log(`${BOLD}${file}${RESET}`);
  for (const f of findings) {
    const tag = f.severity === 'high' ? `${RED}[high]${RESET}` : `${YELLOW}[low]${RESET}`;
    console.log(`  ${DIM}line ${f.line}${RESET}  ${tag}  ${f.message}`);
    if (f.context) console.log(`    ${DIM}↳ ${f.context}${RESET}`);
  }
  console.log('');
}

const high = allFindings.filter(f => f.severity === 'high').length;
const low = allFindings.filter(f => f.severity === 'low').length;

console.log(`${BOLD}Summary:${RESET} ${high} high-severity finding${high === 1 ? '' : 's'}${low > 0 ? `, ${low} low-severity (run with --all to see)` : ''} across ${byFile.size} file${byFile.size === 1 ? '' : 's'}.`);
console.log(`${DIM}Re-run after fixes: npm run audit:citations${RESET}`);

if (STRICT && high > 0) {
  console.log(`\n${RED}${BOLD}Audit failed in strict mode.${RESET} Set AUDIT_SKIP=1 to bypass for drafting.`);
  process.exit(1);
}

process.exit(0);
