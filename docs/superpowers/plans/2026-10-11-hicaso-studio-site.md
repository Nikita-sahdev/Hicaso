# Hicaso Studio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn hicaso.com from a services-agency site into a product-studio site that showcases AppKavo and BillMinute and grows by one data entry per new product.

**Architecture:** One typed data file (`src/data/products.ts`) feeds every product surface: home panels, `/products` grid, statically generated `/products/[slug]` pages, header menu and footer. Hicaso chrome follows `DESIGN.md` (Apple style). Product surfaces paint themselves from per-product CSS variables set inline, so a new product needs no CSS. Header and Footer move into the root layout.

**Tech Stack:** Next.js 16.2 (App Router), React 19.2, TypeScript, Tailwind v4 + CSS Modules, `next/font/google`, `lucide-react` icons, Node 24 built-in test runner (`node --test`, native TypeScript stripping).

**Spec:** `docs/superpowers/specs/2026-10-11-hicaso-studio-site-design.md` (visual tokens in `DESIGN.md`)

## Global Constraints

- Next.js docs: read `node_modules/next/dist/docs/` before using an API. Verified for this plan: `params` is a `Promise` (use `PageProps<"/products/[slug]">`), `export const dynamicParams = false` makes unknown slugs 404, `redirects()` with `permanent: true` returns 308, and `/services/:path*` also matches `/services`.
- Colors: canvas `#f5f5f7`, text `#1d1d1f`, filled button `#0071e3`, links and outlined buttons `#0066cc`, hairline `#d2d2d7`. `#0071e3` is never used for text.
- Radii: `980px` for buttons and tags, `8px` for tiles and images. No other radius values.
- No box shadows except `--shadow-xl` on product screenshots.
- Type: body 17px, line-height 1.47, letter-spacing -0.272px. Display 56px/1.07/600 (40px under 734px). Hero subhead 26px weight 300 (21px under 734px).
- Breakpoint: `734px` (mobile below, desktop at or above).
- Inside product surfaces, buttons, links and focus rings use the product `accent` and button text uses `onAccent`. This is the only exception to the single-blue rule.
- External `http(s)` links open in a new tab with `rel="noopener noreferrer"`, a visible `↗`, and screen-reader text "(opens in a new tab)".
- Contact details: `hello@hicaso.com`, `+91 70091 37936`, `2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh)`, Mon–Fri 9:00 AM–6:00 PM IST.
- Every commit message ends with the trailer line `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
- After every task: `npm run build`, `npm run lint` and `npm test` all pass.

**Two deliberate deviations from the spec:**

| Spec | Plan | Reason |
|---|---|---|
| `screenshot?: string` | `screenshot?: { src; width; height }` | `next/image` needs real dimensions. |
| Restyle `ui/Button` | New `ui/LinkButton`; the old `Button` is deleted in Task 8 | Every new button is a link. Keeping the old `Button` until its last user is rewritten keeps each task's build green. |

The spec also allows no scroll animation, and this plan adds none.

## Review Focus

1. **A product without a screenshot (AppKavo today)** must render a complete panel with no empty image box or broken `<img>`. Tested in Task 5, Step 6.
2. **An unknown product URL** (`/products/nope`) must return 404, not 500 and not an empty page. Tested in Task 6, Step 5.
3. **Header menus:**
   - Escape and an outside click close the Products menu.
   - Tapping any mobile-menu link closes the mobile menu.
   - Tested in Task 4, Step 7.
4. **A 320px-wide screen with a long product name or tagline** must not scroll sideways. A global `overflow-wrap` rule (Task 2) plus the 320px screenshot in Task 8, Step 9 cover it.
5. **External links** must open in a new tab, safely, and say so to screen readers. Tested in Task 5, Step 6.

---

### Task 1: Product data with tests

**Files:**
- Create: `src/data/products.ts`
- Create: `src/data/products.test.ts`
- Create: `public/images/products/billminute.png`, copied from `~/invoice-app/apps/site/public/screens/create.png` (1080×810)
- Modify: `package.json` (add a `test` script)
- Modify: `tsconfig.json` (add `allowImportingTsExtensions`)

**Interfaces:**
- Produces:
  - `type Product`
  - `products: Product[]`
  - `getProduct(slug: string): Product | undefined`
  - `domainOf(product: Product): string`, e.g. `"appkavo.com"`

- [ ] **Step 1: Add the test script and the TS setting**

In `package.json` `"scripts"`, add after `"lint": "eslint"`:

```json
    "lint": "eslint",
    "test": "node --test src/data/products.test.ts"
```

In `tsconfig.json` `compilerOptions`, add after `"noEmit": true,`:

```json
    "allowImportingTsExtensions": true,
```

(Node needs the `.ts` extension in the test's import. TypeScript allows it because `noEmit` is already on.)

- [ ] **Step 2: Write the failing test**

Create `src/data/products.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { products, getProduct, domainOf } from "./products.ts";

// WCAG 2.x relative luminance and contrast ratio for #rrggbb colors.
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("contrast helper matches the WCAG reference value", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
});

test("slugs are unique and URL-safe", () => {
  const slugs = products.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
});

