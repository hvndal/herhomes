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

    title: "Her Homes | Interior Design, Organising & Deep Cleaning in Mohali",
    description:
      "Interior design, home organising & deep cleaning in Mohali (SAS Nagar), Punjab by Her Homes Co. New-home move-in setup & full resets. WhatsApp: +91-9915217674.",

    shareImage: {
      src: "assets/media/og-cover.jpg",
      width: 1200,
      height: 630,
      alt: "A sunlit, softly styled home interior — Her Homes Co., Mohali (SAS Nagar)",
    },

    address: { streetAddress: "", addressLocality: "Mohali", addressRegion: "Punjab", addressCountry: "IN", note: "Serving Mohali (SAS Nagar), Punjab" },

    areaServed: [
      { name: "Mohali", region: "Punjab", country: "IN", alsoKnownAs: "SAS Nagar" },
    ],

    ga4MeasurementId: null,
    clarityProjectId: "zk5tjpllv5",
    searchConsoleVerification: null,
  },

  brand: {
    name: "Her Homes Co.",
    tagline: "Interiors · Organising · Deep Cleaning",
  },

  /* ------------------------------------------------------------------
   * CONTACT — replace every PLACEHOLDER before launch.
   * ------------------------------------------------------------------ */
  contact: {
    whatsapp: {
      label: "WhatsApp",
      number: "919915217674",
      message: "Hey, I need home designing or organising etc.",
      // Prefer api.whatsapp.com — wa.me is flaky on some mobile browsers
      // and in-app webviews. Computed below from number + message.
      href: null,
    },
    phone: {
      label: "Call",
      display: "+91-9915217674",
      href: "tel:+919915217674",
    },
    email: "hello@herhomes.shop",
    location: "Serving Mohali (SAS Nagar), Punjab",
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
    { label: "Our Work",   href: "#work" },
    { label: "Pricing",    href: "#pricing" },
    { label: "FAQ",        href: "#faq" },
    { label: "Founder",    href: "#founder" },
    { label: "Contact",    href: "/contact" },
  ],
  navCta: { label: "Get a quote", href: "#book" },

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
    support: "Tap a tile for full detail, by-area options, and a WhatsApp quote form — all inside the panel.",
    ctaLabel: "Get a quote",
    ctaOpenLabel: "Close",
    items: [
      {
        id: "deep-cleaning",
        index: "01",
        name: "Deep Cleaning",
        blurb: "A full-home reset — kitchen degreasing, bathroom detailing, and the insides of cabinets and appliances.",
        pageHref: "/deep-cleaning",
        quoteLabel: "Deep Cleaning",
        whatsappMessage: "Hey, I need some deep cleaning done.",
        // Crawlable in-tile copy for search + AI retrieval (always in HTML).
        detail:
          "Her Homes Co. provides full-home deep cleaning in Mohali (officially SAS Nagar), Punjab — 1 BHK, 2 BHK, 3 BHK, 4 BHK & villa resets, furnished or vacant flat cleaning, move-in / move-out cleaning, Airbnb & short-stay turnover cleaning, or book-by-room: bathroom hard-water descaling, kitchen degreasing (tiles, stove, chimney & cabinet surfaces), fridge + microwave combo cleaning, window glass & sliding tracks, balcony cleaning, and 5-seater / L-shaped sofa shampooing.",
        serviceType: "Deep cleaning service",
        keywords: [
          "full home deep cleaning Mohali",
          "house deep cleaning SAS Nagar",
          "vacant flat & move-in deep cleaning Mohali",
          "kitchen, fridge & microwave cleaning combo Mohali",
          "bathroom hard-water & window track cleaning Mohali",
          "sofa shampooing & Airbnb turnover cleaning Mohali",
        ],
        includes: [
          "Full-home deep clean (1–4 BHK / villa)",
          "Kitchen degreasing — tiles, stove, chimney & cabinet interiors",
          "Fridge + microwave deep clean combo (trays, gaskets & cavity)",
          "Bathroom detailing and hard-water stain descaling",
          "Living areas, bedrooms, ceiling fans & switchboards",
          "Balcony, window glass, mesh & sliding track cleaning",
          "5-seater / L-shaped sofa shampooing & dry clean options",
          "Move-in / move-out, vacant flat & Airbnb turnover resets",
        ],
        fromPrice: 5399,
        subServicesKey: "deep-cleaning",
      },
      {
        id: "organising",
        index: "02",
        name: "Organising",
        blurb: "Wardrobes, kitchens, drawers, pantries and storage — organised to actually hold.",
        pageHref: "/organising",
        quoteLabel: "Organising",
        whatsappMessage: "Hey, I need some home organising done.",
        detail:
          "Professional home organising in Mohali (officially SAS Nagar), Punjab for wardrobes (including saree & seasonal rotation), kitchens (masala drawers, spice jars & pantry), fridge zoning, study / work-from-home (WFH) desk setups, drawers, shelves and utility spaces — plus Day-1 move-in unpacking and Feng Shui-aligned placement on request.",
        serviceType: "Home organising service",
        keywords: [
          "home organiser Mohali",
          "professional organizer SAS Nagar",
          "study & work from home WFH desk setup Mohali",
          "wardrobe & saree decluttering Mohali",
          "kitchen pantry, masala drawer & fridge organising",
          "Day-1 move-in unpacking setup Mohali",
        ],
        includes: [
          "Wardrobes, closets & saree / seasonal rotation",
          "Kitchen cabinets, masala drawers & pantry",
          "Study & work-from-home (WFH) desk setup",
          "Fridge zoning & detailed shelf work (add-on)",
          "Day-1 move-in unpacking & home setup",
          "Feng Shui-aligned placement on request",
        ],
        fromPrice: 5999,
        subServicesKey: "organising",
      },
      {
        id: "interior-design",
        index: "03",
        name: "Interior Design",
        blurb: "Home interior design, decor direction, and room styling in Mohali (SAS Nagar), Punjab.",
        pageHref: "/interior-design",
        quoteLabel: "Interior Design",
        whatsappMessage: "Hey, I need home designing.",
        detail:
          "Interior designers and home stylists in Mohali (officially SAS Nagar), Punjab — decor direction, colour, furniture placement, rental apartment makeovers (no carpentry needed), balcony makeovers, study / WFH corner styling, and pre-festival home resets built around how you actually live.",
        serviceType: "Interior design service",
        keywords: [
          "interior designer Mohali",
          "interior stylist SAS Nagar",
          "rental flat & apartment makeover Mohali",
          "study desk & WFH corner styling Mohali",
          "balcony makeover & single room styling Mohali",
          "decor consultation Mohali Punjab",
        ],
        includes: [
          "Decor, curtains, lighting & colour direction",
          "Furniture placement and visual balance",
          "Rental apartment & balcony makeovers (no civil work)",
          "Study / WFH corner & single-room styling",
          "Pre-festival & guest-ready home resets",
        ],
        fromPrice: 14999,
        subServicesKey: "interior-design",
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
   * "Indian Heritage interiors" and "modern interior design" are all real
   * searches with far less competition locally than "interior designer".
   *
   * THE Pacific Northwest WORLD USES A TEXTILE, NOT A ROOM — read this before
   * swapping it. Pexels has no genuine Pacific Northwest *interior* photography:
   * searching returns portraits, cabins and village exteriors, and the
   * one promising "Indian courtyard" turned out to be a South Indian
   * heritage-house museum with mannequins in it. Its image is therefore a
   * close-up of dense floss-silk geometric embroidery in marigold, rust
   * and indigo — visually very close to plaid, honest as a swatch, and
   * described in its alt text as embroidery rather than claimed to be
   * plaid or to be a Pacific Northwest home.
   *
   * It is the one world illustrated by a material rather than a room.
   * ONE photograph of a real Pacific Northwest interior — even a phone photo of a
   * real job — replaces it properly: drop it at assets/media/pacific-northwest.jpg
   * and remove the entry from scripts/fetch-stock.mjs so it is not
   * overwritten.
   * ------------------------------------------------------------------ */
  styleWorlds: [
    { id: "scandinavian",    name: "Scandinavian",    words: ["Light", "Natural", "Functional", "Quiet"] },
    { id: "japanese",        name: "Japanese",        words: ["Serene", "Wooden", "Unhurried", "Tactile"] },
    { id: "modern",          name: "Modern",          words: ["Clean", "Architectural", "Balanced", "Crisp"] },
    { id: "minimalist",      name: "Minimalist",      words: ["Sparse", "Considered", "Calm", "Essential"] },
    { id: "indian-heritage", name: "Indian Heritage", words: ["Ornate", "Handcrafted", "Jewelled", "Storied"] },
    { id: "punjabi", name: "Punjabi", words: ["Phulkari", "Brass", "Handloom", "Generous"] },
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
        includes: ["Wardrobes", "Kitchens", "Drawers", "Shelves", "Pantries", "Fridges", "Desks", "Storage", "Utility spaces", "Feng Shui-aligned placement"],
        note: "Beautiful and practical — good organising shouldn't feel like organising. It should just work. If Feng Shui or Feng Shui matters in your home, say so at the start and the plan is built around it.",
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
   * PRICING — premium "from" prices for Mohali. Final quote always
   * depends on rooms, furnished vs vacant, and how thorough the job is.
   * ------------------------------------------------------------------ */
  pricing: {
    eyebrow: "Investment",
    heading: "A PREMIUM SERVICE MENU, NOT A CALCULATOR.",
    intro: "Starting prices for a premium finish — quoted to your home. Size, rooms, and how much organising versus styling still shape the final number.",
    currency: "INR",
    currencySymbol: "₹",
    benchmarkNote: "Final quotes depend on size, furnished vs vacant, and how thorough you want it.",
    // Size picker feeds WhatsApp + shows the matching deep-clean from-price.
    quoteMessageTemplate: "Hey, I need home designing or organising for my {size} home.",
    variables: {
      homeSize: ["1 BHK", "2 BHK", "3 BHK", "4 BHK / Villa"],
      factors: [
        "Amount of organising required",
        "Number of areas / rooms",
        "Design complexity",
        "Cleaning requirement",
        "Special requests",
      ],
    },
    sizeRates: {
      "1 BHK": { deepCleaning: 5399 },
      "2 BHK": { deepCleaning: 6099 },
      "3 BHK": { deepCleaning: 7099 },
      "4 BHK / Villa": { deepCleaning: 9499 },
    },
    services: [
      {
        id: "deep-cleaning",
        name: "Deep Cleaning",
        description: "A full reset — the foundation the rest of the transformation is built on. Book the whole home or just one area.",
        startingPrice: 5399,
      },
      {
        id: "organising",
        name: "Home Organising",
        description: "Wardrobes, kitchens, drawers, pantries, and storage — organised to actually hold.",
        startingPrice: 5999,
      },
      {
        id: "styling",
        name: "Home Styling / Interior Design",
        description: "Decor direction, furniture placement, and full home interior design in Mohali.",
        startingPrice: 14999,
      },
      {
        id: "combined-reset",
        name: "Combined Home Reset",
        description: "New-home move-in setup (unpack, clean, organise, and style) in one continuous engagement.",
        startingPrice: 17999,
      },
    ],
    addOns: [
      {
        id: "shelf-organising",
        name: "Shelf / Detailed Organisation Add-on",
        description: "Deeper organisation work for areas like shelving and the fridge, scoped to the agreed plan.",
        price: 2999,
        priceUnit: "one-time",
        confirmed: true,
      },
    ],
  },

  /* ------------------------------------------------------------------
   * SERVICE PAGES — dedicated /deep-cleaning, /organising, /interior-design
   * ------------------------------------------------------------------ */
  servicePages: {
    "deep-cleaning": {
      slug: "deep-cleaning",
      title: "Deep Cleaning Services in Mohali | Her Homes",
      metaDesc: "Full-home deep cleaning in Mohali (SAS Nagar) — 1–4 BHK, vacant flats & Airbnb turnover from ₹5,399, or bathroom, kitchen & sofa. WhatsApp +91-9915217674.",
      heroH1: "DEEP CLEANING<br />IN MOHALI.",
      heroSupport: "Book the full home (furnished or vacant), move-in or Airbnb turnover — or just one area: kitchen, baths, balcony, sofa. Quoted on WhatsApp.",
      eyebrow: "Deep Cleaning",
      heading: "A PROPER RESET, NOT A SURFACE WIPE.",
      intro: "We deep-clean the rooms that actually need it — grease, hard-water marks, insides of cabinets — so organising and styling have somewhere clean to land. Need only one space? Book by area below.",
      includes: [
        "Kitchen degreasing (tiles, stove, chimney & cabinet interiors)",
        "Bathroom detailing & hard-water stain descaling",
        "Living areas, bedrooms, floors",
        "Fans, switchboards, reachable fixtures",
        "Balcony, windows & hard-to-reach dusting where accessible",
        "Move-in / move-out, vacant flat & Airbnb turnover resets",
      ],
      pricingBlurb: "Full-home from-prices by size. Prefer a single room? See by-area options below — final quote depends on furnished vs vacant and how thorough you want it.",
      quoteService: "Deep Cleaning",
      // Book-by-area options shown on /deep-cleaning (and as quote chips).
      subServices: [
        {
          id: "full-home",
          name: "Full-home deep clean",
          startingPrice: 5399,
          blurb: "Kitchen, baths, living areas, bedrooms — the complete reset.",
          quoteLabel: "Deep Cleaning",
        },
        {
          id: "bathroom",
          name: "Bathroom only",
          startingPrice: 699,
          blurb: "Floor, WC, sink, fittings, walls & hard-water marks — per bathroom.",
          quoteLabel: "Bathroom Deep Clean",
        },
        {
          id: "kitchen",
          name: "Kitchen only",
          startingPrice: 1499,
          blurb: "Grease, tiles, stove, cabinet exteriors and reachable surfaces.",
          quoteLabel: "Kitchen Deep Clean",
        },
        {
          id: "balcony",
          name: "Balcony & windows",
          startingPrice: 699,
          blurb: "Floor, grill work, window glass, mesh and sliding track cleaning.",
          quoteLabel: "Balcony Deep Clean",
        },
        {
          id: "sofa",
          name: "Sofa / upholstery",
          startingPrice: 799,
          blurb: "5-seater or L-shaped fabric sofa shampoo or dry clean — quoted on WhatsApp.",
          quoteLabel: "Sofa Cleaning",
        },
        {
          id: "fridge-microwave",
          name: "Fridge + microwave combo",
          startingPrice: null,
          blurb: "Fridge interior trays, gaskets and exterior plus microwave / oven cavity degreasing — quoted as a combo.",
          quoteLabel: "Fridge & Microwave Combo",
        },
      ],
    },
    organising: {
      slug: "organising",
      title: "Home Organising Services in Mohali | Her Homes",
      metaDesc: "Home organising in Mohali (SAS Nagar) — wardrobes, kitchens, drawers, pantries & move-in setup from ₹5,999. WhatsApp Her Homes Co. for a quote.",
      heroH1: "HOME ORGANISING<br />THAT HOLDS.",
      heroSupport: "Wardrobes, kitchens, drawers, pantries — systems you can actually keep.",
      eyebrow: "Organising",
      heading: "FUNCTION FIRST, SO THE STYLING STAYS.",
      intro: "We sort, edit and set up the spaces you live in every day — not a catalogue tidy that collapses in a week.",
      includes: [
        "Wardrobes & closets (including saree / seasonal folding)",
        "Kitchen cabinets, masala drawers & pantry",
        "Study & work-from-home (WFH) desk setup",
        "Fridge zoning & detailed shelf work (add-on)",
        "Day-1 move-in unpacking & Feng Shui placement on request",
      ],
      pricingBlurb: "Projects usually start from a single zone (one wardrobe, study desk or kitchen). Larger homes are scoped after a quick WhatsApp chat.",
      quoteService: "Organising",
      subServices: [
        {
          id: "full-home-org",
          name: "Full-home organising",
          startingPrice: 5999,
          blurb: "Wardrobes, kitchen, drawers and storage across the home.",
          quoteLabel: "Organising",
        },
        {
          id: "wardrobe",
          name: "Wardrobe only",
          startingPrice: 2499,
          blurb: "One closet or wardrobe — sorted, edited and set up to hold.",
          quoteLabel: "Wardrobe Organising",
        },
        {
          id: "kitchen-org",
          name: "Kitchen & pantry",
          startingPrice: 3499,
          blurb: "Cabinets, masala drawers, counters and pantry systems you can keep.",
          quoteLabel: "Kitchen Organising",
        },
        {
          id: "wfh-setup",
          name: "Study / WFH desk setup",
          startingPrice: null,
          blurb: "Work-from-home desk, cables, shelves and storage organised & styled around how you work.",
          quoteLabel: "Study / WFH Setup",
        },
      ],
    },
    "interior-design": {
      slug: "interior-design",
      title: "Interior Designers in Mohali | Her Homes",
      metaDesc: "Interior design & home styling in Mohali (SAS Nagar) by Her Homes Co. Room styling from ₹4,999, full home from ₹14,999. WhatsApp for a quote.",
      heroH1: "INTERIOR DESIGN<br />AROUND YOU.",
      heroSupport: "Decor, colour, furniture placement — built around how you actually live.",
      eyebrow: "Interior Design",
      heading: "YOUR HOME, NOT A CATALOGUE COPY.",
      intro: "We translate your taste and the things you already love into a room that feels finished — without forcing a template look.",
      includes: [
        "Decor, curtains, lighting & colour direction",
        "Furniture placement & visual balance",
        "Rental apartment & balcony makeovers (no carpentry needed)",
        "Study / WFH corner, living room & bedroom styling",
        "Works with our organising and deep-cleaning when you want the full reset",
      ],
      pricingBlurb: "Styling engagements start from a focused room package. Full-home direction is quoted after we see the space and your references.",
      quoteService: "Interior Design",
      subServices: [
        {
          id: "full-home-design",
          name: "Full-home interior design",
          startingPrice: 14999,
          blurb: "Cohesive decor direction across the rooms you live in most.",
          quoteLabel: "Interior Design",
        },
        {
          id: "single-room",
          name: "Single room styling",
          startingPrice: 4999,
          blurb: "One living room, bedroom or study — finished around your taste.",
          quoteLabel: "Single Room Styling",
        },
        {
          id: "decor-consult",
          name: "Decor consultation",
          startingPrice: 2999,
          blurb: "Colour, layout and shopping direction — a focused styling session.",
          quoteLabel: "Decor Consultation",
        },
      ],
    },
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
      q: "What is Her Homes Co. and what do you do?",
      a: "Her Homes Co. is a premier home interior design, professional organizing, and deep cleaning service based in Mohali, Punjab. Founded by Rupinder Kaur, we specialize in transforming spaces around the way you actually live. We do three things, usually together: home interior design (acting as your room designer and interior decorator), home organizing (wardrobes, kitchens, and storage), and deep cleaning services. You can book them individually or as a Combined Home Reset.",
    },
    {
      q: "Which areas do you serve?",
      a: "Her Homes Co. serves Mohali (officially SAS Nagar), Punjab — Mohali and SAS Nagar are two names for the same city. We cover residential phases and sectors across Mohali including Phase 3B2, Phase 5, Phase 7, Sectors 66–125 (such as Sector 79), the Airport Road belt, Aerocity, and IT City. Message us on WhatsApp and ask; it is a quick answer.",
    },
    {
      q: "How much does it cost?",
      a: "Full-home deep cleaning starts from ₹5,399 (1 BHK), with 2 BHK from ₹6,099, 3 BHK from ₹7,099 and larger homes from ₹9,499. You can also book by area — bathroom from ₹699, kitchen from ₹1,499, balcony from ₹699, sofa from ₹799, or ask for a fridge + microwave combo quote. Organising starts from ₹5,999 (wardrobe from ₹2,499, kitchen from ₹3,499, plus study / WFH desk setups), interior styling from ₹14,999 (single room from ₹4,999), and a Combined Home Reset from ₹17,999. Your final quote still depends on rooms, furnished vs vacant, and how thorough you want it — send details on WhatsApp and a personalised number comes back.",
    },
    {
      q: "Can I book deep cleaning for just one bathroom or the kitchen?",
      a: "Yes. Besides full-home deep cleaning (furnished or vacant flats, move-in cleaning, and Airbnb / short-stay turnovers), you can book bathroom descaling only, kitchen degreasing only, a fridge + microwave combo, balcony & window tracks, or sofa shampooing / dry cleaning. Tell us which areas on WhatsApp and we quote that scope.",
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
      q: "Can you organise our home according to Feng Shui?",
      a: "Yes. If Feng Shui matters in your home, say so at the start and it shapes the plan — which direction storage faces, where things live in the kitchen and the wardrobe, what stays out of particular corners. To be straight about it: we work to the principles you tell us matter to you.",
    },
    {
      q: "Do you work with traditional Indian or diverse heritage interiors?",
      a: "Very much so. The style worlds on this page — Scandinavian, Japanese, Modern, Minimalist, Indian Heritage, Bohemian and College Core — are starting points, not a menu you have to order from. A home in Mohali does not have to look like a generic catalogue from somewhere else.",
    },
    {
      q: "How do I book?",
      a: "Use the quote form on this site — pick the services you want, your home size, and a few words about what you need. It writes a WhatsApp message for you and opens it to +91-9915217674 so you can send it to Rupinder. Calling works just as well.",
    },
  ],
  faqMeta: {
    eyebrow: "Questions",
    heading: "THINGS PEOPLE ASK BEFORE THEY BOOK.",
    support: "If the answer you need isn't here, WhatsApp is the fastest way to get it.",
  },

  /* ------------------------------------------------------------------
   * OUR WORK — real photos from previous jobs, not stock.
   *
   * The camera roll was unsorted: one shelf was sent twice, one bedroom
   * had a second nearly identical angle, one loft frame was 141px tall,
   * and a 22 MB video of the lounge was left out (too heavy for the page).
   * What remains is grouped so a visitor can filter it. Captions describe
   * what is actually in the frame. They do not claim a finished showroom
   * where the photo is still lived-in.
   * ------------------------------------------------------------------ */
  ourWork: {
    eyebrow: "Previous homes",
    heading: "OUR WORK.",
    support: "Phone photos from jobs already done — shelves, a wardrobe, bedrooms, and one room planned on the wall before anything was moved. Some are older. They are real.",
    hint: "Tap a photo to see the whole frame.",
    groups: [
      { id: "all", label: "All" },
      { id: "organising", label: "Organising" },
      { id: "rooms", label: "Rooms" },
      { id: "plan", label: "A plan" },
    ],
    items: [
      {
        id: "plan",
        group: "plan",
        layout: "feature",
        kicker: "A plan",
        title: "One room, drawn first",
        caption: "Bed, clothes, books and a little green — zoned on the photo before anything was moved.",
        alt: "A single room with handwritten notes marking the bed, clothes rail, books, curtains and a small plant.",
        src: "/assets/media/work-plan.jpg",
        width: 683,
        height: 910,
      },
      {
        id: "wardrobe",
        group: "organising",
        layout: "portrait",
        kicker: "Organising",
        title: "A wardrobe, hung",
        caption: "Jackets and shirts grouped so the next morning does not start with a search.",
        alt: "An open wooden wardrobe with jackets and shirts hung in groups, shoes and a folded shirt in front.",
        src: "/assets/media/work-wardrobe.jpg",
        width: 728,
        height: 910,
      },
      {
        id: "altar",
        group: "organising",
        layout: "square",
        kicker: "Organising",
        title: "A shelf, styled",
        caption: "Books, a globe, and the objects that already belonged there, arranged so the shelf reads as one piece.",
        alt: "A dark bookcase styled with books, a blue globe, a framed picture, a vase and small objects.",
        src: "/assets/media/work-shelf-altar.jpg",
        width: 910,
        height: 910,
      },
      {
        id: "builtin",
        group: "organising",
        layout: "land",
        kicker: "Organising",
        title: "Books, within reach",
        caption: "A built-in over the bed, filled edge to edge and still readable.",
        alt: "A white built-in bookshelf above a bed, with books lined along the middle shelf.",
        src: "/assets/media/work-shelf-builtin.jpg",
        width: 958,
        height: 539,
      },
      {
        id: "floral-wall",
        group: "rooms",
        layout: "portrait",
        kicker: "Rooms",
        title: "Bedroom, the card wall",
        caption: "A made bed, the cards left up, the television hung where it can be seen from the pillow.",
        alt: "A bedroom with a floral bedspread, a wall of small cards, and a television.",
        src: "/assets/media/work-room-floral-wall.jpg",
        width: 683,
        height: 910,
      },
      {
        id: "floral-mirror",
        group: "rooms",
        layout: "portrait",
        kicker: "Rooms",
        title: "Same bedroom, the other wall",
        caption: "Mirror, chair and a shelf — the second side of that room, not a second job.",
        alt: "The same floral bedroom from the other side, with a mirror, a chair and a small wall shelf.",
        src: "/assets/media/work-room-floral-mirror.jpg",
        width: 683,
        height: 910,
      },
      {
        id: "music",
        group: "organising",
        layout: "portrait",
        kicker: "Organising",
        title: "The music corner",
        caption: "Books on the middle shelves. The instruments stay where they are played.",
        alt: "A light wood shelf of books beside guitars and a guitar amplifier.",
        src: "/assets/media/work-shelf-music.jpg",
        width: 683,
        height: 910,
      },
      {
        id: "flag",
        group: "rooms",
        layout: "land",
        kicker: "Rooms",
        title: "A bedroom that also works",
        caption: "Desk under the window, bed along the wall, clothes and guitars kept to one side.",
        alt: "A bedroom with a desk at the window, a dark bedspread, and guitars stored along the left.",
        src: "/assets/media/work-room-flag.jpg",
        width: 958,
        height: 719,
      },
      {
        id: "lounge",
        group: "rooms",
        layout: "land",
        objectPosition: "center 18%",
        kicker: "Rooms",
        title: "A shared lounge",
        caption: "Seating and tables in place. A few bags were still waiting on a home when this was taken.",
        alt: "A lounge with leather sofas, wooden tables and chairs, and bags on the floor near a desk.",
        src: "/assets/media/work-lounge.jpg",
        width: 683,
        height: 910,
      },
      {
        id: "desk",
        group: "rooms",
        layout: "square",
        kicker: "Rooms",
        title: "A working desk",
        caption: "Screens up, chair pulled in. The cables underneath are still part of the picture.",
        alt: "A black desk with two monitors and a red and black gaming chair.",
        src: "/assets/media/work-desk.jpg",
        width: 947,
        height: 910,
      },
      {
        id: "sill",
        group: "rooms",
        layout: "square",
        kicker: "Rooms",
        title: "A windowsill, edited down",
        caption: "A lamp and three objects. The rest of the sill was cleared.",
        alt: "A windowsill with a lamp, a small metal jar, a white ornament and a lantern.",
        src: "/assets/media/work-sill.jpg",
        width: 910,
        height: 910,
      },
      {
        id: "window",
        group: "rooms",
        layout: "square",
        kicker: "Rooms",
        title: "The window corner",
        caption: "Cooler, lamp, and the things that live beside the bed — kept together instead of spread across the room.",
        alt: "A window with a portable air cooler, a lamp, and a side table of everyday objects.",
        src: "/assets/media/work-window-corner.jpg",
        width: 910,
        height: 910,
      },
    ],
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
    bio: "Rupinder Kaur is entirely self-made. Her journey started in a small village and led, one step at a time, to building her own company — on the strength of a natural knack for organising and interior design, long before it was ever a business plan. That same instinct is still behind every homeHer Homes Co. takes on today.",
    photoSlot: "founder-portrait",
  },

  /* ------------------------------------------------------------------
   * FINAL CTA + BOOKING
   * ------------------------------------------------------------------ */
  finalCta: {
    lineA: ["LET'S MAKE", "YOUR HOME", "FEEL LIKE YOU."],
    support: "Tell her what you want below — we write the WhatsApp message for you, quote your words, and open it so you can send it straight to her.",
    whatsappButtonLabel: "Or just message her on WhatsApp",
  },

  /* ------------------------------------------------------------------
   * QUOTE FORM — asks what they want, builds a WhatsApp message that
   * quotes their words, and opens wa.me to mom's number. Nothing is
   * posted to a server; the browser only opens WhatsApp.
   * ------------------------------------------------------------------ */
  quoteForm: {
    eyebrow: "Ask for a quote",
    heading: "What do you want help with?",
    support: "Pick a few details. We'll write the message — including your words in quotes — then open WhatsApp so you can tap send.",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Simran",
    nameOptional: true,
    servicesLabel: "Services",
    services: [
      { id: "deep-cleaning", label: "Deep Cleaning" },
      { id: "bathroom-clean", label: "Bathroom Deep Clean" },
      { id: "kitchen-clean", label: "Kitchen Deep Clean" },
      { id: "fridge-microwave", label: "Fridge & Microwave Combo" },
      { id: "balcony-clean", label: "Balcony Deep Clean" },
      { id: "sofa-clean", label: "Sofa Cleaning" },
      { id: "organising", label: "Organising" },
      { id: "wardrobe-org", label: "Wardrobe Organising" },
      { id: "kitchen-org", label: "Kitchen Organising" },
      { id: "wfh-setup", label: "Study / WFH Setup" },
      { id: "interior-design", label: "Interior Design" },
      { id: "single-room", label: "Single Room Styling" },
      { id: "decor-consult", label: "Decor Consultation" },
      { id: "combined-reset", label: "Combined Home Reset" },
    ],
    sizeLabel: "Home size",
    sizePlaceholder: "Select a size",
    detailsLabel: "What do you want?",
    detailsPlaceholder: "e.g. Two bathrooms only, or full-home deep clean plus wardrobe organising.",
    detailsRequired: true,
    previewLabel: "Message she'll receive",
    submitLabel: "Send on WhatsApp",
    emptyPreview: "Fill in the form and your message will appear here.",
    // {name}, {services}, {size}, {details} — details is wrapped in quotes
    // in the composed message so her WhatsApp shows what they asked for.
    messageTemplate:
      "Hey Rupinder — I'd like a quote from Her Homes Co.\n\n" +
      "Name: {name}\n" +
      "Services: {services}\n" +
      "Home size: {size}\n\n" +
      "What I want:\n\"{details}\"",
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
    "process-visual":       { type: "image", src: null, note: "Pinned visual for the process section, can be one film loop.", alt: "A home mid-transformation duringHer Homes Co.'s styling and organising process." },
    "styling-detail":       { type: "image", src: null, note: "Home Styling supporting image.", alt: "Home styling byHer Homes Co. — decor, colour direction and furniture placement." },
    "organising-detail":    { type: "image", src: null, note: "Home Organising supporting image (drawers/shelves/wardrobe).", alt: "Organised wardrobe and shelving byHer Homes Co." },
    "deep-cleaning-detail": { type: "image", src: null, note: "Deep Cleaning supporting image.", alt: "A freshly deep-cleaned home interior byHer Homes Co." },
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
  "japanese":        { width: 1400, height: 2000 },
  "punjabi":         { width: 1400, height: 2000 },
  "modern":          { width: 1400, height: 2000 },
  "indian-heritage": { width: 1400, height: 2000 },
};

HHC_DATA.styleWorlds.forEach((w) => {
  HHC_DATA.mediaSlots["style-" + w.id] = Object.assign(
    {
      type: "image",
      // Root-absolute so /organising, /contact, etc. don't resolve
      // assets relative to the subfolder (which 404s).
      src: "/assets/media/" + w.id + ".jpg",
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
// ofHer Homes Co.'s own work, and nothing on the page says otherwise. Drop
// a real photo of an actual job at the same path and it takes over with no
// other change (`npm run build:images` will not overwrite it).
/** Build a WhatsApp click-to-chat URL that works on mobile + desktop. */
function hhcWhatsAppHref(message) {
  const num = HHC_DATA.contact.whatsapp.number;
  const text = message == null ? HHC_DATA.contact.whatsapp.message : message;
  return (
    "https://api.whatsapp.com/send?phone=" + num +
    "&text=" + encodeURIComponent(text)
  );
}
HHC_DATA.whatsAppHref = hhcWhatsAppHref;

HHC_DATA.serviceChooser.items.forEach((item) => {
  HHC_DATA.mediaSlots["service-" + item.id] = {
    type: "image",
    src: "/assets/media/service-" + item.id + ".jpg",
    width: 900,
    height: 1600,
    note: item.name + " chooser panel artwork.",
    // Decorative: the panel's own heading and blurb already say everything
    // this image conveys, so announcing it again is noise for a screen
    // reader. Empty alt is the correct answer here, not a missing one.
    alt: "",
  };
  item.whatsappHref = hhcWhatsAppHref(item.whatsappMessage);
  // Attach book-by-area / scoped options from the matching service page
  // so homepage tiles and landing pages stay in sync.
  const page = item.subServicesKey && HHC_DATA.servicePages[item.subServicesKey];
  if (page && page.subServices) item.subServices = page.subServices;
});

// Compute the WhatsApp href from the digits-only number + a friendly opener.
HHC_DATA.contact.whatsapp.href = hhcWhatsAppHref(HHC_DATA.contact.whatsapp.message);

// Real hero media. Responsive: a portrait cut for phones, a wide cut for
// desktop — main.js picks one at the same 768px breakpoint CSS uses.
HHC_DATA.mediaSlots["hero-film"].mobileSrc = "/assets/media/hero-mobile.mp4";
HHC_DATA.mediaSlots["hero-film"].desktopSrc = "/assets/media/hero-pc.mp4";
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
HHC_DATA.mediaSlots["hero-film"].mobilePoster = "/assets/media/hero-poster-mobile.webp";
HHC_DATA.mediaSlots["hero-film"].desktopPoster = "/assets/media/hero-poster-desktop.webp";

// Home sizes for the quote form — same list as the pricing teller.
HHC_DATA.quoteForm.sizes = HHC_DATA.pricing.variables.homeSize.slice();

// Node (scripts/prerender.mjs) reads this file by requiring it; the
// browser just gets the global. The guard below makes both work.
if (typeof module !== "undefined" && module.exports) module.exports = HHC_DATA;
