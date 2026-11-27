"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { animate, createDrawable, stagger } from "animejs";
import { BUDGETS, ENQUIRY_TO, OTHER_SERVICE, SOURCES, buildEnquiryMailto } from "@/lib/enquiry";

// compact: the home page's short version (name, email, message); the server needs only those three
type Props = { services: { slug: string; name: string }[]; initialService: string; compact?: boolean };

// The starter's booking-form (system.md, Forms): kit .form/.field markup, a label above every field, each error under
// its field. system.js checks the fields on submit (aria-invalid and the reason in .field__error, the focus on the first);
// this handler then opens the visitor's mail app with the message ready. With scripts off the form still posts to its
// mailto: action. The mailto stand-in shows no success line: the note under the button only says what opens.
export default function EnquiryForm({ services, initialService, compact = false }: Props) {
  const [opened, setOpened] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const tickRef = useRef<HTMLSpanElement>(null);

  // A tick drawn beside the status line once system.js reports a real send (form:sent fires only after the
  // endpoint answers 2xx); hidden again on the next submit. Reduced motion: the tick just appears.
  useEffect(() => {
    const form = formRef.current;
    const tick = tickRef.current;
    if (!form || !tick) return;
    const hide = () => tick.setAttribute("hidden", "");
    const sent = () => {
      tick.removeAttribute("hidden");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      animate(createDrawable(tick.querySelectorAll("circle, path")), { draw: ["0 0", "0 1"], duration: 650, delay: stagger(220), ease: "outQuint" });
    };
    form.addEventListener("submit", hide);
    form.addEventListener("form:sent", sent);
    return () => {
      form.removeEventListener("submit", hide);
      form.removeEventListener("form:sent", sent);
    };
  }, []);

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    if (ev.defaultPrevented) return; // system.js found a field to fix
    ev.preventDefault();
    const d = new FormData(ev.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "");
    const slug = get("service");
    const service = services.find((s) => s.slug === slug)?.name ?? slug;
    window.location.href = buildEnquiryMailto({
      name: get("name"),
      email: get("email"),
      country: get("country"),
      service,
      budget: get("budget"),
      source: get("source"),
      message: get("message"),
    });
    setOpened(true);
  }

  return (
    // system.js posts to data-endpoint (/api/enquiry) and shows data-sent / data-failed; the mailto handler and action
    // only run if system.js hasn't loaded or scripts are off.
    <form
      ref={formRef}
      className="form form--pro"
      onSubmit={onSubmit}
      action={`mailto:${ENQUIRY_TO}`}
      method="post"
      encType="text/plain"
      data-endpoint="/api/enquiry"
      data-sent="Sent. We'll reply by email."
      data-failed={`Not sent. Your words are still here; try again, or write to ${ENQUIRY_TO}.`}
    >
      {/* honeypot: hidden from people and from the accessibility tree, with no label or meaningful name, so an AI agent
          filling the visible fields never touches it; spam bots that fill every input do, and the route drops the lead */}
      <div hidden aria-hidden="true">
        <input name="hp_extra" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {/* two groups on the full form (who you are, then the project); the home page's short form is one group */}
      <fieldset className="form__group">
        {compact ? null : <legend className="form__legend">About you</legend>}
        <div className="field">
          <label htmlFor="enq-name">Name</label>
          <input id="enq-name" name="name" type="text" required maxLength={100} autoComplete="name" placeholder="Your full name" aria-describedby="enq-name-err" />
          <p className="field__error" id="enq-name-err" hidden>Write your name.</p>
        </div>
        <div className="field">
          <label htmlFor="enq-email">Email</label>
          <input id="enq-email" name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" placeholder="you@company.com" aria-describedby="enq-email-err" />
          <p className="field__error" id="enq-email-err" hidden>Write an email address with an @, like name@example.com.</p>
        </div>
        {compact ? null : (
          <>
            <div className="field">
              <label htmlFor="enq-country">Country <span className="field__opt">Optional</span></label>
              <input id="enq-country" name="country" type="text" maxLength={100} autoComplete="country-name" placeholder="Where your company is" />
            </div>
            <div className="field">
              <label htmlFor="enq-source">How did you hear about us? <span className="field__opt">Optional</span></label>
              <select id="enq-source" name="source" defaultValue="">
                <option value="">Choose one</option>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        {compact ? <Message compact /> : null}
      </fieldset>
      {compact ? null : (
        <fieldset className="form__group">
          <legend className="form__legend">Your project</legend>
          <div className="field">
            <label htmlFor="enq-service">Service <span className="field__opt">Optional</span></label>
            <select id="enq-service" name="service" defaultValue={initialService}>
              <option value="">Choose a service</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
              <option value={OTHER_SERVICE}>{OTHER_SERVICE}</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="enq-budget">Budget <span className="field__opt">Optional</span></label>
            <select id="enq-budget" name="budget" defaultValue="">
              <option value="">Choose a range</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <Message />
        </fieldset>
      )}
      <div className="form__foot">
        <button type="submit" className="btn btn--primary">Send enquiry</button>
        <p className="t-small muted" aria-live="polite">
          {opened ? `Opening your email app with the message ready. If nothing opens, write to ${ENQUIRY_TO}.` : "We reply by email, and sign your NDA first if you need one."}
        </p>
      </div>
      <div className="form__sent">
        <span ref={tickRef} className="form__tick" aria-hidden="true" hidden>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="m7.5 12.4 3 3 6-6.4" />
          </svg>
        </span>
        <p className="form__status" role="status" data-form-status></p>
      </div>
    </form>
  );
}

// the message, the one field both forms share (its label and size follow the form)
function Message({ compact = false }: { compact?: boolean }) {
  return (
    <div className="field field--full">
      <label htmlFor="enq-message">{compact ? "What do you want to build?" : "Message"}</label>
      <textarea
        id="enq-message"
        name="message"
        required
        maxLength={1000}
        rows={compact ? 4 : 6}
        placeholder="What you want to build, who it is for, and any deadline"
        aria-describedby="enq-message-err"
      />
      <p className="field__error" id="enq-message-err" hidden>Write a message about the project.</p>
    </div>
  );
}
