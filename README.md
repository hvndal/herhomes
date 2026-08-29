# Her Homes Co. — Website

A full rebuild of the Her Homes Co. site around the existing, approved brand
(the illustrated logo mark, "Her Homes Co." wordmark, warm cream / charcoal /
steel blue / yellow palette, Anton + Hanken Grotesk). Static HTML, CSS and
vanilla JS, animated with GSAP, ScrollTrigger and Lenis.

**The site is live at https://herhomes.shop.**

> ### ⚠️ One rule: after editing `js/data.js`, run `npm run build`
>
> This used to be a no-build project, and that was quietly costing it every
> visitor it could have had. All the page's copy lived only inside
> `js/data.js` and was written into the page by JavaScript at load time,
> which meant the HTML a search engine actually downloads contained no
> service names, no prices, no process, no founder bio — about 40 words in
> total. Google renders JavaScript, but only on a slow second pass; Bing
> often doesn't; and the WhatsApp / Facebook / LinkedIn link-preview
> scrapers never do. For a business whose funnel is "someone forwards the
> link on WhatsApp", that last one mattered most.
>
> `npm run build` fixes that by writing the real copy into `index.html`
> before it ships (1,275 indexable words now, up from ~40). `js/data.js`
> is still the only file you edit — the build just copies it into the HTML.
> CI fails the deploy if you forget.

The original Stitch export (`stitch_the_her_homes_lookbook/`) is left
untouched next to this folder — it was the design/brand reference this
rebuild was built from, not something this project modifies.

## Running it locally

```
npm install
npm start
```

Then open http://localhost:4321. `npm start` runs a tiny dependency-free
static server (`scripts/serve.mjs`) — it also serves `404.html` properly,
which `file://` can't.

Double-clicking `index.html` still mostly works, since everything is
self-hosted (fonts, GSAP, ScrollTrigger, Lenis all live in this folder), but
some browsers block local video and font files over `file://`.

### The build commands

| Command | What it does |
|---|---|
| `npm run build` | Everything below. **Run this before every deploy.** |
| `npm run build:html` | Writes `js/data.js` into `index.html`, `sitemap.xml` and `robots.txt`. Run after any content edit. |
| `npm run build:images` | Regenerates the share card, the favicons, and a WebP next to every photo. Only needed after adding or replacing a photo. |
| `npm run check` | Fails if the committed HTML is stale versus `js/data.js`. This is what CI runs. |

Only `build:images` needs `sharp` (a dev dependency); `build:html` and
`check` are plain Node with nothing installed.

## Deployment

**The site deploys through Vercel, on every push to `main`.** There is no
build step on the host: `index.html` ships with its copy already
prerendered, and `assets/media/` ships with the generated WebP, icons and
share card. `vercel.json` therefore skips install and runs only
`node scripts/prerender.mjs --check` as its "build" — a guard that fails
the deploy if someone edited `js/data.js` without running `npm run build`,
which would otherwise silently ship a page whose copy exists only in
JavaScript. That check needs no dependencies.

> **Media URLs carry a content hash** (`?v=<8 hex of the file's bytes>`,
> added by `assetUrl()` in `scripts/prerender.mjs`). This is not
> decoration — it fixes a bug that reached production. `/assets/media/`
> was cached for a year as `immutable`, which tells browsers never to
> revalidate, while this project's entire media workflow is "drop a better
> photo at the same path and it takes over" — precisely what `immutable`
> forbids. The service panels were replaced in place and every browser and
> CDN edge that had seen the old ones kept serving them. Hashing the
> content into the URL makes both decisions compatible: change the file,
> the URL changes, caches miss. The media header was also softened from a
> year-immutable to a week with `stale-while-revalidate`, so references
> that can't carry a hash (the hero poster, which is a CSS background)
> self-heal instead of being stuck.

`vercel.json` also sets cache headers: a year and `immutable` for fonts,
media and the vendor libraries (they only ever change under a new filename),
an hour for CSS/JS, and always-revalidate for `index.html` so a content
edit actually reaches people.

