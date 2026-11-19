import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import type { Enquiry } from "./enquiry.ts";

// Where /api/enquiry appends each lead, one JSON object per line; the admin's Enquiries page reads it back.
export const LEADS_FILE = process.env.LEADS_FILE || "leads.jsonl";

export type Lead = Enquiry & { id: string; at: string };

const str = (v: unknown) => (typeof v === "string" ? v : "");

// Newest first. A blank, broken or half-written line is skipped: one bad line never hides the rest.
export function parseLeads(text: string): Lead[] {
  const out: Lead[] = [];
  for (const raw of text.split("\n")) {
    if (!raw.trim()) continue;
    let o: Record<string, unknown>;
    try {
      o = JSON.parse(raw);
    } catch {
      continue;
    }
    const at = str(o.at);
    const email = str(o.email);
    if (!at || Number.isNaN(Date.parse(at)) || !email) continue;
    out.push({
      id: createHash("sha1").update(raw).digest("hex").slice(0, 12),
      at,
      name: str(o.name),
      email,
      country: str(o.country),
      service: str(o.service),
      budget: str(o.budget),
      source: str(o.source),
      message: str(o.message),
    });
  }
  return out.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

// No file yet (no enquiry so far) reads as an empty list.
export async function readLeads(path = LEADS_FILE): Promise<Lead[]> {
  try {
    return parseLeads(await readFile(path, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
