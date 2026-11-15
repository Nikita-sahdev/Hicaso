import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";

export default async function AdminHome() {
  await requireAdmin();
  redirect("/admin/blog");
}
