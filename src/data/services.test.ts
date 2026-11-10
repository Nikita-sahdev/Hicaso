import { test } from "node:test";
import assert from "node:assert/strict";
import { services, moreServices, getService, STACK_GROUPS, allStackGroups } from "./services.ts";

test("slugs are unique and URL-safe", () => {
  const slugs = [...services, ...moreServices].map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
});

test("services are the four from the spec, in order", () => {
  assert.deepEqual(
    services.map((s) => s.slug),
    ["generative-ai", "agentic-ai", "mobile-app-development", "web-development"],
  );
  assert.equal(getService("agentic-ai")?.name, "Agentic AI");
  assert.equal(getService("nope"), undefined);
});

test("each service has ≥1 stack group, 2–4 FAQs", () => {
  for (const s of services) {
    assert.ok(s.stack.length >= 1, s.slug);
    assert.ok(s.faqs.length >= 2 && s.faqs.length <= 4, s.slug);
  }
});

test("stack groups use only STACK_GROUPS names", () => {
  for (const s of services)
    for (const g of s.stack) assert.ok((STACK_GROUPS as readonly string[]).includes(g.group), g.group);
});

test("user-named technologies are present", () => {
  const items = services.flatMap((s) => s.stack.flatMap((g) => g.items));
  for (const t of ["Kotlin", "Swift", "Flutter", "React Native", "React", "Next.js", "PHP", "Laravel", "CodeIgniter", "Node.js"])
    assert.ok(items.includes(t), t);
});

test("allStackGroups merges and de-dupes", () => {
  const all = allStackGroups();
  const items = all.flatMap((g) => g.items);
  assert.equal(items.filter((i) => i === "Node.js").length, 1);
  assert.equal(items.filter((i) => i === "Python").length, 1);
  let from = 0;
  for (const g of all) {
    const idx = (STACK_GROUPS as readonly string[]).indexOf(g.group, from);
    assert.ok(idx >= from, g.group);
    from = idx + 1;
  }
});

test("no invented proof in copy", () => {
  const text = JSON.stringify([services, moreServices]);
  assert.doesNotMatch(
    text,
    /\d+\+|\b\d+ (projects|clients|years|countries)\b|\bawards?\b|\bguarantee[sd]?\b|\$\d|\b(fast(est)?|blazing|scalable|secure|24\/7|enterprise-grade|best|leading|expert|proven|world-class|cutting-edge)\b/i,
  );
});
