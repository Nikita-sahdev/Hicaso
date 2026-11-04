import React from "react";

export const Eyebrow: React.FC<{ children: React.ReactNode; onDark?: boolean }> = ({
  children,
  onDark = false,
}) => (
  <p className="t-eyebrow" style={{ color: onDark ? "var(--color-paper)" : "var(--color-ink)" }}>
    {children}
  </p>
);

export default Eyebrow;