test("every product links out over https and has 3–4 highlights", () => {
  for (const p of products) {
    assert.match(p.url, /^https:\/\//, p.name);
    assert.match(p.privacyUrl, /^https:\/\//, p.name);
    assert.ok(p.highlights.length >= 3 && p.highlights.length <= 4, p.name);
  }
});

test("theme colors are #rrggbb and meet WCAG AA (4.5:1)", () => {
  for (const { name, theme } of products) {
    for (const c of [theme.bg, theme.fg, theme.accent, theme.onAccent]) {
      assert.match(c, /^#[0-9a-f]{6}$/i, `${name} ${c}`);
    }
    assert.ok(contrast(theme.fg, theme.bg) >= 4.5, `${name} fg on bg`);
    assert.ok(contrast(theme.onAccent, theme.accent) >= 4.5, `${name} button text on accent`);
    assert.ok(contrast(theme.accent, theme.bg) >= 4.5, `${name} accent links on bg`);
  }
});

test("screenshots exist under public/", () => {
  for (const p of products) {
    if (p.screenshot) assert.ok(existsSync(`public${p.screenshot.src}`), p.screenshot.src);
  }
});

test("getProduct finds by slug, domainOf strips the scheme", () => {
  assert.equal(getProduct("appkavo")?.name, "AppKavo");
  assert.equal(getProduct("nope"), undefined);
  assert.equal(domainOf(getProduct("appkavo")!), "appkavo.com");
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL with `Cannot find module` … `src/data/products.ts`.

- [ ] **Step 4: Copy the BillMinute screenshot**

```bash
mkdir -p public/images/products
cp ~/invoice-app/apps/site/public/screens/create.png public/images/products/billminute.png
```

- [ ] **Step 5: Write the data file**

Create `src/data/products.ts`:

```ts
// Single source of truth for every product surface on the site.
// Adding a product = one entry here (+ a screenshot in public/images/products/).

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  audience: string;
  description: string;
  highlights: { title: string; body: string }[];
  url: string;
  privacyUrl: string;
  status: "live" | "beta";
  // onAccent = button text drawn on the accent color.
  theme: { bg: string; fg: string; accent: string; onAccent: string; font: "bricolage" | "poppins" };
  screenshot?: { src: string; width: number; height: number };
};

export const products: Product[] = [
  {
    slug: "appkavo",
    name: "AppKavo",
    tagline: "Know your mobile app is secure and store-ready before you ship.",
    audience: "For indie developers and mobile teams",
    description:
      "AppKavo audits mobile apps from the compiled build, the source code or a live URL. It returns a security score with ranked findings and fixes you can paste, predicts App Store and Google Play rejections, and drafts the privacy paperwork the stores ask for.",
    highlights: [
      {
        title: "Binary audit, no source needed",
        body: "Upload an APK, AAB or IPA and get a 0–100 security score with ranked findings.",
      },
      {
        title: "Store rejection, predicted",
        body: "Blockers and risks for Google Play and the App Store before you submit.",
      },
      {
        title: "Privacy paperwork, drafted",
        body: "Data Safety and App Privacy mappings, a privacy policy and terms from your build.",
      },
      {
        title: "Nightly vulnerability watch",
        body: "Dependencies re-checked against new CVEs without re-uploading.",
      },
    ],
    url: "https://appkavo.com",
    privacyUrl: "https://appkavo.com/privacy",
    status: "live",
    theme: { bg: "#0a0a0c", fg: "#f4f4f5", accent: "#fb8c2e", onAccent: "#0a0a0c", font: "bricolage" },
  },
  {
    slug: "billminute",
    name: "BillMinute",
    tagline: "Send a professional invoice in a minute, in any currency.",
    audience: "For freelancers and small businesses with clients anywhere",
    description:
      "BillMinute creates, sends and tracks invoices without accounting software. Your client sees the invoice in their currency and format and pays you directly, and you see what is outstanding, overdue and paid at a glance.",
    highlights: [
      {
        title: "An invoice in a minute",
        body: "Line items, taxes and discounts, from a template or your last invoice.",
      },
      {
        title: "Any currency, any format",
        body: "Your client's currency, date format and invoice wording.",
      },
      {
        title: "Clients pay you directly",
        body: "By bank transfer or your own pay links. BillMinute never holds payments.",
      },
      {
        title: "Your data is yours",
        body: "Export invoices, customers and payments to CSV at any time.",
      },
    ],
    url: "https://billminute.com",
    privacyUrl: "https://billminute.com/privacy",
    status: "live",
    theme: { bg: "#ffffff", fg: "#1d1d1f", accent: "#1f4fd8", onAccent: "#ffffff", font: "poppins" },
    screenshot: { src: "/images/products/billminute.png", width: 1080, height: 810 },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const domainOf = (product: Product) => new URL(product.url).hostname;
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test`
Expected: `ℹ pass 6`, `ℹ fail 0`. A Node "type stripping" ExperimentalWarning, if printed, is fine.

- [ ] **Step 7: Verify the build still passes**

Run: `npm run build && npm run lint`
Expected: both succeed. Nothing imports the data yet.

- [ ] **Step 8: Commit**

```bash
git add src/data package.json tsconfig.json public/images/products
git commit -m "feat: add product data as single source of truth

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Design foundation (tokens, fonts, LinkButton, Container, Logo)

**Files:**
- Modify: `src/app/globals.css` (full replace)
- Modify: `src/app/layout.tsx` (full replace)
- Create: `src/components/ui/LinkButton.tsx`, `src/components/ui/LinkButton.module.css`
- Modify: `src/components/ui/Container.tsx`, `src/components/ui/Container.module.css` (full replace)
- Modify: `src/components/ui/Logo.tsx`, `src/components/ui/Logo.module.css` (full replace)

**Interfaces:**
- Produces:
  - Global type classes: `t-display`, `t-subhead`, `t-heading`, `t-heading-sm`, `t-subheading`, `t-caption`.
  - CSS variables: `--color-hairline`, `--radius-pill`, `--radius-card`, `--shadow-xl`, and the `DESIGN.md` `--color-*` tokens.
  - Font variables: `--font-inter`, `--font-bricolage`, `--font-poppins`.
  - `LinkButton({ href: string; variant?: "filled" | "outlined"; children })`.
  - Button colors read `--btn-fill`, `--btn-on-fill`, `--btn-line`; focus rings read `--focus-ring`.
  - `Container({ children, className?, wide?: boolean, as? })`: 980px max-width by default, 1440px when `wide`.
  - `Logo({ className? })`.

- [ ] **Step 1: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  /* DESIGN.md tokens */
  --color-apple-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-signal-blue: #2997ff;
  --color-carbon: #1d1d1f;
  --color-frost: #f5f5f7;
  --color-ice: #f4f8fb;
  --color-smoke: #333333;
  --color-graphite: #474747;
  --color-ash: #707070;
  --color-mist: #858585;
  --color-onyx: #000000;
  --color-pebble: #e2e2e5;
  --color-hairline: #d2d2d7;

  /* SF Pro on Apple devices, Inter (DESIGN.md substitute) elsewhere */
  --font-sans: -apple-system, BlinkMacSystemFont, var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  --radius-pill: 980px;
  --radius-card: 8px;
  --shadow-xl: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px;

  /* LEGACY — old pages still read these; removed in Task 8 */
  --font-heading: var(--font-sans);
  --color-brand-primary: #4f46e5;
  --color-brand-indigo: #4338ca;
  --color-brand-royal: #4a3aff;
  --color-brand-accent: #00d2c4;
  --color-brand-teal: #14b8a6;
  --color-brand-emerald: #10b981;
  --color-brand-dark: #0f172a;
  --color-brand-muted: #475569;
  --color-brand-light: #f8fafc;
  --shadow-premium: 0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.01);
  --shadow-premium-hover: 0 20px 40px -12px rgba(79, 70, 229, 0.08), 0 1px 3px rgba(0, 0, 0, 0.01);
  --shadow-card: 0 10px 35px -15px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 20px 50px -15px rgba(79, 70, 229, 0.12);
  --radius-custom-xl: 20px;
  --radius-custom-2xl: 24px;
  /* END LEGACY */
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: var(--color-frost);
  color: var(--color-carbon);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.47;
  letter-spacing: -0.272px;
  overflow-wrap: break-word;
}

:focus-visible {
  outline: 2px solid var(--focus-ring, var(--color-apple-blue));
  outline-offset: 2px;
}

::selection {
  background: rgba(0, 113, 227, 0.2);
}

/* Type scale from DESIGN.md; mobile sizes below 734px */
@layer components {
  .t-display {
    font-size: 40px;
    line-height: 1.14;
    font-weight: 600;
    letter-spacing: 0.44px;
  }
  .t-subhead {
    font-size: 21px;
    line-height: 1.24;
    font-weight: 300;
    letter-spacing: -0.105px;
  }
  .t-heading {
    font-size: 28px;
    line-height: 1.18;
    font-weight: 600;
    letter-spacing: 0.196px;
  }
  .t-heading-sm {
    font-size: 24px;
    line-height: 1.18;
    font-weight: 600;
    letter-spacing: -0.264px;
  }
  .t-subheading {
    font-size: 21px;
    line-height: 1.24;
    font-weight: 600;
    letter-spacing: -0.105px;
  }
  .t-caption {
    font-size: 12px;
    line-height: 1.33;
    letter-spacing: -0.264px;
  }

  @media (min-width: 734px) {
    .t-display {
      font-size: 56px;
      line-height: 1.07;
      letter-spacing: 0.616px;
    }
    .t-subhead {
      font-size: 26px;
      line-height: 1.24;
      letter-spacing: 0;
    }
    .t-heading {
      font-size: 40px;
      line-height: 1.14;
      letter-spacing: 0.44px;
    }
    .t-heading-sm {
      font-size: 28px;
      letter-spacing: 0.196px;
    }
  }
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Product fonts: used only inside product-themed surfaces.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hicaso — a product studio",
  description:
    "Hicaso is a product studio. We build, launch and run independent software products, including AppKavo and BillMinute.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create `LinkButton`**

`src/components/ui/LinkButton.tsx`:

```tsx
import React from "react";
import Link from "next/link";
import styles from "./LinkButton.module.css";

interface LinkButtonProps {
  href: string;
  variant?: "filled" | "outlined";
  children: React.ReactNode;
}

// Pill-shaped link. Internal paths use next/link; http(s) opens in a new tab.
export const LinkButton: React.FC<LinkButtonProps> = ({ href, variant = "filled", children }) => {
  const className = `${styles.button} ${styles[variant]}`;

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
      {external && (
        <>
          <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
};

export default LinkButton;
```

`src/components/ui/LinkButton.module.css`:

```css
.button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 11px 21px;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-size: 17px;
  line-height: 1.18;
  font-weight: 400;
  letter-spacing: -0.272px;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s, filter 0.2s;
}

.filled {
  background: var(--btn-fill, var(--color-apple-blue));
  color: var(--btn-on-fill, #ffffff);
}

.filled:hover {
  filter: brightness(1.08);
}

.outlined {
  background: transparent;
  border-color: var(--btn-line, var(--color-link-blue));
  color: var(--btn-line, var(--color-link-blue));
}

.outlined:hover {
  background: var(--btn-line, var(--color-link-blue));
  color: var(--btn-on-fill, #ffffff);
}
```

- [ ] **Step 4: Replace `Container`**

`src/components/ui/Container.tsx`:

```tsx
import React from "react";
import styles from "./Container.module.css";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
  as?: "div" | "section" | "header" | "footer" | "main";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  wide = false,
  as: Component = "div",
}) => {
  return (
    <Component className={`${styles.container} ${wide ? styles.wide : ""} ${className}`}>
      {children}
    </Component>
  );
};

export default Container;
```

`src/components/ui/Container.module.css`:

```css
.container {
  width: 100%;
  max-width: 980px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
}

.wide {
  max-width: 1440px;
}

@media (min-width: 734px) {
  .container {
    padding-left: 22px;
    padding-right: 22px;
  }
}
```

- [ ] **Step 5: Replace `Logo`**

`src/components/ui/Logo.tsx`:

```tsx
import React from "react";
import Link from "next/link";
import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link href="/" className={`${styles.logo} ${className}`} aria-label="Hicaso home">
      <svg viewBox="0 0 40 40" fill="none" className={styles.mark} aria-hidden="true">
        <rect x="8" y="6" width="7" height="28" rx="3.5" fill="currentColor" />
        <rect x="25" y="6" width="7" height="28" rx="3.5" fill="currentColor" />
        <path
          d="M13 15C13 15 18 16.5 20 20C22 23.5 27 25 27 25"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.name}>Hicaso</span>
    </Link>
  );
};

export default Logo;
```

`src/components/ui/Logo.module.css`:

```css
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-carbon);
  text-decoration: none;
}

.mark {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.name {
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.2px;
}
```

- [ ] **Step 6: Verify**

Run: `npm run build && npm run lint && npm test`
Expected: all pass. The old pages still render, in old colors with the new canvas. That's expected until their rewrite tasks.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/ui
git commit -m "feat: add DESIGN.md tokens, product fonts, LinkButton

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Remove the services business and add redirects

**Files:**
- Delete: `src/app/services/` (whole folder), `src/app/work/` (whole folder)
- Delete: `src/components/home/Logos.tsx`, `Logos.module.css`, `Services.tsx`, `Services.module.css`
- Delete: `src/components/cards/` (whole folder)
- Modify: `src/app/page.tsx` (drop Logos, Services, About)
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: 308 redirects from `/services`, `/services/*` and `/work` to `/products`. `/products` 404s until Task 6; that's an accepted intermediate state.

- [ ] **Step 1: Delete the routes and components**

```bash
git rm -r -q src/app/services src/app/work src/components/cards \
  src/components/home/Logos.tsx src/components/home/Logos.module.css \
  src/components/home/Services.tsx src/components/home/Services.module.css
```

- [ ] **Step 2: Replace `src/app/page.tsx`**

`home/About` stays in the codebase, because `/about` still imports it until Task 7.

```tsx
import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Add the redirects to `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The services business is gone; send old links to the product lineup.
  async redirects() {
    return [
      { source: "/services/:path*", destination: "/products", permanent: true },
      { source: "/work", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 4: Verify nothing references the deleted code**

Run: `grep -rnE "cards/|home/(Logos|Services)|/services|/work" src`
Expected: no `import` line matches. Any remaining matches are plain `href`s in files rewritten later (Header and Footer in Task 4, the other pages in Task 7). Those links already 308 to `/products`.

- [ ] **Step 5: Build and check the redirects**

```bash
npm run build && npm run lint && npm test
npm run start -- -p 3100 &
sleep 4
for p in /services /services/web-development /work; do
  curl -s -o /dev/null -w "$p %{http_code} %{redirect_url}\n" http://localhost:3100$p
done
kill %1
```

Expected: three lines, each `308 http://localhost:3100/products`.

- [ ] **Step 6: Commit**

```bash
git add -A src next.config.ts
git commit -m "feat: remove services and work pages, redirect to /products

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Header and Footer, moved into the root layout

**Files:**
- Modify: `src/components/layout/Header.tsx`, `Header.module.css` (full replace)
- Modify: `src/components/layout/Footer.tsx`, `Footer.module.css` (full replace)
- Modify: `src/app/layout.tsx` (render Header, `<main>`, Footer)
- Modify: `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/careers/page.tsx`, `src/app/contact/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` (strip their own Header, Footer and `<main>`)

**Interfaces:**
- Consumes: `products` (Task 1), `Container` and `Logo` (Task 2).
- Produces: every page renders inside `<main className="flex-grow">` from the layout. Pages must not render `<Header>`, `<Footer>` or `<main>`.

- [ ] **Step 1: Replace `src/components/layout/Header.tsx`**

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import styles from "./Header.module.css";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import { products } from "@/data/products";

const links = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  // Products menu: close on Escape or a click outside it.
  useEffect(() => {
    if (!productsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProductsOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      if (!productsRef.current?.contains(e.target as Node)) setProductsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [productsOpen]);

  const close = () => {
    setMobileOpen(false);
    setProductsOpen(false);
  };

  const linkClass = (href: string) =>
    `${styles.link} ${pathname.startsWith(href) ? styles.active : ""}`;

  return (
    <header className={styles.header}>
      <Container wide className={styles.bar}>
        <Logo />

        <nav className={styles.desktopNav} aria-label="Main">
          <div className={styles.products} ref={productsRef}>
            <button
              type="button"
              className={linkClass("/products")}
              aria-expanded={productsOpen}
              aria-controls="products-menu"
              onClick={() => setProductsOpen((open) => !open)}
            >
              Products <ChevronDown size={12} aria-hidden="true" />
            </button>
            {productsOpen && (
              <div id="products-menu" className={styles.menu}>
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className={styles.menuItem}
                    onClick={close}
                  >
                    <span className={styles.menuName}>{p.name}</span>
                    <span className={styles.menuTagline}>{p.tagline}</span>
                  </Link>
                ))}
                <Link href="/products" className={styles.menuAll} onClick={close}>
                  All products
                </Link>
              </div>
            )}
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={styles.toggle}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {mobileOpen && (
        <nav id="mobile-menu" className={styles.mobileNav} aria-label="Mobile">
          <Link href="/products" className={styles.mobileLink} onClick={close}>
            Products
          </Link>
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className={styles.mobileSubLink}
              onClick={close}
            >
              {p.name}
            </Link>
          ))}
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={styles.mobileLink} onClick={close}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
```

Menus close through `onClick` on each link, not an effect on `pathname`. React 19's `react-hooks/set-state-in-effect` lint rule flags setState called directly in an effect.

- [ ] **Step 2: Replace `src/components/layout/Header.module.css`**

```css
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(245, 245, 247, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--color-hairline);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
}

.desktopNav {
  display: none;
  align-items: center;
  gap: 32px;
}

.link {
  font: inherit;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  background: none;
  border: 0;
  cursor: pointer;
  font-size: 12px;
  letter-spacing: -0.12px;
  color: var(--color-carbon);
  opacity: 0.8;
  text-decoration: none;
}

.link:hover,
.active {
  opacity: 1;
}

.products {
  position: relative;
}

.menu {
  position: absolute;
  top: calc(100% + 8px);
  left: -12px;
  width: 320px;
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-card);
}

.menuItem {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--radius-card);
  color: var(--color-carbon);
  text-decoration: none;
}

.menuItem:hover {
  background: var(--color-frost);
}

.menuName {
  font-size: 14px;
  font-weight: 600;
}

.menuTagline {
  font-size: 12px;
  line-height: 1.33;
  color: var(--color-graphite);
}

.menuAll {
  margin-top: 4px;
  padding: 10px 12px;
  border-top: 1px solid var(--color-hairline);
  font-size: 12px;
  color: var(--color-link-blue);
  text-decoration: none;
}

.menuAll:hover {
  text-decoration: underline;
}

.toggle {
  display: inline-flex;
  padding: 8px;
  background: none;
  border: 0;
  color: var(--color-carbon);
  cursor: pointer;
}

.mobileNav {
  display: flex;
  flex-direction: column;
  padding: 8px 16px 24px;
  border-top: 1px solid var(--color-hairline);
  background: var(--color-frost);
}

.mobileLink {
  padding: 12px 0;
  font-size: 21px;
  font-weight: 600;
  color: var(--color-carbon);
  text-decoration: none;
}

.mobileSubLink {
  padding: 8px 0 8px 16px;
  font-size: 17px;
  color: var(--color-graphite);
  text-decoration: none;
}

@media (min-width: 734px) {
  .desktopNav {
    display: flex;
  }
  .toggle,
  .mobileNav {
    display: none;
  }
}
```

- [ ] **Step 3: Replace `src/components/layout/Footer.tsx`**

```tsx
import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import Container from "../ui/Container";
import { products } from "@/data/products";

const columns = [
  {
    title: "Products",
    links: products.map((p) => ({ label: p.name, href: `/products/${p.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "hello@hicaso.com", href: "mailto:hello@hicaso.com" },
      { label: "+91 70091 37936", href: "tel:+917009137936" },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Container wide>
        <div className={styles.columns}>
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className={styles.heading}>{col.title}</h2>
              <ul className={styles.list}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("/") ? (
                      <Link href={l.href}>{l.label}</Link>
                    ) : (
                      <a href={l.href}>{l.label}</a>
                    )}
                  </li>
                ))}
                {col.title === "Contact" && (
                  <li>2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh)</li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.fine}>© {new Date().getFullYear()} Hicaso LLP</p>
      </Container>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 4: Replace `src/components/layout/Footer.module.css`**

```css
.footer {
  padding: 40px 0 24px;
  background: var(--color-frost);
  border-top: 1px solid var(--color-hairline);
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: -0.12px;
}

.columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px 24px;
}

.heading {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-carbon);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--color-graphite);
}

.list a {
  color: var(--color-graphite);
  text-decoration: none;
}

.list a:hover {
  text-decoration: underline;
}

.fine {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid var(--color-hairline);
  color: var(--color-graphite);
}

@media (min-width: 734px) {
  .columns {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

The spec suggests `#707070` for footer text. `#474747` is used instead, because `#707070` on `#f5f5f7` is 4.5:1 at 12px, right on the AA limit.

- [ ] **Step 5: Render Header, main and Footer in `src/app/layout.tsx`**

Add the imports after `import "./globals.css";`:

```tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
```

Replace the `<body>` line with:

```tsx
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
```

- [ ] **Step 6: Strip Header, Footer and `<main>` from every page**

All six pages use the same lines (checked with `grep`), so a mechanical edit is safe:

```bash
for f in src/app/page.tsx src/app/about/page.tsx src/app/careers/page.tsx \
         src/app/contact/page.tsx src/app/privacy/page.tsx src/app/terms/page.tsx; do
  sed -i '' \
    -e '/^import Header from "@\/components\/layout\/Header";$/d' \
    -e '/^import Footer from "@\/components\/layout\/Footer";$/d' \
    -e '/^ *<Header \/>$/d' \
    -e '/^ *<Footer \/>$/d' \
    -e 's|<main className="flex-grow">|<div>|' \
    -e 's|</main>|</div>|' "$f"
done
grep -rn "<Header\|<Footer\|<main" src/app
```

Expected: the final `grep` prints only `src/app/layout.tsx` lines.

- [ ] **Step 7: Verify the build, then the menus in a browser**

Run: `npm run build && npm run lint && npm test`. Expected: all pass.

Then run `npm run dev` and open http://localhost:3000, using a browser or the chrome-browser skill. Check:

- **Desktop (≥734px):**
  - Clicking **Products** opens the menu listing AppKavo and BillMinute with their taglines, plus "All products".
  - **Escape** closes it.
  - Clicking anywhere outside closes it.
  - Tab focus shows a blue 2px ring.
- **Mobile (390px):**
  - The menu icon opens the list.
  - Tapping **About** navigates and closes the menu.
- **Footer:** the Products column lists AppKavo and BillMinute, and the year is the current year.

Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add -A src
git commit -m "feat: product-aware header and footer in root layout

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Homepage (hero, product panels, principles, CTA)

**Files:**
- Create: `src/components/products/themeStyle.ts`
- Create: `src/components/products/ProductPanel.tsx`, `ProductPanel.module.css`
- Create: `src/components/common/Principles.tsx`, `Principles.module.css`
- Modify: `src/components/home/Hero.tsx`, `Hero.module.css` (full replace)
- Modify: `src/components/home/CTA.tsx`, `CTA.module.css` (full replace)
- Modify: `src/app/page.tsx` (full replace)
- Delete: `public/images/hero-laptop.png`, `public/images/cta-paperplane.png`

**Interfaces:**
- Consumes: `Product`, `products`, `domainOf` (Task 1); `LinkButton`, `Container`, the type classes and `--btn-*`/`--focus-ring` (Task 2).
- Produces:
  - `themeStyle(product: Product): React.CSSProperties`. It sets `--p-bg`, `--p-fg`, `--p-accent`, `--p-on-accent`, `--p-font`, `--btn-fill`, `--btn-on-fill`, `--btn-line`, `--focus-ring`, `background` and `color`.
  - `ProductPanel({ product })` and `Principles()`, with no props on `Principles`.

- [ ] **Step 1: Create `src/components/products/themeStyle.ts`**

```ts
import type { CSSProperties } from "react";
import type { Product } from "@/data/products";

const fonts = {
  bricolage: "var(--font-bricolage)",
  poppins: "var(--font-poppins)",
} as const;

// Paints a surface in a product's own brand. Children read only these variables,
// so a new product needs no new CSS.
export function themeStyle({ theme }: Product): CSSProperties {
  return {
    "--p-bg": theme.bg,
    "--p-fg": theme.fg,
    "--p-accent": theme.accent,
    "--p-on-accent": theme.onAccent,
    "--p-font": fonts[theme.font],
    "--btn-fill": theme.accent,
    "--btn-on-fill": theme.onAccent,
    "--btn-line": theme.accent,
    "--focus-ring": theme.accent,
    background: theme.bg,
    color: theme.fg,
  } as CSSProperties;
}
```

- [ ] **Step 2: Create `ProductPanel`**

`src/components/products/ProductPanel.tsx`:

```tsx
import React from "react";
import Image from "next/image";
import styles from "./ProductPanel.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";
import { themeStyle } from "./themeStyle";
import { domainOf, type Product } from "@/data/products";

interface ProductPanelProps {
  product: Product;
}

export const ProductPanel: React.FC<ProductPanelProps> = ({ product }) => {
  const titleId = `${product.slug}-title`;
  return (
    <section className={styles.panel} style={themeStyle(product)} aria-labelledby={titleId}>
      <Container>
        <h2 id={titleId} className={`t-display ${styles.name}`}>
          {product.name}
        </h2>
        {product.status === "beta" && <p className={styles.status}>Beta</p>}
        <p className={`t-subhead ${styles.tagline}`}>{product.tagline}</p>
        <p className={styles.audience}>{product.audience}</p>
        <div className={styles.actions}>
          <LinkButton href={`/products/${product.slug}`}>Learn more</LinkButton>
          <LinkButton href={product.url} variant="outlined">
            Visit {domainOf(product)}
          </LinkButton>
        </div>
      </Container>
      {product.screenshot && (
        <Container wide>
          <Image
            src={product.screenshot.src}
            width={product.screenshot.width}
            height={product.screenshot.height}
            alt={`${product.name} app screen`}
            sizes="(min-width: 980px) 900px, 100vw"
            className={styles.shot}
          />
        </Container>
      )}
    </section>
  );
};

export default ProductPanel;
```

`src/components/products/ProductPanel.module.css`:

```css
.panel {
  padding: 80px 0;
  text-align: center;
  overflow: hidden;
}

.name {
  font-family: var(--p-font);
}

.status {
  display: inline-block;
  margin-top: 8px;
  padding: 2px 10px;
  border: 1px solid currentColor;
  border-radius: var(--radius-pill);
  font-size: 12px;
}

.tagline {
  max-width: 680px;
  margin: 12px auto 0;
}

.audience {
  margin-top: 8px;
  opacity: 0.8;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

.shot {
  display: block;
  width: 100%;
  max-width: 900px;
  height: auto;
  margin: 48px auto 0;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-xl);
}
```

- [ ] **Step 3: Create `Principles`**

`src/components/common/Principles.tsx`:

```tsx
import React from "react";
import styles from "./Principles.module.css";
import Container from "../ui/Container";

const principles = [
  { title: "Small and sharp.", body: "Each product does one job well." },
  { title: "Run, not just launched.", body: "We keep operating and improving what we ship." },
  { title: "Your data stays yours.", body: "Clear pricing, honest limits, and export when you want it." },
];

export const Principles: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="principles-title">
      <Container>
        <h2 id="principles-title" className="t-heading">
          How we build
        </h2>
        <dl className={styles.list}>
          {principles.map((p) => (
            <div key={p.title}>
              <dt className="t-subheading">{p.title}</dt>
              <dd className={styles.body}>{p.body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
};

export default Principles;
```

`src/components/common/Principles.module.css`:

```css
.section {
  padding: 80px 0;
  text-align: center;
  background: var(--color-frost);
}

.list {
  display: grid;
  gap: 32px;
  margin-top: 40px;
}

.body {
  margin-top: 6px;
  color: var(--color-graphite);
}
```

- [ ] **Step 4: Replace `Hero` and `CTA`**

`src/components/home/Hero.tsx`:

```tsx
import React from "react";
import styles from "./Hero.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <Container>
        <h1 className="t-display">We build software products.</h1>
        <p className={`t-subhead ${styles.subtitle}`}>
          Hicaso is a product studio. We build, launch and run independent software — each one
          held to the same standard.
        </p>
        <div className={styles.actions}>
          <LinkButton href="/products">Explore products</LinkButton>
          <LinkButton href="/about" variant="outlined">
            About the studio
          </LinkButton>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
```

`src/components/home/Hero.module.css`:

```css
.hero {
  padding: 96px 0 80px;
  text-align: center;
  background: var(--color-frost);
}

.subtitle {
  max-width: 680px;
  margin: 16px auto 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}
```

`src/components/home/CTA.tsx`:

```tsx
import React from "react";
import styles from "./CTA.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";

export const CTA: React.FC = () => {
  return (
    <section className={styles.cta}>
      <Container>
        <h2 className="t-heading">Build the next one with us.</h2>
        <div className={styles.actions}>
          <LinkButton href="/careers">See careers</LinkButton>
          <LinkButton href="/contact" variant="outlined">
            Contact us
          </LinkButton>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
```

`src/components/home/CTA.module.css`:

```css
.cta {
  padding: 80px 0;
  text-align: center;
  background: var(--color-ice);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}
```

- [ ] **Step 5: Replace `src/app/page.tsx` and delete the old images**

```tsx
import Hero from "@/components/home/Hero";
import CTA from "@/components/home/CTA";
import Principles from "@/components/common/Principles";
import ProductPanel from "@/components/products/ProductPanel";
import { products } from "@/data/products";

export default function Home() {
  return (
    <>
      <Hero />
      {products.map((p) => (
        <ProductPanel key={p.slug} product={p} />
      ))}
      <Principles />
      <CTA />
    </>
  );
}
```

```bash
grep -rn "hero-laptop\|cta-paperplane" src || git rm -q public/images/hero-laptop.png public/images/cta-paperplane.png
```

Expected: `grep` finds nothing, so both files are removed.

- [ ] **Step 6: Build, then check the rendered home page (Review Focus 1 and 5)**

```bash
npm run build && npm run lint && npm test
npm run start -- -p 3100 &
sleep 4
curl -s http://localhost:3100/ > "$TMPDIR/home.html"
# 1. AppKavo panel (no screenshot) contains no <img>; BillMinute panel does.
node -e '
const h = require("fs").readFileSync(process.argv[1], "utf8");
const panel = (id) => h.slice(h.indexOf(`aria-labelledby="${id}"`), h.indexOf("</section>", h.indexOf(`aria-labelledby="${id}"`)));
if (/<img/.test(panel("appkavo-title"))) throw new Error("AppKavo panel has an <img>");
if (!/<img/.test(panel("billminute-title"))) throw new Error("BillMinute panel lost its screenshot");
// 5. Every external link opens safely in a new tab and says so.
const ext = h.match(/<a[^>]+href="https:\/\/[^"]+"[^>]*>/g) || [];
if (ext.length < 2) throw new Error("expected external product links");
for (const a of ext) if (!/target="_blank"/.test(a) || !/rel="noopener noreferrer"/.test(a)) throw new Error("unsafe: " + a);
if (!h.includes("(opens in a new tab)")) throw new Error("missing screen-reader text");
console.log("home checks OK:", ext.length, "external links");
' "$TMPDIR/home.html"
kill %1
```

Expected: `home checks OK: 2 external links`.

- [ ] **Step 7: Commit**

```bash
git add -A src public
git commit -m "feat: studio homepage with themed product panels

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: `/products` and `/products/[slug]`

**Files:**
- Create: `src/components/products/ProductTile.tsx`, `ProductTile.module.css`
- Create: `src/app/products/page.tsx`, `src/app/products/products.module.css`
- Create: `src/app/products/[slug]/page.tsx`, `src/app/products/[slug]/product.module.css`

**Interfaces:**
- Consumes: `products`, `getProduct`, `domainOf` (Task 1); `themeStyle` (Task 5); `LinkButton`, `Container` (Task 2).
- Produces: `ProductTile({ product })`; the routes `/products`, `/products/appkavo` and `/products/billminute`. Any other slug returns 404.

- [ ] **Step 1: Create `ProductTile`**

`src/components/products/ProductTile.tsx`:

```tsx
import React from "react";
import Link from "next/link";
import styles from "./ProductTile.module.css";
import { themeStyle } from "./themeStyle";
import type { Product } from "@/data/products";

interface ProductTileProps {
  product: Product;
}

export const ProductTile: React.FC<ProductTileProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.slug}`} className={styles.tile} style={themeStyle(product)}>
      <h2 className={`t-heading-sm ${styles.name}`}>{product.name}</h2>
      <p className={styles.tagline}>{product.tagline}</p>
      <span className={styles.more}>Learn more ›</span>
    </Link>
  );
};

export default ProductTile;
```

`src/components/products/ProductTile.module.css`:

```css
.tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 260px;
  padding: 40px 32px;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-card);
  text-decoration: none;
}

.name {
  font-family: var(--p-font);
}

.tagline {
  opacity: 0.85;
}

.more {
  margin-top: auto;
  color: var(--p-accent);
}

.tile:hover .more {
  text-decoration: underline;
}
```

- [ ] **Step 2: Create `/products`**

`src/app/products/page.tsx`:

```tsx
import type { Metadata } from "next";
import styles from "./products.module.css";
import Container from "@/components/ui/Container";
import ProductTile from "@/components/products/ProductTile";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products — Hicaso",
  description: `Software built and run by Hicaso: ${products.map((p) => p.name).join(", ")}.`,
};

export default function ProductsPage() {
  return (
    <section className={styles.page}>
      <Container wide>
        <div className={styles.intro}>
          <h1 className="t-display">Products.</h1>
          <p className="t-subhead">Built and run by Hicaso.</p>
        </div>
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductTile key={p.slug} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
```

`src/app/products/products.module.css`:

```css
.page {
  padding: 80px 0 96px;
}

.intro {
  margin-bottom: 48px;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

@media (min-width: 734px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 3: Create `/products/[slug]`**

`src/app/products/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./product.module.css";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/LinkButton";
import { themeStyle } from "@/components/products/themeStyle";
import { products, getProduct, domainOf } from "@/data/products";

// Only slugs from the data file exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: `${product.name} — a Hicaso product`, description: product.tagline };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const domain = domainOf(product);

  return (
    <>
      <section className={styles.hero} style={themeStyle(product)}>
        <Container>
          <h1 className={`t-display ${styles.name}`}>{product.name}</h1>
          <p className={`t-subhead ${styles.tagline}`}>{product.tagline}</p>
          <p className={styles.audience}>{product.audience}</p>
          <div className={styles.actions}>
            <LinkButton href={product.url}>Visit {domain}</LinkButton>
            <LinkButton href="/products" variant="outlined">
              All products
            </LinkButton>
          </div>
        </Container>
      </section>

      <section className={styles.details}>
        <Container>
          <p className={`t-subhead ${styles.description}`}>{product.description}</p>
          <ul className={styles.highlights}>
            {product.highlights.map((h) => (
              <li key={h.title}>
                <h2 className="t-subheading">{h.title}</h2>
                <p className={styles.highlightBody}>{h.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className={styles.closing} style={themeStyle(product)}>
        <Container>
          <h2 className={`t-heading ${styles.name}`}>Ready to try {product.name}?</h2>
          <div className={styles.actions}>
            <LinkButton href={product.url}>Visit {domain}</LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
```

`src/app/products/[slug]/product.module.css`:

```css
.hero,
.closing {
  padding: 96px 0;
  text-align: center;
}

.name {
  font-family: var(--p-font);
}

.tagline {
  max-width: 680px;
  margin: 12px auto 0;
}

.audience {
  margin-top: 8px;
  opacity: 0.8;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

.details {
  padding: 80px 0;
  background: var(--color-frost);
}

.description {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
}

.highlights {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 32px 40px;
  margin-top: 56px;
}

.highlightBody {
  margin-top: 6px;
  color: var(--color-graphite);
}

@media (min-width: 734px) {
  .highlights {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 4: Build**

Run: `npm run build && npm run lint && npm test`

Expected: all pass, and the build output lists `● /products/[slug]` with `/products/appkavo` and `/products/billminute` under it.

`PageProps` is a global type that `next build` generates. If an editor shows it as unknown before the first build, that's normal.

- [ ] **Step 5: Check the routes and redirects (Review Focus 2)**

```bash
npm run start -- -p 3100 &
sleep 4
for p in /products /products/appkavo /products/billminute /products/nope /services/web-development; do
  curl -s -o /dev/null -w "$p %{http_code}\n" http://localhost:3100$p
done
curl -s http://localhost:3100/products/appkavo | grep -o "<title>[^<]*</title>"
kill %1
```

Expected:

```
/products 200
/products/appkavo 200
/products/billminute 200
/products/nope 404
/services/web-development 308
<title>AppKavo — a Hicaso product</title>
```

- [ ] **Step 6: Commit**

```bash
git add src/components/products src/app/products
git commit -m "feat: products index and per-product overview pages

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: About, Careers, Contact

**Files:**
- Create: `src/styles/page.module.css` (shared by the simple pages and, in Task 8, the legal pages)
- Modify (full replace): `src/app/about/page.tsx`, `src/app/careers/page.tsx`, `src/app/contact/page.tsx`
- Delete: `src/app/about/about.module.css`, `src/app/careers/careers.module.css`, `src/app/contact/contact.module.css`
- Delete: `src/components/home/About.tsx`, `About.module.css`, `Stats.tsx`, `Stats.module.css`, `public/images/about-team.png`

**Interfaces:**
- Consumes: `Principles` (Task 5), `products` (Task 1), `Container` (Task 2).
- Produces: `src/styles/page.module.css` with classes `hero`, `section`, `facts` and `prose`.

- [ ] **Step 1: Create `src/styles/page.module.css`**

```css
.hero {
  padding: 96px 0 48px;
  text-align: center;
}

.hero p {
  max-width: 680px;
  margin: 16px auto 0;
}

.section {
  padding: 48px 0 96px;
}

/* Label/value list (About facts, Contact details) */
.facts {
  max-width: 692px;
  margin: 24px auto 0;
  border-top: 1px solid var(--color-hairline);
}

.facts > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 4px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-hairline);
}

