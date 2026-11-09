import type { Metadata } from "next";
import Photo from "@/components/company/Photo";

export const metadata: Metadata = {
  title: "About — Hicaso",
  description: "Hicaso is a software development company and product studio in Chandigarh, India.",
};

// The true points of the old "Why Hicaso" block (home/WhyHicaso, now deleted), in their old wording.
const POINTS = [
  { title: "You own the code and IP", text: "Once the project is paid for, the code, designs and IP are yours." },
  { title: "Our product team builds yours", text: "The people who ship AppKavo and BillMinute work on your project." },
  { title: "Weekly demos", text: "You see working software every week, not just status updates." },
  { title: "Hours that overlap with Europe and the Middle East", text: "We work Monday to Friday, 9:00 AM to 6:00 PM IST." },
];

// The figures are counts from the data files and the working week the old pages state (counter-rolls, the dealt moment).
const FIGURES = [
  { n: "4", label: "services: generative AI, agentic AI, mobile and web" },
  { n: "2", label: "products we run ourselves" },
  { n: "5", label: "days a week, Monday to Friday, 9:00 AM to 6:00 PM IST" },
];

// hero (the dealt film hero: a stand-in photograph, its words in a solid box, no play control as there is no film)
// > studio (text, links and the counter-rolls row beside a photograph) > why (four points beside a photograph, R5).
export default function AboutPage() {
  return (
    <>
      <section className="hero hero--film" data-enter aria-labelledby="hero-h">
        <div className="wrap">
          <div className="hero-text hero__in">
            <div className="hero__media hero__fill">
              <Photo photo="laptop" sizes="(max-width: 639px) 280vw, (max-width: 1439px) 100vw, 1280px" hero />
              <div className="hero__over">
                <div>
                  <h1 id="hero-h">Software company in Chandigarh</h1>
                  <p className="hero__lead">
                    Hicaso LLP builds AI, mobile and web software in India for clients worldwide, and runs two products of its own.
                  </p>
                  <div className="btn-row">
                    <a className="btn btn--primary" href="/contact">Start a project</a>
                    <a className="btn btn--secondary" href="/services">See our services</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="studio" style={{ "--hm": 2 } as React.CSSProperties} aria-labelledby="studio-h">
        <div className="wrap">
          <div className="grid">
            <div className="span-5 stack-5">
              <h2 id="studio-h">Client work and our own products</h2>
              <p className="t-lead">
                We build generative AI, agentic AI, mobile and web software for clients, from first idea to launch and beyond.
              </p>
              <ul className="rows">
                <li>
                  <span className="rows__name">Services</span>
                  <span className="rows__value"><a className="link" href="/services">See our services</a></span>
                  <p>Four services, from a first prototype to production.</p>
                </li>
                <li>
                  <span className="rows__name">Products</span>
                  <span className="rows__value"><a className="link" href="/products">See our products</a></span>
                  <p>AppKavo and BillMinute, built and run by the same team that works on client projects.</p>
                </li>
              </ul>
            </div>
            <div className="frame frame--photo frame--split span-6 start-7">
              <Photo photo="code" className="frame__img" sizes="(max-width: 1023px) 100vw, 628px" />
            </div>
          </div>
          <dl className="stats" data-moment="counter-rolls">
            {FIGURES.map((f) => (
              <div key={f.label}>
                <dt className="t-small muted">{f.label}</dt>
                <dd className="t-stat">{f.n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section ground-surface" id="why" style={{ "--hm": 2 } as React.CSSProperties} aria-labelledby="why-h">
        <div className="wrap">
          <div className="grid">
            <div className="span-5 stack-5">
              <h2 id="why-h">Ownership, demos and working hours</h2>
              <ul className="rows">
                {POINTS.map((p) => (
                  <li key={p.title}>
                    <span className="rows__name">{p.title}</span>
                    <p>{p.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="frame frame--photo frame--split span-6 start-7">
              <Photo photo="hands" className="frame__img" sizes="(max-width: 1023px) 100vw, 628px" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
