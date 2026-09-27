/* ==========================================================================
   THE COMPASS — press-facing data (photos, logos, quotes, live dates,
   technical rider, contacts). Mirrors Press/MEDIA_CONTACT.md. Every field
   is null/[] until confirmed — the renderer shows the EPK's existing
   pending/empty-state blocks for anything missing here.
   ========================================================================== */

window.COMPASS = window.COMPASS || {};

COMPASS.press = {
  // [{ src, alt, width, height, caption }] — empty until real photos exist.
  photos: [],

  // [{ src, alt, label }] — logo/brand asset files ready for download.
  logos: [],

  // [{ quote, source, url }] — real quotes only, added after embargo lift.
  quotes: [],

  // [{ date, city, venue, url }] — empty until dates are confirmed.
  liveDates: [],

  // string/HTML once a technical rider exists, else null.
  rider: null,

  contacts: {
    pressMedia: { name: null, role: null, email: null, phone: null },
    booking: { name: null, email: null }
  }
};
