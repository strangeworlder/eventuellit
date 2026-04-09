/**
 * build-icons.mjs
 *
 * Compiles all SVG files in src/custom-icons/ into:
 *   - src/generated/icons-custom.svg   — SVG sprite sheet (<symbol> per icon)
 *   - src/generated/custom-icon-names.ts — TypeScript string-literal union
 *
 * ViewBox normalization:
 *   Uses svg-path-bbox to compute the true ink bounding box (including proper
 *   Bezier curve extents) for each path element. Also handles polygon, rect,
 *   circle, ellipse, and line elements. Produces a square viewBox centered on
 *   the content with 5% padding. Source files do not need consistent artboard
 *   sizes — any Illustrator artboard is fine.
 *
 * Run: node scripts/build-icons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, basename, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { svgPathBbox } from "svg-path-bbox";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const INPUT_DIR = join(ROOT, "src", "custom-icons");
const OUTPUT_DIR = join(ROOT, "src", "generated");
const SPRITE_OUT  = join(OUTPUT_DIR, "icons-custom.svg");
const NAMES_OUT   = join(OUTPUT_DIR, "custom-icon-names.ts");

// ─── SVG helpers ─────────────────────────────────────────────────────────────

/** Extract the viewBox from an SVG string → [minX, minY, width, height] or null. */
function parseViewBox(svg) {
  const m = svg.match(/viewBox=["']([^"']+)["']/);
  if (!m) return null;
  return m[1].split(/[\s,]+/).map(Number);
}

/** Merge an array of [minX, minY, maxX, maxY] tuples into one encompassing bbox. */
function mergeBBoxes(boxes) {
  const valid = boxes.filter(Boolean);
  if (valid.length === 0) return null;
  return [
    Math.min(...valid.map((b) => b[0])),
    Math.min(...valid.map((b) => b[1])),
    Math.max(...valid.map((b) => b[2])),
    Math.max(...valid.map((b) => b[3])),
  ];
}

/**
 * Compute the true ink bounding box from all drawable elements in the SVG.
 * Returns [minX, minY, maxX, maxY] or null.
 */
function computeContentBBox(svgContent) {
  const boxes = [];

  // <path d="..."> — delegated to svg-path-bbox for proper Bezier handling
  const pathRe = /\bd=["']([^"']+)["']/g;
  let m;
  while ((m = pathRe.exec(svgContent)) !== null) {
    try { boxes.push(svgPathBbox(m[1])); } catch { /* skip malformed path */ }
  }

  // <polygon points="..."> / <polyline points="...">
  const polyRe = /\bpoints=["']([^"']+)["']/g;
  while ((m = polyRe.exec(svgContent)) !== null) {
    const nums = m[1].trim().split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    const xs = nums.filter((_, i) => i % 2 === 0);
    const ys = nums.filter((_, i) => i % 2 === 1);
    if (xs.length) boxes.push([Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]);
  }

  // <rect x y width height>
  const rectRe = /<rect([^>]*)>/g;
  while ((m = rectRe.exec(svgContent)) !== null) {
    const attrs = m[1];
    const rx = parseFloat(attrs.match(/\bx=["']([^"']+)["']/)?.[1] ?? "0");
    const ry = parseFloat(attrs.match(/\by=["']([^"']+)["']/)?.[1] ?? "0");
    const rw = parseFloat(attrs.match(/\bwidth=["']([^"']+)["']/)?.[1] ?? "0");
    const rh = parseFloat(attrs.match(/\bheight=["']([^"']+)["']/)?.[1] ?? "0");
    if (rw > 0 && rh > 0) boxes.push([rx, ry, rx + rw, ry + rh]);
  }

  // <circle cx cy r>
  const circleRe = /<circle([^>]*)>/g;
  while ((m = circleRe.exec(svgContent)) !== null) {
    const attrs = m[1];
    const ccx = parseFloat(attrs.match(/\bcx=["']([^"']+)["']/)?.[1] ?? "0");
    const ccy = parseFloat(attrs.match(/\bcy=["']([^"']+)["']/)?.[1] ?? "0");
    const cr  = parseFloat(attrs.match(/\br=["']([^"']+)["']/)?.[1]  ?? "0");
    if (cr > 0) boxes.push([ccx - cr, ccy - cr, ccx + cr, ccy + cr]);
  }

  // <ellipse cx cy rx ry>
  const ellipseRe = /<ellipse([^>]*)>/g;
  while ((m = ellipseRe.exec(svgContent)) !== null) {
    const attrs = m[1];
    const ecx = parseFloat(attrs.match(/\bcx=["']([^"']+)["']/)?.[1] ?? "0");
    const ecy = parseFloat(attrs.match(/\bcy=["']([^"']+)["']/)?.[1] ?? "0");
    const erx = parseFloat(attrs.match(/\brx=["']([^"']+)["']/)?.[1] ?? "0");
    const ery = parseFloat(attrs.match(/\bry=["']([^"']+)["']/)?.[1] ?? "0");
    if (erx > 0 && ery > 0) boxes.push([ecx - erx, ecy - ery, ecx + erx, ecy + ery]);
  }

  // <line x1 y1 x2 y2>
  const lineRe = /<line([^>]*)>/g;
  while ((m = lineRe.exec(svgContent)) !== null) {
    const attrs = m[1];
    const x1 = parseFloat(attrs.match(/\bx1=["']([^"']+)["']/)?.[1] ?? "0");
    const y1 = parseFloat(attrs.match(/\by1=["']([^"']+)["']/)?.[1] ?? "0");
    const x2 = parseFloat(attrs.match(/\bx2=["']([^"']+)["']/)?.[1] ?? "0");
    const y2 = parseFloat(attrs.match(/\by2=["']([^"']+)["']/)?.[1] ?? "0");
    boxes.push([Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)]);
  }

  return mergeBBoxes(boxes);
}

