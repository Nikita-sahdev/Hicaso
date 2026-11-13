import pg from "pg";

const pools = new Map<string, pg.Pool>();

// One Pool per DATABASE_URL value (read on every call, so tests can switch it).
// Returns null when unset: the site then runs without the blog.
export function getPool(): pg.Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  let pool = pools.get(url);
  if (!pool || pool.ended) {
    pool = new pg.Pool({ connectionString: url });
    pools.set(url, pool);
  }
  return pool;
}
