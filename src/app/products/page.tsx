import type { Metadata } from "next";
import styles from "./products.module.css";
import Container from "@/components/ui/Container";
import ProductTile from "@/components/products/ProductTile";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products — Hicaso",
  description: `Software built and run by Hicaso: ${products.map((p) => p.name).join(", ")}.`,
};

export default function ProductsPage() {
  return (
    <section className={styles.page}>
      <Container wide>
        <div className={styles.intro}>
          <h1 className="t-display">Products.</h1>
          <p className="t-subhead">Built and run by Hicaso.</p>
        </div>
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductTile key={p.slug} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
