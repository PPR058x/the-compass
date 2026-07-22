# The Compass

Official website and creative platform for **The Compass**, a premium music brand currently featuring *The Awakening Code* — with structure in place for future albums, artists, merchandise, news, and media.

**Featured Artist:** Patrick Pascal Reerink
**Featured Album:** *The Awakening Code* (Afrobeat)
**Release Date:** 2 August 2026
**Tracks:** 21

Marketing project workspace and live website for The Compass and *The Awakening Code*.

---

## Marketing Foundation

### Positioning Statement

*The Awakening Code* is a premium, cinematic Afrobeat album that positions itself not as a release to be consumed, but as a frequency to be felt. Where much of the genre leans into hype and celebration, this project leans into depth, symbolism, and shared transformation — inviting listeners into a collective moment of awakening rather than selling them a product.

### Target Audience

- Listeners drawn to Afrobeat and its global evolution, who also appreciate depth, symbolism, and cinematic presentation over pure party energy.
- Audiences interested in personal growth, spirituality, frequency/sound-healing culture, and conscious-living communities — who will resonate with themes of awakening, unity, and transformation.
- Fans of premium, visually driven artist branding (black-and-gold, cinematic aesthetics) who follow artists as much for the world they build as for the music itself.

### Brand Pillars

1. **Frequency** — the music as a literal and symbolic signal; sound as vibration and connection.
2. **Awakening & Transformation** — the emotional and spiritual arc the album and campaign invite listeners into.
3. **Light from Darkness** — the core visual and emotional contrast running through every asset.
4. **Unity** — the audience as a collective, not a customer base; a movement, not a fanbase.
5. **Premium Cinematic Craft** — every touchpoint (visual, written, audio) held to a high, deliberate, unhurried standard.

### Key Messages

- The world is shifting, and this album is a signal for those ready to listen.
- Twenty-one tracks function as twenty-one signals within one unified frequency.
- Transformation is offered, not demanded — the audience chooses to awaken.
- Premium craft and sacred symbolism reflect the seriousness and intention behind the work.

### Primary Slogans

- **"The World Is Changing..."**
- **"Can You Feel The Frequency?"**

*(Full usage guidance in `BRAND_BIBLE.md`.)*

### Marketing Objectives

- Establish a distinct, premium visual and verbal identity ahead of the 2 August 2026 release.
- Build anticipation through a symbolic, unhurried campaign rather than urgency-driven promotion.
- Position Patrick Pascal Reerink as an Afrobeat artist operating at a cinematic, conceptual level distinct from typical genre marketing.
- Convert awareness into a release-day moment felt across Spotify, Apple Music, YouTube, and social platforms simultaneously.

---

## Website Structure

The Compass is the umbrella brand/label site; each album, artist, and channel gets its own section so new ones can be added without restructuring the site.

- `index.html`, `site.css`, `site.js` — **The Compass homepage**: brand identity, featured release, roster teaser, and links into every section below.
- `music/index.html` — discography/catalog page. Add future albums here as new cards.
  - `music/the-awakening-code/` — the official Album Guide digital book for *The Awakening Code* (`index.html`, `style.css`, `script.js`) plus `standalone.html`, a single-file self-contained edition.
- `artists/index.html` — artist roster. Add future artists here as new cards.
  - `artists/patrick-pascal-reerink/` — artist profile page (bio, quick facts, current release).
- `news/index.html` — confirmed release milestones and press information (no fabricated coverage/quotes — see `CLAUDE.md` §9).
- `media/index.html` — films, visualizers, behind-the-scenes; placeholder "coming soon" state until assets exist.
- `merch/index.html` — merchandise; placeholder "coming soon" state until products exist.

Each new album gets a folder under `music/`, each new artist a folder under `artists/` — following the same card/page pattern as *The Awakening Code* and Patrick Pascal Reerink.

## Other Project Files

- `BRAND_BIBLE.md` — visual identity, tone of voice, messaging, and thematic guidelines
- `ALBUM.md` — the Master Edition Album Guide source (narrative, philosophy, complete track guide, credits)
- `RELEASE_PLAN.md` — phased release strategy and milestones
- `CONTENT_CALENDAR.md` — scheduled content across channels
- `Facebook/`, `Instagram/`, `TikTok/`, `YouTube/`, `Spotify/`, `Apple Music/` — platform-specific assets and copy
- `Press/` — press kit, bios, media outreach
- `Prompts/` — AI generation prompts (image/video/audio) for brand-consistent content
- `assets/` — final exported creative assets (shared across the whole site — see `assets/README.md` for what's still needed)

## Status

- [x] Project structure created
- [x] Brand Bible
- [x] Marketing Foundation
- [x] Release Plan
- [x] Tracklist (21 titles confirmed)
- [x] Content Calendar
- [x] Platform content (social posts drafted across Facebook, Instagram, TikTok, YouTube, Spotify, Apple Music)
- [x] Official Album Guide digital book (`music/the-awakening-code/index.html` + `standalone.html`)
- [x] The Compass brand website (homepage, music catalog, artist roster, news, media, merch — extensible for future albums/artists)
- [ ] Assets (final image/video production — see `assets/README.md`)
- [ ] Credits, ISRC/UPC, and remaining Press placeholders
