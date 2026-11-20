"use client";

import { useEffect, useState } from "react";
import { clickEvent, type AnalyticsIds } from "@/lib/analytics";

const KEY = "hicaso-consent"; // "granted" | "denied"; absent = not asked yet
export const OPEN_EVENT = "hicaso:consent"; // the footer's "Cookie settings" reopens the banner

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; clarity?: unknown; _linkedin_partner_id?: string; _linkedin_data_partner_ids?: string[] };

const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v: string) => { try { localStorage.setItem(KEY, v); } catch {} };
const script = (src: string) => { const s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); };

// Loads each configured tool once, only after the visitor accepted.
function load(ids: AnalyticsIds) {
  const w = window as W;
  if (ids.ga && !w.gtag) {
    w.dataLayer = w.dataLayer || [];
    // gtag.js reads the arguments object itself; a rest array is not the same to it
    // eslint-disable-next-line prefer-rest-params
    w.gtag = function gtag() { w.dataLayer!.push(arguments); };
    w.gtag("js", new Date());
    w.gtag("config", ids.ga);
    const send = (name: string, params: Record<string, unknown>) => w.gtag!("event", name, params);
    // a real enquiry (system.js passes the sent FormData); only the form's choices go, never name, email or message
    document.addEventListener("form:sent", (e) => {
      const d = (e as CustomEvent<FormData | undefined>).detail;
      const pick = (k: string) => String(d?.get(k) ?? "") || undefined;
      send("generate_lead", { service: pick("service"), budget: pick("budget"), lead_source: pick("source") });
    });
    // contact links and "Start a project" links, with the section they sit in
    document.addEventListener("click", (e) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      const ev = a && clickEvent(a.getAttribute("href")!, location.pathname);
      if (!ev) return;
      const { name, ...params } = ev;
      const s = a.closest("section"); // a section's id, "hero" for the page heroes (no id), else header/footer
      const where = s?.id || (s?.classList.contains("hero") ? "hero" : "") || a.closest("header, footer")?.localName || "page";
      send(name, { ...params, location: where });
    });
    document.addEventListener("ask:sent", (e) => send("assistant_question", { starter: (e as CustomEvent<{ starter: boolean }>).detail.starter }));
    script(`https://www.googletagmanager.com/gtag/js?id=${ids.ga}`);
  }
  if (ids.clarity && !w.clarity) {
    // Clarity's queue stub, then its tag
    const q: unknown[] = [];
    w.clarity = Object.assign((...a: unknown[]) => void q.push(a), { q });
    script(`https://www.clarity.ms/tag/${ids.clarity}`);
  }
  if (ids.linkedin && !w._linkedin_partner_id) {
    w._linkedin_partner_id = ids.linkedin;
    w._linkedin_data_partner_ids = [...(w._linkedin_data_partner_ids || []), ids.linkedin];
    script("https://snap.licdn.com/li.lms-analytics/insight.min.js");
  }
}

// The cookie banner: nothing third-party loads until "Accept"; the choice is kept in this browser.
export default function Analytics({ ids, tools }: { ids: AnalyticsIds; tools: string[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const choice = read();
    if (choice === "granted") load(ids);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    else if (!choice) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, [ids]);
  if (!open) return null;
  const decide = (v: "granted" | "denied") => {
    const was = read();
    write(v);
    setOpen(false);
    if (v === "granted") load(ids);
    else if (was === "granted") window.location.reload(); // scripts already running stop on the next page load
  };
  return (
    <div className="consent" role="region" aria-label="Cookie choice">
      <p>
        May we use analytics cookies ({tools.join(", ")}) to see how visitors use this site? Nothing loads unless you
        accept. <a className="link" href="/privacy#part-cookies">Privacy policy</a>
      </p>
      <div className="btn-row">
        <button type="button" className="btn btn--primary" onClick={() => decide("granted")}>Accept</button>
        <button type="button" className="btn btn--secondary" onClick={() => decide("denied")}>Decline</button>
      </div>
    </div>
  );
}
