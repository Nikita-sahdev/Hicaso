import { Marked, type Token } from "marked";
import { slugify } from "./post.ts";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
// Links and images are judged by where a browser would resolve the cleaned URL (see safeHref, safeSrc), not by the raw string.
const HOST = "https://hicaso.invalid";
const clean = (u: string): string | null => {
  try {
    return encodeURI(u).replace(/%25/g, "%"); // as marked does: keep existing escapes
  } catch {
    return null;
  }
};
// Decide by what a browser resolves (WHATWG URL), not by the raw string: "\\" and tabs act like "/".
const sameOrigin = (u: string) => {
  try {
    return new URL(u, HOST + "/").origin === HOST;
  } catch {
    return false;
  }
};
const safeHref = (raw: string): string | null => {
  const u = clean(raw);
  if (u === null) return null;
  if (/^(https?:|mailto:|#)/i.test(u)) return u;
  return u.startsWith("/") && sameOrigin(u) ? u : null;
};
const safeSrc = (raw: string): string | null => {
  const u = clean(raw);
  if (u === null) return null;
  if (/^https:/i.test(u)) return u;
  if (!u.startsWith("/") || !sameOrigin(u)) return null;
  return /^\/blog-images\/[a-f0-9]{32}\.(png|jpg)$/.test(new URL(u, HOST + "/").pathname) ? u : null;
};

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
        const h = safeHref(href);
        if (h === null) return inner;
        return `<a href="${escapeHtml(h)}"${title ? ` title="${escapeHtml(title)}"` : ""}>${inner}</a>`;
      },
      image({ href, title, text }) {
        const h = safeSrc(href);
        if (h === null) return escapeHtml(text);
        return `<img src="${escapeHtml(h)}" alt="${escapeHtml(text)}"${title ? ` title="${escapeHtml(title)}"` : ""}>`;
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
