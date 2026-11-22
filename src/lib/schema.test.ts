import { test } from "node:test";
import assert from "node:assert/strict";
import { ORG_ID, orgLd, softwareLd, websiteLd } from "./schema.ts";
import { products } from "../data/products.ts";
import { SITE_URL } from "./site.ts";

test("the Organization has one @id, the legal name and no street address", () => {
  const o = orgLd([]);
  assert.equal(o["@id"], `${SITE_URL}/#organization`);
  assert.equal(o["@id"], ORG_ID);
  assert.equal(o.legalName, "Hicaso LLP");
  assert.ok(o.description.length > 50);
  assert.equal(o.address.streetAddress, undefined);
});

test("the WebSite is published by that Organization", () => {
  assert.deepEqual(websiteLd().publisher, { "@id": ORG_ID });
});

test("each product is a SoftwareApplication made by Hicaso, with nothing the site doesn't show", () => {
  for (const p of products) {
    const s = softwareLd(p) as Record<string, unknown>;
    assert.equal(s["@type"], "SoftwareApplication");
    assert.equal(s.name, p.name);
    assert.equal(s.url, p.url);
    assert.deepEqual(s.creator, { "@id": ORG_ID });
    assert.equal(s.operatingSystem, "Web"); // the site links each product to the web app it runs as
    for (const k of ["offers", "aggregateRating", "review"]) assert.equal(s[k], undefined, `${p.slug}: ${k}`);
  }
});
