/**
 * Build-time script: reads markdown frontmatter from all content apps
 * and writes dist/meta-manifest.json for use by serve.mjs at runtime.
 *
 * Run after `vite build` as part of the host build step.
 */

import fs from "node:fs/promises";
import path from "node:path";

const workspaceRoot = path.resolve(import.meta.dirname, "../../..");
const hostDistDir = path.resolve(import.meta.dirname, "../dist");

// R2 public base URL — used to build absolute episode og:image URLs.
const R2_PUBLIC_URL = (
  process.env.R2_PUBLIC_URL || "https://pub-af583d95f0c543179e569e08a407bc5e.r2.dev"
).replace(/\/$/, "");

const TOP_LEVEL_ROUTE_TITLES = {
  ruleset: "Säännöt",
  episodes: "Jaksot",
  world: "Maailma",
  generator: "Hahmopaja",
};

const HOST_TITLE = "Eventuellit";

// ---------------------------------------------------------------------------
// Frontmatter parser (mirrors the one in the microfrontend App.tsx files)
// ---------------------------------------------------------------------------
function parseFrontmatter(md) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const data = {};
  let content = md;
  let frontmatter = "";

  if (match) {
    frontmatter = match[1];
    content = md.slice(match[0].length);

    const lines = frontmatter.split(/\r?\n/);
    let currentKey = null;
    let isBlock = false;
    let blockLines = [];

    for (const line of lines) {
      const topLevelMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);

      if (
        topLevelMatch &&
        (!isBlock || (line.trim() !== "" && !line.startsWith("  ") && !line.startsWith("\t")))
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
          data[key] = !Number.isNaN(Number(value)) && value !== "" ? Number(value) : value;
        }
      } else if (isBlock) {
        blockLines.push(line.replace(/^ {0,2}/, ""));
      }
    }

    if (isBlock && currentKey) {
      data[currentKey] = blockLines.join("\n").trim();
    }
  }

  return { data, content, frontmatter };
}

