/**
 * One-time seed script to create "update_names" notifications
 * for all players who have characters with no nicknames.
 *
 * Usage: npx tsx apps/server/src/db/seed-name-notifications.ts
 *
 * Safe to run multiple times — only creates notifications if none exist
 * for a given user + type + referenceId combo.
 */
import pg from "pg";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL || "postgresql://root:password123@localhost:5432/eventuellit";

async function main() {
  const pool = new Pool({ connectionString });

  try {
    // Get all characters with their user IDs
    const { rows: characters } = await pool.query<{
      id: number;
      user_id: number;
      name: string;
      nicknames: string[];
    }>(
      `SELECT c.id, c.user_id, c.name, c.nicknames
       FROM characters c
       INNER JOIN users u ON u.id = c.user_id
       WHERE u.role = 'player'`,
    );

    console.log(`Found ${characters.length} player character(s)`);

    let created = 0;
    let skipped = 0;

    for (const char of characters) {
      // Check if a notification already exists for this character
      const { rows: existing } = await pool.query(
        `SELECT id FROM player_notifications
         WHERE user_id = $1 AND type = 'update_names' AND reference_id = $2 AND dismissed_at IS NULL`,
        [char.user_id, String(char.id)],
      );

      if (existing.length > 0) {
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO player_notifications (user_id, type, reference_id, message)
         VALUES ($1, 'update_names', $2, $3)`,
        [char.user_id, String(char.id), `Lisää hahmollesi "${char.name}" lempinimet.`],
      );
      created++;
      console.log(`  Created notification for character "${char.name}" (id: ${char.id})`);
    }

    console.log(`\nDone. Created: ${created}, Skipped (already exist): ${skipped}`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
