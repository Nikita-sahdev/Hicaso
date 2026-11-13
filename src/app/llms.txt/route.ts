import { llmsText } from "@/lib/llms";

// Built once at build time (route handlers are uncached unless force-static: docs 01-app/01-getting-started/15-route-handlers.md).
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsText(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
