# Hicaso Services + Product Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn hicaso.com into a services-company + product-studio site (Esferasoft-like structure), restyled to the Mollie-style `DESIGN.md`.

**Architecture:** A new `src/data/services.ts` (mirrors `products.ts`) feeds the header, footer, home, `/services`, `/services/[slug]` and the contact form. The visual system moves to DESIGN.md tokens in `globals.css` `@theme`, plus CSS Modules (current pattern). The enquiry form is a client component that builds a `mailto:` URL with a pure, tested helper.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, Tailwind v4 `@theme` + CSS Modules, `next/font/google`, `lucide-react`, `node --test` (Node ≥22.18 runs `.ts` directly).

**Spec:** `docs/superpowers/specs/2026-11-05-hicaso-services-and-studio-design.md` (read it; this plan argues from it). Supersedes the executed plan `2026-10-11-hicaso-studio-site.md`.

## Global Constraints

- No new npm dependencies.
- Next.js 16.2: `params` and `searchParams` are Promises (`await` them); route pages type with the global `PageProps<"/route">` helper, as `src/app/products/[slug]/page.tsx` already does. Read `node_modules/next/dist/docs/` before writing route code (after Task 0 installs it).
- Honesty: no invented proof (no stats, testimonials, client logos, awards, timelines, prices). Only these capability claims may appear: client owns code and IP once paid; the stacks in spec §3; "the team that builds our products builds yours"; weekly demos; working-hours overlap with Europe and the Middle East.
- Brand blue `#0071e3` appears **only** as the logo's i-dot. No other blue anywhere.
- Display type is weight 400 (never 600–700 at display size). No outer drop shadows on cards. Pills are `border-radius: 9999px`, cards 16px, large media 24px.
- **Contrast (deviation from DESIGN.md, required for WCAG AA):** Copper `#e07122` is 3.2:1 on Paper and 2.9:1 on Oat, so it is never used as text on light surfaces. On light surfaces, links are Ink text with a Copper underline (`text-decoration-color`). Copper text is allowed only on Espresso (5.7:1). Soft Gray `#919191` (3.15:1) is only for non-text (input borders, dividers); muted text uses Quiet Graphite `#595959`.
- Test files import siblings with explicit `.ts` extensions and no `@/` alias (like `products.test.ts`).
- Every task ends green on `npm test`, `npm run lint`, `npm run build`.

## Review Focus

1. **Mailto body with special characters** (`&`, `?`, `#`, `%`, newlines, non-Latin names, emoji) must arrive intact in the email app → covered by `buildEnquiryMailto` tests in Task 5.
2. **Unknown or garbage `?service=` on `/contact`** (e.g. `?service=foo`, repeated `?service=a&service=b`) must fall back to no preselection, not crash → covered by the `resolveService` test in Task 5.
3. **Unknown service slug** `/services/nope` must 404 (`dynamicParams = false`) → checked in the Task 4 build/route check.
4. **Two header menus**: opening Services must close Products and vice versa; Escape returns focus to the menu's own button → manual keyboard check in Task 6.
5. **Old `/services/*` bookmarks** (e.g. `/services/web-development`, `/services/cloud-solutions`) must no longer redirect to `/products`. Live slugs render; dead old slugs 404 → curl check in Task 4.

---

### Task 0: Install dependencies and baseline

**Files:** none.

- [ ] **Step 1:** Run `npm ci`. Expected: completes and `node_modules/next/dist/docs/` exists.
- [ ] **Step 2:** Run `npm test && npm run lint && npm run build`. Expected: all pass on the current site (baseline). If something fails here, stop and report it; don't fix unrelated breakage silently.
- [ ] **Step 3:** Commit the already-changed `DESIGN.md`, the spec and this plan: `git add DESIGN.md docs/superpowers && git commit -m "docs: Mollie-style DESIGN.md, services + studio spec and plan"`.

---

### Task 1: Design tokens, fonts, type scale, buttons, logo

Restyle the whole existing site to DESIGN.md with no content changes.

**Files:**
- Modify: `src/app/globals.css` (replace `@theme`, base styles and `.t-*` classes)
- Modify: `src/app/layout.tsx` (add IBM Plex Mono, update metadata)
- Modify: `src/components/ui/LinkButton.tsx`, `LinkButton.module.css`
- Modify: `src/components/ui/Logo.module.css`, `src/components/products/themeStyle.ts`
- Modify: every `*.module.css` under `src/` that references an old token (list via the grep in Step 1)
- Modify: `src/components/layout/Header.tsx:107` (`variant="outlined"` → `variant="filled"`; Task 6 rewrites the header anyway)

