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
