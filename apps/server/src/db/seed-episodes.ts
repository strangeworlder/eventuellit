/**
 * One-time seed script: reads episode markdown files and populates the DB.
 *
 * Usage: npx tsx src/db/seed-episodes.ts
 *
 * Requires DATABASE_URL env var or defaults to local dev DB.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { episodes, episodeSkills } from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://root:password123@localhost:5432/eventuellit";

function parseFrontmatter(md: string) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const data: Record<string, any> = {};
  let content = md;

  if (match) {
    const frontmatter = match[1];
    content = md.slice(match[0].length);

    const lines = frontmatter.split(/\r?\n/);
    let currentKey: string | null = null;
    let isBlock = false;
    let blockLines: string[] = [];

    for (const line of lines) {
      const topLevelMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);

      if (
        topLevelMatch &&
        (!isBlock ||
          (line.trim() !== "" &&
            !line.startsWith("  ") &&
            !line.startsWith("\t")))
      ) {
        if (isBlock && currentKey) {
          data[currentKey] = blockLines.join("\n").trim();
          isBlock = false;
          blockLines = [];
        }

        const key = topLevelMatch[1];
        const rest = topLevelMatch[2].trim();

        if (rest === "|") {
          currentKey = key;
          isBlock = true;
          blockLines = [];
        } else {
          currentKey = key;
          let value = rest;
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }
          if (!Number.isNaN(Number(value)) && value !== "") {
            data[key] = Number(value);
          } else {
            data[key] = value;
          }
        }
      } else if (isBlock) {
        blockLines.push(line.replace(/^ {0,2}/, ""));
      }
    }

    if (isBlock && currentKey) {
      data[currentKey] = blockLines.join("\n").trim();
    }
  }
  return { data, content };
}

function extractTaidot(content: string): string[] {
  const taidotMatch = content.match(
    /####\s*Taidot\s*\r?\n([\s\S]*?)(?=\r?\n####|\r?\n###|$)/,
  );
  if (!taidotMatch) return [];

  return taidotMatch[1]
    .split(/\r?\n/)
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter((line) => line.length > 0);
}

async function seed() {
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);

  // Find markdown files - look relative to this script's location
  const contentDir = resolve(
    __dirname,
    "../../../episodes/src/content",
  );

  console.log(`Looking for episode markdown files in: ${contentDir}`);

  let files: string[];
  try {
    files = readdirSync(contentDir).filter((f) => f.endsWith(".md"));
  } catch {
    console.error(`Could not read directory: ${contentDir}`);
    console.log("Make sure the episodes app content directory exists.");
    process.exit(1);
  }

  console.log(`Found ${files.length} episode file(s): ${files.join(", ")}`);

  // We need a GM user ID. Find the first GM or create a placeholder.
  const { rows: gmRows } = await pool.query(
    `SELECT id FROM users WHERE role = 'gm' LIMIT 1`,
  );
  let gmId: number;
  if (gmRows.length > 0) {
    gmId = gmRows[0].id;
    console.log(`Using existing GM user id: ${gmId}`);
  } else {
    console.error(
      "No GM user found in the database. Please create a GM user first.",
    );
    process.exit(1);
  }

  for (const file of files) {
    const slug = file.replace(".md", "");
    const raw = readFileSync(join(contentDir, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    const taidot = extractTaidot(content);

    console.log(`\nSeeding episode: ${data.title || slug}`);
    console.log(`  Skills: ${taidot.length > 0 ? taidot.join(", ") : "(none)"}`);

    // Insert episode
    const [episode] = await db
      .insert(episodes)
      .values({
        slug,
        title: data.title || slug,
        order: data.order || 99,
        status: data.status || "planned",
        description: data.description || null,
        content: content,
        players: data.players ? String(data.players) : null,
        sessionDates: data.sessionDates ? String(data.sessionDates) : null,
        location: data.location || null,
        locationLink: data.locationLink || null,
        image: data.image || null,
        imageAlt: data.imageAlt || null,
        mechanicalAdditions: data.mechanicalAdditions || null,
        summary: data.summary || null,
        gmId,
      })
      .returning();

    console.log(`  Inserted episode id: ${episode.id}`);

    // Insert skills
    if (taidot.length > 0) {
      await db.insert(episodeSkills).values(
        taidot.map((name) => ({ episodeId: episode.id, name })),
      );
      console.log(`  Inserted ${taidot.length} skill(s)`);
    }
  }

  console.log("\n✓ Seed complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