**Interfaces (Produces):**
- CSS tokens (Tailwind `@theme`, usable as `var(--…)`):
  - `--color-paper #ffffff`, `--color-ink #000000`, `--color-near-black #111111`, `--color-graphite #595959`, `--color-soft-gray #919191`, `--color-oat #f7f4f1`, `--color-outline #f5f2f0`, `--color-ledger #3b281d`, `--color-espresso #211006`, `--color-copper #e07122`, `--color-terracotta #d66733`, `--color-active-green #1e681d`, `--color-logo-dot #0071e3`
  - `--radius-card 16px`, `--radius-media 24px`, `--radius-pill 9999px`
  - `--shadow-inset-highlight: rgba(255,255,255,0.08) 0 1px 0 0 inset`
  - `--font-sans: var(--font-inter), …`, `--font-mono: var(--font-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace`
- Type classes: `.t-display` (82px/1/400/-2.4px at ≥734px; 46px/1.05/-1.2px below), `.t-heading` (56px/1.1/400/-1.4px ≥734px; 34px below), `.t-heading-sm` (32px/1.15/500/-0.6px; 26px below), `.t-subheading` (18px/1.4/600/-0.4px), `.t-subhead` (18px/1.45/400/-0.4px, Graphite), `.t-caption` (13px/1.3/-0.3px), `.t-eyebrow` (mono 13px/1.3/500, uppercase, +0.39px tracking), `.t-media-label` (mono 11px/1/400, uppercase, +0.11px).
- Base: `body` 16px/1.4, `-0.4px` tracking, Ink on Paper. `h1–h3` keep `color: var(--heading-color, var(--color-ink))`. Focus ring is a 2px `var(--focus-ring, var(--color-ink))` outline. `::selection` is `rgba(59,40,29,0.15)`.
- `LinkButton` `variant?: "filled" | "light" | "onDark" | "text"` (remove `"outlined"`):
  - `filled` = `var(--btn-fill, var(--color-ledger))` background, `var(--btn-on-fill, var(--color-paper))` text, plus the inset highlight
  - `light` = Oat background, Ink text
  - `onDark` = Paper background, Ink text
  - `text` = `var(--btn-text, var(--color-ink))` text with a Copper underline (`text-decoration-color: var(--btn-underline, var(--color-copper))`), offset 4px
  - Pill padding `16px 24px`, Inter 16/500, line-height 1.2, `-0.2px` tracking.
  - Keep the `--btn-fill/--btn-on-fill/--btn-text` hooks, because `themeStyle.ts` uses them for product panels. Set `--btn-underline` from `themeStyle` to `theme.accent`.

- [ ] **Step 1:** Run `grep -rnoE "var\(--(color-(navy-ink|electric-blue|sky-blue|ice-mist|charcoal|obsidian|slate|fog|hairline)|radius-large-card|shadow-(lg|xl))" src`. Record the list; every hit must be gone by Step 6.
- [ ] **Step 2:** Replace the `@theme` block, base styles and type classes in `globals.css` with the interfaces above.
- [ ] **Step 3:** Add `IBM_Plex_Mono` (weights `400`, `500`, variable `--font-plex-mono`, `display: "swap"`) to `layout.tsx` next to Inter. Also update `metadata` to: title `"Hicaso — software development and product studio"`, description `"Hicaso builds generative AI, agentic AI, mobile and web software for clients worldwide, and ships its own products, including AppKavo and BillMinute."` (build the product names from `products` as today).
- [ ] **Step 4:** Rewrite `LinkButton` per the interface. Set `Logo.module.css` `.logo { color: var(--color-ink) }` and `.dot { fill: var(--color-logo-dot) }`. Add `"--btn-underline": theme.accent` to `themeStyle.ts`.
- [ ] **Step 5:** Swap each old token hit from Step 1 for its new equivalent:
  - `navy-ink`, `obsidian` → `ink`
  - `charcoal`, `slate` → `graphite`
  - `fog`, `ice-mist` → `oat`
  - `hairline` → `outline`, or `soft-gray` where it's an input border
  - `electric-blue`, `sky-blue` → `ledger` on light, `copper` on Espresso
  - `radius-large-card` → `radius-media`
  - `shadow-*` → remove
  - In `src/styles/page.module.css`, `.hero` becomes left-aligned (`text-align: left`, paragraph `margin: 24px 0 0`, `.actions { justify-content: flex-start }`), matching the DESIGN.md editorial layout.
