"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

// The header's motion (GSAP, owner's request 2026-11-24), desktop only. A grey pill slides under the word you point at
// and stays on the open menu's word. A menu card drops in 10px and settles while its rows rise in a short stagger;
// moving to the next menu crossfades the card. CSS still opens and closes the menu (hover, focus), so without script
// the card simply shows. Under reduced motion the pill jumps and the card shows at once.
export default function NavMotion() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".nav--card");
    const links = nav?.querySelector<HTMLElement>(".nav__links");
    const bar = nav?.querySelector<HTMLElement>(".nav__bar");
    const pill = links?.querySelector<HTMLElement>(".nav__pill");
    if (!nav || !links || !bar || !pill) return;
    // the page you are on (landing-page-design B9): its word in the bar carries aria-current, which the kit marks
    // with its still bar; a section's word stays marked on the pages under it (/services/web-development)
    const here = location.pathname.replace(/\/$/, "");
    links.querySelectorAll<HTMLAnchorElement>(":scope > .nav__item > .nav__link").forEach((a) => {
      const to = new URL(a.href).pathname.replace(/\/$/, "");
      if (to && (here === to || here.startsWith(`${to}/`))) a.setAttribute("aria-current", "page");
    });
    const desk = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = [...links.querySelectorAll<HTMLElement>(".nav__item")];
    const cards = [...links.querySelectorAll<HTMLElement>(".nav__card")];
    const off: (() => void)[] = [];
    const on = (el: EventTarget, type: string, fn: EventListener) => {
      el.addEventListener(type, fn);
      off.push(() => el.removeEventListener(type, fn));
    };
    nav.classList.add("has-pill");

    let pillOn = false;
    let open: HTMLElement | null = null; // the item whose card is showing

    const pillTo = (link: HTMLElement) => {
      const x = link.getBoundingClientRect().left - bar.getBoundingClientRect().left;
      const width = link.offsetWidth;
      if (!pillOn || still.matches) {
        gsap.set(pill, { x, width });
        gsap.to(pill, { opacity: 1, duration: still.matches ? 0 : 0.18, overwrite: "auto" });
      } else {
        gsap.to(pill, { x, width, opacity: 1, duration: 0.38, ease: "power3.out", overwrite: "auto" });
      }
      pillOn = true;
    };

    const rows = (card: HTMLElement) => card.querySelectorAll<HTMLElement>(".menu-col > *");

    const show = (item: HTMLElement) => {
      const card = item.querySelector<HTMLElement>(".nav__card");
      const swap = !!open && open !== item;
      open = card ? item : null;
      if (!card || still.matches) return;
      gsap.killTweensOf([card, ...rows(card)]);
      if (swap) {
        gsap.fromTo(card, { opacity: 0, y: 0, scale: 1 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
        gsap.fromTo(rows(card), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out", stagger: 0.01 });
      } else {
        // 90ms: the CSS hover intent, so a pass across the bar opens nothing
        gsap.fromTo(card, { opacity: 0, y: -10, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.09 });
        gsap.fromTo(rows(card), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.016, delay: 0.13 });
      }
    };

    const hide = (item: HTMLElement) => {
      const card = item.querySelector<HTMLElement>(".nav__card");
      if (!card || still.matches) return;
      gsap.killTweensOf([card, ...rows(card)]);
      gsap.to(card, { opacity: 0, y: -4, duration: 0.14, ease: "power2.in" });
    };

    const reset = () => {
      open = null;
      pillOn = false;
      gsap.to(pill, { opacity: 0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    };

    items.forEach((item) => {
      const link = item.querySelector<HTMLElement>(".nav__link");
      if (!link) return;
      on(item, "pointerenter", () => {
        if (!desk.matches) return;
        pillTo(link);
        show(item);
      });
      on(item, "pointerleave", () => desk.matches && hide(item));
      on(item, "focusin", () => {
        if (!desk.matches || open === item) return;
        pillTo(link);
        show(item);
      });
      on(item, "focusout", (e) => {
        const to = (e as FocusEvent).relatedTarget as Node | null;
        if (!desk.matches || (to && item.contains(to))) return;
        hide(item);
        if (!to || !links.contains(to)) reset();
      });
    });
    on(links, "pointerleave", () => desk.matches && reset());

    // a phone sheet shows the cards plainly: drop whatever the desktop motion left inline
    const clear = () => {
      gsap.killTweensOf([pill, ...cards]);
      gsap.set([pill, ...cards, ...cards.flatMap((c) => [...rows(c)])], { clearProps: "all" });
      open = null;
      pillOn = false;
    };
    on(desk, "change", clear);

    return () => {
      off.forEach((f) => f());
      clear();
      nav.classList.remove("has-pill");
    };
  }, []);
  return null;
}
