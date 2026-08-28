/**
 * HER HOMES CO. — PRERENDER
 * =====================================================================
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------
 * Every word on this site used to live only inside js/data.js and was
 * written into the page by js/main.js at runtime. That looks identical
 * to a human, and it is catastrophic for search:
 *
 *   - The HTML a crawler downloads contained no service names, no
 *     prices, no process, no founder bio — just empty <div>s and empty
 *     `sr-only` headings.
 *   - Google *can* render JavaScript, but it does so on a second pass,
 *     days-to-weeks later, and it is the pass most likely to be skipped
 *     or budget-limited on a brand-new domain with no authority.
 *   - Almost nothing else renders JS at all: Bing's crawler frequently
 *     doesn't, and the WhatsApp / Facebook / LinkedIn link-preview
 *     scrapers and the AI answer-engine crawlers never do. For a
 *     business whose entire funnel is "someone shares the link on
 *     WhatsApp", that last one matters more than the rest.
 *
 * This script closes that gap without giving up the "edit one file"
 * promise in data.js: it reads js/data.js, renders the same markup
 * main.js would have built, and splices it into index.html between
 * <!--@gen:name--> ... <!--/@gen:name--> markers. It also writes
 * sitemap.xml and robots.txt from the same source.
 *
 * main.js then *adopts* that markup instead of rebuilding it (see the
 * `adopt()` helper there), so there is exactly one copy of every string
 * and the two can never drift apart.
 *
 * USAGE
 * ---------------------------------------------------------------------
 *   npm run build        # images + prerender  (do this before deploying)
 *   npm run build:html   # prerender only
 *
 * Run it after ANY edit to js/data.js. CI runs it too and fails the
 * build if the committed HTML is out of date (see .github/workflows).
 * =====================================================================
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const require = createRequire(import.meta.url);

// data.js ends with a CommonJS export guard, so Node can just require it.
const D = require(join(ROOT, "js", "data.js"));

const CHECK_ONLY = process.argv.includes("--check");

/* ------------------------------------------------------------------ *
 * Small helpers
 * ------------------------------------------------------------------ */

/** Escape text for use in an HTML text node or a double-quoted attribute. */
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const SITE = D.site.url.replace(/\/+$/, "");
/** Turn a site-relative path into the absolute URL crawlers require. */
const abs = (path) => (/^https?:/.test(path) ? path : SITE + "/" + String(path).replace(/^\/+/, ""));

const indent = (block, spaces) =>
  block
    .split("\n")
    .map((l) => (l.trim() ? " ".repeat(spaces) + l : l))
    .join("\n");

const today = () => new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ *
 * <img> for a media slot, with the attributes that keep CLS at zero
 * and stop the browser blocking on off-screen images.
 * ------------------------------------------------------------------ */
/**
 * Append a short hash of the file's own bytes to its URL.
 *
 * This exists because of a real bug that reached production. vercel.json
 * caches /assets/media/ for a year as `immutable`, which tells a browser
 * never to revalidate. Meanwhile this project's whole media workflow is
 * "drop a better photo at the same path and it takes over" — which is
 * exactly the thing `immutable` forbids. The service-chooser panels were
 * replaced in place, and every browser and CDN edge that had already seen
 * the previous version kept serving it. For a year.
 *
 * Hashing the content into the URL makes those two decisions compatible:
 * change the file and the URL changes with it, so caches miss and fetch
 * the new bytes, while an unchanged file keeps its URL and stays cached.
 * Cheap to compute, and it is derived from the file rather than a version
 * number somebody has to remember to bump.
 */
function assetUrl(relPath) {
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) return relPath;
  const hash = createHash("sha256").update(readFileSync(abs)).digest("hex").slice(0, 8);
  return `${relPath}?v=${hash}`;
}

function imgTag(slotKey, { eager = false, extraClass = "" } = {}) {
  const cfg = D.mediaSlots[slotKey];
  if (!cfg || !cfg.src) return null; // no real file yet -> render nothing at all
  const attrs = [
    `src="${esc(assetUrl(cfg.src))}"`,
    `alt="${esc(cfg.alt || "")}"`,
    cfg.width ? `width="${cfg.width}"` : null,
    cfg.height ? `height="${cfg.height}"` : null,
    `loading="${eager ? "eager" : "lazy"}"`,
    `decoding="async"`,
    eager ? `fetchpriority="high"` : null,
    extraClass ? `class="${esc(extraClass)}"` : null,
  ].filter(Boolean);
  const img = `<img ${attrs.join(" ")} />`;

  // Serve WebP where it exists (npm run build:images writes one next to
  // every photo — typically a quarter the size at the same visible
  // quality) and keep the original as the fallback, so nothing depends on
  // the build having been run and old browsers still get an image.
  const webpRel = cfg.src.replace(/\.(jpe?g|png)$/i, ".webp");
  if (webpRel !== cfg.src && existsSync(join(ROOT, webpRel))) {
    return `<picture><source type="image/webp" srcset="${esc(assetUrl(webpRel))}" />${img}</picture>`;
  }
  return img;
}

