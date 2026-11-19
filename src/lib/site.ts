export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hicaso.com").replace(/\/$/, "");

// JSON-LD for a <script type="application/ld+json">; `<` escaped so a string can't close the tag (Next JSON-LD guide).
// BreadcrumbList JSON-LD from [name, path] pairs, home first
export const breadcrumbLd = (trail: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${path}` })),
});
export const ldJson = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

// Owner's profiles (2026-11-13), share-tracking query strings dropped. Rendered in the footer (.socials, mono icons
// from icons.mjs in public/assets/icons) and as JSON-LD sameAs.
export const SOCIAL: { label: string; url: string; icon: string }[] = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/hicaso-llp/", icon: "linkedin" },
  { label: "X", url: "https://x.com/hicasollp", icon: "x" },
  { label: "YouTube", url: "https://www.youtube.com/@hicasollp", icon: "youtube" },
  { label: "Instagram", url: "https://www.instagram.com/hicasollp", icon: "instagram" },
];

// Review-site profiles (owner, 2026-11-17): a text line in the footer (the kit has no marks for them) and JSON-LD sameAs.
export const PROFILES: { label: string; url: string }[] = [
  { label: "Clutch", url: "https://clutch.co/profile/hicaso" },
  { label: "GoodFirms", url: "https://www.goodfirms.co/company/hicaso" },
];

// Link previews (WhatsApp, LinkedIn, X): one shared card. Pages that set their own openGraph spread this in, since
// Next replaces a parent's openGraph whole; og:title/description come from each page's own title and description.
export const OG = {
  siteName: "Hicaso",
  locale: "en_US",
  images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hicaso: AI, mobile and web software, built to order" }],
};

// Only https links render, so an empty or mistyped URL never ships as a dead or unsafe href.
export const httpsLinks = <T extends { url: string }>(links: T[]): T[] =>
  links.filter((l) => l.url.startsWith("https://"));

// Booking link (owner's Cal.com, 2026-11-14); an empty value hides its links.
export const BOOKING_URL = "https://cal.com/hicaso/free-30-minute-call-with-hicaso";
// The office phone (owner, 2026-11-13): shown as `display`, dialled as `tel`.
export const PHONE = { display: "+91 70091 37936", tel: "+917009137936" };
// WhatsApp, digits only in international form: the office phone.
export const WHATSAPP = "917009137936";

export const whatsappUrl = (digits: string): string | null =>
  /^\d{10,15}$/.test(digits) ? `https://wa.me/${digits}` : null;
