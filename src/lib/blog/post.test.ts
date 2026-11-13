import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, draftProblems, publishProblems, postState, categoryLabel, type PostFields } from "./post.ts";

const ok: PostFields = {
  slug: "a-post",
  headline: "A post",
  seoTitle: "A post",
  description: "d".repeat(60),
  category: "ai",
  body: "## Hi\n\ntext",
};

test("slugify", () => {
  assert.equal(slugify("Flutter vs React Native: Which in 2027?"), "flutter-vs-react-native-which-in-2027");
  assert.equal(slugify("Café ÄI"), "cafe-ai");
  assert.equal(slugify("!!!"), "");
  assert.equal(slugify("a".repeat(100)).length, 80);
});

test("categoryLabel", () => {
  assert.equal(categoryLabel("cost-guides"), "Cost guides");
});

test("a complete post has no publish problems", () => {
  assert.deepEqual(publishProblems(ok), []);
});

const one = (over: Partial<PostFields>, field: string) => {
  const p = publishProblems({ ...ok, ...over });
  assert.equal(p.length, 1, JSON.stringify(p));
  assert.equal(p[0].field, field);
};

test("each publish rule alone gives one problem", () => {
  one({ description: "d".repeat(49) }, "description");
  one({ description: "d".repeat(161) }, "description");
  one({ category: "" }, "category");
  one({ body: "  " }, "body");
  one({ body: "# Title" }, "body");
  one({ slug: "Bad Slug" }, "slug");
  one({ headline: "a\nb" }, "headline");
});

test("draftProblems passes an empty description, category and body", () => {
  assert.deepEqual(draftProblems({ ...ok, description: "", category: "", body: "" }), []);
});

test("postState", () => {
  const now = new Date("2027-01-01T00:00:00Z");
  assert.equal(postState({ status: "draft", publishAt: null }, now), "draft");
  assert.equal(postState({ status: "published", publishAt: new Date(now.getTime() + 60_000) }, now), "scheduled");
  assert.equal(postState({ status: "published", publishAt: now }, now), "live");
});
