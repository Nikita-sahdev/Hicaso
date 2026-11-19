import { test } from "node:test";
import assert from "node:assert/strict";
import { parseLeads } from "./leads.ts";

const line = (at: string, name: string) =>
  JSON.stringify({ at, name, email: `${name}@example.com`, country: "", service: "Web Development", budget: "", message: "Hi" });

test("parseLeads returns the newest enquiry first", () => {
  const text = [line("2026-11-01T10:00:00.000Z", "old"), line("2026-11-18T10:00:00.000Z", "new")].join("\n") + "\n";
  assert.deepEqual(parseLeads(text).map((l) => l.name), ["new", "old"]);
});

test("parseLeads skips blank, broken and incomplete lines instead of failing", () => {
  const text = ["", "{not json", JSON.stringify({ name: "no date or email" }), line("2026-11-18T10:00:00.000Z", "ok")].join("\n");
  assert.deepEqual(parseLeads(text).map((l) => l.name), ["ok"]);
});

test("parseLeads gives each enquiry a stable id and string fields", () => {
  const [l] = parseLeads(JSON.stringify({ at: "2026-11-18T10:00:00.000Z", name: "A", email: "a@example.com" }));
  assert.equal(l.service, "");
  assert.equal(l.message, "");
  assert.equal(typeof l.id, "string");
  assert.equal(parseLeads(JSON.stringify({ at: "2026-11-18T10:00:00.000Z", name: "A", email: "a@example.com" }))[0].id, l.id);
});
