import React from "react";
import styles from "./Principles.module.css";
import Container from "../ui/Container";

const principles = [
  { title: "Small and sharp.", body: "Each product does one job well." },
  { title: "Run, not just launched.", body: "We keep operating and improving what we ship." },
  { title: "Your data stays yours.", body: "Clear pricing, honest limits, and export when you want it." },
];

export const Principles: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="principles-title">
      <Container>
        <h2 id="principles-title" className="t-heading">
          How we build
        </h2>
        <dl className={styles.list}>
          {principles.map((p) => (
            <div key={p.title}>
              <dt className="t-subheading">{p.title}</dt>
              <dd className={styles.body}>{p.body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
};

export default Principles;
