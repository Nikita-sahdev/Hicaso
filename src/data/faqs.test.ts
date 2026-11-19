import { test } from "node:test";
import assert from "node:assert/strict";
import { homeFaqs, siteFaqs } from "./faqs.ts";
import { services } from "./services.ts";
import { INVENTED_PROOF } from "./copyRules.ts";

const all = [...homeFaqs, ...siteFaqs, ...services.flatMap((s) => s.faqs)];

test("open questions are not answered yes/no", () => {
  for (const f of all) if (/^(Who|Which|How|What|When)\b/.test(f.q)) assert.doesNotMatch(f.a, /^(Yes|No)\b/, f.q);
});

test("ownership answer says who owns it", () => {
  const owns = all.filter((f) => f.q === "Who owns the software you build?");
  assert.ok(owns.length > 0);
  for (const f of owns) assert.match(f.a, /^You do\./);
});

test("service and technology pages answer who, how often, the NDA and what the price depends on", () => {
  assert.deepEqual(siteFaqs.map((f) => f.q), [
    "Who works on my product?",
    "How often will I see the software?",
    "Will you sign an NDA before I share the details?",
    "What does the price depend on?",
  ]);
});

test("no FAQ answer states a price, a count or another invented claim", () => {
  for (const f of all) assert.doesNotMatch(f.a, INVENTED_PROOF, f.q);
});