- [ ] **Step 6:** Re-run the Step 1 grep. Expected: no output. Run `grep -rn "0071e3\|2997ff" src`. Expected: only `globals.css` (`--color-logo-dot`) and `src/app/icon.svg`.
- [ ] **Step 7:** Run `npm test && npm run lint && npm run build`. Expected: all pass. Run `npm run dev` and look at `/`, `/products`, `/products/appkavo`, `/about` and `/contact`. Expected: white canvas, black light-weight display type, brown pills, Oat cards, product panels still in their own colors.
- [ ] **Step 8:** Commit: `git commit -am "feat: restyle site to the Mollie-style DESIGN.md tokens"`.

---

### Task 2: Service data

**Files:**
- Create: `src/data/services.ts`
- Create: `src/data/services.test.ts`
- Modify: `package.json` `"test"` → `"node --test src/data/products.test.ts src/data/services.test.ts"` (Task 5 appends `src/lib/enquiry.test.ts`)

**Interfaces (Produces):**
```ts
export type Service = {
  slug: string; name: string; eyebrow: string; tagline: string; description: string;
  offerings: { title: string; body: string }[];
  stack: { group: string; items: string[] }[];
  faqs: { q: string; a: string }[];
};
export const services: Service[];
export const getService: (slug: string) => Service | undefined;
// Union of every service's stack, merged by group name, items de-duplicated, first-seen order;
// groups ordered as STACK_GROUPS.
export const STACK_GROUPS: readonly ["AI", "Mobile", "Frontend", "Backend", "Databases"];
export const allStackGroups: () => { group: string; items: string[] }[];
```

- [ ] **Step 1: Write the failing tests** in `services.test.ts`:
  - `"slugs are unique and URL-safe"`: same as the products test.
  - `"services are the four from the spec, in order"`: `assert.deepEqual(services.map(s => s.slug), ["generative-ai", "agentic-ai", "mobile-app-development", "web-development"])`.
  - `"each service has 4–6 offerings, ≥1 stack group, 2–4 FAQs"`.
  - `"stack groups use only STACK_GROUPS names"`.
  - `"user-named technologies are present"`: the flattened items include each of `"Kotlin"`, `"Swift"`, `"Flutter"`, `"React Native"`, `"React"`, `"Next.js"`, `"PHP"`, `"Laravel"`, `"CodeIgniter"`, `"Node.js"`.
  - `"allStackGroups merges and de-dupes"`: `"Node.js"` and `"Python"` appear once each across the result, and group order is a subsequence of `STACK_GROUPS`.
  - `"no invented proof in copy"`: every string field joined together does not match `/\d+\+|\b\d+ (projects|clients|years|countries)\b|award|guarantee|\$\d/i`.
