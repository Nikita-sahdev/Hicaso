import { test } from "node:test";
import assert from "node:assert/strict";
import { robotsText } from "./robots.ts";
import { SITE_URL } from "./site.ts";

test("robots.txt keeps one group with the content signal, private paths and the sitemap", () => {
  const t = robotsText();
  assert.match(t, /^User-agent: \*\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\n/);
  assert.ok(t.includes("Disallow: /api/\n"));
  assert.ok(t.includes("Disallow: /admin\n"));
  assert.ok(!/Disallow: \/\n/.test(t), "never blocks the whole site");
  assert.ok(t.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
});
