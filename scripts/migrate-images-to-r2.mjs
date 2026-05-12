/**
 * Migrate images to Cloudflare R2 with full optimization.
 *
 * For each source image:
 *   1. Generate AVIF/WebP/JPG variants at 480, 768, 1200, and original widths
 *   2. Generate a base64 blur placeholder
 *   3. Upload all variants to R2
 *   4. Build and upload a unified manifest.json to R2
 *   5. Register the source image in the media DB table
 *
 * Usage: node scripts/migrate-images-to-r2.mjs
 */

import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Load .env
// ---------------------------------------------------------------------------
function loadEnv() {
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
    // .env is optional
  }
}

loadEnv();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
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

const RESPONSIVE_WIDTHS = [480, 768, 1200];

const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

const normalizeKey = (value) => value.toLowerCase().replace(/[^a-z0-9-]/g, "-");

// ---------------------------------------------------------------------------
// Image sources
// ---------------------------------------------------------------------------
const IMAGE_SOURCES = [
  { localPath: "apps/ruleset/public/images/Hahmonluonti.png", context: "ruleset" },
  { localPath: "apps/ruleset/public/images/Kehitys.png", context: "ruleset" },
  { localPath: "apps/ruleset/public/images/Pelipöytäily.png", context: "ruleset" },
  { localPath: "apps/ruleset/public/images/Sääntöteksti.png", context: "ruleset" },
  { localPath: "apps/ruleset/public/images/Vaurioituminen.png", context: "ruleset" },
  { localPath: "apps/world/public/images/03-verso.png", context: "world" },
  { localPath: "apps/world/public/images/09-kilpi.png", context: "world" },
  { localPath: "apps/episodes/src/content/images/jakso-1.png", context: "episodes" },
  { localPath: "apps/episodes/src/content/images/jakso-2.png", context: "episodes" },
  { localPath: "apps/episodes/src/content/images/jakso-3.png", context: "episodes" },
  { localPath: "apps/episodes/public/images/jakso-4.jpg", context: "episodes" },
  { localPath: "apps/host/public/images/og-default.jpg", context: "general" },
];

// ---------------------------------------------------------------------------
// Upload buffer to R2
// ---------------------------------------------------------------------------
async function uploadBuffer(key, buffer, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
}

// ---------------------------------------------------------------------------
// Delete old raw uploads from previous migration attempt
// ---------------------------------------------------------------------------
async function deleteOldRaw(key) {
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    console.log(`  🗑️  Deleted old raw: ${key}`);
  } catch {
    // Not found — fine
  }
}

