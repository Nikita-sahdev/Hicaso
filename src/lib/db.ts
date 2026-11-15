import pg from "pg";

const pools = new Map<string, pg.Pool>();

// One Pool per DATABASE_URL value (read on every call, so tests can switch it).
// Returns null when unset: the site then runs without the blog.
export function getPool(): pg.Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  let pool = pools.get(url);
  if (!pool || pool.ended) {
    // The root layout queries on every dynamic request: never wait for ever on a hung or full Postgres.
    pool = new pg.Pool({ connectionString: url, connectionTimeoutMillis: 3000, statement_timeout: 5000 });
    // Idle-client errors (Postgres restart, dropped connection) would otherwise crash the server.
    pool.on("error", (e) => console.error("pg pool:", e.message));
    pools.set(url, pool);
  }
  return pool;
}
