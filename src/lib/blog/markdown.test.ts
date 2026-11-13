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
