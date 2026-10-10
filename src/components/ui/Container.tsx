import React from "react";
import styles from "./Container.module.css";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
  as?: "div" | "section" | "header" | "footer" | "main";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  wide = false,
  as: Component = "div",
}) => {
  return (
    <Component className={`${styles.container} ${wide ? styles.wide : ""} ${className}`}>
      {children}
    </Component>
  );
};

export default Container;
