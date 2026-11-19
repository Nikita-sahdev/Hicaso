import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudy, proof, showProof } from "@/data/proof";
import { services } from "@/data/services";

// One case study (src/data/proof.ts). SAMPLE while proof.demo is true: development only, never indexed.
export function generateStaticParams() {
  return showProof(proof.demo) ? proof.caseStudies.map((c) => ({ slug: c.slug })) : [];
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const c = getCaseStudy((await params).slug);
  if (!c || !showProof(proof.demo)) return {};
  return {
    title: `${c.client}: ${c.title} — Hicaso`,
    description: c.summary,
    alternates: { canonical: `/case-studies/${c.slug}` },
    ...(proof.demo ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const c = getCaseStudy((await params).slug);
  if (!c || !showProof(proof.demo)) notFound();
  const service = services.find((s) => s.slug === c.service);
  const quote = proof.testimonials.find((t) => t.company === c.client);
  return (
    <>
      <section className="section" id="case-hero" aria-labelledby="case-h">
        <div className="wrap stack-6">
          <p><a className="link" href="/case-studies">All case studies</a></p>
          <div className="section-head">
            <h1 id="case-h">{c.client}: {c.title}</h1>
            <p className="t-lead">{c.summary}</p>
          </div>
          {proof.demo ? <p className="sample-note" role="note">A sample case study: the client, the quote and the figures are made up for the layout.</p> : null}
          <ul className="rows">
            <li><span className="rows__name">Industry</span><p>{c.industry}</p></li>
            <li><span className="rows__name">Service</span><p>{service ? <a className="link" href={`/services/${service.slug}`}>{service.name}</a> : null}</p></li>
            <li><span className="rows__name">Platforms</span><p>{c.platforms.join(", ")}</p></li>
            <li><span className="rows__name">Built with</span><p>{c.stack.join(", ")}</p></li>
            <li><span className="rows__name">Time to launch</span><p>{c.duration}</p></li>
          </ul>
        </div>
      </section>

      <section className="section ground-surface" aria-labelledby="case-work-h">
        <div className="wrap grid">
          <div className="span-5 stack-4">
            <h2 id="case-work-h">The problem</h2>
            <p>{c.challenge}</p>
          </div>
          <div className="span-6 start-7 stack-4">
            <h2>What we built</h2>
            <ul className="stack-3 case-built">
              {c.built.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="case-results-h">
        <div className="wrap stack-6">
          <h2 id="case-results-h">What changed</h2>
          <dl className="stats">
            {c.results.map((r) => (
              <div key={r.label}>
                <dt className="t-small muted">{r.label}</dt>
                <dd className="t-stat">{r.value}</dd>
              </div>
            ))}
          </dl>
          {quote ? (
            <figure className="quote case-quote">
              <blockquote>{quote.quote}</blockquote>
              <figcaption className="t-small muted">{quote.name}, {quote.role}, {quote.company}</figcaption>
            </figure>
          ) : null}
          <div className="btn-row">
            <a className="btn btn--primary" href={`/contact?service=${c.service}`}>Start a similar project</a>
          </div>
        </div>
      </section>
    </>
  );
}
