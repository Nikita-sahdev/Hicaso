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
  const used = new Map<string, number>();
  const outline: { id: string; text: string }[] = [];
  const md = new Marked({ gfm: true, async: false });
  md.use({
    renderer: {
      // Raw HTML in a post is shown as text: the admin preview runs inside the signed-in app.
      html({ text }) {
        return escapeHtml(text);
      },
      // Returning false falls back to marked's default renderer, which escapes href and title.
      link({ href, tokens }) {
        return SAFE_HREF.test(href) ? false : this.parser.parseInline(tokens);
      },
      image({ href, text }) {
        return SAFE_SRC.test(href) ? false : escapeHtml(text);
      },
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) return `<h${depth}>${inner}</h${depth}>\n`;
        const text = plain(tokens).trim();
        const base = slugify(text) || "section";
        const n = (used.get(base) ?? 0) + 1;
        used.set(base, n);
        const id = n === 1 ? base : `${base}-${n}`;
        if (depth === 2) outline.push({ id, text });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
    },
  });
  return { html: md.parse(src) as string, outline };
}

export const renderMarkdown = (src: string): string => render(src).html;
export const outline = (src: string): { id: string; text: string }[] => render(src).outline;
