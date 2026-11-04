import type { Metadata } from "next";
import page from "@/styles/page.module.css";
import styles from "./services.module.css";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/LinkButton";
import Eyebrow from "@/components/common/Eyebrow";
import HowWeWork from "@/components/common/HowWeWork";
import ClosingCTA from "@/components/common/ClosingCTA";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services — Hicaso",
  description: "AI, mobile and web software built with clients worldwide.",
};

export default function ServicesPage() {
  return (
    <>
      <section className={page.hero}>
        <Container>
          <Eyebrow>SERVICES</Eyebrow>
          <h1 className="t-display">Software, built with you.</h1>
          <p className="t-subhead">
            AI, mobile and web engineering for clients worldwide, from first prototype to production.
          </p>
        </Container>
      </section>

      <section className={page.section}>
        <Container>
          <div className={styles.list}>
            {services.map((s) => (
              <article key={s.slug} className={styles.card}>
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <h2 className="t-heading">{s.name}</h2>
                <p className={`t-subhead ${styles.tagline}`}>{s.tagline}</p>
                <ul className={styles.offerings}>
                  {s.offerings.slice(0, 4).map((o) => (
                    <li key={o.title}>{o.title}</li>
                  ))}
                </ul>
                <LinkButton href={`/services/${s.slug}`} variant="text">
                  Explore {s.name}
                </LinkButton>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <HowWeWork />
      <ClosingCTA />
    </>
  );
}
