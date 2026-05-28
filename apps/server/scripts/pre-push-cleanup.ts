/**
 * Run this BEFORE db:push to clean up rows that would block the migration.
 * It deletes characters with no user_id (orphaned test data).
 */
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function cleanup() {
  await pool.query("DELETE FROM characters WHERE user_id IS NULL");
  console.log("Deleted orphaned characters (user_id IS NULL)");

  // Backfill email for users that somehow have null — set a placeholder
  await pool.query(
    "UPDATE users SET email = 'unknown_' || id || '@placeholder.invalid' WHERE email IS NULL",
  );
  console.log("Backfilled null emails for existing users");

  await pool.end();
}

cleanup().catch(console.error);
