#!/usr/bin/env node
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sirv from "sirv";

const distDir = join(import.meta.dirname, "dist");

// ---------------------------------------------------------------------------
// Load HTML template and meta manifest at startup
// ---------------------------------------------------------------------------
const htmlTemplate = readFileSync(join(distDir, "index.html"), "utf-8");

let metaManifest = {};
const manifestPath = join(distDir, "meta-manifest.json");
if (existsSync(manifestPath)) {
  try {
    metaManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  } catch (err) {
    console.warn("Could not parse meta-manifest.json:", err.message);
  }
} else {
  console.warn("meta-manifest.json not found — per-route meta tags will not be injected.");
}

// Remote service origins, injected at runtime on Railway via env vars.
// The VITE_* versions are baked into the JS bundle at build time;
// the non-prefixed versions here are only for server-side image URL resolution.
const remoteOrigins = {
  ruleset: process.env.RULESET_URL || process.env.VITE_RULESET_URL || "",
  episodes: process.env.EPISODES_URL || process.env.VITE_EPISODES_URL || "",
  world: process.env.WORLD_URL || process.env.VITE_WORLD_URL || "",
};

// ---------------------------------------------------------------------------
// Meta injection helpers
// ---------------------------------------------------------------------------

/**
 * Resolve an og:image to an absolute URL.
 * - If the page has an image with a known origin, prepend that service's URL.
 * - Otherwise fall back to the host-local default image.
 */
function resolveImageUrl(entry, hostOrigin) {
  if (entry?.image && entry?.imageOrigin && remoteOrigins[entry.imageOrigin]) {
    const origin = remoteOrigins[entry.imageOrigin].replace(/\/$/, "");
    const imgPath = entry.image.startsWith("/") ? entry.image : `/${entry.image}`;
    return `${origin}${imgPath}`;
  }
  if (entry?.image && !entry?.imageOrigin) {
    // Image path is host-local (e.g. og-default.jpg)
    return `${hostOrigin}${entry.image}`;
  }
  return `${hostOrigin}/images/og-default.jpg`;
}

/**
 * Inject per-route Open Graph and Twitter Card meta tags into the HTML template.
 * Replaces the placeholder values placed in index.html at build time.
 */
function injectMetaTags(html, entry, hostOrigin) {
  if (!entry) return html;

  const title = entry.title || "Eventuellit";
  const description =
    entry.description ||
    "Pöytäroolipeli kapinasta aurinkokuntaa hallitsevaa tyrannia vastaan.";
  const imageUrl = resolveImageUrl(entry, hostOrigin);

  function replaceAttr(tag, attr, newValue) {
    // Replace content/href attribute value in the first matching tag
    return tag.replace(new RegExp(`(${attr}=")[^"]*(")`), `$1${escapeAttr(newValue)}$2`);
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);

  // Replace each meta tag by finding the tag that contains the right name/property,
  // then swapping out its content attribute.
  const metaReplacements = [
    { selector: /(<meta\s+name="description"[^>]*?)(\s*\/>|>)/, attr: "content", value: description },
    { selector: /(<meta\s+property="og:title"[^>]*?)(\s*\/>|>)/, attr: "content", value: title },
    { selector: /(<meta\s+property="og:description"[^>]*?)(\s*\/>|>)/, attr: "content", value: description },
    { selector: /(<meta\s+property="og:image"[^>]*?)(\s*\/>|>)/, attr: "content", value: imageUrl },
    { selector: /(<meta\s+name="twitter:title"[^>]*?)(\s*\/>|>)/, attr: "content", value: title },
    { selector: /(<meta\s+name="twitter:description"[^>]*?)(\s*\/>|>)/, attr: "content", value: description },
    { selector: /(<meta\s+name="twitter:image"[^>]*?)(\s*\/>|>)/, attr: "content", value: imageUrl },
  ];

  for (const { selector, attr, value } of metaReplacements) {
    html = html.replace(selector, (match, tagOpen, closing) => {
      return replaceAttr(tagOpen, attr, value) + closing;
    });
  }

  // Also set og:url to the canonical absolute path
  if (html.includes('property="og:url"')) {
    html = html.replace(
      /(<meta\s+property="og:url"[^>]*?)(\s*\/>|>)/,
      (match, tagOpen, closing) => replaceAttr(tagOpen, "content", hostOrigin) + closing,
    );
  }

  return html;
}

// ---------------------------------------------------------------------------
// sirv for static assets (JS, CSS, images, etc.)
// ---------------------------------------------------------------------------
const staticHandler = sirv(distDir, {
  etag: true,
  single: false, // we handle SPA fallback ourselves below
  setHeaders(res, pathname) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const isHashedAsset =
      pathname.startsWith("/assets/") &&
      !pathname.endsWith("remoteEntry.js") &&
      !pathname.endsWith("entry.js");
    if (isHashedAsset) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      res.setHeader("Cache-Control", "no-cache");
    }
  },
});

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------
function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;
  const accept = req.headers.accept || "";

  // Serve static assets via sirv (anything that looks like a file with an extension)
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);
  if (hasFileExtension) {
    staticHandler(req, res, () => {
      res.writeHead(404);
      res.end("Not found");
    });
    return;
  }

  // For HTML navigation requests (browsers and crawlers), inject meta tags
  if (accept.includes("text/html") || accept.includes("*/*") || !accept) {
    const hostOrigin =
      process.env.BASE_URL ||
      `${url.protocol}//${req.headers.host || "localhost"}`;

    // Look up the manifest for this exact path, then try progressively shorter prefixes
    let entry = metaManifest[pathname];
    if (!entry) {
      // Try parent paths for nested routes (e.g. /ruleset/mekaniikat/section → /ruleset/mekaniikat)
      const segments = pathname.split("/").filter(Boolean);
      while (segments.length > 0 && !entry) {
        segments.pop();
        entry = metaManifest[`/${segments.join("/")}`];
      }
    }

    const html = injectMetaTags(htmlTemplate, entry, hostOrigin);

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(html);
    return;
  }

  // Fallback to sirv
  staticHandler(req, res, () => {
    res.writeHead(404);
    res.end("Not found");
  });
}

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const port = process.env.PORT || 3000;
createServer(handler).listen(port, "0.0.0.0", () => {
  console.log(`> Serving on http://0.0.0.0:${port}`);
  if (Object.keys(metaManifest).length > 0) {
    console.log(`> Meta manifest loaded with ${Object.keys(metaManifest).length} routes`);
  }
});
