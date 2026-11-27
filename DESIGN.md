# Hicaso — Design System

Recorded from the running code on 2026-11-18 (replaces a stray "Mollie" style reference). The site is built on the
**taste-skill kit**: `public/assets/system.css`, `system.js`, `motion/`, `moments/`, `ui/`, `diagrams/` are copied
from the kit and **never edited**; page CSS lives in `src/app/globals.css`. The kit's checker (`gate.mjs`,
`consistency.mjs`) is the quality bar.

## Identity
- Page kind: `software` (`<html data-type="software">`, `site-kind` software). Radius `soft`, buttons `solid`.
- Calm, white, blueprint-blue. The product's own UI (AppKavo, BillMinute, agent runs) is the imagery; stock
  photographs only as credited stand-ins until the owner supplies real ones.

## Tokens (layout.tsx `ROOT_TOKENS`, printed by `start.mjs brand`)
| Role | Value |
|---|---|
| Background | `#ffffff` |
| Surface (alt ground, panels) | `#f1f1f1` |
| Ink | `#0a0a0a` |
| Muted | `#6c6c6c` (labels and captions only; body text stays in ink, 7:1) |
| Accent / action | `#2456d6` on `#ffffff` ink |
| Inverse (one dark band, dark UI) | bg `#0a0a0a`, surface `#171717`, ink `#ffffff`, muted `#979797` |
| Lit frame ground (gradient mesh) | `#c6d3df` / `#d6e0e9` with `#2456d6` accent |

Never violet or lavender. Grounds: `--g-main` white, `.ground-surface` grey, `.ground-inverse` at most once per page.

## Type
- Display and text: **Instrument Sans** (display weight 500, tracking -0.028em, -0.036em at XL, stretch 96%).
- Mono: **DM Mono** for code, file names, meta.
- One heading scale from the kit; body 16px minimum; headings name things; grey half-sentences in h2 are their own sentence.

## Layout rules (kit)
- One section per screen at 1440x900: every section 1 or 2 screens (`--h`, phone `--hm`), h2 first, `.wrap` edges equal.
- 12-column grid (`span-*`, `start-*`); a given layout pattern at most twice per page (`card-layout`).
- Hero alone on the first screen, entering once (`data-enter`); no captions under images (house rule 1).
- At most one dark band, mid-page or later; the footer is the light `footer--statement` close.

## Components
- Buttons: `.btn--primary` (blue), `.btn--secondary` (outline); the home hero's primary is `SpecularButton` (the page's one pointer effect).
- Cards and panels: `.card`, `.panel`, `.frame--fill`, `.frame--photo`; UI fragments from `assets/ui` rewritten to Hicaso's subjects.
- Lists: `.rows` (name, value, text); tabs `.tabs/.tab` (`aria-selected`; toggle groups use `aria-pressed`).
- Diagrams: `data-diagram` hub with real colour icons from `public/assets/icons` (fetched with `icons.mjs`, credited).

## Motion
- Kit motion layer: hero entrance, hover lift 2px, button step/press, card loops 2.5–4 s with pause.
- Moments are **dealt** (`moments.mjs pick`), 1–2 per page; home has `pinned-chapters` (How a project runs). Home page scroll motion (owner's choice 2026-11-25, replacing the 2026-11-23 ban): `HomeMotion.tsx` reveals each section once (headline lines, copy, cards, panels, counting figures), drifts panel screens and opens the dark band; off under reduced motion.
- anime.js 4.5 only for click-run demos (product pages) and the enquiry form's sent tick; never on scroll; reduced motion shows end states.
- GSAP 3.15 (owner's choice 2026-11-23) for the home page's one authored sequence and one state change: the hero's AppKavo window audits the build once after the entrance (`HeroAudit.tsx`), and the product tabs bring the opening window into focus (`ProductTabsMotion.tsx`); the hero screens are dealt on load (`HeroDeal.tsx`) and the nav animates (`NavMotion.tsx`). The written page is always the end state.
- Lenis 1.3 smooth scrolling site-wide except /admin (`SmoothScroll.tsx`, owner's choice 2026-11-23, knowingly against the kit's no-steering rule): wheel and trackpad only, native touch, off under reduced motion, native anchor jumps.
