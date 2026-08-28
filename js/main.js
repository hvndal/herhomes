/**
 * HER HOMES CO. — MAIN
 * ----------------------------------------------------------------
 * Organised as one HHC namespace with a small init() at the bottom.
 * Each section of the site gets its own initX() function so later
 * additions (style worlds, process, pricing, quick-contact) can be
 * appended without touching what's already working.
 *
 * Motion stack: GSAP + ScrollTrigger for all scroll-linked work,
 * Lenis for smooth/momentum scroll. Transform + opacity only, so it
 * stays cheap on a 120Hz display. prefers-reduced-motion short-circuits
 * every entrance/scrub timeline to its resting end-state.
 */
(function () {
  "use strict";

  const HHC = {
    lenis: null,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    isCoarsePointer: window.matchMedia("(pointer: coarse)").matches,
    mm: gsap.matchMedia(),
  };
  window.HHC = HHC;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({ markers: false });

  /* ------------------------------------------------------------------
   * ADOPT — the one rule that keeps prerendering safe.
   *
   * scripts/prerender.mjs writes the real markup for every section into
   * index.html so that crawlers (and anything else that doesn't run JS,
   * which is most link-preview and AI scrapers) see actual copy rather
   * than empty divs. The functions below used to *create* that markup.
   * If they still did, every service row, style world and FAQ answer
   * would appear twice.
   *
   * So: if `container` already holds prerendered children, use them and
   * build nothing. If it's empty — which happens if someone edits
   * data.js and forgets to run `npm run build` — fall back to building
   * at runtime exactly as before, so the page degrades to "correct but
   * invisible to crawlers" rather than "blank".
   *
   * Returns the live child elements either way.
   * ------------------------------------------------------------------ */
  function adopt(container, selector, build) {
    if (!container) return [];
    const existing = container.querySelectorAll(selector);
    if (existing.length) return Array.from(existing);
    build();
    return Array.from(container.querySelectorAll(selector));
  }

  /* ------------------------------------------------------------------
   * SMOOTH SCROLL (Lenis <-> ScrollTrigger)
   * ------------------------------------------------------------------ */
  function initSmoothScroll() {
    if (HHC.reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
      return; // native scroll only
    }
    HHC.lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // cubic-out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    HHC.lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => HHC.lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");
  }

  function scrollTo(target, opts) {
    if (HHC.lenis) { HHC.lenis.scrollTo(target, Object.assign({ offset: 0, duration: 1.4 }, opts)); return; }
    if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }

  /* ------------------------------------------------------------------
   * ANALYTICS — dormant until a real analytics tool is installed. Pushes
   * to window.dataLayer (Google Tag Manager, and GA4-via-GTM) if present,
   * else calls window.gtag (GA4's direct gtag.js snippet) if present,
   * else does nothing. No Measurement ID is hardcoded here — there isn't
   * a real one yet, and a fake one would look wired up while quietly
   * tracking nothing. Add a real GTM container or gtag.js snippet to
   * <head> and every call below starts working with no other change.
   * Wrapped in try/catch: analytics must never break the page.
   * ------------------------------------------------------------------ */
  function trackEvent(name, params) {
    try {
      if (window.dataLayer && typeof window.dataLayer.push === "function") {
        window.dataLayer.push(Object.assign({ event: name }, params));
      } else if (typeof window.gtag === "function") {
        window.gtag("event", name, params);
      }
    } catch (e) { /* analytics must never break the page */ }
  }

  function initScrollLinks() {
    document.querySelectorAll('a[href^="#"], [data-scroll-to]').forEach((el) => {
      const href = el.getAttribute("data-scroll-to") || el.getAttribute("href");
      if (!href || href === "#") return;
      el.addEventListener("click", (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        closeMobileNav();
        scrollTo(target, { offset: -20 });
      });
    });
  }

  /* ------------------------------------------------------------------
   * NAV — populate from data.js, mobile drawer, scroll hide/show
   * ------------------------------------------------------------------ */
  function initNav() {
    const links = document.getElementById("nav-links");
    const mobileLinks = document.getElementById("mobile-nav-links");
    const desktopCta = document.getElementById("nav-cta-desktop");
    const mobileCta = document.getElementById("mobile-nav-cta");
    const mobileContact = document.getElementById("mobile-nav-contact");

    adopt(links, "a", () => {
      HHC_DATA.nav.forEach((item) => {
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        links.appendChild(a);
      });
    });
    adopt(mobileLinks, "a", () => {
      HHC_DATA.nav.forEach((item) => {
        const m = document.createElement("a");
        m.href = item.href;
        m.textContent = item.label;
        mobileLinks.appendChild(m);
      });
    });

    desktopCta.textContent = HHC_DATA.navCta.label;
    desktopCta.href = HHC_DATA.navCta.href;
    desktopCta.style.display = "";
    mobileCta.textContent = HHC_DATA.navCta.label;
    mobileCta.href = HHC_DATA.navCta.href;

    // Contact rows are prerendered as real <a href> links so they work with
    // JavaScript off; all this adds is the analytics hook on top of them.
    adopt(mobileContact, "li", () => {
      [
        { label: "WhatsApp", href: HHC_DATA.contact.whatsapp.href, external: true },
        { label: "Call", href: HHC_DATA.contact.phone.href, external: false },
      ].forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        if (item.external) { a.target = "_blank"; a.rel = "noopener"; }
        li.appendChild(a);
        mobileContact.appendChild(li);
      });
    });
    mobileContact.querySelectorAll("a").forEach((a) => {
      const event = a.href.indexOf("tel:") === 0 ? "phone_click" : "whatsapp_click";
      a.addEventListener("click", () => trackEvent(event, { location: "mobile_nav" }));
    });

    document.querySelector("[data-nav-burger]").addEventListener("click", toggleMobileNav);

    // Hide-on-scroll-down / show-on-scroll-up, active only once docked.
    let lastY = window.scrollY;
    const nav = document.getElementById("site-nav");
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (!nav.classList.contains("is-active")) return;
        const y = self.scroll();
        if (y > lastY && y > window.innerHeight * 0.6) nav.classList.add("is-hidden");
        else nav.classList.remove("is-hidden");
        lastY = y;
      },
    });
  }

  function toggleMobileNav() {
    const panel = document.getElementById("mobile-nav");
    const btn = document.querySelector("[data-nav-burger]");
    const opening = !panel.classList.contains("is-open");
    btn.setAttribute("aria-expanded", String(opening));
    panel.setAttribute("aria-hidden", String(!opening));
    const spans = btn.querySelectorAll("span");
    const quickContact = document.getElementById("quick-contact");
    if (opening) {
      panel.classList.add("is-open");
      if (quickContact) quickContact.classList.add("is-suppressed-nav"); // mobile nav has its own WhatsApp/Call links — avoid a duplicate floating on top of them
      if (HHC.lenis) HHC.lenis.stop(); else document.body.style.overflow = "hidden";
      gsap.to(panel, { y: 0, duration: HHC.reducedMotion ? 0 : 0.6, ease: "power3.out" });
      gsap.to(spans[0], { rotate: 45, y: 6.5, duration: 0.3 });
      gsap.to(spans[1], { opacity: 0, duration: 0.2 });
      gsap.to(spans[2], { rotate: -45, y: -6.5, duration: 0.3 });
    } else {
      closeMobileNav();
    }
  }
  function closeMobileNav() {
    const panel = document.getElementById("mobile-nav");
    if (!panel.classList.contains("is-open")) return;
    const btn = document.querySelector("[data-nav-burger]");
    const spans = btn.querySelectorAll("span");
    panel.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    const quickContact = document.getElementById("quick-contact");
    if (quickContact) quickContact.classList.remove("is-suppressed-nav");
    if (HHC.lenis) HHC.lenis.start(); else document.body.style.overflow = "";
    gsap.to(panel, { y: "-100%", duration: HHC.reducedMotion ? 0 : 0.5, ease: "power3.inOut" });
    gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.3 });
    gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
  }

  /* ------------------------------------------------------------------
   * MEDIA SLOTS — hydrate placeholders with real media once provided.
   * ------------------------------------------------------------------ */
  function hydrateMediaSlots() {
    document.querySelectorAll("[data-media-slot]").forEach((frame) => {
      if (frame.dataset.hydrated) return;
      frame.dataset.hydrated = "true";
      const key = frame.getAttribute("data-media-slot");
      const cfg = HHC_DATA.mediaSlots[key];
      if (!cfg) return;

      // Images are prerendered into the markup by scripts/prerender.mjs so
      // crawlers see them (and so their alt text is in the page source).
      // If one is already here, there is nothing to hydrate.
      if (frame.querySelector("img, video")) { frame.removeAttribute("data-empty"); return; }

      // `note` is an internal to-do for whoever is sourcing the photo — it
      // is NOT visitor-facing copy, and it used to be rendered straight
      // into the page, which meant real visitors read captions like
      // "Founder portrait — warm, personal, not corporate headshot."
      // A slot with no real file now renders nothing at all instead.
      const label = frame.querySelector(".media-frame__label");
      if (label) label.remove();

      if (cfg.type === "video") {
        // Video slots may carry a plain `src`, or a responsive pair
        // (`mobileSrc` / `desktopSrc`) — pick whichever fits, falling
        // back gracefully so a slot only needs the one it has. Same
        // pattern for `poster`/`mobilePoster`/`desktopPoster`.
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const chosenSrc = (isMobile ? cfg.mobileSrc : cfg.desktopSrc) || cfg.src || cfg.mobileSrc || cfg.desktopSrc;
        const chosenPoster = (isMobile ? cfg.mobilePoster : cfg.desktopPoster) || cfg.poster || cfg.mobilePoster || cfg.desktopPoster;
        if (!chosenSrc) return; // nothing real to show — leave the frame empty
        frame.removeAttribute("data-empty");
        const v = document.createElement("video");
        v.src = chosenSrc; v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
        v.preload = "metadata";
        // Decorative motion behind the headline — announcing it to a screen
        // reader adds nothing, and it carries no information the copy in
        // the hero doesn't already state.
        v.setAttribute("aria-hidden", "true");
        if (chosenPoster) v.poster = chosenPoster; // instant paint if the video itself is still loading
        frame.prepend(v);
      } else {
        if (!cfg.src) return; // nothing real to show — leave the frame empty
        frame.removeAttribute("data-empty");
        const img = document.createElement("img");
        img.src = cfg.src; img.alt = cfg.alt || "";
        img.loading = "lazy";
        img.decoding = "async";
        // Intrinsic size, so the browser reserves the right box before the
        // file lands and the layout never jumps (Cumulative Layout Shift).
        if (cfg.width) img.width = cfg.width;
        if (cfg.height) img.height = cfg.height;
        frame.prepend(img);
      }
    });
  }

  /* ------------------------------------------------------------------
   * LOGO INTRO  →  NAV + HERO HANDOFF
   * ------------------------------------------------------------------ */
  function initLogoIntro() {
    const intro = document.getElementById("logo-intro");
    const markWrap = intro.querySelector(".logo-intro__mark-wrap");
    const words = intro.querySelectorAll(".logo-intro__wordmark .word");
    const tagline = intro.querySelector(".logo-intro__tagline");
    const skipBtn = intro.querySelector("[data-skip-intro]");
    const nav = document.getElementById("site-nav");
    const navMarkImg = document.querySelector("[data-nav-mark] img");
    const navWordmark = document.querySelector("[data-nav-wordmark]");
    const heroCopyEls = document.querySelectorAll("[data-hero-reveal]");
    const scrollCue = document.querySelector(".hero__scroll-cue");
    const heroFrame = document.querySelector(".hero__frame");

    let introHandoffTL = null;
    let heroExpandTL = null;
    const cornerEls = document.querySelectorAll(".hero .media-frame__corner");

    function buildHandoff() {
      if (introHandoffTL) introHandoffTL.scrollTrigger?.kill();
      if (heroExpandTL) heroExpandTL.scrollTrigger?.kill();

      const markStart = markWrap.getBoundingClientRect();
      const markEnd = navMarkImg.getBoundingClientRect();
      const wordStart = intro.querySelector(".logo-intro__wordmark").getBoundingClientRect();
      const wordEnd = navWordmark.getBoundingClientRect();

      const markScale = markEnd.width / markStart.width;
      const markDX = (markEnd.left + markEnd.width / 2) - (markStart.left + markStart.width / 2);
      const markDY = (markEnd.top + markEnd.height / 2) - (markStart.top + markStart.height / 2);

      const wordScale = wordEnd.height / wordStart.height;
      const wordDX = (wordEnd.left + wordEnd.width / 2) - (wordStart.left + wordStart.width / 2);
      const wordDY = (wordEnd.top + wordEnd.height / 2) - (wordStart.top + wordStart.height / 2);

      // Stage 1 — decisive, quick: the identity resolves into the nav
      // across the first ~55% of one viewport height of scroll.
      introHandoffTL = gsap.timeline({
        scrollTrigger: { trigger: ".hero", start: "top top", end: "+=55%", scrub: 0.3, invalidateOnRefresh: true },
      })
        .to(markWrap, { x: markDX, y: markDY, scale: markScale, ease: "none", duration: 0.5 }, 0)
        .to(intro.querySelector(".logo-intro__wordmark"), { x: wordDX, y: wordDY, scale: wordScale, ease: "none", duration: 0.5 }, 0)
        .to(tagline, { opacity: 0, ease: "none", duration: 0.4 }, 0)
        .to(skipBtn, { opacity: 0, pointerEvents: "none", ease: "none", duration: 0.25 }, 0)
        .to(intro, { opacity: 0, ease: "none", duration: 0.35 }, 0.35)
        .set(intro, { display: "none" }, 0.75)
        .to(nav, { opacity: 1, ease: "none", duration: 0.3 }, 0.45)
        .call(() => nav.classList.add("is-active", "is-glass"), null, 0.45);

      // Stage 2 — slow, cinematic: small curated frame grows full-bleed
      // across the ENTIRE hero scroll runway (small -> larger -> full-bleed),
      // with the scroll cue pulsing briefly once the nav has docked, then
      // the headline/support copy settling in for a genuine, unhurried hold.
      heroExpandTL = gsap.timeline({
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      })
        .to(heroFrame, { "--frame-v": 0, "--frame-h": 0, "--frame-radius": "0px", ease: "none", duration: 1 }, 0)
        .to(cornerEls, { opacity: 0, ease: "none", duration: 0.17 }, 0.15)
        .to(scrollCue, { opacity: 1, ease: "none", duration: 0.1 }, 0.2)
        .to(scrollCue, { opacity: 0, ease: "none", duration: 0.1 }, 0.34)
        .to(heroCopyEls, { opacity: 1, y: 0, stagger: 0.05, ease: "none", duration: 0.2 }, 0.46);
    }

    function finishIntroInstantly() {
      gsap.set(markWrap, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1 });
      gsap.set(words, { opacity: 1, y: 0 });
      gsap.set(tagline, { opacity: 1 });
      gsap.set(skipBtn, { opacity: 0 });
      if (HHC.lenis) HHC.lenis.start();
      buildHandoff();
    }

    if (HHC.reducedMotion) {
      // Deliberately skip buildHandoff() altogether: no scroll-scrubbed
      // timeline should exist at all here, since there is no scroll-driven
      // motion for reduced-motion users — just the settled end state,
      // set once. (Creating the scrub timeline and then overriding it
      // with gsap.set was fragile: a later ScrollTrigger.refresh() would
      // re-render the timeline's cached start values and clobber it.)
      gsap.set(markWrap, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1 });
      gsap.set(words, { opacity: 1, y: 0 });
      gsap.set(tagline, { opacity: 1 });
      gsap.set(skipBtn, { opacity: 0 });
      gsap.set(intro, { opacity: 0, display: "none" });
      gsap.set(nav, { opacity: 1 });
      nav.classList.add("is-active", "is-glass");
      gsap.set(heroFrame, { "--frame-v": 0, "--frame-h": 0, "--frame-radius": "0px" });
      gsap.set(cornerEls, { opacity: 0 });
      gsap.set(heroCopyEls, { opacity: 1, y: 0 });
      gsap.set(scrollCue, { opacity: 0 });
      if (HHC.lenis) HHC.lenis.start();
      return;
    }

    if (HHC.lenis) HHC.lenis.stop();

    const tl = gsap.timeline({
      delay: 0.15,
      defaults: { ease: "power3.out" },
      onComplete: () => {
        if (HHC.lenis) HHC.lenis.start();
        buildHandoff();
      },
    });

    tl.to(skipBtn, { opacity: 1, duration: 0.5 }, 0.1)
      .to(markWrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut" }, 0)
      .to(markWrap, { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" }, 0)
      .to(words, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "expo.out" }, 0.55)
      .to(tagline, { opacity: 1, duration: 0.6 }, 0.95)
      .to({}, { duration: 0.5 }); // brief hold — the logo dominates the screen

    skipBtn.addEventListener("click", () => {
      tl.kill();
      finishIntroInstantly();
      gsap.to(intro, { opacity: 0, duration: 0.4, onComplete: () => (intro.style.display = "none") });
      gsap.set(nav, { opacity: 1 });
      nav.classList.add("is-active", "is-glass");
      gsap.set(heroFrame, { "--frame-v": 0, "--frame-h": 0, "--frame-radius": "0px" });
      gsap.to(heroCopyEls, { opacity: 1, y: 0, stagger: 0.05, duration: 0.5 });
      gsap.to(scrollCue, { opacity: 1, duration: 0.5 });
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (introHandoffTL) buildHandoff(); }, 200);
    });
  }

  /* ------------------------------------------------------------------
   * PHILOSOPHY — statement A masks in, holds, dissolves into statement B.
   * ------------------------------------------------------------------ */
  function buildMaskedLines(container, lines) {
    // Prerendered markup already contains <span><i>LINE</i></span> per line;
    // rebuilding it would throw away the copy a crawler reads. Only build
    // when the container really is empty.
    return adopt(container, "i", () => {
      container.innerHTML = "";
      lines.forEach((text) => {
        const span = document.createElement("span");
        const i = document.createElement("i");
        i.textContent = text;
        span.appendChild(i);
        container.appendChild(span);
      });
    });
  }

  function initPhilosophy() {
    const section = document.getElementById("philosophy");
    if (!section) return;
    const data = HHC_DATA.philosophy;
    const eyebrow = section.querySelector('[data-phi="eyebrow"]');
    const lineAEl = section.querySelector('[data-phi="line-a"]');
    const lineBEl = section.querySelector('[data-phi="line-b"]');
    const supportEl = section.querySelector('[data-phi="support"]');

    eyebrow.textContent = data.eyebrow;
    supportEl.textContent = data.support;
    const headingEl = section.querySelector('[data-phi-heading]');
    if (headingEl) headingEl.textContent = `${data.lineA.join(" ")} ${data.lineB.join(" ")}`;
    const aChars = buildMaskedLines(lineAEl, data.lineA);
    const bChars = buildMaskedLines(lineBEl, data.lineB);

    if (HHC.reducedMotion) {
      gsap.set(eyebrow, { opacity: 1 });
      gsap.set([aChars, bChars], { y: 0 });
      gsap.set(lineAEl, { opacity: 0 });
      gsap.set(lineBEl, { opacity: 1 });
      gsap.set(supportEl, { opacity: 1 });
      return;
    }

    gsap.timeline({
      scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.5 },
    })
      .to(eyebrow, { opacity: 1, ease: "none", duration: 0.12 }, 0)
      .to(aChars, { y: "0%", ease: "none", duration: 0.28, stagger: 0.03 }, 0.05)
      .to(lineAEl, { opacity: 0, scale: 0.92, ease: "none", duration: 0.16 }, 0.56)
      .to(lineBEl, { opacity: 1, ease: "none", duration: 0.16 }, 0.56)
      .to(bChars, { y: "0%", ease: "none", duration: 0.14, stagger: 0.02 }, 0.58)
      .to(supportEl, { opacity: 1, ease: "none", duration: 0.14 }, 0.78)
      .to(eyebrow, { opacity: 0, ease: "none", duration: 0.1 }, 0.6);
  }

  /* ------------------------------------------------------------------
   * STYLE WORLDS — pinned lookbook stage; scroll drives it, hover
   * previews it, click jumps to it. Not eight identical cards: overlay
   * alternates left/right per index for editorial asymmetry.
   * ------------------------------------------------------------------ */
  function initStyleWorlds() {
    const section = document.getElementById("styles");
    if (!section) return;
    const mediaContainer = section.querySelector("[data-sw-media]");
    const listContainer = section.querySelector("[data-sw-list]");
    const countEl = section.querySelector("[data-sw-count]");
    const nameEl = section.querySelector("[data-sw-name]");
    const wordsEl = section.querySelector("[data-sw-words]");
    const overlay = section.querySelector(".style-worlds__overlay");
    const worlds = HHC_DATA.styleWorlds;
    const total = worlds.length;
    const headingEl = section.querySelector('[data-sw-heading]');
    if (headingEl) headingEl.textContent = `Style Worlds: ${worlds.map((w) => w.name).join(", ")}`;

    const frames = adopt(mediaContainer, ".style-worlds__frame", () => {
      worlds.forEach((w, i) => {
        const frame = document.createElement("div");
        frame.className = "style-worlds__frame";
        frame.dataset.swIndex = String(i);
        const mf = document.createElement("div");
        mf.className = "media-frame";
        mf.setAttribute("data-media-slot", `style-${w.id}`);
        mf.setAttribute("data-empty", "true");
        frame.appendChild(mf);
        mediaContainer.appendChild(frame);
      });
    });

    const buttons = adopt(listContainer, "button", () => {
      worlds.forEach((w, i) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = w.name;
        btn.dataset.swIndex = String(i);
        li.appendChild(btn);
        listContainer.appendChild(li);
      });
    });

    let scrollIndex = 0;
    let previewIndex = null;

    function render(index) {
      frames.forEach((f, i) => f.classList.toggle("is-active", i === index));
      buttons.forEach((b, i) => b.classList.toggle("is-active", i === index));
      const activeBtn = buttons[index];
      if (activeBtn && listContainer.scrollWidth > listContainer.clientWidth) {
        const target = activeBtn.offsetLeft - listContainer.clientWidth / 2 + activeBtn.clientWidth / 2;
        listContainer.scrollTo({ left: target, behavior: HHC.reducedMotion ? "auto" : "smooth" });
      }
      const w = worlds[index];
      countEl.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      nameEl.textContent = w.name.toUpperCase();
      wordsEl.innerHTML = "";
      w.words.forEach((word) => {
        const li = document.createElement("li");
        li.textContent = word;
        wordsEl.appendChild(li);
      });
      overlay.classList.toggle("is-right", index % 2 === 1);
    }
    render(0);

    buttons.forEach((btn, i) => {
      if (!HHC.isCoarsePointer) {
        btn.addEventListener("mouseenter", () => { previewIndex = i; render(i); });
        btn.addEventListener("mouseleave", () => { previewIndex = null; render(scrollIndex); });
      }
      btn.addEventListener("click", () => {
        const rect = section.getBoundingClientRect();
        const innerScrollable = section.offsetHeight - window.innerHeight;
        const destY = window.scrollY + rect.top + innerScrollable * (i / total) + 20;
        scrollTo(destY, {});
      });
    });

    if (HHC.reducedMotion) return;

    ScrollTrigger.create({
      trigger: section, start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(total - 1, Math.floor(self.progress * total));
        if (idx !== scrollIndex) {
          scrollIndex = idx;
          if (previewIndex === null) render(scrollIndex);
        }
      },
    });
  }

  /* ------------------------------------------------------------------
   * WHAT WE DO — three services, populated from data.js. A four-word
   * narrative (Clean / Organise / Style / Reset) in the sticky column
   * highlights progressively as the reader moves through the list —
   * an ambient reading-progress cue, not a literal 1:1 row mapping.
   * ------------------------------------------------------------------ */
  function initWhatWeDo() {
    const section = document.getElementById("what-we-do");
    if (!section) return;
    // The eyebrow and the sr-only section heading are prerendered — they are
    // static strings, so there is nothing to re-set at runtime.
    const narrativeEl = section.querySelector("[data-wwd-narrative]");
    const narrativeItems = adopt(narrativeEl, "li", () => {
      HHC_DATA.services.narrative.forEach((word) => {
        const li = document.createElement("li");
        li.textContent = word;
        narrativeEl.appendChild(li);
      });
    });
    narrativeItems[0]?.classList.add("is-active");

    const list = section.querySelector("[data-wwd-list]");
    adopt(list, ".wwd-item", () => {
      HHC_DATA.services.items.forEach((svc) => {
        const item = document.createElement("div");
        item.className = "wwd-item";
        item.innerHTML = `
          <div class="wwd-item__top">
            <h4 class="f-display wwd-item__name">${svc.name}</h4>
            <span class="f-label wwd-item__index">${svc.index}</span>
          </div>
          <p class="f-body wwd-item__summary">${svc.summary}</p>
          <div class="wwd-item__includes">${svc.includes.map((t) => `<span>${t}</span>`).join("")}</div>
          <p class="f-body wwd-item__note">${svc.note}</p>
        `;
        list.appendChild(item);
      });
    });

    if (HHC.reducedMotion) return;
    ScrollTrigger.create({
      trigger: list, start: "top 65%", end: "bottom 40%", scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(narrativeItems.length - 1, Math.floor(self.progress * narrativeItems.length));
        narrativeItems.forEach((li, i) => li.classList.toggle("is-active", i === idx));
      },
    });
  }

  /* ------------------------------------------------------------------
   * PROCESS — six stages, one at a time, driven by scroll position.
   * ------------------------------------------------------------------ */
  function initProcess() {
    const section = document.getElementById("process");
    if (!section) return;
    const steps = HHC_DATA.process;
    // The sr-only heading and the full six-step <ol> are prerendered: the
    // visible stage only ever shows one step at a time, so that list is the
    // only place all six exist for a crawler or a screen reader.
    const indexEl = section.querySelector("[data-proc-index]");
    const titleEl = section.querySelector("[data-proc-title]");
    const detailEl = section.querySelector("[data-proc-detail]");
    const progressEl = section.querySelector("[data-proc-progress]");

    const ticks = adopt(progressEl, "li", () => {
      steps.forEach(() => progressEl.appendChild(document.createElement("li")));
    });

    function render(i) {
      indexEl.textContent = steps[i].index;
      titleEl.textContent = steps[i].title.toUpperCase();
      detailEl.textContent = steps[i].detail;
      ticks.forEach((t, ti) => t.classList.toggle("is-active", ti === i));
    }
    render(0);

    if (HHC.reducedMotion) return;
    let current = 0;
    ScrollTrigger.create({
      trigger: section, start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        if (idx !== current) {
          current = idx;
          gsap.timeline()
            .to([titleEl, detailEl], { opacity: 0, y: -8, duration: 0.18, ease: "power1.in" })
            .call(() => render(current))
            .fromTo([titleEl, detailEl], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
        }
      },
    });
  }

  /* ------------------------------------------------------------------
   * PRICING — service menu driven entirely by data.js. A null
   * startingPrice renders as a personalised-quote treatment rather
   * than a fabricated number.
   * ------------------------------------------------------------------ */
  function formatINR(n) {
    return `₹${Number(n).toLocaleString("en-IN")}`;
  }

  function initPricing() {
    const section = document.getElementById("pricing");
    if (!section) return;
    const data = HHC_DATA.pricing;
    // Eyebrow / heading / intro are prerendered static text — nothing to set.

    const menu = section.querySelector("[data-pr-menu]");
    adopt(menu, ".pr-row", () => {
      data.services.forEach((svc) => {
        const row = document.createElement("div");
        row.className = "pr-row";
        const priceLabel = svc.startingPrice ? `From ${formatINR(svc.startingPrice)}` : "Personalised quote";
        row.innerHTML = `
          <h4 class="f-display pr-row__name">${svc.name}</h4>
          <p class="f-body pr-row__desc">${svc.description}</p>
          <span class="f-label pr-row__price${svc.startingPrice ? "" : " is-quote"}">${priceLabel}</span>
        `;
        menu.appendChild(row);
      });
    });

    const addons = section.querySelector("[data-pr-addons]");
    adopt(addons, ".pr-addon", () => {
      data.addOns.forEach((addon) => {
        const row = document.createElement("div");
        row.className = "pr-addon";
        row.innerHTML = `
          <div>
            <p class="f-label pr-addon__name">${addon.name}</p>
            <p class="pr-addon__desc">${addon.description}</p>
          </div>
          <span class="f-label pr-addon__price">${formatINR(addon.price)} ${addon.priceUnit}</span>
        `;
        addons.appendChild(row);
      });
    });

    const factors = section.querySelector("[data-pr-factors]");
    adopt(factors, "li", () => {
      data.variables.factors.forEach((f) => {
        const li = document.createElement("li");
        li.textContent = f;
        factors.appendChild(li);
      });
    });

    // The size picker feeds straight into the quote CTA below it: picking a
    // size doesn't compute a price (nothing here is fabricated — no size
    // tier pricing exists yet), but it does carry that choice straight into
    // the WhatsApp message, so "the calculator" ends in an actual, working
    // quote request rather than a dead end.
    const teller = section.querySelector("[data-pr-teller-cta]");
    const waNumber = HHC_DATA.contact.whatsapp.number;
    let selectedSize = null;
    function setTellerMessage(message, label) {
      teller.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
      teller.textContent = label;
    }
    setTellerMessage(HHC_DATA.contact.whatsapp.message, "Get a personalised quote");
    teller.addEventListener("click", () => trackEvent("quote_request_click", { location: "pricing", home_size: selectedSize || "unselected" }));

    const sizes = section.querySelector("[data-pr-sizes]");
    const sizeButtons = adopt(sizes, "button", () => {
      data.variables.homeSize.forEach((size) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = size;
        sizes.appendChild(btn);
      });
    });
    // Wired after adoption so it works on prerendered buttons and on
    // runtime-built ones alike. The label is the button's own text, which
    // means the two can never disagree about which size was picked.
    sizeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const size = btn.textContent.trim();
        sizeButtons.forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        selectedSize = size;
        setTellerMessage(data.quoteMessageTemplate.replace("{size}", size), `Get a quote for your ${size}`);
        trackEvent("home_size_selected", { location: "pricing", home_size: size });
      });
    });
  }

  /* ------------------------------------------------------------------
   * SERVICE CHOOSER — nothing to render or wire up for it to work: the
   * panels are prerendered, each is a real <a href> into a pre-written
   * WhatsApp message, and the expand-on-hover/focus behaviour is pure
   * CSS. This only reports which service was picked, which is the most
   * useful number on the page — it says what people actually come for.
   * ------------------------------------------------------------------ */
  function initServiceChooser() {
    document.querySelectorAll("[data-svc-cta]").forEach((link) => {
      link.addEventListener("click", () => {
        trackEvent("whatsapp_click", {
          location: "service_chooser",
          service: link.getAttribute("data-svc-id") || "",
        });
      });
    });
  }

  /* ------------------------------------------------------------------
   * FAQ — no rendering to do: the questions and answers are real markup
   * in index.html inside native <details>, which is keyboard-accessible
   * and indexable without any JavaScript at all. All that's added here
   * is analytics, so it's visible which questions people actually open
   * (a genuinely useful signal for what to answer better, or to turn
   * into its own page later).
   * ------------------------------------------------------------------ */
  function initFaq() {
    document.querySelectorAll("#faq .faq-item").forEach((item, i) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        const q = item.querySelector("summary");
        trackEvent("faq_open", { location: "faq", position: i + 1, question: q ? q.textContent.trim() : "" });
      });
    });
  }

  /* ------------------------------------------------------------------
   * FOUNDER
   * ------------------------------------------------------------------ */
  function initFounder() {
    const section = document.getElementById("founder");
    if (!section) return;
    // All of this section's copy is prerendered static text.

    if (HHC.reducedMotion) return;
    // Only present once a real founder portrait exists — until then the
    // section is prerendered as a single centred column with no media
    // frame at all, so there is nothing to parallax.
    const media = section.querySelector("[data-fo-parallax]");
    if (!media) return;
    gsap.fromTo(media, { yPercent: -6 }, {
      yPercent: 6, ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
    });
  }

  /* ------------------------------------------------------------------
   * FINAL CTA + BOOKING FORM + FOOTER
   * ------------------------------------------------------------------ */
  function initFinalCta() {
    const section = document.getElementById("book");
    if (!section) return;

    // Heading — masked-line reveal, once, on first view. The lines
    // themselves are prerendered; this only finds them.
    const headingEl = section.querySelector("[data-cta-heading]");
    const chars = adopt(headingEl, "i", () => {
      HHC_DATA.finalCta.lineA.forEach((text) => {
        const line = document.createElement("span");
        line.className = "line";
        const i = document.createElement("i");
        i.textContent = text;
        line.appendChild(i);
        headingEl.appendChild(line);
      });
    });
    if (HHC.reducedMotion) {
      gsap.set(chars, { y: 0 });
    } else {
      ScrollTrigger.create({
        trigger: section, start: "top 75%", once: true,
        onEnter: () => gsap.to(chars, { y: "0%", duration: 0.9, stagger: 0.08, ease: "expo.out" }),
      });
    }

    // Primary action — WhatsApp is the booking flow. No on-page form: this
    // is a direct, local (Tricity / Mohali) business, and a message someone
    // will actually reply to beats a form field someone has to fill in.
    const c = HHC_DATA.contact;
    const whatsappEl = section.querySelector("[data-cta-whatsapp]");
    if (whatsappEl) {
      whatsappEl.addEventListener("click", () => trackEvent("whatsapp_click", { location: "final_cta" }));
    }

    // Secondary contact links — prerendered as real <a href>; this only
    // adds the analytics hook.
    const contactsEl = section.querySelector("[data-cta-contacts]");
    adopt(contactsEl, "a", () => {
      const a = document.createElement("a");
      a.href = c.phone.href;
      a.textContent = c.phone.display;
      contactsEl.appendChild(a);
    }).forEach((a) => {
      a.addEventListener("click", () => trackEvent("phone_click", { location: "final_cta" }));
    });

    // Footer links are prerendered too. The copyright year is the one thing
    // worth re-setting at runtime: it keeps saying the right year even if
    // nobody rebuilds the site on 1 January.
    const footerLinks = document.querySelector("[data-footer-links]");
    adopt(footerLinks, "li", () => {
      [
        { label: "WhatsApp", href: c.whatsapp.href },
        { label: c.phone.display, href: c.phone.href },
        { label: "FAQ", href: "#faq" },
        { label: "Book", href: "#book" },
      ].forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href; a.textContent = item.label;
        if (item.href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
        li.appendChild(a);
        footerLinks.appendChild(li);
      });
    });
    const copyrightEl = document.querySelector("[data-footer-copyright]");
    if (copyrightEl) copyrightEl.textContent = `© ${new Date().getFullYear()} ${HHC_DATA.brand.name} All rights reserved.`;
  }

  /* ------------------------------------------------------------------
   * QUICK CONTACT — persistent WhatsApp + Call widget (see index.html
   * #quick-contact). Wires the same links as the final CTA section, and
   * hides itself while that section is in view so the same action isn't
   * shown twice on screen at once.
   * ------------------------------------------------------------------ */
  function initQuickContact() {
    const widget = document.getElementById("quick-contact");
    if (!widget) return;
    const c = HHC_DATA.contact;

    const waEl = widget.querySelector("[data-quick-whatsapp]");
    if (waEl) waEl.href = c.whatsapp.href;
    const callEl = widget.querySelector("[data-quick-call]");
    if (callEl) callEl.href = c.phone.href;
    const labelEl = widget.querySelector("[data-quick-contact-label]");
    if (labelEl) labelEl.textContent = HHC_DATA.quickContact.label;

    const bookSection = document.getElementById("book");
    if (bookSection && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            widget.classList.toggle("is-suppressed-cta", entry.isIntersecting);
          });
        },
        { threshold: 0.15 }
      );
      io.observe(bookSection);
    }
  }

  /* ------------------------------------------------------------------
   * INIT
   * ------------------------------------------------------------------ */
  function init() {
    initSmoothScroll();
    initNav();
    initLogoIntro();
    initScrollLinks();
    initPhilosophy();
    initStyleWorlds();
    initWhatWeDo();
    initProcess();
    initServiceChooser();
    initPricing();
    initFaq();
    initFounder();
    initFinalCta();
    initQuickContact();
    hydrateMediaSlots(); // runs last: picks up every dynamically-built media-frame too
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
