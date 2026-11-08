# Hicaso full redesign (taste skill): design

**Status:** approved by the owner 2026-11-08 (answers below) · 2026-11-08 · branch `feat/services-studio`
**Supersedes (once approved):** the look and layout parts of `2026-11-05-hicaso-services-and-studio-design.md`.
The content structure (services, products, enquiry flow) stays.

## Intent

The owner asked for the whole Hicaso site (14 routes) to be redesigned using the installed skills,
with stand-in photographs where Hicaso has none. `design-taste-frontend` (tasteskill 2.5) leads the
look, layout, copy and checks. The other skills only check what they are good at:
`ecc:accessibility` for keyboard and contrast, `magic-ui` and Lightswind as component sources.
Running all 42 UI skills at once is not the plan, because their rules conflict.

## What changes from earlier decisions

| Earlier | Now |
|---|---|
| DESIGN.md (Mollie) layout and type | tasteskill's system: dealt heroes, one section per screen, its type scale |
| Awesomic zinc palette, Ember accent | Dealt palette **putty-black-teal**: ground `#dedad3`, surface `#d3cec6`, ink `#0a0a0a`, accent `#256f82` |
| Inter | Dealt pairing **Instrument Sans + DM Mono** (headlines 500 on tech) |

The memory note "colours from Awesomic" must be updated once this is approved.

## Kind

Every page is **software** (`data-type="software"`, site-kind software). Hicaso builds AI, mobile
and web software and runs its own products (AppKavo, BillMinute), so the trade has a technical
subject. That allows one effect per page, which keeps the Orb. *(My call: "service" would fit the
hiring side, but it bans the Orb the owner asked for.)*

## The deal (site-wide; printed by the skill's dealers, not chosen)

- **Palette:** `putty-black-teal`. A warm stone ground with a teal accent reads as a calm,
  engineering-led studio rather than a loud agency. Radius `soft`.
- **Type:** `instrument` (Instrument Sans + DM Mono).
- **Parts:**
  - Nav: `nav-mega`, which is close to the current mega panel.
  - Footer: `footer-statement`.
  - Close: `close-type`.
  - Rhythm: `surface-pairs`.
  - Buttons: `solid`.
  - Mark: `dots`, beside the existing Hicaso logo. The client logo wins.
- **Home hero:** `collage`. The text sits on the left (5 columns). The art sits on the right
  (6 columns): one product window on a lit ground, cut by the frame's right and bottom edges, with
  a small result card over its lower-left corner.
- **Moments:**
  - `pinned-chapters` goes on the how-we-work steps.
  - `counter-rolls` needs real figures, so it is dealt again unless real numbers arrive.

## Rulings (my calls; each can be overturned)

1. **Multi-page, not one page.** tasteskill assumes a one-page site, with every link to an `#id`
   and no `/contact`. Hicaso keeps its 14 routes and their links. Each route is built as its own
   tasteskill page and passes the gate on its own.
2. **Next.js, not static HTML.**
   - The kit (`system.css`, `system.js`, `motion`, `layout`) is copied unchanged into
     `public/assets` and loaded from `layout.tsx`, as the skill's "existing project" path says.
   - Components move to the starter's markup and classes.
   - Existing CSS Modules are deleted as each page is rebuilt.
3. **Demo proof stays dev-only (owner's decision).** The client strip (LogoMarquee), the stats row,
   the case studies and the testimonials are restyled in the new system. They still render only
   when `showProof` allows it (dev), never in production.
   - The gate runs against the dev server, so it will see them. Any checker finding about invented
     proof is waived with the reason "dev-only placeholder, hidden in production by showProof".
   - `counter-rolls` stays off until real figures arrive.
4. **Owner-requested pieces stay:** the Orb, the SpecularButton, the logo-dot animation and the
   nav menu behaviour, restyled to the new palette.
5. **Stand-in photographs** come from `photos.mjs` (Wikimedia/picsum, licensed).
   - Use: places of work, devices in use, close-ups of hardware.
   - Never: a stock face presented as a Hicaso employee or client.
   - Every stand-in is listed in the final report with the shot to replace it.

## Pages (one line per section: id · idea · picture)

**Home** (`/`)
1. hero · AI, mobile and web software for global companies · collage: Orb as the lit ground,
   AppKavo window, result card
2. services · four things Hicaso builds · features-2x2, a UI fragment per service
   (chat reply, agent run, phone screen, deploy log)
3. products · Hicaso runs its own software · app-frame of AppKavo, with BillMinute as a second tab
4. how-we-work · four steps from brief to launch · pinned-chapters moment, one picture per step
5. stack · tools we ship with · `hub-tools` diagram card with real icons
   (React, Next.js, Flutter, Laravel, Node.js, OpenAI)
6. faq · calm section
7. close-type · Start a project

**Services** (`/services`, 4 detail pages)
- Index: hero, then a services list with one line each and links.
- Each detail page:
  - hero (split: text and that service's UI fragment)
  - what we build: three cards
  - process: steps
  - stack icons
  - faq
  - close

**Products** (`/products`, AppKavo, BillMinute)
- Index: hero and two product cards.
- Detail pages keep their own brand themes (AppKavo orange on dark, BillMinute blue):
  - hero: product window
  - features
  - how it works
  - faq
  - close

**About, Careers:** hero (statement or split with a stand-in workplace photo), a few sections
each, close. **Contact:** the starter's booking form with the existing enquiry no-JS fallback.
**Privacy, Terms:** plain text pages in the new system.

## Build order and checks

1. **Foundation:**
   - kit files
   - tokens from `start.mjs css`
   - fonts
   - nav (nav-mega)
   - footer (footer-statement + close-type)
2. **Home:** to `GATE: PASS` (or OPEN after 3 rounds).
3. **Services:** index and 4 detail pages.
4. **Products:** index and 2 detail pages.
5. **About, Careers, Contact, Privacy, Terms.**
6. **Whole-site checks:**
   - lint
   - the 21 tests
   - `next build`
   - copy-lint
   - the gate per page
   - widths 1440, 1024, 820, 768 and 390
   - reduced motion
   - one final whole-branch review

## Non-goals

- New products or new content beyond rewriting copy to tasteskill's rules.
- Real client logos, figures or quotes. These come from the owner.
- Any change to the enquiry form's backend.

## Owner's answers (2026-11-08)

1. **Hero:** collage as dealt. The Orb is the lit ground inside the right-hand art frame, behind
   the AppKavo window and the result card.
2. **Palette:** the dealt `putty-black-teal`. It replaces the Awesomic palette.
3. **Demo proof:** keep it dev-only, restyled. Ruling 3 above.
