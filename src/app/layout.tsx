import type { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { products } from "@/data/products";

const STYLESHEETS = [
  "system.css",
  "ui/cards.css",
  "motion/motion.css",
  "backgrounds/backgrounds.css",
  "layout/layout.css",
  "icons/icon.css",
  "ui/base.css",
  "ui/window/fragment.css",
  "diagrams/diagram.css",
];
const MODULES = ["system.js", "motion/motion.js", "layout/layout.js", "diagrams/mount.js"];

// The :root block exactly as start.mjs prints it (palette putty-black-teal, type instrument, radius soft).
const ROOT_TOKENS = `
:root {
  --p-bg: #dedad3; --p-surface: #d3cec6; --p-ink: #0a0a0a; --p-muted: #55514c;
  --p-accent: #256f82; --p-accent-ink: #ffffff; --p-action: #256f82; --p-action-ink: #ffffff;
  --p-inv-bg: #0a0a0a; --p-inv-surface: #151515; --p-inv-ink: #dedad3; --p-inv-muted: #84827e;
  --p-inv-accent: #256f82; --p-inv-accent-ink: #ffffff; --p-inv-action: #256f82; --p-inv-action-ink: #ffffff;
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

// Product fonts: used only inside product-themed surfaces.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hicaso — software development and product studio",
  description: `Hicaso builds generative AI, agentic AI, mobile and web software for clients worldwide, and ships its own products, including ${products.map((p) => p.name).join(" and ")}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-type="software"
      data-radius="soft"
      data-ground="sand"
      data-buttons="solid"
      data-motion=""
      className={`${bricolage.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="page-type" content="software" />
        <meta name="site-kind" content="software" />
        <meta name="theme-color" content="#dedad3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout, loads on every page */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {STYLESHEETS.map((href) => (
          <link key={href} rel="stylesheet" href={`/assets/${href}`} />
        ))}
        {/* keep after the links: layout.css resets --ly-scale */}
        <style dangerouslySetInnerHTML={{ __html: ROOT_TOKENS }} />
        <script dangerouslySetInnerHTML={{ __html: M_ENTER }} />
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- kit grounds set page tokens before first paint */}
        <script src="/assets/backgrounds/backgrounds.js" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        {MODULES.map((src) => (
          <Script key={src} src={`/assets/${src}`} type="module" strategy="afterInteractive" />
        ))}
      </body>
    </html>
  );
}