.facts dt {
  font-size: 14px;
  color: var(--color-graphite);
}

/* Long-form text (Careers, Privacy, Terms) */
.prose {
  max-width: 692px;
  margin: 0 auto;
}

.prose h2 {
  margin: 40px 0 12px;
  font-size: 21px;
  font-weight: 600;
}

.prose p,
.prose li {
  color: var(--color-smoke);
}

.prose p + p {
  margin-top: 12px;
}

.prose ul {
  margin-top: 12px;
  padding-left: 24px;
  list-style: disc;
}

.prose li + li {
  margin-top: 8px;
}

.facts a,
.prose a {
  color: var(--color-link-blue);
  text-decoration: none;
}

.facts a:hover,
.prose a:hover {
  text-decoration: underline;
}

.heading {
  max-width: 692px;
  margin: 0 auto;
}

@media (min-width: 734px) {
  .facts > div {
    grid-template-columns: 200px minmax(0, 1fr);
  }
}
```

- [ ] **Step 2: Replace `src/app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";
import Principles from "@/components/common/Principles";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "About — Hicaso",
  description:
    "Hicaso is a product studio in Chandigarh, India. We build, launch and run independent software products.",
};

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">A product studio.</h1>
          <p className="t-subhead">
            Hicaso builds, launches and runs independent software products. The common thread is
            quality, not audience.
          </p>
        </Container>
      </section>

      <Principles />

      <section className={styles.section}>
        <Container>
          <h2 className={`t-heading-sm ${styles.heading}`}>The company</h2>
          <dl className={styles.facts}>
            <div>
              <dt>Legal name</dt>
              <dd>Hicaso LLP</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>Chandigarh, India</dd>
            </div>
            <div>
              <dt>Products</dt>
              <dd>{products.map((p) => p.name).join(", ")}</dd>
            </div>
          </dl>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Replace `src/app/careers/page.tsx`**

