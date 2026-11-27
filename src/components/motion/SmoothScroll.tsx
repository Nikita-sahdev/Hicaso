"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

// Lenis smooth scrolling (darkroom.engineering, MIT), owner's choice 2026-11-23: it knowingly breaks the kit's
// "never steer the page by script" rule (motion.md). It eases the mouse wheel and trackpad only: touch scrolling
// stays native, reduced motion turns it off (and back on if the setting changes), /admin keeps plain scrolling for
// its editor, and anchor links (the skip link to #main) keep their native jump so focus still moves.
// The scroll position stays the window's own, so the kit's sticky moment (pinned-chapters) reads
// it as before. Nested scroll areas (menus, the assistant's chat) scroll themselves (allowNestedScroll).
export default function SmoothScroll() {
  const admin = usePathname()?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (admin) return;
    const html = document.documentElement;
    if (html.dataset.motion === "off") return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    const start = () => {
      if (lenis || reduce.matches) return;
      lenis = new Lenis({ autoRaf: true, anchors: false, allowNestedScroll: true, lerp: 0.12 });
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
    };
    const onChange = () => (reduce.matches ? stop() : start());
    start();
    reduce.addEventListener("change", onChange);
    return () => {
      reduce.removeEventListener("change", onChange);
      stop();
    };
  }, [admin]);

  return null;
}
