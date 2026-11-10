# Hicaso Taste Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all 14 Hicaso routes on the tasteskill (`design-taste-frontend`) system with the dealt palette, type, nav, footer and home collage hero, each route passing the tasteskill gate.

**Architecture:**
- The kit's CSS and JS are copied unchanged into `public/assets` and loaded once from the root layout. Pages become server components that emit the starter's markup and classes.
- Kit scripts load after hydration (`next/script`, `afterInteractive`), so their DOM changes never race React.
- Internal links are plain `<a>`, not `next/link`. Every route is a full document load, and the kit initialises on each page.
- Tailwind and the old CSS Modules are removed as their pages are rebuilt.

**Tech Stack:** Next.js 16.2.12 App Router, React 19.2, TypeScript, tasteskill 2.5.1 kit (plain CSS + ES-module JS), Node 22+ `node --test`, headless Chrome over CDP.

**Spec:** `docs/superpowers/specs/2026-11-08-hicaso-taste-redesign-design.md`

`SK` below = `~/.claude/skills/design-taste-frontend`. Read `SK/SKILL.md` and `SK/references/{copy,copy-voice,system,layout-v4,sections}.md` in full before Task 3. The skill requires this.

## Global Constraints

- **Palette.** Paste the `:root` block exactly as `node SK/scripts/start.mjs css --page software --palette putty-black-teal --type instrument --radius soft` prints it, including `--p-bg: #dedad3; --p-surface: #d3cec6; --p-ink: #0a0a0a; --p-accent: #256f82` and `--ly-scale: 1.04`.
- **Fonts.** Instrument Sans (wdth 75..100, wght 400..700) and DM Mono 400/500, loaded with the Google Fonts `<link>` the dealer prints. Not `next/font`, because the checker's `font-load` reads the family name.
- **Root element.** `<html lang="en" data-type="software" data-radius="soft" data-ground="sand" data-buttons="solid" data-motion suppressHydrationWarning>`.
- **Metas.** `page-type=software`, `site-kind=software` on every route.
- **Dealt parts.** nav `nav-mega`, footer `footer-statement`, close `close-type`, rhythm `surface-pairs`, buttons `solid`, mark: Hicaso's own `Logo` (the client logo replaces the dealt `dots` mark).
- **Kit files.** Kit files under `public/assets/` are byte-identical to `SK/assets/` (the gate's `kit-edited`). Copy only the folders a page loads. Never `photos/`, `scenes/`, `objects/` or `_demo/` images unless a page uses them.
- **Dependencies.** No new runtime npm dependencies. Remove `tailwindcss`, `@tailwindcss/postcss` and `postcss.config.mjs`.
- **Links.** Internal links are `<a href="/route">`. External links get `rel="noopener noreferrer"`. The main action reads **"Start a project"** everywhere (nav, hero, close) and points to `/contact`.
- **Owner pieces stay.**
  - `Orb`: its colours as given, with `backgroundColor` matched to the art frame's ground.
  - `SpecularButton`: the home hero's main action.
  - `Logo`: dot animation.
  - `LogoMarquee`: dev-only client strip.
- **Demo proof.** It renders only when `showProof(proof.demo)` is true (dev). Waive any checker finding on it with the reason `dev-only placeholder, hidden in production by showProof`.
- **Product themes.** `src/components/products/themeStyle.ts` themes (AppKavo `#0a0a0c`/`#fb8c2e`, BillMinute `#1f4fd8`) keep their brand colours on product detail pages.
- **Copy.** Every route passes `node SK/scripts/copy-lint.mjs <draft.md or rendered html> --kind software` with 0 FAIL. Use the h1 rules from `copy.md`: category plus buyer, at most 3 lines.
- **Gate.**
  - Each route: `node SK/scripts/gate.mjs --start http://localhost:3000<route> --new --kind software --category "AI, mobile and web software development" --primary "Start a project"`, then `node SK/scripts/gate.mjs` until the last line is `GATE: PASS` or `GATE: OPEN`, 3 rounds at most.
  - Run from the project root with `npm run dev` up.
  - Waivers go in `.taste-skill/waivers.json`, 5 at most per build.
  - Add `.taste-skill/` and `shots/` to `.gitignore`.
- **Stand-in photographs.** From `node SK/scripts/photos.mjs search "<plain words>"` into `public/assets/photos/`. No stock face is shown as a Hicaso person. The footer credit line comes from `photos.mjs credits`.
- **Skill prerequisite.** `SK/package.json` must contain `{"type":"module"}`, because `~/.claude/package.json` forces CommonJS. It is already in place on this machine.

## Review Focus

1. **Hydration errors from kit DOM edits** (word masks, `html.m-enter`, nav classes). Expect no React hydration warning in the console on any route. Pinned by `scripts/smoke.mjs` (Task 1), which fails on any console `error`.
2. **A route opened after clicking a nav link.** Expect the kit initialised there too: the hero entrance done, the nav menu opening. Pinned by smoke's "navigate by click" case (Task 2).
3. **JavaScript off.** Expect every h1 and the main button visible, with no words left hidden by `m-enter`. Pinned by smoke's JS-off case (Task 1).
4. **Reduced motion.** Expect the Orb, the marquee and the moments still, and nothing hidden. Pinned by smoke's reduced-motion case (Task 3).
5. **The `/contact` enquiry with JS off.** Expect the form to still submit through the existing no-JS fallback. Pinned by `src/lib/enquiry.test.ts` (existing) plus smoke's form-action assertion (Task 7).

---

### Task 1: Foundation — kit, tokens, fonts, layout shell, smoke test

**Files:**
- Create: `public/assets/` (copied from `SK/assets/`: `system.css`, `system.js`, `motion/{motion.css,motion.js}`, `layout/{layout.css,layout.js}`, `ui/{base.css,cards.css,ui.js}`, `icons/icon.css`, `backgrounds/{backgrounds.css,backgrounds.js}`, `diagrams/{diagram.css,diagram.js,mount.js,presets.json}`)
- Create: `scripts/smoke.mjs`
- Modify: `src/app/layout.tsx`, `src/app/globals.css` (rewrite), `package.json` (scripts, remove Tailwind), `eslint.config.mjs`, `.gitignore`
- Delete: `postcss.config.mjs`

**Interfaces:**
- Produces: `npm run smoke`. It exits non-zero on any failed assertion and reads routes from a `ROUTES` array at the top of the file. Later tasks extend `ROUTES` and add cases.
- Produces: root `<html>` attributes and metas (Global Constraints). Pages emit only `<main>` content.

- [ ] **Step 1: Write the failing smoke test** `scripts/smoke.mjs` (no dependencies).
  - Driver: spawn `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --remote-debugging-port=<port> --user-data-dir=<tmp>`, fetch `http://127.0.0.1:<port>/json`, and drive the page target over the global `WebSocket` (CDP: `Page.navigate`, `Runtime.evaluate`, `Emulation.setDeviceMetricsOverride`, `Emulation.setScriptExecutionDisabled`, `Emulation.setEmulatedMedia`). Kill Chrome by PID at the end.
  - Collect console `error` entries and `Runtime.exceptionThrown`.
  - For each route in `ROUTES` (start: `["/"]`), at 1440x900 and 390x844, assert:
    - HTTP 200
    - `document.documentElement.dataset.type === "software"`
    - `getComputedStyle(document.body).backgroundColor === "rgb(222, 218, 211)"`
    - `document.fonts.check('16px "Instrument Sans"')`
    - exactly one `h1`
    - `scrollWidth <= innerWidth`
    - zero console errors
  - JS-off case: the `h1`'s bounding box has height > 0 and its computed `opacity` is `"1"`.
- [ ] **Step 2:** Run `npm run smoke`. Expected: FAIL on background colour and font (old Awesomic white, Inter).
- [ ] **Step 3:** Copy the kit folders listed above with `cp`. Rewrite `globals.css` without `@import "tailwindcss"` and `@theme`. Keep only rules no kit file provides, for example `.sr-only` if still used.
- [ ] **Step 4:** Rewrite `src/app/layout.tsx`:
  - Root attributes and metas: Global Constraints.
  - Head, in this order:
    1. the Google Fonts links
    2. `<link rel="stylesheet" href="/assets/...">` in the order `start.mjs css` prints
    3. `<style>` with the `:root` block
    4. the `m-enter` inline script from `SK/assets/starter.html`, verbatim
    5. `/assets/backgrounds/backgrounds.js` (plain, not deferred)
  - Body end: `next/script` `strategy="afterInteractive"` `type="module"` for `/assets/system.js`, `/assets/motion/motion.js`, `/assets/layout/layout.js`, `/assets/diagrams/mount.js`.
  - Keep `bricolage` and `poppins` `next/font` (product themes). Drop Inter, Plex Mono and Adamina.
  - Keep `Header`/`Footer` imports. Task 2 rewrites them.
- [ ] **Step 5:**
  - `package.json`: add `"smoke": "node scripts/smoke.mjs"`, remove `tailwindcss` and `@tailwindcss/postcss`, then run `npm install`.
  - Delete `postcss.config.mjs`.
  - In `eslint.config.mjs`, turn off `@next/next/no-html-link-for-pages`, with a comment: full loads so the kit initialises per page.
  - Add `.taste-skill/` and `shots/` to `.gitignore`.
- [ ] **Step 6:** Run `npm run lint && npm test && npm run smoke`. Expected: lint clean, 21 tests pass, smoke PASS on `/`. The old home content will look broken in the new system, which is expected until Task 3.
- [ ] **Step 7: Commit** `feat: tasteskill foundation (kit, tokens, fonts, smoke test)`.

### Task 2: Nav (nav-mega) and footer.closing (close-type + footer-statement)

**Files:**
- Modify: `src/components/layout/Header.tsx` (rewrite as a server component, no state), `src/components/layout/Footer.tsx` (rewrite), `src/components/ui/Logo.tsx` (an `<a href="/">` with the `nav__logo` class; dot animation kept)
- Delete: `src/components/layout/Header.module.css`, `src/components/layout/Footer.module.css`, `src/components/common/ClosingCTA.tsx`, `src/components/common/ClosingCTA.module.css`
- Modify: `scripts/smoke.mjs`, every page that imports `ClosingCTA` (remove the import and usage)

**Interfaces:**
- Consumes: `services` (`src/data/services.ts`), `products` (`src/data/products.ts`), `ENQUIRY_TO` (`src/lib/enquiry.ts`).
- Produces: `<Header/>` and `<Footer/>` rendered by the layout. The footer's close row is site-wide; pages no longer render a close.

- [ ] **Step 1: Failing smoke cases.**
  - At 1440, clicking the `.nav__link` "Services" makes `.nav__menu` visible.
  - Clicking the "About" link loads `/about`, where `html` has class `m-enter-done`. This is Review Focus 2.
  - `footer.closing .close--type a.btn--primary` has text "Start a project" and `href="/contact"`.
  - At 390, `.nav__toggle` has `aria-expanded="false"` and becomes `"true"` on click.
- [ ] **Step 2:** Run smoke. Expected: FAIL (old markup).
- [ ] **Step 3:** Rebuild `Header` from `SK/assets/starter.html` lines 93–150. Replace `#id` hrefs with routes.
  - Services menu: the 4 services plus "All services", and one menu card.
  - Products menu: AppKavo, BillMinute, "All products".
  - Plain links: About, Careers.
  - Actions: `btn btn--primary` "Start a project" → `/contact`.
  - Recipe: `SK/references/sections-library.md`, nav-mega.
- [ ] **Step 4:** Rebuild `Footer` from `starter.html` lines 358–398.
  - Row 1: `close--type`, with the h2 and line written to `copy.md` rules and the button "Start a project".
  - Row 2: `footer-statement` from sections-library, with links to every route plus `mailto:${ENQUIRY_TO}`, and a slot for the photo credit line.
- [ ] **Step 5:** Run `npm run lint && npm run smoke`. Expected: PASS.
- [ ] **Step 6: Commit** `feat: kit nav-mega and closing footer`.

### Task 3: Home — collage hero

**Files:**
- Modify: `src/components/home/Hero.tsx` (rewrite)
- Delete: `src/components/home/Hero.module.css`
- Modify: `src/components/ui/Orb.tsx` (only a `className`/`style` passthrough if needed; no shader change)
- Copy: `SK/assets/ui/window/*` → `public/assets/ui/window/` (plus any fragment the result card uses); add its `fragment.css` link to the layout head
- Modify: `scripts/smoke.mjs`

**Interfaces:**
- Consumes: `Orb`, `SpecularButton` (`href` prop), Task 1 head links.

- [ ] **Step 1: Failing smoke cases on `/`.**
  - `section.hero[data-enter]` exists.
  - The art frame holds a `canvas` (the Orb) and a `.window`.
  - The hero's bottom is within ±2px of `innerHeight` at 1440x900 and 390x844.
  - The h1 has 3 lines or fewer (count distinct `top`s of its word boxes).
  - Reduced-motion case: after 2 s, `document.getAnimations()` has no running animation inside the hero. This is Review Focus 4.
- [ ] **Step 2:** Run smoke. Expected: FAIL.
- [ ] **Step 3:** Build from `SK/assets/layout/hero-collage.html` (the `<section class="hero …" data-enter>` only).
  - **Text** (span-5): the h1 "AI, mobile and web software for global companies", the current lead, `SpecularButton href="/contact"` "Start a project", and secondary `btn btn--secondary` "See our products" → `/products`.
  - **Art** (span-6 start-7):
    - the Orb filling the frame as the lit ground, with `backgroundColor` equal to the frame's ground colour
    - the `window` fragment rewritten to AppKavo's content (from `src/data/products.ts`)
    - one result card
  - Follow the measurements `node SK/assets/layout/deal.mjs --type software --has ui,photo` prints for `collage`: art 628x716 at 1440; 342 wide at 390, with the card hidden on a phone.
- [ ] **Step 4:** Run smoke. Expected: PASS. Then run `node SK/scripts/shoot.mjs --url http://localhost:3000/ --w 1440 --out shots/home-1440.png --profile .taste-skill/chrome-check` and look at the shot.
- [ ] **Step 5: Commit** `feat: home collage hero with Orb and AppKavo window`.

### Task 4: Home — sections and gate

**Files:**
- Modify: `src/app/page.tsx`
- Rewrite: `src/components/home/ServicesGrid.tsx` (features-2x2), `src/components/home/Products.tsx` (app-frame), `src/components/common/HowWeWork.tsx` (steps with the `pinned-chapters` moment), `src/components/home/StackSection.tsx` (hub diagram + real icons), `src/components/common/FAQ.tsx` (`.faq`, answers open), `src/components/home/Proof.tsx` (restyled, dev-only)
- Delete: their `.module.css` files, `src/components/home/WhyHicaso.*` (its points fold into steps or FAQ copy), and `src/components/common/StackGrid.*` once unused
- Copy: the UI fragments used, `SK/assets/moments/{moments.js,lib.js,pinned-chapters/}` → `public/assets/moments/`, icons via `node SK/scripts/icons.mjs scan <rendered page> --out public/assets/icons --colour`

**Interfaces:**
- Consumes: `services`, `products`, `proof`, `showProof`.
- Produces:
  - `FAQ({ items }: { items: { q: string; a: string }[] })`, the same props as today, reused by Tasks 5–6.
  - `HowWeWork()`, reused by Task 5.

- [ ] **Step 1:** Write the home copy as a draft (`docs/superpowers/plans/assets/home-copy.md`): every heading, line and button. Run `node SK/scripts/copy-lint.mjs docs/superpowers/plans/assets/home-copy.md --kind software`. Expected: 0 FAIL.
- [ ] **Step 2:** Build the sections in the spec's order: services → products → how-we-work → stack → (dev-only proof) → faq.
  - Each section is `<section class="section" id=… aria-labelledby=…><div class="wrap">…`, with its h2 first and `--h` 1 or 2.
  - Recipes: `sections-library.md` features-2x2, app-frame, steps; `diagrams.md` (a hub preset).
  - Rhythm `surface-pairs`: one `.ground-surface` band covering services and products.
- [ ] **Step 3:** Mount `pinned-chapters` exactly as `SK/assets/moments/_demo/in-page-service.html` shows. Add the `modulepreload` links (`moments.js`, `lib.js`, `pinned-chapters/moment.js`) to the layout head.
- [ ] **Step 4:** Run `npm run lint && npm test && npm run smoke`. Expected: PASS.
- [ ] **Step 5: Gate.**
  - Run `node SK/scripts/gate.mjs --start http://localhost:3000/ --new --kind software --category "AI, mobile and web software development" --primary "Start a project"`, then `node SK/scripts/gate.mjs`.
  - Fix and rerun until the last line is `GATE: PASS` or `GATE: OPEN`.
  - Expected waivers:
    - `button-styles` on the SpecularButton: "owner-requested SpecularButton as the hero's main action"
    - demo proof findings: the Global Constraints reason
- [ ] **Step 6: Commit** `feat: home sections on tasteskill` (put the gate line in the commit body).

### Task 5: Services index and the four service pages

**Files:**
- Rewrite: `src/app/services/page.tsx`, `src/app/services/[slug]/page.tsx`
- Delete: `src/app/services/services.module.css`, `src/app/services/[slug]/service.module.css`

**Interfaces:**
- Consumes: `services`, `getService(slug)`, `FAQ`, `HowWeWork`.

- [ ] **Step 1:** Add `/services` and the 4 slugs (`generative-ai`, `agentic-ai`, `mobile-app-development`, `web-development`) to smoke `ROUTES`. Run. Expected: FAIL on the old styling.
- [ ] **Step 2:** Write the copy drafts and run copy-lint. Expected: 0 FAIL.
- [ ] **Step 3:** Build the pages.
  - Index: the hero dealt by `node SK/assets/layout/deal.mjs --type software --has ui --history .taste-skill/layout-history.json` (use what it prints), then a services-list.
  - Detail, in order:
    1. the dealt hero with that service's UI fragment
    2. three feature cards
    3. `HowWeWork`
    4. stack icons
    5. `FAQ`
- [ ] **Step 4:** Run smoke on all 5 routes. Gate `/services` and `/services/generative-ai`. Run `node SK/scripts/consistency.mjs <url> --quick --widths 1440,390 --page software` on the other three slugs.
- [ ] **Step 5: Commit** `feat: services pages on tasteskill`.

### Task 6: Products index and AppKavo / BillMinute pages

**Files:**
- Rewrite: `src/app/products/page.tsx`, `src/app/products/[slug]/page.tsx`, `src/components/products/ProductPanel.tsx`
- Delete: `src/app/products/products.module.css`, `src/app/products/[slug]/product.module.css`, `src/components/products/ProductPanel.module.css`
- Keep: `src/components/products/themeStyle.ts`. Its values now set the kit's `--p-*` tokens on the product page wrapper.

- [ ] **Step 1:** Add `/products`, `/products/appkavo` and `/products/billminute` to smoke. On `/products/appkavo`, assert the hero ground computes to `rgb(10, 10, 12)`. Run. Expected: FAIL.
- [ ] **Step 2:** Build the pages.
  - Index: dealt hero, then two product cards linking to the detail pages.
  - Detail, in order:
    1. hero with the product `window`
    2. features
    3. steps
    4. `FAQ`
  - Map the theme to `--p-bg`, `--p-ink`, `--p-accent` and `--p-action` inside the page wrapper.
- [ ] **Step 3:** Run smoke and gate each detail page. Expected: PASS or OPEN.
- [ ] **Step 4: Commit** `feat: products pages on tasteskill`.

### Task 7: About, Careers, Contact

**Files:**
- Rewrite: `src/app/about/page.tsx`, `src/app/careers/page.tsx`, `src/app/contact/page.tsx`, `src/components/contact/EnquiryForm.tsx`
- Delete: `src/app/about/about.module.css`, `src/app/contact/contact.module.css`, `src/components/contact/EnquiryForm.module.css`
- Create: `public/assets/photos/*` (stand-ins). Modify `Footer` with the credits line.

**Interfaces:**
- Consumes: `src/lib/enquiry.ts`, unchanged. The form keeps its current `action`, `method` and no-JS fallback.

- [ ] **Step 1:** Add the 3 routes to smoke. On `/contact`, assert:
  - `form[action]` is non-empty
  - every input has a visible `<label>`
  - the submit button's text starts with a verb

  Run. Expected: FAIL.
- [ ] **Step 2:** Find stand-in photographs.
  - Run `node SK/scripts/photos.mjs search "software studio workspace"` and `"developers at work laptop"`. No readable face is shown as Hicaso staff.
  - Keep 2–4 frames in `public/assets/photos/`.
  - Write the footer credits with `node SK/scripts/photos.mjs credits`.
- [ ] **Step 3:** Build the pages.
  - About: statement or split hero with a stand-in, then two or three sections.
  - Careers: hero, then today's openings content.
  - Contact: the starter's `booking-form` markup around the existing EnquiryForm fields.
- [ ] **Step 4:** Run `npm test` (the enquiry tests) and smoke, then gate each of the 3 routes.
- [ ] **Step 5: Commit** `feat: about, careers, contact on tasteskill`.

### Task 8: Privacy, Terms, Not-found, cleanup

**Files:**
- Rewrite: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/not-found.tsx` (plain text sections in `.wrap`)
- Delete: `src/styles/page.module.css`, then `src/components/ui/Container.*`, `src/components/ui/LinkButton.*` and `src/components/common/Eyebrow.tsx` once nothing imports them
- Modify: `README.md` (one paragraph on the kit and `npm run smoke`)

- [ ] **Step 1:** Add `/privacy`, `/terms` and `/this-page-does-not-exist` (expect 404 with one h1) to smoke. Run. Expected: FAIL on the old styling.
- [ ] **Step 2:** Rebuild the three pages. Run `grep -rn "module.css\|LinkButton\|Container\|next/link" src`. Expected: only the modules still used by `Logo`, `Orb`, `SpecularButton` and `LogoMarquee`, and no `next/link`.
- [ ] **Step 3:** Run `npm run lint && npm test && npm run build && npm run smoke`. Expected: all pass, and the build reports no missing modules.
- [ ] **Step 4: Commit** `chore: legal pages and remove pre-tasteskill styles`.

### Task 9: Whole-site verification

- [ ] **Step 1:** With `npm run dev` up, for every route run `node SK/scripts/consistency.mjs http://localhost:3000<route> --widths 1440,1024,820,768,390 --page software --profile .taste-skill/chrome-check`. Expected: no FAIL beyond the recorded waivers.
- [ ] **Step 2:** Run `node SK/scripts/perf.mjs http://localhost:3000/ --profile .taste-skill/chrome-check`. Expected: no FAIL row.
- [ ] **Step 3:** Request one final whole-branch review on the most capable model, with this plan and the spec.
- [ ] **Step 4:** Write the report, following SKILL.md step 7:
  - the gate line per route
  - waivers
  - the deal
  - every stand-in photograph, with the shot to replace it
  - what could not be checked: Safari and real phones
