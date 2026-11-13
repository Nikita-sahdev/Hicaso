// /llms.txt (llmstxt.org): a plain-markdown map of the site for AI search tools, built from the same data files
// as the pages so it never drifts. Relative .ts imports so node --test can load it.
import { SITE_URL } from "./site.ts";
import { ENQUIRY_TO } from "./enquiry.ts";
import { services, moreServices } from "../data/services.ts";
import { products } from "../data/products.ts";

export function llmsText(): string {
  const link = (name: string, path: string, note: string) => `- [${name}](${SITE_URL}${path}): ${note}`;
  return [
    "# Hicaso",
    "",
    "> Hicaso LLP is a software development company and product studio in Chandigarh, India. It builds generative AI, agentic AI, mobile and web software for clients worldwide, and runs its own products.",
    "",
    "## Services",
    "",
    ...services.map((s) => link(s.name, `/services/${s.slug}`, s.tagline)),
    ...moreServices.map((s) => `- ${s.name}: ${s.tagline}`),
    "",
    "## Products",
    "",
    ...products.map((p) => link(p.name, `/products/${p.slug}`, p.tagline)),
    "",
    "## Company",
    "",
    link("About", "/about", "Who we are and how we work"),
    link("Contact", "/contact", `Start a project, or email ${ENQUIRY_TO}`),
    link("Careers", "/careers", "Working at Hicaso"),
    "",
  ].join("\n");
}
