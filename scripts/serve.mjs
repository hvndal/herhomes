/**
 * Minimal static file server for local preview — `npm start`.
 *
 * Deliberately dependency-free: this site ships as plain files to GitHub
 * Pages, so the local preview shouldn't need a toolchain either. Opening
 * index.html over file:// mostly works but misquotes a few things (video
 * range requests, the manifest, relative fetches), so it is worth the
 * thirty lines to serve it properly over HTTP.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize, extname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT) || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  try {
    let rel = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (rel.endsWith("/")) rel += "index.html";
    // normalize() collapses any ../ before it can escape the site root.
    const path = join(ROOT, normalize(rel).replace(/^([/\\])+/, ""));
    if (!path.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }

    await stat(path);
    const body = await readFile(path);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(path).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(ROOT, "404.html"));
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }).end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("404");
    }
  }
}).listen(PORT, () => console.log(`Her Homes Co. — http://localhost:${PORT}`));
