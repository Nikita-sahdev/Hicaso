import React from "react";
import styles from "./HowWeWork.module.css";
import Container from "../ui/Container";
import Eyebrow from "./Eyebrow";

const steps = [
  { n: "01", title: "Discover", text: "We learn your goals, users and constraints, and agree on what to build first." },
  { n: "02", title: "Design", text: "We shape the flows and screens with you before code, so changes stay cheap." },
  { n: "03", title: "Build", text: "We build in short cycles and show you working software in weekly demos." },
  { n: "04", title: "Launch and support", text: "We ship to production or the app stores and stay on to fix and improve." },
];

export const HowWeWork: React.FC = () => (
  <section className={styles.section} aria-labelledby="how-title">
    <Container>
      <Eyebrow>HOW WE WORK</Eyebrow>
      <h2 id="how-title" className={`t-heading ${styles.title}`}>
        From first call to launch
      </h2>
      <ol className={styles.steps}>
        {steps.map((s) => (
          <li key={s.n} className={styles.step}>
            <span className="t-eyebrow">{s.n}</span>
            <h3 className="t-subheading">{s.title}</h3>
            <p className="t-subhead">{s.text}</p>
          </li>
        ))}
      </ol>
    </Container>
  </section>
);

export default HowWeWork;
