import { test } from "node:test";
import assert from "node:assert/strict";
import { freshDb } from "../testDb.ts";
import {
  createPost,
  deletePost,
  getLivePost,
  getPost,
  listLivePosts,
  listLivePostsSafe,
  listPosts,
  publishPost,
  savePost,
  unpublishPost,
  type Post,
} from "./store.ts";
import type { PostFields } from "./post.ts";

const skip = !process.env.TEST_DATABASE_URL && "TEST_DATABASE_URL not set";

const valid = (p: Post, over: Partial<PostFields> = {}): PostFields => ({
  slug: p.slug,
  headline: p.headline,
  seoTitle: "",
  description: "A description that is comfortably long enough to pass the publish check.",
  category: "web",
  body: "## Hello\n\nSome body text.",
  ...over,
});

async function draft(headline = "Hello world"): Promise<Post> {
  const r = await createPost(headline);
  assert.ok(r.ok);
  return r.post;
}

async function live(headline = "Hello world"): Promise<Post> {
  const p = await draft(headline);
  assert.ok((await savePost(p.id, valid(p))).ok);
  const r = await publishPost(p.id);
  assert.ok(r.ok);
  return r.post;
}

test("a created draft is not live", { skip }, async () => {
  await freshDb();
  const p = await draft();
  assert.deepEqual(await listLivePosts(), []);
  assert.equal(await getLivePost(p.slug), null);
  assert.equal((await listPosts()).length, 1);
});

test("a saved and published post is live and its slug locked", { skip }, async () => {
  await freshDb();
  const p = await live();
  assert.equal(p.slugLocked, true);
  assert.equal(p.status, "published");
  assert.equal((await listLivePosts()).length, 1);
  assert.equal((await getLivePost(p.slug))?.id, p.id);
});

test("a scheduled post goes live by the database clock alone", { skip }, async () => {
  const pool = (await freshDb())!;
  const p = await draft();
  await savePost(p.id, valid(p));
  const r = await publishPost(p.id, new Date(Date.now() + 3600e3));
  assert.ok(r.ok);
  assert.deepEqual(await listLivePosts(), []);
  assert.equal(await getLivePost(p.slug), null);
  await pool.query("update blog_posts set publish_at = now() - interval '1 second'");
  assert.equal((await listLivePosts()).length, 1);
  assert.ok(await getLivePost(p.slug));
});

test("a past schedule time is refused", { skip }, async () => {
  await freshDb();
  const p = await draft();
  await savePost(p.id, valid(p));
  const r = await publishPost(p.id, new Date(Date.now() - 1000));
  assert.ok(!r.ok);
  assert.deepEqual(r.problems, [{ field: "publishAt", message: "Pick a time in the future." }]);
});

test("same headline gets -2; a taken slug is refused", { skip }, async () => {
  await freshDb();
  const a = await draft("Same");
  const b = await draft("Same");
  assert.equal(a.slug, "same");
  assert.equal(b.slug, "same-2");
  const r = await savePost(b.id, valid(b, { slug: "same" }));
  assert.ok(!r.ok);
  assert.deepEqual(r.problems, [{ field: "slug", message: "Another post already uses this address." }]);
});

test("an invalid save of a live post leaves it unchanged", { skip }, async () => {
  await freshDb();
  const p = await live();
  const r = await savePost(p.id, valid(p, { description: "too short!" }));
  assert.ok(!r.ok);
  assert.ok(r.problems.some((x) => x.field === "description"));
  assert.equal((await getPost(p.id))?.description, p.description);
});

test("unpublish keeps the slug locked", { skip }, async () => {
  await freshDb();
  const p = await live();
  const u = await unpublishPost(p.id);
  assert.ok(u.ok);
  assert.equal(u.post.status, "draft");
  const q = (await getPost(p.id))!;
  assert.equal(q.status, "draft");
  assert.equal(q.publishAt, null);
  assert.equal(q.slugLocked, true);
  const r = await savePost(p.id, valid(q, { slug: "something-else" }));
  assert.ok(r.ok);
  assert.equal(r.post.slug, p.slug);
  assert.equal(await getLivePost(p.slug), null);
});

test("publishing a draft without a description is refused", { skip }, async () => {
  await freshDb();
  const p = await draft();
  const r = await publishPost(p.id);
  assert.ok(!r.ok);
  assert.ok(r.problems.some((x) => x.field === "description"));
  assert.equal((await getPost(p.id))?.status, "draft");
});

test("deletePost removes the post and reports whether it did", { skip }, async () => {
  await freshDb();
  const p = await draft();
  assert.equal(await deletePost(p.id), true);
  assert.equal(await getPost(p.id), null);
  assert.equal(await deletePost(p.id), false);
});

test("unpublishPost on a missing post is refused", { skip }, async () => {
  await freshDb();
  const r = await unpublishPost("00000000-0000-4000-8000-000000000000");
  assert.equal(r.ok, false);
  assert.equal((await unpublishPost("not-a-uuid")).ok, false);
});

test("getPost returns null for a non-UUID id", { skip }, async () => {
  await freshDb();
  assert.equal(await getPost("not-a-uuid"), null);
});

test("listLivePosts returns [] without DATABASE_URL", async () => {
  const saved = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    assert.deepEqual(await listLivePosts(), []);
  } finally {
    if (saved !== undefined) process.env.DATABASE_URL = saved;
  }
});

test("a database error rejects listLivePosts but listLivePostsSafe returns []", async () => {
  const saved = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgres://localhost:1/none";
  const err = console.error;
  console.error = () => {};
  try {
    await assert.rejects(listLivePosts());
    assert.deepEqual(await listLivePostsSafe(), []);
  } finally {
    console.error = err;
    if (saved === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = saved;
  }
});
