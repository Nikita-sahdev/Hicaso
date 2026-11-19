import { appendFile } from "node:fs/promises";
import nodemailer from "nodemailer";
import { ENQUIRY_TO, OTHER_SERVICE, enquirySubject, enquiryText, parseEnquiry, type Enquiry } from "@/lib/enquiry";
import { services } from "@/data/services";
import { LEADS_FILE } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rateLimit";

// The enquiry form posts here (system.js, data-endpoint). Each lead is appended to LEADS_FILE and emailed over SMTP;
// it counts as received when either one works, so a mail outage never loses a lead.
const NAMES = new Map(services.map((s) => [s.slug, s.name]));

const tooMany = rateLimit(5, 10 * 60_000); // five enquiries per IP per ten minutes

const fail = (status: number) => Response.json({ ok: false }, { status });

export async function POST(req: Request) {
  if (tooMany(clientIp(req))) return fail(429);

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
