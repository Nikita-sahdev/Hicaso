"use client";

import { useState, type FormEvent } from "react";
import btn from "@/components/ui/LinkButton.module.css";
import styles from "./EnquiryForm.module.css";
import { BUDGETS, OTHER_SERVICE, buildEnquiryMailto } from "@/lib/enquiry";

type Props = { services: { slug: string; name: string }[]; initialService: string };

export default function EnquiryForm({ services, initialService }: Props) {
  const [length, setLength] = useState(0);
  const [sent, setSent] = useState(false);

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
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
    setSent(true);
  }

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      action="mailto:hello@hicaso.com"
      method="post"
      encType="text/plain"
    >
      <div className={styles.field}>
        <label htmlFor="enq-name">Name</label>
        <input id="enq-name" name="name" required autoComplete="name" />
      </div>
      <div className={styles.field}>
        <label htmlFor="enq-email">Email</label>
        <input id="enq-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className={styles.field}>
        <label htmlFor="enq-country">Country</label>
        <input id="enq-country" name="country" autoComplete="country-name" />
      </div>
      <div className={styles.field}>
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
      <div className={styles.field}>
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
      <div className={styles.field}>
        <label htmlFor="enq-message">Message</label>
        <textarea
          id="enq-message"
          name="message"
          required
          maxLength={1000}
          rows={6}
          aria-describedby="enq-count"
          onChange={(e) => setLength(e.target.value.length)}
        />
        <span id="enq-count" className={`${styles.count} t-caption`}>
          {length}/1000
        </span>
      </div>
      <div>
        <button type="submit" className={`${btn.button} ${btn.filled}`}>
          Send enquiry
        </button>
      </div>
      <p role="status" className={styles.note}>
        {sent &&
          "Your email app should open with the message ready. If it didn't, email hello@hicaso.com directly."}
      </p>
    </form>
  );
}
