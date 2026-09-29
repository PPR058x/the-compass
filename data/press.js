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

  // `contact` is free-text shown when there is no public `email` address.
  contacts: {
    pressMedia: {
      name: "Patrick Pascal Reerink",
      role: "Artist / Founder — The Compass",
      email: null,
      contact: "Contact via email — available through Linktree",
      phone: "Private"
    },
    booking: {
      name: "Patrick Pascal Reerink",
      email: null,
      contact: "Contact via email — available through Linktree"
    }
  }
};
