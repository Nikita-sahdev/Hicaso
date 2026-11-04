import React from "react";
import styles from "./FAQ.module.css";
import Container from "../ui/Container";

export const FAQ: React.FC<{ items: { q: string; a: string }[]; title?: string }> = ({
  items,
  title = "Questions, answered",
}) => (
  <section className={styles.section} aria-labelledby="faq-title">
    <Container>
      <h2 id="faq-title" className={`t-heading ${styles.title}`}>
        {title}
      </h2>
      <div className={styles.list}>
        {items.map((item) => (
          <details key={item.q} className={styles.item}>
            <summary className={`t-subheading ${styles.summary}`}>{item.q}</summary>
            <p className={`t-subhead ${styles.answer}`}>{item.a}</p>
          </details>
        ))}
      </div>
    </Container>
  </section>
);

export default FAQ;
