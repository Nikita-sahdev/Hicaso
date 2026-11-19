import Anthropic from "@anthropic-ai/sdk";
import { askHicaso, cleanHistory } from "@/lib/assistant";
import { clientIp, rateLimit } from "@/lib/rateLimit";

// "Ask Hicaso" (src/lib/assistant.ts). Off until ANTHROPIC_API_KEY is set on the server: then the contact page
// shows the chat and this route answers. The key never reaches the browser.
const tooMany = rateLimit(20, 10 * 60_000); // twenty questions per IP per ten minutes

const reply = (status: number, body: object) => Response.json(body, { status });

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return reply(404, { error: "off" });
  if (tooMany(clientIp(req))) return reply(429, { error: "Too many questions for now. Try again in a few minutes, or write to hello@hicaso.com." });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return reply(400, { error: "bad request" });
  }
  const history = cleanHistory((body as { messages?: unknown })?.messages);
  if (!history) return reply(400, { error: "bad request" });
  try {
    const text = await askHicaso(history);
    return reply(200, {
      reply: text ?? "I can't answer that one here. Write to hello@hicaso.com or use the form above, and the team will reply.",
    });
  } catch (e) {
    console.error("assistant:", e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e);
    return reply(503, { error: "The assistant isn't available right now. Use the form above or write to hello@hicaso.com." });
  }
}
