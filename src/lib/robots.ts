import { SITE_URL } from "./site.ts";

// Hand-written because Next's MetadataRoute.Robots cannot emit a Content-Signal line.
// Owner's policy (2026-11-19): AI search, AI answers and AI training all allowed.
export function robotsText(): string {
  return [
    "User-agent: *",
    "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /admin",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
}
