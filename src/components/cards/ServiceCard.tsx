import React from "react";
import styles from "./ServiceCard.module.css";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkHref: string;
  variant: "web" | "mobile" | "cloud" | "consulting";
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  linkHref,
  variant,
}) => {
  const iconClass = styles[`icon_${variant}`] || "";

  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrapper} ${iconClass}`}>
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <Link href={linkHref} className={styles.link}>
        <span className={styles.linkText}>Learn More</span>
        <ArrowRight size={15} className={styles.arrow} />
      </Link>
    </div>
  );
};

export default ServiceCard;
