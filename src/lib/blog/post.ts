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

// An h1 is "#" plus space or tab at line start, outside ``` or ~~~ fences.
function hasH1(body: string): boolean {
  let fence = "";
  for (const line of body.split(/\r?\n/)) {
    const m = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = "";
    } else if (m) fence = m[1];
    else if (/^#[ \t]/.test(line)) return true;
  }
  return false;
}

// what the editor writes for an uploaded image until the author describes it
export const IMAGE_ALT_PLACEHOLDER = "Describe the image";
// every markdown image's alt text; an empty or placeholder one fails publishing (alt text is read by search and screen readers)
const missingAlt = (body: string) =>
  [...body.matchAll(/!\[([^\]]*)\]\(/g)].some(([, alt]) => !alt.trim() || alt.trim() === IMAGE_ALT_PLACEHOLDER);

export function publishProblems(f: PostFields): Problem[] {
  const out = draftProblems(f);
  const add = (field: Problem["field"], message: string) => out.push({ field, message });
  const n = f.description.length;
  if (n < 50 || n > 160) add("description", `Write a description of 50 to 160 characters; it is ${n}.`);
  if (!CATEGORIES.some((c) => c.id === f.category))
    add("category", `Pick a category: ${CATEGORIES.map((c) => c.id).join(", ")}.`);
  if (!f.body.trim()) add("body", "Write the post body.");
  else if (hasH1(f.body)) add("body", "Start headings at ##; the page already has the h1.");
  else if (missingAlt(f.body)) add("body", `Describe every image in its alt text: replace "${IMAGE_ALT_PLACEHOLDER}" or fill the empty ![ ].`);
  return out;
}

export function postState(
  p: { status: "draft" | "published"; publishAt: Date | null },
  now: Date,
): "draft" | "scheduled" | "live" {
  if (p.status === "draft") return "draft";
  return p.publishAt && p.publishAt.getTime() > now.getTime() ? "scheduled" : "live";
}
