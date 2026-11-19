"use client";

import { useState } from "react";
import { Empty, Input, Table, Tag, type TableColumnsType } from "antd";
import LocalTime from "./LocalTime";

export type PostRow = { id: string; headline: string; state: "draft" | "scheduled" | "live"; date: string };

const STATE = {
  draft: { label: "Draft", color: "default" },
  scheduled: { label: "Scheduled", color: "gold" },
  live: { label: "Live", color: "green" },
} as const;

export default function PostsTable({ rows }: { rows: PostRow[] }) {
  const [q, setQ] = useState("");
  const shown = q ? rows.filter((r) => r.headline.toLowerCase().includes(q.trim().toLowerCase())) : rows;
  const columns: TableColumnsType<PostRow> = [
    {
      title: "Headline",
      dataIndex: "headline",
      render: (h: string, r) => <a href={`/admin/blog/${r.id}`}>{h}</a>,
    },
    {
      title: "State",
      dataIndex: "state",
      width: 140,
      filters: Object.entries(STATE).map(([value, s]) => ({ text: s.label, value })),
      onFilter: (v, r) => r.state === v,
      render: (s: PostRow["state"]) => <Tag color={STATE[s].color}>{STATE[s].label}</Tag>,
    },
    {
      // drafts show when they were last saved; scheduled and live posts their publish time
      title: "Date",
      dataIndex: "date",
      width: 220,
      defaultSortOrder: "descend",
      sorter: (a, b) => Date.parse(a.date) - Date.parse(b.date),
      render: (iso: string) => <LocalTime iso={iso} />,
    },
  ];
  return (
    <>
      <Input.Search placeholder="Search headlines" allowClear onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 360, marginBottom: 16 }} />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={shown}
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
        scroll={{ x: 560 }}
        locale={{ emptyText: <Empty description={q ? "No post matches." : "No posts yet."} /> }}
      />
    </>
  );
}
