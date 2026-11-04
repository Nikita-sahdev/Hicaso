import React from "react";
import styles from "./Products.module.css";
import Container from "../ui/Container";
import Eyebrow from "../common/Eyebrow";
import ProductPanel from "../products/ProductPanel";
import { products } from "@/data/products";

export const Products: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="products-title">
      <Container>
        <div className={styles.head}>
          <Eyebrow>PRODUCT STUDIO</Eyebrow>
          <h2 id="products-title" className={`t-heading ${styles.title}`}>
            We also build our own.
          </h2>
          <p className="t-subhead">
            The same team that builds for clients designs, ships and runs these products.
          </p>
        </div>
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