/* ================================================================== *
 * HEAD — title, description, canonical, social cards, JSON-LD.
 * ================================================================== */
function renderHead() {
  const s = D.site;
  const img = s.shareImage;
  const L = [];

  L.push(`<title>${esc(s.title)}</title>`);
  L.push(`<meta name="description" content="${esc(s.description)}" />`);
  L.push(`<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`);
  L.push(`<link rel="canonical" href="${abs("/")}" />`);
  if (s.searchConsoleVerification) {
    L.push(`<meta name="google-site-verification" content="${esc(s.searchConsoleVerification)}" />`);
  }
  L.push("");
  L.push(`<!-- Open Graph — how the link looks when shared on WhatsApp / Facebook /`);
  L.push(`     LinkedIn. This is the single highest-traffic surface for a local`);
  L.push(`     business, and those scrapers do not run JavaScript, which is why`);
  L.push(`     these tags are written into the file rather than injected. -->`);
  L.push(`<meta property="og:type" content="website" />`);
  L.push(`<meta property="og:site_name" content="${esc(D.brand.name)}" />`);
  L.push(`<meta property="og:locale" content="${esc(s.locale)}" />`);
  L.push(`<meta property="og:title" content="${esc(s.title)}" />`);
  L.push(`<meta property="og:description" content="${esc(s.description)}" />`);
  L.push(`<meta property="og:url" content="${abs("/")}" />`);
  L.push(`<meta property="og:image" content="${abs(img.src)}" />`);
  L.push(`<meta property="og:image:secure_url" content="${abs(img.src)}" />`);
  L.push(`<meta property="og:image:type" content="image/jpeg" />`);
  L.push(`<meta property="og:image:width" content="${img.width}" />`);
  L.push(`<meta property="og:image:height" content="${img.height}" />`);
  L.push(`<meta property="og:image:alt" content="${esc(img.alt)}" />`);
  L.push("");
  L.push(`<!-- Twitter/X card. No confirmed @handle exists yet, so twitter:site /`);
  L.push(`     twitter:creator are left out rather than invented. -->`);
  L.push(`<meta name="twitter:card" content="summary_large_image" />`);
  L.push(`<meta name="twitter:title" content="${esc(s.title)}" />`);
  L.push(`<meta name="twitter:description" content="${esc(s.description)}" />`);
  L.push(`<meta name="twitter:image" content="${abs(img.src)}" />`);
  L.push(`<meta name="twitter:image:alt" content="${esc(img.alt)}" />`);
  L.push("");
  L.push(`<script type="application/ld+json">`);
  L.push(JSON.stringify(renderJsonLd(), null, 2));
  L.push(`</` + `script>`);

  if (s.ga4MeasurementId) {
    L.push("");
    L.push(`<!-- Google Analytics 4. Every conversion point on this page (WhatsApp`);
    L.push(`     clicks, phone clicks, quote requests, home-size selections) is`);
    L.push(`     already wired to trackEvent() in js/main.js and starts reporting`);
    L.push(`     as soon as this snippet is present. -->`);
    L.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(s.ga4MeasurementId)}"></` + `script>`);
    L.push(`<script>`);
    L.push(`  window.dataLayer = window.dataLayer || [];`);
    L.push(`  function gtag(){dataLayer.push(arguments);}`);
    L.push(`  gtag('js', new Date());`);
    L.push(`  gtag('config', '${esc(s.ga4MeasurementId)}');`);
    L.push(`</` + `script>`);
  }

  return L.join("\n");
}

/* ------------------------------------------------------------------ *
 * JSON-LD @graph.
 *
 * Deliberately absent: street address, opening hours, aggregateRating /
 * review data, and sameAs social profiles. None of those are confirmed
 * facts, and fabricated review markup in particular is a manual-action
 * risk, not just bad manners. Each one slots straight in the moment it
 * is real — see the notes in js/data.js.
 * ------------------------------------------------------------------ */
