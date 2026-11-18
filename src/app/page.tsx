import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import Products from "@/components/home/Products";
import HowWeWork from "@/components/common/HowWeWork";
import StackSection from "@/components/home/StackSection";
import Proof from "@/components/home/Proof";
import FAQ from "@/components/common/FAQ";
import { homeFaqs } from "@/data/faqs";
import { WHY } from "@/data/why";
import { listLivePostsSafe } from "@/lib/blog/store";
import { BOOKING_URL, WHATSAPP, httpsLinks, whatsappUrl } from "@/lib/site";

const BOOKING = httpsLinks([{ url: BOOKING_URL }])[0]?.url;
const WA = whatsappUrl(WHATSAPP);

export default async function Home() {
  const posts = await listLivePostsSafe();
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Products />
      {/* the page's one dark band (backgrounds.md: middle of the page, one screen) as the mid-page decision point: the
          four promises across one row, then both actions (plain buttons: the hero's SpecularButton stays the page's one
          pointer effect). No moment of its own: every second moment dealt on 2026-11-18 clashed with pinned-chapters
          or the hero button, and counter-rolls needs proof figures the page does not have yet. */}
      <section className="section ground-inverse" id="why" aria-labelledby="why-h">
        <div className="wrap stack-6">
          <div className="section-head">
            <h2 id="why-h">Built by a product team</h2>
            <p className="t-lead">AppKavo and BillMinute, our own products, run on the stack we use for clients.</p>
          </div>
          <div className="grid">
            {WHY.map((p) => (
              <div key={p.title} className="span-3 stack-2">
                <p className="t-card">{p.title}</p>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
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
              <p>
                <a className="link" href="/blog">See every post</a>
              </p>
            </div>
          ) : null
        }
      />
      {/* R5: a text-only FAQ never closes <main>; the stack diagram does. */}
      <StackSection />
    </>
  );
}
