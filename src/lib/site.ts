export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hicaso.com").replace(/\/$/, "");

// JSON-LD for a <script type="application/ld+json">; `<` escaped so a string can't close the tag (Next JSON-LD guide).
export const ldJson = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

// Owner's profiles (2026-11-13), share-tracking query strings dropped. Rendered in the footer (.socials, mono icons
// from icons.mjs in public/assets/icons) and as JSON-LD sameAs.
export const SOCIAL: { label: string; url: string; icon: string }[] = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/hicaso-llp/", icon: "linkedin" },
  { label: "X", url: "https://x.com/hicasollp", icon: "x" },
  { label: "YouTube", url: "https://www.youtube.com/@hicasollp", icon: "youtube" },
  { label: "Instagram", url: "https://www.instagram.com/hicasollp", icon: "instagram" },
];

// Only https links render, so an empty or mistyped URL never ships as a dead or unsafe href.
export const httpsLinks = <T extends { url: string }>(links: T[]): T[] =>
  links.filter((l) => l.url.startsWith("https://"));

// Booking link (owner's Cal.com, 2026-11-14); an empty value hides its links.
export const BOOKING_URL = "https://cal.com/hicaso/free-30-minute-call-with-hicaso";
// WhatsApp, digits only in international form: the office phone, +91 70091 37936 (owner, 2026-11-13).
export const WHATSAPP = "917009137936";

export const whatsappUrl = (digits: string): string | null =>
  /^\d{10,15}$/.test(digits) ? `https://wa.me/${digits}` : null;
