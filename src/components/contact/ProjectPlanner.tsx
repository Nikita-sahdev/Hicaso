"use client";

import { useRef, useState } from "react";
import { PLANNER, buildBrief, type PlannerChoices } from "@/lib/planner";

const STEPS = ["What are you building?", "Where should it run?", "Which features does it need?", "Where are you now?", "Your project brief"];

// Four short steps above the enquiry form; the answers fill its service and message (no prices, src/lib/planner.ts).
export default function ProjectPlanner() {
  const box = useRef<HTMLDetailsElement>(null);
  const [step, setStep] = useState(0);
  const [c, setC] = useState<PlannerChoices>({ what: "", platforms: [], features: [], stage: "", timing: "" });
  const toggle = (k: "platforms" | "features", v: string) =>
    setC((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));
  const brief = buildBrief(c);

  const use = () => {
    const sel = document.getElementById("enq-service") as HTMLSelectElement | null;
    const msg = document.getElementById("enq-message") as HTMLTextAreaElement | null;
    if (sel) { sel.value = brief.service; sel.dispatchEvent(new Event("change", { bubbles: true })); }
    if (msg) { msg.value = brief.message; msg.dispatchEvent(new Event("input", { bubbles: true })); }
    if (box.current) box.current.open = false;
    document.getElementById("enq-name")?.focus();
  };

  const chip = (label: string, on: boolean, onClick: () => void) => (
    <button key={label} type="button" className="tab" aria-pressed={on} onClick={onClick}>{label}</button>
  );

  return (
    <details className="planner" ref={box}>
      <summary>
        <span className="planner__ico" aria-hidden="true">
          <svg viewBox="0 0 20 20"><path d="M4 5.5h12M4 10h8M4 14.5h5" /></svg>
        </span>
        <span className="planner__head">
          <b>Not sure what to write?</b>
          <span>Plan it in four steps and we write the brief for you</span>
        </span>
      </summary>
      <div className="planner__body">
        <p className="t-small muted" aria-live="polite">{step < 4 ? `Step ${step + 1} of 4: ` : ""}{STEPS[step]}</p>
        {step === 0 ? <div className="planner__chips">{PLANNER.what.map((o) => chip(o.label, c.what === o.id, () => setC((x) => ({ ...x, what: o.id }))))}</div> : null}
        {step === 1 ? <div className="planner__chips">{PLANNER.platforms.map((p) => chip(p, c.platforms.includes(p), () => toggle("platforms", p)))}</div> : null}
        {step === 2 ? <div className="planner__chips">{PLANNER.features.map((f) => chip(f, c.features.includes(f), () => toggle("features", f)))}</div> : null}
        {step === 3 ? (
          <>
            <div className="planner__chips">{PLANNER.stages.map((s) => chip(s, c.stage === s, () => setC((x) => ({ ...x, stage: x.stage === s ? "" : s }))))}</div>
            <p className="t-small muted">When do you want to start?</p>
            <div className="planner__chips">{PLANNER.timing.map((t) => chip(t, c.timing === t, () => setC((x) => ({ ...x, timing: x.timing === t ? "" : t }))))}</div>
          </>
        ) : null}
        {step === 4 ? <pre className="planner__brief">{brief.message.trim()}</pre> : null}
        <div className="btn-row">
          {step > 0 ? <button type="button" className="btn btn--secondary" onClick={() => setStep(step - 1)}>Back</button> : null}
          {step < 4 ? (
            <button type="button" className="btn btn--primary" disabled={!c.what} onClick={() => setStep(step + 1)}>
              {step === 3 ? "See the brief" : "Next"}
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={use}>Use this brief</button>
          )}
        </div>
      </div>
    </details>
  );
}
