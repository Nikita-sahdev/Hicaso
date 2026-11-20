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

test("clickEvent names contact links by method and counts links to the enquiry page from other pages", async () => {
  const { clickEvent } = await import("./analytics.ts");
  assert.deepEqual(clickEvent("mailto:hello@hicaso.com", "/"), { name: "contact_click", method: "email" });
  assert.deepEqual(clickEvent("tel:+917009137936", "/contact"), { name: "contact_click", method: "phone" });
  assert.deepEqual(clickEvent("https://wa.me/917009137936", "/"), { name: "contact_click", method: "whatsapp" });
  assert.deepEqual(clickEvent("https://cal.com/hicaso/free-30-minute-call-with-hicaso", "/"), { name: "contact_click", method: "booking" });
  assert.deepEqual(clickEvent("/contact?service=agentic-ai", "/services/agentic-ai"), { name: "cta_click" });
  assert.deepEqual(clickEvent("/contact", "/"), { name: "cta_click" });
  assert.equal(clickEvent("/contact", "/contact"), null); // the page linking to itself
  assert.equal(clickEvent("/contacts", "/"), null);
  assert.equal(clickEvent("/services", "/"), null);
});
