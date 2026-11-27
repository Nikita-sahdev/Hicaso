"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

/* ─────────────────────────────────────────────
 * The landing page's scroll motion (GSAP ScrollTrigger, owner's choice 2026-11-25: "Everything", which replaces the
 * 2026-11-23 "no scroll reveals"). Every section below the hero, once, as it comes in:
 *
 *    0ms   the headline's lines rise out of a mask, 80ms apart
 *  120ms   the copy around it (lead, tabs, rows, buttons) rises 24px, 80ms apart
 *          cards rise 56px in batches as they arrive, 80ms apart (first 6 of a batch)
 *          a picture panel rises 60px and settles from 0.96
 *          figures count up from 0
 *  scrub   the screens inside panels drift against the scroll (parallax, ±18px)
 *  scrub   the dark #why band opens from an inset, rounded card to full width as it arrives
 *
 * Left alone: the hero (HeroDeal, HeroAudit), #how's steps (the kit's pinned chapters) and the kit's own fragment
 * loops. Everything ends at the written page (clearProps), so hovers and the kit's own motion take over. Off under
 * reduced motion, html[data-motion="off"] and headless shots, where the page stays as written.
 * ───────────────────────────────────────────── */
const START = "top 82%";
const TIMING = { line: 0.08, copy: 0.08, copyDelay: 0.12, card: 0.08 };
const RISE = { line: { yPercent: 110, duration: 0.9 }, copy: { y: 24, duration: 0.7 }, card: { y: 56, duration: 0.9 }, panel: { y: 60, scale: 0.96, duration: 1 } };
const DRIFT = 18; // px each way
const COPY = ".t-lead, .section-head > p, .stack-5 > p, .stack-4, .tabs, .rows > li, .btn-row, .link-list, .faq__item";

export default function HomeMotion() {
  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.motion === "off") return;
    if (/HeadlessChrome/.test(navigator.userAgent) && html.dataset.motion !== "live") return;
    const out = CustomEase.create("home-out", "0.32,0.72,0,1");
    const sections = [...document.querySelectorAll<HTMLElement>("main > section:not(.hero)")];
    const loose = (el: Element) => !el.closest(".card, .panel, .hero");

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      sections.forEach((sec) => {
        // the headline
        const h2 = sec.querySelector<HTMLElement>("h2");
        if (h2) {
          const split = SplitText.create(h2, { type: "lines", mask: "lines" });
          gsap.from(split.lines, {
            ...RISE.line,
            ease: out,
            stagger: TIMING.line,
            scrollTrigger: { trigger: h2, start: START, once: true },
            onComplete: () => split.revert(),
          });
        }
        if (sec.id === "how") return; // its steps are the kit's pinned chapters

        // the copy around it, in reading order
        const copy = [...sec.querySelectorAll<HTMLElement>(COPY)].filter(loose).filter((el, _, all) => !all.some((o) => o !== el && o.contains(el)));
        if (copy.length) {
          gsap.from(copy, {
            ...RISE.copy,
            opacity: 0,
            ease: out,
            delay: TIMING.copyDelay,
            stagger: TIMING.copy,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: copy[0], start: START, once: true },
          });
        }

        // a picture panel on its own (not inside a card), and the open product frame
        sec.querySelectorAll<HTMLElement>(".panel, .app-tab:not([hidden])").forEach((p) => {
          if (p.closest(".card") || p.parentElement?.closest(".panel")) return;
          gsap.from(p, { ...RISE.panel, opacity: 0, ease: out, clearProps: "transform,opacity", scrollTrigger: { trigger: p, start: START, once: true } });
        });

        // figures count up ("40+", "12", "95%")
        sec.querySelectorAll<HTMLElement>(".t-stat").forEach((el) => {
          const m = /^(\D*)(\d+)(\D*)$/.exec(el.textContent?.trim() ?? "");
          if (!m) return;
          const [, pre, num, post] = m;
          ScrollTrigger.create({
            trigger: el,
            start: START,
            once: true,
            onEnter: () => {
              const n = { v: 0 };
              gsap.to(n, {
                v: Number(num),
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => { el.textContent = `${pre}${Math.round(n.v)}${post}`; },
                onComplete: () => { el.textContent = `${pre}${num}${post}`; },
              });
            },
          });
        });
      });

      // cards rise in batches as they arrive
      const cards = gsap.utils.toArray<HTMLElement>("main > section:not(.hero) .card");
      gsap.set(cards, { y: RISE.card.y, opacity: 0 });
      ScrollTrigger.batch(cards, {
        start: START,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch.slice(0, 6), { y: 0, opacity: 1, duration: RISE.card.duration, ease: out, stagger: TIMING.card, clearProps: "transform,opacity",
            onComplete: () => gsap.set(batch.slice(6), { clearProps: "transform,opacity" }) }),
      });

      // the screens inside panels drift against the scroll
      gsap.utils.toArray<HTMLElement>("main > section:not(.hero, #how) .panel > .stage, #stack .dg").forEach((el) => {
        gsap.fromTo(el, { y: DRIFT, scale: 1.04 }, { y: -DRIFT, scale: 1.04, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // the dark band opens out to full width as it arrives
      const band = document.querySelector<HTMLElement>("main > #why");
      if (band) {
        gsap.fromTo(band, { clipPath: "inset(0% 4% 0% 4% round 32px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
          scrollTrigger: { trigger: band, start: "top bottom", end: "top 30%", scrub: true } });
      }
    });

    return () => mm.revert();
  }, []);

  return null;
}