```tsx
import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Careers — Hicaso",
  description: "Work at Hicaso, a product studio that builds and runs its own software products.",
};

export default function CareersPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">Careers</h1>
          <p className="t-subhead">
            We&apos;re a small team that builds, ships and runs its own products. We work
            remotely, own what we make, and keep the bar high.
          </p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.prose}>
            <h2>Open roles</h2>
            <p>
              No open roles right now. Send your work to{" "}
              <a href="mailto:hello@hicaso.com?subject=Working%20at%20Hicaso">hello@hicaso.com</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Replace `src/app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact — Hicaso",
  description: "Contact Hicaso LLP: email, phone and address in Chandigarh, India.",
};

export default function ContactPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">Contact</h1>
          <p className="t-subhead">Questions about Hicaso or one of our products? Write to us.</p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <dl className={styles.facts}>
            <div>
              <dt>Email</dt>
              <dd>
                <a href="mailto:hello@hicaso.com">hello@hicaso.com</a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href="tel:+917009137936">+91 70091 37936</a>
              </dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh)</dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>Mon–Fri, 9:00 AM–6:00 PM IST</dd>
            </div>
          </dl>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Delete what these pages no longer use**

```bash
git rm -q src/app/about/about.module.css src/app/careers/careers.module.css \
  src/app/contact/contact.module.css \
  src/components/home/About.tsx src/components/home/About.module.css \
  src/components/home/Stats.tsx src/components/home/Stats.module.css
grep -rn "about-team" src || git rm -q public/images/about-team.png
grep -rnE "home/(About|Stats)|about\.module|careers\.module|contact\.module" src
```

