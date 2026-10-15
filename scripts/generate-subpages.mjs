/**
 * Build dedicated service + contact pages from js/data.js.
 *
 * Service pages are real landing pages (hero, includes, pricing, quote form)
 * — not full clones of the homepage. Contact is a short quote-focused page.
 *
 * Run after prerender: `npm run build:html`
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const D = require("../js/data.js");

const ROOT = process.cwd();
const sym = D.pricing.currencySymbol || "₹";
const inr = (n) => sym + Number(n).toLocaleString("en-IN");

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function whatsAppHref(message) {
  if (typeof D.whatsAppHref === "function") return D.whatsAppHref(message);
  return (
    "https://api.whatsapp.com/send?phone=" +
    D.contact.whatsapp.number +
    "&text=" +
    encodeURIComponent(message || D.contact.whatsapp.message)
  );
}

function renderQuoteForm({ id, preselectService }) {
  const q = D.quoteForm;
  const sizes = (q.sizes || D.pricing.variables.homeSize || [])
    .map((s) => `        <option value="${esc(s)}">${esc(s)}</option>`)
    .join("\n");
  const services = (q.services || [])
    .map((s) => {
      const checked = preselectService && s.label === preselectService ? " checked" : "";
      return (
        `        <label class="quote-form__chip">\n` +
        `          <input type="checkbox" name="services" value="${esc(s.label)}"${checked} />\n` +
        `          <span>${esc(s.label)}</span>\n` +
        `        </label>`
      );
    })
    .join("\n");

  return `
<form class="quote-form" id="${esc(id)}" data-quote-form novalidate>
  <p class="f-label quote-form__eyebrow">${esc(q.eyebrow)}</p>
  <h3 class="f-display quote-form__heading">${esc(q.heading)}</h3>
  <p class="f-body quote-form__support">${esc(q.support)}</p>
  <fieldset class="quote-form__fieldset">
    <legend class="f-label">${esc(q.servicesLabel)}</legend>
    <div class="quote-form__chips" data-quote-services>
${services}
    </div>
  </fieldset>
  <label class="quote-form__field">
    <span class="f-label">${esc(q.sizeLabel)}</span>
    <select name="size" data-quote-size required>
      <option value="" disabled selected>${esc(q.sizePlaceholder)}</option>
${sizes}
    </select>
  </label>
  <label class="quote-form__field">
    <span class="f-label">${esc(q.nameLabel)}${q.nameOptional ? " <em>(optional)</em>" : ""}</span>
    <input type="text" name="name" data-quote-name autocomplete="name" placeholder="${esc(q.namePlaceholder)}" maxlength="80" />
  </label>
  <label class="quote-form__field">
    <span class="f-label">${esc(q.detailsLabel)}</span>
    <textarea name="details" data-quote-details rows="4" maxlength="600" placeholder="${esc(q.detailsPlaceholder)}" required></textarea>
  </label>
  <div class="quote-form__preview" aria-live="polite">
    <p class="f-label quote-form__preview-label">${esc(q.previewLabel)}</p>
    <blockquote class="quote-form__preview-body f-body" data-quote-preview>${esc(q.emptyPreview)}</blockquote>
  </div>
  <a class="quote-form__submit" data-quote-submit href="${esc(whatsAppHref())}" rel="noopener">
    <span>${esc(q.submitLabel)}</span>
    <span class="quote-form__submit-arrow" aria-hidden="true">↗</span>
  </a>
</form>`;
}

function renderServiceJsonLd({ title, metaDesc, canonical, pageKey, startingPrice }) {
  const p = pageKey ? D.servicePages[pageKey] : null;
  const chooser = (D.serviceChooser.items || []).find((i) => i.id === pageKey || i.pageHref === "/" + pageKey);
  const areaServed = (D.site.areaServed || []).map((a) => ({
    "@type": "City",
    name: a.name,
    ...(a.alsoKnownAs ? { alternateName: a.alsoKnownAs } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: a.name,
      addressRegion: a.region,
      addressCountry: a.country,
    },
  }));
  const businessId = D.site.url + "/#business";
  const offers = (p && p.subServices ? p.subServices : []).map((sub) => ({
    "@type": "Offer",
    name: sub.name,
    description: sub.blurb,
    price: String(sub.startingPrice),
    priceCurrency: "INR",
    url: canonical,
  }));
  if (startingPrice != null && !offers.length) {
    offers.push({
      "@type": "Offer",
      price: String(startingPrice),
      priceCurrency: "INR",
      url: canonical,
    });
  }
  const graph = [
    {
      "@type": "Service",
      "@id": canonical + "#service",
      name: (p && p.eyebrow) || title,
      description: metaDesc,
      serviceType: (chooser && chooser.serviceType) || (p && p.eyebrow) || title,
      provider: { "@id": businessId },
      areaServed,
      url: canonical,
      ...(offers.length ? { offers } : {}),
      ...(p && p.includes ? { termsOfService: p.includes.join("; ") } : {}),
    },
    {
      "@type": "WebPage",
      "@id": canonical + "#webpage",
      url: canonical,
      name: title,
      description: metaDesc,
      isPartOf: { "@id": D.site.url + "/#website" },
      about: { "@id": canonical + "#service" },
      inLanguage: D.site.lang,
      dateModified: new Date().toISOString().slice(0, 10),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: D.site.url + "/" },
        { "@type": "ListItem", position: 2, name: (p && p.eyebrow) || title, item: canonical },
      ],
    },
  ];
  return `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)}\n</script>`;
}

function shell({ title, metaDesc, canonical, bodyClass, mainHtml, pageKey, startingPrice }) {
  const wa = whatsAppHref();
  const jsonLd = pageKey
    ? renderServiceJsonLd({ title, metaDesc, canonical, pageKey, startingPrice })
    : "";
  return `<!DOCTYPE html>
<html lang="${esc(D.site.lang)}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc)}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<link rel="canonical" href="${esc(canonical)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(D.brand.name)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(metaDesc)}" />
<meta property="og:url" content="${esc(canonical)}" />
<meta property="og:image" content="${esc(D.site.url + "/assets/media/og-cover.jpg")}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(metaDesc)}" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="512x512" href="/assets/icon-512.png" />
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<link rel="stylesheet" href="/fonts.css" />
<link rel="stylesheet" href="/styles.css" />
${jsonLd}
</head>
<body class="${esc(bodyClass)}" data-page="sub">
<a class="skip-link" href="#main">Skip to content</a>

<header class="site-nav" id="site-nav">
  <a class="nav-mark" href="/" data-nav-mark>
    <img src="/assets/logo-mark.png" alt="${esc(D.brand.name)} — home" width="298" height="383" draggable="false" />
  </a>
  <nav class="nav-links" id="nav-links" aria-label="Primary">
    <a href="/">Home</a>
    <a href="/deep-cleaning">Deep Cleaning</a>
    <a href="/organising">Organising</a>
    <a href="/interior-design">Interior Design</a>
    <a href="/contact">Contact</a>
  </nav>
  <a class="nav-cta f-label" id="nav-cta-desktop" href="#book">Get a quote</a>
  <button type="button" class="nav-burger" id="nav-burger" data-nav-burger aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
    <span></span><span></span><span></span>
  </button>
</header>

<div class="mobile-nav" id="mobile-nav" aria-hidden="true">
  <nav class="mobile-nav__links" id="mobile-nav-links" aria-label="Mobile">
    <a href="/">Home</a>
    <a href="/deep-cleaning">Deep Cleaning</a>
    <a href="/organising">Organising</a>
    <a href="/interior-design">Interior Design</a>
    <a href="/contact">Contact</a>
  </nav>
  <a class="mobile-nav__cta btn btn-primary" id="mobile-nav-cta" href="#book">Get a quote</a>
  <ul class="mobile-nav__contact f-label" id="mobile-nav-contact">
    <li><a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a></li>
    <li><a href="${esc(D.contact.phone.href)}">Call</a></li>
  </ul>
</div>

<div class="quick-contact" id="quick-contact">
  <span class="quick-contact__label f-label" data-quick-contact-label>${esc(D.quickContact.label)}</span>
  <a class="quick-contact__btn quick-contact__btn--whatsapp" data-quick-whatsapp href="${esc(wa)}" target="_blank" rel="noopener" aria-label="WhatsApp ${esc(D.brand.name)} for a quote">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.04 4c-4.34 0-7.87 3.53-7.87 7.87 0 1.39.36 2.73 1.05 3.92L4 20l4.34-1.14a7.86 7.86 0 0 0 3.7.94c4.34 0 7.87-3.53 7.87-7.87 0-2.1-.82-4.08-2.31-5.57l-.04-.04zm-5.56 12.1a6.53 6.53 0 0 1-3.33-.91l-.24-.14-2.48.65.66-2.42-.16-.25a6.54 6.54 0 0 1-1-3.48c0-3.61 2.94-6.55 6.56-6.55a6.51 6.51 0 0 1 4.63 1.93 6.5 6.5 0 0 1 1.92 4.63c0 3.62-2.94 6.55-6.56 6.55zm3.59-4.9c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.51.64-.62.77-.11.13-.23.14-.43.05-.2-.1-.83-.31-1.58-.98-.58-.52-.98-1.16-1.09-1.36-.11-.2-.01-.3.09-.4.09-.1.2-.23.3-.35.1-.11.13-.2.2-.33.06-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.34-.11 0-.24-.01-.37-.01-.13 0-.34.05-.52.25-.18.2-.68.66-.68 1.62s.7 1.88.79 2.01c.1.13 1.37 2.09 3.32 2.93.46.2.83.32 1.11.41.47.15.89.13 1.23.08.38-.06 1.17-.48 1.33-.94.16-.46.16-.86.11-.94-.05-.08-.18-.13-.38-.23z" fill="currentColor"/></svg>
    <span>WhatsApp</span>
  </a>
  <a class="quick-contact__btn quick-contact__btn--call" data-quick-call href="${esc(D.contact.phone.href)}" aria-label="Call ${esc(D.brand.name)}">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.1 15.1 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>
    <span>Call</span>
  </a>
</div>

<main id="main">
${mainHtml}
</main>

<footer class="site-footer">
  <div class="container site-footer__areas">
    <h2 class="f-label site-footer__areas-title">Areas we serve</h2>
    <p class="f-body site-footer__areas-list">Mohali (SAS Nagar)</p>
    <p class="f-body site-footer__areas-note">Not sure if you're in range? <a href="${esc(wa)}" target="_blank" rel="noopener">Ask on WhatsApp</a>.</p>
  </div>
  <div class="container site-footer__row">
    <div class="site-footer__mark">
      <img src="/assets/logo-mark.png" alt="" width="298" height="383" loading="lazy" decoding="async" draggable="false" />
      <span class="f-display">${esc(D.brand.name)}</span>
    </div>
    <ul class="site-footer__links f-label">
      <li><a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a></li>
      <li><a href="${esc(D.contact.phone.href)}">${esc(D.contact.phone.display)}</a></li>
      <li><a href="/">Home</a></li>
      <li><a href="/deep-cleaning">Deep Cleaning</a></li>
      <li><a href="/organising">Organising</a></li>
      <li><a href="/interior-design">Interior Design</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </div>
  <div class="container site-footer__bottom f-label">
    <span data-footer-copyright>© ${new Date().getFullYear()} ${esc(D.brand.name)} All rights reserved.</span>
    <span>${esc(D.contact.location)}</span>
  </div>
</footer>

<script src="/vendor/gsap.min.js" defer></script>
<script src="/vendor/ScrollTrigger.min.js" defer></script>
<script src="/vendor/lenis.min.js" defer></script>
<script src="/js/data.js" defer></script>
<script src="/js/main.js" defer></script>
</body>
</html>
`;
}

function renderServicePage(key) {
  const p = D.servicePages[key];
  if (!p) throw new Error("Missing servicePages." + key);

  const priceRows = Object.entries(D.pricing.sizeRates || {})
    .map(([size, rates]) => {
      const amt = rates.deepCleaning;
      if (!amt || key !== "deep-cleaning") return null;
      return `      <div class="svc-page__rate"><span class="f-label">${esc(size)}</span><strong class="f-display">${esc(inr(amt))}</strong><span class="f-body">from</span></div>`;
    })
    .filter(Boolean)
    .join("\n");

  const starting = (D.pricing.services.find((s) =>
    key === "interior-design" ? s.id === "styling" :
    key === "deep-cleaning" ? s.id === "deep-cleaning" :
    key === "organising" ? s.id === "organising" : false
  ) || {}).startingPrice;

  const includes = (p.includes || [])
    .map((line) => `        <li>${esc(line)}</li>`)
    .join("\n");

  const subServices = (p.subServices || [])
    .map((sub) => {
      const label = sub.quoteLabel || sub.name;
      return [
        `      <article class="svc-page__sub">`,
        `        <h3 class="f-display svc-page__sub-name">${esc(sub.name)}</h3>`,
        `        <p class="f-body svc-page__sub-blurb">${esc(sub.blurb || "")}</p>`,
        `        <p class="f-label svc-page__sub-price">From ${esc(inr(sub.startingPrice))}</p>`,
        `        <a class="btn btn-outline svc-page__sub-cta" href="#book" data-quote-preselect="${esc(label)}">Get a quote</a>`,
        `      </article>`,
      ].join("\n");
    })
    .join("\n");

  const subSection = subServices
    ? `
  <section class="section section-pad svc-page__subs" id="by-area">
    <div class="container">
      <p class="f-label">Book by area</p>
      <h2 class="f-display t-headline-lg">FULL HOME, OR JUST ONE SPACE.</h2>
      <p class="f-body t-body-lg">Pick the rooms you need — bathroom, kitchen, balcony, sofa — or the whole house.</p>
      <div class="svc-page__sub-grid">
${subServices}
      </div>
    </div>
  </section>`
    : "";

  const bench = D.pricing.benchmarkNote
    ? `\n      <p class="f-body svc-page__bench">${esc(D.pricing.benchmarkNote)}</p>`
    : "";

  const mainHtml = `
  <section class="section section-pad svc-page__hero">
    <div class="container">
      <p class="f-label">${esc(p.eyebrow)}</p>
      <h1 class="f-display svc-page__h1">${p.heroH1}</h1>
      <p class="f-body t-body-lg svc-page__support">${esc(p.heroSupport)}</p>
      ${starting ? `<p class="f-label svc-page__from">From ${esc(inr(starting))}</p>` : ""}
      <a class="btn btn-primary" href="#book">Get a WhatsApp quote</a>
      ${subServices ? `<a class="btn btn-outline svc-page__hero-secondary" href="#by-area">See by-area options</a>` : ""}
    </div>
  </section>

  <section class="section section-pad svc-page__about">
    <div class="container svc-page__grid">
      <div>
        <h2 class="f-display t-headline-lg">${esc(p.heading)}</h2>
        <p class="f-body t-body-lg">${esc(p.intro)}</p>
      </div>
      <div>
        <h3 class="f-label">What's included</h3>
        <ul class="svc-page__includes f-body">
${includes}
        </ul>
      </div>
    </div>
  </section>
${subSection}

  <section class="section section-pad svc-page__pricing" id="pricing">
    <div class="container">
      <p class="f-label">Pricing</p>
      <h2 class="f-display t-headline-lg">STARTING FROM.</h2>
      <p class="f-body t-body-lg">${esc(p.pricingBlurb)}</p>
      ${key === "deep-cleaning" && priceRows ? `<div class="svc-page__rates">${priceRows}</div>` : ""}
      ${starting && key !== "deep-cleaning" ? `<p class="f-display svc-page__from-lg">From ${esc(inr(starting))}</p>` : ""}${bench}
    </div>
  </section>

  <section class="section section-pad final-cta" id="book">
    <div class="container final-cta__top">
      <h2 class="f-display final-cta__heading"><span class="line"><i>ASK FOR YOUR</i></span><span class="line"><i>${esc(p.quoteService.toUpperCase())}</i></span><span class="line"><i>QUOTE.</i></span></h2>
      <p class="f-body t-body-lg final-cta__support">Fill this in — we write the WhatsApp message (quoting your words) and open it to ${esc(D.contact.phone.display)}.</p>
    </div>
    <div class="container final-cta__form-wrap">
${renderQuoteForm({ id: "quote-form-" + p.slug, preselectService: p.quoteService })}
    </div>
    <div class="container final-cta__actions">
      <a class="final-cta__whatsapp final-cta__whatsapp--secondary" data-cta-whatsapp href="${esc(whatsAppHref())}" target="_blank" rel="noopener">
        <span>Or message her directly</span>
        <span class="final-cta__whatsapp-arrow" aria-hidden="true">↗</span>
      </a>
      <div class="final-cta__secondary">
        <a href="${esc(D.contact.phone.href)}">${esc(D.contact.phone.display)}</a>
      </div>
    </div>
  </section>
`;

  return shell({
    title: p.title,
    metaDesc: p.metaDesc,
    canonical: D.site.url + "/" + p.slug,
    bodyClass: "page-sub page-service has-quick-contact",
    mainHtml,
    pageKey: key,
    startingPrice: starting,
  });
}

function renderContactPage() {
  const mainHtml = `
  <section class="section section-pad svc-page__hero">
    <div class="container">
      <p class="f-label">Contact</p>
      <h1 class="f-display svc-page__h1">ASK HER<br />WHAT YOU NEED.</h1>
      <p class="f-body t-body-lg svc-page__support">No long web form submit — your answers become a WhatsApp message to Rupinder.</p>
    </div>
  </section>
  <section class="section section-pad final-cta" id="book">
    <div class="container final-cta__form-wrap">
${renderQuoteForm({ id: "quote-form-contact" })}
    </div>
    <div class="container final-cta__actions">
      <a class="final-cta__whatsapp final-cta__whatsapp--secondary" href="${esc(whatsAppHref())}" target="_blank" rel="noopener">
        <span>Or message her directly</span>
        <span class="final-cta__whatsapp-arrow" aria-hidden="true">↗</span>
      </a>
      <div class="final-cta__secondary">
        <a href="${esc(D.contact.phone.href)}">${esc(D.contact.phone.display)}</a>
      </div>
    </div>
  </section>
`;

  return shell({
    title: "Contact Her Homes | Get a Quote on WhatsApp",
    metaDesc: "Contact Her Homes Co. in Mohali. Tell us what you want; we open WhatsApp with your quote message ready for +91-9915217674.",
    canonical: D.site.url + "/contact",
    bodyClass: "page-sub page-contact has-quick-contact",
    mainHtml,
  });
}

const pages = [
  ["deep-cleaning", () => renderServicePage("deep-cleaning")],
  ["organising", () => renderServicePage("organising")],
  ["interior-design", () => renderServicePage("interior-design")],
  ["contact", renderContactPage],
];

for (const [slug, build] of pages) {
  const dir = path.join(ROOT, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, "index.html"), build(), "utf8");
  console.log("Generated /" + slug);
}

console.log("Subpages generated from js/data.js servicePages");
