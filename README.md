# Her Homes Co. — Website

A full rebuild of the Her Homes Co. site around the existing, approved brand
(the illustrated logo mark, "Her Homes Co." wordmark, warm cream / charcoal /
steel blue / yellow palette, Anton + Hanken Grotesk). No build step — static
HTML, CSS and vanilla JS, animated with GSAP, ScrollTrigger and Lenis.

The original Stitch export (`stitch_the_her_homes_lookbook/`) is left
untouched next to this folder — it was the design/brand reference this
rebuild was built from, not something this project modifies.

## Opening it up

There's no build step and nothing to install to just look at it. Two ways:

1. **Double-click `index.html`.** Everything is self-hosted (fonts, GSAP,
   ScrollTrigger, Lenis all live in this folder), so it mostly works straight
   off disk. A couple of browsers are stricter about loading local video/font
   files via a `file://` URL, which is the one reason to prefer option 2.
2. **Serve it locally** (more reliable, closer to production):
   ```
   cd her-homes-co-website
   python3 -m http.server 8000
   ```
   then open `http://localhost:8000`. Any static server works — this is a
   plain folder of files.

## File structure

```
index.html          Page markup — all sections, no content baked in
styles.css           All design tokens + section styles
fonts.css             Self-hosted @font-face rules (Anton, Hanken Grotesk)
js/data.js            *** THE ONLY FILE YOU SHOULD NEED TO EDIT ***
js/main.js            All animation/interaction logic
assets/               Logo crops + font files
assets/media/         Real photos/video dropped in so far (see below)
vendor/               Self-hosted GSAP, ScrollTrigger, Lenis (no CDN)
package.json          Records exact library versions, for reference
robots.txt             Crawler rules — see "SEO" below
sitemap.xml            One-page sitemap — see "SEO" below
```

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

Two of the extra video files found in the folder were deliberately **not**
used anywhere on the site: `stockvid.mp4` (an overhead flat-lay of flowers /
pastries / journal-writing — no interior or home content, off-brand for a
home-styling business) and the UHD clip of a man reading a newspaper in a
traditional floral-wallpapered kitchen (clashes with the curated modern /
Scandinavian / Bohemian / minimalist look the rest of the site is built
around). If either was meant for a specific spot, say so and it's a quick
add.

Still placeholders — need a real file:

| Key | Type | What it is |
|---|---|---|
| `style-modern` | image | Modern style-world image — no "modern" photo was among the ones provided this round |
| `founder-portrait` | image | Founder photo |
| `process-visual` | image | Pinned visual for the process section |
| `styling-detail` / `organising-detail` / `deep-cleaning-detail` | image | "What We Do" supporting images |

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

## SEO — what's implemented, and where the rest lives

Technical SEO for a real, in-depth build — not just a meta-description tag.
Everything below is genuinely live and needs to be revisited only when the
site gets a real domain (search this whole project for `herhomesco.example`
— an intentionally-unusable RFC 2606 placeholder domain — and swap in the
real one, once there is one, in `index.html`, `robots.txt`, and
`sitemap.xml`).

**Metadata** (`index.html` `<head>`) — canonical link, `robots` meta
(`index, follow`), full Open Graph + Twitter Card tags (so a WhatsApp /
Facebook / LinkedIn share shows the real title, description, and the logo
as the preview image), `lang="en-IN"`, `apple-touch-icon`, and
`<link rel="preload">` for both above-the-fold font files.

**Structured data** — a static (not JS-injected, so every crawler sees it,
including ones that don't run JavaScript) JSON-LD `@graph` covering
`HomeAndConstructionBusiness` (name, phone, service area, founder, and a
`makesOffer` list mirroring the real service menu, with a real price only
on the one add-on that actually has a confirmed one), `WebSite`, and
`WebPage`. Deliberately absent: a street address, opening hours,
review/rating data, and `sameAs` social links — none of those are real
yet, and inventing them would be worse than leaving them out. Add each the
moment it's real; there's a comment right above the block as a reminder.

**Crawling** — `robots.txt` (allows everything, points at the sitemap) and
`sitemap.xml` (one `<url>`, since this is one page with in-page anchors,
not separate URLs — see the comments in both files for what changes once
the site has more than one page).

**Alt text** — every `mediaSlots` entry in `data.js` now carries a real,
descriptive `alt` string (separate from the internal `note`, which is a
to-do reminder for whoever's filling in the photo, not visitor-facing
copy). `hydrateMediaSlots()` in `main.js` uses it automatically.

**Headings** — Philosophy, Style Worlds, What We Do, and Process didn't
have a section-level heading tag before (screen readers and crawlers had
no label for them beyond individual item titles, e.g. one style-world
name). Each now has a visually hidden (`.sr-only`) `<h2>`, populated at
render time from the exact same copy already in `data.js` — nothing new
was written, so there's no risk of it drifting out of sync with what's
visible on screen. Nothing about how the page looks changed.

**Hero performance (Core Web Vitals)** — the hero video used to be a blank
placeholder until JS created the `<video>` element and the file itself
started downloading. It now has a real poster still, extracted straight
from the two hero clips (`assets/media/hero-poster-{mobile,desktop}.jpg`),
set directly in `styles.css` as `.hero__frame`'s background image (swapped
at the same 768px breakpoint `main.js` already uses for `mobileSrc` /
`desktopSrc`) — so there's real, correct visual content the instant the
page paints, with zero dependency on JavaScript having run yet. The same
still is also wired as each `<video>`'s `poster` attribute for the same
reason once JS does hydrate. `.hero__sizer` was already a fixed `100vh`,
so there was no layout-shift (CLS) risk here to begin with.

**Analytics** — a small `trackEvent(name, params)` helper in `main.js` is
already wired to every real conversion point: WhatsApp clicks and phone
clicks from the quick-contact widget, the final CTA, and the mobile menu;
quote-request clicks and home-size selections in the pricing section. It's
intentionally dormant right now — no fake Measurement ID is hardcoded
anywhere, since a fake one would look wired up while quietly tracking
nothing. The moment a real Google Tag Manager container or GA4 `gtag.js`
snippet is added to `index.html`'s `<head>`, every one of these events
starts flowing with no other change needed (it pushes to `window.dataLayer`
if GTM is present, else calls `window.gtag` directly if that's present,
else does nothing at all — see the comment above `trackEvent()`).

A full technical-SEO strategy document — indexing/crawling rules, URL
architecture for whenever this grows past one page, a severity-ranked
audit, and a 7/30/60/90-day monitoring plan once there's a live domain and
Search Console/GA4 access — was delivered separately alongside this build.

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
