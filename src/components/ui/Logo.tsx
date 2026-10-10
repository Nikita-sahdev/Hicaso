import React from "react";
import Link from "next/link";
import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link href="/" className={`${styles.logo} ${className}`} aria-label="Hicaso home">
      <svg viewBox="0 0 40 40" fill="none" className={styles.mark} aria-hidden="true">
        <rect x="8" y="6" width="7" height="28" rx="3.5" fill="currentColor" />
        <rect x="25" y="6" width="7" height="28" rx="3.5" fill="currentColor" />
        <path
          d="M13 15C13 15 18 16.5 20 20C22 23.5 27 25 27 25"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.name}>Hicaso</span>
    </Link>
  );
};

export default Logo;
