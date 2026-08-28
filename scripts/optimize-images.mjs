/**
 * HER HOMES CO. — IMAGE BUILD
 * =====================================================================
 * Produces three things the site needs and could not previously ship:
 *
 * 1. assets/media/og-cover.jpg  (1200x630)
 *    The image WhatsApp / Facebook / LinkedIn show when someone shares
 *    the link. It used to point at the logo, which is 454x652 — a
 *    portrait image in a landscape slot, so every preview cropped it
 *    into an unreadable strip. For a business whose entire funnel is
 *    "someone forwards the link", that preview is the advert.
 *
 * 2. Real favicons + PWA icons, squared onto the brand cream so the
 *    portrait logo mark isn't stretched into a square hole:
 *      favicon.ico (16/32/48), assets/icon-192.png, assets/icon-512.png,
 *      assets/apple-touch-icon.png (180, no alpha — iOS renders
 *      transparency as black).
 *
 * 3. .webp next to every style-world photo. The originals are
 *    straight-from-source JPEGs (one is half a megabyte); WebP at q80
 *    lands around a quarter of that at the same visible quality. The
 *    JPEG stays as the <picture> fallback, so nothing is thrown away
 *    and nothing breaks on an old browser.
 *
 * Idempotent: re-running only rewrites derived files, never a source.
 *
 *   npm run build:images
 * =====================================================================
 */

import sharp from "sharp";
import { readdirSync, existsSync, writeFileSync, statSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, basename } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MEDIA = join(ROOT, "assets", "media");
const ASSETS = join(ROOT, "assets");

const BRAND_CREAM = { r: 0xff, g: 0xf8, b: 0xf0, alpha: 1 }; // --color-surface
const kb = (p) => (statSync(p).size / 1024).toFixed(0) + " KB";

if (!existsSync(MEDIA)) mkdirSync(MEDIA, { recursive: true });

/* ------------------------------------------------------------------ *
 * 1 — Open Graph share card
 * ------------------------------------------------------------------ */
async function buildOgCover() {
  const src = join(MEDIA, "hero-poster-desktop.jpg");
  const out = join(MEDIA, "og-cover.jpg");
  if (!existsSync(src)) {
    console.log("  ! skipped og-cover.jpg — assets/media/hero-poster-desktop.jpg is missing");
    return;
  }
  await sharp(src)
    // `cover` + `attention` crops to the most visually interesting region
    // rather than the geometric centre, which matters here because the
    // hero still is 1600x907 and loses real content top and bottom.
    .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(out);
  console.log("  og-cover.jpg           1200x630   " + kb(out));
}

/* ------------------------------------------------------------------ *
 * 2 — Icons
 * ------------------------------------------------------------------ */

/** The portrait logo mark, contained (never stretched) on a cream square. */
function squareLogo(size, { flatten = true } = {}) {
  const src = join(ASSETS, "logo-mark.png");
  const pad = Math.round(size * 0.14);
  let pipe = sharp(src)
    .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } });
  if (flatten) pipe = pipe.flatten({ background: BRAND_CREAM });
  return pipe.png();
}

/**
 * Build a .ico by wrapping PNGs. The ICO container has allowed embedded
 * PNG since Vista, which is the only reason this is a dozen lines rather
 * than a BMP encoder. Structure: ICONDIR(6) + ICONDIRENTRY(16) * n + data.
 */
function buildIco(pngs) {
  const count = pngs.length;
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type: 1 = icon
  dir.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + count * 16;
  pngs.forEach(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  });

  return Buffer.concat([dir, ...entries, ...pngs.map((p) => p.data)]);
}

async function buildIcons() {
  if (!existsSync(join(ASSETS, "logo-mark.png"))) {
    console.log("  ! skipped icons — assets/logo-mark.png is missing");
    return;
  }

  for (const size of [192, 512]) {
    const out = join(ASSETS, `icon-${size}.png`);
    await squareLogo(size).toFile(out);
    console.log(`  icon-${size}.png`.padEnd(24) + `${size}x${size}`.padEnd(11) + kb(out));
  }

  // iOS composites the touch icon onto a black backdrop if it has alpha,
  // so this one is explicitly flattened onto the cream.
  const apple = join(ASSETS, "apple-touch-icon.png");
  await squareLogo(180).toFile(apple);
  console.log("  apple-touch-icon.png   180x180    " + kb(apple));

  const pngs = [];
  for (const size of [16, 32, 48]) {
    pngs.push({ size, data: await squareLogo(size).toBuffer() });
  }
  const ico = join(ROOT, "favicon.ico");
  writeFileSync(ico, buildIco(pngs));
  console.log("  favicon.ico            16/32/48   " + kb(ico));
}

/* ------------------------------------------------------------------ *
 * 3 — WebP alongside every photo
 * ------------------------------------------------------------------ */
async function buildWebp() {
  const files = readdirSync(MEDIA).filter(
    (f) => [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase()) && !f.startsWith("og-")
  );
  let saved = 0;
  for (const f of files) {
    const src = join(MEDIA, f);
    const out = join(MEDIA, basename(f, extname(f)) + ".webp");
    await sharp(src).webp({ quality: 80, effort: 5 }).toFile(out);
    const before = statSync(src).size;
    const after = statSync(out).size;
    saved += before - after;
    console.log(
      "  " + basename(out).padEnd(23) +
      (kb(src) + " -> " + kb(out)).padEnd(22) +
      "-" + Math.round((1 - after / before) * 100) + "%"
    );
  }
  console.log("  ----");
  console.log("  saved " + (saved / 1024 / 1024).toFixed(2) + " MB across " + files.length + " images");
}

/* ------------------------------------------------------------------ *
 * Dimensions report — paste these into mediaSlots in js/data.js so the
 * <img> can reserve its box and the layout never jumps.
 * ------------------------------------------------------------------ */
async function reportDimensions() {
  const files = readdirSync(MEDIA).filter((f) => [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase()));
  for (const f of files) {
    const m = await sharp(join(MEDIA, f)).metadata();
    console.log("  " + f.padEnd(28) + m.width + "x" + m.height);
  }
}

console.log("\nOpen Graph share card");
await buildOgCover();
console.log("\nIcons");
await buildIcons();
console.log("\nWebP");
await buildWebp();
console.log("\nIntrinsic dimensions (for mediaSlots width/height in js/data.js)");
await reportDimensions();
console.log("");
