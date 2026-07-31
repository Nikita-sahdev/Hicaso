import React from "react";
import styles from "./Stats.module.css";
import { ClipboardCheck, Star, Award } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export const Stats: React.FC = () => {
  const statsList: StatItem[] = [
    {
      icon: <ClipboardCheck size={20} className={styles.iconElement} />,
      value: "50+",
      label: "Projects Delivered",
    },
    {
      icon: <Star size={20} className={styles.iconElement} />,
      value: "30+",
      label: "Happy Clients",
    },
    {
      icon: <Award size={20} className={styles.iconElement} />,
      value: "5+",
      label: "Years of Experience",
    },
  ];

  return (
    <div className={styles.container}>
      {statsList.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.iconWrapper}>{stat.icon}</div>
          <div className={styles.textWrapper}>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