- [ ] **Step 2:** Run `node --test src/data/services.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 3:** Write `services.ts` with the four entries from spec §3:
  - offerings exactly as listed there, each with a one-sentence body;
  - stack items split into the `STACK_GROUPS` (for example Web: Frontend `React, Next.js`; Backend `Node.js, PHP, Laravel, CodeIgniter`; Databases `MySQL, PostgreSQL, MongoDB`);
  - 2–4 FAQs each. Every service includes "Do I own the code?" → "Yes. Once the project is paid for, the code and IP are yours." Web and Mobile also include "Can you work on my existing app?" Copy stays inside the Global Constraints honesty list.
- [ ] **Step 4:** Run `npm test`. Expected: PASS (both files).
- [ ] **Step 5:** Commit: `git add src/data package.json && git commit -m "feat: service data as the single source for service pages"`.

---

### Task 3: Shared section components

**Files (create, each with a sibling `.module.css` where it has styles):**
- `src/components/common/Eyebrow.tsx`: `Eyebrow({ children, onDark? }: { children: React.ReactNode; onDark?: boolean })` renders `<p className="t-eyebrow">`, in Ink, or in Paper when `onDark`.
- `src/components/common/HowWeWork.tsx`: `HowWeWork()`, a section with Eyebrow "HOW WE WORK", heading "From first call to launch", and four steps in an `<ol>`: `01 Discover`, `02 Design`, `03 Build`, `04 Launch and support`. Each step has one sentence. The Build step mentions weekly demos. No time promises.
- `src/components/common/FAQ.tsx`: `FAQ({ items, title = "Questions, answered" }: { items: { q: string; a: string }[]; title?: string })`. Each item is a native `<details><summary>`, with a `+`/`−` marker drawn in CSS via `[open]`. No JS.
- `src/components/common/StackGrid.tsx`: `StackGrid({ groups }: { groups: { group: string; items: string[] }[] })`. Each group is a row: a mono label on the left, items as Paper cells with `--color-outline` hairlines on the right (DESIGN.md "Product Category Cell", 22px padding). Wraps on mobile.
- `src/components/common/ClosingCTA.tsx`: `ClosingCTA({ title = "Tell us what you want to build.", href = "/contact" }: { title?: string; href?: string })`. An Espresso panel (radius 16px, padding ≥40px) with an Eyebrow `onDark` reading "START A PROJECT", a Paper heading (set `--heading-color: var(--color-paper)`), one line of `rgba(255,255,255,0.72)` copy, and `LinkButton variant="onDark"` "Start your project". Set `--focus-ring: var(--color-paper)` on the panel.
- Delete: `src/components/home/CTA.tsx` and `CTA.module.css`. Update `src/app/page.tsx` to use `ClosingCTA`.

- [ ] **Step 1:** Create the five components per their signatures above.
- [ ] **Step 2:** Run `npm run lint && npm run build`. Expected: pass. Check `/` in dev: the closing panel is Espresso with a Paper pill, and Tab shows a visible Paper focus ring on it.
- [ ] **Step 3:** Commit: `git add -A src/components src/app/page.tsx && git commit -m "feat: shared eyebrow, how-we-work, FAQ, stack grid and closing CTA"`.

---

### Task 4: Services routes

**Files:**
- Create: `src/app/services/page.tsx`, `src/app/services/services.module.css`
- Create: `src/app/services/[slug]/page.tsx`, `src/app/services/[slug]/service.module.css`
- Modify: `next.config.ts`: remove the `/services/:path*` redirect and update the comment. Keep `/work` → `/products`.

**Interfaces (Consumes):** `services`, `getService` (Task 2), `Eyebrow`, `HowWeWork`, `FAQ`, `StackGrid`, `ClosingCTA` (Task 3), `LinkButton` variants (Task 1).

- [ ] **Step 1:** Build `/services`:
  - `metadata` title `"Services — Hicaso"`.
  - Hero: Eyebrow "SERVICES", `h1.t-display` "Software, built with you.", subhead naming AI, mobile and web for clients worldwide.
  - One large Oat card per service: eyebrow, `h2` name, tagline, the first four offering titles as a list, and `LinkButton variant="text"` "Explore {name}" → `/services/{slug}`.
  - Then `<HowWeWork />` and `<ClosingCTA />`.
- [ ] **Step 2:** Build `/services/[slug]`. Follow `src/app/products/[slug]/page.tsx`:
  - `dynamicParams = false`, `generateStaticParams` from `services`.
  - `generateMetadata` title `"{name} — Hicaso"`, description `tagline`. `notFound()` if the slug is unknown.
  - Sections in order:
    1. hero: eyebrow, `h1` name, description, `LinkButton` "Start your project" → `/contact?service={slug}`, and `variant="light"` "All services" → `/services`
    2. "What we build": offerings as Oat cards (`h3` title + body)
    3. "Technologies": `<StackGrid groups={service.stack} />`
    4. `<HowWeWork />`
    5. `<FAQ items={service.faqs} />`
    6. `<ClosingCTA href={`/contact?service=${slug}`} />`
- [ ] **Step 3:** Remove the services redirect from `next.config.ts`.
- [ ] **Step 4:** Run `npm run build`. Expected: pass, and the route list shows `/services` and the 4 `/services/[slug]` paths as prerendered.
- [ ] **Step 5:** Run `npm run start`, then `curl -s -o /dev/null -w "%{http_code}\n"` against `/services`, `/services/web-development`, `/services/nope`, `/services/cloud-solutions` and `/work`. Expected: `200 200 404 404 308`.
- [ ] **Step 6:** Commit: `git add -A src/app/services next.config.ts && git commit -m "feat: services index and per-service pages from data"`.

---

### Task 5: Enquiry form on Contact

**Files:**
- Create: `src/lib/enquiry.ts`, `src/lib/enquiry.test.ts`
- Create: `src/components/contact/EnquiryForm.tsx` (`"use client"`), `EnquiryForm.module.css`
- Modify: `src/app/contact/page.tsx`, `package.json` (append `src/lib/enquiry.test.ts` to `"test"`)

**Interfaces (Produces):**
```ts
// src/lib/enquiry.ts (pure, no React, no "@/" imports)
export const BUDGETS = ["Under $5k", "$5k–$15k", "$15k–$50k", "$50k+", "Not sure"] as const;
export const OTHER_SERVICE = "Something else";
export const ENQUIRY_TO = "hello@hicaso.com";
export type Enquiry = { name: string; email: string; country: string; service: string; budget: string; message: string };
export function buildEnquiryMailto(e: Enquiry): string;
// Returns raw if it is a single string in validSlugs, else "".
export function resolveService(raw: string | string[] | undefined, validSlugs: string[]): string;
```
`EnquiryForm({ services, initialService }: { services: { slug: string; name: string }[]; initialService: string })`.

- [ ] **Step 1: Write the failing tests** in `enquiry.test.ts`:
  - `"mailto goes to hello@hicaso.com with the service in the subject"`: the result starts with `"mailto:hello@hicaso.com?subject="`, and `new URL(result).searchParams.get("subject")` equals `"Project enquiry — Web Development"`.
  - `"body lists every field"`: the body (via `searchParams.get("body")`) contains `"Name: Ana"`, `"Email: ana@x.com"`, `"Country: Spain"`, `"Service: Web Development"`, `"Budget: $5k–$15k"`, and the message.
  - `"special characters survive"`: with name `"Zoë & Co #1 ?50%"` and a message containing `"\n"` and `"🚀"`, the decoded body contains both exactly, and `result.split("&").length === 2`.
  - `"empty optional fields are written as —"`: `country: ""` produces `"Country: —"`. An empty service gives the subject `"Project enquiry"`.
  - `"resolveService accepts only known slugs"`:
    - `resolveService("web-development", slugs) === "web-development"`
    - `resolveService("foo", slugs) === ""`
    - `resolveService(["a","b"], slugs) === ""`
    - `resolveService(undefined, slugs) === ""`
- [ ] **Step 2:** Run `node --test src/lib/enquiry.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 3:** Implement `enquiry.ts`: `mailto:${ENQUIRY_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`. Lines are joined with `\r\n`. Append the test file to the `package.json` `"test"` script.
- [ ] **Step 4:** Run `npm test`. Expected: all three test files PASS.
- [ ] **Step 5:** Build `EnquiryForm`:
  - Labelled fields, each `<label htmlFor>` tied to its input:
    - name (`required`, `autoComplete="name"`)
    - email (`type="email"`, `required`, `autoComplete="email"`)
    - country (`autoComplete="country-name"`)
    - service `<select>` (empty "Choose a service" option, then each service name, then `OTHER_SERVICE`; the default is the name matching `initialService`)
    - budget `<select>` from `BUDGETS`
    - message `<textarea required maxLength={1000}>` with a live `n/1000` counter tied by `aria-describedby`
  - `onSubmit`: `preventDefault`, then `window.location.href = buildEnquiryMailto(...)`, then show the spec §4.6 note in a `role="status"` element.
  - Inputs: Paper background, 1px `--color-soft-gray` border, radius 12px, 16px text, and a 2px Ink focus outline.
  - Submit: a `<button type="submit">` using `styles.button` + `styles.filled` imported from `LinkButton.module.css`.
