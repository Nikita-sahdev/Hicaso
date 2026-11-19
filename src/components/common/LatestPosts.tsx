import { categoryLabel } from "@/lib/blog/post";
import type { PostSummary } from "@/lib/blog/store";

const day = (d: Date | null) =>
  d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";

// Up to three newest posts as .rows beside a ui-doc page of the newest one (the blog index's pattern), so the
// section has its visual and no half-empty card row; renders nothing while the blog (or that category) is empty.
export default function LatestPosts({ posts, title }: { posts: PostSummary[]; title: string }) {
  if (!posts.length) return null;
  const newest = posts[0];
  return (
    <section className="section" id="latest-posts" aria-labelledby="latest-posts-h">
      <div className="wrap">
        <div className="grid fill">
          <div className="span-5 stack-5">
            <h2 id="latest-posts-h">{title}</h2>
            <ul className="rows">
              {posts.slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <a className="rows__name link" href={`/blog/${p.slug}`}>{p.headline}</a>
                  <p className="t-small">{categoryLabel(p.category)}, {day(p.publishAt)}</p>
                </li>
              ))}
            </ul>
            <p>
              <a className="link" href="/blog">See every post</a>
            </p>
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
  );
}
