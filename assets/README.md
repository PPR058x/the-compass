# assets

Status: placeholder — no final content generated yet. Every image reference across the site fails gracefully (an `onerror` fallback shows brand-consistent text in place of the missing image), so the site works today and simply looks richer once these are added.

Shared, site-wide (referenced from `index.html` and every top-level section):

- `favicon.ico` — site favicon
- `album-cover.webp` — *The Awakening Code* cover art (used on the homepage, Music catalog, and Album Guide cover)
- `background.webp` — cinematic cover background for the Album Guide
- `sacred-pattern.webp` — sacred-geometry texture used across the Album Guide's act dividers
- `ppr058x-logo.webp` — Patrick Pascal Reerink / PPR058x wordmark
- `patrick-pascal-reerink.webp` — artist portrait (used on the homepage, Artists roster, and artist profile)

Follow `BRAND_BIBLE.md` sections 4–8 for palette, typography, and imagery direction on all of the above. As future albums and artists are added under `music/` and `artists/`, give each its own cover/portrait asset following the same naming pattern (e.g. `music/<album-slug>/cover.webp`).
