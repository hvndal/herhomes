/**
 * HER HOMES CO. — CENTRAL EDITABLE CONFIG
 * ----------------------------------------------------------------
 * Every price, service description, style-world entry, founder detail,
 * FAQ answer, SEO string, and contact link lives here. Edit this file,
 * then run `npm run build` — that regenerates the static HTML inside
 * index.html (plus sitemap.xml and robots.txt) so that search engines
 * see the real copy in the page source, not only after JavaScript runs.
 *
 * PLACEHOLDER marks anything not yet confirmed. Search this file for
 * "PLACEHOLDER" to find every value that still needs a real answer.
 */

const HHC_DATA = {

  /* ------------------------------------------------------------------
   * SITE / SEO — the single source of truth for everything a search
   * engine or a social-share preview reads. `url` is THE ONLY place the
   * domain is written down: scripts/prerender.mjs stamps it into the
   * canonical link, the Open Graph + Twitter tags, every JSON-LD @id,
   * robots.txt and sitemap.xml. Change it here, run `npm run build`,
   * and the whole site follows. No trailing slash.
   * ------------------------------------------------------------------ */
  site: {
    url: "https://herhomes.shop",
    lang: "en-IN",
    locale: "en_IN",

    // Title is keyword-first, brand-last on purpose: nobody is searching
    // "Her Homes Co." yet, they are searching "home organiser in Mohali".
    // Once the brand has recognition, flipping these is a one-line change.
    title: "Interior Styling, Home Organising & Deep Cleaning in Mohali | Her Homes Co.",
    description:
      "Interior design, home organising and deep cleaning in Mohali, Kharar, Kurali, Zirakpur and across Chandigarh Tricity. Her Homes Co. builds your home around the way you actually live. Message for a personalised quote.",

    // The image WhatsApp / Facebook / LinkedIn show when the link is
    // shared. Generated at 1200x630 by `npm run build:images` from the
    // desktop hero still — a real interior, which previews far better
    // than the portrait-shaped logo that used to be used here.
    shareImage: {
      src: "assets/media/og-cover.jpg",
      width: 1200,
      height: 630,
      alt: "A sunlit, softly styled home interior — Her Homes Co.",
    },

    // Service-area business: no street address is published, because none
    // was confirmed. These render as proper schema.org City entities in
    // `areaServed`, which is a far stronger local-search signal than one
    // free-text string. If a real registered address exists, add an
    // `address` block here and prerender.mjs emits PostalAddress from it.
    // Every town confirmed serviceable by the owner. These render as
    // schema.org City entities in `areaServed` AND as real visible text in
    // the footer and the FAQ — both matter. Structured data alone rarely
    // wins a local query; the words also have to be on the page.
    //
    // `alsoKnownAs` exists because people search the same place by more
    // than one name: Mohali is officially SAS Nagar / Sahibzada Ajit Singh
    // Nagar, and Mullanpur is marketed as New Chandigarh. Both spellings
    // end up in the visible text, so both can match.
    //
    // Adding a town is one line here — it flows into the schema, the
    // footer list and the FAQ answer on the next `npm run build`.
    areaServed: [
      { name: "Mohali",     region: "Punjab",     country: "IN", alsoKnownAs: "SAS Nagar" },
      { name: "Kharar",     region: "Punjab",     country: "IN" },
      { name: "Kurali",     region: "Punjab",     country: "IN" },
      { name: "Zirakpur",   region: "Punjab",     country: "IN" },
      { name: "Mullanpur",  region: "Punjab",     country: "IN", alsoKnownAs: "New Chandigarh" },
      { name: "Landran",    region: "Punjab",     country: "IN" },
      { name: "Banur",      region: "Punjab",     country: "IN" },
      { name: "Derabassi",  region: "Punjab",     country: "IN" },
      { name: "Chandigarh", region: "Chandigarh", country: "IN" },
      { name: "Panchkula",  region: "Haryana",    country: "IN" },
    ],

    // PLACEHOLDER — paste the real IDs and they go live on the next build.
    // ga4MeasurementId: "G-XXXXXXXXXX" turns on Google Analytics 4 and
    // every trackEvent() call in main.js starts reporting.
    // searchConsoleVerification: "..." adds the Search Console meta tag.
    // Both stay out of the page entirely while they are null, so nothing
    // ever looks wired up while quietly tracking nothing.
    ga4MeasurementId: null,
    searchConsoleVerification: null,
  },

  brand: {
    name: "Her Homes Co.",
    tagline: "Interiors · Organising · Deep Cleaning",
    // Live-text wordmark color / display font are pulled from CSS tokens
    // (--color-secondary / --font-display) — see styles.css :root.
  },

  /* ------------------------------------------------------------------
   * CONTACT — replace every PLACEHOLDER before launch.
   * ------------------------------------------------------------------ */
  contact: {
    whatsapp: {
      label: "WhatsApp",
      // Digits only, country code first, no + or spaces, e.g. "919876543210"
      number: "919915217674",
      message: "Hi! I'd love to know more about Her Homes Co.",
      href: null, // computed at render time from `number` + `message`
    },
    phone: {
      label: "Call",
      display: "+91 99152 17674",
      href: "tel:+919915217674",
    },
    // Instagram removed for now — no real account exists yet. Add it back
    // here (label/handle/href) the moment there is one; nothing else needs
    // to change, every place that lists contact links reads from this file.
    // Adding it also populates schema.org `sameAs`, which is a genuine
    // local-SEO signal, so it is worth doing as soon as an account exists.
    email: "PLACEHOLDER@herhomes.co",
    // Shown in the footer. Repeating the service area as real text in the
    // page is a genuine local-search signal, so this is no longer null.
    // Short line under the footer; the full town list renders above it.
    location: "Mohali · Kharar · Kurali · Zirakpur · Chandigarh Tricity",
  },

  /* ------------------------------------------------------------------
   * QUICK CONTACT — small persistent WhatsApp + Call widget, visible
   * from the very first screen (including the logo intro) so a visitor
   * in a hurry never has to scroll or browse to reach out. Reuses the
   * links above (`contact.whatsapp`, `contact.phone`) — only the small
   * caption label lives here.
   * ------------------------------------------------------------------ */
  quickContact: {
    label: "Ask her for a quote",
  },

  /* ------------------------------------------------------------------
   * NAVIGATION — kept deliberately short. Logo mark doubles as "home".
   * ------------------------------------------------------------------ */
  nav: [
    { label: "Styles",     href: "#styles" },
    { label: "What We Do", href: "#what-we-do" },
    { label: "Pricing",    href: "#pricing" },
    { label: "FAQ",        href: "#faq" },
    { label: "Founder",    href: "#founder" },
  ],
  navCta: { label: "Book", href: "#book" },

  /* ------------------------------------------------------------------
   * SERVICE CHOOSER — the full-height three-panel picker that sits
   * directly under the hero.
   *
   * Purpose is conversion, not explanation: it is the first thing after
   * "A HOME, BUT YOURS.", and every panel is a real link straight into a
   * WhatsApp message about that one service. Someone who already knows
   * they want a deep clean should never have to scroll the whole page to
   * say so. "What We Do" further down still carries the full detail —
   * this is the short path to asking.
   *
   * NAMING — deliberately the owner's words: "Interior Design" rather
   * than "Home Styling", which is what the detailed section and the
   * schema still call it. "Interior design" is also the term people
   * actually search for. If you want the whole site to say one or the
   * other, change `name` here and in `services.items` / `pricing.services`
   * together, then run `npm run build`.
   *
   * `blurb` for each is taken verbatim from that service's existing
   * description — nothing new is claimed here.
   * ------------------------------------------------------------------ */
  serviceChooser: {
    eyebrow: "Where would you like to start?",
    heading: "PICK A SERVICE.",
    support: "Tap whichever one you need — it opens a WhatsApp message about that service, already written.",
    ctaLabel: "Ask about this",
    items: [
      {
        id: "deep-cleaning",
        index: "01",
        name: "Deep Cleaning",
        blurb: "A full-home reset — kitchen degreasing, bathroom detailing, and the insides of cabinets and appliances.",
        whatsappMessage: "Hi! I'd love a quote for deep cleaning my home.",
      },
      {
        id: "organising",
        index: "02",
        name: "Organising",
        blurb: "Wardrobes, kitchens, drawers, pantries and storage — organised to actually hold.",
        whatsappMessage: "Hi! I'd love a quote for organising my home.",
      },
      {
        id: "interior-design",
        index: "03",
        name: "Interior Design",
        blurb: "Decor direction, colour, furniture placement and full room styling around your aesthetic.",
        whatsappMessage: "Hi! I'd love a quote for interior design and styling for my home.",
      },
    ],
  },

  /* ------------------------------------------------------------------
   * PHILOSOPHY SECTION
   * ------------------------------------------------------------------ */
  philosophy: {
    eyebrow: "The Philosophy",
    lineA: ["YOUR HOME", "DOESN'T NEED", "TO LOOK LIKE", "EVERYONE ELSE'S."],
    lineB: ["IT SHOULD", "FEEL LIKE", "YOU."],
    support: "We start with the person — taste, lifestyle, routines, the objects already loved — and build the space around that. Not the other way round.",
  },

  /* ------------------------------------------------------------------
   * STYLE WORLDS — a curated set. Each gets an image slot generated for
   * it automatically at the bottom of this file, so adding a world is
   * genuinely one line here plus one file dropped into assets/media/
   * named to match the id (e.g. `modern` -> assets/media/modern.jpg).
   *
   * Every world needs a real image; a world with no photo renders an
   * empty frame, which is why "Modern" was temporarily removed earlier.
   * Modern, Indian Heritage and Japandi now have photographs fetched by
   * `npm run fetch:stock`.
   *
   * These are starting points shown to a visitor, not a menu they have to
   * order from — the copy says so, and the FAQ says so again. They are
   * also, bluntly, some of the best SEO surface on the page: "japandi",
   * "indian heritage interiors" and "modern interior design" are all real
   * searches with far less competition locally than "interior designer".
   *
   * A PUNJABI WORLD IS DELIBERATELY MISSING. Pexels has no genuine
   * Punjabi *interior* photography — its results for that are portraits,
   * gurdwaras and village exteriors. Labelling a Rajasthani haveli
   * "Punjabi" in front of a Mohali audience would be worse than not
   * having one, so instead the FAQ answers the question in words. Send
   * one photo of a real Punjabi interior and this becomes one line:
   *   { id: "punjabi", name: "Punjabi Heritage", words: ["Phulkari", "Brass", "Handloom", "Generous"] },
   * ------------------------------------------------------------------ */
  styleWorlds: [
    { id: "scandinavian",    name: "Scandinavian",    words: ["Light", "Natural", "Functional", "Quiet"] },
    { id: "japandi",         name: "Japandi",         words: ["Calm", "Wooden", "Restrained", "Tactile"] },
    { id: "modern",          name: "Modern",          words: ["Clean", "Architectural", "Balanced", "Crisp"] },
    { id: "minimalist",      name: "Minimalist",      words: ["Sparse", "Considered", "Calm", "Essential"] },
    { id: "indian-heritage", name: "Indian Heritage", words: ["Ornate", "Handcrafted", "Jewelled", "Storied"] },
    { id: "bohemian",        name: "Bohemian",        words: ["Layered", "Warm", "Textural", "Collected"] },
    { id: "college-core",    name: "College Core",    words: ["Personal", "Playful", "Nostalgic", "Expressive"] },
  ],

  /* ------------------------------------------------------------------
   * WHAT WE DO — the three core services, told as one narrative.
   * ------------------------------------------------------------------ */
  services: {
    narrative: ["CLEAN", "ORGANISE", "STYLE", "RESET"],
    items: [
      {
        id: "styling",
        index: "01",
        name: "Home Styling",
        summary: "We help shape how the home looks and feels around your preferred aesthetic.",
        includes: ["Decor", "Colour direction", "Furniture placement", "Textures", "Objects", "Visual balance", "Room styling", "Theme development", "Overall cohesion"],
        note: "You don't have to already know exactly what you want — we help translate your preferences into the space.",
      },
      {
        id: "organising",
        index: "02",
        name: "Home Organising",
        summary: "Actual parts of the home, made functional without looking sterile.",
        includes: ["Wardrobes", "Kitchens", "Drawers", "Shelves", "Pantries", "Fridges", "Desks", "Storage", "Utility spaces", "Vastu-aligned placement"],
        note: "Beautiful and practical — good organising shouldn't feel like organising. It should just work. If Vastu or Feng Shui matters in your home, say so at the start and the plan is built around it.",
      },
      {
        id: "deep-cleaning",
        index: "03",
        name: "Deep Cleaning",
        summary: "The reset the rest of the transformation stands on.",
        includes: ["Full-home deep clean", "Kitchen degreasing", "Bathroom detailing", "Inside cabinets & appliances", "Windows & fixtures"],
        note: "Clean enough to breathe — then organisation and styling give the space its new identity.",
      },
    ],
  },

  /* ------------------------------------------------------------------
   * PROCESS — 6 stages, told as a story.
   * ------------------------------------------------------------------ */
  process: [
    { index: "01", title: "Tell Us What You Like",      detail: "Your taste, your references, the things you already own and love." },
    { index: "02", title: "We Understand Your Home",    detail: "How you move through it, what it needs to work harder at, what already feels right." },
    { index: "03", title: "We Build The Look",          detail: "A visual direction around your aesthetic — not a template pulled off a shelf." },
    { index: "04", title: "We Organise The Details",    detail: "Wardrobes, kitchens, drawers, shelving — function first, so the styling holds." },
    { index: "05", title: "We Reset The Space",         detail: "A full deep clean, so everything that follows lands on a space that can breathe." },
    { index: "06", title: "You Walk Into It",           detail: "A home that already feels like you, from the first day." },
  ],

  /* ------------------------------------------------------------------
   * PRICING — one editable structure. Any service whose startingPrice is
   * `null` renders as a tasteful "personalised quote" treatment rather
   * than a fabricated number. Only the shelf/organising add-on price is
   * confirmed.
   * ------------------------------------------------------------------ */
  pricing: {
    eyebrow: "Investment",
    heading: "A PREMIUM SERVICE MENU, NOT A CALCULATOR.",
    intro: "Every home is a different scope — size, number of areas, how much organising versus styling, how deep the clean needs to go. Here's what shapes the number.",
    currency: "₹",
    // Picking a home size below doesn't compute a price (nothing here is
    // fabricated) — it carries that choice straight into the WhatsApp
    // message, so the size picker ends in an actual quote request rather
    // than a dead end. {size} is replaced with whichever size was clicked.
    quoteMessageTemplate: "Hi! I'd love a personalised quote for my {size} home.",
    variables: {
      homeSize: ["1 BHK", "2 BHK", "3 BHK", "4 BHK+"],
      factors: [
        "Amount of organising required",
        "Number of areas / rooms",
        "Design complexity",
        "Cleaning requirement",
        "Special requests",
      ],
    },
    services: [
      {
        id: "styling",
        name: "Home Styling",
        description: "Decor direction, furniture placement, and full room styling around your aesthetic.",
        startingPrice: null, // PLACEHOLDER — confirm real starting price
      },
      {
        id: "organising",
        name: "Home Organising",
        description: "Wardrobes, kitchens, drawers, pantries, and storage — organised to actually hold.",
        startingPrice: null, // PLACEHOLDER — confirm real starting price
      },
      {
        id: "deep-cleaning",
        name: "Deep Cleaning",
        description: "A full reset — the foundation the rest of the transformation is built on.",
        startingPrice: null, // PLACEHOLDER — confirm real starting price
      },
      {
        id: "combined-reset",
        name: "Combined Home Reset",
        description: "Clean, organise, and style in one continuous engagement.",
        startingPrice: null, // PLACEHOLDER — confirm real starting price
      },
    ],
    addOns: [
      {
        id: "shelf-organising",
        name: "Shelf / Detailed Organisation Add-on",
        description: "Deeper organisation work for areas like shelving and the fridge, scoped to the agreed plan.",
        price: 5000,
        priceUnit: "one-time",
        confirmed: true,
      },
    ],
  },

  /* ------------------------------------------------------------------
   * FAQ — the single biggest SEO addition to this site.
   *
   * A one-page site is thin by nature: there simply isn't much text for
   * a search engine to match a query against. These answers add real,
   * indexable copy for the long-tail questions people actually type
   * ("home organiser in Mohali", "what does deep cleaning include",
   * "how much does home styling cost"), and they are also emitted as
   * schema.org FAQPage structured data by scripts/prerender.mjs.
   *
   * IMPORTANT — every answer below was composed strictly from facts
   * already stated elsewhere on this site: the services and their
   * `includes` lists, the process steps, the one confirmed add-on price,
   * the service area, and WhatsApp-as-booking. Nothing about turnaround
   * time, team size, guarantees, insurance or payment terms is claimed,
   * because none of that was ever confirmed. Read these once and correct
   * anything that doesn't match how the business actually works before
   * launch — and if you add a claim, make it one you can stand behind.
   * ------------------------------------------------------------------ */
  faq: [
    {
      q: "What does Her Homes Co. actually do?",
      a: "Three things, and usually together: home styling (decor direction, colour, furniture placement and room styling), home organising (wardrobes, kitchens, drawers, shelves, pantries, fridges, desks, storage and utility spaces), and deep cleaning (a full-home reset including kitchen degreasing, bathroom detailing, and the insides of cabinets and appliances). You can book any one of them on its own, or all three together as a Combined Home Reset.",
    },
    {
      q: "Which areas do you serve?",
      a: "Her Homes Co. covers Mohali (SAS Nagar) and the surrounding towns: Kharar, Kurali, Zirakpur, Mullanpur (New Chandigarh), Landran, Banur and Derabassi — plus Chandigarh and Panchkula across the wider Tricity. If you are just outside that, message on WhatsApp and ask; it is a quick answer.",
    },
    {
      q: "How much does it cost?",
      a: "Every home is a different scope, so styling, organising, deep cleaning and the Combined Home Reset are each quoted individually rather than sold at a fixed rate. What shapes the number: how much organising is required, the number of areas or rooms, design complexity, the cleaning requirement, and any special requests. The one fixed price is the Shelf / Detailed Organisation add-on at ₹5,000 one-time. Send your home size on WhatsApp and a personalised quote comes back.",
    },
    {
      q: "Do I need to already know what style I want?",
      a: "No, and most people don't — that is the normal starting point. The first step of the process is simply telling us what you like: your references, and the things you already own and love. We translate those preferences into a visual direction for the space. Scandinavian, Bohemian, College Core and Minimalist are shown on this page as starting points, not as a menu you have to pick from.",
    },
    {
      q: "Can you organise just one room, like a wardrobe or a kitchen?",
      a: "Yes. Home Organising covers wardrobes, kitchens, drawers, shelves, pantries, fridges, desks, storage and utility spaces, and the work is scoped to whatever plan is agreed with you — it does not have to be the whole house.",
    },
    {
      q: "Is deep cleaning included when you style or organise a home?",
      a: "It is a separate service, and it is also available bundled: the Combined Home Reset is a clean, an organise and a style run as one continuous engagement. Deep cleaning is deliberately the foundation — organising and styling both land better on a space that has already been properly reset.",
    },
    {
      q: "What does the process look like from start to finish?",
      a: "Six stages. You tell us what you like; we spend time understanding how you actually move through your home; we build the look around your aesthetic; we organise the details so the styling holds; we reset the space with a full deep clean; and then you walk into it.",
    },
    {
      q: "Can you organise our home according to Vastu?",
      a: "Yes. If Vastu matters in your home, say so at the start and it shapes the plan — which direction storage faces, where things live in the kitchen and the wardrobe, what stays out of particular corners. The same applies if you follow Feng Shui instead. To be straight about it: we work to the principles you tell us matter to you. We are not Vastu consultants, we don't audit a home against a chart, and nothing gets moved on that basis unless you ask for it.",
    },
    {
      q: "Do you work with traditional Indian or Punjabi interiors?",
      a: "Very much so. The style worlds on this page — Scandinavian, Japandi, Modern, Minimalist, Indian Heritage, Bohemian and College Core — are starting points, not a menu you have to order from. If what you want is carved wood, brass, jewel colours, phulkari and handloom rather than pale Scandinavian minimalism, that is a direction we build in. A home in Mohali, Kharar or Kurali does not have to look like a catalogue from somewhere else.",
    },
    {
      q: "How do I book?",
      a: "There is no form to fill in. Message on WhatsApp at +91 99152 17674 with a bit about your home — its size, which areas you want covered, and roughly what you are after — and you get a reply directly. Calling the same number works just as well.",
    },
  ],
  faqMeta: {
    eyebrow: "Questions",
    heading: "THINGS PEOPLE ASK BEFORE THEY BOOK.",
    support: "If the answer you need isn't here, WhatsApp is the fastest way to get it.",
  },

  /* ------------------------------------------------------------------
   * FOUNDER — replace name / photo / bio once provided.
   * The portrait frame renders only when mediaSlots["founder-portrait"]
   * has a real `src`; until then the section lays out as a single
   * centred column rather than showing visitors an empty grey frame.
   * ------------------------------------------------------------------ */
  founder: {
    eyebrow: "The Founder",
    heading: "SOMEONE SHOULD ACTUALLY CARE HOW YOUR HOME TURNS OUT.",
    name: "Rupinder Kaur",
    role: "Founder, Her Homes Co.",
    bio: "Rupinder Kaur is entirely self-made. Her journey started in a small village and led, one step at a time, to building her own company — on the strength of a natural knack for organising and interior design, long before it was ever a business plan. That same instinct is still behind every home Her Homes Co. takes on today.",
    photoSlot: "founder-portrait",
  },

  /* ------------------------------------------------------------------
   * FINAL CTA + BOOKING
   * ------------------------------------------------------------------ */
  finalCta: {
    lineA: ["LET'S MAKE", "YOUR HOME", "FEEL LIKE YOU."],
    support: "No long forms — this is a Tricity / Mohali operation. Message her on WhatsApp and tell her a bit about your home; she'll take it from there.",
    whatsappButtonLabel: "Message her on WhatsApp",
  },

  /* ------------------------------------------------------------------
   * MEDIA SLOTS — every image/video area in the page renders from this
   * list via [data-media-slot]. Swap real media by dropping a file into
   * assets/media/ and setting `src` here — no HTML edits.
   * type: "video" | "image". src: null means the slot renders nothing
   * at all (rather than an empty frame a visitor would see).
   *
   * `width`/`height` are the file's real pixel dimensions. They are
   * written onto the <img> so the browser can reserve the right box
   * before the image loads — that is what keeps Cumulative Layout Shift
   * at zero. `npm run build:images` prints the numbers for any new file.
   * ------------------------------------------------------------------ */
  mediaSlots: {
    "hero-film":            { type: "video", src: null, mobileSrc: null, desktopSrc: null, mobilePoster: null, desktopPoster: null, note: "Cinematic interior film — sunlight, hands, fabric, wood." },
    "founder-portrait":     { type: "image", src: null, note: "Founder portrait — warm, personal, not corporate headshot.", alt: "Rupinder Kaur, founder of Her Homes Co., in a softly styled home interior." },
    "process-visual":       { type: "image", src: null, note: "Pinned visual for the process section, can be one film loop.", alt: "A home mid-transformation during Her Homes Co.'s styling and organising process." },
    "styling-detail":       { type: "image", src: null, note: "Home Styling supporting image.", alt: "Home styling by Her Homes Co. — decor, colour direction and furniture placement." },
    "organising-detail":    { type: "image", src: null, note: "Home Organising supporting image (drawers/shelves/wardrobe).", alt: "Organised wardrobe and shelving by Her Homes Co." },
    "deep-cleaning-detail": { type: "image", src: null, note: "Deep Cleaning supporting image.", alt: "A freshly deep-cleaned home interior by Her Homes Co." },
  },
};

