import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const workspaceRoot = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(workspaceRoot, "public", "images");
const outputDir = path.join(workspaceRoot, "public", "images");
const manifestPath = path.join(outputDir, "manifest.json");
const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const responsiveWidths = [480, 768, 1200];

function normalizeKey(filename) {
  return filename.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function getOutputFileName(key, width, extension) {
  return `${key}-${width}.${extension}`;
}

function isGeneratedVariant(fileName) {
  return /-\d+\.(avif|webp|jpg)$/i.test(fileName);
}

async function writeFormatVariants(imagePath, key, width) {
  const resized = sharp(imagePath).resize({
    width,
    withoutEnlargement: true,
  });

  const avifName = getOutputFileName(key, width, "avif");
  const webpName = getOutputFileName(key, width, "webp");
  const jpgName = getOutputFileName(key, width, "jpg");

  await Promise.all([
    resized.clone().avif({ quality: 45 }).toFile(path.join(outputDir, avifName)),
    resized.clone().webp({ quality: 70 }).toFile(path.join(outputDir, webpName)),
    resized.clone().jpeg({ quality: 75, mozjpeg: true }).toFile(path.join(outputDir, jpgName)),
  ]);

  return {
    avif: `/images/${avifName}`,
    webp: `/images/${webpName}`,
    jpg: `/images/${jpgName}`,
  };
}

async function buildManifest() {
  await ensureDir(outputDir);

  let sourceEntries;
  try {
    sourceEntries = await fs.readdir(sourceDir, { withFileTypes: true });
  } catch {
    console.warn(`[optimize-images] source directory not found: ${sourceDir}`);
    await fs.writeFile(manifestPath, JSON.stringify({}, null, 2), "utf8");
    return;
  }

  const files = sourceEntries.filter((entry) => {
    if (!entry.isFile()) {
      return false;
    }
    if (entry.name === "manifest.json" || isGeneratedVariant(entry.name)) {
      return false;
    }
    const extension = path.extname(entry.name).toLowerCase();
    return allowedExtensions.has(extension);
  });

  const manifest = {};

  for (const file of files) {
    const fullPath = path.join(sourceDir, file.name);
    const extensionless = path.parse(file.name).name;
    const key = normalizeKey(extensionless);

    const image = sharp(fullPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      console.warn(`[optimize-images] skipped ${file.name} (missing dimensions)`);
      continue;
    }

    const targetWidths = responsiveWidths.filter((width) => width <= metadata.width);
    if (targetWidths.length === 0) {
      targetWidths.push(metadata.width);
    }
    if (!targetWidths.includes(metadata.width)) {
      targetWidths.push(metadata.width);
    }

    const variants = [];
    for (const width of targetWidths) {
      variants.push({
        width,
        ...(await writeFormatVariants(fullPath, key, width)),
      });
    }

    const placeholderBuffer = await image
      .clone()
      .resize({ width: 24 })
      .jpeg({ quality: 40, mozjpeg: true })
      .toBuffer();

    manifest[key] = {
      width: metadata.width,
      height: metadata.height,
      placeholder: `data:image/jpeg;base64,${placeholderBuffer.toString("base64")}`,
      variants,
    };
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[optimize-images] wrote manifest: ${manifestPath}`);
}

buildManifest().catch((error) => {
  console.error("[optimize-images] failed", error);
  process.exitCode = 1;
});
