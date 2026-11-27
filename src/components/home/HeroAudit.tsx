"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

// The home page's focal motion (GSAP, owner's choice 2026-11-23): AppKavo audits the build in the hero's findings
// window once, after the kit's entrance. Every status starts as "Checking" (the window fragment's own is-work chip),
// a row band steps down the findings, and each status resolves as the band leaves its row; the two blockers land
// with a short stamp. Then the band goes and the first finding is selected, as the page was written.
// The written page is the end state: without script, under reduced motion, in a headless shot or when the visitor
// is already below the hero, nothing changes. The head line (layout.tsx) says yes with html[data-audit="1"] and
// holds the statuses hidden with html.m-audit until this takes them over (it lets go by itself after 4 s).
const STEP = 0.36; // seconds per finding: 7 findings in about 2.6 s

export default function HeroAudit() {
  useEffect(() => {
    const html = document.documentElement;
    const release = () => html.classList.remove("m-audit");
    const hero = document.querySelector<HTMLElement>(".hero--showcase");
    const main = hero?.querySelector<HTMLElement>(".ui-win__main");
    const rows = main ? [...main.querySelectorAll<HTMLElement>(".ui-win__row")] : [];
    const chips = rows.map((r) => r.querySelector<HTMLElement>(".ui-win__st"));
    if (!hero || !main || !rows.length || chips.some((c) => !c) || html.dataset.audit !== "1") return release();
    if (hero.getBoundingClientRect().bottom < 0) return release();

    const finals = chips.map((c) => ({ text: c!.textContent ?? "", cls: c!.className }));
    const sel = rows.findIndex((r) => r.classList.contains("is-sel"));
    const finish = () => {
      chips.forEach((c, i) => {
        c!.textContent = finals[i].text;
        c!.className = finals[i].cls;
      });
      if (sel >= 0) rows[sel].classList.add("is-sel");
    };

    // the band that marks the finding under check, one row tall
    const band = document.createElement("span");
    band.className = "audit-band";
    band.setAttribute("aria-hidden", "true");
    main.appendChild(band);

    chips.forEach((c) => {
      c!.textContent = "Checking";
      c!.className = "ui-win__st is-work";
    });
    if (sel >= 0) rows[sel].classList.remove("is-sel");
    release();

    const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" }, onComplete: () => band.remove() });
    gsap.set(band, { y: rows[0].offsetTop, height: rows[0].offsetHeight, autoAlpha: 0 });
    tl.to(band, { autoAlpha: 1, duration: 0.2 });
    rows.forEach((row, i) => {
      const at = 0.2 + i * STEP;
      if (i) tl.to(band, { y: row.offsetTop, duration: 0.3 }, at);
      tl.call(() => {
        chips[i]!.textContent = finals[i].text;
        chips[i]!.className = finals[i].cls;
      }, undefined, at + STEP * 0.7);
      const blocker = finals[i].cls.includes("is-you");
      // immediateRender off: the start scale applies on the chip's turn, not to every "Checking" chip at once
      tl.fromTo(chips[i]!, { scale: blocker ? 1.16 : 0.92, autoAlpha: 0.5 }, { scale: 1, autoAlpha: 1, duration: blocker ? 0.42 : 0.3, immediateRender: false, clearProps: "transform,opacity,visibility" }, at + STEP * 0.7);
    });
    tl.to(band, { autoAlpha: 0, duration: 0.25 }, ">-0.05");
    tl.call(() => { if (sel >= 0) rows[sel].classList.add("is-sel"); }, undefined, "<");

    // start when the kit's entrance is through (motion.js marks the hero is-entered), at the latest after 2.4 s (the kit's own safety time)
    let started = false;
    const go = () => { if (!started) { started = true; tl.play(); } };
    const mo = new MutationObserver(() => hero.classList.contains("is-entered") && go());
    if (hero.classList.contains("is-entered")) go();
    else mo.observe(hero, { attributes: true, attributeFilter: ["class"] });
    const late = setTimeout(go, 2400);

    return () => {
      mo.disconnect();
      clearTimeout(late);
      tl.kill();
      band.remove();
      finish();
    };
  }, []);

  return null;
}
