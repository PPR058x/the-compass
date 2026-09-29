/* ==========================================================================
   THE COMPASS — central artist / brand data.
   Edit this file to update bio copy, quick facts, palette, social links, and
   artist-level images without touching index.html or epk.html. Any value
   that isn't confirmed yet stays `null` (or `pending: true`) — never invent
   a fact here; the renderer (js/content-loader.js) shows the site's existing
   "(pending)" convention for anything missing.
   Loaded as a plain global before js/content-loader.js — no build step, no
   modules, works the same under file://, a local server, or GitHub Pages.
   ========================================================================== */

window.COMPASS = window.COMPASS || {};

COMPASS.artist = {
  name: "Patrick Pascal Reerink",
  aka: "PPR058x",
  brand: "The Compass",
  genre: "Electronic\u00A0· Afrobeat\u00A0· Afro\u00A0House\u00A0· Amapiano\u00A0· Deep\u00A0House\u00A0· Hip-Hop\u00A0· Rap\u00A0· Dutch\u00A0· Reggaeton\u00A0· Latin\u00A0· R&B",

  slogans: [
    "The World Is Changing...",
    "Can You Feel The Frequency?"
  ],

  // THE single official artist biography — one authoritative bio, no
  // separate "short" version. Rendered as one <p> per array entry into
  // epk.html's Bio section. Verbatim per the artist-supplied text (2026) —
  // do not rewrite, shorten, paraphrase, or add to it. Markdown emphasis
  // from the source (**bold**, *italic*) is preserved as <strong>/<em>.
  bioHtml: [
    "<strong>PATRICK PASCAL REERINK</strong><br><em>Artistically known as PPR058x</em>",
    "Patrick Pascal Reerink is an independent electronic music artist and visionary creator from the Netherlands, creating music under his own name with <strong>PPR058x</strong> as his distinctive artistic signature.",
    "His sound moves between electronic music, Afro-inspired rhythms, deep house, melodic atmospheres and conscious storytelling. His work explores themes of awakening, identity, perception, transformation and the search for deeper meaning.",
    "At the heart of his artistic universe is <strong>The Compass</strong> — a musical journey designed to challenge perception and invite listeners to explore the space between what they know and what they have yet to discover.",
    "Through hypnotic rhythms, cinematic textures, emotional melodies and conceptual storytelling, Patrick creates music that is meant to be more than entertainment — it is an experience, a reflection and a journey inward.",
    "<strong>The Compass is the signal.</strong><br><strong>The music is the map.</strong><br><strong>You choose the direction.</strong>"
  ],

  quickFacts: [
    { label: "Genre", value: "Electronic\u00A0· Afrobeat\u00A0· Afro\u00A0House\u00A0· Amapiano\u00A0· Deep\u00A0House\u00A0· Hip-Hop\u00A0· Rap\u00A0· Dutch\u00A0· Reggaeton\u00A0· Latin\u00A0· R&B", pending: false },
    { label: "Based in", value: "Leeuwarden, Netherlands", pending: false },
    { label: "Active since", value: "2025", pending: false },
    { label: "Current release", value: "The Awakening Code (2 Aug 2026)", pending: false }
  ],

  // Confirmed brand palette. Note: BRAND_BIBLE.md §4 states gold as #D4AF37,
  // while the live site (style.css / epk.css) implements #C7A54B. This data
  // matches the live site for visual continuity — flagged, not resolved,
  // here; see the EPK build notes for the same flag.
  palette: [
    { name: "Obsidian Black", hex: "#0A0A0A" },
    { name: "Signature Gold", hex: "#C7A54B" }
  ],

  // Primary "Listen to my music" destination: the Amuse artist smart link,
  // which routes listeners to every streaming platform. Used by epk.html
  // (nav, hero, Listen section, footer). Direct platform URLs stay on each
  // release's `streaming` field and render as secondary links when present.
  smartLink: {
    label: "Listen to my music",
    url: "https://share.amuse.io/artist/patrick-pascal-reerink"
  },

  // Artist-level social links (as opposed to per-release streaming links,
  // which live on each entry in data/releases.js). All unconfirmed today.
  social: {
    instagram: null,
    facebook: null,
    tiktok: null,
    youtube: null
  },

  // Each value is either null ("not available yet — show the existing
  // fallback") or { src, alt, width, height, critical }. See js/media.js.
  // main/portrait/live are data-ready only — no layout slot exists for any
  // of them in either page yet (would require a layout change, out of
  // scope here).
  images: {
    favicon: null,   // e.g. { src: "assets/images/favicon.ico" }
    logo: { src: "assets/images/artist/ppr058x-logo.jpeg", alt: "PPR058x logo", width: 1254, height: 1254 },
    main: { src: "assets/images/artist/artist-main.jpeg", alt: "Patrick Pascal Reerink", width: 941, height: 1672 },
    portrait: null,  // e.g. { src: "assets/images/artist/artist-portrait.jpg", alt: "Patrick Pascal Reerink portrait", width: 800, height: 800 }
    live: null       // e.g. { src: "assets/images/artist/artist-live.jpg", alt: "Patrick Pascal Reerink performing live", width: 1600, height: 1067 }
  }
};
