import { test } from "node:test";
import assert from "node:assert/strict";
import { freshDb } from "../testDb.ts";
import { DUMMY_HASH, hashPassword, verifyPassword } from "./password.ts";
import { createSession, deleteSession, findAdmin, sessionUser, upsertAdmin } from "./accounts.ts";
import {
  LOGIN_LIMIT,
  beginAttempt,
  forgetAttempt,
  clearFailures,
  clientIp,
  isLimited,
  recordFailure,
  trustProxyHops,
} from "./loginLimit.ts";

const skip = !process.env.TEST_DATABASE_URL && "TEST_DATABASE_URL not set";

test("a hash round-trips and has the documented format", async () => {
  const h = await hashPassword("correct horse battery");
  assert.match(h, /^scrypt\$16384\$8\$1\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/);
  assert.equal(await verifyPassword("correct horse battery", h), true);
});

test("the wrong password fails", async () => {
  const h = await hashPassword("correct horse battery");
  assert.equal(await verifyPassword("wrong", h), false);
});

test("a malformed stored value gives false, never throws", async () => {
  for (const bad of [
    "garbage",
    "",
    "scrypt$16384$8$1$AAAA",
    "scrypt$x$8$1$AAAA$AAAA",
    "scrypt$16384$8$1$AAAA$AAAA",
    "scrypt$16384$8$1$$",
    "scrypt$0$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAA",
    "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$!!!",
  ]) {
    assert.equal(await verifyPassword("x", bad), false, bad);
  }
});

test("two hashes of the same password differ", async () => {
  assert.notEqual(await hashPassword("same password"), await hashPassword("same password"));
});

test("DUMMY_HASH is well-formed and verifies false without throwing", async () => {
  assert.match(DUMMY_HASH, /^scrypt\$16384\$8\$1\$/);
  assert.equal(await verifyPassword("anything", DUMMY_HASH), false);
});

test("trustProxyHops", () => {
  assert.equal(trustProxyHops("1"), 1);
  assert.equal(trustProxyHops("5"), 5);
  assert.equal(trustProxyHops("9"), 0);
  assert.equal(trustProxyHops("-1"), 0);
  assert.equal(trustProxyHops("1.5"), 0);
  assert.equal(trustProxyHops("abc"), 0);
  assert.equal(trustProxyHops(undefined), 0);
});

test("clientIp", () => {
  assert.equal(clientIp("1.1.1.1, 2.2.2.2", 1), "2.2.2.2");
  assert.equal(clientIp("1.1.1.1, 2.2.2.2", 2), "1.1.1.1");
  assert.equal(clientIp("1.1.1.1, 2.2.2.2", 3), "unknown");
  assert.equal(clientIp("1.1.1.1", 0), "unknown");
  assert.equal(clientIp(null, 1), "unknown");
});

test("a session token resolves to its user, expires, and can be deleted", { skip }, async () => {
  const pool = (await freshDb())!;
  await upsertAdmin("  Owner@Example.com ", await hashPassword("a long enough password"));
  const admin = await findAdmin("OWNER@example.com");
  assert.equal(admin?.email, "owner@example.com");
  const { token, expiresAt } = await createSession(admin!.id);
  assert.ok(expiresAt.getTime() > Date.now() + 13 * 864e5);
  assert.deepEqual(await sessionUser(token), { id: admin!.id, email: "owner@example.com" });
  assert.equal(await sessionUser(undefined), null);
  assert.equal(await sessionUser("nope"), null);
  const stored = (await pool.query("select token_hash from admin_sessions")).rows[0].token_hash;
  assert.notEqual(stored, token);

  await pool.query("update admin_sessions set expires_at = now() - interval '1 second'");
  assert.equal(await sessionUser(token), null);

  const second = await createSession(admin!.id); // also sweeps the expired row
  assert.equal((await pool.query("select 1 from admin_sessions")).rowCount, 1);
  await deleteSession(second.token);
  assert.equal(await sessionUser(second.token), null);
});

test("upsertAdmin replaces the password of an existing account", { skip }, async () => {
  await freshDb();
  await upsertAdmin("a@b.co", "one");
  await upsertAdmin("A@B.co", "two");
  assert.equal((await findAdmin("a@b.co"))?.passwordHash, "two");
});

test("login limit: 10 failures per IP or per account", { skip }, async () => {
  await freshDb();
  for (let i = 0; i < LOGIN_LIMIT - 1; i++) await recordFailure("9.9.9.9", "Me@x.com");
  assert.equal(await isLimited("9.9.9.9", "me@x.com"), false);
  await recordFailure("9.9.9.9", " me@x.com");
  assert.equal(await isLimited("9.9.9.9", "me@x.com"), true);
  assert.equal(await isLimited("9.9.9.9", "other@x.com"), true); // same IP
  assert.equal(await isLimited("8.8.8.8", "ME@x.com"), true); // same account
  assert.equal(await isLimited("8.8.8.8", "other@x.com"), false);
  await clearFailures("me@x.com");
  assert.equal(await isLimited("8.8.8.8", "me@x.com"), false);
});

test("beginAttempt: the 11th attempt per account is limited", { skip }, async () => {
  await freshDb();
  for (let i = 0; i < LOGIN_LIMIT; i++) {
    assert.equal((await beginAttempt(`1.1.1.${i}`, "Me@x.com")).limited, false);
  }
  assert.equal((await beginAttempt("1.1.1.99", " me@x.com")).limited, true);
});

test("beginAttempt: the 11th attempt per IP is limited across emails", { skip }, async () => {
  await freshDb();
  for (let i = 0; i < LOGIN_LIMIT; i++) {
    assert.equal((await beginAttempt("2.2.2.2", `u${i}@x.com`)).limited, false);
  }
  assert.equal((await beginAttempt("2.2.2.2", "new@x.com")).limited, true);
});

test("beginAttempt: concurrent attempts cannot all pass", { skip }, async () => {
  await freshDb();
  const rs = await Promise.all(
    Array.from({ length: 15 }, () => beginAttempt("3.3.3.3", "burst@x.com")),
  );
  assert.ok(rs.filter((r) => !r.limited).length <= LOGIN_LIMIT);
});

test("forgetAttempt removes exactly one row", { skip }, async () => {
  const pool = (await freshDb())!;
  const a = await beginAttempt("4.4.4.4", "f@x.com");
  await beginAttempt("4.4.4.4", "f@x.com");
  await forgetAttempt(a.id);
  const r = await pool.query("select count(*)::int as n from login_failures");
  assert.equal(r.rows[0].n, 1);
});

test("a refused attempt that is forgotten does not extend the lock", { skip }, async () => {
  const pool = (await freshDb())!;
  for (let i = 0; i < LOGIN_LIMIT; i++) await beginAttempt("5.5.5.5", "lock@x.com");
  const a = await beginAttempt("5.5.5.5", "lock@x.com");
  assert.equal(a.limited, true);
  await forgetAttempt(a.id);
  const r = await pool.query("select count(*)::int as n from login_failures where email = 'lock@x.com'");
  assert.equal(r.rows[0].n, LOGIN_LIMIT);
  assert.equal((await beginAttempt("5.5.5.5", "lock@x.com")).limited, true);
});
