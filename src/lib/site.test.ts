import { test } from "node:test";
import assert from "node:assert/strict";
import { breadcrumbLd, httpsLinks, PROFILES, SITE_URL, SOCIAL, whatsappUrl, WHATSAPP, BOOKING_URL } from "./site.ts";

test("httpsLinks drops empty and non-https URLs", () => {
  const out = httpsLinks([{ url: "" }, { url: "http://x.com" }, { url: "javascript:alert(1)" }, { url: "https://linkedin.com/company/hicaso" }]);
  assert.deepEqual(out.map((l) => l.url), ["https://linkedin.com/company/hicaso"]);
});

test("httpsLinks of an empty list is empty", () => assert.deepEqual(httpsLinks([]), []));

test("every configured social link is https and labelled", () => {
  assert.equal(httpsLinks(SOCIAL).length, SOCIAL.length);
  for (const s of SOCIAL) assert.ok(s.label.trim(), s.url);
});

test("every review-site profile is https and labelled", () => {
  assert.equal(httpsLinks(PROFILES).length, PROFILES.length);
  for (const p of PROFILES) assert.ok(p.label.trim(), p.url);
});

test("whatsappUrl builds wa.me links from digits only", () => {
  assert.equal(whatsappUrl("917009137936"), "https://wa.me/917009137936");
  for (const bad of ["", "+91 70091 37936", "123", "9170091379361234"]) assert.equal(whatsappUrl(bad), null);
});

test("configured WhatsApp number is valid; booking URL is empty or https", () => {
  assert.ok(whatsappUrl(WHATSAPP));
  assert.ok(BOOKING_URL === "" || httpsLinks([{ url: BOOKING_URL }]).length === 1);
});

test("every social link has an icon file in the kit icons folder", async () => {
  const { existsSync } = await import("node:fs");
  for (const s of SOCIAL) assert.ok(s.icon && existsSync(`public/assets/icons/${s.icon}.svg`), s.label);
});

test("breadcrumbLd lists the trail in order with absolute URLs", () => {
  const ld = breadcrumbLd([["Home", "/"], ["Services", "/services"], ["Web Development", "/services/web-development"]]);
  assert.equal(ld["@type"], "BreadcrumbList");
  assert.deepEqual(ld.itemListElement.map((i) => [i.position, i.name, i.item]), [
    [1, "Home", `${SITE_URL}/`],
    [2, "Services", `${SITE_URL}/services`],
    [3, "Web Development", `${SITE_URL}/services/web-development`],
  ]);
});
