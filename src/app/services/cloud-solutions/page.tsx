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
import { Cloud, Server, ShieldCheck, Database, RefreshCw, Cpu } from "lucide-react";

export default function CloudSolutionsPage() {
  const features = [
    {
      icon: <Cloud size={24} />,
      title: "AWS & GCP Cloud Architecture",
      desc: "Designing resilient multi-region cloud infrastructures tailored to enterprise availability and disaster recovery needs.",
    },
    {
      icon: <Server size={24} />,
      title: "DevOps & CI/CD Automation",
      desc: "Automated deployment pipelines with GitHub Actions and Terraform to deliver rapid software releases safely.",
    },
    {
      icon: <Cpu size={24} />,
      title: "Kubernetes & Containerization",
      desc: "Docker containerization and Kubernetes orchestration guaranteeing automatic auto-scaling under spike traffic.",
    },
    {
      icon: <Database size={24} />,
      title: "Database Optimization & Migration",
      desc: "Zero-downtime database migration and performance tuning for PostgreSQL, Redis, and DynamoDB.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Cloud Governance & Security",
      desc: "IAM permission enforcement, secret management, compliance auditing, and continuous vulnerability scanning.",
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Cost Optimization & Monitoring",
      desc: "Detailed infrastructure usage monitoring reducing cloud spend by up to 40% through rightsizing.",
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
                Cloud Solutions & Infrastructure <br />
                <span className={styles.gradient}>Accelerate Enterprise Growth</span>
              </h1>
              <p className={styles.subtitle}>
                We architect, migrate, and manage secure cloud infrastructures that power mission-critical operations with 99.99% uptime.
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
              gradientText="Cloud Architecture"
              subtitle="End-to-end DevOps automation, security compliance, and cloud migration."
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
