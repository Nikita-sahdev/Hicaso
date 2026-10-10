import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";
import Principles from "@/components/common/Principles";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "About — Hicaso",
  description:
    "Hicaso is a product studio in Chandigarh, India. We build, launch and run independent software products.",
};

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">A product studio.</h1>
          <p className="t-subhead">
            Hicaso builds, launches and runs independent software products. The common thread is
            quality, not audience.
          </p>
        </Container>
      </section>

      <Principles />

      <section className={styles.section}>
        <Container>
          <h2 className={`t-heading-sm ${styles.heading}`}>The company</h2>
          <dl className={styles.facts}>
            <div>
              <dt>Legal name</dt>
              <dd>Hicaso LLP</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>Chandigarh, India</dd>
            </div>
            <div>
              <dt>Products</dt>
              <dd>{products.map((p) => p.name).join(", ")}</dd>
            </div>
          </dl>
        </Container>
      </section>
    </>
  );
}
