import type { Metadata } from "next";
import EnquiryForm from "@/components/contact/EnquiryForm";
import Photo from "@/components/company/Photo";
import HowWeWork from "@/components/common/HowWeWork";
import { services } from "@/data/services";
import { ENQUIRY_TO, resolveService } from "@/lib/enquiry";

export const metadata: Metadata = {
  title: "Contact — Hicaso",
  description:
    "Tell Hicaso about your project: AI, mobile or web. Email, phone and address in Chandigarh, India.",
};

// hero (the dealt split hero: words left, a stand-in photograph right) > enquiry (the starter's booking-form beside
// the contact details; /contact?service=<slug> preselects that service) > how (the dealt pinned-chapters, R5).
export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const initialService = resolveService(
    (await searchParams).service,
    services.map((s) => s.slug),
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
              <Photo photo="lamp" sizes="(max-width: 1023px) 100vw, 1100px" hero />
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
                <p><a className="link" href="tel:+917009137936">+91 70091 37936</a></p>
              </li>
              <li>
                <span className="rows__name">Address</span>
                <p>2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh)</p>
              </li>
              <li>
                <span className="rows__name">Hours</span>
                <p>Mon–Fri, 9:00 AM–6:00 PM IST</p>
              </li>
            </ul>
          </div>
          <div className="card span-6 start-7">
            <EnquiryForm
              key={initialService}
              services={services.map(({ slug, name }) => ({ slug, name }))}
              initialService={initialService}
            />
          </div>
        </div>
      </section>

      <HowWeWork />
    </>
  );
}
