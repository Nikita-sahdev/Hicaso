import React from "react";
import styles from "./CTA.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";

export const CTA: React.FC = () => {
  return (
    <section className={styles.section}>
      <Container wide>
        <div className={styles.card}>
          <h2 className={`t-display ${styles.title}`}>Build the next one with us.</h2>
          <div className={styles.actions}>
            <LinkButton href="/careers">See careers</LinkButton>
            <LinkButton href="/contact" variant="text">
              Contact us
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
