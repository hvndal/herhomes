import fs from 'fs';
import path from 'path';

/**
 * Clone the prerendered homepage into SEO landing pages, with page-specific
 * title/hero/meta. Also rewrites any leftover relative asset paths to
 * root-absolute ones so images, logos and the favicon don't 404 under
 * /organising/, /contact/, etc.
 *
 * Sitemap is owned by scripts/prerender.mjs — do not append here (that used
 * to duplicate every URL on every build).
 */

const pages = [
  {
    slug: 'deep-cleaning',
    title: 'Deep Cleaning Services in Mohali | Her Homes',
    heroH1: 'DEEP CLEANING<br />SERVICES.',
    heroSupport: 'A full-home reset — kitchen degreasing, bathroom detailing, and everything in between.',
    metaDesc: 'Deep cleaning services in Mohali by Her Homes Co. A full reset — the foundation the rest of the transformation is built on. Message us on WhatsApp to book.'
  },
  {
    slug: 'organising',
    title: 'Home Organising Services in Mohali | Her Homes',
    heroH1: 'HOME ORGANISING<br />SERVICES.',
    heroSupport: 'Wardrobes, kitchens, drawers, and pantries — organised to actually hold.',
    metaDesc: 'Home organising services in Mohali by Her Homes Co. We organize wardrobes, kitchens, drawers, and storage spaces to fit the way you actually live.'
  },
  {
    slug: 'interior-design',
    title: 'Interior Designers in Mohali | Her Homes',
    heroH1: 'INTERIOR DESIGN<br />SERVICES.',
    heroSupport: 'Decor direction, furniture placement, and full room styling around your aesthetic.',
    metaDesc: 'Premier interior designers in Mohali, Punjab. Her Homes Co. provides decor direction, color, and furniture placement to build the space around the way you actually live.'
  },
  {
    slug: 'contact',
    title: 'Contact Her Homes | Get a Quote on WhatsApp',
    heroH1: 'ASK HER<br />WHAT YOU NEED.',
    heroSupport: 'Fill in the quote form — we write the WhatsApp message for you and open it so you can send it to Rupinder.',
    metaDesc: 'Contact Her Homes Co. in Mohali for a personalised quote. Tell us what you want; we open WhatsApp with your message ready to send to +91-9915217674.'
  }
];

const template = fs.readFileSync('index.html', 'utf8');

const quickContactHtml = `
<div class="quick-contact" id="quick-contact">
  <span class="quick-contact__label f-label" data-quick-contact-label>Ask her for a quote</span>
  <a class="quick-contact__btn quick-contact__btn--whatsapp" data-quick-whatsapp href="https://wa.me/919915217674?text=Hey%2C%20I%20need%20home%20designing%20or%20organising%20etc." target="_blank" rel="noopener" aria-label="WhatsApp Her Homes Co. for a quote">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.04 4c-4.34 0-7.87 3.53-7.87 7.87 0 1.39.36 2.73 1.05 3.92L4 20l4.34-1.14a7.86 7.86 0 0 0 3.7.94c4.34 0 7.87-3.53 7.87-7.87 0-2.1-.82-4.08-2.31-5.57l-.04-.04zm-5.56 12.1a6.53 6.53 0 0 1-3.33-.91l-.24-.14-2.48.65.66-2.42-.16-.25a6.54 6.54 0 0 1-1-3.48c0-3.61 2.94-6.55 6.56-6.55a6.51 6.51 0 0 1 4.63 1.93 6.5 6.5 0 0 1 1.92 4.63c0 3.62-2.94 6.55-6.56 6.55zm3.59-4.9c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.51.64-.62.77-.11.13-.23.14-.43.05-.2-.1-.83-.31-1.58-.98-.58-.52-.98-1.16-1.09-1.36-.11-.2-.01-.3.09-.4.09-.1.2-.23.3-.35.1-.11.13-.2.2-.33.06-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.34-.11 0-.24-.01-.37-.01-.13 0-.34.05-.52.25-.18.2-.68.66-.68 1.62s.7 1.88.79 2.01c.1.13 1.37 2.09 3.32 2.93.46.2.83.32 1.11.41.47.15.89.13 1.23.08.38-.06 1.17-.48 1.33-.94.16-.46.16-.86.11-.94-.05-.08-.18-.13-.38-.23z" fill="currentColor"/></svg>
    <span>WhatsApp</span>
  </a>
  <a class="quick-contact__btn quick-contact__btn--call" data-quick-call href="tel:+919915217674" aria-label="Call Her Homes Co. for a quote">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.1 15.1 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>
    <span>Call</span>
  </a>
</div>
`;

/** Fix relative asset refs that break under /slug/ paths. */
function rootAbsoluteAssets(html) {
  return html
    .replace(/(href|src)=["'](?!\/|https?:|tel:|mailto:|#)(assets\/[^"']+)["']/g, '$1="/$2"')
    .replace(/(srcset)=["'](?!\/|https?:)(assets\/[^"'\s]+)([^"']*)["']/g, '$1="/$2$3"')
    .replace(/href=["']favicon\.ico["']/, 'href="/favicon.ico"');
}

for (const p of pages) {
  const dir = path.join(process.cwd(), p.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  let html = template;

  html = html.replace(/<title>.*?<\/title>/, `<title>${p.title}</title>`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${p.title}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${p.title}" />`);

  html = html.replace(/<link rel="canonical" href="https:\/\/herhomes\.shop\/" \/>/, `<link rel="canonical" href="https://herhomes.shop/${p.slug}" />`);
  html = html.replace(/<meta property="og:url" content="https:\/\/herhomes\.shop\/" \/>/, `<meta property="og:url" content="https://herhomes.shop/${p.slug}" />`);

  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${p.metaDesc}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${p.metaDesc}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${p.metaDesc}" />`);

  html = html.replace(/(<h1[^>]*>[\s\S]*?<span class="sr-only">.*?<\/span>[\s\S]*?)A HOME,<br \/>BUT YOURS\./, `$1${p.heroH1}`);
  html = html.replace(/(<p class="hero__support f-body t-body-lg" data-hero-reveal>).*?(<\/p>)/, `$1${p.heroSupport}$2`);

  html = html.replace('<body class="page-home">', '<body class="page-sub has-quick-contact">');
  html = html.replace('<main id="main">', quickContactHtml + '\n<main id="main">');

  // Contact page: skip straight to the quote form after a short hero.
  if (p.slug === 'contact') {
    html = html.replace(
      /(<a class="nav-cta f-label" id="nav-cta-desktop" href=")#[^"]*(")/,
      '$1#book$2'
    );
    html = html.replace(
      /(<a class="mobile-nav__cta btn btn-primary" id="mobile-nav-cta" href=")#[^"]*(")/,
      '$1#book$2'
    );
  }

  html = rootAbsoluteAssets(html);

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('Generated /' + p.slug);
}

console.log('Subpages generated (sitemap owned by prerender.mjs)');
