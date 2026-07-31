import React from "react";
import styles from "./SectionHeading.module.css";
import Badge from "../ui/Badge";

interface SectionHeadingProps {
  badge?: string;
  headingText: string;
  gradientText?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  headingText,
  gradientText,
  subtitle,
  align = "center",
  className = "",
}) => {
  return (
    <div className={`${styles.wrapper} ${styles[align]} ${className}`}>
      {badge && <Badge className={styles.badge}>{badge}</Badge>}
      <h2 className={styles.heading}>
        {headingText}{" "}
        {gradientText && <span className={styles.gradient}>{gradientText}</span>}
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
