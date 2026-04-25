---
# =============================================================================
# KINGSFOIL HEALTH ARTICLE TEMPLATE
# =============================================================================
# Copy this file, rename it to your slug (kebab-case), and fill in the fields.
# The schema is enforced in src/content/config.ts — build will fail on bad input.
#
# File location convention:
#   src/content/articles/<cluster-folder>/<slug>.md
#   e.g. src/content/articles/plan-structures/level-funded-health-plans-explained.md
#
# URL convention:
#   /learn/<cluster-folder>/<slug>
# =============================================================================

# ----- CORE (required) -----
title: "H1 Headline — Include Your Primary Keyword"                    # appears as <h1>
type: blog                                                              # blog | announcement | case-study | report
excerpt: "150–280 char summary. Goes into <meta description>, OG, and the visible subtitle under the H1. Front-load the keyword and the benefit."
publishedDate: 2026-04-24                                               # ISO date
updatedDate: 2026-04-24                                                 # optional; bump when you revise

# ----- TAXONOMY (required) -----
audienceTags: ["Business Leaders"]                                      # Business Leaders | CFO | HR | Employee | All
topicTags: ["Plan Structures"]                                          # see config.ts for the enum
difficulty: beginner                                                    # beginner | intermediate | advanced

# ----- CONTENT CLUSTER (SEO topic pillar) -----
# Separate from learning tracks. Used for the related-article badge and schema.
contentCluster: Plan Structures                                         # Fundamentals | Plan Structures | Premium Costs | Stop-Loss | HSA & Tax-Advantaged | Broker Transparency | Retention & Culture | Utah Local | Pillar

# ----- LEARNING TRACK (optional, only for Business Case / HR Playbook tracks) -----
# learningTrack: business-case
# trackOrder: 3

# ----- SEO -----
# If seoTitle is omitted, metaTitle becomes "<title> — Kingsfoil Health"
seoTitle: "Keyword-Forward Title (55–60 chars) | Kingsfoil Health"
seoDescription: "Action-oriented 140–158 char description that includes the keyword and promises what they'll learn."
keywords:
  - primary keyword
  - secondary keyword
  - long-tail variant

# ----- AEO (answer-engine optimization) -----
# 3–6 punchy takeaways. These render as a styled box at the top of the article
# and are the first thing ChatGPT / Gemini / Perplexity see when they scrape.
keyTakeaways:
  - "One sentence that directly answers the question someone searched."
  - "A second concrete fact or number a reader should walk away with."
  - "A takeaway that ties back to Kingsfoil's differentiator (transparency, data, alternatives)."

# 4–6 FAQs. Rendered as <details> accordions AND as FAQPage JSON-LD in <head>.
# Write answers as complete sentences (2–4 sentences) — they need to stand alone.
faqs:
  - question: "What is [thing the article is about]?"
    answer: "Plain-language definition, 2–4 sentences. Front-load the direct answer."
  - question: "How is [X] different from [Y]?"
    answer: "Direct comparison answer."
  - question: "Is [X] right for a small business?"
    answer: "Honest, specific answer — include the size range where it applies."
  - question: "How much does [X] typically cost?"
    answer: "Include a range if you have one. If it depends, say what it depends on."

# ----- BYLINE & READING TIME -----
author: "Kingsfoil Health Editorial Team"
authorTitle: "Employer Benefits Desk"                                   # optional subtitle
readingTime: 7                                                          # minutes, rounded

# ----- INTERNAL LINKS (related articles) -----
# Use slugs WITH folder prefix. Minimum 3, ideally 4–6.
# Pull from BOTH this cluster AND adjacent clusters for topical breadth.
relatedArticles:
  - "plan-structures/self-funded-vs-fully-insured"
  - "stop-loss/what-is-stop-loss-insurance"
  - "business-case/why-rates-keep-going-up"

# ----- CTA OVERRIDE (optional) -----
# Leave blank to use the default "Talk to Us" CTA.
# ctaText: "Download the Rate Shock Survival Guide"
# ctaUrl: "/learn/resources/rate-shock"

# ----- DISPLAY (optional) -----
isFeatured: false
# featuredImage: "/images/articles/your-slug.jpg"
---