/* --------------------------------------------------------------------
 * DERIVED VALUES — everything below is computed, not configured.
 * There is nothing here you need to edit by hand.
 * -------------------------------------------------------------------- */

// One image slot per style world, generated from `styleWorlds` above, so
// that adding or removing a world takes exactly one edit and not two.
// Real intrinsic dimensions live in STYLE_IMAGE_DIMENSIONS below.
const STYLE_IMAGE_DIMENSIONS = {
  "scandinavian":    { width: 1461, height: 2000 },
  "bohemian":        { width: 1429, height: 2000 },
  "college-core":    { width: 1500, height: 2000 },
  "minimalist":      { width: 1333, height: 2000 },
  // Fetched by npm run fetch:stock, which crops them all to 1400x2000.
  "japandi":         { width: 1400, height: 2000 },
  "modern":          { width: 1400, height: 2000 },
  "indian-heritage": { width: 1400, height: 2000 },
};

HHC_DATA.styleWorlds.forEach((w) => {
  HHC_DATA.mediaSlots["style-" + w.id] = Object.assign(
    {
      type: "image",
      src: "assets/media/" + w.id + ".jpg",
      note: w.name + " style-world image.",
      alt: w.name + "-style home interior styled by Her Homes Co. — " + w.words.join(", ").toLowerCase() + ".",
    },
    STYLE_IMAGE_DIMENSIONS[w.id] || {}
  );
});

