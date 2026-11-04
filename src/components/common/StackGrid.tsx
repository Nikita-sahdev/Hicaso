import React from "react";
import styles from "./StackGrid.module.css";

export const StackGrid: React.FC<{ groups: { group: string; items: string[] }[] }> = ({
  groups,
}) => (
  <div className={styles.grid}>
    {groups.map((g) => (
      <div key={g.group} className={styles.row}>
        <p className={`t-eyebrow ${styles.label}`}>{g.group}</p>
        <ul className={styles.cells}>
          {g.items.map((item) => (
            <li key={item} className={`t-subheading ${styles.cell}`}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default StackGrid;
