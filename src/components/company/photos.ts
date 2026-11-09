// Stand-in photographs (public/assets/photos, from photos.mjs search; each is listed in the Task 7 report with the
// shot that replaces it). One warm wood-desk grade across the three. Alt text is written new: the file titles name
// someone else's place.
export const PHOTO = {
  monitor: { id: "f58856453", alt: "A monitor, keyboard and mouse on a wooden desk by a window", pos: "50% 55%" },
  lamp: { id: "f61802100", alt: "A desk lamp, a monitor and a drawing tablet on a cork desk", pos: "50% 60%" },
  hands: { id: "f61715796", alt: "Hands on a laptop keyboard at a dark wooden table, a phone and a cup beside it", pos: "62% 50%" },
} as const;

export type Photo = (typeof PHOTO)[keyof typeof PHOTO];
export const src = (p: Photo, w?: 500 | 960) => `/assets/photos/photo-${p.id}${w ? `-${w}` : ""}.jpg`;
export const srcSet = (p: Photo) => `${src(p, 500)} 500w, ${src(p, 960)} 960w, ${src(p)} 1280w`;
