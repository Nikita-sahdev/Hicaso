"use client";

import React from "react";
import styles from "./Logos.module.css";
import Container from "../ui/Container";
import LogoCard from "../cards/LogoCard";
import { motion } from "framer-motion";

export const Logos: React.FC = () => {
  const brandLogos: Array<"TechNova" | "brightbox" | "CloudWave" | "pixelcraft" | "devio"> = [
    "TechNova",
    "brightbox",
    "CloudWave",
    "pixelcraft",
    "devio",
  ];

  return (
    <section className={styles.logosSection}>
      <Container className={styles.container}>
        <div className={styles.textWrapper}>
          <p className={styles.text}>
            Trusted by<br />
            forward-thinking brands
          </p>
        </div>

        <div className={styles.logosGrid}>
          {brandLogos.map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={styles.logoItem}
            >
              <LogoCard name={brand} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Logos;
