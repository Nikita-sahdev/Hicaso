import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceHero from "@/components/services/ServiceHero";
import { notify } from "@/components/services/fragments";
import { listLivePosts } from "@/lib/blog/store";
import { categoryLabel } from "@/lib/blog/post";

// The blog index on the kit, as the legal pages: the dealt centred hero (its window lists the newest posts),
// then every post as .rows beside a ui-doc page of the newest one, so the page ends on a visual (R5).
// Rendered per request: a scheduled post shows once publish_at passes, with no rebuild.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Software Development Blog — Hicaso",
  description: "Guides from the Hicaso team on planning, building and running AI, mobile and web software, written from the projects we ship.",
};

const day = (d: Date | null) =>
  d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";
// notify() builds an HTML string; post fields are the owner's text, so they are escaped first.
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export default async function BlogPage() {
  // A database error throws (Next's error page); only an empty blog is a 404.
  const posts = await listLivePosts();
  if (!posts.length) notFound();
  const newest = posts[0];

  return (
    <>
      <ServiceHero
        h1="AI, mobile and web development blog"
        lead="Guides from the Hicaso team in India on building AI, mobile and web software."
        secondary={{ label: "Read the newest post", href: `/blog/${newest.slug}` }}
        fragment={notify(
          posts.slice(0, 3).map((p) => ({
            ico: "tick",
            title: esc(p.headline),
            time: "",
            body: esc(`${categoryLabel(p.category)}, ${day(p.publishAt)}`),
          })),
        )}
        label={`The newest posts: ${posts.slice(0, 3).map((p) => p.headline).join("; ")}`}
        piece="ly-piece--list"
      />

      <section className="section" id="posts" aria-labelledby="posts-h">
        <div className="wrap">
          <div className="grid fill">
            <div className="span-5 stack-5">
              <h2 id="posts-h">Every post on the blog, newest first</h2>
              <ul className="rows">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <a className="rows__name link" href={`/blog/${p.slug}`}>{p.headline}</a>
                    <p className="t-small muted">
                      {day(p.publishAt)}, {categoryLabel(p.category)}
                    </p>
                    <p>{p.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel frame--fill span-6 start-7">
              {/* on the panel's stage like every other fragment, not flush in its corner */}
              <div className="stage stage--fade-b">
              <div className="at-rise fit" style={{ "--fit-max": "420px", "--ax": "max(24px, 50% - 210px)", "--ay": "40px", "--ay-sm": "40px" } as React.CSSProperties}>
              <div className="ui ui-doc">
                <article className="ui-doc__page">
                  <div className="ui-doc__label">
                    {categoryLabel(newest.category)}, {day(newest.publishAt)}
                  </div>
                  <div className="ui-doc__title">{newest.headline}</div>
                  <div className="ui-doc__text">{newest.description}</div>
                </article>
              </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
