import { llmsText } from "@/lib/llms";
import { listLivePostsSafe } from "@/lib/blog/store";

// Regenerated at most once a minute, and straight away after an admin write (refreshSite revalidates /llms.txt).
export const revalidate = 60;

export async function GET() {
  return new Response(llmsText(await listLivePostsSafe()), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