function renderJsonLd() {
  const s = D.site;
  const id = (frag) => abs("/") + "#" + frag;

  const areaServed = s.areaServed.map((a) => ({
    "@type": "City",
    name: a.name,
    // Mohali is also SAS Nagar; Mullanpur is also New Chandigarh. People
    // search both, so both are declared rather than picking a winner.
    ...(a.alsoKnownAs ? { alternateName: a.alsoKnownAs } : {}),
    ...(a.region ? { containedInPlace: { "@type": "AdministrativeArea", name: a.region } } : {}),
    address: { "@type": "PostalAddress", addressLocality: a.name, addressRegion: a.region, addressCountry: a.country },
  }));

  const business = {
    "@type": "HomeAndConstructionBusiness",
    "@id": id("business"),
    name: D.brand.name,
    alternateName: "Her Homes",
    description: s.description,
    slogan: D.brand.tagline,
    url: abs("/"),
    logo: { "@type": "ImageObject", "@id": id("logo"), url: abs("assets/logo-full.png"), width: 454, height: 652, caption: D.brand.name },
    image: { "@id": id("logo") },
    telephone: "+" + D.contact.whatsapp.number.replace(/^(\d{2})/, "$1 ").trim(),
    areaServed,
    founder: { "@id": id("founder") },
    employee: { "@id": id("founder") },
    // Topical signals for the business entity. Every one of these is
    // something the page actually talks about — knowsAbout is not a
    // keyword dump, and stuffing it with services that aren't offered
    // would be the schema equivalent of lying.
    knowsAbout: [
      "Interior design",
      "Interior styling",
      "Home organising",
      "Deep cleaning",
      "Wardrobe organisation",
      "Kitchen organisation",
      "Home staging",
      "Vastu Shastra",
      "Feng Shui",
      "Indian heritage interiors",
      "Punjabi and North Indian traditional interiors",
      "Japanese interiors",
      "Punjabi interiors",
      "Scandinavian interiors",
      "Minimalist interiors",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Her Homes Co. service menu",
      itemListElement: [
        ...D.pricing.services.map((svc) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: svc.name,
            description: svc.description,
            serviceType: svc.name,
            provider: { "@id": id("business") },
            areaServed,
          },
          ...(svc.startingPrice
            ? { price: String(svc.startingPrice), priceCurrency: "INR" }
            : { availability: "https://schema.org/InStock" }),
        })),
        ...D.pricing.addOns.map((a) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: a.name,
            description: a.description,
            provider: { "@id": id("business") },
            areaServed,
          },
          price: String(a.price),
          priceCurrency: "INR",
        })),
      ],
    },
    potentialAction: {
      "@type": "CommunicateAction",
      name: "Request a personalised quote on WhatsApp",
      target: D.contact.whatsapp.href,
    },
  };

  // Correct, readable E.164-style phone rather than a regex guess.
  business.telephone = D.contact.phone.display;

  const founder = {
    "@type": "Person",
    "@id": id("founder"),
    name: D.founder.name,
    jobTitle: D.founder.role,
    description: D.founder.bio,
    worksFor: { "@id": id("business") },
  };

  const website = {
    "@type": "WebSite",
    "@id": id("website"),
    url: abs("/"),
    name: D.brand.name,
    description: s.description,
    publisher: { "@id": id("business") },
    inLanguage: s.lang,
  };

  const webpage = {
    "@type": "WebPage",
    "@id": id("webpage"),
    url: abs("/"),
    name: s.title,
    description: s.description,
    isPartOf: { "@id": id("website") },
    about: { "@id": id("business") },
    primaryImageOfPage: { "@type": "ImageObject", url: abs(s.shareImage.src), width: s.shareImage.width, height: s.shareImage.height },
    inLanguage: s.lang,
  };

  const faq = {
    "@type": "FAQPage",
    "@id": id("faq"),
    isPartOf: { "@id": id("webpage") },
    mainEntity: D.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return { "@context": "https://schema.org", "@graph": [business, founder, website, webpage, faq] };
}

/* ================================================================== *
 * BODY SECTIONS
 * ================================================================== */

function renderNavLinks() {
  return D.nav.map((i) => `<a href="${esc(i.href)}">${esc(i.label)}</a>`).join("\n");
}

function renderMobileNavLinks() {
  return D.nav.map((i) => `<a href="${esc(i.href)}">${esc(i.label)}</a>`).join("\n");
}

function renderMobileNavContact() {
  return [
    `<li><a href="${esc(D.contact.whatsapp.href)}" target="_blank" rel="noopener">WhatsApp</a></li>`,
    `<li><a href="${esc(D.contact.phone.href)}">Call</a></li>`,
  ].join("\n");
}

function maskedLines(lines) {
  return lines.map((t) => `<span><i>${esc(t)}</i></span>`).join("");
}

