"use client";

import React from "react";
import styles from "./Services.module.css";
import Container from "../ui/Container";
import SectionHeading from "../common/SectionHeading";
import ServiceCard from "../cards/ServiceCard";
import { Monitor, Smartphone, Cloud, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const Services: React.FC = () => {
  const servicesList = [
    {
      variant: "web" as const,
      icon: <Monitor size={24} />,
      title: "Web Development",
      description: "Modern, responsive and high-performance websites built for your business.",
      linkHref: "#web-dev",
    },
    {
      variant: "mobile" as const,
      icon: <Smartphone size={24} />,
      title: "Mobile Development",
      description: "Custom mobile applications that deliver seamless experiences.",
      linkHref: "#mobile-dev",
    },
    {
      variant: "cloud" as const,
      icon: <Cloud size={24} />,
      title: "Cloud Solutions",
      description: "Scalable and secure cloud solutions to accelerate your growth.",
      linkHref: "#cloud-solutions",
    },
    {
      variant: "consulting" as const,
      icon: <TrendingUp size={24} />,
      title: "Digital Consulting",
      description: "Strategic guidance to help you innovate, optimize and achieve more.",
      linkHref: "#digital-consulting",
    },
  ];

  return (
    <section id="services" className={styles.services}>
      <Container>
        <SectionHeading
          badge="What We Do"
          headingText="Services"
          gradientText="We Offer"
        />

        <div className={styles.grid}>
          {servicesList.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            >
              <ServiceCard
                variant={service.variant}
                icon={service.icon}
                title={service.title}
                description={service.description}
                linkHref={service.linkHref}
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Services;
