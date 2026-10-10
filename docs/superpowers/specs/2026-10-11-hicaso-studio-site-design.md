# Hicaso Studio Site — Design

Date: 2026-10-11
Status: approved in conversation, awaiting written-spec review

## 1. Intent

Rebuild hicaso.com from a services-agency site into the site of a **product studio**.

**Mission:** Hicaso is a product studio. It builds, launches and runs independent software products; the common thread is quality, not audience.

**Current products:**

| | AppKavo | BillMinute |
|---|---|---|
| URL | https://appkavo.com | https://billminute.com |
| One-liner | Know your mobile app is secure and store-ready before you ship. | Send a professional invoice in a minute, in any currency. |
| Audience | Indie developers and mobile teams | Freelancers and small businesses with clients anywhere |
| Status | live | live |
| Theme | bg `#0a0a0c`, fg `#F4F4F5`, accent `#FB8C2E`, onAccent `#0a0a0c`, font Bricolage Grotesque | bg `#ffffff`, fg `#1d1d1f`, accent `#1F4FD8`, onAccent `#ffffff`, font Poppins |

More products will follow. Adding one must not require a redesign.

**Success:** the site serves four audiences: customers discovering products, existing customers checking who is behind them, future hires, and partners or investors. A visitor can reach either product in one click from the home page. A new product appears everywhere on the site after one data entry plus a screenshot.

### Decisions (from the user)

| Topic | Decision |
|---|---|
| Services business | Removed. Hicaso is products only. |
| Mission | Product studio (builds, launches, runs independent products) |
| Primary audience | All four equally: customers, credibility, talent, partners |
| Brand architecture | Neutral Hicaso frame (DESIGN.md); each product shown in its own colors and font |
| Site structure | Lean site plus a short overview page per product, generated from one data file |
| Careers | No open roles; show an invitation to send work to hello@hicaso.com |
| Contact | `mailto:` link, no form or backend |

### Assumptions (confirmed in section review)

- Visual system follows `DESIGN.md` (Apple style reference) for everything outside product panels.
- Light theme only; DESIGN.md defines no dark mode.
- The current About team photo (`public/images/about-team.png`) is removed unless the user confirms it is the real team.
- Legal pages keep their substance; only services-agency wording changes, plus links to each product's own privacy policy.

## 2. Site map

```
/                        Home
/products                All products (grid)
/products/[slug]         Product overview → links out to the product site
/about                   Mission, principles, company facts
/careers                 How Hicaso works + "no open roles" invitation
/contact                 Email, phone, address, hours
/privacy, /terms         Kept, reworded for a product company
```

**Removed:** `/services`, `/services/cloud-solutions`, `/services/digital-consulting`, `/services/mobile-development`, `/services/web-development`, `/work`. The home page Logos, Stats, Services and About sections are removed too.

**Redirects** (permanent, in `next.config.ts`): `/services`, `/services/:path*` and `/work` all go to `/products`.

### Header

Hicaso logo on the left. Links: Products, About, Careers, Contact.

- **Desktop:** Products opens a small menu listing each product (name and one-liner, in data order) and "All products". The menu opens on click, closes on Escape or a click outside, and has `aria-expanded` set.
- **Mobile:** a toggle opens a full-width list with the same links, products listed under Products.
- No CTA button.

### Footer

Four columns:
- **Products:** generated from the data file.
- **Company:** About, Careers, Contact.
- **Legal:** Privacy, Terms.
- **Contact:** hello@hicaso.com, +91 70091 37936, 2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh).

Below them, a 1px hairline divider and "© {current year} Hicaso LLP".

## 3. Product data

One file is the only place product information is kept: `src/data/products.ts`.

```ts
export type Product = {
  slug: string;
  name: string;
  tagline: string;
  audience: string;
  description: string;
  highlights: { title: string; body: string }[]; // 3–4
  url: string;
  privacyUrl: string;
  status: "live" | "beta";
  theme: { bg: string; fg: string; accent: string; onAccent: string; font: "bricolage" | "poppins" }; // onAccent = button text on accent
  screenshot?: string; // path under /public
};

export const products: Product[] = [/* AppKavo, BillMinute */];
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
```