<!--
=============================================================================
VOICE & STRUCTURE GUIDE
=============================================================================

VOICE
- Second person. "You," "your team," "your company."
- Direct. No throat-clearing. Open with the reader's situation.
- Transparency-first. "Here's what your broker isn't telling you" is the
  implicit posture — don't say it, embody it.
- Authoritative but not smug. We're on the employer's side.
- Named things get defined the first time they appear. Never assume jargon.
- Short paragraphs. 2–4 sentences max. Heavy whitespace.

STRUCTURE (this ordering matters for SEO & AEO)

  1. HOOK (2–3 short paragraphs, no heading)
     - State the reader's moment. "You opened the renewal letter."
     - Name the question they're here to answer.
     - Say what this article will do.
     - MUST contain the primary keyword naturally in the first 100 words.

  2. DEFINITIONAL H2 (usually "What is X?" or "How X works")
     - The AEO win. Answer the core question in the first paragraph after this H2.
     - Google and LLMs look here for the featured-snippet extract.

  3. BODY H2s (3–5 of them)
     - Each H2 is a question or a declarative claim.
     - Use bolded lead-ins for sub-points: **The first thing.** Explanation...
     - Mix prose with at least one structured element: bulleted list, table,
       or numbered list. Structured content gets extracted by AI and Google.

  4. A BLOCKQUOTE CALLOUT
     - One per article. Surfaces the single sharpest claim.
     - Styled as an italicized pull-quote.

  5. "THE BOTTOM LINE" or RE-FRAME H2
     - Tie back to the reader's original question.
     - Transition into the CTA.

  6. CTA PARAGRAPH
     - If there's a lead-magnet guide tied to this topic, use a blockquote
       CTA: "> **Get the full playbook.** Download *The [Guide Name]* —
       [description]. [Get your copy here](/learn/resources/slug)."
     - Otherwise the layout renders the default "Talk to Us" CTA.

INTERNAL LINKING RULES
- Every article links out 3–6 times to other articles.
- At least 2 of those links MUST be to articles in the same content cluster.
- At least 1 link should bridge to a different cluster (topical breadth).
- Link from natural keyword phrases, not "click here."
- The `relatedArticles` frontmatter powers the Keep Reading section at the
  bottom. In-body links are still required on top of that.

KEYWORD PLACEMENT
- Primary keyword: H1, first paragraph, one H2, and the seoDescription.
- Secondary keywords: sprinkled throughout body H2s and prose.
- Never keyword-stuff. If it doesn't read naturally, rewrite.

LENGTH TARGETS
- Beginner explainer: 1,200–1,500 words
- Comparison / pillar: 1,800–2,500 words
- Quick-win / narrow long-tail: 900–1,200 words

BRAND DO-NOTS
- Don't use corporate hedge words: "solutions," "leverage," "synergies."
- Don't refer to Kingsfoil in the third person awkwardly. "We" is fine.
- Don't promise outcomes we can't deliver. Conditional language: "can," "may."
- Don't use emojis in body copy.
=============================================================================
-->

You open the renewal letter. [OPENING HOOK — 2–3 paragraphs that put the reader in a moment and name what this article will answer. Primary keyword appears here.]

## What [primary topic] actually is

[Definitional paragraph — the AEO extract target. Answer the core question directly in the first sentence after this H2. 2–3 paragraphs.]

## [Body H2 — usually a "why" or "how" question]

[2–4 paragraphs. Use **bolded lead-ins** for sub-points when appropriate.]

- A structured bullet
- Another bullet
- One more bullet

## [Body H2 — comparison, breakdown, or deeper layer]

[Prose. Include at least one internal link to a related article in the same cluster, using keyword-rich anchor text.]

> A single sharp callout that crystallizes the argument of the piece.

## [Body H2 — objections / nuance]

[Address the "but what about…" question the skeptical reader has by this point.]

## The bottom line

[Re-frame the original question. Point to the next step — a deeper article, a lead magnet, or a conversation.]

> **Get the full playbook.** Download *The [Guide Name]* — a free, practical guide for [audience]. [Get your copy here](/learn/resources/slug).
