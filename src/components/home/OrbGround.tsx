"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroArt.module.css";
import Orb from "../ui/Orb";

// The kit's ui.js, loaded as the plain file system.js and layout.js already use (one module instance).
const KIT_UI = "/assets/ui/ui.js";

// The hero's lit ground: the Orb, with the pause control every visual moving past 5 s needs.
// The control is the kit's own disc (ui.pausable): one per frame, at the [data-ui-pause-host]'s
// bottom-right, shared with the result card's loop, labelled "Pause animation" / "Play animation",
// and never shown under reduced motion or on a phone (the Orb is still there).
export default function OrbGround({ background }: { background: string }) {
  // a phone holds every effect on its finished picture (motion.md, as system.js does with kit grounds),
  // so the Orb draws once there and needs no disc over the window's chips. paused never reaches the
  // markup, so the server's false cannot mismatch.
  // ponytail: read once on mount; a desktop window resized under 640px keeps moving (with its disc)
  const [phone] = useState(() => typeof window !== "undefined" && matchMedia("(max-width: 639px)").matches);
  const [paused, setPaused] = useState(phone);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phone) return;
    const host = ref.current?.closest<HTMLElement>("[data-ui-pause-host]");
    if (!host) return;
    let off = () => {};
    let live = true;
    import(/* webpackIgnore: true */ KIT_UI).then(({ default: ui }) => {
      if (live) off = ui.pausable(host, { pause: () => setPaused(true), resume: () => setPaused(false) });
    });
    return () => {
      live = false;
      off();
    };
  }, [phone]);

  return (
    <div ref={ref} className={styles.ground} aria-hidden="true">
      <Orb
        colors={["#9c43fe", "#4cc2e9", "#101499"]}
        hoverIntensity={1}
        trail={1}
        rotateOnHover
        followCursor
        hue={0}
        size={1.3}
        glow={1}
        bleed={1}
        wobble={1}
        highlight={1}
        tiltX={0}
        tiltY={0}
        speed={1}
        backgroundColor={background}
        forceHoverState={false}
        clickPulse
        intro
        paused={paused}
      />
    </div>
  );
}
