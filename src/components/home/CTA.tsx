"use client";

import React from "react";
import styles from "./CTA.module.css";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const CTA: React.FC = () => {
  return (
    <section id="contact" className={styles.ctaSection}>
      <Container>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className={styles.textCol}>
            <h2 className={styles.title}>Ready to start your next project?</h2>
            <p className={styles.subtitle}>Let&apos;s build something amazing together.</p>
          </div>

          <div className={styles.illustrationCol}>
            <Image
              src="/images/cta-paperplane.png"
              alt="Flying Paper Plane Illustration"
              width={160}
              height={160}
              className={styles.paperplane}
            />
          </div>

          <div className={styles.actionCol}>
            <Button
              variant="outline"
              className={styles.ctaButton}
              icon={<ArrowRight size={16} />}
              onClick={() => alert("Get in touch request sent! Thank you.")}
            >
              Get in Touch
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTA;