Array order is display order everywhere.

### Initial highlights

**AppKavo**
1. Binary audit, no source needed: upload an APK, AAB or IPA and get a 0–100 security score with ranked findings.
2. Store rejection, predicted: blockers and risks for Google Play and the App Store before you submit.
3. Privacy paperwork, drafted: Data Safety and App Privacy mappings, a privacy policy and terms from your build.
4. Nightly vulnerability watch: dependencies re-checked against new CVEs without re-uploading.

**BillMinute**
1. An invoice in a minute: line items, taxes and discounts, from a template or your last invoice.
2. Any currency, any format: your client's currency, date format and invoice wording.
3. Clients pay you directly: by bank transfer or your own pay links. BillMinute never holds payments.
4. Your data is yours: export invoices, customers and payments to CSV at any time.

`privacyUrl` values: `https://appkavo.com/privacy` and `https://billminute.com/privacy`. These must be confirmed live during implementation; if a URL 404s, use the product's home URL and flag it.

## 4. Pages

### Home `/`

1. **Hero** (`#f5f5f7`, centered).
   - Headline at display size, weight 600: "We build software products."
   - Subhead at 26px, weight 300: "Hicaso is a product studio. We build, launch and run independent software — each one held to the same standard."
   - Filled button "Explore products" → `/products`; outlined button "About the studio" → `/about`.
2. **Product panels.** One full-bleed `ProductPanel` per product, in the product's theme.
   - Contents: name (product font), tagline, audience, "Learn more" → `/products/[slug]`, "Visit {domain} ↗" → `url` (opens in a new tab, `rel="noopener"`), and the screenshot if present.
   - Buttons use the product accent. This is the one sanctioned exception to DESIGN.md's single-blue rule.
3. **How we build.** `Principles` component, text only, centered:
   - **Small and sharp.** Each product does one job well.
   - **Run, not just launched.** We keep operating and improving what we ship.
   - **Your data stays yours.** Clear pricing, honest limits, and export when you want it.
4. **Closing CTA.** "Build the next one with us." Filled "See careers" → `/careers`; outlined "Contact us" → `/contact`.

### Products `/products`

- Heading: "Products." Subhead: "Built and run by Hicaso."
- A grid of `ProductTile`s (1 column on mobile, 2 on desktop). Each tile has the product theme background, an 8px radius, the name, tagline and a "Learn more" link.

### Product `/products/[slug]`

- Statically generated for every product via `generateStaticParams`; unknown slugs call `notFound()`.
- `generateMetadata` sets the title "{name} — a Hicaso product" and the tagline as description.
- Sections:
  1. **Hero** in the product theme: name, tagline, audience; "Visit {domain} ↗" (filled, accent) and "All products" (outlined).
  2. **Description** on Hicaso canvas.
  3. **Highlights:** 3–4 text-only blocks.
  4. **Closing panel** in the product theme: "Ready to try {name}?" with the visit button.

### About `/about`

The mission sentence as hero, then `Principles` (same component and data as home), then company facts: Hicaso LLP, Chandigarh, India.

### Careers `/careers`

One paragraph on how Hicaso works (small team, ships and runs its own products, remote-friendly). Then: "No open roles right now. Send your work to hello@hicaso.com." as a `mailto:` link.

### Contact `/contact`

Email (`mailto:`), phone (`tel:`), address, and hours (Mon–Fri, 9:00 AM–6:00 PM IST). No form.

### Privacy and Terms

Replace services-agency wording ("clients", "projects", "consulting") with product-company wording. Add a paragraph: "Each Hicaso product has its own privacy policy" with links built from `products[].privacyUrl`. Legal substance is unchanged.

## 5. Visual system

