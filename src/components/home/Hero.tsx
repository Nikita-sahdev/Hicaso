import React from "react";
import styles from "./Hero.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <Container wide>
        <h1 className={`t-display ${styles.title}`}>We build software products.</h1>
        <p className={`t-subhead ${styles.subtitle}`}>
          Hicaso is a product studio. We build, launch and run independent software — each one
          held to the same standard.
        </p>
        <div className={styles.actions}>
          <LinkButton href="/products">Explore products</LinkButton>
          <LinkButton href="/about" variant="text">
            About the studio
          </LinkButton>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
