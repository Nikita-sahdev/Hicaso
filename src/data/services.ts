export type ServiceGroup = "AI" | "Design and build" | "Test, run and grow";

export type Service = {
  slug: string;
  name: string;
  // the <title>, worded the way ranking pages for the query are (company / services); "India" only where buyers search for it (dedicated developers), since Hicaso serves clients worldwide, at most 60 characters
  seoTitle: string;
  group: ServiceGroup;
  tagline: string;
  description: string;
  stack: { group: string; items: string[] }[];
  faqs: { q: string; a: string }[];
};

export const SERVICE_GROUPS: ServiceGroup[] = ["AI", "Design and build", "Test, run and grow"];
// a group's anchor on /services ("Test, run and grow" -> "test-run-and-grow")
export const groupId = (g: ServiceGroup) => g.toLowerCase().replace(/[^a-z]+/g, "-");

export const STACK_GROUPS = ["AI", "Automation", "Design", "Mobile", "Frontend", "Backend", "Commerce", "Databases", "Cloud"] as const;

export const ownCode = {
  q: "Who owns the software you build?",
  a: "You do. Once the project is paid for, the code and IP are yours.",
};

const existing = (what: string) => ({
  q: `Can you work on my existing ${what}?`,
  a: `Yes. We can pick up an existing ${what}, read what is there and extend or fix it.`,
});

