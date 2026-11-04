import React from "react";
import styles from "./Hero.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";

export const Hero: React.FC = () => (
  <section className={styles.hero}>
    <Container>
      <div className={styles.grid}>
        <h1 className={`t-display ${styles.title}`}>
          We build AI, mobile and web software — and ship our own products.
        </h1>
        <div className={styles.side}>
          <p className="t-subhead">
            Hicaso is a software development company and product studio in India, working with
            clients worldwide on generative AI, agentic AI, mobile apps and web platforms.
          </p>
          <div className={styles.actions}>
            <LinkButton href="/contact">Start your project</LinkButton>
            <LinkButton href="/products" variant="light">
              See our products
            </LinkButton>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
