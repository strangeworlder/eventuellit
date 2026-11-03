/**
 * Self-contained production build orchestrator for apps/host.
 *
 * 1. Builds @repo/ui once.
 * 2. Builds each federated remote MFE (generator, ruleset, episodes, world)
 *    sequentially to keep peak build memory low.
 * 3. Builds apps/host.
 * 4. Copies each remote's dist/ into apps/host/dist/_remotes/<remote>/ so
 *    apps/host/serve.mjs can serve all frontend bundles from a single container.
 * 5. Generates apps/host/dist/meta-manifest.json for OpenGraph meta tag injection.
 */

import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const hostDir = path.resolve(import.meta.dirname, "..");
const workspaceRoot = path.resolve(hostDir, "../..");
const hostDistDir = path.join(hostDir, "dist");

const REMOTES = ["generator", "ruleset", "episodes", "world"];

function run(command, cwd, label) {
  console.log(`\n── [${label}] ${command}`);
  execSync(command, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS || "--max-old-space-size=512",
    },
  });
}

// 1. Build @repo/ui once
run("npm run build --workspace=@repo/ui", workspaceRoot, "@repo/ui");

// 2. Build each remote sequentially (reuse only if built within the last 2 minutes by a parent turbo run)
const FRESH_THRESHOLD_MS = 120_000;
for (const remote of REMOTES) {
  const remoteDir = path.join(workspaceRoot, "apps", remote);
  const remoteEntry = path.join(remoteDir, "dist", "assets", "entry.js");
  const isFresh =
    existsSync(remoteEntry) && Date.now() - statSync(remoteEntry).mtimeMs < FRESH_THRESHOLD_MS;
  if (!isFresh) {
    run("npx tsc -b && npx vite build", remoteDir, `@eventuellit/${remote}`);
  } else {
    console.log(`\n── [@eventuellit/${remote}] Reusing fresh dist/assets/entry.js`);
  }
}

// 3. Build host
run("npx tsc -b && npx vite build", hostDir, "@eventuellit/host");

// 4. Copy each remote's dist/ into apps/host/dist/_remotes/<remote>/
const remotesRootDir = path.join(hostDistDir, "_remotes");
rmSync(remotesRootDir, { recursive: true, force: true });

for (const remote of REMOTES) {
  const remoteDistDir = path.join(workspaceRoot, "apps", remote, "dist");
  const targetDir = path.join(remotesRootDir, remote);
  mkdirSync(targetDir, { recursive: true });
  cpSync(remoteDistDir, targetDir, { recursive: true });
  console.log(`Copied apps/${remote}/dist → apps/host/dist/_remotes/${remote}`);
}

// 5. Generate route meta manifest
run("node scripts/generate-meta.mjs", hostDir, "meta-manifest");
