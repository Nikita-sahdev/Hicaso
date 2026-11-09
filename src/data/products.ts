// Single source of truth for every product surface on the site.
// Adding a product = one entry here (+ a screenshot in public/images/products/).

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  audience: string;
  description: string;
  highlights: { title: string; body: string }[];
  // The product page's own words (every line restates the description or a highlight above).
  page: {
    h1: string;
    lead: string;
    card: { title: string; chip: string; lines: [string, string][] };
    stepsTitle: string;
    stepsLead: string;
    steps: { title: string; body: string }[];
    faqs: { q: string; a: string }[];
    closeTitle: string;
    closeLine: string;
  };
  url: string;
  privacyUrl: string;
  status: "live" | "beta";
  // onAccent = button text drawn on the accent color.
  theme: { bg: string; fg: string; accent: string; onAccent: string };
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
        title: "AppKavo audits builds without source",
        body: "Upload an APK, AAB or IPA and get a 0–100 security score with ranked findings.",
      },
      {
        title: "Predicts store rejections",
        body: "Blockers and risks for Google Play and the App Store, before you submit.",
      },
      {
        title: "Drafts your privacy paperwork",
        body: "Data Safety and App Privacy mappings, a privacy policy and terms, from your build.",
      },
      {
        title: "AppKavo watches for new vulnerabilities",
        body: "Every night your dependencies are re-checked against new CVEs, without a new upload.",
      },
    ],
    page: {
      h1: "Mobile app security audits for developers",
      lead:
        "AppKavo audits an APK, AAB or IPA and returns a 0–100 security score with ranked findings. It also predicts App Store and Google Play rejections.",
      card: {
        title: "Audit of app-release.ipa",
        chip: "Done",
        lines: [
          ["9 findings", "ranked, with fixes to paste"],
          ["2 blockers", "for App Store review"],
          ["Privacy manifest", "drafted"],
        ],
      },
      stepsTitle: "How AppKavo works",
      stepsLead: "Three steps from a build to a store-ready app.",
      steps: [
        { title: "Add your app", body: "Upload an APK, AAB or IPA, add the source code, or give a live URL." },
        { title: "Read the ranked findings", body: "You get a 0–100 security score, with a fix you can paste for each finding." },
        {
          title: "Check the stores and the paperwork",
          body: "See the blockers and risks Google Play and the App Store may raise, then take the drafted privacy documents.",
        },
      ],
      faqs: [
        { q: "Can AppKavo predict App Store and Google Play rejections?", a: "Yes. It lists blockers and risks for Google Play and the App Store before you submit." },
        { q: "Which privacy documents does AppKavo draft?", a: "Data Safety and App Privacy mappings, a privacy policy and terms, all from your build." },
        { q: "Do I need to share source code with AppKavo?", a: "No. Upload an APK, AAB or IPA and the audit runs on the compiled build." },
        { q: "How does AppKavo find new vulnerabilities?", a: "Every night it re-checks your dependencies against new CVEs, without a new upload." },
        { q: "Who builds AppKavo?", a: "Hicaso builds and runs it, the same team that builds software for clients." },
      ],
      closeTitle: "AppKavo findings with fixes",
      closeLine: "Every ranked finding comes with a fix you can paste into the file.",
    },
    url: "https://appkavo.com",
    privacyUrl: "https://appkavo.com/privacy",
    status: "live",
    theme: { bg: "#0a0a0c", fg: "#f4f4f5", accent: "#fb8c2e", onAccent: "#0a0a0c" },
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
        title: "BillMinute sends an invoice in a minute",
        body: "Line items, taxes and discounts, from a template or your last invoice.",
      },
      {
        title: "BillMinute shows any currency and format",
        body: "Your client sees their currency, date format and invoice wording.",
      },
      {
        title: "BillMinute lets clients pay you directly",
        body: "By bank transfer or your own pay links. BillMinute never holds payments.",
      },
      {
        title: "BillMinute exports your data any time",
        body: "Invoices, customers and payments to CSV, whenever you want them.",
      },
    ],
    page: {
      h1: "Invoicing software for freelancers and small businesses",
      lead:
        "BillMinute sends an invoice in 1 minute, in your client's currency, date format and wording. No accounting software, and clients pay you directly.",
      card: {
        title: "Invoice INV-0148",
        chip: "Sent",
        lines: [
          ["2.400,00 €", "in your client's currency"],
          ["20.11.2026", "in their date format"],
          ["Bank transfer", "details on the invoice"],
        ],
      },
      stepsTitle: "How BillMinute works",
      stepsLead: "Three steps from a draft to a paid invoice.",
      steps: [
        { title: "Write the invoice", body: "Add line items, taxes and discounts, from a template or your last invoice." },
        { title: "Send it in your client's terms", body: "Your client sees the invoice in their currency, date format and wording." },
        {
          title: "Get paid directly",
          body: "Clients pay by bank transfer or your own pay links, and you see what is outstanding, overdue and paid.",
        },
      ],
      faqs: [
        { q: "What does my client see on a BillMinute invoice?", a: "The invoice in their currency, date format and wording." },
        { q: "Does BillMinute hold my payments?", a: "No. Clients pay you directly, by bank transfer or your own pay links." },
        { q: "Can I export my BillMinute data?", a: "Yes. Export invoices, customers and payments to CSV at any time." },
        { q: "Who is BillMinute for?", a: "Freelancers and small businesses with clients anywhere." },
        { q: "Who builds BillMinute?", a: "Hicaso builds and runs it, the same team that builds software for clients." },
      ],
      closeTitle: "BillMinute invoices in your client's terms",
      closeLine: "The invoice shows your client's currency and date format. Payment goes to you directly, never through BillMinute.",
    },
    url: "https://billminute.com",
    privacyUrl: "https://billminute.com/privacy",
    status: "live",
    theme: { bg: "#ffffff", fg: "#1d1d1f", accent: "#1f4fd8", onAccent: "#ffffff" },
    screenshot: { src: "/images/products/billminute.png", width: 1080, height: 810 },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const domainOf = (product: Product) => new URL(product.url).hostname;
