/**
 * HER HOMES CO. — FETCH STOCK PHOTOGRAPHY
 * =====================================================================
 * Downloads the photographs this site uses from Pexels and crops them to
 * the shapes the layout needs:
 *
 *   - service-chooser panel backgrounds  900x1600  (tall, narrow panels)
 *   - style-world lookbook images       1400x2000  (matches the four
 *                                                   originally supplied)
 *
 * This is a SEPARATE, MANUAL script, not part of `npm run build`, for
 * two reasons: it needs network access (a build should not), and the
 * processed output is committed, so it only ever needs to run again when
 * somebody wants different photographs.
 *
 *   npm run fetch:stock
 *
 * LICENCE
 * ---------------------------------------------------------------------
 * All Pexels. The Pexels Licence allows free use including commercial,
 * permits modification, and does not require attribution. It does NOT
 * allow reselling unaltered copies, or using identifiable people in a
 * way that is defamatory or implies endorsement — neither of which
 * applies to backgrounds on a business's own site.
 * Full text: https://www.pexels.com/license/
 *
 * The photo IDs are recorded below so the source of every image on this
 * site is traceable, which attribution not being required does not make
 * less useful. If a photo is ever pulled from Pexels, this is what tells
 * you which one to replace.
 *
 * REPLACING ANY OF THESE WITH REAL WORK
 * ---------------------------------------------------------------------
 * These are stock photographs of homes and cleaning in general — they
 * are NOT photographs of Her Homes Co.'s own work, and nothing on the
 * page claims they are. The moment there are real photos of real jobs,
 * drop one in at the same path, run `npm run build`, and it takes over.
 * Do not run this script again after that, or it will overwrite them.
 * =====================================================================
 */

import sharp from "sharp";
import { writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MEDIA = join(ROOT, "assets", "media");

/** Service-chooser panels: tall and narrow. */
const PANEL = { w: 900, h: 1600 };
/** Style-world lookbook: matches the four images originally supplied. */
const WORLD = { w: 1400, h: 2000 };

const PHOTOS = [
  // ---- Service-chooser panels ------------------------------------
  {
    file: "service-deep-cleaning.jpg",
    size: PANEL,
    pexelsId: 4239130,
    credit: "Photo by Karolina Grabowska on Pexels",
    page: "https://www.pexels.com/photo/4239130/",
    describes: "A gloved hand spraying cleaner onto a bathroom tap.",
  },
  {
    file: "service-organising.jpg",
    size: PANEL,
    pexelsId: 8580763,
    credit: "Photo by Cottonbro Studio on Pexels",
    page: "https://www.pexels.com/photo/8580763/",
    describes: "A woman arranging labelled storage jars in a white kitchen cabinet.",
  },
  {
    file: "service-interior-design.jpg",
    size: PANEL,
    pexelsId: 5793547,
    credit: "Photo by Curtis Adams on Pexels",
    page: "https://www.pexels.com/photo/5793547/",
    describes: "A warm, softly lit living room styled in cream and taupe.",
  },

  // ---- Style worlds ----------------------------------------------
  // The four original style-world images (scandinavian, bohemian,
  // college-core, minimalist) were supplied with the project and are
  // deliberately NOT listed here — this script must never overwrite them.
  {
    file: "modern.jpg",
    size: WORLD,
    pexelsId: 20582004,
    credit: "Photo by Vecislavas Popa on Pexels",
    page: "https://www.pexels.com/photo/20582004/",
    describes: "A clean architectural room — black bench, geometric pendant, marble floor.",
  },
  {
    file: "indian-heritage.jpg",
    size: WORLD,
    pexelsId: 37415406,
    credit: "Photo by Pixabay on Pexels",
    page: "https://www.pexels.com/photo/37415406/",
    describes:
      "A heritage Indian room — carved and mirrored furniture, arched niches, coloured glass lanterns, terracotta floor.",
  },
  {
    file: "japandi.jpg",
    size: WORLD,
    pexelsId: 8251544,
    credit: "Photo by Cottonbro Studio on Pexels",
    page: "https://www.pexels.com/photo/8251544/",
    describes: "A calm Japandi corner — warm wood, a black tray table, a single branch in a ceramic vase.",
  },
];

const kb = (p) => (statSync(p).size / 1024).toFixed(0) + " KB";

if (!existsSync(MEDIA)) mkdirSync(MEDIA, { recursive: true });

for (const p of PHOTOS) {
  // Ask Pexels for a copy already scaled to the height we need, so we
  // download a few hundred KB rather than a multi-megabyte original.
  const url = `https://images.pexels.com/photos/${p.pexelsId}/pexels-photo-${p.pexelsId}.jpeg?auto=compress&cs=tinysrgb&h=${p.size.h}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ! ${p.file}: HTTP ${res.status} fetching Pexels ${p.pexelsId} — skipped, existing file left alone`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());

  const out = join(MEDIA, p.file);
  await sharp(buf)
    // These crops throw away most of a landscape frame. `attention` picks
    // the region with the most visual interest rather than the geometric
    // centre, which is the difference between keeping the subject and
    // keeping a wall.
    .resize(p.size.w, p.size.h, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(out);

  console.log(`  ${p.file}`.padEnd(34) + `${p.size.w}x${p.size.h}`.padEnd(12) + kb(out));
  console.log(`    ${p.credit} — ${p.page}`);
}

// A plain-text record next to the images, so provenance survives even if
// nobody ever opens this script.
const credits =
  "Her Homes Co. — image credits\n" +
  "=============================\n\n" +
  "The service-chooser panel backgrounds and three of the style-world\n" +
  "images are stock photography from Pexels. The Pexels Licence permits\n" +
  "free commercial use and modification and does not require attribution;\n" +
  "these are recorded anyway so the source of every image on the site is\n" +
  "traceable.\n\n" +
  "  https://www.pexels.com/license/\n\n" +
  "These are stock photographs of homes and cleaning in general. They are\n" +
  "NOT photographs of Her Homes Co.'s own work, and the site does not\n" +
  "claim they are. Replace them with real photos of real jobs whenever\n" +
  "those exist.\n\n" +
  "The scandinavian, bohemian, college-core and minimalist style-world\n" +
  "images were supplied with the project and are not fetched by this\n" +
  "script.\n\n" +
  PHOTOS.map(
    (p) =>
      `assets/media/${p.file}\n` +
      `  ${p.describes}\n` +
      `  ${p.credit}\n` +
      `  ${p.page}\n`
  ).join("\n") +
  "\nRegenerate with: npm run fetch:stock\n";

writeFileSync(join(MEDIA, "CREDITS.txt"), credits, "utf8");
console.log("\n  assets/media/CREDITS.txt written");
