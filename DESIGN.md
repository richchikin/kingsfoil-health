---
name: Kingsfoil Health
description: Health insurance, healed — calm authority, human warmth, a better way forward.
colors:
  healing-elm: "#2e9582"
  healing-elm-light: "#eef8f6"
  healing-elm-dark: "#1e5f53"
  deep-sapphire: "#3468a0"
  deep-sapphire-light: "#f0f4f9"
  golden-hour: "#e1c45e"
  golden-hour-light: "#fefbf0"
  golden-hour-warm: "#fcf4d7"
  warm-stone: "#736f6c"
  warm-stone-dark: "#262324"
  warm-cream: "#fdf9f3"
  warm-linen: "#f8f3eb"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(32px, 4.5vw, 44px)"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(24px, 3vw, 30px)"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(20px, 2.5vw, 24px)"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.15em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  icon-bg: "25%"
spacing:
  sm: "16px"
  md: "32px"
  lg: "48px"
  section-y: "120px"
  section-x: "48px"
  inner-max: "1100px"
components:
  button-primary:
    backgroundColor: "{colors.healing-elm}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "#267a6b"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "14px 32px"
  button-warm:
    backgroundColor: "{colors.golden-hour-warm}"
    textColor: "#79641e"
    rounded: "{rounded.md}"
    padding: "14px 32px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "#267a6b"
    rounded: "{rounded.md}"
    padding: "14px 32px"
  nav-cta:
    backgroundColor: "{colors.healing-elm}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
---

# Design System: Kingsfoil Health

## 1. Overview

**Creative North Star: "The Golden Hour Consultation"**

The feeling of sitting across from an advisor in warm, late-afternoon light — someone who already understands your problem and has a plan. Not a sales pitch. Not a corporate presentation. A calm, knowledgeable conversation where possibilities open up and anxiety recedes.

Kingsfoil Health's visual system draws from the brand archetypes of Sage (authority, clarity, insight) and Caregiver (warmth, advocacy, protection). The palette is grounded in nature — healing greens, deep sapphires, golden hour warmth — set against warm cream surfaces that feel like good paper, not cold screens. Typography pairs Playfair Display's editorial sophistication with DM Sans' clean readability: refinement without pretension.

This system explicitly rejects the visual language of generic insurance: no sterile blues, no stock handshakes, no corporate glass towers, no fear-based imagery, no saccharine optimism. It also rejects startup-bro aesthetics — no purple gradients, no neon accents, no cards-in-cards SaaS templates. The test: could this page exist on any other insurance broker's website? If yes, it fails.

**Key Characteristics:**
- Warm cream surfaces with generous negative space (never white, never gray)
- Serif headlines that convey editorial authority, not decoration
- Color used with discipline — Elm Green leads, Gold accents, Sapphire supports
- Photography feels like natural light through windows, not studio flash
- Components feel approachable but decisive — gently curved, confidently filled
- Every page has room to breathe (30-40% negative space minimum)

## 2. Colors: The Golden Hour Palette

A palette drawn from nature and warmth — healing greens, deep water blues, golden light, and warm stone. Slightly desaturated overall, never hyper-vivid. The undertone across the entire system is warm.

### Primary

