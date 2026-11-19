import { OTHER_SERVICE } from "./enquiry.ts";

// The /contact project planner: four short steps whose answers become the enquiry's service and the start of its
// message. It asks, it never prices: no estimate is shown or implied.
export const PLANNER = {
  what: [
    { id: "mobile", label: "A mobile app", service: "mobile-app-development" },
    { id: "web", label: "A web app", service: "web-development" },
    { id: "saas", label: "A SaaS product", service: "saas-development" },
    { id: "ai", label: "AI in my product", service: "generative-ai" },
    { id: "agent", label: "AI agent or automation", service: "agentic-ai" },
    { id: "store", label: "An online store", service: "ecommerce-development" },
    { id: "existing", label: "Change my existing app", service: "app-modernization" },
    { id: "team", label: "Developers for my team", service: "dedicated-team" },
    { id: "other", label: "Something else", service: OTHER_SERVICE },
  ],
  platforms: ["Android", "iOS", "Web", "Not sure yet"],
  features: ["Sign-in and accounts", "Payments", "Admin panel", "AI chat or search", "Notifications", "Connections to tools we use", "Works offline", "Not sure yet"],
  stages: ["Just an idea", "Designs or a spec ready", "An app already live"],
  timing: ["As soon as possible", "In 1 to 3 months", "Just exploring"],
} as const;

export type PlannerChoices = { what: string; platforms: string[]; features: string[]; stage: string; timing: string };

export function buildBrief(c: PlannerChoices): { service: string; message: string } {
  const what = PLANNER.what.find((o) => o.id === c.what) ?? PLANNER.what.at(-1)!;
  const lines = [
    `What: ${what.label}`,
    c.platforms.length ? `Platforms: ${c.platforms.join(", ")}` : "",
    c.features.length ? `Features: ${c.features.join(", ")}` : "",
    c.stage ? `Stage: ${c.stage}` : "",
    c.timing ? `Timing: ${c.timing}` : "",
  ].filter(Boolean);
  return { service: what.service, message: `${lines.join("\n")}\n\nMore about the project: ` };
}
