"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

/* ─────────────────────────────────────────────
 * The hero's screens row (GSAP, owner's request 2026-11-25), on load only (no scroll motion on this site).
 * STORYBOARD (ms after the hero mounts)
 *
 *  300ms   the AppKavo window rises 48px and settles from 0.96, fading in (it lands before HeroAudit starts)
 *  560ms   BillMinute slides out from behind the window to its place, turning from -4° to level
 *  600ms   AppKavo's site does the same on the right (40ms later: the pair settles, not one rigid block)
 *  then    with a mouse, the screens lean toward the pointer (up to 3°) and the side screens drift against it
 *
 * The side screens start hidden behind the window, so they never fade while in view. The written page is the end
 * state: without script, under reduced motion or in a headless shot nothing moves (the head line in layout.tsx
 * sets html.m-deal only when the audit and this will run, and lets go by itself after 4 s).
 * ───────────────────────────────────────────── */
const TIMING = { main: 0.3, sides: 0.56, pair: 0.04 };
const MAIN = { y: 48, scale: 0.96, duration: 0.5 };
const SIDE = { tuck: 0.88, y: 24, scale: 0.9, rotate: 4, duration: 0.5 };
const TILT = { y: 3, x: 2, drift: 10, duration: 0.6 };

export default function HeroDeal() {
  useEffect(() => {
    const html = document.documentElement;
    const release = () => html.classList.remove("m-deal");
    const row = document.querySelector<HTMLElement>(".hero--showcase [data-enter-media]");
    const main = row?.querySelector<HTMLElement>('[data-deal="main"]');
    if (!row || !main || html.dataset.audit !== "1") return release();
    // only the screens on show (below a laptop the sides are display: none)
    const sides = [...row.querySelectorAll<HTMLElement>('[data-deal="side"]')].filter((s) => s.offsetParent);
    if (row.getBoundingClientRect().bottom < 0) return release();

    const out = CustomEase.create("deal-out", "0.32,0.72,0,1"); // appearing
    const centre = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.left + r.width / 2;
    };
    const mid = centre(main);

    const tl = gsap.timeline({ defaults: { ease: out } });
    tl.fromTo(main, { y: MAIN.y, scale: MAIN.scale, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: MAIN.duration, clearProps: "transform,opacity" }, TIMING.main);
    sides.forEach((side, i) => {
      const dir = centre(side) < mid ? -1 : 1;
      const at = TIMING.sides + i * TIMING.pair;
      // behind the window until it is opaque, then out to its place
      tl.fromTo(
        side,
        { x: (mid - centre(side)) * SIDE.tuck, y: SIDE.y, scale: SIDE.scale, rotate: SIDE.rotate * dir },
        { x: 0, y: 0, scale: 1, rotate: 0, duration: SIDE.duration, immediateRender: true, clearProps: "transform" },
        at,
      );
      gsap.set(side, { opacity: 0 });
      tl.set(side, { opacity: 1, clearProps: "opacity" }, at);
    });
    release(); // the start states are set: the hold can go

    // the lean: a real mouse only, smoothed, mapped from the pointer's place over the hero
    const hero = row.closest<HTMLElement>(".hero");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let leave = () => {};
    if (hero && fine) {
      // each screen leans on its own: the row itself is the kit's (it settles its own entrance scale)
      const cards = [main, ...sides];
      let deep = false; // the deal's clearProps drops the perspective, so it goes on at the first lean
      const q = (el: HTMLElement, prop: string) => gsap.quickTo(el, prop, { duration: TILT.duration, ease: "power3.out" });
      const rx = cards.map((c) => q(c, "rotationX"));
      const ry = cards.map((c) => q(c, "rotationY"));
      const drift = sides.map((s) => q(s, "x"));
      const move = (e: PointerEvent) => {
        if (tl.isActive()) return;
        if (!deep) {
          gsap.set(cards, { transformPerspective: 1600 });
          deep = true;
        }
        const r = row.getBoundingClientRect();
        const px = gsap.utils.clamp(-1, 1, ((e.clientX - r.left) / r.width) * 2 - 1);
        const py = gsap.utils.clamp(-1, 1, ((e.clientY - r.top) / r.height) * 2 - 1);
        ry.forEach((f) => f(px * TILT.y));
        rx.forEach((f) => f(-py * TILT.x));
        drift.forEach((d) => d(-px * TILT.drift));
      };
      const back = () => {
        rx.forEach((f) => f(0));
        ry.forEach((f) => f(0));
        drift.forEach((d) => d(0));
      };
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", back);
      leave = () => {
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", back);
      };
    }

    return () => {
      leave();
      tl.kill();
      gsap.set([main, ...sides], { clearProps: "transform,opacity" });
      release();
    };
  }, []);

  return null;
}
