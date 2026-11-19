"use client"; // error boundaries are client components (file-conventions/error.md)

import { useEffect } from "react";
import { ENQUIRY_TO } from "@/lib/enquiry";

// A page failed to render: the header and footer stay, this takes the page's place, in the 404 page's markup.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <section className="section" aria-labelledby="err-h">
      <div className="wrap">
        <div className="section-head stack-5">
          <h1 id="err-h">This page didn&apos;t load</h1>
          <p className="t-lead">
            Something went wrong on our side. Try again, or write to {ENQUIRY_TO} and we&apos;ll reply by email.
          </p>
          <div className="btn-row">
            <button className="btn btn--primary" type="button" onClick={() => retry()}>Try again</button>
            <a className="btn btn--secondary" href="/">See the home page</a>
          </div>
        </div>
      </div>
    </section>
  );
}
