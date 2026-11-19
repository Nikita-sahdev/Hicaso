// Visitor analytics, all optional: each tool turns on when its public ID is set on the server, and loads in the
// browser only after the visitor accepts (src/components/analytics/Analytics.tsx). A malformed ID is ignored.
export type AnalyticsIds = { ga?: string; clarity?: string; linkedin?: string };

const RULES = [
  { key: "ga", env: "NEXT_PUBLIC_GA_ID", ok: /^G-[A-Z0-9]{4,20}$/, name: "Google Analytics" },
  { key: "clarity", env: "NEXT_PUBLIC_CLARITY_ID", ok: /^[a-z0-9]{6,20}$/i, name: "Microsoft Clarity" },
  { key: "linkedin", env: "NEXT_PUBLIC_LINKEDIN_PARTNER_ID", ok: /^\d{3,12}$/, name: "LinkedIn" },
] as const;

export function analyticsConfig(env: Record<string, string | undefined>): { ids: AnalyticsIds; tools: string[] } {
  const ids: AnalyticsIds = {};
  const tools: string[] = [];
  for (const r of RULES) {
    const v = env[r.env]?.trim();
    if (v && r.ok.test(v)) {
      ids[r.key] = v;
      tools.push(r.name);
    }
  }
  return { ids, tools };
}

// Next inlines NEXT_PUBLIC_* only when read by name, so list them here
export const ANALYTICS = analyticsConfig({
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
  NEXT_PUBLIC_LINKEDIN_PARTNER_ID: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID,
});
