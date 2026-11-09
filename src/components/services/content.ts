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

const RISE = (inner: string, max: number, ay: string, extra = "") =>
  `<div class="stage stage--fade-b"><div class="at-rise fit${extra}" style="--fit-max:${max}px;--ax:max(24px, 50% - ${max / 2}px);--ay:${ay};--ay-sm:${ay}">${inner}</div></div>`;
const RIGHT = (inner: string) =>
  `<div class="stage stage--fade-b"><div class="at-right to-edge" style="--ax:32px;--ay:40px;--ay-sm:24px">${inner}</div></div>`;

export const content: Record<string, Content> = {
  "generative-ai": {
    h1: "Generative AI for product teams",
    lead:
      "We add generative AI to your product or build new ones around it: assistants, retrieval over your own data, and the checks that keep outputs useful. You see a working demo every week.",
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
        title: "Tests output before users see it",
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
      "We build AI agents that call your APIs and tools and carry a task through several steps. A person approves the actions you choose, and every run is traced.",
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
        title: "Connects agents to your tools",
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
        title: "Asks a person before it acts",
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
        title: "Shows what each run did",
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
    h1: "Android and iOS app development",
    lead:
      "We build mobile apps natively for Android and iOS, or across both with Flutter or React Native, and we handle the store release. You see working builds in weekly demos.",
    hero: {
      html: toggles(
        "Notifications",
        [
          ["Order updates", "When an order ships", true],
          ["Delivery alerts", "On the day it arrives", true],
          ["Offers", "Once a week", false],
          ["Dark theme", "Follows the system", true],
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
      "We build web apps and SaaS products, marketing sites, APIs and online stores, and we maintain and upgrade existing PHP applications. You see working software in weekly demos.",
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
};