> **A note on why `vercel.json` had to exist.** Vercel deployed this repo
> fine until `package.json` gained a `build` script. Vercel auto-detects
> that script, runs it, and then looks for an output directory it never
> finds — its default guess is `public/` — so the deploy started failing.
> `npm run build` also runs the image step, which needs `sharp`: a ~100 MB
> native dependency with no business running on a deploy when its output is
> already committed. If you ever remove `vercel.json`, expect that failure
> to come back.

### GitHub Pages

`.github/workflows/pages.yml` and `CNAME` are a complete GitHub Pages
setup, **currently disabled** (`workflow_dispatch` only). It was written
before it was clear Vercel was already connected, and two hosts cannot both
own `herhomes.shop`. It is left in place rather than deleted because it
works and is one line from being live again.

- **Staying on Vercel?** Delete `.github/workflows/pages.yml` and `CNAME`.
- **Switching to Pages?** Restore the `push:` trigger in that workflow, set
  Settings → Pages → Source to "GitHub Actions", point DNS at the four
  GitHub A records listed in the workflow header, and move the domain off
  the Vercel project.

Note that the Pages workflow will fail at the `configure-pages` step until
Settings → Pages → Source is set to "GitHub Actions" — that is a repository
setting no workflow can set for itself.

## File structure

```
js/data.js            *** THE ONLY FILE YOU SHOULD NEED TO EDIT ***
index.html            Page markup. The parts between <!--@gen:...--> markers
                        are GENERATED — don't hand-edit them, they get
                        overwritten by the next build
scripts/prerender.mjs Writes data.js into index.html/sitemap.xml/robots.txt
scripts/optimize-images.mjs  Share card, favicons, WebP versions
scripts/serve.mjs     Local preview server (npm start)
styles.css            All design tokens + section styles
fonts.css             Self-hosted @font-face rules (Anton, Hanken Grotesk)
js/main.js            All animation/interaction logic
assets/               Logo crops, generated icons, font files
assets/media/         Photos + video, and the generated .webp next to each
vendor/               Self-hosted GSAP, ScrollTrigger, Lenis (no CDN)

GENERATED — do not hand-edit:
robots.txt            Crawler rules
sitemap.xml           One-page sitemap
favicon.ico, assets/icon-*.png, assets/apple-touch-icon.png
assets/media/og-cover.jpg      The WhatsApp/Facebook share image
assets/media/*.webp

Deployment:
CNAME                 Custom domain for GitHub Pages (herhomes.shop)
.nojekyll             Tells Pages to serve files as-is
site.webmanifest      PWA/mobile metadata
404.html              Branded not-found page (noindex)
.github/workflows/pages.yml   Auto-deploys every push to main
```

## The service chooser under the hero

Three full-height panels — Deep Cleaning, Organising, Interior Design —
sitting directly after "A HOME, BUT YOURS." Each one is a single real
`<a href>` into a WhatsApp message already written for that service, so
someone who lands knowing what they want never has to read the page to ask
for it. Edit them in `serviceChooser` in `js/data.js`.

- **Desktop:** three columns. Hovering or tab-focusing one expands it and
  the others yield; idle panels show only a rotated spine label, which is
  what makes them read as vertical tabs. Pure CSS — no JavaScript involved
  in the interaction.
- **Mobile:** they stack into three bands with the copy always visible.
  Three narrow columns on a phone is unreadable, and hover doesn't exist
  there.

### The panel backgrounds

Stock photography from Pexels, fetched and cropped to the tall panel shape
by a separate manual script:

```
npm run fetch:stock
```

