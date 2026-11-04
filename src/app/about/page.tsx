import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import aboutStyles from "./about.module.css";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/LinkButton";
import Eyebrow from "@/components/common/Eyebrow";
import WhyHicaso from "@/components/home/WhyHicaso";
import { products } from "@/data/products";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "About — Hicaso",
  description: "Hicaso is a software development company and product studio in Chandigarh, India.",
};

export default function AboutPage() {
  const productNames = products.map((p) => p.name);
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <Eyebrow>ABOUT</Eyebrow>
          <h1 className="t-display">A software company that ships its own products.</h1>
          <p className="t-subhead">
            Hicaso is a software development company and product studio in Chandigarh, India. We
            work with clients worldwide.
          </p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={aboutStyles.cards}>
            <div className={aboutStyles.card}>
              <h2 className="t-heading-sm">Services</h2>
              <p>
                We build generative AI, agentic AI, mobile and web software for clients worldwide,
                from first idea to launch and beyond.
              </p>
              <LinkButton href="/services" variant="text">
                See our services
              </LinkButton>
            </div>
            <div className={aboutStyles.card}>
              <h2 className="t-heading-sm">Product studio</h2>
              <p>
                We also build and run our own products: {productNames.join(" and ")}. The same team
                works on client projects.
              </p>
              <LinkButton href="/products" variant="text">
                See our products
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>

      <WhyHicaso />

      <section className={styles.section}>
        <Container>
          <h2 className={`t-heading-sm ${styles.heading}`}>The company</h2>
          <dl className={`${styles.card} ${styles.facts}`}>
            <div>
              <dt>Legal name</dt>
              <dd>Hicaso LLP</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>Chandigarh, India</dd>
            </div>
            <div>
              <dt>Clients</dt>
              <dd>Worldwide</dd>
            </div>
            <div>
              <dt>Services</dt>
              <dd>{services.map((s) => s.name).join(", ")}</dd>
            </div>
            <div>
              <dt>Products</dt>
              <dd>{productNames.join(", ")}</dd>
            </div>
          </dl>
        </Container>
      </section>
    </>
  );
}