/**
 * Return a square viewBox string centered on the ink content with 5% padding.
 * Falls back to centering the artboard if no parseable content is found.
 */
function computeNormalizedViewBox(svgContent, originalViewBox) {
  const bb = computeContentBBox(svgContent);

  if (bb) {
    const [x0, y0, x1, y1] = bb;
    const w = x1 - x0;
    const h = y1 - y0;
    const side = Math.max(w, h);
    const pad  = side * 0.05;
    const paddedSide = side + pad * 2;
    const cx = x0 + w / 2;
    const cy = y0 + h / 2;
    return `${(cx - paddedSide / 2).toFixed(2)} ${(cy - paddedSide / 2).toFixed(2)} ${paddedSide.toFixed(2)} ${paddedSide.toFixed(2)}`;
  }

  // Fallback: center the artboard in a square.
  console.warn("  ⚠️  Could not detect ink bounds — centering artboard viewBox.");
  if (!originalViewBox) return "0 0 100 100";
  const [ax, ay, aw, ah] = originalViewBox;
  const side = Math.max(aw, ah);
  const cx = ax + aw / 2;
  const cy = ay + ah / 2;
  return `${(cx - side / 2).toFixed(2)} ${(cy - side / 2).toFixed(2)} ${side.toFixed(2)} ${side.toFixed(2)}`;
}

/** Strip the XML declaration, AI generator comment, and outer <svg> wrapper. */
function extractInnerContent(svg) {
  return svg
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>/i, "")
    .trim();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

mkdirSync(OUTPUT_DIR, { recursive: true });

const svgFiles = readdirSync(INPUT_DIR)
  .filter((f) => extname(f).toLowerCase() === ".svg")
  .sort();

if (svgFiles.length === 0) {
  console.warn("⚠️  No SVG files found in", INPUT_DIR);
  writeFileSync(SPRITE_OUT, [
    `<!-- Auto-generated by scripts/build-icons.mjs — do not edit manually -->`,
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:none">`,
    `</svg>`,
  ].join("\n"), "utf8");
  writeFileSync(NAMES_OUT, [
    `// Auto-generated by scripts/build-icons.mjs — do not edit manually`,
    `export type CustomIconName = never;`,
    ``,
    `export const customIconNames: CustomIconName[] = [];`,
    ``,
  ].join("\n"), "utf8");
  console.log(`\n✅ Empty sprite → ${SPRITE_OUT}`);
  console.log(`✅ Empty name union → ${NAMES_OUT}`);
  process.exit(0);
}

const symbols   = [];
const iconNames = [];

for (const file of svgFiles) {
  const name = basename(file, ".svg");
  const raw  = readFileSync(join(INPUT_DIR, file), "utf8");

  const originalViewBox = parseViewBox(raw);
  const innerContent    = extractInnerContent(raw);
  const viewBox         = computeNormalizedViewBox(raw, originalViewBox);

  symbols.push([
    `  <symbol id="icon-${name}" viewBox="${viewBox}" fill="currentColor">`,
    `    ${innerContent.replace(/\n/g, "\n    ")}`,
    `  </symbol>`,
  ].join("\n"));

  iconNames.push(name);
  console.log(`  ✓ ${file}  →  icon-${name}  (viewBox: ${viewBox})`);
}

// Sprite sheet
writeFileSync(SPRITE_OUT, [
  `<!-- Auto-generated by scripts/build-icons.mjs — do not edit manually -->`,
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:none">`,
  ...symbols,
  `</svg>`,
].join("\n"), "utf8");
console.log(`\n✅ Sprite sheet → ${SPRITE_OUT}`);

// TypeScript name union
writeFileSync(NAMES_OUT, [
  `// Auto-generated by scripts/build-icons.mjs — do not edit manually`,
  `export type CustomIconName =`,
  iconNames.map((n, i) => `  | "${n}"${i === iconNames.length - 1 ? ";" : ""}`).join("\n"),
  ``,
  `export const customIconNames: CustomIconName[] = [`,
  iconNames.map((n) => `  "${n}",`).join("\n"),
  `];`,
  ``,
].join("\n"), "utf8");
console.log(`✅ Name union     → ${NAMES_OUT}`);
console.log(`\nIcons compiled: ${iconNames.join(", ")}`);
