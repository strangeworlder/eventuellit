/**
 * Production setup: register media records in DB, fix manifest on R2, update episode URLs.
 * 
 * Works with `railway run` (reads env vars from process.env, no .env file needed).
 * Does NOT need local image files — the R2 bucket already has the optimized variants.
 *
 * Usage: railway run node ../../scripts/production-media-setup.mjs
 *    OR: node scripts/production-media-setup.mjs  (from project root with .env)
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Load .env as fallback (for local runs)
try {
  const envPath = path.join(ROOT, ".env");
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // No .env — that's fine with railway run
}

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "eventuellit-media";
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
const DATABASE_URL = process.env.DATABASE_URL;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("❌ Missing R2 env vars");
  process.exit(1);
}
if (!DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

// ---------------------------------------------------------------------------
// Known media records (from our local migration)
// ---------------------------------------------------------------------------
const MEDIA_RECORDS = [
  { key: "images/hahmonluonti",  filename: "Hahmonluonti.png",   mime: "image/png",  context: "ruleset",  w: 2752, h: 1536 },
  { key: "images/kehitys",       filename: "Kehitys.png",         mime: "image/png",  context: "ruleset",  w: 3168, h: 1344 },
  { key: "images/pelip-yt-ily",  filename: "Pelipöytäily.png",    mime: "image/png",  context: "ruleset",  w: 2816, h: 1536 },
  { key: "images/s--nt-teksti",  filename: "Sääntöteksti.png",    mime: "image/png",  context: "ruleset",  w: 2816, h: 1536 },
  { key: "images/vaurioituminen", filename: "Vaurioituminen.png", mime: "image/png",  context: "ruleset",  w: 2752, h: 1536 },
  { key: "images/03-verso",      filename: "03-verso.png",        mime: "image/png",  context: "world",    w: 1584, h: 672  },
  { key: "images/09-kilpi",      filename: "09-kilpi.png",        mime: "image/png",  context: "world",    w: 2752, h: 1536 },
  { key: "images/jakso-1",       filename: "jakso-1.png",         mime: "image/png",  context: "episodes", w: 1024, h: 1024 },
  { key: "images/jakso-2",       filename: "jakso-2.png",         mime: "image/png",  context: "episodes", w: 2752, h: 1536 },
  { key: "images/jakso-3",       filename: "jakso-3.png",         mime: "image/png",  context: "episodes", w: 3168, h: 1344 },
  { key: "images/jakso-4",       filename: "jakso-4.jpg",         mime: "image/jpeg", context: "episodes", w: 3168, h: 1344 },
  { key: "images/og-default",    filename: "og-default.jpg",      mime: "image/jpeg", context: "general",  w: 1200, h: 630  },
];

function normalizeKey(value) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

async function main() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();

  // 1. Run DB migration (idempotent)
  console.log("\n📦 Running DB migration...");
  const migrationSql = readFileSync(
    path.join(ROOT, "apps/server/src/db/manual-migrations/008-create-media.sql"),
    "utf8"
  );
  await client.query(migrationSql);
  console.log("  ✅ Migration complete\n");

  // 2. Register media records
  console.log("💾 Registering media records...");
  for (const r of MEDIA_RECORDS) {
    const existing = await client.query("SELECT id FROM media WHERE key = $1", [r.key]);
    if (existing.rows.length > 0) {
      console.log(`  ⏭️  Already in DB: ${r.key} (id: ${existing.rows[0].id})`);
      continue;
    }
    const result = await client.query(
      `INSERT INTO media (key, filename, alt, mime_type, size_bytes, width, height, context)
       VALUES ($1, $2, '', $3, 0, $4, $5, $6) RETURNING id`,
      [r.key, r.filename, r.mime, r.w, r.h, r.context]
    );
    console.log(`  ✅ ${r.key} → id ${result.rows[0].id}`);
  }

  // 3. Re-upload the correct manifest from R2 (fetch it from our known good local copy)
  console.log("\n📋 Re-uploading manifest.json...");
  const manifestResponse = await fetch(`${R2_PUBLIC_URL}/images/manifest.json`);
  const currentManifest = await manifestResponse.json();
  
  if (Object.keys(currentManifest).length < 5) {
    // Manifest is empty or corrupted — rebuild from known structure
    console.log("  ⚠️  Manifest is empty/corrupted, rebuilding...");

    // Fetch the correct manifest from R2 by building it from known data
    const WIDTHS = [480, 768, 1200];
    const manifest = {};

    for (const r of MEDIA_RECORDS) {
      const slug = r.key.replace("images/", "");
      const targetWidths = WIDTHS.filter(w => w <= r.w);
      if (!targetWidths.includes(r.w)) targetWidths.push(r.w);

      manifest[slug] = {
        width: r.w,
        height: r.h,
        placeholder: "", // Placeholder lost — will show no blur on first load
        variants: targetWidths.map(width => ({
          width,
          avif: `/images/${slug}-${width}.avif`,
          webp: `/images/${slug}-${width}.webp`,
          jpg: `/images/${slug}-${width}.jpg`,
        })),
      };
    }

    await s3.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: "images/manifest.json",
      Body: Buffer.from(JSON.stringify(manifest, null, 2)),
      ContentType: "application/json",
    }));
    console.log("  ✅ Manifest rebuilt and uploaded");
  } else {
    console.log(`  ✅ Manifest looks good (${Object.keys(currentManifest).length} entries)`);
  }

  // 4. Update episode image URLs
  console.log("\n📸 Updating episode image URLs...");
  const episodes = await client.query("SELECT id, slug, image FROM episodes ORDER BY id");

  for (const ep of episodes.rows) {
    if (!ep.image) continue;

    // Skip if already pointing to R2 optimized variant
    if (ep.image.includes(".r2.dev/images/") && ep.image.match(/-\d+\.jpg$/)) {
      console.log(`  ⏭️  ${ep.slug}: already correct`);
      continue;
    }

    // Extract slug from current image value (could be bare slug or old R2 URL)
    let imageSlug;
    if (ep.image.startsWith("http")) {
      const filename = ep.image.split("/").pop();
      imageSlug = filename.replace(/\.\w+$/, "");
    } else {
      imageSlug = ep.image;
    }

    const mediaKey = `images/${normalizeKey(imageSlug)}`;
    const media = await client.query("SELECT id, key, width FROM media WHERE key = $1", [mediaKey]);

    if (media.rows.length > 0) {
      const m = media.rows[0];
      const url = `${R2_PUBLIC_URL}/${m.key}-${m.width}.jpg`;
      await client.query(
        "UPDATE episodes SET image = $1, media_id = $2 WHERE id = $3",
        [url, m.id, ep.id]
      );
      console.log(`  ✅ ${ep.slug}: → ${url}`);
    } else {
      console.log(`  ⚠️  ${ep.slug}: no matching media for "${imageSlug}"`);
    }
  }

  await client.end();
  console.log("\n✅ Production setup complete!\n");
}

main().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
