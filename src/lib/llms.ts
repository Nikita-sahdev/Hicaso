// /llms.txt (llmstxt.org): a plain-markdown map of the site for AI search tools, built from the same data files
// as the pages so it never drifts. Relative .ts imports so node --test can load it.
import { SITE_URL } from "./site.ts";
import { ENQUIRY_TO } from "./enquiry.ts";
import { services, moreServices } from "../data/services.ts";
import { products } from "../data/products.ts";
import { technologies } from "../data/technologies.ts";
import type { PostSummary } from "./blog/store.ts";

export function llmsText(posts: PostSummary[] = []): string {
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
    "## Technologies",
    "",
    ...technologies.map((t) => link(t.h1, `/technologies/${t.slug}`, t.uses.map((u) => u.title).join("; "))),
    "",
    "## Products",
    "",
    ...products.map((p) => link(p.name, `/products/${p.slug}`, p.tagline)),
    "",
    ...(posts.length ? ["## Blog", "", ...posts.map((p) => link(p.headline, `/blog/${p.slug}`, p.description)), ""] : []),
    "## Company",
    "",
    link("About", "/about", "Who we are and how we work"),
    link("Contact", "/contact", `Start a project, or email ${ENQUIRY_TO}`),
    link("Careers", "/careers", "Working at Hicaso"),
    "",
  ].join("\n");
}
