import { getPool } from "../src/lib/db.ts";
import { migrate } from "../src/lib/migrate.ts";

const pool = getPool();
if (!pool) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const applied = await migrate(pool);
console.log(applied.length ? `applied: ${applied.join(", ")}` : "nothing to apply");
await pool.end();
