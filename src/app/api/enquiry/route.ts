import { appendFile } from "node:fs/promises";
import nodemailer from "nodemailer";
import { ENQUIRY_TO, OTHER_SERVICE, enquirySubject, enquiryText, parseEnquiry, type Enquiry } from "@/lib/enquiry";
import { moreServices, services } from "@/data/services";

// The enquiry form posts here (system.js, data-endpoint). Each lead is appended to LEADS_FILE and emailed over SMTP;
// it counts as received when either one works, so a mail outage never loses a lead.
const LEADS_FILE = process.env.LEADS_FILE || "leads.jsonl";
const NAMES = new Map([...services, ...moreServices].map((s) => [s.slug, s.name]));

// ponytail: in-memory per-IP limit, per process and reset on restart; move to Redis if you run several instances.
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 10_000) hits.clear();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const fail = (status: number) => Response.json({ ok: false }, { status });

export async function POST(req: Request) {
  // Apache appends the client it saw as the last x-forwarded-for entry; earlier entries are client-supplied.
  const ip = req.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "local";
  if (tooMany(ip)) return fail(429);

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return fail(400);
  }
  if (String(fd.get("website") ?? "")) return Response.json({ ok: true }); // honeypot filled: a bot, drop quietly

  const e = parseEnquiry(fd);
  if (!e) return fail(400);
  e.service = NAMES.get(e.service) ?? (e.service ? OTHER_SERVICE : "");

  const [saved, mailed] = await Promise.all([
    appendFile(LEADS_FILE, JSON.stringify({ at: new Date().toISOString(), ...e }) + "\n").then(
      () => true,
      (err) => (console.error("enquiry: not saved", err), false),
    ),
    sendMail(e),
  ]);
  return saved || mailed ? Response.json({ ok: true }) : fail(500);
}

// SMTP_PORT 465 = TLS from the start; 587/25 = STARTTLS when the server offers it. Short timeouts: the visitor waits.
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const smtp = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    })
  : null;

async function sendMail(e: Enquiry): Promise<boolean> {
  if (!smtp) return false;
  try {
    await smtp.sendMail({
      from: process.env.ENQUIRY_FROM || process.env.SMTP_USER || ENQUIRY_TO,
      to: ENQUIRY_TO,
      replyTo: e.email,
      subject: enquirySubject(e),
      text: enquiryText(e),
    });
    return true;
  } catch (err) {
    console.error("enquiry: smtp", err);
    return false;
  }
}
