/**
 * HER HOMES CO. — FETCH STOCK PHOTOGRAPHY
 * =====================================================================
 * Downloads the service-chooser panel backgrounds from Pexels and crops
 * them to the tall 900x1600 panel shape.
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
 * All three are Pexels. The Pexels Licence allows free use including
 * commercial, permits modification, and does not require attribution.
 * It does NOT allow reselling unaltered copies, or using identifiable
 * people in a way that is defamatory or implies endorsement — neither of
 * which applies to a background on a business's own site.
 * Full text: https://www.pexels.com/license/
 *
 * The photo IDs are recorded below so the source of every image on this
 * site is traceable, which attribution not being required does not make
 * less useful. If a photo is ever pulled from Pexels, this is what tells
 * you which one to replace.
 *
 * REPLACING A PANEL WITH REAL WORK
 * ---------------------------------------------------------------------
 * These are stock photographs of homes and cleaning in general — they
 * are NOT photographs of Her Homes Co.'s own work, and nothing on the
 * page claims they are. The moment there are real photos of real jobs,
 * drop one in at assets/media/service-<id>.jpg, run `npm run build`, and
 * it takes over. Do not run this script again after that, or it will
 * overwrite them.
 * =====================================================================
 */

import sharp from "sharp";
import { writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MEDIA = join(ROOT, "assets", "media");

const PANEL_W = 900;
const PANEL_H = 1600;

const PHOTOS = [
  {
    slot: "deep-cleaning",
    pexelsId: 4239130,
    credit: "Photo by Karolina Grabowska on Pexels",
    page: "https://www.pexels.com/photo/4239130/",
    describes: "A gloved hand spraying cleaner onto a bathroom tap.",
  },
  {
    slot: "organising",
    pexelsId: 8580763,
    credit: "Photo by Cottonbro Studio on Pexels",
    page: "https://www.pexels.com/photo/8580763/",
    describes: "A woman arranging labelled storage jars in a white kitchen cabinet.",
  },
  {
    slot: "interior-design",
    pexelsId: 5793547,
    credit: "Photo by Curtis Adams on Pexels",
    page: "https://www.pexels.com/photo/5793547/",
    describes: "A warm, softly lit living room styled in cream and taupe.",
  },
];

const kb = (p) => (statSync(p).size / 1024).toFixed(0) + " KB";

if (!existsSync(MEDIA)) mkdirSync(MEDIA, { recursive: true });

for (const p of PHOTOS) {
  // `h=1600` asks Pexels for a copy already scaled to the height we need,
  // so we download a few hundred KB instead of a multi-megabyte original.
  const url = `https://images.pexels.com/photos/${p.pexelsId}/pexels-photo-${p.pexelsId}.jpeg?auto=compress&cs=tinysrgb&h=${PANEL_H}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ! ${p.slot}: HTTP ${res.status} fetching Pexels ${p.pexelsId} — skipped, existing file left alone`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());

  const out = join(MEDIA, `service-${p.slot}.jpg`);
  await sharp(buf)
    // These panels are very tall and narrow, so the crop throws most of a
    // landscape frame away. `attention` picks the region with the most
    // visual interest rather than the geometric centre, which is the
    // difference between keeping the subject and keeping a wall.
    .resize(PANEL_W, PANEL_H, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(out);

  console.log(`  service-${p.slot}.jpg`.padEnd(34) + `${PANEL_W}x${PANEL_H}`.padEnd(11) + kb(out));
  console.log(`    ${p.credit} — ${p.page}`);
}

// A plain-text record next to the images, so provenance survives even if
// nobody ever opens this script.
const credits =
  "Her Homes Co. — image credits\n" +
  "=============================\n\n" +
  "Service-chooser panel backgrounds are stock photography from Pexels.\n" +
  "The Pexels Licence permits free commercial use and modification and\n" +
  "does not require attribution; these are recorded anyway so the source\n" +
  "of every image on the site is traceable.\n\n" +
  "  https://www.pexels.com/license/\n\n" +
  "These are stock photographs of homes and cleaning in general. They are\n" +
  "NOT photographs of Her Homes Co.'s own work, and the site does not\n" +
  "claim they are. Replace them with real photos of real jobs whenever\n" +
  "those exist.\n\n" +
  PHOTOS.map(
    (p) =>
      `assets/media/service-${p.slot}.jpg\n` +
      `  ${p.describes}\n` +
      `  ${p.credit}\n` +
      `  ${p.page}\n`
  ).join("\n") +
  "\nRegenerate with: npm run fetch:stock\n";

writeFileSync(join(MEDIA, "CREDITS.txt"), credits, "utf8");
console.log("\n  assets/media/CREDITS.txt written");
