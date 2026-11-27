import { chat, checklist, toggles, notify, terminal, deploy } from "./fragments";

// What each service page shows beyond src/data/services.ts: the hero's UI fragment (one per service, in
// its subject), the three feature cards with their fragments, and the stack's hub spokes (real icons).
// Cards place their fragment in a .stage: `at` is the placement markup (cards.css), `fit` its width.
export type Card = { title: string; line: string; panel: string };
export type Content = {
  h1: string;
  lead: string;
  hero: { html: string; label: string; piece?: string };
  featuresTitle: string;
  cards: Card[];
  stackTitle: string;
  stackLines: string[];
  spokes: { label: string; icon: string }[];
  stackAlt: string;
};

export const RISE = (inner: string, max: number, ay: string, extra = "") =>
  `<div class="stage stage--fade-b"><div class="at-rise fit${extra}" style="--fit-max:${max}px;--ax:max(24px, 50% - ${max / 2}px);--ay:${ay};--ay-sm:${ay}">${inner}</div></div>`;
export const RIGHT = (inner: string) =>
  `<div class="stage stage--fade-b"><div class="at-right to-edge" style="--ax:32px;--ay:40px;--ay-sm:24px">${inner}</div></div>`;

export const content: Record<string, Content> = {
  "generative-ai": {
    h1: "Generative AI development for product teams",
    lead:
      "Our team in India adds generative AI to your product or builds new ones around it: assistants, retrieval over your own data, and the checks that keep outputs useful.",
    hero: {
      html: chat({
        title: "Help assistant",
        q: "How long do refunds take?",
        a: "Refunds reach the original payment method within <b>5 business days</b> of approval.",
        srcs: ["Refund policy, page 2", "Billing FAQ"],
      }),
      label: "A help assistant answering a refund question, with the two documents the answer came from",
      piece: "ly-piece--chat",
    },
    featuresTitle: "What we build in generative AI",
    cards: [
      {
        title: "Adds AI features to your product",
        line: "Summaries, search, drafting or classification in the app you already run.",
        panel: RIGHT(
          toggles("AI features", [
            ["Summaries", "On long threads", true],
            ["Smart search", "Across all projects", true],
            ["Draft replies", "Needs a person to send", false],
            ["Auto-tagging", "New items only", true],
          ]),
        ),
      },
      {
        title: "Answers questions from your documents",
        line: "Retrieval over your files and databases, so each answer comes from your data.",
        panel: RISE(
          notify([
            { ico: "tick", title: "Handbook.pdf indexed", time: "now", body: "42 pages ready to search" },
            { ico: "tick", title: "Pricing sheet updated", time: "3m", body: "Answers use the new prices" },
            { ico: "tick", title: "Answer sent with 2 sources", time: "9m", body: "Refund policy, Billing FAQ" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Checks model output before release",
        line: "Test sets and checks measure output quality and keep the model inside its limits.",
        panel: RISE(
          checklist("Evaluation run: 40 cases", [
            ["Every answer cites a source", true],
            ["No answer outside the documents", true],
            ["Refuses off-topic requests", true],
            ["Keeps the product's tone", false],
            ["Stays under 3 seconds", false],
          ]),
          340,
          "calc(100% - 210px)",
        ),
      },
    ],
    stackTitle: "Tools for generative AI",
    stackLines: [
      "Models and frameworks: OpenAI, Claude, Gemini, open-source LLMs, LangChain and LlamaIndex.",
      "Vector search: pgvector and Pinecone. Backend: Python and Node.js.",
    ],
    spokes: [
      { label: "OpenAI", icon: "openai" },
      { label: "Claude", icon: "claude" },
      { label: "Gemini", icon: "gemini" },
      { label: "LangChain", icon: "langchain" },
      { label: "Pinecone", icon: "pinecone" },
      { label: "Python", icon: "python" },
    ],
    stackAlt: "Generative AI at Hicaso uses OpenAI, Claude, Gemini, LangChain, Pinecone and Python.",
  },

  "agentic-ai": {
    h1: "AI agent development for teams",
    lead:
      "Our team in India builds AI agents that call your APIs and tools and carry a task through several steps. A person approves the actions you choose, and every run is traced.",
    hero: {
      html: checklist("Agent run: weekly sales report", [
        ["Pulled last week's orders", true],
        ["Checked the totals against the ledger", true],
        ["Drafted the report", true],
        ["Waiting for approval from the finance lead", false],
        ["Send the report to the team", false],
      ]),
      label: "An agent run on a weekly sales report: three steps done, waiting for the finance lead's approval",
      piece: "ly-piece--list",
    },
    featuresTitle: "What we build in agentic AI",
    cards: [
      {
        title: "Connects AI agents to your tools",
        line: "Agents read from and act on the systems your team already works in, through APIs and MCP servers.",
        panel: RISE(
          notify([
            { ico: "tick", title: "Read 38 orders from the shop API", time: "now", body: "Last week, all paid" },
            { ico: "tick", title: "Updated the ledger entry", time: "2m", body: "Through the accounting API" },
            { ico: "tick", title: "Posted the summary to the team", time: "5m", body: "In the sales channel" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Asks a person to approve AI actions",
        line: "Approval steps put a person in front of each action you choose.",
        panel: RIGHT(
          toggles("Approvals", [
            ["Sending emails", "A person approves first", true],
            ["Changing records", "A person approves first", true],
            ["Reading data", "No approval needed", false],
            ["Spending money", "Never without a person", true],
          ]),
        ),
      },
      {
        title: "Shows what each AI agent run did",
        line: "Traces and evaluations show how an agent behaves and catch regressions.",
        panel: RISE(
          chat({
            title: "Run history",
            q: "What did run 212 do?",
            a: "It read <b>38 orders</b>, drafted the report and waited for approval.",
            srcs: ["Trace: run 212"],
          }),
          400,
          "56px",
          " to-edge",
        ),
      },
    ],
    stackTitle: "Tools for agentic AI",
    stackLines: [
      "Agents and protocols: Claude Agent SDK, OpenAI Agents SDK, LangGraph and MCP.",
      "Backend: Python and Node.js.",
    ],
    spokes: [
      { label: "Claude", icon: "claude" },
      { label: "OpenAI", icon: "openai" },
      { label: "MCP", icon: "mcp" },
      { label: "Python", icon: "python" },
      { label: "Node.js", icon: "nodejs" },
    ],
    stackAlt: "Agentic AI at Hicaso uses Claude, OpenAI, MCP, Python and Node.js.",
  },

  "mobile-app-development": {
    h1: "Mobile app development for Android and iOS",
    lead:
      "We build mobile apps natively for Android and iOS, or across both with Flutter or React Native, and we handle the store release. You see working builds in weekly demos.",
    hero: {
      html: toggles(
        "Notifications",
        [
          ["Order updates", "When an order ships", true],
          ["Delivery alerts", "On the day it arrives", true],
          ["Offers", "Once a week", false],
        ],
        " device",
      ),
      label: "An app's notification settings on a phone screen",
      piece: "ly-piece--phone",
    },
    featuresTitle: "What we build for mobile",
    cards: [
      {
        title: "Builds native Android and iOS apps",
        line: "Kotlin for Android, Swift and SwiftUI for iOS.",
        panel: RISE(
          checklist("Release build 1.0", [
            ["Android build in Kotlin", true],
            ["iOS build in Swift", true],
            ["Tests pass on both", true],
            ["Test on real phones", false],
            ["Submit to the stores", false],
          ]),
          340,
          "calc(100% - 210px)",
        ),
      },
      {
        title: "Builds one codebase for both",
        line: "Flutter or React Native, so Android and iOS share the same code.",
        panel: RISE(
          terminal({
            title: "mobile/app",
            branch: "demo-week-3",
            cmd: "flutter test",
            files: [
              ["test/auth_test.dart", "18 tests", "1.4s"],
              ["test/profile_test.dart", "12 tests", "0.9s"],
              ["test/payments_test.dart", "26 tests", "2.1s"],
            ],
            passed: "56",
            total: "56",
            time: "4.4s",
          }),
          440,
          "48px",
        ),
      },
      {
        title: "Releases to both stores",
        line: "We prepare and submit the app to the App Store and Google Play.",
        panel: RISE(
          notify([
            { ico: "google-play", title: "Version 1.0 is live on Google Play", time: "now", body: "Rolled out to every user" },
            { ico: "app-store", title: "App Store review passed", time: "2h", body: "Version 1.0 is ready for sale" },
            { ico: "apple", title: "Version 1.0.1 is in TestFlight", time: "1d", body: "Fixes a crash on sign-in" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
    ],
    stackTitle: "Tools for mobile",
    stackLines: ["Mobile: Kotlin, Swift, SwiftUI, Flutter, Dart and React Native.", "Backend: Firebase."],
    spokes: [
      { label: "Android", icon: "android" },
      { label: "Swift", icon: "swift" },
      { label: "Flutter", icon: "flutter" },
      { label: "Dart", icon: "dart" },
      { label: "React", icon: "react" },
      { label: "Firebase", icon: "firebase" },
    ],
    stackAlt: "Mobile apps at Hicaso use Kotlin, Swift, Flutter, Dart, React and Firebase.",
  },

  "web-development": {
    h1: "Web app development for companies",
    lead:
      "Our team in India builds web apps and SaaS products, marketing sites, APIs and online stores, and we maintain and upgrade existing PHP applications. You see working software in weekly demos.",
    hero: {
      html: deploy,
      label: "A deploy log for a web store: checkout, install, test, build and deploy all passed",
      piece: "ly-piece--log",
    },
    featuresTitle: "What we build for the web",
    cards: [
      {
        title: "Builds web apps and online stores",
        line: "SaaS products, marketing sites and checkout flows, from the interface to the database.",
        panel: RIGHT(
          toggles("Store settings", [
            ["Card payments", "Through the checkout", true],
            ["Order emails", "Sent on each order", true],
            ["Discount codes", "Off until the sale", false],
            ["Guest checkout", "No account needed", true],
          ]),
        ),
      },
      {
        title: "Builds APIs and backends",
        line: "Backend services and APIs for your web and mobile clients.",
        panel: RISE(
          terminal({
            title: "shop/api",
            branch: "main",
            cmd: "npm test",
            files: [
              ["test/orders.test.ts", "21 tests", "1.1s"],
              ["test/payments.test.ts", "17 tests", "1.8s"],
              ["test/auth.test.ts", "9 tests", "0.5s"],
            ],
            passed: "47",
            total: "47",
            time: "3.9s",
          }),
          440,
          "48px",
        ),
      },
      {
        title: "Keeps older PHP apps running",
        line: "We maintain existing PHP applications and move them to current versions.",
        panel: RISE(
          notify([
            { ico: "tick", title: "Upgrade finished", time: "now", body: "The app runs on a current PHP version" },
            { ico: "tick", title: "Dependencies updated", time: "1h", body: "Known issues in old packages fixed" },
            { ico: "tick", title: "Nightly backup completed", time: "8h", body: "Database and uploads" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
    ],
    stackTitle: "Tools for the web",
    stackLines: ["Frontend: React and Next.js.", "Backend: Node.js, PHP, Laravel and CodeIgniter. Databases: MySQL, PostgreSQL and MongoDB."],
    spokes: [
      { label: "React", icon: "react" },
      { label: "Next.js", icon: "nextjs" },
      { label: "Node.js", icon: "nodejs" },
      { label: "Laravel", icon: "laravel" },
      { label: "PHP", icon: "php" },
      { label: "MySQL", icon: "mysql" },
    ],
    stackAlt: "Web development at Hicaso uses React, Next.js, Node.js, Laravel, PHP and MySQL.",
  },

  "ai-chatbot-development": {
    h1: "AI chatbot development for your website and app",
    lead:
      "Our team in India builds AI chatbots that answer from your documents and data, show where each answer came from, and hand the conversation to a person when they should.",
    hero: {
      html: chat({
        title: "Store assistant",
        q: "Can I change my delivery address?",
        a: "Yes, until the order ships. Open <b>Orders</b>, pick the order and choose <b>Change address</b>.",
        srcs: ["Delivery FAQ", "Orders help"],
      }),
      label: "A store's AI chatbot answering a delivery question, with the two help pages the answer came from",
      piece: "ly-piece--chat",
    },
    featuresTitle: "What we build in AI chatbots",
    cards: [
      {
        title: "Answers from your own documents",
        line: "The chatbot searches your help pages, files and data, and cites what it used.",
        panel: RISE(
          notify([
            { ico: "tick", title: "Help center indexed", time: "now", body: "120 articles ready to search" },
            { ico: "tick", title: "Product sheets updated", time: "2h", body: "Answers use the new details" },
            { ico: "tick", title: "Answer sent with 2 sources", time: "3h", body: "Delivery FAQ, Orders help" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Hands over to a person",
        line: "Rules you set decide which conversations go to your team.",
        panel: RIGHT(
          toggles("Handover rules", [
            ["Refund requests", "Go to a person", true],
            ["Upset customers", "Go to a person", true],
            ["Order status", "The chatbot answers", false],
            ["No answer found", "Go to a person", true],
          ]),
        ),
      },
      {
        title: "Tests answers before launch",
        line: "A set of real questions checks every answer before customers see it.",
        panel: RISE(
          checklist("Test run: 60 questions", [
            ["Every answer cites a source", true],
            ["Says so when it does not know", true],
            ["Stays on topic", true],
            ["Keeps the brand's tone", false],
            ["Replies in the user's language", false],
          ]),
          340,
          "calc(100% - 210px)",
        ),
      },
    ],
    stackTitle: "Tools for AI chatbots",
    stackLines: [
      "Models and frameworks: OpenAI, Claude, Gemini and LangChain.",
      "Search over your data: pgvector and Pinecone. Backend: Python and Node.js.",
    ],
    spokes: [
      { label: "OpenAI", icon: "openai" },
      { label: "Claude", icon: "claude" },
      { label: "Gemini", icon: "gemini" },
      { label: "LangChain", icon: "langchain" },
      { label: "Pinecone", icon: "pinecone" },
      { label: "Python", icon: "python" },
    ],
    stackAlt: "AI chatbots at Hicaso use OpenAI, Claude, Gemini, LangChain, Pinecone and Python.",
  },

  "ai-automation": {
    h1: "AI automation for routine work",
    lead:
      "We automate routine work across your tools with n8n, Zapier, Make or our own Python and Node.js code, with OpenAI or Claude where a step reads or writes text.",
    hero: {
      html: checklist("Workflow: new lead from the website", [
        ["Read the enquiry form", true],
        ["Added the lead to the CRM", true],
        ["Drafted a reply with Claude", true],
        ["Waiting for approval from sales", false],
        ["Send the reply", false],
      ]),
      label: "An automation for a new website lead: three steps done, waiting for approval from sales",
      piece: "ly-piece--list",
    },
    featuresTitle: "What we automate",
    cards: [
      {
        title: "Connects the tools you already use",
        line: "Workflows in n8n, Zapier or Make move data between your apps.",
        panel: RISE(
          notify([
            { ico: "n8n", title: "Invoice copied to the accounts sheet", time: "now", body: "n8n workflow" },
            { ico: "zapier", title: "New order posted to the team chat", time: "4m", body: "Zapier" },
            { ico: "make", title: "Weekly report emailed", time: "1h", body: "Make scenario" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Adds AI where a step needs it",
        line: "OpenAI or Claude read emails and documents and draft the text, and a person approves.",
        panel: RIGHT(
          toggles("AI steps", [
            ["Sort incoming emails", "By topic and urgency", true],
            ["Draft replies", "A person sends them", true],
            ["Read invoices and orders", "From PDF files", true],
            ["Send without review", "Off", false],
          ]),
        ),
      },
      {
        title: "Writes code when a tool falls short",
        line: "Custom steps in Python or Node.js, tested like the rest of our software.",
        panel: RISE(
          terminal({
            title: "ops/automations",
            branch: "main",
            cmd: "npm test",
            files: [
              ["test/sync_orders.test.ts", "14 tests", "0.9s"],
              ["test/crm.test.ts", "9 tests", "0.6s"],
              ["test/invoices.test.ts", "11 tests", "0.8s"],
            ],
            passed: "34",
            total: "34",
            time: "2.3s",
          }),
          440,
          "48px",
        ),
      },
    ],
    stackTitle: "Tools for AI automation",
    stackLines: [
      "Automation: n8n, Zapier and Make.",
      "Custom code in Python and Node.js, with OpenAI or Claude for the steps that read or write text.",
    ],
    spokes: [
      { label: "n8n", icon: "n8n" },
      { label: "Zapier", icon: "zapier" },
      { label: "Make", icon: "make" },
      { label: "Python", icon: "python" },
      { label: "Node.js", icon: "nodejs" },
      { label: "OpenAI", icon: "openai" },
    ],
    stackAlt: "AI automation at Hicaso uses n8n, Zapier, Make, Python, Node.js and OpenAI.",
  },

  "ai-consulting": {
    h1: "AI consulting for companies",
    lead:
      "We look at your workflows and data with you, find the tasks where AI is worth it, and write a plan for the first version.",
    hero: {
      html: chat({
        title: "AI planning call",
        q: "Where would AI save our support team time?",
        a: "Sorting incoming tickets and drafting first replies. Both use data you <b>already have</b>.",
        srcs: ["Ticket export", "Help center"],
      }),
      label: "An AI planning call: the answer names two support tasks that use data the company already has",
      piece: "ly-piece--chat",
    },
    featuresTitle: "What AI consulting covers",
    cards: [
      {
        title: "Finds the tasks worth automating",
        line: "We go through your workflows and rank the use cases by what they would save.",
        panel: RISE(
          checklist("Use cases reviewed", [
            ["Ticket sorting", true],
            ["Draft replies", true],
            ["Invoice data entry", true],
            ["Sales forecasting", false],
            ["Contract review", false],
          ]),
          340,
          "calc(100% - 210px)",
        ),
      },
      {
        title: "Checks the data each use case needs",
        line: "We look at what data you have, where it lives and what has to change first.",
        panel: RISE(
          notify([
            { ico: "tick", title: "Ticket history: ready", time: "", body: "Labelled by topic" },
            { ico: "tick", title: "Help center: ready", time: "", body: "Current and complete" },
            { ico: "tick", title: "Invoices: scans need text first", time: "", body: "A reading step comes before AI" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Writes the plan, and builds it if you want",
        line: "Use cases, data, model and the first version, written down. The same team can build it.",
        panel: RIGHT(
          toggles("The plan", [
            ["Use cases", "Ranked by value", true],
            ["Model choice", "Hosted or open-source", true],
            ["Data needed", "For each use case", true],
            ["First version", "Scope and steps", true],
          ]),
        ),
      },
    ],
    stackTitle: "Tools we plan with",
    stackLines: ["Models: OpenAI, Claude, Gemini and open-source LLMs.", "Frameworks: LangChain, with Python for prototypes."],
    spokes: [
      { label: "OpenAI", icon: "openai" },
      { label: "Claude", icon: "claude" },
      { label: "Gemini", icon: "gemini" },
      { label: "LangChain", icon: "langchain" },
      { label: "Python", icon: "python" },
    ],
    stackAlt: "AI consulting at Hicaso plans with OpenAI, Claude, Gemini, LangChain and Python.",
  },

  "mvp-development": {
    h1: "MVP development for startups",
    lead:
      "We build the first version of your product, web or mobile, with the few features your first users need. You see working software in weekly demos.",
    hero: {
      html: checklist("MVP: first release", [
        ["Clickable prototype in Figma", true],
        ["Sign-up and login", true],
        ["The core feature", true],
        ["Demo with the first users", false],
        ["Release to the stores", false],
      ]),
      label: "An MVP's first release: prototype, sign-up and the core feature done, first-user demo and store release next",
      piece: "ly-piece--list",
    },
    featuresTitle: "How we build an MVP",
    cards: [
      {
        title: "Starts from what users need first",
        line: "We agree on a short feature list with you. The rest waits for real feedback.",
        panel: RIGHT(
          toggles("Scope for version 1", [
            ["Sign-up", "Email or Google", true],
            ["Core feature", "What users came for", true],
            ["Payments", "After first feedback", false],
            ["Admin panel", "List and edit", true],
          ]),
        ),
      },
      {
        title: "Shows working software every week",
        line: "A demo every week, so you see the product take shape and can change course early.",
        panel: RISE(
          notify([
            { ico: "tick", title: "Week 3 demo", time: "Fri", body: "Sign-up and the core feature" },
            { ico: "tick", title: "Week 2 demo", time: "Fri", body: "Prototype tested with users" },
            { ico: "figma", title: "Prototype ready", time: "Mon", body: "Clickable, in Figma" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Builds on a stack that can grow",
        line: "The MVP is built on the stack the full product would use, so it is extended, not rewritten.",
        panel: RISE(
          terminal({
            title: "mvp/app",
            branch: "demo-week-3",
            cmd: "npm test",
            files: [
              ["test/signup.test.ts", "12 tests", "0.7s"],
              ["test/core.test.ts", "24 tests", "1.6s"],
              ["test/admin.test.ts", "8 tests", "0.5s"],
            ],
            passed: "44",
            total: "44",
            time: "2.8s",
          }),
          440,
          "48px",
        ),
      },
    ],
    stackTitle: "Tools for an MVP",
    stackLines: ["Design: Figma. Mobile: Flutter and React Native.", "Web: React and Next.js. Backend: Node.js, Laravel and Firebase."],
    spokes: [
      { label: "Figma", icon: "figma" },
      { label: "Flutter", icon: "flutter" },
      { label: "React", icon: "react" },
      { label: "Next.js", icon: "nextjs" },
      { label: "Node.js", icon: "nodejs" },
      { label: "Firebase", icon: "firebase" },
    ],
    stackAlt: "MVPs at Hicaso use Figma, Flutter, React, Next.js, Node.js and Firebase.",
  },

  "saas-development": {
    h1: "SaaS development by a team that runs its own",
    lead:
      "We build SaaS products: accounts and teams, subscriptions and billing, admin panels and APIs. We run two of our own, AppKavo and BillMinute.",
    hero: {
      html: notify([
        { ico: "tick", title: "New workspace created", time: "now", body: "Team plan, 5 seats" },
        { ico: "tick", title: "Subscription renewed", time: "2h", body: "Invoice sent by email" },
        { ico: "tick", title: "Member invited", time: "1d", body: "Joined with Google sign-in" },
      ]),
      label: "A SaaS product's activity: a new workspace, a renewed subscription and an invited member",
      piece: "ly-piece--list",
    },
    featuresTitle: "What we build in SaaS",
    cards: [
      {
        title: "Handles accounts, teams and plans",
        line: "Sign-up, teams and roles, plans and subscription billing.",
        panel: RIGHT(
          toggles("Plans", [
            ["Free", "One seat, core features", true],
            ["Team", "Up to 10 seats", true],
            ["Business", "Single sign-on", true],
            ["Yearly billing", "Off for now", false],
          ]),
        ),
      },
      {
        title: "Builds the admin and the APIs",
        line: "Admin panels for your team, and APIs for your web and mobile apps.",
        panel: RISE(
          terminal({
            title: "saas/api",
            branch: "main",
            cmd: "npm test",
            files: [
              ["test/billing.test.ts", "22 tests", "1.3s"],
              ["test/teams.test.ts", "15 tests", "0.9s"],
              ["test/auth.test.ts", "11 tests", "0.6s"],
            ],
            passed: "48",
            total: "48",
            time: "3.4s",
          }),
          440,
          "48px",
        ),
      },
      {
        title: "Runs SaaS products of its own",
        line: "AppKavo and BillMinute are ours. The people who run them build yours.",
        panel: RISE(
          notify([
            { ico: "tick", title: "AppKavo", time: "", body: "Security audits for mobile app builds" },
            { ico: "tick", title: "BillMinute", time: "", body: "Invoices in your client's currency" },
            { ico: "tick", title: "Same team as your project", time: "", body: "The people who run them build yours" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
    ],
    stackTitle: "Tools for SaaS",
    stackLines: ["Frontend: React and Next.js. Backend: Node.js and Laravel.", "Databases: PostgreSQL and MySQL."],
    spokes: [
      { label: "React", icon: "react" },
      { label: "Next.js", icon: "nextjs" },
      { label: "Node.js", icon: "nodejs" },
      { label: "Laravel", icon: "laravel" },
      { label: "MySQL", icon: "mysql" },
    ],
    stackAlt: "SaaS development at Hicaso uses React, Next.js, Node.js, Laravel and MySQL.",
  },

  "ecommerce-development": {
    h1: "eCommerce development on Shopify, WooCommerce or custom",
    lead:
      "We build online stores on Shopify or WooCommerce, or custom stores on Laravel or Next.js when a platform does not fit.",
    hero: {
      html: notify([
        { ico: "tick", title: "New order #1042", time: "now", body: "Paid by card, ships tomorrow" },
        { ico: "tick", title: "Stock synced", time: "1h", body: "From the warehouse sheet" },
        { ico: "tick", title: "Order email sent", time: "1h", body: "With the tracking link" },
      ]),
      label: "An online store's activity: a paid order, a stock sync and an order email",
      piece: "ly-piece--list",
    },
    featuresTitle: "What we build for online stores",
    cards: [
      {
        title: "Builds on Shopify or WooCommerce",
        line: "Themes, apps and plugins on the platform that fits, or a custom store when none does.",
        panel: RISE(
          notify([
            { ico: "shopify", title: "Shopify theme published", time: "now", body: "Product pages and checkout" },
            { ico: "woocommerce", title: "WooCommerce store live", time: "2d", body: "On the client's WordPress site" },
            { ico: "laravel", title: "Custom store on Laravel", time: "1w", body: "When a platform does not fit" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Sets up checkout and payments",
        line: "Payment gateways, discount codes, order emails and guest checkout.",
        panel: RIGHT(
          toggles("Checkout", [
            ["Card payments", "Through the payment gateway", true],
            ["Guest checkout", "No account needed", true],
            ["Discount codes", "Off until the sale", false],
            ["Order emails", "Sent on each order", true],
          ]),
        ),
      },
      {
        title: "Connects the store to your systems",
        line: "Stock, shipping and accounts linked to the tools your team already uses.",
        panel: RISE(
          checklist("Store launch", [
            ["Products imported", true],
            ["Payments tested", true],
            ["Shipping rates set", true],
            ["Stock sync with the warehouse", false],
            ["Go live", false],
          ]),
          340,
          "calc(100% - 210px)",
        ),
      },
    ],
    stackTitle: "Tools for eCommerce",
    stackLines: ["Platforms: Shopify and WooCommerce.", "Custom stores: Laravel, PHP, React and Next.js, with MySQL."],
    spokes: [
      { label: "Shopify", icon: "shopify" },
      { label: "WooCommerce", icon: "woocommerce" },
      { label: "Laravel", icon: "laravel" },
      { label: "Next.js", icon: "nextjs" },
      { label: "React", icon: "react" },
      { label: "MySQL", icon: "mysql" },
    ],
    stackAlt: "eCommerce at Hicaso uses Shopify, WooCommerce, Laravel, Next.js, React and MySQL.",
  },

  "ui-ux-design": {
    h1: "UI/UX design for apps and websites",
    lead:
      "We design app and web interfaces in Figma, from user flows to clickable prototypes, and hand them to the developers who build them, often our own team.",
    hero: {
      html: notify([
        { ico: "figma", title: "Prototype shared", time: "now", body: "Sign-up flow, 9 screens" },
        { ico: "figma", title: "Review comments resolved", time: "2h", body: "From the client's review" },
        { ico: "tick", title: "Handed to development", time: "1d", body: "Specs and assets in Figma" },
      ]),
      label: "A design project in Figma: a shared prototype, resolved review comments and the hand-off to development",
      piece: "ly-piece--list",
    },
    featuresTitle: "What we design",
    cards: [
      {
        title: "Maps the user flows first",
        line: "Who uses the app and what they need to do, before any screen is drawn.",
        panel: RISE(
          checklist("Design: booking app", [
            ["User flows", true],
            ["Wireframes", true],
            ["Visual design", true],
            ["Clickable prototype", false],
            ["Hand-off to developers", false],
          ]),
          340,
          "calc(100% - 210px)",
        ),
      },
      {
        title: "Designs for Android, iOS and the web",
        line: "Screens that follow each platform's conventions, in light and dark themes.",
        panel: RIGHT(
          toggles("Screens", [
            ["Phone", "Android and iOS", true],
            ["Tablet", "When the app needs it", false],
            ["Web", "Desktop and mobile", true],
            ["Dark theme", "Follows the system", true],
          ]),
        ),
      },
      {
        title: "Tests the prototype before it is built",
        line: "Clickable prototypes in Figma let you and your users try the app first.",
        panel: RISE(
          chat({
            title: "Design review",
            q: "Can users find the booking button?",
            a: "Yes. In the prototype test <b>every user</b> found it on the first screen.",
            srcs: ["Prototype test, round 1"],
          }),
          400,
          "56px",
          " to-edge",
        ),
      },
    ],
    stackTitle: "Tools for design",
    stackLines: ["Design and prototypes: Figma.", "Designed for Android, iOS and the web, and handed to the developers in Figma."],
    spokes: [
      { label: "Figma", icon: "figma" },
      { label: "Android", icon: "android" },
      { label: "iOS", icon: "apple" },
      { label: "React", icon: "react" },
    ],
    stackAlt: "UI/UX design at Hicaso uses Figma for Android, iOS and web interfaces.",
  },

  "qa-testing": {
    h1: "QA and app testing before release",
    lead:
      "We test apps by hand on real phones and browsers, and audit Android and iOS builds for security issues and store-review rejections with AppKavo, the tool we build.",
    hero: {
      html: checklist("Release check: version 2.4", [
        ["Tested on Android phones", true],
        ["Tested on iPhones", true],
        ["Security audit: no blockers", true],
        ["Store listing reviewed", false],
        ["Approve the release", false],
      ]),
      label: "A release check for version 2.4: tested on Android and iPhone, security audit passed, listing review next",
      piece: "ly-piece--list",
    },
    featuresTitle: "What we test",
    cards: [
      {
        title: "Tests by hand on real phones",
        line: "Android phones, iPhones and the main browsers, with each issue written up.",
        panel: RISE(
          notify([
            { ico: "android", title: "Login works on Android", time: "now", body: "Pixel and Samsung phones" },
            { ico: "apple", title: "Payment fails on iPhone", time: "20m", body: "Steps to repeat attached" },
            { ico: "tick", title: "Fix verified", time: "1h", body: "Retested on both" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Audits builds before store review",
        line: "AppKavo checks the build for security issues and the problems that get apps rejected.",
        panel: RIGHT(
          toggles("Audit: app-release.aab", [
            ["Security issues", "Ranked, with fixes", true],
            ["Store-review risks", "Google Play and App Store", true],
            ["Data Safety form", "Drafted from the build", true],
            ["Third-party packages", "Checked for known issues", true],
          ]),
        ),
      },
      {
        title: "Reports issues you can repeat",
        line: "Every report has the steps, the device and a recording.",
        panel: RISE(
          chat({
            title: "Bug report",
            q: "What broke in build 2.4?",
            a: "Checkout fails when a card is <b>declined twice</b>. Steps, device and a recording are attached.",
            srcs: ["Issue 118"],
          }),
          400,
          "56px",
          " to-edge",
        ),
      },
    ],
    stackTitle: "Tools for testing",
    stackLines: ["Manual testing on Android and iOS phones and the main browsers.", "Security and store-review audits with AppKavo."],
    spokes: [
      { label: "Android", icon: "android" },
      { label: "iOS", icon: "apple" },
      { label: "Google Play", icon: "google-play" },
      { label: "App Store", icon: "app-store" },
    ],
    stackAlt: "QA at Hicaso tests on Android and iOS and audits builds for Google Play and the App Store.",
  },

  "maintenance-support": {
    h1: "App maintenance and support",
    lead:
      "We keep live apps working: bug fixes, dependency and OS updates, and the small changes your users ask for, for apps we built and apps other teams built.",
    hero: {
      html: notify([
        { ico: "tick", title: "Crash on sign-in fixed", time: "now", body: "Version 3.1.2 released" },
        { ico: "tick", title: "Packages updated", time: "1d", body: "Known issues in old versions fixed" },
        { ico: "tick", title: "Ready for the new iOS", time: "3d", body: "Built and tested on the beta" },
      ]),
      label: "Maintenance on a live app: a crash fixed, packages updated and the app tested on a new iOS beta",
      piece: "ly-piece--list",
    },
    featuresTitle: "What maintenance covers",
    cards: [
      {
        title: "Fixes bugs in live apps",
        line: "Crashes and errors your users hit, found, fixed and released.",
        panel: RISE(
          checklist("This week", [
            ["Crash on sign-in", true],
            ["Slow search on Android", true],
            ["Typo on the pricing page", true],
            ["Export to CSV", false],
            ["New iOS version check", false],
          ]),
          340,
          "calc(100% - 210px)",
        ),
      },
      {
        title: "Keeps the app current",
        line: "New OS versions, updated packages, and tests run before every release.",
        panel: RISE(
          terminal({
            title: "app/web",
            branch: "maintenance",
            cmd: "npm test",
            files: [
              ["test/auth.test.ts", "14 tests", "0.8s"],
              ["test/search.test.ts", "19 tests", "1.2s"],
              ["test/export.test.ts", "7 tests", "0.4s"],
            ],
            passed: "40",
            total: "40",
            time: "2.6s",
          }),
          440,
          "48px",
        ),
      },
      {
        title: "Makes the small changes users ask for",
        line: "New fields, text changes and small features, in the same weekly rhythm.",
        panel: RIGHT(
          toggles("Requests", [
            ["New field on the form", "Done", true],
            ["Change an email text", "Done", true],
            ["Add a filter to the list", "In progress", false],
            ["New monthly report", "Planned", false],
          ]),
        ),
      },
    ],
    stackTitle: "Tools for maintenance",
    stackLines: ["Mobile: Kotlin, Swift, Flutter and React Native.", "Web and backend: Node.js, PHP and Laravel."],
    spokes: [
      { label: "Android", icon: "android" },
      { label: "Swift", icon: "swift" },
      { label: "Flutter", icon: "flutter" },
      { label: "React", icon: "react" },
      { label: "Node.js", icon: "nodejs" },
      { label: "Laravel", icon: "laravel" },
    ],
    stackAlt: "Maintenance at Hicaso covers Android, Swift, Flutter, React, Node.js and Laravel apps.",
  },

  "app-modernization": {
    h1: "Legacy app modernization",
    lead:
      "We take over apps other teams built, read the code, and bring them up to date step by step while they stay live.",
    hero: {
      html: checklist("Upgrade plan: booking app", [
        ["Read the code and wrote up the findings", true],
        ["Moved to a current PHP version", true],
        ["Updated old packages", true],
        ["Moving screens to Laravel", false],
        ["Switch over", false],
      ]),
      label: "An upgrade plan for a booking app: code reviewed, PHP and packages updated, the move to Laravel next",
      piece: "ly-piece--list",
    },
    featuresTitle: "How we modernize an app",
    cards: [
      {
        title: "Takes over apps other teams built",
        line: "We read the code first and tell you what works and what is risky.",
        panel: RISE(
          notify([
            { ico: "git", title: "Repository handed over", time: "Mon", body: "Access and history moved" },
            { ico: "tick", title: "Code review written", time: "Wed", body: "What works, what is risky" },
            { ico: "tick", title: "Plan agreed", time: "Fri", body: "Step by step, the app stays live" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Upgrades PHP and old frameworks",
        line: "Current PHP and framework versions, with tests around the parts that change.",
        panel: RISE(
          terminal({
            title: "legacy/app",
            branch: "upgrade",
            cmd: "php artisan test",
            files: [
              ["tests/Feature/BookingTest.php", "18 tests", "1.9s"],
              ["tests/Feature/PaymentTest.php", "12 tests", "1.4s"],
              ["tests/Unit/PriceTest.php", "9 tests", "0.3s"],
            ],
            passed: "39",
            total: "39",
            time: "3.6s",
          }),
          440,
          "48px",
        ),
      },
      {
        title: "Moves apps to a current stack",
        line: "Laravel, Next.js or Flutter where a rewrite of a part makes sense.",
        panel: RIGHT(
          toggles("Migration", [
            ["Web app", "CodeIgniter to Laravel", true],
            ["Frontend", "jQuery to React", true],
            ["Mobile app", "Rebuilt in Flutter", false],
            ["Data", "Moved and checked", true],
          ]),
        ),
      },
    ],
    stackTitle: "Tools for modernization",
    stackLines: ["Backend: PHP, Laravel and CodeIgniter.", "Frontend: React and Next.js. Mobile: Flutter."],
    spokes: [
      { label: "PHP", icon: "php" },
      { label: "Laravel", icon: "laravel" },
      { label: "React", icon: "react" },
      { label: "Next.js", icon: "nextjs" },
      { label: "Flutter", icon: "flutter" },
      { label: "Git", icon: "git" },
    ],
    stackAlt: "App modernization at Hicaso uses PHP, Laravel, React, Next.js, Flutter and Git.",
  },

  "cloud-devops": {
    h1: "DevOps consulting and cloud services",
    lead:
      "We set up and run your servers on AWS, Azure, Google Cloud, DigitalOcean or your own VPS, with deploy pipelines and backups.",
    hero: {
      html: deploy,
      label: "A deploy log: checkout, install, test, build and deploy all passed",
      piece: "ly-piece--log",
    },
    featuresTitle: "What we run for you",
    cards: [
      {
        title: "Runs on the cloud you choose",
        line: "AWS, Azure, Google Cloud, DigitalOcean or a VPS you already have.",
        panel: RISE(
          notify([
            { ico: "aws", title: "API moved to AWS", time: "now", body: "Tested, then switched over" },
            { ico: "digitalocean", title: "Staging server ready", time: "1d", body: "On DigitalOcean" },
            { ico: "azure", title: "Nightly backup completed", time: "8h", body: "Database and uploads" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Deploys after the tests pass",
        line: "Pipelines from Git run the tests on every change before it goes live.",
        panel: RISE(
          terminal({
            title: "infra/deploy",
            branch: "main",
            cmd: "npm test",
            files: [
              ["test/api.test.ts", "31 tests", "1.7s"],
              ["test/jobs.test.ts", "12 tests", "0.8s"],
              ["test/health.test.ts", "4 tests", "0.2s"],
            ],
            passed: "47",
            total: "47",
            time: "2.7s",
          }),
          440,
          "48px",
        ),
      },
      {
        title: "Backs up and looks after your servers",
        line: "Backups, updates and a staging copy for testing changes.",
        panel: RIGHT(
          toggles("Server", [
            ["Nightly backups", "Kept for two weeks", true],
            ["System updates", "Applied each month", true],
            ["Staging copy", "For testing changes", true],
            ["Public access to the database", "Closed", false],
          ]),
        ),
      },
    ],
    stackTitle: "Tools for cloud and DevOps",
    stackLines: [
      "Clouds: AWS, Azure, Google Cloud and DigitalOcean, or your own VPS.",
      "Deploy pipelines from Git, with backups for the servers we run.",
    ],
    spokes: [
      { label: "AWS", icon: "aws" },
      { label: "Azure", icon: "azure" },
      { label: "Google Cloud", icon: "google-cloud" },
      { label: "DigitalOcean", icon: "digitalocean" },
      { label: "Git", icon: "git" },
    ],
    stackAlt: "Cloud and DevOps at Hicaso use AWS, Azure, Google Cloud, DigitalOcean and Git.",
  },

  "dedicated-team": {
    h1: "Hire dedicated developers",
    lead:
      "Developers from our team in India who work only on your product, in your tools. Billed monthly per developer or by the hour.",
    hero: {
      html: chat({
        title: "Team chat",
        q: "Can someone pick up the Android crash today?",
        a: "Yes. Your Android developer is on it and will post the fix for review <b>by 5 PM IST</b>.",
        srcs: ["Sprint board"],
      }),
      label: "A client's team chat: the dedicated Android developer picks up a crash the same day",
      piece: "ly-piece--chat",
    },
    featuresTitle: "How a dedicated team works",
    cards: [
      {
        title: "Works only on your product",
        line: "The developers you pick, full time or part time, on your work alone.",
        panel: RIGHT(
          toggles("Your team", [
            ["Flutter developer", "Full time", true],
            ["Backend developer", "Full time", true],
            ["QA tester", "Part time", false],
            ["Designer", "When needed", false],
          ]),
        ),
      },
      {
        title: "Works in your tools and process",
        line: "Your repository, your board and your team chat, with a daily update.",
        panel: RISE(
          notify([
            { ico: "git", title: "Pull request opened", time: "now", body: "Fixes the Android crash" },
            { ico: "tick", title: "Daily update posted", time: "6 PM", body: "In your team chat" },
            { ico: "tick", title: "Sprint demo", time: "Fri", body: "A working build to review" },
          ]),
          380,
          "calc(100% - 180px)",
        ),
      },
      {
        title: "Billed monthly or by the hour",
        line: "Pick the model that fits the work. Our hours overlap with Europe and the Middle East.",
        panel: RISE(
          checklist("How you can hire", [
            ["Monthly per developer", true],
            ["By the hour", true],
            ["Code and IP are yours", true],
            ["Overlap with Europe and the Middle East", true],
            ["Monday to Friday, 9 AM to 6 PM IST", true],
          ]),
          340,
          "calc(100% - 210px)",
        ),
      },
    ],
    stackTitle: "Skills on the team",
    stackLines: [
      "AI: OpenAI and Claude. Mobile: Flutter, React Native, Kotlin and Swift.",
      "Web: React and Next.js. Backend: Node.js, Laravel and Python.",
    ],
    spokes: [
      { label: "OpenAI", icon: "openai" },
      { label: "Flutter", icon: "flutter" },
      { label: "React", icon: "react" },
      { label: "Next.js", icon: "nextjs" },
      { label: "Node.js", icon: "nodejs" },
      { label: "Laravel", icon: "laravel" },
    ],
    stackAlt: "Dedicated developers at Hicaso work with OpenAI, Flutter, React, Next.js, Node.js and Laravel.",
  },
};
