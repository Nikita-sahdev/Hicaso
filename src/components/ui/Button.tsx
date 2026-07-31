import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "text";
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  icon,
  iconPosition = "right",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && <span className={styles.iconLeft}>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className={styles.iconRight}>{icon}</span>}
    </button>
  );
};

export default Button;
