import React from "react";
import styles from "./Proof.module.css";
import Container from "../ui/Container";
import Eyebrow from "../common/Eyebrow";
import LinkButton from "../ui/LinkButton";
import LogoMarquee from "../ui/LogoMarquee";
import { proof, showProof } from "@/data/proof";
import { getService } from "@/data/services";

const visible = showProof(proof.demo);

export const ClientStrip: React.FC = () =>
  visible ? (
    <section className={styles.strip} aria-label="Clients">
      <Container>
        <div className={styles.stripRow}>
          <p className={styles.stripLabel}>Teams we have built for</p>
          <LogoMarquee
            label="client names"
            items={proof.clients.map((name) => ({
              id: name,
              content: <span className={styles.client}>{name}</span>,
            }))}
          />
        </div>
      </Container>
    </section>
  ) : null;

export const Stats: React.FC = () =>
  visible ? (
    <section className={styles.section} aria-label="Hicaso in numbers">
      <Container>
        <dl className={styles.stats}>
          {proof.stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <dt className="t-caption">{s.label}</dt>
              <dd className={styles.statValue}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  ) : null;

export const CaseStudies: React.FC = () =>
  visible ? (
    <section className={styles.section} aria-labelledby="work-title">
      <Container>
        <Eyebrow>SELECTED WORK</Eyebrow>
        <h2 id="work-title" className={`t-heading ${styles.title}`}>
          Built for clients
        </h2>
        <ul className={styles.cases}>
          {proof.caseStudies.map((c) => (
            <li key={c.client} className={styles.case}>
              <p className="t-eyebrow">{c.industry}</p>
              <h3 className="t-heading-sm">{c.client}</h3>
              <p className={styles.summary}>{c.summary}</p>
              <dl className={styles.meta}>
                <div>
                  <dt>Platforms</dt>
                  <dd>{c.platforms.join(", ")}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>{c.stack.join(", ")}</dd>
                </div>
              </dl>
              <LinkButton href={`/services/${c.service}`} variant="text">
                {getService(c.service)?.name ?? "Our services"}
              </LinkButton>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  ) : null;

export const Testimonials: React.FC = () =>
  visible ? (
    <section className={styles.section} aria-labelledby="voices-title">
      <Container>
        <Eyebrow>CLIENTS</Eyebrow>
        <h2 id="voices-title" className={`t-heading ${styles.title}`}>
          What clients say
        </h2>
        <ul className={styles.quotes}>
          {proof.testimonials.map((t) => (
            <li key={t.name}>
              <figure className={styles.quote}>
                <blockquote>
                  <p>“{t.quote}”</p>
                </blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  <span>
                    {t.role}, {t.company}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  ) : null;
