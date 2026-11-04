import React from "react";
import styles from "./ClosingCTA.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";
import Eyebrow from "./Eyebrow";

export const ClosingCTA: React.FC<{ title?: string; href?: string }> = ({
  title = "Tell us what you want to build.",
  href = "/contact",
}) => (
  <section className={styles.section}>
    <Container wide>
      <div className={styles.panel}>
        <Eyebrow onDark>START A PROJECT</Eyebrow>
        <h2 className={`t-heading ${styles.title}`}>{title}</h2>
        <p className={`t-subhead ${styles.copy}`}>Share a few details and we&apos;ll reply by email.</p>
        <LinkButton href={href} variant="onDark">
          Start your project
        </LinkButton>
      </div>
    </Container>
  </section>
);

export default ClosingCTA;
