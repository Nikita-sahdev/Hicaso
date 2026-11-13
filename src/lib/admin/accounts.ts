import { createHash, randomBytes } from "node:crypto";
import { getPool } from "../db.ts";

const SESSION_DAYS = 14;
const norm = (email: string) => email.trim().toLowerCase();
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function findAdmin(
  email: string,
): Promise<{ id: number; email: string; passwordHash: string } | null> {
  const r = await getPool()!.query(
    "select id, email, password_hash from admin_users where email = $1",
    [norm(email)],
  );
  const row = r.rows[0];
  return row ? { id: row.id, email: row.email, passwordHash: row.password_hash } : null;
}

export async function upsertAdmin(email: string, passwordHash: string): Promise<void> {
  await getPool()!.query(
    `insert into admin_users (email, password_hash) values ($1, $2)
     on conflict (email) do update set password_hash = excluded.password_hash`,
    [norm(email), passwordHash],
  );
}

export async function createSession(userId: number): Promise<{ token: string; expiresAt: Date }> {
  const pool = getPool()!;
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await pool.query("delete from admin_sessions where expires_at <= now()");
  await pool.query(
    "insert into admin_sessions (token_hash, user_id, expires_at) values ($1, $2, $3)",
    [hashToken(token), userId, expiresAt],
  );
  return { token, expiresAt };
}

export async function sessionUser(
  token: string | undefined,
): Promise<{ id: number; email: string } | null> {
  if (!token) return null;
  const r = await getPool()!.query(
    `select u.id, u.email from admin_sessions s join admin_users u on u.id = s.user_id
     where s.token_hash = $1 and s.expires_at > now()`,
    [hashToken(token)],
  );
  return r.rows[0] ?? null;
}

export async function deleteSession(token: string): Promise<void> {
  await getPool()!.query("delete from admin_sessions where token_hash = $1", [hashToken(token)]);
}
