export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hicaso.com").replace(/\/$/, "");

// JSON-LD for a <script type="application/ld+json">; `<` escaped so a string can't close the tag (Next JSON-LD guide).
export const ldJson = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
