import type { Metadata } from "next";
import ServiceHero from "@/components/services/ServiceHero";
import { notify } from "@/components/services/fragments";
import Photo from "@/components/company/Photo";
import { PHOTO, src } from "@/components/company/photos";

export const metadata: Metadata = {
  title: "Careers — Hicaso",
  description: "Work at Hicaso, a small team that builds software for clients worldwide and runs its own products.",
};

const MAIL = "mailto:hello@hicaso.com?subject=Working%20at%20Hicaso";

// the hero's window: the three working terms of the old page, as the kit's notify list (each with its own fact)
const HERO = notify([
  { ico: "tick", title: "We work remotely", time: "IST", body: "Monday to Friday, 9:00 AM to 6:00 PM" },
  { ico: "tick", title: "We own what we make", time: "", body: "We run AppKavo and BillMinute ourselves" },
  { ico: "tick", title: "We keep the bar high", time: "", body: "We still want to see your work" },
]);

// hero (the dealt centred hero) > roles (giant-type-pass, the dealt moment: "No open roles" with a photograph
// showing through the letters) > team (text beside a photograph, R5).
export default function CareersPage() {
  return (
    <>
      <ServiceHero
        h1="Careers at a software studio in Chandigarh"
        lead="We are a small team that builds software for clients worldwide and runs our own products. We work remotely, own what we make, and keep the bar high."
        secondary={{ label: "See our products", href: "/products" }}
        fragment={HERO}
        label="Three ways Hicaso works: remotely, owning what it makes, and keeping the bar high"
        piece="ly-piece--list"
        contactHref={MAIL}
        primaryLabel="Send your work"
      />

      <section
        className="section statement"
        id="roles"
        data-moment="giant-type-pass"
        data-moment-opts={JSON.stringify({ image: src(PHOTO.hands), travel: 60 })}
        aria-labelledby="roles-h"
      >
        <div className="wrap">
          <h2 id="roles-h" className="mo-gt__type">No open roles</h2>
          <div className="mo-gt__row">
            <p>No open roles right now. We still want to see your work.</p>
            <a className="link" href={MAIL}>Send your work</a>
          </div>
        </div>
      </section>

      <section className="section ground-surface" id="team" aria-labelledby="team-h">
        <div className="wrap">
          <div className="grid">
            <div className="span-5 stack-5">
              <h2 id="team-h">A small team with two products of its own</h2>
              <p className="t-lead">
                We build software for clients worldwide and run AppKavo and BillMinute ourselves. The same team works on both.
              </p>
              <p>We work Monday to Friday, 9:00 AM to 6:00 PM IST, and you see working software every week.</p>
              <a className="link" href="/products">See our products</a>
            </div>
            <div className="frame frame--photo frame--split span-6 start-7">
              <Photo photo="code" className="frame__img" sizes="(max-width: 1023px) 100vw, 628px" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
