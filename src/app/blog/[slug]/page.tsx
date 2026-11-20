import type { Metadata } from "next";
import { orgNamed } from "@/lib/schema";
import { notFound } from "next/navigation";
import { cache } from "react";
import ServiceHero from "@/components/services/ServiceHero";
import { notify } from "@/components/services/fragments";
import { CONTACT } from "@/components/legal/LegalPage";
import { getLivePost } from "@/lib/blog/store";
import { withTimeout } from "@/lib/db";
import { categoryLabel } from "@/lib/blog/post";
import { renderSections, type PostSection } from "@/lib/blog/markdown";
import { ENQUIRY_TO } from "@/lib/enquiry";
import { OG, SITE_URL, breadcrumbLd, ldJson } from "@/lib/site";

// One post on the site's document-page pattern (src/components/legal/LegalPage.tsx):
// - the dealt centred hero: the headline, the description, and a window listing the category, the date and the post's h2s;
// - the text, one screen or two (.g2): an opening row (an "In this post" panel with the h2 links and the meta line, beside the text before
//   the first h2), then one row per h2, heading left (an h3 keeping the h2's id, so the section has one h2) and its text right;
// - a closing panel with the contact details, so the page ends on a visual (R5).
// Section ids start with "blog-" so a heading slug ("post", "text") cannot take them.
// Rendered per request: a draft or a scheduled post is a 404 until publish_at passes.
export const dynamic = "force-dynamic";

// generateMetadata and the page share one query per request.
// timed: with Postgres down the page errors in seconds instead of hanging (src/lib/db.ts)
const load = cache((slug: string) => withTimeout(getLivePost(slug)));

const day = (d: Date | null) =>
  d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";
// notify() builds an HTML string; post fields are the owner's text, so they are escaped first.
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.headline,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", ...OG },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${post.slug}`;
  const hicaso = orgNamed; // the layout's Organization by @id, named here as Article requires
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.headline,
    description: post.description,
    datePublished: post.publishAt?.toISOString(),
    // an edit made before the post went live is not a modification after publishing
    dateModified: new Date(Math.max(post.updatedAt.getTime(), post.publishAt?.getTime() ?? 0)).toISOString(),
    image: `${SITE_URL}${OG.images[0].url}`,
    author: hicaso,
    publisher: hicaso,
    mainEntityOfPage: url,
  };
  const date = day(post.publishAt);
  const category = categoryLabel(post.category);
  const [intro, ...parts] = renderSections(post.body);
  const shown = parts.slice(0, 3);
  // The text fills one screen, or two as a .g2 (the kit's two groups, one a screen) when it outgrows one;
  // a post longer than two screens grows past them (globals.css).
  // ponytail: sizes are guessed from characters (an image counts as 1,400, about its height in lines of
  // text; a screen holds about 2,100); measuring needs the browser. Tune SCREEN if real posts land badly.
  const SCREEN = 2100;
  const weight = (html: string) => html.replace(/<[^>]+>/g, "").length + 1400 * (html.match(/<img /g)?.length ?? 0) + 150;
  const total = 450 + weight(intro.html) + parts.reduce((n, p) => n + weight(p.html), 0);
  const two = parts.length > 0 && total > SCREEN * 0.85;
  // cut where the two screens hold the most even share; the second gets one row at least
  let k = 0;
  for (let i = 1, w1 = 450 + weight(intro.html), best = Math.abs(total - 2 * w1); i < parts.length; i++) {
    w1 += weight(parts[i - 1].html);
    if (Math.abs(total - 2 * w1) < best) [k, best] = [i, Math.abs(total - 2 * w1)];
  }
  const first = two ? parts.slice(0, k) : parts;
  const second = two ? parts.slice(k) : [];
  const row = (p: PostSection) => (
    <div key={p.id} className="grid">
      {/* each post section is an h2 under the post's h1 (search engines read the outline), set at the h3 size */}
      <h2 id={p.id!} className="t-h3 span-5">{p.heading}</h2>
      <div className="span-6 start-7 stack-4 post-body" dangerouslySetInnerHTML={{ __html: p.html }} />
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(breadcrumbLd([["Home", "/"], ["Blog", "/blog"], [post.headline, `/blog/${post.slug}`]]))} />
      <ServiceHero
        id="blog-hero"
        h1={post.headline}
        lead={post.description}
        meta={`${date}, Hicaso, ${category}`}
        secondary={{ label: "See all posts", href: "/blog" }}
        fragment={notify([
          { ico: "tick", title: esc(category), time: "", body: esc(`${date}, Hicaso`) },
          ...shown.map((p) => ({ ico: "tick", title: esc(p.heading ?? ""), time: "", body: "In this post" })),
        ])}
        label={[`${category}, ${date}, Hicaso`, ...shown.map((p) => `In this post: ${p.heading}`)].join("; ")}
        piece="ly-piece--list"
      />

      <section className={`section${two ? " g2" : ""}`} id="blog-text" aria-labelledby="blog-text-h">
        <div className="wrap">
          <div className={two ? "group stack-5" : "stack-5"}>
            <div className="grid">
              <div className="span-5 stack-4">
                <h2 id="blog-text-h">In this blog post</h2>
                <nav className="ui ui-panel post-toc" aria-label="In this post">
                  {parts.length ? (
                    <ul>
                      {parts.map((p) => (
                        <li key={p.id}>
                          <a href={`#${p.id}`}>{p.heading}</a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="ui-meta post-toc__meta">
                    <time dateTime={post.publishAt?.toISOString()}>{date}</time>, Hicaso, {category}
                  </p>
                </nav>
              </div>
              {intro.html.trim() ? (
                <div className="span-6 start-7 stack-4 post-body" dangerouslySetInnerHTML={{ __html: intro.html }} />
              ) : null}
            </div>
            {first.map(row)}
          </div>
          {two ? <div className="group stack-5">{second.map(row)}</div> : null}
        </div>
      </section>

      <section className="section ground-surface" id="blog-close" aria-labelledby="blog-close-h">
        <div className="wrap">
          <div className="grid fill">
            <div className="span-5 stack-5">
              <h2 id="blog-close-h">Questions about this post</h2>
              <p className="t-lead">Write to us about it, or about the software you want built.</p>
              <a className="link" href={`mailto:${ENQUIRY_TO}`}>Email {ENQUIRY_TO}</a>
            </div>
            <div className="panel frame--fill span-6 start-7" dangerouslySetInnerHTML={{ __html: CONTACT }} />
          </div>
        </div>
      </section>
    </>
  );
}
