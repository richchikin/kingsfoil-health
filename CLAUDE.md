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

## Article Content — Citation Rules (REQUIRED)

**Any new or edited article in `src/content/articles/` must follow the citation and no-speculation rules.**

The full ruleset lives in the `kh-content-citations` skill at `~/.claude/skills/kh-content-citations/SKILL.md` — read it before writing.

**Two-rule decision** for any specific stat, dollar amount, percentage, or attributed claim:

1. **Can you cite a real, verifiable, hyperlink-able source?**
   - Yes → Inline hyperlink or `[^N]` footnote with the source URL
   - No → Soften to directional language OR remove the claim
2. **Is the number an illustrative calculation (worked example)?**
   - Yes → Keep, but mark inline as "illustrative" + add a footnote covering the article's hypothetical numbers
   - No → fall back to Rule 1

**Never invent a source. Never soft-cite. Never keep a stat you can't verify or footnote as illustrative.**

### Approved sources (link directly)

- **Cost / benefits trends:** [KFF Employer Health Benefits Survey](https://www.kff.org/health-costs/report/employer-health-benefits-annual-survey/), [Mercer National Survey](https://www.mercer.com/insights/total-rewards/employee-benefits-strategy/national-survey-of-employer-sponsored-health-plans/), [BLS Employee Benefits Survey](https://www.bls.gov/ncs/ebs/), [CMS NHE data](https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data)
- **Regulatory / tax:** [IRS Publication 969 (HSA, HDHP)](https://www.irs.gov/publications/p969), [IRS ACA Section 4980H](https://www.irs.gov/affordable-care-act/employers/employer-shared-responsibility-provisions), [DOL EBSA (ERISA, Form 5500)](https://www.dol.gov/agencies/ebsa), [CMS Medical Loss Ratio](https://www.cms.gov/marketplace/private-health-insurance/medical-loss-ratio)
- **Demographics:** [U.S. Census QuickFacts](https://www.census.gov/quickfacts/UT)
- **Employee research:** [SHRM Research](https://www.shrm.org/topics-tools/research), [MetLife Employee Benefit Trends Study](https://www.metlife.com/employee-benefit-trends/), [WTW Insights](https://www.wtwco.com/en-us/insights), [Gallup Workplace](https://www.gallup.com/workplace/)

### Patterns to soften or remove

- Specific premium dollar ranges by tier/geography (use directional language; link to KFF for benchmarks)
- Specific commission percentages (soften to "varies by carrier, plan type, group size, and state")
- Specific stop-loss attachment ranges or aggregate factors stated as universal
- Specific savings percentages (e.g., "10–25%" — soften to "meaningful")
- Year-specific IRS limits stated as fixed numbers (link to IRS instead)
- Survey statistics with a named source but no URL
- Specific PEPM fee ranges (soften to "scaled to scope")
- Specific demographic numbers (only with Census link)
- Market share figures (almost never citable; remove)

### Footnote format (GFM, enabled by default in Astro 5)

In-text: `Premiums have risen meaningfully every year.[^1]`

Bottom of file (after the CTA blockquote):
```
[^1]: Source description with [hyperlink](https://example.com).
```

The article layout styles `.footnotes` as a "Sources & notes" section above the related-articles block.

### Self-check before committing any article

- [ ] Every dollar amount is cited, illustrative-with-footnote, or softened
- [ ] Every percentage is cited or softened
- [ ] Every attributed survey stat has a real link
- [ ] Every regulatory specific (IRS, ACA) links to the agency source
- [ ] No memory-sourced stats slipped through unchecked

When in doubt: remove the claim. Better to lose a sentence than publish unsourced data.

### Automated audit

A Node script at `scripts/audit-citations.mjs` scans every article and flags potential unsourced claims. It runs:

- **On every Netlify deploy** (in report mode — logs findings to the build log but does not block the deploy)
- **Locally on demand** via `npm run audit:citations`

Available commands:

| Command | Behavior |
|---|---|
| `npm run audit:citations` | Report findings; exit 0 (default) |
| `npm run audit:citations:strict` | Report findings; exit 1 if any high-severity findings (use in CI) |
| `npm run audit:citations:all` | Report findings including suppressed low-severity (paragraphs already cited / illustrative) |
| `npm run build:strict` | Run strict audit, then `astro build` (fails if audit fails) |
| `AUDIT_SKIP=1 npm run build` | Bypass the audit entirely |

What the audit detects:

- Specific dollar amounts with thousand separators (`$25,572`, `$1,200`) — almost always specific stats
- Percentage ranges (`10–25%`, `15-30%`) — almost always speculative without a source
- Single percentages excluding well-known constants (FICA 7.65%, Medicare 1.45%, etc.)
- Attribution phrases (*"according to"*, *"reports that"*, *"data from"*) without a nearby hyperlink

What the audit suppresses (no finding):

- Anything inside a fenced code block or footnote definition
- Matches in a paragraph or nearby section that contains a markdown hyperlink (`[text](https://...)`) — already cited
- Matches in a paragraph or nearby section that has a footnote reference (`[^1]`) — already cited
- Matches in articles with a top-level "all numbers are illustrative" disclaimer
- Matches near illustrative-marker words: *imagine*, *for illustration*, *hypothetical*

To switch Netlify to strict (fail deploy on unsourced claims), change `netlify.toml`:

```toml
command = "npm run build:strict"
```

The intended workflow:
1. Audit runs on every deploy and surfaces findings in the build log
2. When a clean baseline is reached, flip Netlify to `build:strict`
3. From that point, no new unsourced claim can ship — the deploy fails until it's cited or removed
