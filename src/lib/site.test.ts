import { test } from "node:test";
import assert from "node:assert/strict";
import { httpsLinks, SOCIAL } from "./site.ts";

test("httpsLinks drops empty and non-https URLs", () => {
  const out = httpsLinks([{ url: "" }, { url: "http://x.com" }, { url: "javascript:alert(1)" }, { url: "https://linkedin.com/company/hicaso" }]);
  assert.deepEqual(out.map((l) => l.url), ["https://linkedin.com/company/hicaso"]);
});

test("httpsLinks of an empty list is empty", () => assert.deepEqual(httpsLinks([]), []));

test("every configured social link is https and labelled", () => {
  assert.equal(httpsLinks(SOCIAL).length, SOCIAL.length);
  for (const s of SOCIAL) assert.ok(s.label.trim(), s.url);
});