Expected: the final `grep` prints nothing.

- [ ] **Step 6: Verify**

```bash
npm run build && npm run lint && npm test
npm run start -- -p 3100 &
sleep 4
for p in /about /careers /contact; do
  curl -s -o /dev/null -w "$p %{http_code}\n" http://localhost:3100$p
done
curl -s http://localhost:3100/about | grep -c "<h1"
kill %1
```

Expected: three `200` lines, then `1` (one `<h1>` on /about).

- [ ] **Step 7: Commit**

```bash
git add -A src public
git commit -m "feat: rewrite about, careers and contact for the studio

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Legal pages, cleanup and final verification

**Files:**
- Modify (full replace): `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`
- Delete: `src/app/privacy/legal.module.css`, `src/components/ui/Badge.tsx`, `Badge.module.css`, `src/components/ui/Button.tsx`, `Button.module.css`, `src/components/common/SectionHeading.tsx`, `SectionHeading.module.css`
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` (default scaffold assets, only if unreferenced)
- Modify: `src/app/globals.css` (remove the LEGACY block)
- Modify: `package.json` and `package-lock.json` (uninstall `framer-motion`)

**Interfaces:**
- Consumes: `src/styles/page.module.css` (Task 7), `products[].privacyUrl` (Task 1).
- Produces: the finished site.

