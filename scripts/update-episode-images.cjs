/**
 * Update episode image URLs to point to optimized R2 variants.
 *
 * Production-safe: looks up media by key pattern, only updates bare-slug images.
 *
 * Usage: node scripts/update-episode-images.cjs
 */

const fs = require("fs");
const pg = require("pg");
const lines = fs.readFileSync(".env", "utf8").split(/\r?\n/);
const env = {};
for (const l of lines) { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2]; }

const R2_PUBLIC_URL = (env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
if (!R2_PUBLIC_URL) {
  console.error("❌ Missing R2_PUBLIC_URL in .env");
  process.exit(1);
}

const client = new pg.Client({ connectionString: env.DATABASE_URL });

function normalizeKey(value) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

async function main() {
  await client.connect();

  // Get manifest from DB to find the correct variant URLs
  const mediaRecords = await client.query(
    "SELECT id, key, filename, width FROM media WHERE context = 'episodes' ORDER BY id"
  );

  const episodes = await client.query(
    "SELECT id, slug, image FROM episodes ORDER BY id"
  );

  console.log(`\n📋 Found ${episodes.rows.length} episodes, ${mediaRecords.rows.length} episode media records\n`);

  let updated = 0;
  let skipped = 0;

  for (const ep of episodes.rows) {
    // Skip if already a URL or null
    if (!ep.image || ep.image.startsWith("http://") || ep.image.startsWith("https://")) {
      console.log(`  ⏭️  ${ep.slug}: already a URL or empty (${ep.image || "null"})`);
      skipped++;
      continue;
    }

    // The image column holds a bare slug like "jakso-1"
    const imageKey = normalizeKey(ep.image);

    // Find matching media record
    const mediaMatch = mediaRecords.rows.find((m) => {
      const mediaKey = m.key.replace("images/", "");
      return mediaKey === imageKey;
    });

    if (mediaMatch) {
      // Use the original-width JPG variant as the src URL
      // ImageElement will upgrade to AVIF/WebP via manifest
      const publicUrl = `${R2_PUBLIC_URL}/${mediaMatch.key}-${mediaMatch.width}.jpg`;
      await client.query(
        "UPDATE episodes SET image = $1, media_id = $2 WHERE id = $3",
        [publicUrl, mediaMatch.id, ep.id]
      );
      console.log(`  ✅ ${ep.slug}: ${ep.image} → ${publicUrl} (media_id=${mediaMatch.id})`);
    } else {
      // No matching media record — construct URL from slug
      const publicUrl = `${R2_PUBLIC_URL}/images/${imageKey}-1200.jpg`;
      await client.query(
        "UPDATE episodes SET image = $1 WHERE id = $2",
        [publicUrl, ep.id]
      );
      console.log(`  ⚠️  ${ep.slug}: ${ep.image} → ${publicUrl} (no media record, guessing 1200px)`);
    }
    updated++;
  }

  console.log(`\n✅ Done: ${updated} updated, ${skipped} skipped\n`);
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
