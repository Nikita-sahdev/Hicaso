import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getPool } from "../db.ts";
import { sessionUser } from "./accounts.ts";

export const ADMIN_COOKIE = "hicaso_admin";

// Every admin page and server action calls this first.
export async function requireAdmin(): Promise<{ id: number; email: string }> {
  // cookies() first: it makes every caller dynamic, so a build without a pool cannot prerender a static 404.
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!getPool()) notFound();
  const user = await sessionUser(token);
  if (!user) redirect("/admin/login");
  return user;
}
