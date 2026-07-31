"use client";

import React from "react";
import styles from "./About.module.css";
import Container from "../ui/Container";
import SectionHeading from "../common/SectionHeading";
import Stats from "./Stats";
import Button from "../ui/Button";
import Image from "next/image";
import { motion } from "framer-motion";

export const About: React.FC = () => {
  return (
    <section id="about" className={styles.about}>
      <Container className={styles.container}>
        <motion.div
          className={styles.leftCol}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionHeading
            badge="About Us"
            headingText="We are"
            gradientText="Hicaso LLP"
            align="left"
            className={styles.heading}
          />
          <p className={styles.description}>
            We are a team of passionate developers, designers and consultants dedicated to
            delivering innovative solutions that drive business success. Our focus is
            quality, transparency and long-term partnership.
          </p>

          <div className={styles.statsWrapper}>
            <Stats />
          </div>

          <Button variant="primary" className={styles.aboutBtn}>
            Know More About Us
          </Button>
        </motion.div>

        <motion.div
          className={styles.rightCol}
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <div className={styles.imageWrapper}>
            <Image
              src="/images/about-team.png"
              alt="Hicaso Team collaborating in office"
              width={600}
              height={450}
              className={styles.aboutImage}
            />
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default About;
