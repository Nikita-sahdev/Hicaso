import { ENQUIRY_TO } from "./enquiry.ts";
import { PHONE, SITE_URL } from "./site.ts";
import type { Product } from "../data/products.ts";

// The site's JSON-LD entities. One Organization with an @id that every other entity points to; facts only from what
// the site shows (no street address: the office is at home; no ratings, prices or offers).
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const orgRef = { "@id": ORG_ID };

export const orgLd = (sameAs: string[]) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Hicaso",
  legalName: "Hicaso LLP",
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
  description:
    "Hicaso builds generative AI, agentic AI, mobile and web software for clients worldwide, and runs two products of its own: AppKavo and BillMinute.",
  email: ENQUIRY_TO,
  telephone: PHONE.display,
  address: { "@type": "PostalAddress", addressLocality: "Chandigarh", addressCountry: "IN" } as Record<string, string>,
  areaServed: "Worldwide",
  ...(sameAs.length ? { sameAs } : {}),
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: "Hicaso",
  inLanguage: "en",
  publisher: orgRef,
});

// Google's applicationCategory values; a product without an entry is a business app
const CATEGORY: Record<string, string> = { appkavo: "SecurityApplication", billminute: "BusinessApplication" };

export const softwareLd = (p: Product) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: p.name,
  url: p.url,
  description: p.description,
  applicationCategory: CATEGORY[p.slug] ?? "BusinessApplication",
  mainEntityOfPage: `${SITE_URL}/products/${p.slug}`,
  creator: orgRef,
});
