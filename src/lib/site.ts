export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hicaso.com").replace(/\/$/, "");

// JSON-LD for a <script type="application/ld+json">; `<` escaped so a string can't close the tag (Next JSON-LD guide).
export const ldJson = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

// Owner's profiles (2026-11-13), share-tracking query strings dropped. Rendered in the footer and as JSON-LD sameAs.
export const SOCIAL: { label: string; url: string }[] = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/hicaso-llp/" },
  { label: "X", url: "https://x.com/hicasollp" },
  { label: "YouTube", url: "https://www.youtube.com/@hicasollp" },
  { label: "Instagram", url: "https://www.instagram.com/hicasollp" },
];

// Only https links render, so an empty or mistyped URL never ships as a dead or unsafe href.
export const httpsLinks = <T extends { url: string }>(links: T[]): T[] =>
  links.filter((l) => l.url.startsWith("https://"));
