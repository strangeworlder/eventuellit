/**
 * Seed script: creates the campaign ship and 8 placeholder rooms.
 * Run from apps/server:  npx tsx src/db/seed-ship.ts
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL || "postgresql://root:password123@localhost:5432/eventuellit";

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool, { schema });

const PLACEHOLDER_ROOMS = [
  { svgElementId: "room-bridge",       name: "Komentosilta",  function: "Navigointi" },
  { svgElementId: "room-medbay",       name: "Lääkintätila",  function: "Ensiapu" },
  { svgElementId: "room-quarters-fore",name: "Etumajoitus",   function: "Miehistömajoitus" },
  { svgElementId: "room-quarters-aft", name: "Perämajoitus",  function: "Miehistömajoitus" },
  { svgElementId: "room-cargo",        name: "Rahtiruuma",    function: "Varastointi" },
  { svgElementId: "room-engine",       name: "Konekamari",    function: "Moottorihuolto" },
  { svgElementId: "room-commons",      name: "Yhteistila",    function: "Vapaa-aika" },
  { svgElementId: "room-armory",       name: "Asevarasto",    function: "Varustelu" },
];

async function seed() {
  console.log("🚀 Seeding ship...");

  // Create or reuse the single ship
  let ship = await db.query.ships.findFirst();
  if (!ship) {
    const result = await db
      .insert(schema.ships)
      .values({ name: "Alus" })
      .returning();
    ship = result[0];
    console.log(`  ✅ Created ship: ${ship.name} (id=${ship.id})`);
  } else {
    console.log(`  ℹ️  Ship already exists (id=${ship.id})`);
  }

  // Seed rooms (skip if already present)
  const existing = await db.query.shipRooms.findMany();
  const existingIds = new Set(existing.map((r) => r.svgElementId));

  for (const room of PLACEHOLDER_ROOMS) {
    if (existingIds.has(room.svgElementId)) {
      console.log(`  ⏭  Skipping ${room.name} (already seeded)`);
      continue;
    }
    await db.insert(schema.shipRooms).values({
      shipId: ship.id,
      svgElementId: room.svgElementId,
      name: room.name,
      function: room.function,
    });
    console.log(`  ✅ Created room: ${room.name}`);
  }

  console.log("✨ Ship seeding complete.");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
