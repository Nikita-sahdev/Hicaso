import { test } from "node:test";
import assert from "node:assert/strict";
import { technologies, getTechnology } from "./technologies.ts";
import { allStackGroups, getService } from "./services.ts";
import { INVENTED_PROOF } from "./copyRules.ts";

test("technologies are exactly these ten, in order", () => {
  assert.deepEqual(technologies.map((t) => t.slug), ["flutter", "react-native", "laravel", "nextjs", "nodejs", "react", "python", "openai", "shopify", "woocommerce"]);
  assert.equal(getTechnology("laravel")?.name, "Laravel");
  assert.equal(getTechnology("nope"), undefined);
});

test("each technology is in the listed stack and maps to a real service", () => {
  const stack = allStackGroups().flatMap((g) => g.items);
  for (const t of technologies) {
    assert.ok(stack.includes(t.name), t.name);
    assert.ok(getService(t.service), t.slug);
  }
});

test("h1 is 2–8 words and names the technology; 3–4 uses; 2–3 FAQs", () => {
  for (const t of technologies) {
    const words = t.h1.split(/\s+/).length;
    assert.ok(words >= 2 && words <= 8, t.h1);
    assert.ok(t.h1.includes(t.name), t.h1);
    assert.ok(t.uses.length >= 3 && t.uses.length <= 4, t.slug);
    assert.ok(t.faqs.length >= 2 && t.faqs.length <= 3, t.slug);
  }
});

test("no invented proof in technology copy", () => {
  assert.doesNotMatch(JSON.stringify(technologies), INVENTED_PROOF);
});

test("technology copy promises nothing services.ts does not state (final review, Task 7)", () => {
  assert.doesNotMatch(
    JSON.stringify(technologies),
    /TypeScript|push notifications|admin (panels|screens)|dashboards|upgrade plan|keep the pages|types can be shared/i,
  );
});

test("each lead fits a search result's description (it is the page's meta description)", () => {
  for (const t of technologies) assert.ok(t.lead.length <= 160, `${t.slug} lead ${t.lead.length}`);
});
