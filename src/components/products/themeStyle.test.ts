import { test } from "node:test";
import assert from "node:assert/strict";
import { products } from "../../data/products.ts";
import { themeStyle } from "./themeStyle.ts";

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// the text pairs system.css draws from the --p-* tokens, on the page ground and on the inverse ground
const PAIRS: [string, string, number][] = [
  ["--p-ink", "--p-bg", 7],
  ["--p-muted", "--p-bg", 4.5],
  ["--p-ink", "--p-surface", 7],
  ["--p-muted", "--p-surface", 4.5],
  ["--p-action-ink", "--p-action", 4.5],
  ["--p-accent", "--p-bg", 4.5],
  ["--p-inv-ink", "--p-inv-bg", 7],
  ["--p-inv-muted", "--p-inv-bg", 4.5],
  ["--p-inv-ink", "--p-inv-surface", 7],
  ["--p-inv-muted", "--p-inv-surface", 4.5],
  ["--p-inv-action-ink", "--p-inv-action", 4.5],
  ["--p-inv-accent-ink", "--p-inv-accent", 4.5],
];

test("every product's kit tokens are hex and meet contrast", () => {
  for (const p of products) {
    const s = themeStyle(p) as Record<string, string>;
    for (const [fg, bg, min] of PAIRS) {
      assert.match(s[fg] ?? "", /^#[0-9a-f]{6}$/i, `${p.name} ${fg}`);
      assert.match(s[bg] ?? "", /^#[0-9a-f]{6}$/i, `${p.name} ${bg}`);
      assert.ok(contrast(s[fg], s[bg]) >= min, `${p.name} ${fg} on ${bg}: ${contrast(s[fg], s[bg]).toFixed(2)}`);
    }
  }
});

test("the theme's brand colours land on the kit tokens", () => {
  for (const p of products) {
    const s = themeStyle(p) as Record<string, string>;
    assert.equal(s["--p-bg"], p.theme.bg);
    assert.equal(s["--p-ink"], p.theme.fg);
    assert.equal(s["--p-accent"], p.theme.accent);
    assert.equal(s["--p-action"], p.theme.accent);
  }
});