// Service-chooser panels: one image slot and one pre-written WhatsApp link
// each, both generated from the `id` so adding a fourth service is one entry
// in `serviceChooser.items` plus one image file.
//
// Backgrounds are stock photography from Pexels, fetched and cropped to the
// panel shape by `npm run fetch:stock` (see scripts/fetch-stock.mjs for the
// photo IDs, credits and licence, and assets/media/CREDITS.txt alongside the
// files). The Pexels Licence permits commercial use and modification and
// needs no attribution; the sources are recorded anyway so every image on
// this site is traceable.
//
// These are stock photographs of homes and cleaning in general — NOT photos
// of Her Homes Co.'s own work, and nothing on the page says otherwise. Drop
// a real photo of an actual job at the same path and it takes over with no
// other change (`npm run build:images` will not overwrite it).
HHC_DATA.serviceChooser.items.forEach((item) => {
  HHC_DATA.mediaSlots["service-" + item.id] = {
    type: "image",
    src: "assets/media/service-" + item.id + ".jpg",
    width: 900,
    height: 1600,
    note: item.name + " chooser panel artwork.",
    // Decorative: the panel's own heading and blurb already say everything
    // this image conveys, so announcing it again is noise for a screen
    // reader. Empty alt is the correct answer here, not a missing one.
    alt: "",
  };
  item.whatsappHref =
    "https://wa.me/" + HHC_DATA.contact.whatsapp.number +
    "?text=" + encodeURIComponent(item.whatsappMessage);
});

