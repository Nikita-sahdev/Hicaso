import { ownCode } from "./services.ts";

// One page per industry (programmatic SEO, 2026-11-20). The owner has given no industry clients, so a page says
// what software in that industry has to get right and which services build it; it never implies past clients.
// Every "we" line restates a service in services.ts. `services` are slugs: the first lends the page its hero
// fragment and tools diagram (src/components/services/content.ts).
export type Industry = {
  slug: string;
  name: string;
  seoTitle: string;
  h1: string;
  lead: string;
  needsTitle: string;
  needs: { title: string; body: string }[];
  services: string[];
  faqs: { q: string; a: string }[];
};

export const industries: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare",
    seoTitle: "Healthcare Software Development Company — Hicaso",
    h1: "Healthcare software development",
    lead: "Our team in India builds patient apps, booking systems and AI assistants for clinics and health companies, and agrees how health data is handled first.",
    needsTitle: "What healthcare software has to get right",
    needs: [
      { title: "Patient data rules", body: "Health records fall under rules such as HIPAA in the US, GDPR in Europe and India's DPDP Act. We agree how data is stored, who can see it and what is logged before we build." },
      { title: "Booking and reminders", body: "Web and mobile apps where patients book, move and cancel appointments, connected to the scheduling system you already run through its API." },
      { title: "Answers from your own content", body: "An AI chatbot that answers patient questions from your pages and policies, shows its sources and hands anything clinical to your staff." },
      { title: "Tested before patients use it", body: "Manual and mobile testing with a security audit before the app reaches patients." },
    ],
    services: ["mobile-app-development", "ai-chatbot-development", "web-development", "qa-testing"],
    faqs: [
      { q: "Will the software be HIPAA compliant?", a: "Compliance covers how your organisation handles data, not only the code. We build to the requirements you and your compliance adviser set, and agree on storage, access and logging before we start." },
      { q: "Can the AI chatbot give medical advice?", a: "We build it to answer only from the content you approve and to hand anything clinical to your staff. You decide what it may answer." },
      ownCode,
    ],
  },
  {
    slug: "fintech",
    name: "Fintech",
    seoTitle: "Fintech Software Development Company — Hicaso",
    h1: "Fintech software development",
    lead: "Our team in India builds fintech web and mobile apps, SaaS and back-office automation, with card data left to the payment gateway and every change logged.",
    needsTitle: "What fintech software has to get right",
    needs: [
      { title: "Card data stays with the gateway", body: "Checkout runs through the payment gateway you choose, so card numbers never reach your servers and most PCI DSS work stays with the gateway." },
      { title: "Identity checks in the app", body: "KYC and identity checks through your verification provider's API, built into sign-up so customers finish them in the app." },
      { title: "A record of every change", body: "Changes to balances, accounts and permissions are logged with who made them and when, so they can be reviewed later." },
      { title: "Routine back-office work automated", body: "Document checks and reconciliations moved into n8n, Make or code workflows, with a person approving what you choose." },
    ],
    services: ["saas-development", "web-development", "mobile-app-development", "ai-automation", "qa-testing"],
    faqs: [
      { q: "Will our servers store card numbers?", a: "No. We design checkout so card numbers stay with the payment gateway and never reach your servers." },
      { q: "Can you test the app for security before launch?", a: "Yes. Our testing includes a security audit, alongside manual and mobile testing." },
      ownCode,
    ],
  },
  {
    slug: "logistics",
    name: "Logistics",
    seoTitle: "Logistics Software Development Company — Hicaso",
    h1: "Logistics software development",
    lead: "Our team in India builds driver apps, live tracking, dispatch tools and AI automation for logistics companies, connected to the systems you already run.",
    needsTitle: "What logistics software has to get right",
    needs: [
      { title: "Driver apps for the road", body: "Android and iOS apps for jobs, routes and proof of delivery, which can keep work on the phone and sync when the signal returns." },
      { title: "Live location for dispatch and customers", body: "Driver locations on a map for your dispatch team, and a tracking page for the customer waiting on the delivery." },
      { title: "Orders from every system", body: "Orders pulled in from your store, ERP or spreadsheets through their APIs or n8n, so nobody types them twice." },
      { title: "Paperwork read for you", body: "Delivery notes and invoices read by OpenAI or Claude into your system, with a person approving what you choose." },
    ],
    services: ["mobile-app-development", "web-development", "ai-automation", "cloud-devops"],
    faqs: [
      { q: "Can the driver app work offline?", a: "It can be built to keep jobs on the phone and sync when the signal returns. We agree what has to work offline before we build." },
      { q: "Can you connect to the software we already use?", a: "Usually, if it has an API or an export. We check what your systems offer before we start." },
      ownCode,
    ],
  },
  {
    slug: "retail",
    name: "Retail",
    seoTitle: "Retail Software Development Company — Hicaso",
    h1: "Retail software development",
    lead: "Our team in India builds online stores, shopping apps and AI assistants for retailers, on Shopify, WooCommerce or a custom stack, in step with your stock.",
    needsTitle: "What retail software has to get right",
    needs: [
      { title: "One stock count for shop and site", body: "Online stock kept in step with your shop's point-of-sale system through its API or exports, so the site does not sell what is gone." },
      { title: "A store on the right platform", body: "Shopify, WooCommerce or a custom Laravel or Next.js store, recommended for your products before we start." },
      { title: "Answers to product questions", body: "An AI chatbot that answers sizing, delivery and returns questions from your own pages, and hands over to your team." },
      { title: "An app for repeat customers", body: "Android and iOS apps for orders, offers and reorders, released to the stores." },
    ],
    services: ["ecommerce-development", "mobile-app-development", "ai-chatbot-development", "ui-ux-design"],
    faqs: [
      { q: "Can the online store share stock with our shop?", a: "Usually, if your point-of-sale system has an API or an export. We check what yours offers before we start." },
      { q: "Shopify, WooCommerce or a custom store?", a: "It depends on your products, your team and what the store has to connect to. We recommend one before we start." },
      ownCode,
    ],
  },
];

export const getIndustry = (slug: string): Industry | undefined => industries.find((i) => i.slug === slug);