- [ ] **Step 6:** Rewrite `contact/page.tsx`:
  - `async function ContactPage({ searchParams }: PageProps<"/contact">)`, which computes `initialService = resolveService((await searchParams).service, services.map(s => s.slug))`.
  - `metadata` title `"Contact — Hicaso"`, description `"Tell Hicaso about your project: AI, mobile or web. Email, phone and address in Chandigarh, India."`.
  - Hero `h1` "Let's talk about your project."
  - A two-column layout (stacked under 900px): the form on the left, and on the right the existing facts card (email, phone, address, hours `Mon–Fri, 9:00 AM–6:00 PM IST`) on Oat.
- [ ] **Step 7:** In dev, open `/contact?service=agentic-ai`. Expected: "Agentic AI" is preselected. Submitting empty shows the browser's required-field messages. Submitting a filled form opens the mail app with the subject and body. `/contact?service=x` has nothing preselected.
- [ ] **Step 8:** Run `npm test && npm run lint && npm run build`, then commit: `git add -A src/lib src/components/contact src/app/contact package.json && git commit -m "feat: project enquiry form that opens a prefilled email"`.

---

### Task 6: Header and footer

**Files:**
- Modify: `src/components/layout/Header.tsx`, `Header.module.css`
- Modify: `src/components/layout/Footer.tsx`, `Footer.module.css`

