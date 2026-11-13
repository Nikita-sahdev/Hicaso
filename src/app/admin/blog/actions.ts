"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import { createPost, deletePost, publishPost, savePost, unpublishPost, type SaveResult } from "@/lib/blog/store";
import type { PostFields, Problem } from "@/lib/blog/post";

// Not exported: with "use server" every export is a callable action.
function refreshSite() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
}

const KEYS = ["slug", "headline", "seoTitle", "description", "category", "body"] as const;
const bad = (field: Problem["field"], message: string): SaveResult => ({ ok: false, problems: [{ field, message }] });

// Actions can be POSTed directly, so nothing is trusted: the store only ever sees strings.
function parseFields(f: unknown): PostFields | null {
  if (!f || typeof f !== "object") return null;
  const o = f as Record<string, unknown>;
  if (!KEYS.every((k) => typeof o[k] === "string")) return null;
  return Object.fromEntries(KEYS.map((k) => [k, o[k]])) as PostFields;
}

export async function createPostAction(fd: FormData) {
  await requireAdmin();
  const raw = fd instanceof FormData ? fd.get("headline") : null;
  const headline = typeof raw === "string" ? raw.trim() : "";
  // A refused headline sends the owner back to the list with nothing written.
  if (!headline || headline.length > 200 || /[\r\n]/.test(headline)) redirect("/admin/blog");
  const r = await createPost(headline);
  if (!r.ok) redirect("/admin/blog");
  refreshSite();
  redirect(`/admin/blog/${r.post.id}`);
}

export async function savePostAction(id: string, f: PostFields): Promise<SaveResult> {
  await requireAdmin();
  const fields = parseFields(f);
  if (typeof id !== "string" || !fields) return bad("headline", "That request was not understood.");
  const r = await savePost(id, fields);
  if (r.ok) refreshSite();
  return r;
}

export async function publishPostAction(id: string, f: PostFields, atIso?: string): Promise<SaveResult> {
  await requireAdmin();
  const fields = parseFields(f);
  if (typeof id !== "string" || !fields) return bad("headline", "That request was not understood.");
  let at: Date | undefined;
  if (atIso !== undefined && atIso !== null) {
    at = typeof atIso === "string" ? new Date(atIso) : new Date(NaN);
    if (Number.isNaN(at.getTime())) return bad("publishAt", "Pick a valid date and time.");
  }
  const saved = await savePost(id, fields);
  if (!saved.ok) return saved;
  const r = await publishPost(id, at);
  refreshSite();
  return r;
}

export async function unpublishPostAction(id: string): Promise<void> {
  await requireAdmin();
  if (typeof id !== "string") return;
  await unpublishPost(id);
  refreshSite();
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  if (typeof id === "string") await deletePost(id);
  refreshSite();
  redirect("/admin/blog");
}
