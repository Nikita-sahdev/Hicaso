"use client";

import React from "react";
import styles from "./Hero.module.css";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Hero: React.FC = () => {
  return (
    <section id="home" className={styles.hero}>
      {/* Decorative Blur Backgrounds */}
      <div className={styles.blurIndigo}></div>
      <div className={styles.blurCyan}></div>
      <div className={styles.dotsPattern}></div>

      <Container className={styles.container}>
        <motion.div
          className={styles.leftCol}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge className={styles.heroBadge}>Innovate • Build • Grow</Badge>
          <h1 className={styles.title}>
            Innovative Solutions.<br />
            <span className={styles.gradientText}>Real Impact.</span>
          </h1>
          <p className={styles.subtitle}>
            Hicaso LLP is a forward-thinking technology and consulting partner
            helping businesses transform ideas into powerful digital solutions.
          </p>
          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              className={styles.primaryBtn}
              onClick={() => {
                const el = document.getElementById("services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Our Services
            </Button>
            <Button
              variant="outline"
              className={styles.secondaryBtn}
              icon={<ArrowRight size={16} />}
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Let&apos;s Talk
            </Button>
          </div>
        </motion.div>

        <motion.div
          className={styles.rightCol}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className={styles.imageWrapper}>
            <Image
              src="/images/hero-laptop.png"
              alt="Hicaso Dashboard on Macbook Laptop"
              width={650}
              height={550}
              priority
              className={styles.heroImage}
            />
            {/* Floating badges */}
            <div className={`${styles.floatingBadge} ${styles.floatingUser}`}>
              <div className={styles.badgeIcon}>👤</div>
            </div>
            <div className={`${styles.floatingBadge} ${styles.floatingCheck}`}>
              <div className={styles.badgeIcon}>✓</div>
            </div>
            <div className={`${styles.floatingBadge} ${styles.floatingCode}`}>
              <div className={styles.badgeIcon}>&lt;/&gt;</div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Hero;
