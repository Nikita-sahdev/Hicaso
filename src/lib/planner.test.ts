import { test } from "node:test";
import assert from "node:assert/strict";
import { PLANNER, buildBrief } from "./planner.ts";
import { services } from "../data/services.ts";
import { OTHER_SERVICE } from "./enquiry.ts";

test("every planner choice points at a real service, or Something else", () => {
  const slugs = new Set([...services.map((s) => s.slug), OTHER_SERVICE]);
  for (const o of PLANNER.what) assert.ok(slugs.has(o.service), o.service);
});

test("buildBrief picks the service and writes the choices as a short brief", () => {
  const b = buildBrief({ what: "mobile", platforms: ["Android", "iOS"], features: ["Payments", "Sign-in and accounts"], stage: "Designs or a spec ready", timing: "In 1 to 3 months" });
  assert.equal(b.service, "mobile-app-development");
  assert.match(b.message, /What: A mobile app/);
  assert.match(b.message, /Platforms: Android, iOS/);
  assert.match(b.message, /Features: Payments, Sign-in and accounts/);
  assert.match(b.message, /Stage: Designs or a spec ready/);
  assert.match(b.message, /Timing: In 1 to 3 months/);
  assert.ok(b.message.length < 1000); // the form's message limit
});

test("buildBrief leaves out steps the visitor skipped and never mentions a price", () => {
  const b = buildBrief({ what: "store", platforms: [], features: [], stage: "", timing: "" });
  assert.equal(b.service, "ecommerce-development");
  assert.doesNotMatch(b.message, /Platforms|Features|Stage|Timing/);
  assert.doesNotMatch(b.message, /\$|price|cost/i);
});
