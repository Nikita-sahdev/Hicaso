// Blog post rules. Pure: also runs in the browser (admin editor live checks).

export const CATEGORIES = [
  { id: "ai", label: "AI" },
  { id: "mobile", label: "Mobile" },
  { id: "web", label: "Web" },
  { id: "cost-guides", label: "Cost guides" },
] as const;

export const categoryLabel = (id: string): string =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

export type PostFields = {
  slug: string;
  headline: string;
  seoTitle: string;
  description: string;
  category: string;
  body: string;
};
export type Problem = { field: keyof PostFields | "publishAt"; message: string };

const multiline = /[\r\n]/;

export function draftProblems(f: PostFields): Problem[] {
  const out: Problem[] = [];
  const add = (field: Problem["field"], message: string) => out.push({ field, message });
  if (!SLUG_RE.test(f.slug) || f.slug.length > 80)
    add("slug", "Use lower-case words joined by hyphens, up to 80 characters.");
  if (!f.headline.trim()) add("headline", "Add a headline.");
  else if (f.headline.length > 200) add("headline", `Keep the headline to 200 characters; it is ${f.headline.length}.`);
  else if (multiline.test(f.headline)) add("headline", "Keep the headline on one line.");
  if (f.seoTitle.length > 200) add("seoTitle", `Keep the SEO title to 200 characters; it is ${f.seoTitle.length}.`);
  else if (multiline.test(f.seoTitle)) add("seoTitle", "Keep the SEO title on one line.");
  if (f.description.length > 500) add("description", `Keep the description to 500 characters; it is ${f.description.length}.`);
  else if (multiline.test(f.description)) add("description", "Keep the description on one line.");
  if (f.body.length > 100_000) add("body", `Keep the body to 100,000 characters; it is ${f.body.length}.`);
  return out;
}

export function publishProblems(f: PostFields): Problem[] {
  const out = draftProblems(f);
  const add = (field: Problem["field"], message: string) => out.push({ field, message });
  const n = f.description.length;
  if (n < 50 || n > 160) add("description", `Write a description of 50 to 160 characters; it is ${n}.`);
  if (!CATEGORIES.some((c) => c.id === f.category))
    add("category", `Pick a category: ${CATEGORIES.map((c) => c.id).join(", ")}.`);
  if (!f.body.trim()) add("body", "Write the post body.");
  else if (/^# /m.test(f.body)) add("body", "Start headings at ##; the page already has the h1.");
  return out;
}

export function postState(
  p: { status: "draft" | "published"; publishAt: Date | null },
  now: Date,
): "draft" | "scheduled" | "live" {
  if (p.status === "draft") return "draft";
  return p.publishAt && p.publishAt.getTime() > now.getTime() ? "scheduled" : "live";
}
