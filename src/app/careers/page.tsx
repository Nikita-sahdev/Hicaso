import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";

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
          <div className={styles.prose}>
            <h2>Open roles</h2>
            <p>
              No open roles right now. Send your work to{" "}
              <a href="mailto:hello@hicaso.com?subject=Working%20at%20Hicaso">hello@hicaso.com</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
