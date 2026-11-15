import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEnquiryMailto, parseEnquiry, resolveService, type Enquiry } from "./enquiry.ts";

const base: Enquiry = {
  name: "Ana",
  email: "ana@x.com",
  country: "Spain",
  service: "Web Development",
  budget: "$5k–$15k",
  message: "Hello there",
};
const parse = (e: Enquiry) => new URL(buildEnquiryMailto(e));

test("mailto goes to hello@hicaso.com with the service in the subject", () => {
  const r = buildEnquiryMailto(base);
  assert.ok(r.startsWith("mailto:hello@hicaso.com?subject="));
  assert.equal(new URL(r).searchParams.get("subject"), "Project enquiry — Web Development");
});

test("body lists every field", () => {
  const body = parse(base).searchParams.get("body") ?? "";
  for (const s of ["Name: Ana", "Email: ana@x.com", "Country: Spain", "Service: Web Development", "Budget: $5k–$15k", "Hello there"]) {
    assert.ok(body.includes(s), s);
  }
});

test("special characters survive", () => {
  const e = { ...base, name: "Zoë & Co #1 ?50%", message: "line1\nline2 🚀" };
  const r = buildEnquiryMailto(e);
  const body = new URL(r).searchParams.get("body") ?? "";
  assert.ok(body.includes("Zoë & Co #1 ?50%"));
  assert.ok(body.includes("line1\nline2 🚀"));
  assert.equal(r.split("&").length, 2);
});

test("empty optional fields are written as —", () => {
  const body = parse({ ...base, country: "" }).searchParams.get("body") ?? "";
  assert.ok(body.includes("Country: —"));
  assert.equal(parse({ ...base, service: "" }).searchParams.get("subject"), "Project enquiry");
});

test("resolveService accepts only known slugs", () => {
  const slugs = ["web-development", "agentic-ai"];
  assert.equal(resolveService("web-development", slugs), "web-development");
  assert.equal(resolveService("foo", slugs), "");
  assert.equal(resolveService(["a", "b"], slugs), "");
  assert.equal(resolveService(undefined, slugs), "");
});

const fd = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};

test("parseEnquiry accepts a good enquiry and trims it", () => {
  const e = parseEnquiry(fd({ ...base, name: "  Ana " }));
  assert.equal(e?.name, "Ana");
  assert.equal(e?.message, "Hello there");
});

test("parseEnquiry rejects missing name, bad email, empty or too-long message", () => {
  assert.equal(parseEnquiry(fd({ ...base, name: " " })), null);
  assert.equal(parseEnquiry(fd({ ...base, email: "ana.x.com" })), null);
  assert.equal(parseEnquiry(fd({ ...base, message: "" })), null);
  assert.equal(parseEnquiry(fd({ ...base, message: "x".repeat(1001) })), null);
});
