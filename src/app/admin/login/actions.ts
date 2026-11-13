"use server";

import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getPool } from "@/lib/db";
import { DUMMY_HASH, verifyPassword } from "@/lib/admin/password";
import { createSession, deleteSession, findAdmin } from "@/lib/admin/accounts";
import {
  beginAttempt,
  clearFailures,
  clientIp,
  forgetAttempt,
  trustProxyHops,
} from "@/lib/admin/loginLimit";
import { ADMIN_COOKIE } from "@/lib/admin/guard";

const WRONG = "Email or password is wrong.";
const LIMITED = "Too many attempts. Try again in 15 minutes.";
const MAX_LEN = 200;

export async function loginAction(
  _prev: { error?: string },
  fd: FormData,
): Promise<{ error?: string }> {
  if (!getPool()) notFound();
  const email = fd.get("email");
  const password = fd.get("password");
  const ip = clientIp((await headers()).get("x-forwarded-for"), trustProxyHops(process.env.TRUST_PROXY));
  const valid =
    typeof email === "string" && typeof password === "string" &&
    email.length <= MAX_LEN && password.length <= MAX_LEN;

  // The attempt is recorded before anything else, so parallel requests all count.
  const a = await beginAttempt(ip, valid ? email : "");
  // A refused attempt is not a failure: dropping its row keeps the lock from extending while the owner retries.
  if (a.limited) {
    await forgetAttempt(a.id);
    return { error: LIMITED };
  }
  if (!valid) return { error: WRONG };

  const user = await findAdmin(email);
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { error: WRONG };

  await forgetAttempt(a.id);
  await clearFailures(email);
  const { token, expiresAt } = await createSession(user.id);
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    expires: expiresAt,
  });
  redirect("/admin/blog");
}

// Not behind requireAdmin: it deletes only the caller's own token, and must work once the session has expired.
export async function logoutAction(): Promise<void> {
  if (!getPool()) notFound();
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token) await deleteSession(token);
  jar.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/admin", maxAge: 0 });
  redirect("/admin/login");
}
