import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { orgLd, websiteLd } from "@/lib/schema";
import Analytics from "@/components/analytics/Analytics";
import { ANALYTICS } from "@/lib/analytics";
import { products } from "@/data/products";
import { OG, PROFILES, SITE_URL, SOCIAL, httpsLinks, ldJson } from "@/lib/site";
import { listLivePostsSafe } from "@/lib/blog/store";

// The Blog link shows once a post is live; re-checked every minute and after admin writes. A DB outage only hides it.
export const revalidate = 60;

const SAME_AS = httpsLinks([...SOCIAL, ...PROFILES]).map((l) => l.url);

// The kit stylesheets, joined in cascade order into one file by scripts/kit-css.mjs (predev, prebuild): the list
// lives there. One render-blocking request instead of 23.
// backgrounds.js sets page tokens before first paint, so it stays a blocking script, but inline: no request
// queued behind the stylesheets.
const BACKGROUNDS_JS = readFileSync(join(process.cwd(), "public/assets/backgrounds/backgrounds.js"), "utf8");
// the dealt moment's loader, its lib and the moment, preloaded as SK/assets/moments/_demo/in-page-service.html does
const MOMENT_PRELOADS = ["moments/moments.js", "moments/lib.js", "moments/pinned-chapters/moment.js"];
const MODULES = ["system.js", "motion/motion.js", "layout/layout.js", "diagrams/mount.js"];

// Palette lines as `start.mjs brand --page software --bg #ffffff --ink #0a0a0a --accent #2456d6` prints them
// (owner's choice: white + blueprint blue); type instrument, radius soft from the original deal.
const ROOT_TOKENS = `
:root {
  --p-bg: #ffffff; --p-surface: #f1f1f1; --p-ink: #0a0a0a; --p-muted: #6c6c6c;
  --p-accent: #2456d6; --p-accent-ink: #ffffff; --p-action: #2456d6; --p-action-ink: #ffffff;
  --p-inv-bg: #0a0a0a; --p-inv-surface: #171717; --p-inv-ink: #ffffff; --p-inv-muted: #979797;
  --p-inv-accent: #2456d6; --p-inv-accent-ink: #ffffff; --p-inv-action: #2456d6; --p-inv-action-ink: #ffffff;
  --font-display: "Instrument Sans", system-ui, sans-serif;
  --font-text: "Instrument Sans", system-ui, sans-serif;
  --font-mono: "DM Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --display-weight: 500;
  --display-tracking: -0.028em;
  --display-tracking-xl: -0.036em;
  --display-stretch: 96%;
  --ly-scale: 1.04;
}
`;

// Hero entrance guard from the kit's starter.html, verbatim.
const M_ENTER = "document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)";
// Moments guard from the kit's starter.html / in-page-service.html, verbatim.
const MO_JS = "document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)";


// one Organization (with the @id every other entity points to) and the WebSite, from src/lib/schema.ts
const ORG_LD = orgLd(SAME_AS);
const SITE_LD = websiteLd();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Custom Software Development Company in India — Hicaso",
  description: `Hicaso builds generative AI, agentic AI, mobile and web software for clients worldwide, and ships its own products, including ${products.map((p) => p.name).join(" and ")}.`,
  openGraph: { type: "website", ...OG },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const blog = (await listLivePostsSafe()).length > 0;
  return (
    <html
      lang="en"
      data-type="software"
      data-radius="soft"
      data-ground="sky"
      data-buttons="solid"
      data-motion=""
      suppressHydrationWarning
    >
      <head>
        <meta name="page-type" content="software" />
        <meta name="site-kind" content="software" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout, loads on every page */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-css-tags -- the kit is plain files in /public, joined by scripts/kit-css.mjs, never bundled */}
        <link rel="stylesheet" href="/kit.css" />
        {/* keep after the links: layout.css resets --ly-scale */}
        <style dangerouslySetInnerHTML={{ __html: ROOT_TOKENS }} />
        <script dangerouslySetInnerHTML={{ __html: M_ENTER }} />
        <script dangerouslySetInnerHTML={{ __html: MO_JS }} />
        {MOMENT_PRELOADS.map((href) => (
          <link key={href} rel="modulepreload" href={`/assets/${href}`} />
        ))}
        <script dangerouslySetInnerHTML={{ __html: BACKGROUNDS_JS }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ORG_LD)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(SITE_LD)} />
      </head>
      <body>
        <Header blog={blog} />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer blog={blog} />
        {MODULES.map((src) => (
          <Script key={src} src={`/assets/${src}`} type="module" crossOrigin="anonymous" strategy="afterInteractive" />
        ))}
        {/* GA4, Clarity and LinkedIn: each on when its ID is set, loaded only after the visitor accepts */}
        {ANALYTICS.tools.length ? <Analytics ids={ANALYTICS.ids} tools={ANALYTICS.tools} /> : null}
      </body>
    </html>
  );
}
