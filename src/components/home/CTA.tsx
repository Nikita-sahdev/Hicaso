import React from "react";
import styles from "./CTA.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";

export const CTA: React.FC = () => {
  return (
    <section className={styles.cta}>
      <Container>
        <h2 className="t-heading">Build the next one with us.</h2>
        <div className={styles.actions}>
          <LinkButton href="/careers">See careers</LinkButton>
          <LinkButton href="/contact" variant="outlined">
            Contact us
          </LinkButton>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
