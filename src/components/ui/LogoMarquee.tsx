"use client";

// Based on Lightswind UI's sliding-logo-marquee (lightswind.com): a doubled list slid by -50% for a seamless
// loop, faded edges, pause on hover and a play/pause control. Rewritten as a CSS module without clsx or
// tailwind-merge; the copy set is hidden from screen readers and the keyboard, and reduced motion gets a still row.
import React, { useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./LogoMarquee.module.css";

export interface LogoMarqueeItem {
  id: string;
  content: React.ReactNode;
  href?: string;
}

interface LogoMarqueeProps {
  items: LogoMarqueeItem[];
  /** Seconds for one full pass of the list. */
  duration?: number;
  gap?: string;
  /** Names what moves, for the pause button ("Pause client names"). */
  label?: string;
  className?: string;
}

export function LogoMarquee({ items, duration = 32, gap = "56px", label = "logos", className = "" }: LogoMarqueeProps) {
  const [playing, setPlaying] = useState(true);

  const renderSet = (copy: boolean) => (
    <ul className={styles.list} aria-hidden={copy || undefined}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          {item.href ? (
            <a href={item.href} className={styles.link} tabIndex={copy ? -1 : undefined}>
              {item.content}
            </a>
          ) : (
            item.content
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`${styles.marquee} ${className}`}
      data-playing={playing}
      style={{ "--duration": `${duration}s`, "--gap": gap } as React.CSSProperties}
    >
      <div className={styles.viewport}>
        <div className={styles.track}>
          {renderSet(false)}
          {renderSet(true)}
        </div>
      </div>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setPlaying((p) => !p)}
        aria-label={`${playing ? "Pause" : "Play"} ${label}`}
      >
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
    </div>
  );
}

export default LogoMarquee;
