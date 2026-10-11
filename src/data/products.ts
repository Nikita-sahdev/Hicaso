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
    screenshot: { src: "/images/products/appkavo.jpg", width: 1080, height: 810 },
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
