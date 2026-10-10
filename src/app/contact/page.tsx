"use client";

import React, { useState } from "react";
import styles from "./contact.module.css";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! Your message has been received. We will get back to you shortly.`);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
              <Badge className={styles.badge}>Get In Touch</Badge>
              <h1 className={styles.title}>
                Let&apos;s Start Your <br />
                <span className={styles.gradient}>Next Big Project</span>
              </h1>
              <p className={styles.subtitle}>
                Have a question or looking to build a new solution? Our engineering and consulting experts are ready to turn your vision into reality.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Contact Form & Info Grid */}
        <section className={styles.section}>
          <Container>
            <div className={styles.contactGrid}>
              {/* Form */}
              <motion.div
                className={styles.formCard}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className={styles.formTitle}>Send Us A Message</h2>
                <p className={styles.formDesc}>Fill out the form below and we will respond within 24 hours.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.rowTwo}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Your Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="Web Development Consultation"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Message *</label>
                    <textarea
                      required
                      placeholder="Tell us about your project requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={styles.textarea}
                    />
                  </div>

                  <Button type="submit" variant="primary" icon={<Send size={16} />} className={styles.submitBtn}>
                    Send Message
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className={styles.infoCard}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className={styles.infoTitle}>Contact Information</h2>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><Mail size={22} /></div>
                    <div>
                      <div className={styles.infoLabel}>Email Us</div>
                      <div className={styles.infoText}>hello@hicaso.com</div>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><Phone size={22} /></div>
                    <div>
                      <div className={styles.infoLabel}>Call Us</div>
                      <div className={styles.infoText}>+91 70091 37936</div>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><MapPin size={22} /></div>
                    <div>
                      <div className={styles.infoLabel}>Our Location</div>
                      <div className={styles.infoText}>2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh)</div>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}><Clock size={22} /></div>
                    <div>
                      <div className={styles.infoLabel}>Working Hours</div>
                      <div className={styles.infoText}>Mon - Fri: 9:00 AM - 6:00 PM IST</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
}
