"use client";

import { useState, type FormEvent } from "react";
import { BUDGETS, ENQUIRY_TO, OTHER_SERVICE, buildEnquiryMailto } from "@/lib/enquiry";

type Props = { services: { slug: string; name: string }[]; initialService: string };

// The starter's booking-form (system.md, Forms): kit .form/.field markup, a label above every field, each error under
// its field. system.js checks the fields on submit (aria-invalid and the reason in .field__error, the focus on the first);
// this handler then opens the visitor's mail app with the message ready. With scripts off the form still posts to its
// mailto: action. The mailto stand-in shows no success line: the note under the button only says what opens.
export default function EnquiryForm({ services, initialService }: Props) {
  const [opened, setOpened] = useState(false);

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
      message: get("message"),
    });
    setOpened(true);
  }

  return (
    // system.js posts to data-endpoint (/api/enquiry) and shows data-sent / data-failed; the mailto handler and action
    // only run if system.js hasn't loaded or scripts are off.
    <form
      className="form"
      onSubmit={onSubmit}
      action={`mailto:${ENQUIRY_TO}`}
      method="post"
      encType="text/plain"
      data-endpoint="/api/enquiry"
      data-sent="Sent. We'll reply by email."
      data-failed={`Not sent: the connection failed. Your words are still here; try again, or write to ${ENQUIRY_TO}.`}
    >
      {/* honeypot: hidden from people, bots fill it and the route drops the lead */}
      <div hidden aria-hidden="true">
        <label htmlFor="enq-website">Website</label>
        <input id="enq-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor="enq-name">Name</label>
        <input id="enq-name" name="name" type="text" required autoComplete="name" aria-describedby="enq-name-err" />
        <p className="field__error" id="enq-name-err" hidden>Write your name.</p>
      </div>
      <div className="field">
        <label htmlFor="enq-email">Email</label>
        <input id="enq-email" name="email" type="email" required autoComplete="email" inputMode="email" aria-describedby="enq-email-err" />
        <p className="field__error" id="enq-email-err" hidden>Write an email address with an @, like name@example.com.</p>
      </div>
      <div className="field">
        <label htmlFor="enq-country">Country</label>
        <input id="enq-country" name="country" type="text" autoComplete="country-name" />
      </div>
      <div className="field">
        <label htmlFor="enq-service">Service</label>
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
      <div className="field field--full">
        <label htmlFor="enq-budget">Budget</label>
        <select id="enq-budget" name="budget" defaultValue="">
          <option value="">Choose a range</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="field field--full">
        <label htmlFor="enq-message">Message</label>
        <textarea id="enq-message" name="message" required maxLength={1000} rows={5} aria-describedby="enq-message-err" />
        <p className="field__error" id="enq-message-err" hidden>Write a message about the project.</p>
      </div>
      <div className="btn-row">
        <button type="submit" className="btn btn--primary">Send enquiry</button>
      </div>
      <p className="form__status" role="status" data-form-status></p>
      <p className="t-small muted" aria-live="polite">
        {opened ? `Opening your email app with the message ready. If nothing opens, write to ${ENQUIRY_TO}.` : "We reply by email."}
      </p>
    </form>
  );
}
