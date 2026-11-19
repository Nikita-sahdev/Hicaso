"use client";

import { useEffect, useState } from "react";
import type { AnalyticsIds } from "@/lib/analytics";

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
    document.addEventListener("form:sent", () => w.gtag!("event", "generate_lead")); // a real enquiry (system.js)
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
