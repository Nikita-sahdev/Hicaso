import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = "src/app/admin";

test("every admin action checks the session first", () => {
  const src = readFileSync(join(root, "blog/actions.ts"), "utf8");
  assert.match(src, /^"use server";/);
  const names = [...src.matchAll(/export async function (\w+)/g)].map((m) => m[1]);
  for (const want of ["createPostAction", "savePostAction", "publishPostAction", "unpublishPostAction", "deletePostAction"])
    assert.ok(names.includes(want), `${want} is exported`);
  // With "use server" every export is an action, so nothing else may be exported.
  assert.equal([...src.matchAll(/^export /gm)].length, names.length, "only async functions are exported");
  for (const name of names) {
    const m = new RegExp(`export async function ${name}\\s*\\([^)]*\\)[^{]*\\{\\s*([^\\n]*)`).exec(src);
    assert.ok(m, `${name} found`);
    assert.equal(m[1].trim(), "await requireAdmin();", `${name} starts with requireAdmin`);
  }
});

test("every admin page checks the session", () => {
  const pages: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "page.tsx" && p !== join(root, "login/page.tsx")) pages.push(p);
    }
  };
  walk(root);
  assert.ok(pages.length >= 3, `found ${pages.join(", ")}`);
  for (const p of pages) assert.match(readFileSync(p, "utf8"), /await requireAdmin\(\)/, p);
});
