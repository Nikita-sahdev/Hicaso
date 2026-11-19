// Joins the kit stylesheets the root layout needs into one file, public/kit.css, in cascade order: one
// render-blocking request instead of 23 (the live server speaks HTTP/1.1, six at a time). The kit files under
// public/assets stay as they are; this only reads them. Runs before `next dev` and `next build` (package.json).
// The kit CSS has no relative url(), so the joined file works from public/.
import { readFileSync, writeFileSync } from "node:fs";

const KIT = [
  "system.css",
  "ui/cards.css",
  "motion/motion.css",
  "backgrounds/backgrounds.css",
  "layout/layout.css",
  "icons/icon.css",
  "ui/base.css",
  "ui/window/fragment.css",
  "ui/chat/fragment.css",
  "ui/checklist/fragment.css",
  "ui/toggles/fragment.css",
  "ui/pipeline-board/fragment.css",
  "ui/diff-review/fragment.css",
  "ui/doc/fragment.css",
  "ui/files/fragment.css",
  "ui/terminal-run/fragment.css",
  "ui/notify/fragment.css",
  "diagrams/diagram.css",
  // here too so the steps stand styled with scripts off (the moment loader links its own copy later)
  "moments/pinned-chapters/moment.css",
  "moments/marquee-row/moment.css",
  "moments/iris-opens/moment.css",
  "moments/counter-rolls/moment.css",
  "moments/giant-type-pass/moment.css",
];

const root = new URL("../public/", import.meta.url);
const css = KIT.map((f) => `/* ${f} */\n` + readFileSync(new URL(`assets/${f}`, root), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "") // the kit's comments are notes for people, about half of each file
  .replace(/\n\s*\n+/g, "\n")).join("\n");
writeFileSync(new URL("kit.css", root), css);
console.log(`kit.css: ${KIT.length} files, ${(css.length / 1024).toFixed(0)} KB`);
