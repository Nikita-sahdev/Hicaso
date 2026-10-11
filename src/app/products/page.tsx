import type { Metadata } from "next";
import styles from "./products.module.css";
import Container from "@/components/ui/Container";
import ProductPanel from "@/components/products/ProductPanel";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products — Hicaso",
  description: `Software built and run by Hicaso: ${products.map((p) => p.name).join(", ")}.`,
};

export default function ProductsPage() {
  return (
    <>
      <section className={styles.intro}>
        <Container>
          <h1 className={`t-display ${styles.title}`}>Products.</h1>
          <p className="t-subhead">Built and run by Hicaso.</p>
        </Container>
      </section>
      <section className={styles.list} aria-labelledby="all-products">
        <Container wide>
          <h2 id="all-products" className="sr-only">
            All products
          </h2>
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductPanel key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
