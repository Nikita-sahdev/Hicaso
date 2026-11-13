import { getPool } from "@/lib/db";
import { IMAGE_FILE, readImage, uploadsDir } from "@/lib/blog/images";

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(_req: Request, ctx: RouteContext<"/blog-images/[file]">) {
  // No database means no blog, so no images either.
  if (!getPool()) return notFound();
  const { file } = await ctx.params;
  if (!IMAGE_FILE.test(file)) return notFound();
  // ENOENT gives null; any other read error propagates as a 500 (and is logged by Next), not a silent 404.
  const img = await readImage(file, uploadsDir());
  if (!img) return notFound();
  return new Response(new Uint8Array(img.body), {
    headers: {
      "content-type": img.type,
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
