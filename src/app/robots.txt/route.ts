import { robotsText } from "@/lib/robots";

export const dynamic = "force-static";

export function GET() {
  return new Response(robotsText(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
