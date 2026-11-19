import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import Products from "@/components/home/Products";
import HowWeWork from "@/components/common/HowWeWork";
import StackSection from "@/components/home/StackSection";
import Proof from "@/components/home/Proof";
import FAQ from "@/components/common/FAQ";
import EnquiryForm from "@/components/contact/EnquiryForm";
import { services } from "@/data/services";
import { homeFaqs } from "@/data/faqs";
import { WHY } from "@/data/why";
import { listLivePostsSafe } from "@/lib/blog/store";
import { BOOKING_URL, WHATSAPP, httpsLinks, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const BOOKING = httpsLinks([{ url: BOOKING_URL }])[0]?.url;
const WA = whatsappUrl(WHATSAPP);

// the band's headline promise, and the three it backs up as rows
const [TEAM] = WHY.filter((p) => p.title === "Our product team builds yours");
const REST = WHY.filter((p) => p !== TEAM);

// a week on a client project as the kit's notify fragment (assets/ui/notify), drawn still (no data-ui):
// the weekly demo, work ready for review, last demo's notes
const ICON = (id: string) => `<img data-icon="${id}" src="/assets/icons/${id}.svg" alt="">`;
const note = (icon: string, title: string, time: string, body: string) =>
  `<li class="ui-note"><span class="ui-note__ico">${ICON(icon)}</span><span class="ui-note__text"><span class="ui-note__title"><span class="ui-note__name">${title}</span><span class="ui-note__time">${time}</span></span><span class="ui-note__body">${body}</span></span></li>`;
const WEEK = `<div class="stage"><div class="at-rise fit" style="--fit-max:400px;--ax:max(24px, 50% - 200px);--ay:calc(50% - 130px);--ay-sm:32px">
<div class="ui ui-notify"><ul class="ui-notify__list">
  ${note("google-meet", "Weekly demo with your team", "Thu", "This week's build, shown by the people who built it")}
  ${note("github", "Pull request ready for your review", "2h", "Sign-in and payments screens, with their tests")}
  ${note("slack", "Notes from last week's demo", "1d", "Two changes agreed, both in this build")}
</ul></div></div></div>`;

export default async function Home() {
  const posts = await listLivePostsSafe();
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Products />
      {/* the page's one dark band (backgrounds.md: middle of the page, one screen) as the mid-page decision point: one
          promise as the headline (on the container's left, SR-6), a week on a client project beside it, the other three promises as rows, then both
          actions (plain buttons: the hero's SpecularButton stays the page's one pointer effect). Picture left, so the
          band doesn't repeat the text-left splits. No moment of its own: every second moment dealt on 2026-11-18
          clashed with pinned-chapters or the hero button. */}
      <section className="section ground-inverse" id="why" style={{ "--hm": 2 } as React.CSSProperties} aria-labelledby="why-h">
        <div className="wrap stack-6">
          <h2 id="why-h">{TEAM.title}</h2>
          <div className="grid">
            <div
              className="panel span-5"
              role="img"
              aria-label="A week on a client project: the weekly demo, a pull request ready for review, and notes from last week's demo"
              dangerouslySetInnerHTML={{ __html: WEEK }}
            />
            <div className="span-6 start-7 stack-5">
              <p className="t-lead">{TEAM.text}</p>
              <ul className="rows">
                {REST.map((p) => (
                  <li key={p.title}>
                    <span className="rows__name">{p.title}</span>
                    <p>{p.text}</p>
                  </li>
                ))}
              </ul>
              <div className="btn-row">
            <a className="btn btn--primary" href="/contact">Start a project</a>
            {BOOKING ? (
              <a className="btn btn--secondary" href={BOOKING} target="_blank" rel="noopener noreferrer">Book a free 30-minute call</a>
            ) : null}
            {WA ? (
              <a className="link" href={WA} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
            ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
      <HowWeWork />
      <Proof />
      {/* the blog folds into the questions (one split instead of two, no half-empty panel): the newest posts under the lead */}
      <FAQ
        items={homeFaqs}
        lead="How a project starts, NDAs, billing and working hours."
        aside={
          posts.length ? (
            <div className="stack-4">
              <p className="t-card">From the blog</p>
              <ul className="rows">
                {posts.slice(0, 3).map((p) => (
                  <li key={p.slug}>
                    <a className="rows__name link" href={`/blog/${p.slug}`}>{p.headline}</a>
                  </li>
                ))}
              </ul>
              <p className="t-small">
                <a className="link" href="/blog">See every post</a>
              </p>
            </div>
          ) : null
        }
      />
      {/* the short enquiry (name, email, what to build) so nobody has to leave the page to start; the full form is on /contact */}
      <section className="section" id="quick-enquiry" aria-labelledby="quick-h">
        <div className="wrap grid">
          <div className="span-5 stack-5">
            <h2 id="quick-h">Tell us what you want to build</h2>
            <p className="t-lead">Three fields. We reply by email, and we sign your NDA before you share the details.</p>
            <p>
              <a className="link" href="/contact">Use the full form, with service and budget</a>
            </p>
          </div>
          <div className="card span-6 start-7">
            <EnquiryForm services={services.map(({ slug, name }) => ({ slug, name }))} initialService="" compact />
          </div>
        </div>
      </section>
      {/* R5: a text-only FAQ never closes <main>; the stack diagram does. */}
      <StackSection />
    </>
  );
}
