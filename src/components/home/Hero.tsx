import React from "react";
import styles from "./Hero.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";
import Orb from "../ui/Orb";
import SpecularButton from "../ui/SpecularButton";

// Category plus buyer in 8 words; with balanced wrapping it holds three lines at every width.
const HEADLINE = "AI, mobile and web software for global companies";

export const Hero: React.FC = () => (
  <section className={styles.hero}>
    <Container>
      <div className={styles.grid}>
        <div className={styles.orb}>
          {/* backgroundColor matches the white hero so the shader blends into the page */}
          <Orb
            colors={["#9c43fe", "#4cc2e9", "#101499"]}
            hoverIntensity={1}
            trail={1}
            rotateOnHover
            followCursor
            hue={0}
            size={1}
            glow={1}
            bleed={1}
            wobble={1}
            highlight={1}
            tiltX={0}
            tiltY={0}
            speed={1}
            backgroundColor="#ffffff"
            forceHoverState={false}
            clickPulse
            intro
          />
        </div>
        <div className={styles.content}>
          {/* Each word rises out of its own mask once on load; screen readers read the plain sentence */}
          <h1 className={`t-display ${styles.title}`}>
            {HEADLINE.split(" ").map((word, i) => (
              <React.Fragment key={i}>
                <span className={styles.mask}>
                  <span className={styles.word} style={{ "--i": i } as React.CSSProperties}>
                    {word}
                  </span>
                </span>{" "}
              </React.Fragment>
            ))}
          </h1>
          <p className={`t-subhead ${styles.lead}`}>
            Hicaso is a software company and product studio in India, building generative and
            agentic AI for clients and running products of our own.
          </p>
          <div className={styles.actions}>
            {/* Obsidian fill and white text: the upstream white-glass colours vanish on the white hero */}
            <SpecularButton
              href="/contact"
              size="lg"
              radius={18}
              tint="#09090b"
              tintOpacity={1}
              textColor="#ffffff"
              lineColor="#ffffff"
              baseColor="#525252"
              intensity={1}
              idleIntensity={0.35}
              shineSize={10}
              shineFade={34}
              thickness={1.2}
              glow={1}
              followMouse
              proximity={250}
            >
              Start a project
            </SpecularButton>
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