/**
 * SERVICE CHOOSER — three full-height panels directly under the hero.
 *
 * Every panel is one real <a href> straight into a pre-written WhatsApp
 * message about that service, so it works with JavaScript disabled, is
 * keyboard-focusable for free, and is a crawlable outbound link rather
 * than a click handler.
 *
 * <a> has a transparent content model in HTML5, so wrapping the heading
 * and copy in the link is valid and makes the whole panel the target —
 * no nested interactive elements, which would not be.
 *
 * Each link gets its own aria-label. Without one, a screen reader's list
 * of links on this page would read "Ask about this" three times with no
 * way to tell them apart.
 */
function renderServiceChooser() {
  const c = D.serviceChooser;

  const panels = c.items
    .map((item) => {
      const img = imgTag(`service-${item.id}`, { eager: true });
      return [
        `    <li class="svc-panel" data-svc="${esc(item.id)}">`,
        `      <a class="svc-panel__link" href="${esc(item.whatsappHref)}" target="_blank" rel="noopener"`,
        `         data-svc-cta data-svc-id="${esc(item.id)}"`,
        `         aria-label="Ask about ${esc(item.name)} on WhatsApp">`,
        `        <span class="svc-panel__media">${img || ""}</span>`,
        `        <span class="svc-panel__spine f-display" aria-hidden="true">${esc(item.name)}</span>`,
        `        <span class="svc-panel__body">`,
        `          <span class="f-label svc-panel__index">${esc(item.index)}</span>`,
        `          <h3 class="f-display svc-panel__name">${esc(item.name)}</h3>`,
        `          <span class="f-body svc-panel__blurb">${esc(item.blurb)}</span>`,
        `          <span class="f-label svc-panel__cta">${esc(c.ctaLabel)}<span aria-hidden="true"> &#8599;</span></span>`,
        `        </span>`,
        `      </a>`,
        `    </li>`,
      ].join("\n");
    })
    .join("\n");

  return [
    `<div class="container svc__intro">`,
    `  <p class="f-label svc__eyebrow">${esc(c.eyebrow)}</p>`,
    `  <h2 id="svc-heading" class="f-display t-headline-lg svc__heading">${esc(c.heading)}</h2>`,
    `  <p class="f-body svc__support">${esc(c.support)}</p>`,
    `</div>`,
    `<ul class="svc__panels">`,
    panels,
    `</ul>`,
  ].join("\n");
}

function renderPhilosophy() {
  const p = D.philosophy;
  return [
    `<h2 class="sr-only" data-phi-heading>Our philosophy</h2>`,
    `<div class="philosophy__sizer">`,
    `  <p class="philosophy__eyebrow f-label" data-phi="eyebrow">${esc(p.eyebrow)}</p>`,
    `  <div class="philosophy__line philosophy__line--a f-display" data-phi="line-a">${maskedLines(p.lineA)}</div>`,
    `  <div class="philosophy__line philosophy__line--b f-display" data-phi="line-b">${maskedLines(p.lineB)}</div>`,
    `  <p class="philosophy__support f-body t-body-lg" data-phi="support">${esc(p.support)}</p>`,
    `</div>`,
  ].join("\n");
}

function renderStyleWorlds() {
  const worlds = D.styleWorlds;
  const total = worlds.length;
  const pad = (n) => String(n).padStart(2, "0");

  const frames = worlds
    .map((w, i) => {
      const img = imgTag(`style-${w.id}`, { eager: i === 0 });
      const empty = img ? "" : ` data-empty="true"`;
      return [
        `    <div class="style-worlds__frame${i === 0 ? " is-active" : ""}" data-sw-index="${i}">`,
        `      <div class="media-frame" data-media-slot="style-${esc(w.id)}"${empty}>${img || ""}</div>`,
        `    </div>`,
      ].join("\n");
    })
    .join("\n");

  const buttons = worlds
    .map(
      (w, i) =>
        `    <li><button type="button" data-sw-index="${i}"${i === 0 ? ' class="is-active"' : ""}>${esc(w.name)}</button></li>`
    )
    .join("\n");

  // The visible stage only ever shows ONE world at a time — it is driven by
  // scroll position. That is great to look at and useless to a crawler or a
  // screen-reader user, both of which see a single name. This visually
  // hidden list carries all of them, in the same order, from the same data.
  const fallback = worlds
    .map((w) => `    <li><strong>${esc(w.name)}</strong> — ${esc(w.words.join(", "))}</li>`)
    .join("\n");

  return [
    `<h2 class="sr-only" data-sw-heading>Style worlds we work in</h2>`,
    `<div class="style-worlds__sizer">`,
    `  <div class="style-worlds__stage">`,
    `    <div class="style-worlds__media" data-sw-media>`,
    frames,
    `    </div>`,
    `    <div class="style-worlds__overlay">`,
    `      <span class="style-worlds__count f-label" data-sw-count>${pad(1)} / ${pad(total)}</span>`,
    `      <h3 class="style-worlds__name f-display" data-sw-name>${esc(worlds[0].name.toUpperCase())}</h3>`,
    `      <ul class="style-worlds__words f-label" data-sw-words>${worlds[0].words.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`,
    `    </div>`,
    `  </div>`,
    `  <ul class="style-worlds__list f-display" data-sw-list aria-label="Style worlds">`,
    buttons,
    `  </ul>`,
    `  <ul class="sr-only">`,
    fallback,
    `  </ul>`,
    `</div>`,
  ].join("\n");
}

