import { test } from "node:test";
import assert from "node:assert/strict";
import { isDirty, backupOffer, type Backup } from "./draftBackup.ts";
import type { PostFields } from "../../../../lib/blog/post.ts";

const f: PostFields = { slug: "a", headline: "H", seoTitle: "S", description: "D", category: "ai", body: "B" };
const bk = (fields: PostFields, serverUpdatedAt: string): Backup => ({ fields, savedAt: 1, serverUpdatedAt });

test("identical fields are not dirty; one changed field is", () => {
  assert.equal(isDirty(f, { ...f }), false);
  assert.equal(isDirty({ ...f, body: "B!" }, f), true);
});

test("offer for differing fields with matching updatedAt", () => {
  assert.deepEqual(backupOffer(bk({ ...f, body: "x" }, "t1"), f, "t1"), { savedSince: false });
});

test("offer with the saved-since flag for a different updatedAt", () => {
  assert.deepEqual(backupOffer(bk({ ...f, body: "x" }, "t1"), f, "t2"), { savedSince: true });
});

test("no offer when the fields are equal or there is no backup", () => {
  assert.equal(backupOffer(bk({ ...f }, "t1"), f, "t1"), null);
  assert.equal(backupOffer(null, f, "t1"), null);
});
