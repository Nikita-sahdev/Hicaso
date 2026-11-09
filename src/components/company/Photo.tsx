import type { CSSProperties } from "react";
import { PHOTO, src, srcSet, type Photo as P } from "./photos";

// A kit photograph in its frame (.frame--photo > img.frame__img), one radius, no caption. Below the fold: lazy.
export default function Photo({ photo, sizes, hero = false, className = "" }: { photo: keyof typeof PHOTO; sizes: string; hero?: boolean; className?: string }) {
  const p: P = PHOTO[photo];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- kit frame photograph, a plain file in /assets
    <img
      className={className}
      src={src(p)}
      srcSet={srcSet(p)}
      sizes={sizes}
      width={1280}
      height={853}
      alt={p.alt}
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : undefined}
      decoding="async"
      data-source="stand-in"
      data-subject="workspace"
      style={{ "--ly-pos": p.pos, objectPosition: p.pos } as CSSProperties}
    />
  );
}