- **Tokens:** DESIGN.md's Tailwind v4 `@theme` block replaces the current brand tokens in `src/app/globals.css`. Remove the `--shadow-premium*`, `--shadow-card*` and `--radius-custom-*` tokens. Body background `#f5f5f7`, text `#1d1d1f`. Selection color uses `#0071e3` at low opacity.
- **Radii:** 980px for buttons and tags, 8px for tiles and images. No other values.
- **Shadows:** none, except optionally `--shadow-xl` on product screenshots.
- **Hicaso fonts:** Inter via `next/font` (the DESIGN.md substitute for SF Pro). The stack puts `-apple-system`/`BlinkMacSystemFont` first so Apple devices get SF Pro. Outfit is removed.
- **Product fonts:** Bricolage Grotesque and Poppins via `next/font`, exposed as CSS variables and applied only inside product-themed surfaces.
- **Type on mobile (<734px):** display 56→40px; hero subhead 26→21px; body stays 17px with -0.016em tracking.
- **Product theming:** `ProductPanel`, `ProductTile` and the product page set `--p-bg`, `--p-fg`, `--p-accent`, `--p-on-accent` and `--p-font` as inline styles from `product.theme`. CSS reads only those variables, so a new product needs no CSS change.
- **Styling approach:** keep the current CSS Modules plus Tailwind v4 pattern.
- **Motion:** at most a CSS fade-in on scroll, disabled under `prefers-reduced-motion`. Framer Motion is removed from the code and from `package.json` once nothing imports it.

## 6. Components

| Component | Status | Purpose |
|---|---|---|
| `ui/Button` | restyle | `variant: "filled" \| "outlined"`; renders a `Link` when given `href`; pill shape; optional `accent` override for product surfaces |
| `ui/Container` | keep | Internal max-width (980px for text blocks, 1440px for wide) |
| `ui/Logo` | restyle | Hicaso wordmark |
| `layout/Header` | rewrite | Section 2 behavior |
| `layout/Footer` | rewrite | Section 2 columns |
| `products/ProductPanel` | new | Full-bleed themed home panel |
| `products/ProductTile` | new | Themed grid tile |
| `common/Principles` | new | Three principles, single data source |
| `home/Hero`, `home/CTA` | rewrite | Section 4 home |
| `home/About`, `home/Logos`, `home/Services`, `home/Stats`, `cards/*`, `ui/Badge` | delete | No longer used |
| `common/SectionHeading` | delete if unused after rewrite | |

Remove unused images (`hero-laptop.png`, `cta-paperplane.png`, and `about-team.png` unless confirmed) and the default Next.js SVGs in `public/` if unreferenced.

## 7. Accessibility

- Contrast check (WCAG AA) on each product's fg/bg and accent/onAccent pairs. A failing brand color is reported to the user, not silently changed.
- One `<h1>` per page.
- Visible 2px `#0071e3` focus ring on all interactive elements (product accent inside product surfaces).
- Products menu is keyboard operable with `aria-expanded` and `aria-controls`.
- External links announce that they open in a new tab: visible ↗ plus an `aria-label`.

## 8. Next.js version note

Per `AGENTS.md`, before writing code read the relevant guides in `node_modules/next/dist/docs/` for: `redirects` in `next.config.ts`, `generateStaticParams`, `generateMetadata` (including async `params`), `notFound`, and `next/font`. Follow the local docs over prior knowledge.

## 9. Verification

1. `npm run build` and `npm run lint` pass with no errors.
2. With `npm run start`:
   - `/`, `/products`, `/products/appkavo`, `/products/billminute`, `/about`, `/careers`, `/contact`, `/privacy` and `/terms` return 200.
   - `/products/nope` returns 404.
   - `/services`, `/services/web-development` and `/work` return a 308 to `/products`.
3. A check that every `products[]` entry has a unique slug, an https `url`, and 3–4 highlights. It is a small script run in the build or lint step, or one test.
4. Screenshots of `/` and `/products/appkavo` at 390px and 1440px: no horizontal scroll, product panels in their themes, header menu works.

## 10. Out of scope

- Contact form backend, newsletter, blog, analytics.
- Dark mode.
- Product screenshots beyond what exists in the product repos. If none are found, panels render text-only and the user is asked for images.
- Rewriting legal substance.
