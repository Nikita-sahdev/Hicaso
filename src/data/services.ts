export type Service = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  offerings: { title: string; body: string }[];
  stack: { group: string; items: string[] }[];
  faqs: { q: string; a: string }[];
};

export const STACK_GROUPS = ["AI", "Mobile", "Frontend", "Backend", "Databases"] as const;

const ownCode = {
  q: "Do I own the code?",
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
    eyebrow: "AI",
    tagline: "Language models built into products people already use.",
    description:
      "We add generative AI to your product or build new ones around it. That covers retrieval over your own data, assistants, and the evaluation and guardrails that keep outputs useful. The team that builds our products builds yours.",
    offerings: [
      { title: "LLM-powered features in existing apps", body: "We add summaries, search, drafting or classification to the product you already run." },
      { title: "RAG over your documents and data", body: "Answers drawn from your own files and databases." },
      { title: "Chat assistants and copilots", body: "Assistants that sit inside your product and help users get the task done." },
      { title: "Content and document generation", body: "Structured drafts, reports and messages generated from your data and templates." },
      { title: "Model evaluation and guardrails", body: "Test sets and checks that measure output quality and keep the model inside its limits." },
    ],
    stack: [
      { group: "AI", items: ["OpenAI", "Claude", "Gemini", "Open-source LLMs", "LangChain", "LlamaIndex"] },
      { group: "Databases", items: ["pgvector", "Pinecone"] },
      { group: "Backend", items: ["Python", "Node.js"] },
    ],
    faqs: [
      ownCode,
      { q: "Which model will you use?", a: "We pick the model that fits your task, data and constraints. That can be a hosted model or an open-source one." },
      { q: "Can the AI work with our private data?", a: "Yes. Retrieval can run over your own documents and databases, and we agree on how that data is handled before we start." },
    ],
  },
  {
    slug: "agentic-ai",
    name: "Agentic AI",
    eyebrow: "AI",
    tagline: "Agents that use your tools and finish multi-step work.",
    description:
      "We build AI agents that call your APIs and tools and carry a task through several steps. People stay in the loop where it matters, and we add tracing so you can see what an agent did and why. The team that builds our products builds yours.",
    offerings: [
      { title: "AI agents that use your tools and APIs", body: "Agents that read from and act on the systems your team already works in." },
      { title: "Multi-step workflow automation", body: "Repeatable processes broken into steps an agent can run end to end." },
      { title: "MCP servers and tool integrations", body: "MCP servers that expose your data and actions to agents in a controlled way." },
      { title: "Human-in-the-loop approvals", body: "Checkpoints where a person reviews or approves before the agent acts." },
      { title: "Monitoring and evals for agents", body: "Traces and evaluations so you can see how an agent behaves and catch regressions." },
    ],
    stack: [
      { group: "AI", items: ["Claude Agent SDK", "OpenAI Agents SDK", "LangGraph", "MCP"] },
      { group: "Backend", items: ["Python", "Node.js"] },
    ],
    faqs: [
      ownCode,
      { q: "Can an agent act without approval?", a: "Only where you decide it can. We add approval steps for actions that need a person." },
      { q: "How do we know what the agent did?", a: "We can log each step and tool call so runs can be reviewed and evaluated." },
    ],
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    eyebrow: "Mobile",
    tagline: "Android and iOS apps, native or cross-platform.",
    description:
      "We build mobile apps natively for Android and iOS, or across both with Flutter or React Native. We also handle the store release. You see working builds in weekly demos.",
    offerings: [
      { title: "Native Android apps", body: "Android apps written in Kotlin." },
      { title: "Native iOS apps", body: "iOS apps written in Swift and SwiftUI." },
      { title: "Cross-platform apps with Flutter", body: "One Flutter codebase that runs on Android and iOS." },
      { title: "Cross-platform apps with React Native", body: "One React Native codebase for both platforms." },
      { title: "App Store and Google Play release", body: "We prepare and submit the app to both stores." },
    ],
    stack: [
      { group: "Mobile", items: ["Kotlin", "Swift", "SwiftUI", "Flutter", "Dart", "React Native"] },
      { group: "Backend", items: ["Firebase"] },
    ],
    faqs: [
      ownCode,
      existing("app"),
      { q: "Native or cross-platform?", a: "It depends on the product. We will talk through the trade-offs with you before choosing." },
    ],
  },
  {
    slug: "web-development",
    name: "Web Development",
    eyebrow: "Web",
    tagline: "Web apps, sites and backends, built and maintained.",
    description:
      "We build web apps and SaaS products, marketing sites, APIs and online stores. We also maintain and upgrade existing PHP applications. You see working software in weekly demos.",
    offerings: [
      { title: "Web apps and SaaS products", body: "Full web applications, from the interface to the database." },
      { title: "Marketing sites and CMS", body: "Public sites and a CMS your team can update." },
      { title: "APIs and backends", body: "Backend services and APIs for your web and mobile clients." },
      { title: "E-commerce", body: "Online stores and checkout flows built around how you sell." },
      { title: "Maintenance and upgrades of existing PHP apps", body: "We keep existing PHP applications running and move them to current versions." },
    ],
    stack: [
      { group: "Frontend", items: ["React", "Next.js"] },
      { group: "Backend", items: ["Node.js", "PHP", "Laravel", "CodeIgniter"] },
      { group: "Databases", items: ["MySQL", "PostgreSQL", "MongoDB"] },
    ],
    faqs: [
      ownCode,
      existing("codebase"),
      { q: "Do you work with our timezone?", a: "We keep working-hours overlap with Europe and the Middle East." },
    ],
  },
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
