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
import { TrendingUp, Compass, Cpu, PieChart, ShieldAlert, Users } from "lucide-react";

export default function DigitalConsultingPage() {
  const features = [
    {
      icon: <TrendingUp size={24} />,
      title: "Digital Transformation Roadmap",
      desc: "Comprehensive technology audit and strategic roadmap definition to modernize legacy systems and workflow bottlenecks.",
    },
    {
      icon: <Compass size={24} />,
      title: "Technology Stack Advisory",
      desc: "Expert guidance on selecting the optimal frameworks, cloud providers, and third-party APIs for long-term viability.",
    },
    {
      icon: <Cpu size={24} />,
      title: "AI & Automation Strategy",
      desc: "Identifying opportunities to integrate machine learning models, predictive analytics, and process automation.",
    },
    {
      icon: <PieChart size={24} />,
      title: "Performance & Scalability Audits",
      desc: "Deep-dive code reviews, load testing, and query profiling to unblock scalability bottlenecks before product launch.",
    },
    {
      icon: <ShieldAlert size={24} />,
      title: "Security & Regulatory Compliance",
      desc: "Assessing data privacy frameworks (GDPR, HIPAA, SOC2) and implementing zero-trust security postures.",
    },
    {
      icon: <Users size={24} />,
      title: "Agile Team Mentorship & Training",
      desc: "Upskilling internal development teams with modern DevOps workflows, CI/CD pipelines, and clean architecture standards.",
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
                Digital Consulting Services <br />
                <span className={styles.gradient}>Strategic Guidance To Innovate</span>
              </h1>
              <p className={styles.subtitle}>
                We partner with C-suite executives and engineering leaders to navigate complex technology transformations, optimize workflows, and capture market leadership.
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
              gradientText="Strategic Consulting"
              subtitle="Actionable insights, architecture reviews, and transformative technology strategies."
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
