import type pg from "pg";
import { getPool } from "./db.ts";
import { migrate } from "./migrate.ts";

// Test helper: null without TEST_DATABASE_URL; otherwise a migrated, emptied database.
export async function freshDb(): Promise<pg.Pool | null> {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) return null;
  process.env.DATABASE_URL = url;
  const pool = getPool()!;
  await migrate(pool);
  await pool.query(
    "truncate blog_posts, admin_users, admin_sessions, login_failures restart identity cascade",
  );
  return pool;
}