// Parse YAML list items under a key, e.g. the `images:` block in ruleset
function parseYamlList(frontmatter, key) {
  const re = new RegExp(`(?:^|\\r?\\n)${key}:\\s*\\r?\\n((?:[ \\t]*-\\s*.+\\r?\\n?)*)`, "");
  const match = frontmatter.match(re);
  if (!match) return [];
  return match[1]
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Image resolution helpers
// ---------------------------------------------------------------------------

/**
 * For episodes the image frontmatter value is a bare key (e.g. "jakso-1").
 * We resolve it to an absolute R2 URL using the manifest fetched from R2.
 *
 * Returns a full https:// URL so serve.mjs recognises it as absolute and
 * passes it through without any origin prepending.
 */
function resolveEpisodeImageUrl(key, episodesManifest) {
  if (!key) return null;
  const entry = episodesManifest[key];
  if (!entry || !entry.variants || entry.variants.length === 0) {
    // Fallback: assume the standard R2 naming convention at 1200px
    return `${R2_PUBLIC_URL}/images/${key}-1200.jpg`;
  }
  // Pick the variant closest to 1200px (ideal og:image width)
  const OG_TARGET = 1200;
  const sorted = [...entry.variants].sort(
    (a, b) => Math.abs(a.width - OG_TARGET) - Math.abs(b.width - OG_TARGET),
  );
  const variant = sorted[0];
  // variant.jpg is a relative path like "/images/jakso-1-1024.jpg" — prepend R2 base
  const jpgPath = variant.jpg ?? `/images/${key}-${variant.width}.jpg`;
  return `${R2_PUBLIC_URL}${jpgPath}`;
}

// ---------------------------------------------------------------------------
// Content sources
// ---------------------------------------------------------------------------
const SOURCES = [
  {
    app: "ruleset",
    contentDir: path.join(workspaceRoot, "apps/ruleset/src/content"),
    routePrefix: "/ruleset",
    sectionTitle: TOP_LEVEL_ROUTE_TITLES.ruleset,
    getImage: (data, frontmatter) => {
      const images = parseYamlList(frontmatter, "images");
      if (images.length > 0) return images[0];
      const legacy = typeof data.image === "string" ? data.image : null;
      return legacy;
    },
    imageOrigin: "ruleset",
  },
  {
    app: "episodes",
    contentDir: path.join(workspaceRoot, "apps/episodes/src/content"),
    routePrefix: "/episodes",
    sectionTitle: TOP_LEVEL_ROUTE_TITLES.episodes,
    getImage: null, // handled separately via R2 manifest
    imageOrigin: "episodes",
  },
  {
    app: "world",
    contentDir: path.join(workspaceRoot, "apps/world/src/content"),
    routePrefix: "/world",
    sectionTitle: TOP_LEVEL_ROUTE_TITLES.world,
    getImage: (data) => (typeof data.image === "string" ? data.image : null),
    imageOrigin: "world",
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const manifest = {};

  // Load episodes image manifest from R2 (the local copy was removed with the R2 migration).
  // Falls back to an empty object if the fetch fails; individual images will use the
  // R2 naming convention fallback in resolveEpisodeImageUrl.
  let episodesManifest = {};
  try {
    const response = await fetch(`${R2_PUBLIC_URL}/images/manifest.json`);
    if (response.ok) {
      episodesManifest = await response.json();
      console.log(`Loaded episodes manifest from R2 with ${Object.keys(episodesManifest).length} entries.`);
    } else {
      console.warn(`Could not fetch episodes manifest from R2 (status ${response.status}) — episode images will use fallback URLs.`);
    }
  } catch (err) {
    console.warn(`Could not fetch episodes manifest from R2 — episode images will use fallback URLs. (${err.message})`);
  }

  for (const source of SOURCES) {
    let files;
    try {
      // Use recursive: true to discover files in subdirectories (e.g. world/content/kynnys/*.md)
      files = await fs.readdir(source.contentDir, { recursive: true });
    } catch {
      console.warn(`Content directory not found: ${source.contentDir}`);
      continue;
    }

    const mdFiles = files
      .filter((f) => f.endsWith(".md"))
      // Normalize Windows backslashes to forward slashes
      .map((f) => f.replace(/\\/g, "/"));

    for (const file of mdFiles) {
      const raw = await fs.readFile(path.join(source.contentDir, file), "utf-8");
      const { data, frontmatter } = parseFrontmatter(raw);

      // For nested paths like "kynnys/01-seula.md", produce route "/world/kynnys/01-seula"
      const slug = file.replace(/\.md$/, "").toLowerCase();
      const routePath = `${source.routePrefix}/${slug}`;

      const pageTitle = typeof data.title === "string" ? data.title : slug;
      const title = `${HOST_TITLE}: ${source.sectionTitle} - ${pageTitle}`;
      const description =
        typeof data.description === "string" && data.description ? data.description : null;

      let image = null;
      if (source.app === "episodes") {
        const key = typeof data.image === "string" ? data.image : null;
        image = resolveEpisodeImageUrl(key, episodesManifest);
      } else if (source.getImage) {
        image = source.getImage(data, frontmatter);
      }

      manifest[routePath] = {
        title,
        description,
        image: image ?? null,
        // imageOrigin is only relevant for relative image paths (relative to a remote MFE).
        // Absolute R2 URLs (episodes) and world/ruleset full URLs need no origin prefix.
        imageOrigin: image ? source.imageOrigin : null,
      };
    }
  }

  // Also add top-level section routes that have no content file
  for (const [key, sectionTitle] of Object.entries(TOP_LEVEL_ROUTE_TITLES)) {
    const routePath = `/${key}`;
    if (!manifest[routePath]) {
      manifest[routePath] = {
        title: `${HOST_TITLE}: ${sectionTitle}`,
        description: null,
        image: null,
        imageOrigin: null,
      };
    }
  }

  await fs.mkdir(hostDistDir, { recursive: true });
  const outPath = path.join(hostDistDir, "meta-manifest.json");
  await fs.writeFile(outPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Wrote meta-manifest.json with ${Object.keys(manifest).length} routes to ${outPath}`);
}

main().catch((err) => {
  console.error("generate-meta failed:", err);
  process.exit(1);
});
