"use client";

import React from "react";
import styles from "./services.module.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/common/SectionHeading";
import ServicesSection from "@/components/home/Services";
import CTA from "@/components/home/CTA";
import { motion } from "framer-motion";
import { Code, Server, Smartphone, Cpu, ShieldCheck, Zap } from "lucide-react";

export default function ServicesPage() {
  const processSteps = [
    { num: "01", title: "Discovery & Strategy", desc: "We analyze your business goals, user needs, and market opportunities to define clear roadmaps." },
    { num: "02", title: "Architecture & Design", desc: "Crafting scalable system architectures and intuitive, modern UI/UX experiences." },
    { num: "03", title: "Agile Development", desc: "Building robust, high-performance web and mobile applications using modern tech stacks." },
    { num: "04", title: "Deploy & Scale", desc: "Seamless cloud deployment, continuous monitoring, and automated performance optimization." },
  ];

  const techStack = [
    { icon: <Code size={28} />, name: "Next.js & React" },
    { icon: <Smartphone size={28} />, name: "Flutter & React Native" },
    { icon: <Server size={28} />, name: "Node.js & Python" },
    { icon: <Cpu size={28} />, name: "AWS & Google Cloud" },
    { icon: <ShieldCheck size={28} />, name: "Cybersecurity" },
    { icon: <Zap size={28} />, name: "AI & ML Integration" },
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
              <Badge className={styles.badge}>Our Expertise</Badge>
              <h1 className={styles.title}>
                Comprehensive Digital & Cloud Services <br />
                <span className={styles.gradient}>To Scale Your Business</span>
              </h1>
              <p className={styles.subtitle}>
                We combine deep technical mastery with forward-thinking design to craft bespoke software, 
                mobile apps, and cloud infrastructures tailored to modern enterprise needs.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Main Services Grid */}
        <ServicesSection />

        {/* Our Process Section */}
        <section className={`${styles.section} ${styles.bgLight}`}>
          <Container>
            <SectionHeading
              badge="How We Work"
              headingText="Our Proven"
              gradientText="Development Process"
              subtitle="From initial concept to deployment and beyond, we ensure quality and transparency at every phase."
            />
            <div className={styles.processGrid}>
              {processSteps.map((step, idx) => (
                <motion.div
                  key={step.num}
                  className={styles.processCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <span className={styles.stepNum}>{step.num}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Tech Stack */}
        <section className={styles.section}>
          <Container>
            <SectionHeading
              badge="Technologies"
              headingText="Powered By"
              gradientText="Modern Tech Stack"
              subtitle="We leverage cutting-edge tools and frameworks to guarantee speed, security, and scalability."
            />
            <div className={styles.techGrid}>
              {techStack.map((tech, idx) => (
                <motion.div
                  key={tech.name}
                  className={styles.techItem}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <div className="mb-2 text-indigo-600">{tech.icon}</div>
                  <span>{tech.name}</span>
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
