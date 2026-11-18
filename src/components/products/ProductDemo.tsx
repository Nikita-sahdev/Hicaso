"use client";

import { useRef, useState } from "react";
import { animate, stagger } from "animejs";

// A click-run demo under each product's closing line (anime.js; never on scroll, so it is no moment). It sits
// beside the kit's own looping window, which it never touches. Reduced motion: the end state, no tween.
const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// BillMinute: one invoice, shown the way each client's country writes money and dates (Intl does the writing)
const CLIENTS = [
  { code: "EUR", label: "€ EUR", locale: "de-DE", country: "Germany", money: "euros" },
  { code: "USD", label: "$ USD", locale: "en-US", country: "United States", money: "US dollars" },
  { code: "INR", label: "₹ INR", locale: "en-IN", country: "India", money: "Indian rupees" },
  { code: "GBP", label: "£ GBP", locale: "en-GB", country: "United Kingdom", money: "pounds" },
];
const DUE = new Date(Date.UTC(2026, 10, 20));
const write = (c: (typeof CLIENTS)[number]) => ({
  total: new Intl.NumberFormat(c.locale, { style: "currency", currency: c.code }).format(2400),
  due: new Intl.DateTimeFormat(c.locale, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(DUE),
  note: `${c.country}: ${c.money}, dates ${c.locale === "en-US" ? "month" : "day"} first.`,
});

function BillMinuteDemo() {
  const [i, setI] = useState(0);
  const lineRef = useRef<HTMLDivElement>(null);
  const shown = write(CLIENTS[i]);
  const pick = (n: number) => {
    const parts = lineRef.current?.querySelectorAll("[data-part]");
    if (!parts || still() || n === i) return setI(n);
    animate(parts, {
      opacity: [1, 0],
      y: [0, -6],
      duration: 160,
      ease: "outQuad",
      onComplete: () => {
        setI(n);
        animate(parts, { opacity: [0, 1], y: [6, 0], duration: 420, delay: stagger(60), ease: "outQuint" });
      },
    });
  };
  return (
    <div className="stack-4">
      <p className="t-small" id="bm-demo-label">Pick your client&apos;s currency</p>
      <div className="tabs" role="group" aria-labelledby="bm-demo-label">
        {CLIENTS.map((c, n) => (
          <button key={c.code} type="button" className="tab" aria-pressed={n === i} onClick={() => pick(n)}>
            {c.label}
          </button>
        ))}
      </div>
      <div ref={lineRef} className="stack-2" aria-live="polite">
        <p className="t-card">
          Total due <span data-part>{shown.total}</span> by <span data-part>{shown.due}</span>
        </p>
        <p className="t-small" data-part>{shown.note}</p>
      </div>
    </div>
  );
}

// AppKavo: a sample audit with the hero's numbers (7 findings, 2 blockers), named "the sample build" so it never
// contradicts the iOS file in the window beside it
const FILES = 212;
function AppKavoDemo() {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [files, setFiles] = useState(0);
  const barRef = useRef<HTMLSpanElement>(null);
  const run = () => {
    if (state === "running") return;
    const bar = barRef.current;
    if (still() || !bar) {
      setFiles(FILES);
      return setState("done");
    }
    setState("running");
    const count = { n: 0 };
    animate(count, {
      n: FILES,
      duration: 2200,
      ease: "outQuart",
      onUpdate: () => setFiles(Math.round(count.n)),
      onComplete: () => setState("done"),
    });
    animate(bar, { scaleX: [0, 1], duration: 2200, ease: "outQuart" });
  };
  return (
    <div className="stack-4">
      <div className="btn-row">
        <button type="button" className="btn btn--secondary" onClick={run} disabled={state === "running"}>
          {state === "done" ? "Run the sample audit again" : "Run a sample audit"}
        </button>
      </div>
      <div className="stack-2" aria-live="polite">
        <span className="demo-bar" aria-hidden="true">
          <span ref={barRef} className="demo-bar__fill" style={state === "idle" ? { transform: "scaleX(0)" } : undefined} />
        </span>
        <p className="t-small">
          {state === "idle"
            ? "The sample build, ready to scan"
            : state === "running"
              ? `Scanning the sample build: ${files} of ${FILES} files`
              : `${FILES} files scanned: 7 findings, 2 of them store-review blockers`}
        </p>
      </div>
    </div>
  );
}

export default function ProductDemo({ slug }: { slug: string }) {
  if (slug === "billminute") return <BillMinuteDemo />;
  if (slug === "appkavo") return <AppKavoDemo />;
  return null;
}
