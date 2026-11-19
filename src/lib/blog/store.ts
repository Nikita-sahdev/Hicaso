import { getPool, withTimeout } from "../db.ts";
import { draftProblems, publishProblems, slugify, type PostFields, type Problem } from "./post.ts";

export type Post = PostFields & {
  id: string;
  status: "draft" | "published";
  publishAt: Date | null;
  slugLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type PostSummary = Pick<Post, "slug" | "headline" | "description" | "category" | "publishAt" | "updatedAt">;
export type SaveResult = { ok: true; post: Post } | { ok: false; problems: Problem[] };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UNIQUE_VIOLATION = "23505";
const SLUG_TAKEN: Problem = { field: "slug", message: "Another post already uses this address." };
const NOT_FOUND: Problem = { field: "headline", message: "This post no longer exists." };

// "Live" uses the database clock, so a scheduled post appears with no job running.
const LIVE = "status = 'published' and publish_at <= now()";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toPost = (r: any): Post => ({
  id: r.id,
  slug: r.slug,
  headline: r.headline,
  seoTitle: r.seo_title ?? "",
  description: r.description ?? "",
  category: r.category ?? "",
  body: r.body,
  status: r.status,
  publishAt: r.publish_at,
  slugLocked: r.slug_locked,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toFields = (p: Post): PostFields => ({
  slug: p.slug,
  headline: p.headline,
  seoTitle: p.seoTitle,
  description: p.description,
  category: p.category,
  body: p.body,
});

const isUnique = (e: unknown) => (e as { code?: string })?.code === UNIQUE_VIOLATION;

// Public reads

export async function listLivePosts(): Promise<PostSummary[]> {
  const pool = getPool();
  if (!pool) return [];
  const { rows } = await pool.query(
    `select slug, headline, description, category, publish_at, updated_at
       from blog_posts where ${LIVE} order by publish_at desc`,
  );
  return rows.map((r) => ({
    slug: r.slug,
    headline: r.headline,
    description: r.description ?? "",
    category: r.category ?? "",
    publishAt: r.publish_at,
    updatedAt: r.updated_at,
  }));
}

export async function listLivePostsSafe(): Promise<PostSummary[]> {
  try {
    return await withTimeout(listLivePosts());
  } catch (e) {
    console.error("blog: could not list posts:", e);
    return [];
  }
}

export async function getLivePost(slug: string): Promise<Post | null> {
  const pool = getPool();
  if (!pool) return null;
  const { rows } = await pool.query(`select * from blog_posts where slug = $1 and ${LIVE}`, [slug]);
  return rows[0] ? toPost(rows[0]) : null;
}

// Admin

export async function listPosts(): Promise<Post[]> {
  const pool = getPool();
  if (!pool) return [];
  const { rows } = await pool.query("select * from blog_posts order by created_at desc");
  return rows.map(toPost);
}

export async function getPost(id: string): Promise<Post | null> {
  const pool = getPool();
  if (!pool || !UUID_RE.test(id)) return null;
  const { rows } = await pool.query("select * from blog_posts where id = $1", [id]);
  return rows[0] ? toPost(rows[0]) : null;
}

export async function createPost(headline: string): Promise<SaveResult> {
  const pool = getPool();
  if (!pool) return { ok: false, problems: [{ field: "headline", message: "The database is not available." }] };
  const base = slugify(headline) || "post";
  // Try the insert and let the unique index decide; on a clash try -2, -3, ...
  for (let n = 1; ; n++) {
    const suffix = n === 1 ? "" : `-${n}`;
    const slug = base.slice(0, 80 - suffix.length).replace(/-+$/, "") + suffix;
    try {
      const { rows } = await pool.query(
        "insert into blog_posts (slug, headline) values ($1, $2) returning *",
        [slug, headline],
      );
      return { ok: true, post: toPost(rows[0]) };
    } catch (e) {
      if (!isUnique(e)) throw e;
    }
  }
}

export async function savePost(id: string, f: PostFields): Promise<SaveResult> {
  const pool = getPool();
  const stored = await getPost(id);
  if (!pool || !stored) return { ok: false, problems: [NOT_FOUND] };
  const merged = { ...f, slug: stored.slugLocked ? stored.slug : f.slug };
  const problems = stored.status === "published" ? publishProblems(merged) : draftProblems(merged);
  if (problems.length) return { ok: false, problems };
  try {
    const { rows } = await pool.query(
      `update blog_posts
          set slug = $2, headline = $3, seo_title = $4, description = $5, category = $6, body = $7,
              updated_at = now()
        where id = $1 returning *`,
      [id, merged.slug, merged.headline, merged.seoTitle, merged.description, merged.category, merged.body],
    );
    return rows[0] ? { ok: true, post: toPost(rows[0]) } : { ok: false, problems: [NOT_FOUND] };
  } catch (e) {
    if (isUnique(e)) return { ok: false, problems: [SLUG_TAKEN] };
    throw e;
  }
}

export async function publishPost(id: string, at?: Date): Promise<SaveResult> {
  if (at && at.getTime() <= Date.now())
    return { ok: false, problems: [{ field: "publishAt", message: "Pick a time in the future." }] };
  const pool = getPool();
  const stored = await getPost(id);
  if (!pool || !stored) return { ok: false, problems: [NOT_FOUND] };
  const problems = publishProblems(toFields(stored));
  if (problems.length) return { ok: false, problems };
  const { rows } = await pool.query(
    `update blog_posts
        set status = 'published', publish_at = coalesce($2::timestamptz, now()),
            slug_locked = true, updated_at = now()
      where id = $1 returning *`,
    [id, at ?? null],
  );
  return rows[0] ? { ok: true, post: toPost(rows[0]) } : { ok: false, problems: [NOT_FOUND] };
}

export async function unpublishPost(id: string): Promise<SaveResult> {
  const pool = getPool();
  if (!pool || !UUID_RE.test(id)) return { ok: false, problems: [NOT_FOUND] };
  const { rows } = await pool.query(
    "update blog_posts set status = 'draft', publish_at = null, updated_at = now() where id = $1 returning *",
    [id],
  );
  return rows[0] ? { ok: true, post: toPost(rows[0]) } : { ok: false, problems: [NOT_FOUND] };
}

export async function deletePost(id: string): Promise<boolean> {
  const pool = getPool();
  if (!pool || !UUID_RE.test(id)) return false;
  const { rowCount } = await pool.query("delete from blog_posts where id = $1", [id]);
  return rowCount === 1;
}