// Compute the WhatsApp href from the digits-only number + a friendly opener.
HHC_DATA.contact.whatsapp.href =
  "https://wa.me/" + HHC_DATA.contact.whatsapp.number +
  "?text=" + encodeURIComponent(HHC_DATA.contact.whatsapp.message);

// Real hero media. Responsive: a portrait cut for phones, a wide cut for
// desktop — main.js picks one at the same 768px breakpoint CSS uses.
HHC_DATA.mediaSlots["hero-film"].mobileSrc = "assets/media/hero-mobile.mp4";
HHC_DATA.mediaSlots["hero-film"].desktopSrc = "assets/media/hero-pc.mp4";
// Poster frames (real stills pulled from the two clips above) — shown the
// instant the page paints, before the video itself has loaded, so the hero
// is never a blank frame. Also set directly in CSS (see styles.css:
// .hero__frame) so the poster paints even before JS hydrates.
// WebP, deliberately: styles.css already paints this exact still as the
// frame's background (and index.html preloads it), so pointing the <video>
// poster at the .jpg made every visit download the same picture twice —
// once as WebP for the background, once as JPEG for the poster. Same URL
// here means the second one is a cache hit. A browser too old for WebP
// fails this poster and simply keeps showing the CSS background, which
// falls back to the .jpg for exactly those browsers.
HHC_DATA.mediaSlots["hero-film"].mobilePoster = "assets/media/hero-poster-mobile.webp";
HHC_DATA.mediaSlots["hero-film"].desktopPoster = "assets/media/hero-poster-desktop.webp";

// Node (scripts/prerender.mjs) reads this file by requiring it; the
// browser just gets the global. The guard below makes both work.
if (typeof module !== "undefined" && module.exports) module.exports = HHC_DATA;