It is deliberately **not** part of `npm run build`: it needs network access
(a build shouldn't), and its output is committed, so it only needs to run
again when somebody wants different photographs. Photo IDs, credits and the
licence are in `scripts/fetch-stock.mjs`, and it also writes
`assets/media/CREDITS.txt` next to the images so provenance survives even
if nobody opens the script.

The Pexels Licence allows free commercial use and modification and requires
no attribution. The sources are recorded anyway — attribution not being
required doesn't make it less useful to know where an image came from, or
which one to replace if it's ever pulled.

> **These are stock photographs of homes and cleaning in general — not
> photographs of Her Homes Co.'s own work,** and nothing on the page claims
> they are. Replace them with real photos of real jobs the moment those
> exist: drop one at `assets/media/service-<id>.jpg` and run
> `npm run build`. `build:images` will not overwrite an existing file, so
> your photo is safe; just don't run `fetch:stock` again afterwards.

If a service has no image at all, `build:images` draws a brand-palette
fallback panel for it (see `buildServicePanels`) rather than leaving a hole.

> **Naming:** this section says "Interior Design" — the owner's words, and
> the term people actually search for. "What We Do", the pricing menu and
> the schema still call the same service "Home Styling". To make the whole
> site agree, change `name` in `serviceChooser.items`, `services.items`
> and `pricing.services` together, then run `npm run build`.

## No booking form, by design

There's no on-page booking form. For a direct, local (Tricity / Mohali)
business, a WhatsApp message someone actually replies to beats a form field
someone has to fill in — so the final section's primary action is a large
"Message her on WhatsApp" button (`finalCta.whatsappButtonLabel`; the link
itself is `contact.whatsapp`, with a friendly pre-filled opener you can edit
at `contact.whatsapp.message`), with phone as a secondary link underneath.
If you ever want a form back, the old field-list/validation logic is a
small, self-contained pattern — ask whoever's maintaining this to re-add it
rather than reconstructing it from scratch.

## Editing content — everything lives in `js/data.js`

Every piece of business content — copy, pricing, contact details, the style
worlds, the process steps, the founder bio, form fields, media — is one
JavaScript object (`HHC_DATA`) in `js/data.js`. Nothing else needs to change
for a routine content update: no HTML, no CSS, no touching `main.js`.

### Placeholders that need real information before this goes live

Search `js/data.js` for the word `PLACEHOLDER` and you'll land on all of
these directly. Nothing was invented — every one of these was left as a
placeholder because the real value wasn't provided:

**Contact (`HHC_DATA.contact`)**
- ~~WhatsApp number~~ / ~~Phone~~ — **done, both.** `contact.whatsapp.number`
  and `contact.phone.href` are the real Indian mobile number (same number,
  used two ways — WhatsApp message and direct call). `contact.whatsapp.href`
  is built automatically (`https://wa.me/91XXXXXXXXXX?text=...`). Both are
  live: the final-CTA section, the mobile menu, and the floating quick-contact
  widget (see below) all read from these same two fields.
- ~~Instagram~~ — removed for now (no real account exists yet), rather than
  showing a broken placeholder link. Add `contact.instagram` back (label,
  handle, href) whenever there's a real one, and re-add it to the three
  places it used to render: the final-CTA secondary links and footer links
  in `initFinalCta()`, and the mobile-nav contact list in `initNav()`.
- Email (`contact.email`)
- Location / service area copy (`contact.location`) — currently `null`,
  which the footer simply omits; set it and it appears automatically

**Pricing (`HHC_DATA.pricing.services`)** — four services: Home Styling,
Home Organising, Deep Cleaning, Combined Reset. All four currently have
`startingPrice: null`, which renders as a tasteful "Personalised quote"
rather than a number. Fill in a real starting price on any of them and it
will display automatically. **The one real, confirmed price already in
the file and already live on the page** is the ₹5,000 one-time shelf /
detailed-organisation add-on (`pricing.addOns`, `id: "shelf-organising"`)
— do not remove `confirmed: true` from anything else unless the number is
actually final, since that flag is what the page uses to decide whether to
show a number or a "personalised quote" treatment.

**Founder (`HHC_DATA.founder`)**
- ~~`founder.name` / `founder.bio`~~ — **done.** Rupinder Kaur, with a bio
  built from what was provided (self-made, started in a village, a natural
  knack for organising and interior design that grew into the business).
- Founder photo — still needed, see media slots below (`founder-portrait`)

**Media** — every image/video area on the page is a placeholder frame until
a real file is supplied. Set `mediaSlots["<key>"].src` to a real path and it
swaps in automatically (drop the file in `assets/media/`); leave `src: null`
and the page keeps showing its styled placeholder instead of breaking. The
hero video slot is special-cased for responsiveness — see below.

Already wired up with real media:

| Key | Type | File | Note |
|---|---|---|---|
| `hero-film` (`mobileSrc`) | video | `assets/media/hero-mobile.mp4` | Phone/narrow-viewport cut (portrait, transcoded down from the original) |
| `hero-film` (`desktopSrc`) | video | `assets/media/hero-pc.mp4` | Wide/desktop cut, transcoded down from the "pc version" file |
| `style-scandinavian` | image | `assets/media/scandinavian.jpg` | |
| `style-bohemian` | image | `assets/media/bohemian.jpg` | |
| `style-college-core` | image | `assets/media/college-core.jpg` | |
| `style-minimalist` | image | `assets/media/minimalist.jpg` | |

Each of the above also has a generated `.webp` beside it, served via
`<picture>` with the `.jpg` as the fallback.

Two of the extra video files found in the folder were deliberately **not**
used anywhere on the site: `stockvid.mp4` (an overhead flat-lay of flowers /
pastries / journal-writing — no interior or home content, off-brand for a
home-styling business) and the UHD clip of a man reading a newspaper in a
traditional floral-wallpapered kitchen (clashes with the curated modern /
Scandinavian / Bohemian / minimalist look the rest of the site is built
around). If either was meant for a specific spot, say so and it's a quick
add.

**Empty media slots no longer render anything.** They used to draw a grey
hatched frame captioned with the internal to-do note, so real visitors were
reading things like "Founder portrait — warm, personal, not corporate
headshot." on the live site. A slot with no real file is now simply absent.

Two follow-on changes came out of that:

- **"Modern" is back, and there are now seven style worlds:**
  Scandinavian, Japandi, Modern, Minimalist, Indian Heritage, Bohemian and
  College Core. Modern, Japandi and Indian Heritage use photography
  fetched by `npm run fetch:stock`; the other four were supplied with the
  project. Adding another is one line in `styleWorlds` plus one image at
  `assets/media/<id>.jpg` — the slot, the WebP, the schema and the scroll
  pacing all follow automatically.

  **The Punjabi world is illustrated by a textile, not a room — and that
  needs replacing.** Pexels has no genuine Punjabi *interior* photography:
  searching returns portraits, gurdwaras and village exteriors, and the one
  promising "Indian courtyard" result turned out to be a South Indian
  heritage-house museum with mannequins in it. Its image is therefore a
  close-up of dense floss-silk geometric embroidery in marigold, rust and
  indigo — visually very close to phulkari, honest as a swatch, and its alt
  text says "embroidered textile" rather than claiming to be phulkari or a
  Punjabi home. It is the only world shown as a material rather than a
  space. **One photo of a real Punjabi interior fixes it properly:** drop
  it at `assets/media/punjabi.jpg` and delete that entry from
  `scripts/fetch-stock.mjs` so it isn't overwritten.
- **The founder section lays out as a single centred column** instead of a
  two-column grid with a hole in it. Set
  `mediaSlots["founder-portrait"].src` and rebuild, and the two-column
  layout returns on its own — no markup edit.

Still want a real file:

| Key | Type | What it is |
|---|---|---|
| `founder-portrait` | image | Founder photo. Highest value of the four — a real face is the single biggest trust signal on a page like this |
| `style-modern` | image | Only needed if you restore the Modern style world |
| `process-visual` | image | Pinned visual for the process section |
| `styling-detail` / `organising-detail` / `deep-cleaning-detail` | image | "What We Do" supporting images |

After adding any photo, run `npm run build` — that generates its WebP and
prints its pixel dimensions for the `width`/`height` fields.

**There's no before/after section any more.** It needs real photography to
mean anything, and this build environment can't browse the web or fetch
stock photography to fake it — its network only reaches a short allowlist of
software package registries, nothing that hosts images. Rather than ship an
empty placeholder block or invented images, the section (markup, styles,
`initTransformation()` in `main.js`, and the `transformation` data block)
was removed outright. If you want it back — with real before/after photos of
an actual job — drop the two images in the folder and ask for the section to
be rebuilt; the slider mechanics (the drag-to-compare interaction) are
simple to re-add.

### The pricing "calculator" leads somewhere

The home-size picker in the pricing section (1 BHK / 2 BHK / 3 BHK / 4 BHK+)
doesn't compute a number — there's no real size-tiered pricing yet, and nothing
here fabricates one. What it does do: picking a size updates the "Get a
personalised quote" button below it into a working WhatsApp link that
mentions the size you picked (edit the wording at
`HHC_DATA.pricing.quoteMessageTemplate`), so the picker ends in an actual
quote request instead of being decorative. The moment real size-based prices
exist, this is also the natural place to display them.

### Quick contact — WhatsApp + Call, visible from the first screen

A small floating widget (bottom-left, labelled "Ask her for a quote") sits
on top of every screen, including the opening logo scene — so a visitor who
just wants to message or call never has to scroll through the page first.
It reads the same `contact.whatsapp` / `contact.phone` values as everything
else, so there's nothing extra to maintain. It politely steps aside
(fades out) while the final-CTA section or the mobile menu is on screen,
since both of those already show the same WhatsApp/Call links — no point
showing the same button twice at once. Edit the caption at
`HHC_DATA.quickContact.label`.

### Wording: "her", not "us" / "we"

Now that the founder (Rupinder Kaur) is established on the page, the
quote-asking copy speaks in terms of her rather than an anonymous "us":
`quickContact.label` ("Ask her for a quote"), `finalCta.support`, and
`finalCta.whatsappButtonLabel` ("Message her on WhatsApp") all use
her/she. This was applied narrowly, on purpose: the rest of the site's
existing "we" voice (process steps, service descriptions, the philosophy
statement) was left exactly as it was, since that copy predates this
change and wasn't asked to change. If you want the whole site to speak in
terms of "her" throughout, that's a bigger, separate rewrite — say so and
it can be done deliberately rather than half-applied.

### The hero video is responsive, not one-size-fits-all

`mediaSlots["hero-film"]` can carry `mobileSrc` and `desktopSrc` separately
(instead of, or in addition to, a plain `src` fallback). `main.js` picks
whichever fits the visitor's viewport at load time via `matchMedia`, so a
portrait phone cut and a landscape desktop cut can coexist without either
downloading on the wrong device. Any other video slot can use this same
pattern, or just set a plain `src` if one file is enough.

Everything else in `data.js` (the philosophy lines, process steps, service
descriptions, style-world names/words, footer links) is real, finished copy
— not placeholder — written to the brief. Edit it like any other copy
whenever you want, it isn't waiting on anything.

## SEO — what's implemented

Everything here is live in the shipped files. The domain is written in
exactly one place — `site.url` in `js/data.js` — and `npm run build`
stamps it into the canonical link, the Open Graph and Twitter tags, all five
JSON-LD `@id`s, `robots.txt` and `sitemap.xml`. Changing hosts is a
one-line edit followed by a build.

### The big one: the page's copy is now in the HTML

Previously the entire body of the page was written by JavaScript at runtime,
so `view-source` showed empty `<div>`s and empty `sr-only` headings —
roughly 40 words. It is now **1,275 words of real markup**, generated from
the same `js/data.js` by `scripts/prerender.mjs`.

`js/main.js` *adopts* that markup rather than rebuilding it (see the
`adopt()` helper at the top of the file): if the container already has
prerendered children it wires up behaviour and builds nothing, so there is
exactly one copy of every string and the two can't drift. If someone edits
`data.js` and forgets to build, the page still renders correctly at
runtime — it just goes back to being invisible to non-rendering crawlers,
which is why `npm run check` runs in CI.

Two sections are scroll-driven and only ever show one item at a time (the
style-world lookbook and the six process stages). Those now also carry a
visually hidden list of **all** their items, which is the only place a
crawler — or a screen-reader user — can see the full set.

### Local SEO — the service areas

Ten towns, all confirmed serviceable: **Mohali (SAS Nagar), Kharar,
Kurali, Zirakpur, Mullanpur (New Chandigarh), Landran, Banur, Derabassi,
Chandigarh and Panchkula.**

They live in one list — `site.areaServed` in `js/data.js` — and one edit
flows into all four places that matter:

- schema.org `City` entities on the business node, with `alternateName`
  where a place has two names people search (Mohali/SAS Nagar,
  Mullanpur/New Chandigarh);
- an **"Areas we serve" block in the footer as real readable text** — this
  is the part that actually wins a query like "home organiser in Kharar".
  Structured data tells a crawler what the business claims; the words on
  the page are what the query matches against;
- the FAQ answer for "Which areas do you serve?";
- the meta description and the footer strapline.

Adding a town is one line plus `npm run build`.

### Structured data

A five-node JSON-LD `@graph`: `HomeAndConstructionBusiness`, `Person`
(the founder), `WebSite`, `WebPage`, and `FAQPage`. The business node
carries `areaServed` as four proper schema.org `City` entities (Mohali,
Chandigarh, Panchkula, Zirakpur) rather than one free-text string, plus a
`hasOfferCatalog` mirroring the real service menu, with a price only on
the one add-on that actually has a confirmed one.

**Deliberately absent, because none of it is confirmed:** a street address,
opening hours, `aggregateRating`/review data, and `sameAs` social
profiles. Fabricated review markup in particular is a manual-action risk,
not just bad manners. Each drops in the moment it is real — see the notes in
`js/data.js`.

### The FAQ section

New, and it is the highest-value content addition available to a one-page
site: it's the only place the page says in plain words what deep cleaning
includes, which cities are covered, and how the price is arrived at — which
is what people actually type into a search box. Native `<details>`, so it
is keyboard-accessible and indexable with no JavaScript.

**Every answer was composed strictly from facts already on the site.**
Nothing about turnaround time, team size, insurance, guarantees or payment
terms is claimed. Read them once and correct anything that doesn't match how
the business really works — see the comment above `faq` in `js/data.js`.

### Vastu and Feng Shui

Home Organising now says it will work to **Vastu** (or Feng Shui) if that
matters in the home, there is a dedicated FAQ answering it, and both are in
the schema's `knowsAbout`. This is one of the strongest local-SEO moves
available here: "vastu for home" is a very high-volume Indian search and
almost no local cleaning or organising business has any content answering
it.

**Read the wording before launch.** It deliberately claims *only* that the
plan is built around whichever principles the client says matter to them —
it does not claim Vastu consultancy, does not offer to audit a home against
a chart, and promises nothing is moved on that basis unless asked. If the
business wants to make a stronger claim than that, it needs to be one it
can actually stand behind.

### Sharing and previews

`og:image` was pointing at the 454×652 portrait logo, so every WhatsApp and
Facebook preview cropped it into an unreadable strip. It is now a real
1200×630 interior shot (`assets/media/og-cover.jpg`, generated from the
hero still) with `summary_large_image`.

### Performance / Core Web Vitals

- All five scripts are `defer`red — 136 KB of animation library no longer
  blocks the parser.
- The hero still (the LCP element on essentially every visit) is preloaded
  per breakpoint and served as WebP via `image-set()`, with the JPEG as
  fallback. The `<video>` poster points at the same WebP, so it is a cache
  hit instead of a second download of the same picture.
- A `.webp` sits next to every photo — about 0.5 MB saved across the set,
  served through `<picture>` with the JPEG as fallback.
- Every `<img>` carries real `width`/`height`, so layout shift is zero.
- Real `favicon.ico`, 192/512 PNG icons, an Apple touch icon and
  `site.webmanifest` — all generated from the logo mark, squared onto the
  brand cream so the portrait mark isn't stretched.

### Analytics — still dormant, and now one line from live

`trackEvent()` in `main.js` is wired to every conversion point: WhatsApp
and phone clicks (quick-contact widget, final CTA, mobile menu), quote
requests, home-size selections, and which FAQ questions get opened. Set
`site.ga4MeasurementId` in `js/data.js` to a real `G-XXXXXXXXXX` and
run `npm run build` — the GA4 snippet is written into `<head>` and every
event starts flowing. Set `site.searchConsoleVerification` the same way for
the Search Console meta tag. Both stay out of the page entirely while they
are `null`, so nothing ever looks wired up while quietly tracking nothing.

### What is NOT done, and needs a human

1. **Google Business Profile.** For a local service business this drives more
   traffic than the website does. Nothing in this repo can create it.
2. **Search Console + GA4** — see above; needs real IDs.
3. **A confirmed address and opening hours**, if the business wants to appear
   in map results.
4. **Real starting prices** — all four services still read "Personalised
   quote".
5. **Social profiles** — an Instagram account would populate `sameAs`.
6. **Separate pages.** One page can only rank for so much. The natural next
   step is a page per service and per city (`/home-organising-mohali`),
   at which point `sitemap.xml` grows one `<url>` per page.

## Motion — one rhythm for the whole page

All the pacing lives in one `MOTION` object at the top of `js/main.js`.
Change it there and the whole page changes together.

The top of the page used to feel cinematic while the bottom felt fast and
scattered. Three separate causes, all fixed:

1. **Inconsistent scrub smoothing.** The hero was scrubbed with easing
   (`0.3` / `0.6`); the style worlds, process, what-we-do and founder all
   used `scrub: true`, which is *zero* smoothing — it tracks the wheel
   exactly, so it reads as jittery next to the eased hero. Everything now
   uses `MOTION.scrub`, except the logo→nav handoff which keeps
   `MOTION.scrubTight` because it should feel decisive.

2. **Scroll runways had drifted from their content.** `.style-worlds` was
   a hardcoded `320vh` with a comment reading "tuned for 5" — but there
   are four worlds now, so each got a different amount of scroll than each
   process step did. Runways are now derived from the item count
   (`setRunway`), so every beat of the page costs the reader the same
   scrolling **by construction**: philosophy, style worlds and process all
   measure exactly `MOTION.beatVh` per beat. Removing a style world can
   no longer silently change the pacing. `styles.css` keeps a sensible
   `--runway` fallback for the no-JS case.

3. **The second half had no motion at all.** Pricing, the FAQ, the founder
   and the service panels simply appeared. `reveal()` gives them one
   shared entrance, so the page reads as one website end to end.

### The reveal is deliberately not GSAP

An entrance animation works by hiding content until something decides to
show it — which means the deciding mechanism can strand real copy at
`opacity: 0`. On a site whose whole point is that its content is
readable, that is the worst available bug, and a first attempt using
`ScrollTrigger.batch` did exactly that.

`reveal()` uses IntersectionObserver and a CSS transition instead:
native, no dependency on GSAP's ticker or on Lenis and ScrollTrigger
staying in sync, and it fires immediately for anything already on screen.
It fails open three ways — the `.reveal` class that hides anything is
added by JS (no JS, nothing hidden); it returns early with no
IntersectionObserver or under reduced motion; and `styles.css` un-hides
`.reveal` under `prefers-reduced-motion` regardless.

### Mobile — the phone gets a different layout, not a squeezed one

Phones are this business's main audience, and the page was built
desktop-out. Three sections (philosophy, style worlds, process) were
pinned scroll-scrubbed stages: several viewports tall, contents stuck to
the screen, scroll scrubbing through them in place. On a trackpad that's
cinematic. On a phone it means **swiping stops moving the page** — which
reads as broken — and it cost ~9 of the page's 24 screens on the device
where scrolling is most expensive.

`main.js` sets `HHC.isPhone` (and an `.is-phone` class on `<html>`)
under 768px. Under it:

| | Before | After |
|---|---|---|
| Scrolling | Lenis smooth-scroll | native (it was fighting OS momentum) |
| Philosophy | 1.6 screens, pinned | 1.0, both halves of the statement at once |
| Style worlds | 4.2 screens, scroll-scrubbed | 0.9, **tap a name to switch** |
| Process | 3.1 screens, one step at a time | 1.7, all six as a plain numbered list |
| Hero | 2.2 screens | 1.5 |
| **Whole page** | **24 screens** | **18** |

The process list is the same `<ol>` that is the screen-reader fallback on
desktop — CSS just promotes it out of `.sr-only`. Same markup, same
source, so a crawler never sees the six steps twice.

Desktop is untouched: Lenis on, all three sections still pinned at 70vh
per beat.

**The floating contact widget became a bottom action bar.** Floating over
the content meant it permanently sat on top of real copy — the hero
headline, FAQ answers, whatever was underneath. Suppressing it section by
section was whack-a-mole. A full-width bar with matching `padding-bottom`
on `body` can't cover anything, makes the only two ways to actually book
thumb-reachable at all times, and now spells out "WhatsApp" and "Call"
rather than showing bare icons.

Two bugs found while measuring, worth knowing about:

- `.philosophy__support` was **188px wide on a 375px screen**.
  `position:absolute; left:50%` with no width shrink-wraps to whatever
  space is left to the right of the 50% mark. Fixed with an explicit
  width, which also protects tablets.
- **Scroll was frozen for the first ~2 seconds** while the logo intro
  played, so a visitor who landed and swiped got nothing. Phones now keep
  their scroll, and the first scroll or touch dismisses the intro.

## What's animated, and why it's built this way

- The logo is the opening scene: it plays once, then the same mark and
  wordmark elements animate (via measured position/scale, not a fade-swap)
  into becoming the nav — "the brand becoming the website," not a logo
  screen followed by a separate hero.
- The hero frame starts small and grows to full-bleed as you scroll,
  driven by CSS custom properties (`clip-path`) rather than layout
  properties, so it stays smooth.
- Respects `prefers-reduced-motion`: reduced-motion visitors get the
  finished, settled layout immediately with no scroll-driven animation at
  all, rather than a toned-down version of the same motion.
- No CDNs: GSAP/ScrollTrigger/Lenis and both typefaces are self-hosted in
  this folder (`vendor/`, `assets/fonts/`) — one less thing to break, and
  faster than a round trip to a third party.
- Total page weight is kept small on purpose: own code (`data.js` +
  `main.js` + `styles.css` + `fonts.css`) is ~25KB gzipped, the three vendor
  libraries together are ~52KB gzipped, and the logo crops + fonts add
  roughly 135KB more. The real media added so far — four style-world photos
  and both hero videos (mobile + desktop cuts) — were resized/compressed
  before being placed in `assets/media/` (photos capped at 2000px on the
  long edge; the videos re-encoded to H.264 with the audio track stripped,
  since they autoplay muted anyway — the phone cut at 720p, the desktop cut
  at 1080p) rather than shipped at their original multi-megabyte
  camera/stock-download sizes. Do the same for anything you add later — a
  phone photo straight off a camera roll is usually 3-15MB; it doesn't need
  to be. Images/video use `loading="lazy"` / `preload="metadata"` so
  nothing not on screen yet is fetched early.

## If you ever need to update the vendor libraries

`package.json` / `package-lock.json` record exactly which versions of GSAP,
Lenis and the two fonts were used. To rebuild `vendor/` and
`assets/fonts/` from scratch: `npm install`, then copy the relevant
`dist`/`files` output from `node_modules` into those two folders the same
way they're already named. This is optional — nothing here needs Node or
npm to run.
