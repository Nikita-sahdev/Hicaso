import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// Analytics (src/lib/analytics.ts) load only after consent, and only when their ID is set: the policy opens each
// tool's origins only then.
const on = (v?: string) => !!v?.trim();
const TOOLS = [
  on(process.env.NEXT_PUBLIC_GA_ID) && {
    script: "https://www.googletagmanager.com",
    connect: "https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    img: "https://*.google-analytics.com https://www.googletagmanager.com",
  },
  on(process.env.NEXT_PUBLIC_CLARITY_ID) && {
    script: "https://www.clarity.ms https://*.clarity.ms",
    connect: "https://*.clarity.ms https://c.bing.com",
    img: "https://*.clarity.ms https://c.bing.com",
  },
  on(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID) && {
    script: "https://snap.licdn.com",
    connect: "https://px.ads.linkedin.com https://*.linkedin.com",
    img: "https://px.ads.linkedin.com https://*.linkedin.com",
  },
].filter((t): t is { script: string; connect: string; img: string } => !!t);
const extra = (k: "script" | "connect" | "img") => TOOLS.map((t) => " " + t[k]).join("");

// The no-nonce policy from the Next docs (guides/content-security-policy.md): pages stay static.
// Outside origins: Google Fonts (CSS and files); the enquiry form's no-script fallback posts to mailto:.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${extra("script")}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `img-src 'self' blob: data:${extra("img")}`,
  `connect-src 'self'${extra("connect")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // browsers act on it only over HTTPS; no includeSubDomains until every subdomain serves HTTPS
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  // The dev-only route badge sat over the footer's links at 390; errors still show (docs: devIndicators).
  devIndicators: false,
  // no "X-Powered-By: Next.js" on every response
  poweredByHeader: false,
  // Image uploads go through a server action: 3 MB image plus multipart overhead.
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  // Old /work links go to the product lineup.
  async redirects() {
    return [
      { source: "/work", destination: "/products", permanent: true },
      // /technologies/* and /industries/* have no parent page: /services lists both. Temporary (307), so browsers
      // don't cache it and a real hub page can replace it later.
      { source: "/technologies", destination: "/services", permanent: false },
      { source: "/industries", destination: "/services", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
