import { test } from "node:test";
import assert from "node:assert/strict";
import { homeFaqs, siteFaqs } from "./faqs.ts";
import { services } from "./services.ts";

const all = [...homeFaqs, ...siteFaqs, ...services.flatMap((s) => s.faqs)];

test("open questions are not answered yes/no", () => {
  for (const f of all) if (/^(Who|Which|How|What|When)\b/.test(f.q)) assert.doesNotMatch(f.a, /^(Yes|No)\b/, f.q);
});

test("ownership answer says who owns it", () => {
  const owns = all.filter((f) => f.q === "Who owns the software you build?");
  assert.ok(owns.length > 0);
  for (const f of owns) assert.match(f.a, /^You do\./);
});

test("site FAQs are a subset of the home FAQs, word for word", () => {
  for (const f of siteFaqs) assert.ok(homeFaqs.some((h) => h.q === f.q && h.a === f.a), f.q);
});
