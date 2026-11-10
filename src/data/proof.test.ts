import { test } from "node:test";
import assert from "node:assert/strict";
import { proof, showProof } from "./proof.ts";
import { services } from "./services.ts";

test("demo proof is hidden in production and shown in development", () => {
  assert.equal(showProof(true, "production"), false);
  assert.equal(showProof(true, "development"), true);
  assert.equal(showProof(true, undefined), true);
});

test("real proof always shows", () => {
  assert.equal(showProof(false, "production"), true);
  assert.equal(showProof(false, "development"), true);
});

test("case studies link to existing services", () => {
  const slugs = new Set(services.map((s) => s.slug));
  for (const c of proof.caseStudies) assert.ok(slugs.has(c.service), c.client);
});