// ---------------------------------------------------------------------------
// Optimize and upload a single image
// ---------------------------------------------------------------------------
async function optimizeAndUpload(source) {
  const fullPath = path.join(ROOT, source.localPath);

  try {
    statSync(fullPath);
  } catch {
    console.warn(`  ⚠️  File not found, skipping: ${source.localPath}`);
    return null;
  }

  const filename = path.basename(source.localPath);
  const extensionless = path.parse(filename).name;
  const key = normalizeKey(extensionless);
  const imageBuffer = readFileSync(fullPath);
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    console.warn(`  ⚠️  No dimensions for ${filename}, skipping`);
    return null;
  }

  // Determine target widths
  const targetWidths = RESPONSIVE_WIDTHS.filter((w) => w <= metadata.width);
  if (targetWidths.length === 0) targetWidths.push(metadata.width);
  if (!targetWidths.includes(metadata.width)) targetWidths.push(metadata.width);

  const variants = [];

  for (const width of targetWidths) {
    const resized = sharp(imageBuffer).resize({ width, withoutEnlargement: true });

    const [avifBuf, webpBuf, jpgBuf] = await Promise.all([
      resized.clone().avif({ quality: 45 }).toBuffer(),
      resized.clone().webp({ quality: 70 }).toBuffer(),
      resized.clone().jpeg({ quality: 75, mozjpeg: true }).toBuffer(),
    ]);

    const avifKey = `images/${key}-${width}.avif`;
    const webpKey = `images/${key}-${width}.webp`;
    const jpgKey = `images/${key}-${width}.jpg`;

    await Promise.all([
      uploadBuffer(avifKey, avifBuf, "image/avif"),
      uploadBuffer(webpKey, webpBuf, "image/webp"),
      uploadBuffer(jpgKey, jpgBuf, "image/jpeg"),
    ]);

    const avifKB = (avifBuf.length / 1024).toFixed(0);
    const webpKB = (webpBuf.length / 1024).toFixed(0);
    console.log(`    ${width}px → avif ${avifKB}KB, webp ${webpKB}KB`);

    variants.push({
      width,
      avif: `/images/${key}-${width}.avif`,
      webp: `/images/${key}-${width}.webp`,
      jpg: `/images/${key}-${width}.jpg`,
    });
  }

  // Generate blur placeholder
  const placeholderBuffer = await sharp(imageBuffer)
    .resize({ width: 24 })
    .jpeg({ quality: 40, mozjpeg: true })
    .toBuffer();

  const manifestEntry = {
    width: metadata.width,
    height: metadata.height,
    placeholder: `data:image/jpeg;base64,${placeholderBuffer.toString("base64")}`,
    variants,
  };

  return {
    key,
    filename,
    context: source.context,
    sizeBytes: imageBuffer.length,
    width: metadata.width,
    height: metadata.height,
    manifestEntry,
    // Old raw key from previous migration to clean up
    oldRawKey: `${source.context}/${extensionless.toLowerCase()}.${path.extname(filename).slice(1).toLowerCase()}`,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("\n🚀 Migrating images to R2 (with optimization)\n");

  // 1. DB migration
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("📦 Running DB migration...");
  const migrationSql = readFileSync(
    path.join(ROOT, "apps/server/src/db/manual-migrations/008-create-media.sql"),
    "utf8"
  );
  await client.query(migrationSql);
  console.log("  ✅ Migration complete\n");

  // 2. Optimize and upload each image
  console.log("📤 Optimizing and uploading...\n");
  const manifest = {};
  const results = [];

  for (const source of IMAGE_SOURCES) {
    console.log(`  📸 ${path.basename(source.localPath)}`);
    const result = await optimizeAndUpload(source);
    if (result) {
      manifest[result.key] = result.manifestEntry;
      results.push(result);

      // Clean up old raw upload
      await deleteOldRaw(result.oldRawKey);
    }
  }

  // 3. Upload manifest.json to R2
  console.log("\n📋 Uploading manifest.json...");
  const manifestJson = JSON.stringify(manifest, null, 2);
  await uploadBuffer("images/manifest.json", Buffer.from(manifestJson), "application/json");
  console.log("  ✅ Manifest uploaded\n");

  // 4. Register in DB
  console.log("💾 Registering media records...");
  for (const r of results) {
    const ext = path.extname(r.filename).toLowerCase();
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";
    const dbKey = `images/${r.key}`; // canonical key for DB

    const existing = await client.query("SELECT id FROM media WHERE key = $1", [dbKey]);
    if (existing.rows.length > 0) {
      console.log(`  ⏭️  Already in DB: ${dbKey}`);
      continue;
    }

    // Also clean up old raw media records
    const oldKeys = [
      `${r.context}/${r.filename.toLowerCase()}`,
      `${r.context}/${normalizeKey(path.parse(r.filename).name)}.${ext.slice(1)}`,
    ];
    await client.query("DELETE FROM media WHERE key = ANY($1)", [oldKeys]);

    const result = await client.query(
      `INSERT INTO media (key, filename, alt, mime_type, size_bytes, width, height, context)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [dbKey, r.filename, "", mimeType, r.sizeBytes, r.width, r.height, r.context]
    );
    console.log(`  ✅ ${dbKey} → id ${result.rows[0].id}`);
  }

  // 5. Print URL mapping
  console.log("\n📋 Content references should use these URLs:\n");
  for (const r of results) {
    // The src URL should point at the JPG fallback at original width
    const originalVariant = r.manifestEntry.variants.find((v) => v.width === r.width);
    const srcUrl = `${R2_PUBLIC_URL}${originalVariant?.jpg || `/images/${r.key}-${r.width}.jpg`}`;
    console.log(`   ${r.filename} → ${srcUrl}`);
  }
  console.log(`\n   Manifest: ${R2_PUBLIC_URL}/images/manifest.json`);

  await client.end();
  console.log("\n✅ Migration complete!\n");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
