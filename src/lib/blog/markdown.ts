import { Marked, type Token } from "marked";
import { slugify } from "./post.ts";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
// Relative paths must not start with "//" (protocol-relative, i.e. another site).
const SAFE_HREF = /^(https?:|mailto:|\/(?!\/)|#)/i;
const SAFE_SRC = /^(\/blog-images\/|https:)/i;

const plain = (tokens: Token[]): string =>
  tokens.map((t) => ("tokens" in t && t.tokens ? plain(t.tokens) : "text" in t ? String(t.text) : "")).join("");

function render(src: string): { html: string; outline: { id: string; text: string }[] } {
  const used = new Set<string>();
  const outline: { id: string; text: string }[] = [];
  const md = new Marked({ gfm: true, async: false });
  md.use({
    renderer: {
      // Raw HTML in a post is shown as text: the admin preview runs inside the signed-in app.
      html({ text }) {
        return escapeHtml(text);
      },
      // Tags are built here, not by marked's default renderer: it leaves existing entities
      // alone, so "/&#47;evil.com" would decode to "//evil.com". escapeHtml encodes every "&".
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        if (!SAFE_HREF.test(href)) return inner;
        return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ""}>${inner}</a>`;
      },
      image({ href, title, text }) {
        if (!SAFE_SRC.test(href)) return escapeHtml(text);
        return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${title ? ` title="${escapeHtml(title)}"` : ""}>`;
      },
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) return `<h${depth}>${inner}</h${depth}>\n`;
        const text = plain(tokens).trim();
        const base = slugify(text) || "section";
        let id = base;
        for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
        used.add(id);
        if (depth === 2) outline.push({ id, text });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
    },
  });
  return { html: md.parse(src) as string, outline };
}

export const renderMarkdown = (src: string): string => render(src).html;
export const outline = (src: string): { id: string; text: string }[] => render(src).outline;