- [ ] **Step 1: Replace `src/app/privacy/page.tsx`**

Legal substance is unchanged. The changes are: services wording swapped for product-company wording, a product policy list, the email typo `hicasollp.com` fixed to `hicaso.com`, and a new date.

```tsx
import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Privacy Policy — Hicaso",
  description: "How Hicaso LLP handles personal data on hicaso.com.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">Privacy Policy</h1>
          <p className="t-subhead">Last updated: October 2026 · Hicaso LLP</p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.prose}>
            <h2>1. Introduction</h2>
            <p>
              At Hicaso LLP (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or
              &quot;us&quot;), we respect your privacy and are committed to protecting the personal
              data you share with us. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit hicaso.com or contact us.
            </p>
            <p>
              Each Hicaso product has its own privacy policy, which applies when you use that
              product:
            </p>
            <ul>
              {products.map((p) => (
                <li key={p.slug}>
                  <a href={p.privacyUrl}>{p.name} Privacy Policy</a>
                </li>
              ))}
            </ul>

            <h2>2. Information We Collect</h2>
            <p>We collect information that you voluntarily provide when you contact us directly:</p>
            <ul>
              <li>Personal identifiers (e.g., Name, Email Address, Phone Number).</li>
              <li>Professional details (e.g., Company Name, Job Title).</li>
              <li>
                Technical data automatically collected (e.g., IP address, browser type, device
                information).
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for legitimate business purposes including:</p>
            <ul>
              <li>Responding to inquiries and messages you send us.</li>
              <li>Reviewing work samples and job applications you send us.</li>
              <li>Improving website user experience and security protocols.</li>
              <li>Complying with applicable legal obligations and industry standards.</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard administrative, physical, and technical security
              measures—including TLS encryption and strict access controls—to protect your personal
              information against unauthorized access, loss, or alteration.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              If you have questions or concerns regarding this Privacy Policy, please contact us at{" "}
              <a href="mailto:hello@hicaso.com">hello@hicaso.com</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Replace `src/app/terms/page.tsx`**

```tsx
import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions — Hicaso",
  description: "Terms for using the hicaso.com website.",
};

