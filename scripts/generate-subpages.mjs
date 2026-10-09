import fs from 'fs';
import path from 'path';

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
    title: 'Contact Her Homes | Mohali & Tricity',
    heroH1: 'CONTACT<br />HER HOMES CO.',
    heroSupport: 'Message us directly on WhatsApp with a bit about your home to get started.',
    metaDesc: 'Contact Her Homes Co. in Mohali, Punjab for interior styling, home organising, and deep cleaning services. Call or WhatsApp us at +91-9915217674.'
  }
];

const template = fs.readFileSync('index.html', 'utf8');
let sitemapUrls = [];

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
  
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('Generated /' + p.slug);
  
  sitemapUrls.push(`  <url>\n    <loc>https://herhomes.shop/${p.slug}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n  </url>`);
}

let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
if (true) {
    sitemap = sitemap.replace('</urlset>', sitemapUrls.join('\n') + '\n</urlset>');
    fs.writeFileSync('sitemap.xml', sitemap);
    console.log('Updated sitemap.xml');
}
