import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { products, getProduct, domainOf } from "./products.ts";

// WCAG 2.x relative luminance and contrast ratio for #rrggbb colors.
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("contrast helper matches the WCAG reference value", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
});

test("slugs are unique and URL-safe", () => {
  const slugs = products.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/);
});

test("every product links out over https and has 3–4 highlights", () => {
  for (const p of products) {
    assert.match(p.url, /^https:\/\//, p.name);
    assert.match(p.privacyUrl, /^https:\/\//, p.name);
    assert.ok(p.highlights.length >= 3 && p.highlights.length <= 4, p.name);
  }
});

test("theme colors are #rrggbb and meet WCAG AA (4.5:1)", () => {
  for (const { name, theme } of products) {
    for (const c of [theme.bg, theme.fg, theme.accent, theme.onAccent]) {
      assert.match(c, /^#[0-9a-f]{6}$/i, `${name} ${c}`);
    }
    assert.ok(contrast(theme.fg, theme.bg) >= 4.5, `${name} fg on bg`);
    assert.ok(contrast(theme.onAccent, theme.accent) >= 4.5, `${name} button text on accent`);
    assert.ok(contrast(theme.accent, theme.bg) >= 4.5, `${name} accent links on bg`);
  }
});

test("screenshots exist under public/", () => {
  for (const p of products) {
    if (p.screenshot) assert.ok(existsSync(`public${p.screenshot.src}`), p.screenshot.src);
  }
});

test("getProduct finds by slug, domainOf strips the scheme", () => {
  assert.equal(getProduct("appkavo")?.name, "AppKavo");
  assert.equal(getProduct("nope"), undefined);
  assert.equal(domainOf(getProduct("appkavo")!), "appkavo.com");
});
