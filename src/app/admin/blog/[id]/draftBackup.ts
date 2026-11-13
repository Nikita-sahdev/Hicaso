import type { PostFields } from "../../../../lib/blog/post.ts";

export type Backup = { fields: PostFields; savedAt: number; serverUpdatedAt: string };

const KEYS: (keyof PostFields)[] = ["slug", "headline", "seoTitle", "description", "category", "body"];

export const backupKey = (postId: string) => `hicaso-draft:${postId}`;

export const isDirty = (current: PostFields, saved: PostFields) => KEYS.some((k) => current[k] !== saved[k]);

// An offer is made only for a backup that differs from the server copy. `savedSince` means
// the post was saved after the backup was taken (its updatedAt moved on).
export function backupOffer(b: Backup | null, server: PostFields, serverUpdatedAt: string): { savedSince: boolean } | null {
  if (!b || !isDirty(b.fields, server)) return null;
  return { savedSince: b.serverUpdatedAt !== serverUpdatedAt };
}
