export type Service = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: { group: string; items: string[] }[];
  faqs: { q: string; a: string }[];
};

export const STACK_GROUPS = ["AI", "Mobile", "Frontend", "Backend", "Databases"] as const;

const ownCode = {
  q: "Who owns the software you build?",
  a: "Yes. Once the project is paid for, the code and IP are yours.",
};

const existing = (what: string) => ({
  q: `Can you work on my existing ${what}?`,
  a: `Yes. We can pick up an existing ${what}, read what is there and extend or fix it.`,
});

export const services: Service[] = [
  {
    slug: "generative-ai",
    name: "Generative AI",
    tagline: "Language models built into products people already use.",
    description:
      "We add generative AI to your product or build new ones around it. That covers retrieval over your own data, assistants, and the evaluation and guardrails that keep outputs useful. The team that builds our products builds yours.",
    stack: [
      { group: "AI", items: ["OpenAI", "Claude", "Gemini", "Open-source LLMs", "LangChain", "LlamaIndex"] },
      { group: "Databases", items: ["pgvector", "Pinecone"] },
      { group: "Backend", items: ["Python", "Node.js"] },
    ],
    faqs: [
      ownCode,
      { q: "Which AI model will you use?", a: "We pick the model that fits your task, data and constraints. That can be a hosted model or an open-source one." },
      { q: "Can the AI work with our private data?", a: "Yes. Retrieval can run over your own documents and databases, and we agree on how that data is handled before we start." },
    ],
  },
  {
    slug: "agentic-ai",
    name: "Agentic AI",
    tagline: "Agents that use your tools and finish multi-step work.",
    description:
      "We build AI agents that call your APIs and tools and carry a task through several steps. People stay in the loop where it matters, and we add tracing so you can see what an agent did and why. The team that builds our products builds yours.",
    stack: [
      { group: "AI", items: ["Claude Agent SDK", "OpenAI Agents SDK", "LangGraph", "MCP"] },
      { group: "Backend", items: ["Python", "Node.js"] },
    ],
    faqs: [
      ownCode,
      { q: "Can an AI agent act without approval?", a: "Only where you decide it can. We add approval steps for actions that need a person." },
      { q: "How do we know what the AI agent did?", a: "We can log each step and tool call so runs can be reviewed and evaluated." },
    ],
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    tagline: "Android and iOS apps, native or cross-platform.",
    description:
      "We build mobile apps natively for Android and iOS, or across both with Flutter or React Native. We also handle the store release. You see working builds in weekly demos.",
    stack: [
      { group: "Mobile", items: ["Kotlin", "Swift", "SwiftUI", "Flutter", "Dart", "React Native"] },
      { group: "Backend", items: ["Firebase"] },
    ],
    faqs: [
      ownCode,
      existing("mobile app"),
      { q: "Native or cross-platform mobile apps?", a: "It depends on the product. We will talk through the trade-offs with you before choosing." },
    ],
  },
  {
    slug: "web-development",
    name: "Web Development",
    tagline: "Web apps, sites and backends, built and maintained.",
    description:
      "We build web apps and SaaS products, marketing sites, APIs and online stores. We also maintain and upgrade existing PHP applications. You see working software in weekly demos.",
    stack: [
      { group: "Frontend", items: ["React", "Next.js"] },
      { group: "Backend", items: ["Node.js", "PHP", "Laravel", "CodeIgniter"] },
      { group: "Databases", items: ["MySQL", "PostgreSQL", "MongoDB"] },
    ],
    faqs: [
      ownCode,
      existing("web codebase"),
      { q: "Which hours do you keep for our software project?", a: "We keep working-hours overlap with Europe and the Middle East." },
    ],
  },
];

// Services offered without a page of their own (owner, 2026-11-10: "Sirf list mein"): listed on /services and
// in the enquiry form only. Facts are the owner's: Figma; manual and mobile testing, security and store audits;
// bug fixes and updates.
export const moreServices: Pick<Service, "slug" | "name" | "tagline">[] = [
  { slug: "ui-ux-design", name: "UI/UX Design", tagline: "App and web interfaces, designed and prototyped in Figma." },
  { slug: "qa-testing", name: "QA & Testing", tagline: "Manual and mobile app testing, plus security and store-review audits." },
  { slug: "maintenance-support", name: "Maintenance & Support", tagline: "Bug fixes and updates for apps that are already live." },
];

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

export const allStackGroups = (): { group: string; items: string[] }[] => {
  const merged = new Map<string, string[]>();
  for (const s of services)
    for (const g of s.stack) {
      const items = merged.get(g.group) ?? [];
      for (const i of g.items) if (!items.includes(i)) items.push(i);
      merged.set(g.group, items);
    }
  return STACK_GROUPS.filter((g) => merged.has(g)).map((group) => ({ group, items: merged.get(group)! }));
};
