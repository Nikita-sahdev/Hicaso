import { requireAdmin } from "@/lib/admin/guard";
import { logoutAction } from "@/app/admin/login/actions";
import { listPosts } from "@/lib/blog/store";
import { postState } from "@/lib/blog/post";
import { createPostAction } from "./actions";
import LocalTime from "./LocalTime";

const STATE = { draft: "Draft", scheduled: "Scheduled", live: "Live" } as const;

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await listPosts();
  const now = new Date();
  return (
    <>
      <h1>Blog posts</h1>
      <form action={createPostAction} style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", margin: "1.5rem 0" }}>
        <label style={{ flex: "1 1 18rem" }}>
          Headline
          <input name="headline" maxLength={200} required style={{ display: "block", width: "100%" }} />
        </label>
        <button className="btn btn--primary" type="submit" style={{ alignSelf: "end" }}>
          Create
        </button>
      </form>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">Headline</th>
                <th align="left">State</th>
                <th align="left">Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const state = postState(p, now);
                return (
                  <tr key={p.id}>
                    <td>
                      <a href={`/admin/blog/${p.id}`}>{p.headline}</a>
                    </td>
                    <td>{STATE[state]}</td>
                    <td>
                      {state === "draft" ? (
                        <LocalTime iso={p.updatedAt.toISOString()} />
                      ) : (
                        <LocalTime iso={p.publishAt!.toISOString()} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <form action={logoutAction} style={{ marginTop: "2rem" }}>
        <button className="btn" type="submit">
          Sign out
        </button>
      </form>
    </>
  );
}