- **Healing Elm** (#2e9582): The primary action and trust color. Buttons, links, CTAs, hero sections, success indicators, active states. Named for the Athelas plant in the logo. This is the color that says "here's what you can do." Full ramp from #eef8f6 (50) to #0e2d28 (900).

### Secondary

- **Deep Sapphire** (#3468a0): Authority, depth, and informational weight. Secondary actions, educational content, tags, informational callouts. Used where Elm Green would be too action-oriented but the content still needs visual distinction. Full ramp from #f0f4f9 (50) to #112135 (900).

### Tertiary

- **Golden Hour** (#e1c45e): Warmth, optimism, and accent emphasis. Premium badges, warm CTAs (the `.btn-warm` variant), highlights, and featured elements. The emotional color — used where the design needs to feel human rather than clinical. Full ramp from #fefbf0 (50) to #524412 (900).

### Neutral

- **Warm Stone** (#736f6c): Body text, borders, dividers, metadata. A warm-toned neutral that never goes cold or blue. At its darkest (#262324), it's the footer and primary text color. At its lightest (#faf9f9), it blends into the warm cream surface. Full ramp from #faf9f9 (50) to #262324 (900).
- **Warm Cream** (#fdf9f3): The primary page surface. Not white, not beige — a warm, papery off-white that grounds the entire palette.
- **Warm Linen** (#f8f3eb): Alternating section backgrounds. One step warmer than Warm Cream for subtle rhythm between page sections.

### Named Rules

**The Warm Undertone Rule.** Every neutral in the system has a warm undertone. Cold grays are prohibited. If a new neutral is needed, it must match the warm-stone ramp's character. Blue-tinted grays break the Golden Hour atmosphere.

**The Elm Leads Rule.** Elm Green is the only color permitted on primary CTAs. Gold and Sapphire never compete with Elm for the user's primary attention. Gold accents, Sapphire informs, Elm acts.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** DM Sans (with -apple-system, BlinkMacSystemFont, sans-serif fallback)

**Character:** Playfair Display's transitional serifs convey editorial sophistication and quiet authority — the typographic equivalent of a well-read advisor. DM Sans' geometric clarity keeps body text highly readable and modern without competing with the headlines. Together, the pairing says: we know our subject deeply, and we'll explain it clearly.

### Hierarchy

- **Display** (700, clamp(32px, 4.5vw, 44px), line-height 1.15): Page heroes and primary headlines. Playfair Display. The largest, most impactful text on any page.
- **Headline** (600, clamp(24px, 3vw, 30px), line-height 1.2): Section headings within pages. Playfair Display. Structures the page into scannable blocks.
- **Title** (600, clamp(20px, 2.5vw, 24px), line-height 1.25): Subsection headings, card titles. Playfair Display. The smallest size that still carries the serif's authority.
- **Body** (400, 17px, line-height 1.6): All paragraph text. DM Sans. Max line length should not exceed 65-75 characters for comfortable reading.
- **Label / Eyebrow** (600, 12px, letter-spacing 0.15em, uppercase): Section labels, metadata, category tags. DM Sans. Always uppercase, always tracked wide.

### Named Rules

**The Serif Ceiling Rule.** Playfair Display is never used below 20px rendered size. Below that threshold, the serifs lose their refinement and become visual noise. H4 and smaller use DM Sans.

**The No-Decoration Rule.** Playfair Display is never used for decorative purposes (watermarks, oversized background text, purely ornamental elements). It earns its presence by communicating something.

## 4. Elevation

Kingsfoil Health's visual system is flat by default. Surfaces are differentiated by color (Warm Cream vs. Warm Linen vs. Elm-50 tints), not by shadows. This reinforces the warm, grounded, paper-like quality of the design.

Shadows appear only as feedback — a response to user interaction, not a resting state. Buttons lift slightly on hover. Nothing else casts a shadow at rest.

### Shadow Vocabulary

- **Hover lift** (`0 4px 16px rgba(46, 149, 130, 0.2)`): Applied to primary buttons on hover, paired with `translateY(-1px)`. The only shadow in the current system.
- **Focus ring** (`0 0 0 3px rgba(46, 149, 130, 0.4)`): Accessibility focus indicator. Elm Green at 40% opacity, 3px spread. Applied to all focusable elements.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus). If a new component needs visual separation from the background, use a tinted surface color or a subtle border — never a resting shadow.

## 5. Components

### Buttons

Approachable but decisive. Gently curved with confident fills and clear hierarchy.

- **Shape:** Gently rounded edges (8px radius) on all variants. Not pill-shaped, not sharp — a friendly middle ground.
- **Primary:** Healing Elm background (#2e9582), white text, 600 weight, 16px DM Sans. Padding 14px 32px. The default and most common button.
- **Hover / Focus:** Background darkens to Elm-600 (#267a6b), lifts 1px with a soft Elm-tinted shadow. Focus shows the 3px Elm ring.
- **Warm:** Golden Hour-100 background (#fcf4d7), Gold-800 text (#79641e), Gold-200 border (#f7e5a8). For secondary emphasis with emotional warmth — featured CTAs, premium actions.
- **Secondary:** Transparent background, Elm-600 text, Elm-200 border (#a6ddd3). For lower-priority actions alongside a Primary button.

### Cards / Containers

- **Corner Style:** Gently rounded (12px radius) for standalone images and card containers.
- **Background:** Warm Cream (#fdf9f3) or Warm Linen (#f8f3eb) depending on the section background they sit on. Always one step different from their container.
- **Shadow Strategy:** None at rest. Flat surfaces differentiated by background color.
- **Border:** Subtle when needed — Nero-200 (#e3e1df) at most, often none.
- **Internal Padding:** 32px (md spacing) for standard cards, 48px (lg spacing) for featured sections.

### Navigation

- **Sticky header** (72px tall, 64px on mobile) with frosted glass effect: Warm Cream at 92% opacity + 20px backdrop blur.
- **Border:** 1px solid Nero-300 at 25% opacity. Barely visible.
- **Links:** DM Sans 14px, 500 weight, Nero-600. Hover: Elm-600 with a 2px Elm underline that scales in from center.
- **Active page:** Elm-600, 600 weight, underline always visible.
- **CTA button:** Compact primary button (12px 24px padding) in Healing Elm.
- **Mobile:** Hamburger toggle (48px touch target), full-screen overlay with Playfair Display 28px links.

### Inputs / Fields

- **Style:** DM Sans 16px, Warm Cream background, 1px Nero-300 border, 8px radius.
- **Focus:** Border transitions to Elm-500, Elm focus ring appears.
- **Placeholder:** Nero-400, 400 weight.

### Icon Backgrounds (Signature Pattern)

Icons sit on tinted backgrounds from the brand ramps — a distinctive Kingsfoil pattern:
- Green icons on Elm-50 (#eef8f6)
- Blue icons on Sapphire-50 (#f0f4f9)
- Gold icons on Gold-50 (#fefbf0)
- Neutral icons on Nero-100 (#f2f0ef)
- Background shape: rounded square (25% border-radius).
- Stroke: 1.5px, rounded caps and joins, single-color, never filled.

### Floating CTA

Fixed bottom-right "Talk to Us" button. Healing Elm background, white text, 8px radius, subtle shadow for elevation above content. Present on all pages. The persistent, low-pressure invitation.

## 6. Do's and Don'ts

### Do:

- **Do** use Warm Cream (#fdf9f3) as the primary page surface — never pure white (#fff) or cool gray.
- **Do** maintain 30-40% negative space in all compositions. Generous breathing room is a core brand signal.
- **Do** use natural-light photography with warm undertones. Golden hour warmth for emotional content, soft directional daylight for standard use.
- **Do** place subjects off-center following the rule of thirds, with clear copy space for text overlay.
- **Do** use Elm Green exclusively for primary actions. One action color, one voice.
- **Do** use slightly desaturated photography that naturally aligns with the warm palette — greens and golds should feel present in the environment, not filtered on.
- **Do** keep body text at 65-75 characters per line maximum for comfortable reading.
- **Do** use organic shapes (soft-edged circles, leaf-inspired forms) at 3-6% opacity for subtle background texture.
- **Do** pair depth-of-field intentionally: shallow for people, deeper for environments.
- **Do** show real diversity in photography (age, gender, ethnicity, body type) reflecting the actual American workforce.

### Don't:

- **Don't** use stock photo clichés: stethoscope-on-keyboard, handshake closeups, people high-fiving, arms-crossed power poses, staged "diversity" shots.
- **Don't** use sterile hospital or clinical imagery. Kingsfoil is a broker, not a provider.
- **Don't** use overly corporate settings (glass towers, massive conference rooms, suits).
- **Don't** use fear or anxiety imagery (stressed person with head in hands, stacks of bills).
- **Don't** use cold blue color grading that conflicts with the warm brand temperature.
- **Don't** use harsh flash, overhead fluorescent lighting, dramatic shadows, or high-contrast chiaroscuro in photography.
- **Don't** use heavy vignetting, lens flare effects, or dramatic color manipulation.
- **Don't** apply purple-to-blue gradients, neon accents, or glassmorphism. These are SaaS template tells.
- **Don't** nest cards inside cards. One level of containment maximum.
- **Don't** use resting shadows on surfaces. The system is flat by default; shadows are earned through interaction.
- **Don't** use "trusted partner," "synergy," "leverage," or other hollow corporate language in UI copy. The brand voice is clear, calm, and specific.
- **Don't** use Playfair Display below 20px. Serifs at small sizes become noise.
- **Don't** use any imagery that could appear on any other insurance broker's website. If it's generic, it fails.