function renderWhatWeDo() {
  const svc = D.services;
  const narrative = svc.narrative
    .map((w, i) => `      <li${i === 0 ? ' class="is-active"' : ""}>${esc(w)}</li>`)
    .join("\n");

  const items = svc.items
    .map((s) =>
      [
        `      <div class="wwd-item">`,
        `        <div class="wwd-item__top">`,
        `          <h4 class="f-display wwd-item__name">${esc(s.name)}</h4>`,
        `          <span class="f-label wwd-item__index">${esc(s.index)}</span>`,
        `        </div>`,
        `        <p class="f-body wwd-item__summary">${esc(s.summary)}</p>`,
        `        <div class="wwd-item__includes">${s.includes.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`,
        `        <p class="f-body wwd-item__note">${esc(s.note)}</p>`,
        `      </div>`,
      ].join("\n")
    )
    .join("\n");

  return [
    `<h2 class="sr-only" data-wwd-heading>What we do</h2>`,
    `<div class="container editorial-grid">`,
    `  <div class="what-we-do__sticky">`,
    `    <p class="f-label" data-wwd-eyebrow>What We Do</p>`,
    `    <ul class="what-we-do__narrative f-display" data-wwd-narrative>`,
    narrative,
    `    </ul>`,
    `  </div>`,
    `  <div class="what-we-do__list" data-wwd-list>`,
    items,
    `  </div>`,
    `</div>`,
  ].join("\n");
}

function renderProcess() {
  const steps = D.process;
  const ticks = steps.map((_, i) => `    <li${i === 0 ? ' class="is-active"' : ""}></li>`).join("\n");
  // Same reasoning as the style-worlds fallback: the visible stage shows one
  // stage at a time, so all six only exist in the page for a crawler or a
  // screen reader if they are written out somewhere that does not animate.
  const fallback = steps
    .map((s) => `  <li><strong>${esc(s.title)}</strong> — ${esc(s.detail)}</li>`)
    .join("\n");

  return [
    `<h2 class="sr-only" data-proc-heading>Our process, step by step</h2>`,
    `<ol class="sr-only">`,
    fallback,
    `</ol>`,
    `<div class="process__sizer">`,
    `  <span class="process__index f-display" data-proc-index aria-hidden="true">${esc(steps[0].index)}</span>`,
    `  <div class="process__content">`,
    `    <p class="f-label" data-proc-eyebrow>Process</p>`,
    `    <h3 class="f-display t-headline-lg process__title" data-proc-title>${esc(steps[0].title.toUpperCase())}</h3>`,
    `    <p class="f-body t-body-lg process__detail" data-proc-detail>${esc(steps[0].detail)}</p>`,
    `  </div>`,
    `  <ul class="process__progress" data-proc-progress aria-hidden="true">`,
    ticks,
    `  </ul>`,
    `</div>`,
  ].join("\n");
}

