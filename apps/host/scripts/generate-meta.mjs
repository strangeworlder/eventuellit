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
 * We resolve it to the largest jpg variant using the episodes manifest.json.
 */
async function resolveEpisodeImagePath(key, episodesManifest) {
  if (!key) return null;
  const entry = episodesManifest[key];
  if (!entry || !entry.variants || entry.variants.length === 0) {
    return `/images/${key}.jpg`;
  }
  // Pick the widest variant that has a jpg
  const sorted = [...entry.variants].sort((a, b) => b.width - a.width);
  return sorted[0].jpg ?? `/images/${key}.jpg`;
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
    getImage: null, // handled separately via manifest
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

  // Load episodes image manifest once
  let episodesManifest = {};
  try {
    const raw = await fs.readFile(
      path.join(workspaceRoot, "apps/episodes/public/images/manifest.json"),
      "utf-8",
    );
    episodesManifest = JSON.parse(raw);
  } catch {
    console.warn("Could not read episodes image manifest — episode images will be estimated.");
  }

  for (const source of SOURCES) {
    let files;
    try {
      files = await fs.readdir(source.contentDir);
    } catch {
      console.warn(`Content directory not found: ${source.contentDir}`);
      continue;
    }

    const mdFiles = files.filter((f) => f.endsWith(".md"));

    for (const file of mdFiles) {
      const raw = await fs.readFile(path.join(source.contentDir, file), "utf-8");
      const { data, frontmatter } = parseFrontmatter(raw);

      const slug = file.replace(/\.md$/, "").toLowerCase();
      const routePath = `${source.routePrefix}/${slug}`;

      const pageTitle = typeof data.title === "string" ? data.title : slug;
      const title = `${HOST_TITLE}: ${source.sectionTitle} - ${pageTitle}`;
      const description = typeof data.description === "string" && data.description ? data.description : null;

      let image = null;
      if (source.app === "episodes") {
        const key = typeof data.image === "string" ? data.image : null;
        image = await resolveEpisodeImagePath(key, episodesManifest);
      } else if (source.getImage) {
        image = source.getImage(data, frontmatter);
      }

      manifest[routePath] = {
        title,
        description,
        image: image ?? null,
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
