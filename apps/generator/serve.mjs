#!/usr/bin/env node
import { createServer } from "node:http";
import sirv from "sirv";

const handler = sirv("dist", {
  etag: true,
  single: true,
  setHeaders(res, pathname) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (pathname === "/index.html" || pathname.endsWith("remoteEntry.js")) {
      res.setHeader("Cache-Control", "no-cache");
    } else {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  },
});

const port = process.env.PORT || 3000;
createServer(handler).listen(port, "0.0.0.0", () => {
  console.log(`> Serving on http://0.0.0.0:${port}`);
});
