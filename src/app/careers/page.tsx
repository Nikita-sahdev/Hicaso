"use client";

import React from "react";
import styles from "./careers.module.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/ui/Button";
import CTA from "@/components/home/CTA";
import { motion } from "framer-motion";
import { Globe, HeartHandshake, Rocket, GraduationCap, MapPin, Clock, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const perks = [
    {
      icon: <Globe size={24} />,
      title: "Remote-First Culture",
      desc: "Work from anywhere in the world with flexible hours and high autonomy.",
    },
    {
      icon: <Rocket size={24} />,
      title: "High Impact Projects",
      desc: "Solve challenging technical problems for fast-growing global startups and brands.",
    },
    {
      icon: <GraduationCap size={24} />,
      title: "Learning Stipend",
      desc: "Annual budget for courses, tech conferences, and certifications to upgrade your skills.",
    },
    {
      icon: <HeartHandshake size={24} />,
      title: "Health & Wellness",
      desc: "Comprehensive health insurance coverage and wellness allowances for you and your family.",
    },
  ];

  const positions = [
    {
      title: "Senior Full Stack Engineer",
      type: "Full-Time",
      location: "Remote / Hybrid",
      dept: "Engineering",
    },
    {
      title: "Lead UI/UX Product Designer",
      type: "Full-Time",
      location: "Remote",
      dept: "Design",
    },
    {
      title: "DevOps & Cloud Architect",
      type: "Full-Time",
      location: "Ahmedabad / Hybrid",
      dept: "Infrastructure",
    },
    {
      title: "Mobile Engineer (React Native / Flutter)",
      type: "Full-Time",
      location: "Remote",
      dept: "Mobile",
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
              <Badge className={styles.badge}>Join Our Team</Badge>
              <h1 className={styles.title}>
                Build The Future Of Technology <br />
                <span className={styles.gradient}>With Hicaso LLP</span>
              </h1>
              <p className={styles.subtitle}>
                We are looking for creative thinkers, passionate coders, and visionary designers to help us craft world-class software.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Perks Section */}
        <section className={`${styles.section} ${styles.bgLight}`}>
          <Container>
            <SectionHeading
              badge="Life at Hicaso"
              headingText="Why You Will Love"
              gradientText="Working With Us"
              subtitle="We cultivate a supportive, transparent, and growth-oriented environment."
            />
            <div className={styles.perksGrid}>
              {perks.map((perk, idx) => (
                <motion.div
                  key={perk.title}
                  className={styles.perkCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className={styles.perkIcon}>{perk.icon}</div>
                  <h3 className={styles.perkTitle}>{perk.title}</h3>
                  <p className={styles.perkDesc}>{perk.desc}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Open Positions */}
        <section className={styles.section}>
          <Container>
            <SectionHeading
              badge="Open Roles"
              headingText="Explore Current"
              gradientText="Job Openings"
              subtitle="Find your next career opportunity and apply today."
            />

            <div className={styles.jobsList}>
              {positions.map((job, idx) => (
                <motion.div
                  key={job.title}
                  className={styles.jobCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <div className={styles.jobInfo}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <div className={styles.jobMeta}>
                      <span className={styles.metaItem}>
                        <Clock size={15} className="text-indigo-600" />
                        {job.type}
                      </span>
                      <span className={styles.metaItem}>
                        <MapPin size={15} className="text-indigo-600" />
                        {job.location}
                      </span>
                      <span className="font-semibold text-indigo-600">
                        {job.dept}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    icon={<ArrowRight size={15} />}
                    onClick={() => alert(`Applying for ${job.title}`)}
                  >
                    Apply Position
                  </Button>
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
