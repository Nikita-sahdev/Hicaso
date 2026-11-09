import type { CSSProperties } from "react";
import type { Product } from "@/data/products";

// What the brand colours do not say: the kit's muted and surface tones, and the inverse ground (the other
// polarity) a section can switch to. Each pair is checked for contrast in themeStyle.test.ts.
const kit: Record<string, Record<string, string>> = {
  appkavo: {
    "--p-surface": "#17171b", "--p-muted": "#a1a1aa",
    "--p-inv-bg": "#f4f4f5", "--p-inv-surface": "#e4e4e7", "--p-inv-ink": "#0a0a0c", "--p-inv-muted": "#52525b",
    "--p-inv-accent": "#9a3f00", "--p-inv-accent-ink": "#ffffff", "--p-inv-action": "#0a0a0c", "--p-inv-action-ink": "#f4f4f5",
  },
  billminute: {
    "--p-surface": "#f1f4fc", "--p-muted": "#5b5f69",
    "--p-inv-bg": "#0d1226", "--p-inv-surface": "#161c36", "--p-inv-ink": "#f4f6fc", "--p-inv-muted": "#a3abc4",
    "--p-inv-accent": "#8fb0ff", "--p-inv-accent-ink": "#0d1226", "--p-inv-action": "#8fb0ff", "--p-inv-action-ink": "#0d1226",
  },
};

// Paints a surface in a product's own brand: the theme sets the kit's --p-* tokens, and system.css derives
// --bg, --ink, --accent and --action from them (class ground-base). A new product needs a `kit` entry here.
export function themeStyle({ slug, theme }: Product): CSSProperties {
  return {
    "--p-bg": theme.bg,
    "--p-ink": theme.fg,
    "--p-accent": theme.accent,
    "--p-accent-ink": theme.onAccent,
    "--p-action": theme.accent,
    "--p-action-ink": theme.onAccent,
    ...kit[slug],
  } as CSSProperties;
}