function renderPricing() {
  const p = D.pricing;
  const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

  const menu = p.services
    .map((s) =>
      [
        `      <div class="pr-row">`,
        `        <h4 class="f-display pr-row__name">${esc(s.name)}</h4>`,
        `        <p class="f-body pr-row__desc">${esc(s.description)}</p>`,
        `        <span class="f-label pr-row__price${s.startingPrice ? "" : " is-quote"}">${
          s.startingPrice ? "From " + esc(inr(s.startingPrice)) : "Personalised quote"
        }</span>`,
        `      </div>`,
      ].join("\n")
    )
    .join("\n");

  const addons = p.addOns
    .map((a) =>
      [
        `      <div class="pr-addon">`,
        `        <div>`,
        `          <p class="f-label pr-addon__name">${esc(a.name)}</p>`,
        `          <p class="pr-addon__desc">${esc(a.description)}</p>`,
        `        </div>`,
        `        <span class="f-label pr-addon__price">${esc(inr(a.price))} ${esc(a.priceUnit)}</span>`,
        `      </div>`,
      ].join("\n")
    )
    .join("\n");

  const factors = p.variables.factors.map((f) => `          <li>${esc(f)}</li>`).join("\n");
  const sizes = p.variables.homeSize
    .map((s) => `          <button type="button">${esc(s)}</button>`)
    .join("\n");

  return [
    `<div class="container">`,
    `  <h2 class="sr-only">Pricing — ${esc(p.services.map((s) => s.name).join(", "))}</h2>`,
    `  <div class="pricing__intro-block">`,
    `    <p class="f-label" data-pr-eyebrow>${esc(p.eyebrow)}</p>`,
    `    <h3 class="f-display t-headline-lg" data-pr-heading>${esc(p.heading)}</h3>`,
    `    <p class="f-body t-body-lg pricing__intro" data-pr-intro>${esc(p.intro)}</p>`,
    `  </div>`,
    ``,
    `  <div class="pricing__menu" data-pr-menu>`,
    menu,
    `  </div>`,
    `  <div class="pricing__addons" data-pr-addons>`,
    addons,
    `  </div>`,
    ``,
    `  <div class="pricing__lower">`,
    `    <div class="pricing__factors">`,
    `      <h4 class="f-label">What shapes the number</h4>`,
    `      <ul data-pr-factors>`,
    factors,
    `      </ul>`,
    `    </div>`,
    `    <div class="pricing__teller">`,
    `      <h4 class="f-label">Tell us about your home</h4>`,
    `      <div class="pricing__sizes" data-pr-sizes role="group" aria-label="Home size">`,
    sizes,
    `      </div>`,
    `      <a class="btn btn-outline pricing__teller-cta" href="${esc(D.contact.whatsapp.href)}" target="_blank" rel="noopener" data-pr-teller-cta>Get a personalised quote</a>`,
    `    </div>`,
    `  </div>`,
    `</div>`,
  ].join("\n");
}

function renderFaq() {
  const m = D.faqMeta;
  const items = D.faq
    .map((f, i) =>
      [
        `    <details class="faq-item"${i === 0 ? " open" : ""}>`,
        `      <summary class="faq-item__q f-display">${esc(f.q)}</summary>`,
        `      <div class="faq-item__a"><p class="f-body">${esc(f.a)}</p></div>`,
        `    </details>`,
      ].join("\n")
    )
    .join("\n");

  return [
    `<div class="container">`,
    `  <div class="faq__intro">`,
    `    <p class="f-label">${esc(m.eyebrow)}</p>`,
    `    <h2 class="f-display t-headline-lg">${esc(m.heading)}</h2>`,
    `    <p class="f-body t-body-lg faq__support">${esc(m.support)}</p>`,
    `  </div>`,
    `  <div class="faq__list">`,
    items,
    `  </div>`,
    `</div>`,
  ].join("\n");
}

function renderFounder() {
  const f = D.founder;
  const portrait = imgTag(f.photoSlot);
  const copy = [
    `  <div class="founder__copy">`,
    `    <p class="f-label" data-fo-eyebrow>${esc(f.eyebrow)}</p>`,
    `    <h2 class="f-display t-headline-lg" data-fo-heading>${esc(f.heading)}</h2>`,
    `    <p class="f-body t-body-lg founder__bio" data-fo-bio>${esc(f.bio)}</p>`,
    `    <div class="founder__signature">`,
    `      <p class="f-display founder__name" data-fo-name>${esc(f.name)}</p>`,
    `      <p class="f-label founder__role" data-fo-role>${esc(f.role)}</p>`,
    `    </div>`,
    `  </div>`,
  ].join("\n");

  // No portrait file yet -> lay the section out as one centred column
  // rather than showing a visitor an empty grey frame. Drop a real file in
  // and set mediaSlots["founder-portrait"].src and the two-column layout
  // comes back on the next build, with no markup edit here.
  if (!portrait) {
    return [`<div class="container founder__grid founder__grid--solo">`, copy, `</div>`].join("\n");
  }

  return [
    `<div class="container founder__grid">`,
    `  <div class="founder__media-wrap">`,
    `    <div class="founder__media media-frame" data-media-slot="${esc(f.photoSlot)}" data-fo-parallax>${portrait}</div>`,
    `  </div>`,
    copy,
    `</div>`,
  ].join("\n");
}

