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

export function buildEnquiryMailto(e: Enquiry): string {
  const subject = e.service ? `Project enquiry — ${e.service}` : "Project enquiry";
  const or = (v: string) => v.trim() || "—";
  const body = [
    `Name: ${or(e.name)}`,
    `Email: ${or(e.email)}`,
    `Country: ${or(e.country)}`,
    `Service: ${or(e.service)}`,
    `Budget: ${or(e.budget)}`,
    "",
    "Message:",
    e.message,
  ].join("\r\n");
  return `mailto:${ENQUIRY_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Returns raw if it is a single string in validSlugs, else "".
export function resolveService(raw: string | string[] | undefined, validSlugs: string[]): string {
  return typeof raw === "string" && validSlugs.includes(raw) ? raw : "";
}
