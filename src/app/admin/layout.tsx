import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

// AntdRegistry writes antd's styles into the server-rendered HTML (no unstyled flash); only /admin loads antd.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="section" id="admin">
      <div className="wrap">
        <AntdRegistry>
          <AdminShell>{children}</AdminShell>
        </AntdRegistry>
      </div>
    </section>
  );
}
