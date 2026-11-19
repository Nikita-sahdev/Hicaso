"use client";

import { OPEN_EVENT } from "./Analytics";

// Footer link that reopens the cookie banner, so a visitor can change their choice later.
export default function ConsentLink() {
  return (
    <button type="button" className="consent-link" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
