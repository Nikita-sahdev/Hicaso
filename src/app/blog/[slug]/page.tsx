import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getLivePost } from "@/lib/blog/store";
import { categoryLabel } from "@/lib/blog/post";
import { outline, renderMarkdown } from "@/lib/blog/markdown";
import { SITE_URL, ldJson } from "@/lib/site";

// One post: one section on the kit grid. The headline, a meta line and the body (renderMarkdown, the admin
// preview's renderer) on the left in a measure column, as the legal pages set long text; on the right an
// "In this post" panel with the h2 links, the category and the date, so the section always holds a visual (R5).
// Rendered per request: a draft or a scheduled post is a 404 until publish_at passes.
export const dynamic = "force-dynamic";

// generateMetadata and the page share one query per request.
const load = cache(getLivePost);

const day = (d: Date | null) =>
  d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.headline,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: { type: "article" },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${post.slug}`;
  const hicaso = { "@type": "Organization", name: "Hicaso", url: SITE_URL };
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.headline,
    description: post.description,
    datePublished: post.publishAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: hicaso,
    publisher: hicaso,
    mainEntityOfPage: url,
  };
  const date = day(post.publishAt);
  const category = categoryLabel(post.category);
  const parts = outline(post.body);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
      <section className="section" id="post" data-enter aria-labelledby="post-h">
        <div className="wrap">
          <div className="grid">
            <article className="span-7 stack-5">
              <h1 id="post-h" className="t-h2">{post.headline}</h1>
              <p className="t-small muted">
                <time dateTime={post.publishAt?.toISOString()}>{date}</time>, Hicaso, {category}
              </p>
              <div className="btn-row">
                <a className="btn btn--primary" href="/contact">
                  Start a project
                </a>
              </div>
              <div className="stack-4 measure post-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
            </article>
            <aside className="span-5 start-8" aria-label="In this post">
              <div className="ui ui-panel post-toc">
                <div className="ui-head">
                  <div className="ui-title">In this post</div>
                </div>
                {parts.length ? (
                  <ul>
                    {parts.map((p) => (
                      <li key={p.id}>
                        <a href={`#${p.id}`}>{p.text}</a>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="ui-meta post-toc__meta">
                  {category}, {date}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