**Interfaces (Consumes):** `services` (Task 2), `products`, `LinkButton`.

- [ ] **Step 1:** Header:
  - A 54px bar. Desktop nav: Services menu, Products menu, About, Careers. On the right, `LinkButton` (filled) "Start a project" → `/contact`.
  - Replace the `productsOpen` boolean with one state, `openMenu: "services" | "products" | null`, so opening one closes the other. Each menu has its own wrapper and button ref.
  - Escape closes the menu and focuses that menu's button. Outside pointer-down and blur-out also close it. Keep the existing Safari `onMouseDown` preventDefault.
  - The Services menu items show eyebrow (mono), name and tagline, then "All services".
  - Nav links: Inter 14/500, `-0.32px` tracking, Ink. The active state is a Copper underline.
  - Mobile list order: Services (+ service sub-links), Products (+ product sub-links), About, Careers, Contact.
- [ ] **Step 2:** Footer:
  - A top row with `h2` "Have a project in mind?" and a filled "Start a project" pill.
  - Columns: Services (from `services`), Products (from `products`), Company (About, Careers, Contact), Legal (Privacy Policy, Terms & Conditions), Contact (email, phone, address, `Mon–Fri, 9:00 AM–6:00 PM IST`).
  - Then a `--color-outline` hairline and `© {year} Hicaso LLP`. Column headings use `.t-eyebrow` styling.
- [ ] **Step 3:** Run `npm run lint && npm run build`. Expected: pass.
- [ ] **Step 4:** Do a manual keyboard check in dev at 1280px and 390px:
  - Tab to Services, Enter opens it. Tab to Products, Enter: Services closes and Products opens. Escape closes Products and focus is on the Products button.
  - The mobile toggle shows the full list. Following a link closes the menu.
- [ ] **Step 5:** Commit: `git commit -am "feat: header with services and products menus, expanded footer"`.

---

### Task 7: Home page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/Hero.tsx`, `Hero.module.css`, `Products.tsx`, `Products.module.css`
- Create: `src/components/home/ServicesGrid.tsx` + css, `src/components/home/WhyHicaso.tsx` + css

**Interfaces (Consumes):** Tasks 2 and 3 components, `allStackGroups()`, `ProductPanel`. **Produces:** `WhyHicaso()` (Task 8 reuses it on About).

- [ ] **Step 1:** Hero (spec §4.3.1):
  - A two-column grid ≥900px: on the left `h1.t-display` "We build AI, mobile and web software — and ship our own products." On the right (bottom-aligned), a `.t-subhead` paragraph ("Hicaso is a software development company and product studio in India, working with clients worldwide on generative AI, agentic AI, mobile apps and web platforms.") and pills: filled "Start your project" → `/contact`, `light` "See our products" → `/products`.
  - The hero is stacked on mobile. There is no image.
- [ ] **Step 2:** `ServicesGrid`: Eyebrow "SERVICES", `h2.t-heading` "What we build for clients", and a 2-column grid (1 column on mobile) of Oat cards (16px radius, 40px padding). Each card has eyebrow, `h3` name, tagline, and `LinkButton variant="text"` "Explore" → `/services/{slug}`. Below the grid, `LinkButton variant="text"` "View all services" → `/services`.
- [ ] **Step 3:** Tech stack section in `page.tsx`: Eyebrow "TECHNOLOGIES", `h2` "Our stack", `<StackGrid groups={allStackGroups()} />`.
- [ ] **Step 4:** Update `Products.tsx`: Eyebrow "PRODUCT STUDIO", `h2` "We also build our own.", and the paragraph "The same team that builds for clients designs, ships and runs these products." Then the existing `ProductPanel` grid, unchanged.
- [ ] **Step 5:** `WhyHicaso`: Eyebrow "WHY HICASO", `h2` "Why teams work with us", and four items in a 2×2 grid. Each has a lucide icon (24px, stroke 1.75, Ink), a title and one sentence:
  - "You own the code and IP" (once the project is paid for)
  - "The team that builds our products builds yours"
  - "Weekly demos"
  - "Hours that overlap with Europe and the Middle East" (Mon–Fri, 9:00–18:00 IST)
  
  Use exactly these claims.
