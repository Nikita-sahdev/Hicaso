"use client";

import React from "react";
import styles from "./about.module.css";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/common/SectionHeading";
import AboutSection from "@/components/home/About";
import CTA from "@/components/home/CTA";
import { motion } from "framer-motion";
import { Lightbulb, Target, Users, ShieldAlert } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Lightbulb size={24} />,
      title: "Continuous Innovation",
      desc: "We stay ahead of technological trends to provide our clients with future-proof digital solutions.",
    },
    {
      icon: <Target size={24} />,
      title: "Results-Oriented",
      desc: "Our focus is always on delivering measurable business impact, ROI, and user satisfaction.",
    },
    {
      icon: <Users size={24} />,
      title: "Client Partnership",
      desc: "We operate as an extension of your internal team with absolute transparency and clear communication.",
    },
    {
      icon: <ShieldAlert size={24} />,
      title: "Uncompromising Quality",
      desc: "From code architecture to visual design, we enforce strict standards of excellence.",
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div>
        {/* Page Hero */}
        <section className={styles.hero}>
          <Container>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className={styles.badge}>Who We Are</Badge>
              <h1 className={styles.title}>
                Driven By Innovation. <br />
                <span className={styles.gradient}>Guided By Excellence.</span>
              </h1>
              <p className={styles.subtitle}>
                Hicaso LLP was founded with a singular mission: to empower organizations worldwide by crafting elegant, scalable, and impactful technology solutions.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Main About Section */}
        <AboutSection />

        {/* Core Values */}
        <section className={`${styles.section} ${styles.bgLight}`}>
          <Container>
            <SectionHeading
              badge="Our Ethos"
              headingText="The Core Values That"
              gradientText="Define Us"
              subtitle="Everything we build is rooted in a culture of accountability, creativity, and technical discipline."
            />
            <div className={styles.valuesGrid}>
              {values.map((val, idx) => (
                <motion.div
                  key={val.title}
                  className={styles.valueCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className={styles.iconWrapper}>{val.icon}</div>
                  <h3 className={styles.valueTitle}>{val.title}</h3>
                  <p className={styles.valueDesc}>{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        <CTA />
      </div>
    </div>
  );
}
