// Stand-in photographs (public/assets/photos, from photos.mjs search; each is listed in the Task 7 report with the
// shot that replaces it). One warm wood-desk grade across the three. Alt text is written new: the file titles name
// someone else's place.
export const PHOTO = {
  laptop: { id: "f194319915", alt: "A hand on a laptop trackpad beside a spiral notebook on a wooden desk", pos: "60% 55%" },
  code: { id: "f62049414", alt: "Lines of code in colour on a monitor, seen at an angle", pos: "50% 50%", max: 960 },
  hands: { id: "f61715796", alt: "Hands on a laptop keyboard at a dark wooden table, a phone and a cup beside it", pos: "62% 50%" },
} as const;

export type Photo = { id: string; alt: string; pos: string; max?: 960 };
export const src = (p: Photo, w?: 500 | 960, ext: "jpg" | "webp" = "jpg") =>
  `/assets/photos/photo-${p.id}${w ?? p.max ? `-${w ?? p.max}` : ""}.${ext}`;
// the srcset offers the WebP copies (about half the bytes; every current browser reads WebP); src stays the JPEG
export const srcSet = (p: Photo) =>
  `${src(p, 500, "webp")} 500w, ${src(p, 960, "webp")} 960w${p.max ? "" : `, ${src(p, undefined, "webp")} 1280w`}`;
