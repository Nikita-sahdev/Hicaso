import { test } from "node:test";
import assert from "node:assert/strict";
import { industries, getIndustry } from "./industries.ts";
import { getService } from "./services.ts";
import { INVENTED_PROOF } from "./copyRules.ts";

test("industries are the four, each with real services and copy that fits search results", () => {
  assert.deepEqual(industries.map((i) => i.slug), ["healthcare", "fintech", "logistics", "retail"]);
  assert.equal(getIndustry("retail")?.name, "Retail");
  assert.equal(getIndustry("nope"), undefined);
  for (const i of industries) {
    for (const s of i.services) assert.ok(getService(s), `${i.slug}: ${s}`);
    assert.ok(i.seoTitle.length <= 60, i.seoTitle);
    assert.ok(i.lead.length >= 120 && i.lead.length <= 160, `${i.slug} lead ${i.lead.length}`);
    assert.ok(i.h1.includes(i.name), i.h1);
    assert.ok(i.needs.length >= 3 && i.needs.length <= 4, i.slug);
    assert.ok(i.faqs.length >= 2 && i.faqs.length <= 3, i.slug);
  }
});

test("no invented proof or client claims in industry copy", () => {
  const all = JSON.stringify(industries);
  assert.doesNotMatch(all, INVENTED_PROOF);
  // what the site says (not the questions visitors ask): no past clients, no certification or compliance claimed
  const claims = JSON.stringify(industries.map((i) => [i.lead, i.needs, i.faqs.map((f) => f.a)]));
  assert.doesNotMatch(claims, /\b(our|we have|we've) (clients|customers)\b|\bcase stud|\bworked with\b|\bcertified\b|\bcompliant\b/i);
});
