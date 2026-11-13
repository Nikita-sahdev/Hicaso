import { test } from "node:test";
import assert from "node:assert/strict";
import { llmsText } from "./llms.ts";
import { SITE_URL } from "./site.ts";
import { ENQUIRY_TO } from "./enquiry.ts";
import { services, moreServices } from "../data/services.ts";
import { products } from "../data/products.ts";

test("llms.txt opens with the name and a summary line", () => {
  assert.match(llmsText(), /^# Hicaso\n\n> \S/);
});

test("llms.txt links every service and product page", () => {
  const t = llmsText();
  for (const s of services) assert.ok(t.includes(`${SITE_URL}/services/${s.slug}`), s.slug);
  for (const p of products) assert.ok(t.includes(`${SITE_URL}/products/${p.slug}`), p.slug);
  for (const s of moreServices) assert.ok(t.includes(s.name), s.slug);
});

test("llms.txt gives the contact email and company pages", () => {
  const t = llmsText();
  assert.ok(t.includes(ENQUIRY_TO));
  for (const p of ["/about", "/contact"]) assert.ok(t.includes(`${SITE_URL}${p}`), p);
});

test("llms.txt links every technology page", async () => {
  const { technologies } = await import("../data/technologies.ts");
  const t = llmsText();
  for (const x of technologies) assert.ok(t.includes(`${SITE_URL}/technologies/${x.slug}`), x.slug);
});
