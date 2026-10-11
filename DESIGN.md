# Hicaso — Style Reference
> deep navy with electric blue. Blue sparks on a near-black navy floor, with massive blocky display type announcing every move.

**Theme:** light

Adapted from the Wise style reference, with Wise's forest-green and lime palette recolored to Hicaso blue (the `#0071e3` / `#2997ff` blues of the previous Apple-style system and of the Hicaso logo's dot). Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Hicaso speaks in a confident, slightly loud voice: a deep navy (#0a2540) carries most of the surface area — text, nav, dark sections, icons — while a single electric blue (#0071e3) acts as functional punctuation on CTAs, active tabs, and key highlights. The display type is almost aggressive: a black-weight sans at 900, tightly tracked, shouted across the hero in 100px+ block letters. The rest of the system stays restrained on a near-white canvas with soft gray surfaces (#e8ebf0). Components are pill-shaped by default — buttons, nav segments, thumbnails, image masks — with gentle 10px radii reserved for cards and inputs. Color rarely gradients; instead, the blue–navy pairing inverts cleanly when sections go dark (Sky Blue #2997ff carries the accent on navy), creating rhythm without decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Navy Ink | `#0a2540` | `--color-navy-ink` | Dominant brand dark — nav text, dark section backgrounds, primary copy on light surfaces, icon strokes, filled navigation pills. This is the brand's gravity: wherever you need weight or authority, you reach for Navy Ink |
| Electric Blue | `#0071e3` | `--color-electric-blue` | The single accent — primary CTA fill (with Paper text), active tabs, selected states, the logo's dot. One electric-blue element per visible section is usually enough |
| Sky Blue | `#2997ff` | `--color-sky-blue` | Electric Blue's partner on dark surfaces — headlines, links and highlights on Navy Ink, where `#0071e3` is too dark to read (3.3:1). Sky Blue on Navy Ink is 5.2:1 |
| Deep Sea | `#0b3d91` | `--color-deep-sea` | Secondary dark blue for card surfaces, supporting iconography, and tonal depth on dark sections where Navy Ink is too heavy |
| Ice Mist | `#e6f0fd` | `--color-ice-mist` | Pale blue wash for soft highlight surfaces, tinted card backgrounds, nav hover states. A whisper of the brand blue for low-emphasis containers |
| Signal Blue | `#0b4c72` | `--color-signal-blue` | Muted steel-blue supporting accent for decorative details and low-frequency emphasis |
| Alarm Red | `#cb272f` | `--color-alarm-red` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Charcoal | `#454745` | `--color-charcoal` | Primary text, body copy, dense UI — slightly warm black that feels softer than pure #000 against white |
| Obsidian | `#0d0f14` | `--color-obsidian` | Display headlines, high-contrast headings, pure-black moments in nav and hero. Slightly blue-tinted black, not neutral gray |
| Pebble | `#868685` | `--color-pebble` | Muted secondary text, placeholder copy, icon strokes, input borders. The mid-gray that recedes |
| Slate | `#6a6c6a` | `--color-slate` | Supporting body text, helper labels, subdued iconography. One step darker than Pebble for slightly more emphasis |
| Fog | `#e8ebf0` | `--color-fog` | Card surfaces, section dividers, subtle panel backgrounds on the white canvas. Blue-tinted off-white, not pure neutral |
| Paper | `#ffffff` | `--color-paper` | Page canvas, inverted card surfaces, button text on Electric Blue fill |

## Tokens — Typography

### Inter — Body, UI, labels, and sub-headings across the entire product. The 700 weight handles mid-tier headings (36–45px), 500–600 for subheadings and labels, 400 for body and captions. Inter does the quiet work while the display face shouts. · `--font-inter`
- **Substitute:** Inter (native Google Fonts)
- **Weights:** 400,500,600,700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 22px, 25px, 36px, 45px, 61px, 300px
- **Line height:** 0.72, 1.00, 1.10, 1.25, 1.30, 1.40, 1.43, 1.44, 1.50, 1.55, 1.63, 1.71, 1.86, 2.17
- **Letter spacing:** -0.030em at 105px, -0.015em at 61px, -0.011em at 36px, -0.009em at 25px, -0.007em at 18px, -0.006em at 16px, -0.005em at 14px, -0.003em at 12px
- **OpenType features:** `"calt"`
- **Role:** Body, UI, labels, and sub-headings across the entire product. The 700 weight handles mid-tier headings (36–45px), 500–600 for subheadings and labels, 400 for body and captions. Inter does the quiet work while the display face shouts.

### Display (Wise Sans in the source) — Display headlines — the brand's signature shout. Ultra-heavy weight 900 at 89–105px with tight -0.03em tracking makes every headline a block-letter announcement. Used sparingly: hero, section openers, campaign moments. · `--font-display`
- **Substitute:** Inter Black (900) with -0.04em tracking (Wise Sans is proprietary to Wise and is not used)
- **Weights:** 900
- **Sizes:** 40px, 52px, 59px, 89px, 105px, 300px
- **Line height:** 0.85, 1.50
- **Letter spacing:** -0.0020em
- **OpenType features:** `"calt"`
- **Role:** Display headlines — the brand's signature shout. Ultra-heavy weight 900 at 89–105px with tight -0.03em tracking makes every headline a block-letter announcement. Used sparingly: hero, section openers, campaign moments.

### monospace — monospace — detected in extracted data but not described by AI · `--font-monospace`
- **Weights:** 400
- **Sizes:** 300px
- **Line height:** 
- **OpenType features:** `"calt"`
- **Role:** monospace — detected in extracted data but not described by AI

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 300px
- **Line height:** 
- **OpenType features:** `"calt"`
- **Role:** sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |
|------|--------|--------|------|-------------|----------------|-------|
| micro | — | — | 12px | 1.63 | -0.036px | `--text-micro` |
| caption | — | — | 14px | 1.55 | -0.07px | `--text-caption` |
| body-sm | — | — | 16px | 1.5 | -0.096px | `--text-body-sm` |
| body | — | — | 18px | 1.5 | -0.126px | `--text-body` |
| body-lg | — | — | 25px | 1.3 | -0.225px | `--text-body-lg` |
| subheading | — | — | 36px | 1.25 | -0.396px | `--text-subheading` |
| heading-sm | — | — | 45px | 1.1 | -0.495px | `--text-heading-sm` |
| heading | — | — | 61px | 1.1 | -0.915px | `--text-heading` |
| heading-lg | — | — | 89px | 0.85 | -2.67px | `--text-heading-lg` |
| display | — | — | 105px | 0.85 | -3.15px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 100 | 100px | `--spacing-100` |
| 124 | 124px | `--spacing-124` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 10px |
| inputs | 10px |
| buttons | 9999px |
| imageMasks | 1000px |
| largeCards | 28px |
| navSegments | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(13, 15, 20, 0.12) 0px 0px 0px 1px` | `--shadow-subtle` |
| subtle-2 | `rgb(134, 134, 133) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| xl | `rgba(0, 0, 0, 0.15) 0px 10px 32px 0px, rgba(0, 0, 0, 0.04) 0px 40px 40px 0px` | `--shadow-xl` |
| lg | `rgba(0, 0, 0, 0.08) 0px 6px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24px
- **Element gap:** 8-12px

## Components

### Primary CTA Pill Button
**Role:** The signature action element — filled electric-blue pill that signals "do this next."

Fully rounded (9999px radius) button with Electric Blue (#0071e3) fill and Paper (#ffffff) text (4.7:1). Padding 11px vertical, 24px horizontal. Inter weight 500 at 16px. No border, no shadow — the fill does all the work. On Navy Ink sections, the fill may switch to Sky Blue (#2997ff) with Navy Ink text.

### Outlined Pill Button
**Role:** Secondary action in the nav and inline CTAs.

White fill, 1px Navy Ink border, 9999px radius. Same padding as primary. Used for "Sign up" in the header and non-primary calls to action where the blue would compete with a primary action nearby.

### Text Link Button
**Role:** Inline secondary action with low visual weight.

Underlined Navy Ink text at 16px Inter weight 500, no background, no border. Pairs with the primary CTA when two adjacent actions are needed (e.g. "Explore products" + "About the studio").

### Top Navigation Bar
**Role:** Persistent header with brand, section switcher, and account access.

White background, 64px height. Logo left, three-segment pill nav with 9999px radius and Navy Ink text, right cluster with secondary links and an outlined pill.

### Segmented Tab Control
**Role:** In-page section switcher — single active state in electric blue.

Pill container (9999px radius) holding multiple text labels. Active tab: Electric Blue fill with Paper text. Inactive tabs: transparent with Charcoal text. ~40px height, 12px horizontal padding per segment.

### Display Headline
**Role:** The brand's voice — used in hero and major section openers.

Display face weight 900 at 89–105px, line-height 0.85, letter-spacing -3.15px. Obsidian (#0d0f14) or Navy Ink on light, Sky Blue (#2997ff) or Paper on dark sections. Set as block text, often in ALL CAPS for hero moments.

### Feature Row
**Role:** Three-column trust signal block — icon + heading + supporting line.

Single-column-on-mobile, three-column-on-desktop. Icon (24px, Charcoal stroke) at top, heading in Inter 700 at 18px, body in Inter 400 at 16px Slate. Generous 24px vertical gap between icon and heading.

### Grid Item (thumbnail + label)
**Role:** Circular thumbnail + name link in a 5-column grid.

Circular thumbnail (1000px radius, ~56px diameter), 12px gap to the name in Inter 500 at 16px Navy Ink. Name is a text link with no underline at rest, underline on hover. Items sit in a generous grid with ~32px row gap.

### Dark Section Card
**Role:** Inverted surface for emphasis — used for a key CTA block.

Navy Ink (#0a2540) background, 28px radius, 40px padding. Sky Blue (#2997ff) text for headline, Paper for body. May contain an inset white card (10px radius, 16px padding) for an interactive selector.

### Selector Pill
**Role:** Interactive picker with a "Change" action.

White pill inside a dark section card. Left: circular thumbnail (24px) + name in Charcoal Inter 500. Right: outlined "Change" button in Navy Ink. 9999px radius, 8px vertical padding.

### Input Field
**Role:** Form input — used for amounts, emails, references.

10px radius, 1px Pebble (#868685) border, 12px vertical and 16px horizontal padding. Inter 400 at 16px. Focus state: Navy Ink border, no glow ring.

### Floating Badge
**Role:** Persistent app-download or contact prompt.

Navy Ink (#0a2540) rounded square (16px radius), fixed bottom-right, 120px wide. Content in Paper at top, label in Sky Blue Inter 500 at 12px below.

### Badge / Tag
**Role:** Small status labels and category tags.

9999px radius, 8px vertical and 12px horizontal padding. Ice Mist (#e6f0fd) background with Navy Ink text, or Navy Ink background with Sky Blue text. Inter 500 at 12px.

## Do's and Don'ts

### Do
- Set display headlines at weight 900 with letter-spacing -3.15px at 105px; the extreme heaviness is the brand's signature — don't soften it to 700.
- Use Electric Blue (#0071e3) for primary action fills and active states; one electric-blue element per visible viewport section is usually enough.
- Default to 9999px radius for all buttons, tags, and nav segments — pill shapes are foundational, not decorative.
- Use Navy Ink (#0a2540) for text and dark surfaces, not pure black; the blue-tinted near-black is deeper and more on-brand.
- Apply tight negative letter-spacing at large sizes (-0.030em at 100px+ down to -0.003em at 12px); headings should feel compact, not airy.
- Pair a filled primary CTA with an underlined text link as the secondary action — never two filled buttons side by side.
- Invert section backgrounds from white to Navy Ink to create rhythm; Sky Blue text on navy is the system's built-in emphasis.

### Don't
- Don't use Charcoal (#454745) for display headlines — reserve Obsidian (#0d0f14) or Navy Ink for maximum contrast at large sizes.
- Don't introduce gradients, drop shadows beyond hairline borders, or decorative blurs — the system is flat by design.
- Don't use Electric Blue (#0071e3) as text on Navy Ink; at 3.3:1 it is too faint. Use Sky Blue (#2997ff) on dark surfaces instead.
- Don't use Sky Blue (#2997ff) as text on white; at 3.0:1 it fails body-text contrast. It is for dark surfaces and large accents only.
- Don't use sharp corners (0–4px radius) on buttons, tags, or nav elements; pills are the default shape language.
- Don't set display headlines in Inter regular weights — weight 900 is the only acceptable voice for 60px+ type.
- Don't stack multiple electric-blue elements close together; space them so the accent reads as a single punctuation mark.
- Don't use #000000 for body text; Charcoal (#454745) at 18px on white is the baseline that keeps the page from feeling harsh.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — the default background for all content sections |
| 1 | Fog | `#e8ebf0` | Card surfaces, soft panels, and section backgrounds on the white canvas |
| 2 | Ice Mist | `#e6f0fd` | Tinted highlight surfaces — pale blue wash for accent containers and hover states |
| 3 | Electric Blue | `#0071e3` | Active surface — selected tabs, primary CTA fill, emphasis zones |
| 4 | Navy Ink | `#0a2540` | Inverted surface — dark section backgrounds, nav, high-contrast blocks |

## Elevation

- **Cards:** `rgba(0, 0, 0, 0.15) 0px 10px 32px 0px, rgba(0, 0, 0, 0.04) 0px 40px 40px 0px`
- **Elevated panels:** `rgba(0, 0, 0, 0.08) 0px 6px 20px 0px`
- **Input/button focus:** `rgb(134, 134, 133) 0px 0px 0px 1px inset`
- **Icon containers:** `rgba(13, 15, 20, 0.12) 0px 0px 0px 1px`

## Imagery

In the source system, painted 3D-style illustrations of a single recurring object (a globe with gold coins) establish the brand's visual world — tactile, slightly surreal, rendered with soft gradients and warm light. Photography is minimal; when used, it's high-key and lifestyle-casual. Circular thumbnails in a 5-column grid act as the icon system. No abstract graphics, no stock patterns. For Hicaso, the equivalent is one recurring, warm object that signals the studio's reach, plus each product's own screenshots.

## Layout

Max-width 1200px centered container, with hero and dark sections going full-bleed. Hero pattern: centered massive display headline over white space, with a large illustration breaking the lower edge of the viewport. Section rhythm alternates white → light blue band (Ice Mist) → dark Navy Ink section, creating a natural color cadence. Content arrangement is predominantly centered stacks in the hero, then 2-column text+visual or 3-column feature rows in supporting sections. A 5-column grid handles directories. Navigation is a single sticky top bar with a segmented pill switcher. A badge may float fixed in the bottom-right corner across all scroll positions.

## Agent Prompt Guide

Quick Color Reference
- text: #454745 (Charcoal) for body, #0d0f14 (Obsidian) for display
- background: #ffffff (Paper) canvas, #e8ebf0 (Fog) cards
- border: #868685 (Pebble) for hairlines, #0a2540 (Navy Ink) for emphasis
- accent: #0071e3 (Electric Blue) for active states and highlights; #2997ff (Sky Blue) on dark surfaces
- primary action: #0071e3 (Electric Blue) fill with #ffffff text
- dark surface: #0a2540 (Navy Ink) for inverted sections

Example Component Prompts

1. Primary CTA pill: #0071e3 fill, #ffffff text, Inter 500 at 16px, 11px 24px padding, 9999px radius, no border or shadow. Pair with an underlined Navy Ink text link as the secondary action.

2. Feature row (3-column): icon at 24px stroke #454745, 24px gap to heading at 18px Inter 700 in #0d0f14, 8px gap to body at 16px Inter 400 in #6a6c6a. Column gap 32px, centered max-width 1200px.

3. Grid item: circular thumbnail at 56px diameter (1000px radius), 12px vertical gap to name in Inter 500 at 16px #0a2540. Arranged in a 5-column grid with 32px row gap and 24px column gap. Hover state: underline appears on the name.

4. Dark section card: Navy Ink (#0a2540) background, 28px radius, 40px padding. Headline in Sky Blue (#2997ff) at 36px Inter 700. Body text in #ffffff at 16px Inter 400. May contain an inset white card (10px radius) for a selector: circular thumbnail + name in Charcoal + outlined "Change" button.

5. Outlined nav button: white fill, 1px solid #0a2540 border, 9999px radius, 8px 16px padding, Inter 500 at 16px in #0a2540. Used in the top-right nav cluster for secondary actions.

## Similar Brands

- **Wise** — The source of this system's structure: deep brand color as dominant surface and text, one bright accent, pill shapes, 900-weight display type.
- **Revolut** — Same dual-brand color strategy — deep brand color as dominant surface and text, one bright accent for CTAs and highlights, with pill-shaped buttons and large confident headlines.
- **Monzo** — Bright single-accent color system on a neutral canvas, pill-shaped interactive elements, friendly rounded geometry, and display type that speaks directly to the user.
- **Cash App** — High-contrast near-black text on white with a single vivid brand accent, oversized bold headlines as the primary brand expression, minimal decoration.
- **N26** — Flat surfaces, hairline borders instead of shadows, generous white space, and a single saturated accent color driving all interactive emphasis.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-navy-ink: #0a2540;
  --color-electric-blue: #0071e3;
  --color-sky-blue: #2997ff;
  --color-deep-sea: #0b3d91;
  --color-ice-mist: #e6f0fd;
  --color-signal-blue: #0b4c72;
  --color-alarm-red: #cb272f;
  --color-charcoal: #454745;
  --color-obsidian: #0d0f14;
  --color-pebble: #868685;
  --color-slate: #6a6c6a;
  --color-fog: #e8ebf0;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; /* set at weight 900 */
  --font-monospace: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sans-serif: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.63;
  --tracking-micro: -0.036px;
  --text-caption: 14px;
  --leading-caption: 1.55;
  --tracking-caption: -0.07px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.096px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.126px;
  --text-body-lg: 25px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.225px;
  --text-subheading: 36px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.396px;
  --text-heading-sm: 45px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.495px;
  --text-heading: 61px;
  --leading-heading: 1.1;
  --tracking-heading: -0.915px;
  --text-heading-lg: 89px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -2.67px;
  --text-display: 105px;
  --leading-display: 0.85;
  --tracking-display: -3.15px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-124: 124px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px; /* 64–80px */
  --card-padding: 24px;
  --element-gap: 8px; /* 8–12px */

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 18.7693px;
  --radius-3xl: 28.1539px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 37.5385px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 10px;
  --radius-inputs: 10px;
  --radius-buttons: 9999px;
  --radius-imagemasks: 1000px;
  --radius-largecards: 28px;
  --radius-navsegments: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(13, 15, 20, 0.12) 0px 0px 0px 1px;
  --shadow-subtle-2: rgb(134, 134, 133) 0px 0px 0px 1px inset;
  --shadow-xl: rgba(0, 0, 0, 0.15) 0px 10px 32px 0px, rgba(0, 0, 0, 0.04) 0px 40px 40px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 6px 20px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-fog: #e8ebf0;
  --surface-ice-mist: #e6f0fd;
  --surface-electric-blue: #0071e3;
  --surface-navy-ink: #0a2540;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-navy-ink: #0a2540;
  --color-electric-blue: #0071e3;
  --color-sky-blue: #2997ff;
  --color-deep-sea: #0b3d91;
  --color-ice-mist: #e6f0fd;
  --color-signal-blue: #0b4c72;
  --color-alarm-red: #cb272f;
  --color-charcoal: #454745;
  --color-obsidian: #0d0f14;
  --color-pebble: #868685;
  --color-slate: #6a6c6a;
  --color-fog: #e8ebf0;
  --color-paper: #ffffff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monospace: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sans-serif: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.63;
  --tracking-micro: -0.036px;
  --text-caption: 14px;
  --leading-caption: 1.55;
  --tracking-caption: -0.07px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.096px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.126px;
  --text-body-lg: 25px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.225px;
  --text-subheading: 36px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.396px;
  --text-heading-sm: 45px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.495px;
  --text-heading: 61px;
  --leading-heading: 1.1;
  --tracking-heading: -0.915px;
  --text-heading-lg: 89px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -2.67px;
  --text-display: 105px;
  --leading-display: 0.85;
  --tracking-display: -3.15px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-124: 124px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 18.7693px;
  --radius-3xl: 28.1539px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 37.5385px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(13, 15, 20, 0.12) 0px 0px 0px 1px;
  --shadow-subtle-2: rgb(134, 134, 133) 0px 0px 0px 1px inset;
  --shadow-xl: rgba(0, 0, 0, 0.15) 0px 10px 32px 0px, rgba(0, 0, 0, 0.04) 0px 40px 40px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 6px 20px 0px;
}
```
