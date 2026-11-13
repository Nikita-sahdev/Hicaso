import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SOCIAL } from "../../lib/site.ts";
import { SOCIAL_ICONS } from "./socialIcons.ts";

test("every social link has a one-colour inline icon that follows the text colour", () => {
  for (const s of SOCIAL) {
    const svg = SOCIAL_ICONS[s.icon];
    assert.ok(svg?.startsWith("<svg"), s.label);
    assert.match(svg, /currentColor/, s.label);
    assert.doesNotMatch(svg, /fill="#(?!fff\b|ffffff\b|000\b|000000\b)[0-9a-f]{3,6}"/i, s.label); // no brand colours (mask black/white allowed)
    assert.match(svg, /aria-hidden="true"/, s.label); // the link carries the label
  }
});

test("every social icon's source mark is credited in the kit manifest", () => {
  const credits: { file: string; trademark?: boolean }[] = JSON.parse(readFileSync("public/assets/icons/icons-credits.json", "utf8"));
  for (const s of SOCIAL) assert.ok(credits.some((c) => c.file === `${s.icon}.svg` && c.trademark), s.label);
});
