import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getPool } from "@/lib/db";
import { sessionUser } from "@/lib/admin/accounts";
import { ADMIN_COOKIE } from "@/lib/admin/guard";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!getPool()) notFound();
  if (await sessionUser((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin/blog");
  return (
    <>
      <h1>Sign in</h1>
      <LoginForm />
    </>
  );
}
