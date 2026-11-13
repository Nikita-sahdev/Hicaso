import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import { getPost } from "@/lib/blog/store";
import Editor from "./Editor";

export default async function AdminPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  await requireAdmin();
  const post = await getPost((await params).id);
  if (!post) notFound();
  return (
    <Editor
      post={{
        id: post.id,
        slug: post.slug,
        headline: post.headline,
        seoTitle: post.seoTitle,
        description: post.description,
        category: post.category,
        body: post.body,
        status: post.status,
        slugLocked: post.slugLocked,
        publishAt: post.publishAt ? post.publishAt.toISOString() : null,
      }}
    />
  );
}