export default function TermsConditionsPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">Terms &amp; Conditions</h1>
          <p className="t-subhead">Last updated: October 2026 · Hicaso LLP</p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.prose}>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using the hicaso.com website provided by Hicaso LLP
              (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by
              these Terms and Conditions. If you disagree with any part of these terms, you may not
              access the website. Each Hicaso product is governed by its own terms of service,
              published on that product&apos;s website.
            </p>

            <h2>2. Intellectual Property</h2>
            <p>
              All website content, branding and proprietary materials remain the exclusive
              property of Hicaso LLP.
            </p>

            <h2>3. User Obligations &amp; Conduct</h2>
            <p>
              Users agree not to engage in any activity that interferes with or disrupts the
              integrity, security, or performance of our website or hosted server environments.
            </p>

            <h2>4. Limitation of Liability</h2>
            <p>
              In no event shall Hicaso LLP, its partners, employees, or agents be liable for
              indirect, incidental, special, consequential, or punitive damages arising from the
              use of or inability to use our digital channels.
            </p>

            <h2>5. Governing Law &amp; Contact</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India. For
              legal inquiries regarding these terms, please contact us at{" "}
              <a href="mailto:hello@hicaso.com">hello@hicaso.com</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Delete the unused components and styles**

```bash
git rm -q src/app/privacy/legal.module.css \
  src/components/ui/Badge.tsx src/components/ui/Badge.module.css \
  src/components/ui/Button.tsx src/components/ui/Button.module.css \
  src/components/common/SectionHeading.tsx src/components/common/SectionHeading.module.css
grep -rnE "ui/Badge|ui/Button\"|SectionHeading|legal\.module|framer-motion" src
```

Expected: the `grep` prints nothing.

- [ ] **Step 4: Uninstall `framer-motion` and remove unreferenced scaffold assets**

```bash
npm uninstall framer-motion
for f in file globe next vercel window; do
  grep -rq "$f.svg" src || git rm -q "public/$f.svg"
done
```

- [ ] **Step 5: Remove the LEGACY token block from `src/app/globals.css`**

Delete every line from `  /* LEGACY — old pages still read these; removed in Task 8 */` through `  /* END LEGACY */`, inclusive. Then confirm nothing still reads a legacy token:

```bash
grep -rnE "brand-|font-heading|shadow-(premium|card)|radius-custom|LEGACY" src
```

Expected: the `grep` prints nothing.

- [ ] **Step 6: Check radii and shadows against `DESIGN.md`**

```bash
grep -rnE "border-radius|box-shadow" src --include=*.css | grep -vE "var\(--radius-(pill|card)\)|var\(--shadow-xl\)"
```

Expected: the `grep` prints nothing. Every radius is a pill or card token, and the only shadow is `--shadow-xl`.

- [ ] **Step 7: Full build and checks**

Run: `npm run build && npm run lint && npm test`
Expected: all pass.

- [ ] **Step 8: Check every route**

```bash
npm run start -- -p 3100 &
sleep 4
for p in / /products /products/appkavo /products/billminute /about /careers /contact /privacy /terms /products/nope /services /services/web-development /work; do
  curl -s -o /dev/null -w "$p %{http_code}\n" http://localhost:3100$p
done
for p in / /products /products/appkavo /about /careers /contact /privacy /terms; do
  printf "%s h1=%s\n" $p "$(curl -s http://localhost:3100$p | grep -o '<h1' | wc -l | tr -d ' ')"
done
```

Expected:

- Status codes: `200` for the nine real pages, `404` for `/products/nope`, `308` for the three old addresses.
- `h1=1` on every page in the second list.

Leave the server running for Step 9.

- [ ] **Step 9: Take screenshots at three widths (Review Focus 4)**

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SHOTS="$TMPDIR/hicaso-shots"; mkdir -p "$SHOTS"
for w in 320 390 1440; do
  for p in "" products/appkavo; do
    name=$(echo "${p:-home}" | tr / -)
    "$CHROME" --headless=new --hide-scrollbars --window-size=$w,2400 \
      --screenshot="$SHOTS/$name-$w.png" "http://localhost:3100/$p" 2>/dev/null
  done
done
kill %1
ls "$SHOTS"
```

Open each PNG and check:

- No content is cut off at the right edge, and there's no sideways scroll.
- Product panels show their own colors and fonts: AppKavo dark with amber, BillMinute white with blue.
- Buttons are pills, the BillMinute screenshot has 8px corners, and the header is a single 48px bar.

If something overflows at 320px, fix it at its source, usually a missing `minmax(0, 1fr)` or a fixed width, then re-run Steps 7–9.

- [ ] **Step 10: Commit**

```bash
git add -A src public package.json package-lock.json
git commit -m "feat: studio legal pages, remove agency leftovers

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```
