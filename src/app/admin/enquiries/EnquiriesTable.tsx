"use client";

import { useState } from "react";
import { Empty, Input, Table, Tag, Typography, type TableColumnsType } from "antd";
import type { Lead } from "@/lib/leads";
import LocalTime from "../blog/LocalTime";

// filter choices from the values actually present (a service renamed later still filters)
const choices = (leads: Lead[], k: "service" | "budget" | "source") =>
  [...new Set(leads.map((l) => l[k]).filter(Boolean))].sort().map((v) => ({ text: v, value: v }));

export default function EnquiriesTable({ leads }: { leads: Lead[] }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = needle
    ? leads.filter((l) => [l.name, l.email, l.country, l.message].some((v) => v.toLowerCase().includes(needle)))
    : leads;
  const columns: TableColumnsType<Lead> = [
    {
      title: "Received",
      dataIndex: "at",
      width: 190,
      defaultSortOrder: "descend",
      sorter: (a, b) => Date.parse(a.at) - Date.parse(b.at),
      render: (iso: string) => <LocalTime iso={iso} />,
    },
    { title: "Name", dataIndex: "name", width: 180 },
    {
      title: "Email",
      dataIndex: "email",
      width: 240,
      // a reply opens the admin's mail app, addressed and with the subject the enquiry email used
      render: (email: string, l) => (
        <a href={`mailto:${email}?subject=${encodeURIComponent(l.service ? `Re: Project enquiry — ${l.service}` : "Re: Project enquiry")}`}>{email}</a>
      ),
    },
    { title: "Country", dataIndex: "country", width: 140 },
    {
      title: "Service",
      dataIndex: "service",
      width: 200,
      filters: choices(leads, "service"),
      onFilter: (v, l) => l.service === v,
      render: (s: string) => (s ? <Tag color="blue">{s}</Tag> : null),
    },
    {
      title: "Budget",
      dataIndex: "budget",
      width: 140,
      filters: choices(leads, "budget"),
      onFilter: (v, l) => l.budget === v,
    },
    {
      title: "Heard via",
      dataIndex: "source",
      width: 170,
      filters: choices(leads, "source"),
      onFilter: (v, l) => l.source === v,
    },
    {
      title: "Message",
      dataIndex: "message",
      render: (m: string) => <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>{m}</Typography.Paragraph>,
    },
  ];
  return (
    <>
      <Input.Search placeholder="Search name, email, country or message" allowClear onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 420, marginBottom: 16 }} />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={shown}
        pagination={{ pageSize: 25, hideOnSinglePage: true }}
        scroll={{ x: 1270 }}
        // the whole message, opened under its row
        expandable={{ expandedRowRender: (l) => <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{l.message}</p>, rowExpandable: (l) => !!l.message }}
        locale={{ emptyText: <Empty description={needle ? "No enquiry matches." : "No enquiries yet."} /> }}
      />
    </>
  );
}
