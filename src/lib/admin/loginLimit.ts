import { getPool } from "../db.ts";

export const LOGIN_LIMIT = 10;
export const LOGIN_WINDOW_MINUTES = 15;

const norm = (email: string) => email.trim().toLowerCase();

// Number of trusted proxy hops in front of the app: an integer 0-5, otherwise 0.
export function trustProxyHops(v: string | undefined): number {
  if (v === undefined || !/^[0-5]$/.test(v.trim())) return 0;
  return Number(v.trim());
}

// The entry `hops` places from the end of X-Forwarded-For (earlier entries are client-supplied).
export function clientIp(xff: string | null, hops: number): string {
  if (!xff || hops < 1) return "unknown";
  const parts = xff.split(",");
  return parts[parts.length - hops]?.trim() || "unknown";
}

export async function isLimited(ip: string, email: string): Promise<boolean> {
  const r = await getPool()!.query(
    `select
       (select count(*) from login_failures where ip = $1
          and at > now() - make_interval(mins => $3)) as by_ip,
       (select count(*) from login_failures where email = $2
          and at > now() - make_interval(mins => $3)) as by_email`,
    [ip, norm(email), LOGIN_WINDOW_MINUTES],
  );
  const { by_ip, by_email } = r.rows[0];
  return Number(by_ip) >= LOGIN_LIMIT || Number(by_email) >= LOGIN_LIMIT;
}

export async function recordFailure(ip: string, email: string): Promise<void> {
  const pool = getPool()!;
  await pool.query("delete from login_failures where at < now() - interval '1 day'");
  await pool.query("insert into login_failures (ip, email) values ($1, $2)", [ip, norm(email)]);
}

export async function clearFailures(email: string): Promise<void> {
  await getPool()!.query("delete from login_failures where email = $1", [norm(email)]);
}

// Records the attempt first, then counts (the new row included), so parallel requests cannot all pass.
// The row stays as the recorded failure unless forgetAttempt removes it after a successful sign-in.
export async function beginAttempt(
  ip: string,
  email: string,
): Promise<{ id: string; limited: boolean }> {
  const pool = getPool()!;
  await pool.query("delete from login_failures where at < now() - interval '1 day'");
  const ins = await pool.query(
    "insert into login_failures (ip, email) values ($1, $2) returning id",
    [ip, norm(email)],
  );
  const r = await pool.query(
    `select
       (select count(*) from login_failures where ip = $1
          and at > now() - make_interval(mins => $3)) as by_ip,
       (select count(*) from login_failures where email = $2
          and at > now() - make_interval(mins => $3)) as by_email`,
    [ip, norm(email), LOGIN_WINDOW_MINUTES],
  );
  const { by_ip, by_email } = r.rows[0];
  return { id: String(ins.rows[0].id), limited: Number(by_ip) > LOGIN_LIMIT || Number(by_email) > LOGIN_LIMIT };
}

export async function forgetAttempt(id: string): Promise<void> {
  await getPool()!.query("delete from login_failures where id = $1", [id]);
}
