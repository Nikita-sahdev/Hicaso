"use client";

import React from "react";
import styles from "./service-detail.module.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/common/SectionHeading";
import CTA from "@/components/home/CTA";
import { motion } from "framer-motion";
import { Monitor, Layout, Zap, ShieldCheck, Gauge, Search } from "lucide-react";

export default function WebDevelopmentPage() {
  const features = [
    {
      icon: <Monitor size={24} />,
      title: "Custom Web Applications",
      desc: "Tailor-made web solutions engineered with React, Next.js, and TypeScript for high speed and scalabilty.",
    },
    {
      icon: <Layout size={24} />,
      title: "Responsive & Modern UI/UX",
      desc: "Flawlessly rendered user interfaces crafted to provide intuitive experiences across desktop, tablet, and mobile.",
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning-Fast Performance",
      desc: "Optimized asset delivery, server-side rendering, and caching strategies ensuring sub-second load times.",
    },
    {
      icon: <Search size={24} />,
      title: "SEO & Accessibility",
      desc: "Built with semantic HTML, automated meta optimization, and WCAG accessibility standards.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Enterprise Security",
      desc: "Robust authentication, data encryption, CORS protection, and automated security audit compliance.",
    },
    {
      icon: <Gauge size={24} />,
      title: "Scalable Microservices",
      desc: "Decoupled frontend-backend API integration to support millions of concurrent user sessions.",
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className={styles.hero}>
          <Container>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className={styles.badge}>Service Overview</Badge>
              <h1 className={styles.title}>
                Web Development Services <br />
                <span className={styles.gradient}>Built For Scale & Performance</span>
              </h1>
              <p className={styles.subtitle}>
                We build modern, high-performance websites and web applications tailored to your corporate goals. From intuitive UX to secure cloud-backed architectures.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Features */}
        <section className={`${styles.section} ${styles.bgLight}`}>
          <Container>
            <SectionHeading
              badge="Key Capabilities"
              headingText="What We Offer In"
              gradientText="Web Development"
              subtitle="End-to-end engineering excellence from design prototype to cloud deployment."
            />
            <div className={styles.featuresGrid}>
              {features.map((feat, idx) => (
                <motion.div
                  key={feat.title}
                  className={styles.featureCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className={styles.featureIcon}>{feat.icon}</div>
                  <h3 className={styles.featureTitle}>{feat.title}</h3>
                  <p className={styles.featureDesc}>{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
