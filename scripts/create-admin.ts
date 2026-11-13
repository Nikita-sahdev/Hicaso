import { getPool } from "../src/lib/db.ts";
import { hashPassword } from "../src/lib/admin/password.ts";
import { upsertAdmin } from "../src/lib/admin/accounts.ts";

const MIN_LENGTH = 12;

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

// Reads a line with echo off on a TTY; without a TTY, reads one line from stdin.
async function promptHidden(label: string): Promise<string> {
  const { stdin, stdout } = process;
  if (!stdin.isTTY) {
    let data = "";
    for await (const chunk of stdin) {
      data += chunk;
      if (data.includes("\n")) break;
    }
    return data.split(/\r?\n/)[0];
  }
  stdout.write(label);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");
  return new Promise((resolve) => {
    let pw = "";
    const onData = (s: string) => {
      for (const ch of s) {
        if (ch === "\r" || ch === "\n" || ch === "\u0004") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          stdout.write("\n");
          return resolve(pw);
        }
        if (ch === "\u0003") {
          stdin.setRawMode(false);
          stdout.write("\n");
          process.exit(130);
        }
        if (ch === "\u007f" || ch === "\b") pw = pw.slice(0, -1);
        else pw += ch;
      }
    };
    stdin.on("data", onData);
  });
}

const email = process.argv[2]?.trim();
if (!email) fail("Usage: npm run admin:create -- <email>");
const pool = getPool();
if (!pool) fail("DATABASE_URL is not set");

const password = process.env.ADMIN_PASSWORD ?? (await promptHidden("Password: "));
if (password.length < MIN_LENGTH) fail(`Password must be at least ${MIN_LENGTH} characters`);

await upsertAdmin(email, await hashPassword(password));
console.log(`Admin account ready: ${email.toLowerCase()}`);
await pool.end();