function renderFinalCta() {
  const c = D.finalCta;
  const lines = c.lineA.map((t) => `    <span class="line"><i>${esc(t)}</i></span>`).join("\n");
  return [
    `<div class="container final-cta__top">`,
    `  <h2 class="f-display final-cta__heading" data-cta-heading>`,
    lines,
    `  </h2>`,
    `  <p class="f-body t-body-lg final-cta__support" data-cta-support>${esc(c.support)}</p>`,
    `</div>`,
    `<div class="container final-cta__actions">`,
    `  <a class="final-cta__whatsapp" data-cta-whatsapp href="${esc(D.contact.whatsapp.href)}" target="_blank" rel="noopener">`,
    `    <span>${esc(c.whatsappButtonLabel)}</span>`,
    `    <span class="final-cta__whatsapp-arrow" aria-hidden="true">↗</span>`,
    `  </a>`,
    `  <div class="final-cta__secondary" data-cta-contacts>`,
    `    <a href="${esc(D.contact.phone.href)}">${esc(D.contact.phone.display)}</a>`,
    `  </div>`,
    `</div>`,
  ].join("\n");
}

function renderFooter() {
  const c = D.contact;
  // Every serviceable town, as real readable text. This is the single
  // highest-value block on the page for a query like "home organiser in
  // Kharar": schema.org areaServed tells a crawler what the business
  // claims, but the words on the page are what the query matches.
  const areas = D.site.areaServed
    .map((a) => (a.alsoKnownAs ? `${esc(a.name)} (${esc(a.alsoKnownAs)})` : esc(a.name)))
    .join(", ");
  return [
    `<div class="container site-footer__areas">`,
    `  <h2 class="f-label site-footer__areas-title">Areas we serve</h2>`,
    `  <p class="f-body site-footer__areas-list">${areas}</p>`,
    `  <p class="f-body site-footer__areas-note">Home styling, organising and deep cleaning across Mohali district and the wider Chandigarh Tricity. Not sure if you're in range? <a href="${esc(c.whatsapp.href)}" target="_blank" rel="noopener">Ask on WhatsApp</a> — it's a quick answer.</p>`,
    `</div>`,
    `<div class="container site-footer__row">`,
    `  <div class="site-footer__mark">`,
    `    <img src="assets/logo-mark.png" alt="" width="298" height="383" loading="lazy" decoding="async" draggable="false" />`,
    `    <span class="f-display">${esc(D.brand.name)}</span>`,
    `  </div>`,
    `  <ul class="site-footer__links f-label" data-footer-links>`,
    `    <li><a href="${esc(c.whatsapp.href)}" target="_blank" rel="noopener">WhatsApp</a></li>`,
    `    <li><a href="${esc(c.phone.href)}">${esc(c.phone.display)}</a></li>`,
    `    <li><a href="#faq">FAQ</a></li>`,
    `    <li><a href="#book">Book</a></li>`,
    `  </ul>`,
    `</div>`,
    `<div class="container site-footer__bottom f-label">`,
    `  <span data-footer-copyright>© ${new Date().getFullYear()} ${esc(D.brand.name)} All rights reserved.</span>`,
    `  <span data-footer-location>${esc(c.location || "")}</span>`,
    `</div>`,
  ].join("\n");
}

/* ================================================================== *
 * SPLICE
 * ================================================================== */

const BLOCKS = {
  head: renderHead,
  "nav-links": renderNavLinks,
  "mobile-nav-links": renderMobileNavLinks,
  "mobile-nav-contact": renderMobileNavContact,
  "service-chooser": renderServiceChooser,
  philosophy: renderPhilosophy,
  "style-worlds": renderStyleWorlds,
  "what-we-do": renderWhatWeDo,
  process: renderProcess,
  pricing: renderPricing,
  faq: renderFaq,
  founder: renderFounder,
  "final-cta": renderFinalCta,
  footer: renderFooter,
};

function splice(html, name, body) {
  const open = `<!--@gen:${name}-->`;
  const close = `<!--/@gen:${name}-->`;
  const start = html.indexOf(open);
  const end = html.indexOf(close);
  if (start === -1 || end === -1) {
    throw new Error(
      `prerender: missing marker for "${name}" in index.html.\n` +
        `  Expected a matching pair:  ${open} ... ${close}\n` +
        `  Add them back, or remove "${name}" from BLOCKS in scripts/prerender.mjs.`
    );
  }
  // Preserve the indentation the opening marker sits at, so the generated
  // HTML lines up with the hand-written markup around it and diffs stay
  // readable instead of turning into one unreadable wall.
  const lineStart = html.lastIndexOf("\n", start) + 1;
  const pad = html.slice(lineStart, start).length;
  const inner = "\n" + indent(body, pad) + "\n" + " ".repeat(pad);
  return html.slice(0, start + open.length) + inner + html.slice(end);
}

