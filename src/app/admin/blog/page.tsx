import { Button, Flex, Input } from "antd";
import { requireAdmin } from "@/lib/admin/guard";
import { listPosts } from "@/lib/blog/store";
import { postState } from "@/lib/blog/post";
import { createPostAction } from "./actions";
import PostsTable, { type PostRow } from "./PostsTable";

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await listPosts();
  const now = new Date();
  const rows: PostRow[] = posts.map((p) => {
    const state = postState(p, now);
    return { id: p.id, headline: p.headline, state, date: (state === "draft" ? p.updatedAt : p.publishAt!).toISOString() };
  });
  return (
    <>
      {/* a server component can't dot into antd (Typography.Title): plain heading */}
      <h1>Blog posts</h1>
      {/* a plain form posting to the server action; antd only styles the controls */}
      <form action={createPostAction} style={{ margin: "8px 0 24px" }}>
        <Flex gap={12} wrap align="end">
          <label style={{ flex: "1 1 18rem", display: "grid", gap: 6 }}>
            New post headline
            <Input name="headline" maxLength={200} required size="large" />
          </label>
          <Button type="primary" htmlType="submit" size="large">Create</Button>
        </Flex>
      </form>
      <PostsTable rows={rows} />
    </>
  );
}
