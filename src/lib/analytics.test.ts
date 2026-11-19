import { test } from "node:test";
import assert from "node:assert/strict";
import { analyticsConfig } from "./analytics.ts";

test("analyticsConfig keeps well-formed IDs and names their tools", () => {
  const c = analyticsConfig({ NEXT_PUBLIC_GA_ID: "G-AB12CD34EF", NEXT_PUBLIC_CLARITY_ID: "abc123xyz", NEXT_PUBLIC_LINKEDIN_PARTNER_ID: "1234567" });
  assert.deepEqual(c.ids, { ga: "G-AB12CD34EF", clarity: "abc123xyz", linkedin: "1234567" });
  assert.deepEqual(c.tools, ["Google Analytics", "Microsoft Clarity", "LinkedIn"]);
});

test("analyticsConfig drops missing or malformed IDs, so nothing odd reaches a script URL", () => {
  const c = analyticsConfig({ NEXT_PUBLIC_GA_ID: "G-1'><script>", NEXT_PUBLIC_CLARITY_ID: "", NEXT_PUBLIC_LINKEDIN_PARTNER_ID: "12a" });
  assert.deepEqual(c.ids, {});
  assert.deepEqual(c.tools, []);
});
