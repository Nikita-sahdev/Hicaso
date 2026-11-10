import type { ReactNode } from "react";
import ServiceHero from "@/components/services/ServiceHero";
import { notify } from "@/components/services/fragments";
import { ENQUIRY_TO } from "@/lib/enquiry";

// A legal page on the kit: the dealt centred hero (h1, the date, a window with the page's three plain facts),
// one text section (heading left, text right per numbered part), and a closing panel with the contact
// details, so the page ends on a visual (R5). The legal text itself is passed in untouched.
const CONTACT = notify([
  { ico: "tick", title: `Write to ${ENQUIRY_TO}`, time: "", body: "We reply by email" },
  { ico: "tick", title: "Monday to Friday", time: "", body: "9:00 AM to 6:00 PM IST" },
]);

export type LegalPart = { id: string; heading: string; body: ReactNode };

export default function LegalPage({
  h1,
  lead,
  facts,
  label,
  parts,
  closeTitle,
  closeLine,
}: {
  h1: string;
  lead: string;
  facts: [string, string][];
  label: string;
  parts: LegalPart[];
  closeTitle: string;
  closeLine: string;
}) {
  return (
    <>
      <ServiceHero
        h1={h1}
        lead={lead}
        secondary={{ label: "Email us", href: `mailto:${ENQUIRY_TO}` }}
        fragment={notify(facts.map(([title, body]) => ({ ico: "tick", title, time: "", body })))}
        label={label}
        piece="ly-piece--list"
      />

      <section className="section" id="text" aria-label="The full text">
        <div className="wrap">
          <div className="stack-6">
            {parts.map((p) => (
              <div key={p.id} className="grid">
                <h2 className="t-h3 span-4">{p.heading}</h2>
                <div className="span-7 start-6 stack-4 measure">{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section ground-surface" id="questions" aria-labelledby="questions-h">
        <div className="wrap">
          <div className="grid fill">
            <div className="span-5 stack-5">
              <h2 id="questions-h" className="t-h3">{closeTitle}</h2>
              <p className="t-lead">{closeLine}</p>
              <a className="link" href={`mailto:${ENQUIRY_TO}`}>Email {ENQUIRY_TO}</a>
            </div>
            <div className="panel frame--fill span-6 start-7" dangerouslySetInnerHTML={{ __html: CONTACT }} />
          </div>
        </div>
      </section>
    </>
  );
}