- [ ] **Step 6:** Home FAQ: `<FAQ>` with 5 company-level items, all answers within the honesty list:
  - "What does Hicaso do?"
  - "Do you work with clients outside India?" (yes, worldwide; overlapping hours with Europe and the Middle East)
  - "Do I own the code?"
  - "Can you work on an existing app?"
  - "How do I start?" (send the enquiry form; you get a reply by email)
- [ ] **Step 7:** `page.tsx` order: `Hero`, `ServicesGrid`, tech stack, `Products`, `HowWeWork`, `WhyHicaso`, `FAQ`, `ClosingCTA`. Section spacing is 96–120px desktop, 64px mobile (DESIGN.md spacing scale).
- [ ] **Step 8:** Run `npm run lint && npm run build`. Then look at `/` in dev at 1280px and 390px. Expected:
  - text overflows nowhere, and there's exactly one `h1`;
  - the only blue is the logo dot;
  - product panels show their own themes.
- [ ] **Step 9:** Commit: `git add -A src && git commit -m "feat: services-first home page with product studio section"`.

---

### Task 8: About, Careers, Legal, Products copy

**Files:**
- Modify: `src/app/about/page.tsx`, `src/app/careers/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/products/page.tsx`, `src/app/not-found.tsx`
- Delete: `src/components/common/Principles.tsx`, `Principles.module.css`

- [ ] **Step 1:** About (spec §4.7):
  - Eyebrow "ABOUT", `h1` "A software company that ships its own products.", and a subhead.
  - Two Oat cards side by side: **Services** (one paragraph, `text` link → `/services`) and **Product studio** (one paragraph, link → `/products`).
  - Then `<WhyHicaso />` replaces `Principles`. Delete `Principles.*` and remove every import of it.
  - Then the company facts `dl`: Legal name Hicaso LLP; Based in Chandigarh, India; Clients Worldwide; Services (names from `services`); Products (names from `products`).
  - `metadata` description: "Hicaso is a software development company and product studio in Chandigarh, India."
- [ ] **Step 2:** Careers: change the subhead to "We're a small team that builds software for clients worldwide and runs our own products. We work remotely, own what we make, and keep the bar high." Update the metadata description the same way.
- [ ] **Step 3:** Privacy and Terms: add one paragraph to each, after the products paragraph: "Software we build for clients is governed by the agreement signed with each client, which takes precedence over these terms for that work." In Privacy, also mention that the contact form doesn't send data to Hicaso's servers; it opens your own email app.
- [ ] **Step 4:** `/products` and `not-found`: add an Eyebrow ("PRODUCT STUDIO" / "404"). Make sure the copy doesn't call Hicaso products-only. `not-found` links: Home, Services, Products.
- [ ] **Step 5:** Run `grep -rniE "Hicaso is a product studio|a product studio\.\"|products only" src`. Expected: no output.
- [ ] **Step 6:** Run `npm test && npm run lint && npm run build`, then commit: `git add -A src && git commit -m "feat: about, careers and legal copy for services + studio"`.

---

### Task 9: Final verification

- [ ] **Step 1:** Run `npm test && npm run lint && npm run build`. Expected: all pass; the build lists `/`, `/about`, `/careers`, `/contact`, `/privacy`, `/terms`, `/products`, 2 product pages, `/services` and 4 service pages.
- [ ] **Step 2:** Run `grep -rnE "#(0071e3|2997ff|0a2540)" src`. Expected: only `--color-logo-dot` in `globals.css` and `src/app/icon.svg`.
- [ ] **Step 3:** Take screenshots of `/`, `/services/agentic-ai`, `/contact` and `/about` at 1280px and 390px (Chrome DevTools MCP or the `run` skill). Check them against the DESIGN.md Do's and Don'ts: display weight 400, brown pills, Oat cards, no drop shadows, mono eyebrows, no blue except the logo dot.
- [ ] **Step 4:** Run a Lighthouse accessibility audit on `/` and `/contact`. Expected: score ≥ 95, with no contrast or label failures.
