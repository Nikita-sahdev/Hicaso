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
import { Smartphone, Cpu, Layers, Bell, WifiOff, Shield } from "lucide-react";

export default function MobileDevelopmentPage() {
  const features = [
    {
      icon: <Smartphone size={24} />,
      title: "iOS & Android Cross-Platform",
      desc: "Single codebase apps built with Flutter and React Native, reducing time-to-market without compromising native performance.",
    },
    {
      icon: <Cpu size={24} />,
      title: "Native Performance Optimization",
      desc: "Hardware-accelerated animations, smooth 60fps rendering, and low battery consumption architecture.",
    },
    {
      icon: <Layers size={24} />,
      title: "Custom UI/UX Design",
      desc: "Tailor-crafted mobile components following iOS Human Interface Guidelines and Material Design 3.",
    },
    {
      icon: <Bell size={24} />,
      title: "Push Notifications & Messaging",
      desc: "Integrated Firebase & Apple Push Notification services for segmented user re-engagement.",
    },
    {
      icon: <WifiOff size={24} />,
      title: "Offline-First Capabilities",
      desc: "Local SQLite/Realm database caching enabling seamless app functionality even without active internet connection.",
    },
    {
      icon: <Shield size={24} />,
      title: "App Store Publishing & Compliance",
      desc: "Complete management of Apple App Store and Google Play Store submissions, guidelines, and automated builds.",
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
                Mobile App Development <br />
                <span className={styles.gradient}>Seamless iOS & Android Apps</span>
              </h1>
              <p className={styles.subtitle}>
                We build intuitive, high-performance mobile applications that deliver rich interactive experiences on iOS and Android devices.
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
              gradientText="Mobile Engineering"
              subtitle="From app conceptualization to App Store release and continuous updates."
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
