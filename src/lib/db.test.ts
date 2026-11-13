import { test } from "node:test";
import assert from "node:assert/strict";
import { getPool } from "./db.ts";
import { migrate } from "./migrate.ts";
import { freshDb } from "./testDb.ts";

const skip = !process.env.TEST_DATABASE_URL && "TEST_DATABASE_URL not set";

test("getPool returns null without DATABASE_URL", () => {
  const saved = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    assert.equal(getPool(), null);
  } finally {
    if (saved !== undefined) process.env.DATABASE_URL = saved;
  }
});

test("migrate creates the tables and is idempotent", { skip }, async () => {
  const pool = (await freshDb())!;
  assert.deepEqual(await migrate(pool), []);
  for (const t of ["blog_posts", "admin_users", "admin_sessions", "login_failures"]) {
    const r = await pool.query("select to_regclass($1) as r", [t]);
    assert.notEqual(r.rows[0].r, null, t);
  }
  await pool.end();
});

test("a draft cannot carry a publish time", { skip }, async () => {
  const pool = (await freshDb())!;
  await assert.rejects(
    pool.query(
      "insert into blog_posts (slug, headline, status, publish_at) values ('a', 'A', 'draft', now())",
    ),
    { code: "23514" },
  );
  await pool.end();
});

test("an idle-client error on the pool does not throw", () => {
  const saved = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgres://localhost/does_not_matter";
  try {
    const pool = getPool()!;
    assert.doesNotThrow(() => pool.emit("error", new Error("connection lost")));
  } finally {
    if (saved === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = saved;
  }
});
