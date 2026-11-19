import type { Metadata } from "next";
import EnquiryForm from "@/components/contact/EnquiryForm";
import AskHicaso from "@/components/contact/AskHicaso";
import ProjectPlanner from "@/components/contact/ProjectPlanner";
import Photo from "@/components/company/Photo";
import HowWeWork from "@/components/common/HowWeWork";
import { services } from "@/data/services";

// every service a client can ask for
const ALL = services.map(({ slug, name }) => ({ slug, name }));
import { ENQUIRY_TO, resolveService } from "@/lib/enquiry";
import { BOOKING_URL, PHONE, WHATSAPP, httpsLinks, whatsappUrl } from "@/lib/site";

// each row shows only once configured in src/lib/site.ts
const WA = whatsappUrl(WHATSAPP);
const BOOKING = httpsLinks([{ url: BOOKING_URL }])[0]?.url;

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact — Hicaso",
  description:
    "Tell Hicaso about your project: AI, mobile or web. Email and phone for our team in Chandigarh, India.",
};

// hero (the dealt split hero: words left, a stand-in photograph right) > enquiry (the starter's booking-form beside
// the contact details; /contact?service=<slug> preselects that service) > how (the dealt pinned-chapters, R5).
export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const initialService = resolveService(
    (await searchParams).service,
    ALL.map((s) => s.slug),
  );
  return (
    <>
      <section className="hero hero--split" data-enter aria-labelledby="hero-h">
        <div className="wrap">
          <div className="hero-text grid hero__grid">
            <div className="hero__text span-5">
              <h1 id="hero-h">Start an AI, mobile or web software project</h1>
              <p className="hero__lead">Tell us what you want to build. Hicaso is a software studio in Chandigarh, India, and we reply by email.</p>
              <div className="btn-row">
                <a className="btn btn--primary" href="#enquiry">Start a project</a>
                <a className="btn btn--secondary" href={`mailto:${ENQUIRY_TO}`}>Email us</a>
              </div>
            </div>
            <div className="hero__media span-6 start-7">
              <Photo photo="laptop" sizes="(max-width: 1023px) 100vw, 1100px" hero />
            </div>
          </div>
        </div>
      </section>

      <section className="section g2m" id="enquiry" aria-labelledby="enquiry-h">
        <div className="wrap grid">
          <div className="span-5 stack-5">
            <h2 id="enquiry-h">Send an enquiry</h2>
            <p className="t-lead">Tell us about the project: what it does, who it is for, and when you need it.</p>
            <ul className="rows contact-rows">
              <li>
                <span className="rows__name">Email</span>
                <p><a className="link" href={`mailto:${ENQUIRY_TO}`}>{ENQUIRY_TO}</a></p>
              </li>
              <li>
                <span className="rows__name">Phone</span>
                <p><a className="link" href={`tel:${PHONE.tel}`}>{PHONE.display}</a></p>
              </li>
              {WA ? (
                <li>
                  <span className="rows__name">WhatsApp</span>
                  <p><a className="link" href={WA} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></p>
                </li>
              ) : null}
              {BOOKING ? (
                <li>
                  <span className="rows__name">Book a call</span>
                  <p><a className="link" href={BOOKING} target="_blank" rel="noopener noreferrer">Book a 30-minute call</a></p>
                </li>
              ) : null}
              <li>
                <span className="rows__name">Location</span>
                <p>Chandigarh, India</p>
              </li>
              <li>
                <span className="rows__name">Hours</span>
                <p>Monday to Friday, 9:00 AM to 6:00 PM IST</p>
              </li>
            </ul>
          </div>
          <div className="card span-6 start-7">
            <ProjectPlanner />
            <EnquiryForm
              key={initialService}
              services={ALL}
              initialService={initialService}
            />
          </div>
        </div>
      </section>

      {/* "Ask Hicaso" shows only once the server has an Anthropic key (src/app/api/assistant/route.ts) */}
      {process.env.ANTHROPIC_API_KEY ? (
        <section className="section" id="ask" aria-labelledby="ask-h">
          <div className="wrap stack-6">
            <div className="section-head">
              <h2 id="ask-h">Questions about Hicaso, answered here</h2>
              <p className="t-lead">Not ready to write yet? Ask about our services, products, hours or how a project runs.</p>
            </div>
            <AskHicaso />
          </div>
        </section>
      ) : null}

      <HowWeWork />
    </>
  );
}
