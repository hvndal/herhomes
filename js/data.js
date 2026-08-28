/**
 * HER HOMES CO. — CENTRAL EDITABLE CONFIG
 * ----------------------------------------------------------------
 * Every price, service description, style-world entry, founder detail,
 * and contact link lives here. Edit this file only — the page reads
 * from it at load time. Nothing else in the codebase should need to
 * change when the business updates a price or swaps a photo.
 *
 * PLACEHOLDER marks anything not yet confirmed. Search this file for
 * "PLACEHOLDER" to find every value that still needs a real answer.
 */

const HHC_DATA = {

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
    email: "PLACEHOLDER@herhomes.co",
    location: null, // null = footer simply omits it, rather than showing placeholder text to visitors
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
    { label: "Founder",    href: "#founder" },
  ],
  navCta: { label: "Book", href: "#book" },

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
   * STYLE WORLDS — a curated five. Each needs one strong image slot.
   * `words` are the four descriptor words from the brief; keep to four.
   * ------------------------------------------------------------------ */
  styleWorlds: [
    { id: "scandinavian",  name: "Scandinavian",  words: ["Light", "Natural", "Functional", "Quiet"] },
    { id: "bohemian",      name: "Bohemian",      words: ["Layered", "Warm", "Textural", "Collected"] },
    { id: "college-core",  name: "College Core",  words: ["Personal", "Playful", "Nostalgic", "Expressive"] },
    { id: "modern",        name: "Modern",        words: ["Clean", "Architectural", "Balanced", "Crisp"] },
    { id: "minimalist",    name: "Minimalist",    words: ["Sparse", "Considered", "Calm", "Essential"] },
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
        includes: ["Wardrobes", "Kitchens", "Drawers", "Shelves", "Pantries", "Fridges", "Desks", "Storage", "Utility spaces"],
        note: "Beautiful and practical — good organising shouldn't feel like organising. It should just work.",
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
    { index: "03", title: "We Build The Look",           detail: "A visual direction around your aesthetic — not a template pulled off a shelf." },
    { index: "04", title: "We Organise The Details",     detail: "Wardrobes, kitchens, drawers, shelving — function first, so the styling holds." },
    { index: "05", title: "We Reset The Space",          detail: "A full deep clean, so everything that follows lands on a space that can breathe." },
    { index: "06", title: "You Walk Into It",             detail: "A home that already feels like you, from the first day." },
  ],

  /* ------------------------------------------------------------------
   * PRICING — one editable structure. See PRICING_PLACEHOLDER below:
   * any service whose startingPrice is `null` renders as a tasteful
   * "personalised quote" treatment rather than a fabricated number.
   * Only the shelf/organising add-on price is confirmed.
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
   * FOUNDER — replace name / photo / bio once provided.
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
   * FINAL CTA + BOOKING FORM
   * ------------------------------------------------------------------ */
  finalCta: {
    lineA: ["LET'S MAKE", "YOUR HOME", "FEEL LIKE YOU."],
    support: "No long forms — this is a Tricity / Mohali operation. Message her on WhatsApp and tell her a bit about your home; she'll take it from there.",
    whatsappButtonLabel: "Message her on WhatsApp",
  },

  /* ------------------------------------------------------------------
   * MEDIA SLOTS — every placeholder image/video in the page renders
   * from this list via [data-media-slot]. Swap real media by dropping
   * a file into assets/media/ and setting `src` here — no HTML edits.
   * type: "video" | "image". src: null means "keep the styled placeholder".
   * ------------------------------------------------------------------ */
  mediaSlots: {
    "hero-film":               { type: "video", src: null, mobileSrc: null, desktopSrc: null, mobilePoster: null, desktopPoster: null, note: "Cinematic interior film — sunlight, hands, fabric, wood." },
    "founder-portrait":        { type: "image", src: null, note: "Founder portrait — warm, personal, not corporate headshot.", alt: "Rupinder Kaur, founder of Her Homes Co., in a softly styled home interior." },
    "process-visual":          { type: "image", src: null, note: "Pinned visual for the process section, can be one film loop.", alt: "A home mid-transformation during Her Homes Co.'s styling and organising process." },
    "styling-detail":          { type: "image", src: null, note: "Home Styling supporting image.", alt: "Home styling by Her Homes Co. — decor, colour direction and furniture placement." },
    "organising-detail":       { type: "image", src: null, note: "Home Organising supporting image (drawers/shelves/wardrobe).", alt: "Organised wardrobe and shelving by Her Homes Co." },
    "deep-cleaning-detail":    { type: "image", src: null, note: "Deep Cleaning supporting image.", alt: "A freshly deep-cleaned home interior by Her Homes Co." },
    // One image slot per style world, id-prefixed:
    ...Object.fromEntries(
      ["scandinavian","bohemian","college-core","modern","minimalist"]
        .map(id => {
          const label = id.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
          return [`style-${id}`, { type: "image", src: null, note: `${id} style-world image.`, alt: `${label}-style home interior styled by Her Homes Co.` }];
        })
    ),
  },
};

// Compute the WhatsApp href from the digits-only number + a friendly opener.
HHC_DATA.contact.whatsapp.href = `https://wa.me/${HHC_DATA.contact.whatsapp.number}?text=${encodeURIComponent(HHC_DATA.contact.whatsapp.message)}`;

// Real media, dropped in after the initial build. See README.md for the
// full placeholder inventory of what (if anything) is still missing.
HHC_DATA.mediaSlots["style-scandinavian"].src = "assets/media/scandinavian.jpg";
HHC_DATA.mediaSlots["style-bohemian"].src = "assets/media/bohemian.jpg";
HHC_DATA.mediaSlots["style-college-core"].src = "assets/media/college-core.jpg";
HHC_DATA.mediaSlots["style-minimalist"].src = "assets/media/minimalist.jpg";
HHC_DATA.mediaSlots["hero-film"].mobileSrc = "assets/media/hero-mobile.mp4";
HHC_DATA.mediaSlots["hero-film"].desktopSrc = "assets/media/hero-pc.mp4";
// Poster frames (real stills pulled from the two clips above) — shown the
// instant the page paints, before the video itself has loaded, so the hero
// is never a blank/empty frame. Also set directly in CSS (see styles.css:
// .hero__frame) so the poster paints even before JS hydrates.
HHC_DATA.mediaSlots["hero-film"].mobilePoster = "assets/media/hero-poster-mobile.jpg";
HHC_DATA.mediaSlots["hero-film"].desktopPoster = "assets/media/hero-poster-desktop.jpg";
