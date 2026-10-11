import React from "react";
import styles from "./Products.module.css";
import Container from "../ui/Container";
import ProductPanel from "../products/ProductPanel";
import { products } from "@/data/products";

export const Products: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="products-title">
      <Container wide>
        <h2 id="products-title" className={`t-heading ${styles.title}`}>
          Our products
        </h2>
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductPanel key={p.slug} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Products;
