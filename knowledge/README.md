# knowledge/

Shared reference material and knowledge base that AI agents draw on across the studio — facts, glossaries, domain references, and other durable context that isn't tied to a single agent or a single release.

This is distinct from the *Awakening Code*-specific campaign docs at the repo root (`BRAND_BIBLE.md`, `ALBUM.md`, `RELEASE_PLAN.md`, `CONTENT_CALENDAR.md`), which remain the source of record for that campaign. Studio-wide knowledge that multiple agents or future releases need should live here instead.

## Structure

- **`artist/`** — reference facts about the artist(s); unconfirmed facts stay as placeholders, never invented (`CLAUDE.md` §2).
- **`albums/`** — per-album reference knowledge, one subfolder per album:
  - `The Awakening Code/` — the current, confirmed release.
  - `Dakila Vibes/` — a future album; name only, no details confirmed yet.
- **`branding/`** — reference notes on brand identity (palettes, typography, motifs, tone), distinct from the top-level `branding/` infrastructure folder.
- **`prompts/`** — reference notes on prompt conventions/patterns, distinct from the top-level `prompts/` (runnable agent prompt templates) and root `Prompts/` (creative-asset generation prompts).
- **`releases/`** — reusable release-strategy knowledge, distinct from `RELEASE_PLAN.md` (this campaign's specific plan).
- **`social/`** — reference knowledge on platform conventions, distinct from `marketing/` and the existing per-platform content folders.
- **`workflows/`** — knowledge behind how pipelines are designed, distinct from the top-level `workflows/` (the runnable pipelines themselves).

Each subfolder is currently empty except for a README explaining its purpose — content will be added as the studio's knowledge base grows. See `docs/ARCHITECTURE.md` for how this fits into the overall system.
