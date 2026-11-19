"use client";

import { usePathname } from "next/navigation";
import { App, Button, ConfigProvider, Flex, Menu } from "antd";
import { logoutAction } from "./login/actions";

// Ant Design for the admin only (an Operate surface: tables, forms, pickers); the public site stays on the kit.
// The theme takes the site's blue and type so the admin still reads as Hicaso.
const THEME = {
  token: {
    colorPrimary: "#2456d6",
    colorLink: "#2456d6",
    borderRadius: 8,
    fontFamily: '"Instrument Sans", system-ui, sans-serif',
    fontSize: 15,
  },
};

const NAV = [
  { key: "/admin/blog", label: <a href="/admin/blog">Blog posts</a> },
  { key: "/admin/enquiries", label: <a href="/admin/enquiries">Enquiries</a> },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const signedIn = !path.startsWith("/admin/login");
  const current = NAV.find((n) => path.startsWith(n.key))?.key;
  return (
    <ConfigProvider theme={THEME}>
      {/* App gives message, notification and modal their theme and context (App.useApp in the screens) */}
      <App>
        {signedIn ? (
          <Flex align="center" justify="space-between" gap={16} wrap style={{ marginBottom: 24 }}>
            <Menu mode="horizontal" selectedKeys={current ? [current] : []} items={NAV} style={{ flex: "1 1 auto", minWidth: 0, borderBottom: 0 }} />
            <form action={logoutAction}>
              <Button htmlType="submit">Sign out</Button>
            </form>
          </Flex>
        ) : null}
        {children}
      </App>
    </ConfigProvider>
  );
}
