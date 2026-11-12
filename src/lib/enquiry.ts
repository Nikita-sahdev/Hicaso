export const BUDGETS = ["Under $5k", "$5k–$15k", "$15k–$50k", "$50k+", "Not sure"] as const;
export const OTHER_SERVICE = "Something else";
export const ENQUIRY_TO = "hello@hicaso.com";

export type Enquiry = {
  name: string;
  email: string;
  country: string;
  service: string;
  budget: string;
  message: string;
};

export const enquirySubject = (e: Enquiry) => (e.service ? `Project enquiry — ${e.service}` : "Project enquiry");

export function enquiryText(e: Enquiry): string {
  const or = (v: string) => v.trim() || "—";
  return [
    `Name: ${or(e.name)}`,
    `Email: ${or(e.email)}`,
    `Country: ${or(e.country)}`,
    `Service: ${or(e.service)}`,
    `Budget: ${or(e.budget)}`,
    "",
    "Message:",
    e.message,
  ].join("\r\n");
}

export function buildEnquiryMailto(e: Enquiry): string {
  return `mailto:${ENQUIRY_TO}?subject=${encodeURIComponent(enquirySubject(e))}&body=${encodeURIComponent(enquiryText(e))}`;
}

const MAX: Record<keyof Enquiry, number> = { name: 100, email: 200, country: 100, service: 100, budget: 50, message: 1000 };

// Server-side check of a posted enquiry (the browser's checks can be skipped). null = reject.
export function parseEnquiry(fd: FormData): Enquiry | null {
  const get = (k: keyof Enquiry) => String(fd.get(k) ?? "").trim();
  const e: Enquiry = { name: get("name"), email: get("email"), country: get("country"), service: get("service"), budget: get("budget"), message: get("message") };
  if ((Object.keys(MAX) as (keyof Enquiry)[]).some((k) => e[k].length > MAX[k])) return null;
  if (!e.name || !e.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) return null;
  return e;
}

// Returns raw if it is a single string in validSlugs, else "".
export function resolveService(raw: string | string[] | undefined, validSlugs: string[]): string {
  return typeof raw === "string" && validSlugs.includes(raw) ? raw : "";
}
