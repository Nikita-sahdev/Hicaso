import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { proof, showProof } from "@/data/proof";
import { services } from "@/data/services";

// While proof.demo is true these are SAMPLE case studies: the page exists only in development (404 in a production
// build) and asks search engines not to index it. Real, permissioned cases with demo: false make it public.
export const metadata: Metadata = {
  title: "Case studies — Hicaso",
  description: "Software Hicaso has built for clients: the problem, what we built, and what changed.",
  alternates: { canonical: "/case-studies" },
  ...(proof.demo ? { robots: { index: false, follow: false } } : {}),
};

const serviceName = (slug: string) => services.find((s) => s.slug === slug)?.name ?? "";

export default function CaseStudiesPage() {
  if (!showProof(proof.demo)) notFound();
  return (
    <>
      <section className="section" aria-labelledby="cases-h">
        <div className="wrap stack-6">
          <div className="section-head">
            <h1 id="cases-h">Case studies</h1>
            <p className="t-lead">What clients asked for, what we built, and what changed.</p>
          </div>
          {proof.demo ? <p className="sample-note" role="note">Sample case studies with made-up clients and figures, shown only while the site is in development.</p> : null}
          <div className="grid">
            {proof.caseStudies.map((c) => (
              <article key={c.slug} className="card span-4 stack-3 case-card">
                <p className="t-small muted">{c.industry}, {serviceName(c.service)}</p>
                <h2 className="t-card">
                  <a href={`/case-studies/${c.slug}`}>{c.client}: {c.title}</a>
                </h2>
                <p>{c.summary}</p>
                <dl className="case-card__results">
                  {c.results.slice(0, 2).map((r) => (
                    <div key={r.label}>
                      <dt className="t-small muted">{r.label}</dt>
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
