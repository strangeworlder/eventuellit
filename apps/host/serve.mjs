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

// R2 public base URL — used for the og:image fallback default.
const R2_PUBLIC_URL = (
  process.env.R2_PUBLIC_URL || "https://pub-af583d95f0c543179e569e08a407bc5e.r2.dev"
).replace(/\/$/, "");

// ---------------------------------------------------------------------------
// Meta injection helpers
// ---------------------------------------------------------------------------

/**
 * Resolve an og:image to an absolute URL.
 *
 * - If the image is already an absolute URL (e.g. a full R2 URL stored in frontmatter),
 *   return it as-is — do NOT prepend any origin.
 * - If the image is a relative path and a remote service origin env var is set, prepend that.
 * - Otherwise fall back to the R2-hosted default og:image (1200px JPG).
 */
function resolveImageUrl(entry, hostOrigin) {
  if (entry?.image) {
    // Already an absolute URL — pass through as-is.
    if (entry.image.startsWith("http://") || entry.image.startsWith("https://")) {
      return entry.image;
    }

    // Relative path: resolve against the remote service origin when available.
    if (entry.imageOrigin && remoteOrigins[entry.imageOrigin]) {
      const origin = remoteOrigins[entry.imageOrigin].replace(/\/$/, "");
      const imgPath = entry.image.startsWith("/") ? entry.image : `/${entry.image}`;
      return `${origin}${imgPath}`;
    }

    // Remote origin env var missing — fall back to host origin.
    if (entry.imageOrigin && !remoteOrigins[entry.imageOrigin]) {
      console.warn(
        `Missing remote origin env var for "${entry.imageOrigin}" — falling back to host for og:image`,
      );
    }
    return `${hostOrigin}${entry.image}`;
  }

  // No image for this route — use the R2-hosted default.
  return `${R2_PUBLIC_URL}/images/og-default-1200.jpg`;
}

/**
 * Inject per-route Open Graph and Twitter Card meta tags into the HTML template.
 * Replaces the placeholder values placed in index.html at build time.
 */
function injectMetaTags(html, entry, hostOrigin, pathname) {
  if (!entry) return html;

  const title = entry.title || "Eventuellit";
  const description =
    entry.description || "Pöytäroolipeli kapinasta aurinkokuntaa hallitsevaa tyrannia vastaan.";
  const imageUrl = resolveImageUrl(entry, hostOrigin);

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function replaceAttr(tag, attr, newValue) {
    // Replace the content/href attribute value in the matching tag
    return tag.replace(new RegExp(`(${attr}=")[^"]*(")`), `$1${escapeAttr(newValue)}$2`);
  }

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);

  // Replace each meta tag by finding the tag that contains the right name/property,
  // then swapping out its content attribute.
  const metaReplacements = [
    {
      selector: /(<meta\s+name="description"[^>]*?)(\s*\/>|>)/,
      attr: "content",
      value: description,
    },
    { selector: /(<meta\s+property="og:title"[^>]*?)(\s*\/>|>)/, attr: "content", value: title },
    {
      selector: /(<meta\s+property="og:description"[^>]*?)(\s*\/>|>)/,
      attr: "content",
      value: description,
    },
    { selector: /(<meta\s+property="og:image"[^>]*?)(\s*\/>|>)/, attr: "content", value: imageUrl },
    { selector: /(<meta\s+name="twitter:title"[^>]*?)(\s*\/>|>)/, attr: "content", value: title },
    {
      selector: /(<meta\s+name="twitter:description"[^>]*?)(\s*\/>|>)/,
      attr: "content",
      value: description,
    },
    {
      selector: /(<meta\s+name="twitter:image"[^>]*?)(\s*\/>|>)/,
      attr: "content",
      value: imageUrl,
    },
  ];

  for (const { selector, attr, value } of metaReplacements) {
    html = html.replace(selector, (match, tagOpen, closing) => {
      return replaceAttr(tagOpen, attr, value) + closing;
    });
  }

  // Set og:url to the canonical absolute URL for this route (origin + pathname)
  if (html.includes('property="og:url"')) {
    const canonicalUrl = pathname && pathname !== "/" ? `${hostOrigin}${pathname}` : hostOrigin;
    html = html.replace(
      /(<meta\s+property="og:url"[^>]*?)(\s*\/>|>)/,
      (match, tagOpen, closing) => replaceAttr(tagOpen, "content", canonicalUrl) + closing,
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
      process.env.BASE_URL || `${url.protocol}//${req.headers.host || "localhost"}`;

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

    const html = injectMetaTags(htmlTemplate, entry, hostOrigin, pathname);

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
