import React from "react";
import Link from "next/link";
import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link href="/" className={`${styles.logo} ${className}`}>
      <div className={styles.iconWrapper}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#00d2c4" />
            </linearGradient>
          </defs>
          <rect x="8" y="6" width="7" height="28" rx="3.5" fill="url(#logoGradient)" />
          <rect x="25" y="6" width="7" height="28" rx="3.5" fill="url(#logoGradient)" />
          <path
            d="M13 15C13 15 18 16.5 20 20C22 23.5 27 25 27 25"
            stroke="url(#logoGradient)"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className={styles.textWrapper}>
        <span className={styles.brandName}>HICASO</span>
        <span className={styles.subtext}>LLP</span>
      </div>
    </Link>
  );
};

export default Logo;
