import React from "react";
import Link from "next/link";
import styles from "./LinkButton.module.css";

interface LinkButtonProps {
  href: string;
  variant?: "filled" | "outlined" | "text";
  children: React.ReactNode;
}

// Pill-shaped link (or underlined text link). Internal paths use next/link; http(s) opens in a new tab.
export const LinkButton: React.FC<LinkButtonProps> = ({ href, variant = "filled", children }) => {
  const className = `${styles.button} ${styles[variant]}`;

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
      {external && (
        <>
          <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
};

export default LinkButton;
