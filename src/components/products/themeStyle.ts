import type { CSSProperties } from "react";
import type { Product } from "@/data/products";

const fonts = {
  bricolage: "var(--font-bricolage)",
  poppins: "var(--font-poppins)",
} as const;

// Paints a surface in a product's own brand. Children read only these variables,
// so a new product needs no new CSS.
export function themeStyle({ theme }: Product): CSSProperties {
  return {
    "--p-bg": theme.bg,
    "--p-fg": theme.fg,
    "--p-accent": theme.accent,
    "--p-on-accent": theme.onAccent,
    "--p-font": fonts[theme.font],
    "--btn-fill": theme.accent,
    "--btn-on-fill": theme.onAccent,
    "--btn-line": theme.accent,
    "--btn-text": theme.fg,
    "--heading-color": theme.fg,
    "--focus-ring": theme.accent,
    background: theme.bg,
    color: theme.fg,
  } as CSSProperties;
}
