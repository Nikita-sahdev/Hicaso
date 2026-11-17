import { categoryLabel } from "@/lib/blog/post";
import type { PostSummary } from "@/lib/blog/store";

// Up to three newest posts as cards; renders nothing while the blog (or that category) has no posts.
export default function LatestPosts({ posts, title }: { posts: PostSummary[]; title: string }) {
  if (!posts.length) return null;
  return (
    <section className="section" id="latest-posts" aria-labelledby="latest-posts-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="latest-posts-h">{title}</h2>
          <p>
            <a className="link" href="/blog">See every post</a>
          </p>
        </div>
        <div className="grid">
          {posts.slice(0, 3).map((p) => (
            <article key={p.slug} className="card span-4 stack-4">
              <p className="t-small muted">{categoryLabel(p.category)}</p>
              <h3>
                <a className="link" href={`/blog/${p.slug}`}>{p.headline}</a>
              </h3>
              <p>{p.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
