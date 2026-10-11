import React from "react";
import { Crosshair, Rocket, ShieldCheck } from "lucide-react";
import styles from "./Principles.module.css";
import Container from "../ui/Container";

const principles = [
  { icon: Crosshair, title: "Small and sharp.", body: "Each product does one job well." },
  { icon: Rocket, title: "Run, not just launched.", body: "We keep operating and improving what we ship." },
  { icon: ShieldCheck, title: "Your data stays yours.", body: "Clear pricing, honest limits, and export when you want it." },
];

export const Principles: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="principles-title">
      <Container wide>
        <h2 id="principles-title" className="t-heading">
          How we build
        </h2>
        <dl className={styles.list}>
          {principles.map(({ icon: Icon, title, body }) => (
            <div key={title} className={styles.item}>
              <Icon size={24} strokeWidth={1.75} aria-hidden="true" className={styles.icon} />
              <dt className="t-subheading">{title}</dt>
              <dd className={styles.body}>{body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
};

export default Principles;