/* ------------------------------------------------------------------ *
 * sitemap.xml + robots.txt — same source of truth, so the domain can
 * never be right in one file and stale in another.
 * ------------------------------------------------------------------ */
function renderSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  GENERATED FILE — do not edit by hand.
  Produced by scripts/prerender.mjs from js/data.js (site.url).
  Run \`npm run build\` after changing the domain.

  Her Homes Co. is one page. Everything on it lives at this one URL as
  same-page anchors (#styles, #pricing, #faq, #book), and an anchor is not
  a separate crawlable document, so listing them here would be wrong. The
  moment a genuinely separate page exists — /services/deep-cleaning, a
  blog, a per-city landing page — add one <url> block per canonical page.
  Never list a page that is noindex'd, redirected, or canonicalised away.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${abs("/")}</loc>
    <lastmod>${today()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

function renderRobots() {
  return `# Her Homes Co. — https://herhomes.shop
#
# GENERATED FILE — do not edit by hand.
# Produced by scripts/prerender.mjs from js/data.js (site.url).
#
# The whole site is one public page with nothing to hide from crawlers —
# no admin area, no staging copy, no duplicate or parameterised URLs — so
# this stays a short file on purpose.
#
# If a staging/preview copy ever exists at another URL, give THAT copy its
# own robots.txt containing "User-agent: * / Disallow: /" (and ideally HTTP
# basic auth on top) rather than adding disallow rules here. A real,
# indexable robots.txt should never carry rules meant for another
# environment — that is one of the most common ways a live site quietly
# deindexes itself.
User-agent: *
Allow: /

# Crawl the CSS, JS and media too. Blocking them stops Google rendering
# the page the way a visitor sees it, which costs more than it saves.
Allow: /assets/
Allow: /js/
Allow: /vendor/

Sitemap: ${abs("sitemap.xml")}
`;
}

/* ================================================================== *
 * RUN
 * ================================================================== */
const indexPath = join(ROOT, "index.html");
if (!existsSync(indexPath)) {
  console.error("prerender: index.html not found at " + indexPath);
  process.exit(1);
}

let html = readFileSync(indexPath, "utf8");
const before = html;

// Keep <html lang> in sync with data.js too — easy to forget otherwise.
html = html.replace(/<html lang="[^"]*">/, `<html lang="${esc(D.site.lang)}">`);

for (const [name, render] of Object.entries(BLOCKS)) {
  html = splice(html, name, render());
}

const sitemap = renderSitemap();
const robots = renderRobots();

const targets = [
  [indexPath, html, before],
  [join(ROOT, "sitemap.xml"), sitemap, existsSync(join(ROOT, "sitemap.xml")) ? readFileSync(join(ROOT, "sitemap.xml"), "utf8") : ""],
  [join(ROOT, "robots.txt"), robots, existsSync(join(ROOT, "robots.txt")) ? readFileSync(join(ROOT, "robots.txt"), "utf8") : ""],
];

if (CHECK_ONLY) {
  // sitemap.xml carries a <lastmod> of "today", so it changes every day by
  // design. Comparing it in --check mode would fail CI for no real reason,
  // so the check covers index.html and robots.txt, where a stale file is an
  // actual bug.
  const stale = targets
    .filter(([p]) => !p.endsWith("sitemap.xml"))
    .filter(([, next, prev]) => next !== prev)
    .map(([p]) => p.replace(ROOT, "").replace(/^[\\/]/, ""));
  if (stale.length) {
    console.error("prerender --check FAILED — these files are out of date with js/data.js:");
    stale.forEach((f) => console.error("  - " + f));
    console.error("\nRun `npm run build` and commit the result.");
    process.exit(1);
  }
  console.log("prerender --check OK — generated HTML matches js/data.js");
  process.exit(0);
}

for (const [p, next] of targets) writeFileSync(p, next, "utf8");

const words = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim()
  .split(" ")
  .filter(Boolean).length;

console.log("prerender OK");
console.log("  domain          " + SITE);
console.log("  index.html      " + (html.length / 1024).toFixed(1) + " KB");
console.log("  indexable words " + words + "  (was ~40 before prerendering — everything else was JS-only)");
console.log("  style worlds    " + D.styleWorlds.length);
console.log("  FAQ entries     " + D.faq.length);
console.log("  sitemap.xml + robots.txt rewritten");
