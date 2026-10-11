import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/LinkButton";

export const metadata: Metadata = {
  title: "Careers — Hicaso",
  description: "Work at Hicaso, a product studio that builds and runs its own software products.",
};

export default function CareersPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">Careers</h1>
          <p className="t-subhead">
            We&apos;re a small team that builds, ships and runs its own products. We work
            remotely, own what we make, and keep the bar high.
          </p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={`${styles.card} ${styles.tinted} ${styles.prose}`}>
            <h2>Open roles</h2>
            <p>No open roles right now. We still want to see your work.</p>
            <div className={styles.actions}>
              <LinkButton href="mailto:hello@hicaso.com?subject=Working%20at%20Hicaso">
                Send your work
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
