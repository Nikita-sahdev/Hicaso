import React from "react";
import styles from "./ServicesGrid.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";
import Eyebrow from "../common/Eyebrow";
import { services } from "@/data/services";

export const ServicesGrid: React.FC = () => (
  <section className={styles.section} aria-labelledby="services-title">
    <Container wide>
      <Eyebrow>SERVICES</Eyebrow>
      <h2 id="services-title" className={`t-heading ${styles.title}`}>
        What we build for clients
      </h2>
      <div className={styles.grid}>
        {services.map((s) => (
          <article key={s.slug} className={styles.card}>
            <p className="t-eyebrow">{s.eyebrow}</p>
            <h3 className="t-heading-sm">{s.name}</h3>
            <p className="t-subhead">{s.tagline}</p>
            <LinkButton href={`/services/${s.slug}`} variant="text">
              Explore
            </LinkButton>
          </article>
        ))}
      </div>
      <div className={styles.all}>
        <LinkButton href="/services" variant="text">
          View all services
        </LinkButton>
      </div>
    </Container>
  </section>
);

export default ServicesGrid;
