import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown, outline } from "./markdown.ts";

// " onerror=" is checked inside real tags only: escaped text may still contain the word.
const BAD = ["<script", 'href="javascript:', 'href="//', 'src="data:', 'src="http:'];

test("hostile input renders inert", () => {
  for (const src of [
    "<script>alert(1)</script>",
    "<img src=x onerror=alert(1)>",
    "[x](javascript:alert(1))",
    "[x](//evil.com)",
    "![x](data:image/png;base64,AA)",
    "![x](http://a.com/i.png)",
    '[x](/ok "a\\" onmouseover=\\"alert(1)")',
  ]) {
    const html = renderMarkdown(src);
    for (const b of BAD) assert.ok(!html.includes(b), `${src} -> ${html}`);
    assert.ok(!/<[^>]+\sonerror=/.test(html), html);
  }
  // A quote in a title stays inside the attribute: the tag has exactly href and title.
  assert.match(renderMarkdown('[x](/ok "a\\" onmouseover=\\"alert(1)")'), /^<p><a href="\/ok" title="[^"]*">x<\/a><\/p>/);
  assert.match(renderMarkdown("<script>alert(1)</script>"), /&lt;script&gt;/);
});

test("refused link and image keep their text, escaped", () => {
  assert.match(renderMarkdown("[a <b> c](javascript:x)"), /a .*c/);
  assert.ok(!renderMarkdown("[a <b> c](javascript:x)").includes("<b>"));
  assert.match(renderMarkdown('![a "<i>"](http://x.com/a.png)'), /a &quot;&lt;i&gt;&quot;/);
});

test("safe urls survive", () => {
  assert.match(renderMarkdown("[a](https://a.com)"), /href="https:\/\/a\.com"/);
  assert.match(renderMarkdown("[b](/contact)"), /href="\/contact"/);
  assert.match(renderMarkdown("[c](mailto:a@b.c)"), /href="mailto:a@b\.c"/);
  const p = "/blog-images/0123456789abcdef0123456789abcdef.png";
  assert.match(renderMarkdown(`![d](${p})`), new RegExp(`src="${p}"`));
});

test("heading ids are unique and outline matches", () => {
  const src = "## Cost\n\n### Cost\n\n## Cost\n\n## **Bold** `code`";
  const html = renderMarkdown(src);
  assert.match(html, /<h2 id="cost">/);
  assert.match(html, /<h3 id="cost-2">/);
  assert.match(html, /<h2 id="cost-3">/);
  assert.match(html, /<h2 id="bold-code">/);
  assert.deepEqual(outline(src), [
    { id: "cost", text: "Cost" },
    { id: "cost-3", text: "Cost" },
    { id: "bold-code", text: "Bold code" },
  ]);
  assert.match(renderMarkdown("## !!!"), /<h2 id="section">/);
});

test("entity-encoded hrefs cannot become protocol-relative", () => {
  const dec = (s: string) =>
    s.replace(/&amp;/g, "\u0000").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/\u0000/g, "&");
  for (const href of ["/&#47;evil.com", "/&#x2f;evil.com", "/&sol;evil.com", "/&#92;evil.com", "/&bsol;evil.com", "/&#9;/evil.com"]) {
    for (const src of [`[x](${href})`, `[x][r]\n\n[r]: ${href}`]) {
      const html = renderMarkdown(src);
      const m = html.match(/href="([^"]*)"/);
      assert.ok(m, html);
      assert.ok(!/&(?!amp;)/.test(m[1]), html);
      assert.equal(new URL(dec(m[1]), "https://hicaso.com/blog/x").origin, "https://hicaso.com", html);
    }
  }
});

test("heading ids stay distinct when a suffixed id collides", () => {
  const src = "## Cost\n\n## Cost 2\n\n## Cost";
  const ids = outline(src).map((o) => o.id);
  assert.equal(new Set(ids).size, 3, ids.join());
  const html = [...renderMarkdown(src).matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(html, ids);
});

test("backslash, tab and dot-dot cannot escape the site or the image folder", () => {
  const decode = (s: string) => s.replace(/&amp;/g, "&");
  const base = "https://hicaso.com/blog/x";
  const srcs = [
    "[x](/\\evil.com)",
    "[x](</\t/evil.com>)",
    "[x](</\\evil.com>)",
    "[x][r]\n\n[r]: /\\evil.com",
    "[x](/&#47;evil.com)",
    "[x](/&#x2f;evil.com)",
    "[x](/&sol;evil.com)",
    "[x](/&#92;evil.com)",
    "[x](/&bsol;evil.com)",
    "[x](/&#9;/evil.com)",
    "[x][r]\n\n[r]: /&#47;evil.com",
  ];
  for (const src of srcs) {
    const html = renderMarkdown(src);
    const m = html.match(/href="([^"]*)"/);
    if (m) assert.equal(new URL(decode(m[1]), base).origin, "https://hicaso.com", `${src} -> ${html}`);
    else assert.match(html, /^<p>x<\/p>/, html);
  }
  // encodeURI turns the backslash into %5C, a literal path character, so the link stays on-site.
  assert.match(renderMarkdown("[x](/\\evil.com)"), /href="\/%5Cevil\.com"/);
  for (const bad of ["![a](/blog-images/\\..\\x.png)", "![a](/blog-images/../x.png)"]) {
    const html = renderMarkdown(bad);
    assert.ok(!html.includes("<img"), html);
  }
  const ok = "![d](/blog-images/0123456789abcdef0123456789abcdef.png)";
  assert.match(renderMarkdown(ok), /<img src="\/blog-images\/0123456789abcdef0123456789abcdef\.png"/);
  assert.match(renderMarkdown("[x](https://a.com/?a=1&b=2)"), /href="https:\/\/a\.com\/\?a=1&amp;b=2"/);
  assert.match(renderMarkdown("[b](/contact)"), /href="\/contact"/);
  assert.match(renderMarkdown("[c](mailto:a@b.c)"), /href="mailto:a@b\.c"/);
  assert.match(renderMarkdown("[t](#cost)"), /href="#cost"/);
});
