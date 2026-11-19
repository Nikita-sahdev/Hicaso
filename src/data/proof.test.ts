import { test } from "node:test";
import assert from "node:assert/strict";
import { getCaseStudy, proof, showProof } from "./proof.ts";
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

test("every case study has a unique slug and enough to fill its page", () => {
  const slugs = proof.caseStudies.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const c of proof.caseStudies) {
    assert.match(c.slug, /^[a-z0-9-]+$/, c.client);
    assert.ok(c.title && c.challenge && c.built.length >= 2 && c.results.length >= 1, c.client);
  }
});

test("getCaseStudy finds a case by slug and nothing for an unknown one", () => {
  const first = proof.caseStudies[0];
  assert.equal(getCaseStudy(first.slug)?.client, first.client);
  assert.equal(getCaseStudy("no-such-case"), undefined);
});
