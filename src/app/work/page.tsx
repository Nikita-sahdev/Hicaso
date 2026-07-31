"use client";

import React from "react";
import styles from "./work.module.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import CTA from "@/components/home/CTA";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Layers } from "lucide-react";

export default function WorkPage() {
  const projects = [
    {
      category: "Fintech Platform",
      title: "Fintech NextGen Portal",
      desc: "AI-driven automated wealth management and real-time portfolio analytics dashboard for enterprise investment firms.",
      tags: ["Next.js", "TypeScript", "Python AI", "AWS"],
    },
    {
      category: "E-Commerce",
      title: "OmniMarket Global Store",
      desc: "High-throughput multi-vendor e-commerce platform processing thousands of sub-second orders globally.",
      tags: ["React", "Node.js", "GraphQL", "Redis"],
    },
    {
      category: "Cloud Infrastructure",
      title: "CloudSync Orchestration",
      desc: "Multi-cloud resource automation tool providing automated scaling, cost control, and vulnerability patching.",
      tags: ["Kubernetes", "Docker", "Go", "AWS"],
    },
    {
      category: "Healthcare",
      title: "HealthPulse Telehealth",
      desc: "HIPAA-compliant video consultation & automated health records suite built for enterprise medical networks.",
      tags: ["React Native", "WebRTC", "Node.js", "PostgreSQL"],
    },
    {
      category: "Logistics IoT",
      title: "LogiTrack Supply Chain",
      desc: "Real-time IoT telemetry platform monitoring cold-chain shipping logistics across 12 countries.",
      tags: ["Next.js", "Tailwind CSS", "IoT API", "MQTT"],
    },
    {
      category: "EdTech Platform",
      title: "EduVerse Interactive Learning",
      desc: "Collaborative live classroom & assessment platform serving over 500,000 active students.",
      tags: ["React", "WebSockets", "Tailwind CSS", "GCP"],
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className="flex-grow">
        {/* Page Hero */}
        <section className={styles.hero}>
          <Container>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className={styles.badge}>Our Work</Badge>
              <h1 className={styles.title}>
                Transformative Digital Solutions & <br />
                <span className={styles.gradient}>Case Studies</span>
              </h1>
              <p className={styles.subtitle}>
                Explore how we have engineered scalable platforms and digital experiences for forward-thinking startups and global enterprises.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Projects Showcase */}
        <section className={styles.section}>
          <Container>
            <div className={styles.projectsGrid}>
              {projects.map((project, idx) => (
                <motion.div
                  key={project.title}
                  className={styles.projectCard}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className={styles.projectHeader}>
                    <span className={styles.projectCategory}>{project.category}</span>
                    <Layers size={48} className="text-indigo-400 opacity-40" />
                  </div>
                  <div className={styles.projectBody}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDesc}>{project.desc}</p>
                    <div className={styles.tagRow}>
                      {project.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                    <a href="#view" className={styles.projectLink}>
                      <span>Explore Case Study</span>
                      <ArrowRight size={15} />
                    </a>
                  </div>
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
