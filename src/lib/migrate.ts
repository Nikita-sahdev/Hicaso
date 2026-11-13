import { readdir, readFile } from "node:fs/promises";
import pg from "pg";

// Resolved from this file, not process.cwd(): <repo>/src/lib -> <repo>/db/migrations
const DIR = new URL("../../db/migrations/", import.meta.url);

export async function migrate(pool: pg.Pool): Promise<string[]> {
  await pool.query(
    "create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())",
  );
  const done = new Set((await pool.query("select name from schema_migrations")).rows.map((r) => r.name));
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".sql")).sort();
  const applied: string[] = [];
  for (const name of files) {
    if (done.has(name)) continue;
    const sql = await readFile(new URL(name, DIR), "utf8");
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into schema_migrations (name) values ($1)", [name]);
      await client.query("commit");
      applied.push(name);
    } catch (e) {
      await client.query("rollback");
      throw e;
    } finally {
      client.release();
    }
  }
  return applied;
}
