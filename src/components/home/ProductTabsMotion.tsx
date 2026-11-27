"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

// The product tabs (system.js swaps the panels' hidden attribute): the app window that opens comes into focus,
// from a short blur and a 10px drop to sharp and in place, so the switch reads as one window changing rather than a
// cut. Under reduced motion it only fades. The panels stay where the markup puts them; nothing moves on scroll.
export default function ProductTabsMotion() {
  useEffect(() => {
    const panels = [...document.querySelectorAll<HTMLElement>("#products .app-tab")];
    if (!panels.length) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        const panel = r.target as HTMLElement;
        // only a panel that was hidden and now shows
        if (r.oldValue === null || panel.hidden) continue;
        gsap.killTweensOf(panel);
        if (reduce.matches) gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "none", clearProps: "opacity" });
        else
          gsap.fromTo(
            panel,
            { opacity: 0, y: 10, filter: "blur(6px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "expo.out", clearProps: "opacity,transform,filter" },
          );
      }
    });
    panels.forEach((p) => mo.observe(p, { attributes: true, attributeFilter: ["hidden"], attributeOldValue: true }));
    return () => {
      mo.disconnect();
      panels.forEach((p) => gsap.killTweensOf(p));
    };
  }, []);

  return null;
}
