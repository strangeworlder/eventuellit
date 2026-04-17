#!/usr/bin/env node
import { createServer } from "node:http";
import sirv from "sirv";

const handler = sirv("dist", {
  etag: true,
  single: true,
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

const port = process.env.PORT || 3000;
createServer(handler).listen(port, "0.0.0.0", () => {
  console.log(`> Serving on http://0.0.0.0:${port}`);
});
