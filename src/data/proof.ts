// Social proof for the home page: client names, headline numbers, case studies, testimonials.
// Everything below is DEMO content (fictional companies and quotes) so the layout can be reviewed.
// Replace it with real, permissioned material and set `demo: false` before relying on it.
// While `demo` is true the sections render only in development, never in a production build.

export type Stat = { value: string; label: string };
export type CaseStudy = {
  client: string;
  industry: string;
  summary: string;
  service: string; // slug from services.ts
  platforms: string[];
  stack: string[];
};
export type Testimonial = { quote: string; name: string; role: string; company: string };

export const proof = {
  demo: true,
  clients: ["Northwind Traders", "Contoso Health", "Fabrikam Logistics", "Tailspin Travel", "Adventure Works", "Wingtip Retail"],
  stats: [
    { value: "40+", label: "Projects delivered" },
    { value: "12", label: "Countries served" },
    { value: "2", label: "Products we run ourselves" },
    { value: "95%", label: "Clients who come back" },
  ] as Stat[],
  caseStudies: [
    {
      client: "Contoso Health",
      industry: "Healthcare",
      summary: "A patient intake assistant that reads referral letters and drafts the clinic's intake form for staff to approve.",
      service: "generative-ai",
      platforms: ["Web"],
      stack: ["Claude", "pgvector", "Next.js", "Python"],
    },
    {
      client: "Fabrikam Logistics",
      industry: "Logistics",
      summary: "Driver and dispatcher apps for live delivery tracking, proof of delivery and route changes on the road.",
      service: "mobile-app-development",
      platforms: ["Android", "iOS"],
      stack: ["Flutter", "Firebase", "Node.js"],
    },
    {
      client: "Wingtip Retail",
      industry: "E-commerce",
      summary: "A rebuilt Laravel storefront and admin with a support agent that answers order questions from the shop's own data.",
      service: "web-development",
      platforms: ["Web"],
      stack: ["Laravel", "MySQL", "React", "OpenAI"],
    },
  ] as CaseStudy[],
  testimonials: [
    {
      quote: "They took a messy idea and shipped a working app in weeks, with a demo every Friday so we always knew where things stood.",
      name: "Jordan Ellis",
      role: "Head of Operations",
      company: "Fabrikam Logistics",
    },
    {
      quote: "The agent they built handles the routine questions, and our team approves anything unusual. It fits how we already work.",
      name: "Priya Raman",
      role: "Product Lead",
      company: "Contoso Health",
    },
    {
      quote: "Clear estimates, clean code, and they were happy to work inside our old Laravel app instead of starting over.",
      name: "Marco Bianchi",
      role: "CTO",
      company: "Wingtip Retail",
    },
  ] as Testimonial[],
};

// Demo proof never reaches a production build; real proof (demo: false) always shows.
export const showProof = (demo: boolean, env: string | undefined = process.env.NODE_ENV) =>
  !demo || env !== "production";