// The first four keep their order: the home page's services grid reads them by position.
// Every service has a page. Facts are the owner's: the four from the spec; UI/UX in Figma, manual and mobile
// testing with security and store-review audits, bug fixes and updates (2026-11-10); MVP, SaaS, AI chatbots,
// AI automation (n8n, Zapier, Make, custom code), AI consulting, cloud and DevOps (AWS, Azure, Google Cloud,
// DigitalOcean or a VPS), eCommerce (Shopify, WooCommerce, custom Laravel or Next.js) and dedicated developers
// billed monthly or hourly (2026-11-18).
export const services: Service[] = [
  {
    slug: "generative-ai",
    name: "Generative AI",
    seoTitle: "Generative AI Development Services — Hicaso",
    group: "AI",
    tagline: "Language models built into products people already use.",
    description:
      "We add generative AI to your product: retrieval over your own data, assistants, and the evaluation and guardrails that keep outputs useful.",
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
    seoTitle: "AI Agent Development Company — Hicaso",
    group: "AI",
    tagline: "Agents that use your tools and finish multi-step work.",
    description:
      "AI agents that call your APIs and tools through a task step by step, with people in the loop where it matters and tracing of what each agent did.",
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
    seoTitle: "Mobile App Development Company — Hicaso",
    group: "Design and build",
    tagline: "Android and iOS apps, native or cross-platform.",
    description:
      "Native Android and iOS apps, or one Flutter or React Native codebase for both, released to the stores. You see working builds in weekly demos.",
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
    seoTitle: "Web Development Company — Hicaso",
    group: "Design and build",
    tagline: "Web apps, sites and backends, built and maintained.",
    description:
      "Web apps, SaaS products, marketing sites, APIs and online stores, plus upgrades of older PHP apps. You see working software in weekly demos.",
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
  {
    slug: "ai-chatbot-development",
    name: "AI Chatbot Development",
    seoTitle: "AI Chatbot Development Company — Hicaso",
    group: "AI",
    tagline: "Chat assistants that answer from your own documents and data.",
    description:
      "AI chatbots for your website, app or internal tools that answer from your documents, show their sources and hand over to a person when needed.",
    stack: [
      { group: "AI", items: ["OpenAI", "Claude", "Gemini", "LangChain"] },
      { group: "Databases", items: ["pgvector", "Pinecone"] },
      { group: "Backend", items: ["Python", "Node.js"] },
    ],
    faqs: [
      ownCode,
      { q: "Where can the AI chatbot run?", a: "On your website, inside your web or mobile app, or in an internal tool your team uses." },
      { q: "What happens when the chatbot does not know the answer?", a: "It says so and hands the conversation to a person, instead of guessing." },
    ],
  },
  {
    slug: "ai-automation",
    name: "AI Automation",
    seoTitle: "AI Automation Agency: n8n, Zapier, Make — Hicaso",
    group: "AI",
    tagline: "Workflows that move data and do routine work between your tools.",
    description:
      "We automate routine work with n8n, Zapier, Make or Python and Node.js code, using OpenAI or Claude for text steps. A person approves what you choose.",
    stack: [
      { group: "Automation", items: ["n8n", "Zapier", "Make"] },
      { group: "AI", items: ["OpenAI", "Claude"] },
      { group: "Backend", items: ["Python", "Node.js"] },
    ],
    faqs: [
      ownCode,
      { q: "n8n, Zapier, Make or custom code?", a: "We pick by the workflow: a no-code tool where it covers the steps, our own code where it does not." },
      { q: "Can a person check the work before it goes out?", a: "Yes. We add an approval step wherever you want one." },
    ],
  },
  {
    slug: "ai-consulting",
    name: "AI Consulting",
    seoTitle: "AI Consulting Company — Hicaso",
    group: "AI",
    tagline: "Where AI fits in your business, and what it takes to build it.",
    description:
      "We find the tasks where AI is worth it and write the plan: the use cases, the data each needs, the model, and what a first version would take.",
    stack: [
      { group: "AI", items: ["OpenAI", "Claude", "Gemini", "Open-source LLMs", "LangChain"] },
      { group: "Backend", items: ["Python"] },
    ],
    faqs: [
      ownCode,
      { q: "What do we get from AI consulting?", a: "A written plan with the use cases, the data each needs, the model we suggest and what a first version would take." },
      { q: "Can you also build what the plan describes?", a: "Yes. The same team builds generative AI, AI agents and the apps around them." },
    ],
  },
  {
    slug: "mvp-development",
    name: "MVP Development",
    seoTitle: "MVP Development Company for Startups — Hicaso",
    group: "Design and build",
    tagline: "A first version of your product, in front of real users.",
    description:
      "The first version of your product as a web or mobile app: the few features your first users need, shown in weekly demos, the rest after feedback.",
    stack: [
      { group: "Design", items: ["Figma"] },
      { group: "Mobile", items: ["Flutter", "React Native"] },
      { group: "Frontend", items: ["React", "Next.js"] },
      { group: "Backend", items: ["Node.js", "Laravel", "Firebase"] },
    ],
    faqs: [
      ownCode,
      { q: "What goes into the first version?", a: "The few features your first users need to try the product. We agree on that list with you before we build." },
      { q: "Can the MVP grow into the full product?", a: "Yes. We build it on the same stack we would use for the full product, so it is extended, not thrown away." },
    ],
  },
  {
    slug: "saas-development",
    name: "SaaS Development",
    seoTitle: "SaaS Development Company — Hicaso",
    group: "Design and build",
    tagline: "Subscription software, built by a team that runs its own.",
    description:
      "SaaS products with accounts, teams, billing, admin panels and APIs, built by the team that runs AppKavo and BillMinute on the same stack.",
    stack: [
      { group: "Frontend", items: ["React", "Next.js"] },
      { group: "Backend", items: ["Node.js", "Laravel"] },
      { group: "Databases", items: ["PostgreSQL", "MySQL"] },
    ],
    faqs: [
      ownCode,
      { q: "Have you built SaaS products before?", a: "Yes. We build and run our own: AppKavo and BillMinute." },
      existing("SaaS product"),
    ],
  },
  {
    slug: "ecommerce-development",
    name: "eCommerce Development",
    seoTitle: "eCommerce Development: Shopify, WooCommerce — Hicaso",
    group: "Design and build",
    tagline: "Online stores on Shopify, WooCommerce or a custom stack.",
    description:
      "Online stores on Shopify or WooCommerce, or custom on Laravel or Next.js: catalogue, checkout, payments, order emails and your team's admin.",
    stack: [
      { group: "Commerce", items: ["Shopify", "WooCommerce"] },
      { group: "Frontend", items: ["React", "Next.js"] },
      { group: "Backend", items: ["Laravel", "PHP"] },
      { group: "Databases", items: ["MySQL"] },
    ],
    faqs: [
      ownCode,
      { q: "Shopify, WooCommerce or a custom store?", a: "It depends on your products, your team and what the store has to connect to. We recommend one before we start." },
      existing("online store"),
    ],
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    seoTitle: "UI/UX Design Agency for Web and Mobile Apps — Hicaso",
    group: "Design and build",
    tagline: "App and web interfaces, designed and prototyped in Figma.",
    description:
      "We design app and web interfaces in Figma, from the user flows to clickable prototypes, and hand them to the developers who build them, often our own team.",
    stack: [{ group: "Design", items: ["Figma"] }],
    faqs: [
      ownCode,
      { q: "Do you only design, or also build?", a: "Both. We can design only, or design and build the app with the same team." },
      { q: "Can we try the design before it is built?", a: "Yes. We make clickable prototypes in Figma that you can test on a phone or a laptop." },
    ],
  },
  {
    slug: "qa-testing",
    name: "QA & Testing",
    seoTitle: "Software Testing and QA Services — Hicaso",
    group: "Test, run and grow",
    tagline: "Manual and mobile app testing, plus security and store-review audits.",
    description:
      "Manual testing on real phones and browsers, plus audits of Android and iOS builds for security issues and store rejections, using our AppKavo.",
    stack: [{ group: "Mobile", items: ["Android", "iOS"] }],
    faqs: [
      ownCode,
      { q: "Can you test an app another team built?", a: "Yes. We test apps from any team and report each issue with the steps to repeat it." },
      { q: "What does a store-review audit check?", a: "The build and its listing, for the issues that get apps rejected by the App Store and Google Play." },
    ],
  },
  {
    slug: "maintenance-support",
    name: "Maintenance & Support",
    seoTitle: "App Maintenance and Support Services — Hicaso",
    group: "Test, run and grow",
    tagline: "Bug fixes and updates for apps that are already live.",
    description:
      "We keep live apps working: bug fixes, dependency and OS updates, and the small changes users ask for, on apps we built or other teams built.",
    stack: [
      { group: "Mobile", items: ["Kotlin", "Swift", "Flutter", "React Native"] },
      { group: "Backend", items: ["Node.js", "PHP", "Laravel"] },
    ],
    faqs: [
      ownCode,
      existing("app"),
      { q: "Which hours do you keep for support?", a: "Monday to Friday, 9:00 AM to 6:00 PM IST, which overlaps with Europe and the Middle East." },
    ],
  },
  {
    slug: "app-modernization",
    name: "App Modernization",
    seoTitle: "Legacy Application Modernization Services — Hicaso",
    group: "Test, run and grow",
    tagline: "Older apps taken over, upgraded and moved to a current stack.",
    description:
      "We take over apps other teams built and bring them up to date: current PHP and framework versions, new packages, or a move to Laravel, Next.js or Flutter.",
    stack: [
      { group: "Mobile", items: ["Flutter"] },
      { group: "Frontend", items: ["React", "Next.js"] },
      { group: "Backend", items: ["PHP", "Laravel", "CodeIgniter"] },
    ],
    faqs: [
      ownCode,
      { q: "Can you take over an app another team built?", a: "Yes. We read the code first, tell you what we found, and then plan the work with you." },
      { q: "Do we have to rebuild the app from scratch?", a: "Usually not. Most apps can be upgraded step by step while they stay live." },
    ],
  },
  {
    slug: "cloud-devops",
    name: "Cloud & DevOps",
    seoTitle: "DevOps Services Company: AWS, Azure, GCP — Hicaso",
    group: "Test, run and grow",
    tagline: "Servers, deploys and backups on AWS, Azure, Google Cloud or a VPS.",
    description:
      "We set up and run your servers on AWS, Azure, Google Cloud, DigitalOcean or a VPS, with deploy pipelines, backups and moves between hosts.",
    stack: [{ group: "Cloud", items: ["AWS", "Azure", "Google Cloud", "DigitalOcean"] }],
    faqs: [
      ownCode,
      { q: "Which cloud do you work with?", a: "AWS, Azure, Google Cloud, DigitalOcean, or a VPS you already have." },
      { q: "Can you move our app to another host?", a: "Yes. We plan the move, test it on the new host and switch over when you approve." },
    ],
  },
  {
    slug: "dedicated-team",
    name: "Dedicated Team",
    seoTitle: "Hire Dedicated Developers in India — Hicaso",
    group: "Test, run and grow",
    tagline: "Developers who work only on your product, billed monthly or by the hour.",
    description:
      "A dedicated development team in India: developers who work only on your product, billed monthly or hourly, in hours overlapping Europe and the Middle East.",
    stack: [
      { group: "AI", items: ["OpenAI", "Claude"] },
      { group: "Mobile", items: ["Flutter", "React Native", "Kotlin", "Swift"] },
      { group: "Frontend", items: ["React", "Next.js"] },
      { group: "Backend", items: ["Node.js", "Laravel", "Python"] },
    ],
    faqs: [
      ownCode,
      { q: "How is a dedicated team billed?", a: "Monthly per developer, or by the hour. You choose." },
      {
        q: "Which developers can we hire?",
        a: "Mobile developers (Flutter, React Native, Kotlin, Swift), web developers (React, Next.js), backend developers (Node.js, Laravel, Python) and AI developers (OpenAI, Claude), plus QA testers and designers when you need them.",
      },
      { q: "Which hours does the team work?", a: "Monday to Friday, 9:00 AM to 6:00 PM IST, which overlaps with Europe and the Middle East." },
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
