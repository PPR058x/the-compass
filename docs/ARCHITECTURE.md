# The Compass — AI Operating System Architecture

This document describes the foundation being laid for **The Compass AI Operating System**: a studio-wide structure meant to support multiple specialized AI agents working across composition, marketing, branding, and release operations — not just the current *Awakening Code* campaign.

This is a foundation, not a finished system. The folders below are scaffolds; agents, workflows, and content will be added incrementally on top of this structure.

## Relationship to existing content

This repository already contains the live website and the full marketing campaign for *The Awakening Code* (root-level files like `BRAND_BIBLE.md`, `ALBUM.md`, `RELEASE_PLAN.md`, `CONTENT_CALENDAR.md`, `Press/`, the platform folders, `Prompts/`, `assets/`, and the site itself: `index.html`, `style.css`, `script.js`, `standalone.html`). None of that was moved, renamed, or altered to build this structure — the website and campaign remain fully functional exactly as they were. The new folders sit alongside them at the repo root and are additive.

Where a new folder's name or purpose overlaps with something that already exists, the distinction is:

| New folder | Existing counterpart | Distinction |
|---|---|---|
| `prompts/` | `Prompts/` | `Prompts/` = creative-asset generation prompts (image/video/audio) for the campaign. `prompts/` = system/task prompt templates for AI agents themselves. |
| `marketing/` | `CONTENT_CALENDAR.md`, `RELEASE_PLAN.md`, platform folders | Those remain the human-curated, source-of-record campaign for *this* album. `marketing/` is for studio-wide, agent-driven marketing infrastructure spanning future releases. |
| `branding/` | `BRAND_BIBLE.md` | `BRAND_BIBLE.md` remains the source of record for *The Awakening Code*'s identity. `branding/` is for cross-release, studio-wide brand infrastructure. |
| `music/` | — | No existing counterpart; new home for music production assets (compositions, stems, sessions). |

## The core loop

The folders are designed to fit together as a loop an agent-based system runs repeatedly:

```
knowledge/  ──┐
              ├──►  agents/  ──►  workflows/  ──►  output (music/, marketing/, branding/, ...)
prompts/   ──┘                        │
                                       ▼
                                   memory/
```

- **`agents/`** — Defines each specialized agent: its role, inputs, outputs, and permissions. This is the registry of "who" does the work.
- **`knowledge/`** — Shared reference material agents draw on: facts, glossaries, domain context that isn't specific to one agent or one release.
- **`prompts/`** — Reusable system/task prompt templates that instruct agents how to behave for a given job.
- **`workflows/`** — Orchestration: chains multiple agents together into a pipeline toward a larger outcome (e.g. taking a song from draft to a released, marketed asset).
- **`memory/`** — Where agents persist state, decisions, and session history, so subsequent runs have continuity instead of starting cold.
- **`music/`, `marketing/`, `branding/`** — Where the studio's actual creative output lands, organized by domain, separate from any one release's campaign material.
- **`automation/`** — Scheduling, triggers, and integrations that run workflows without manual invocation.
- **`scripts/`** — One-off and supporting utility scripts (setup, build, data processing) used by the above.
- **`tests/`** — Verification for agents, workflows, and scripts as they're built out.
- **`docs/`** — Studio-level documentation (this file, and whatever else the system needs as it grows), separate from the *Awakening Code*-specific docs at the repo root.

## Status

- [x] Folder scaffold created (`agents/`, `knowledge/`, `prompts/`, `workflows/`, `memory/`, `docs/`, `marketing/`, `music/`, `branding/`, `automation/`, `scripts/`, `tests/`)
- [ ] First agent defined in `agents/`
- [ ] First prompt templates in `prompts/`
- [ ] First workflow in `workflows/`
- [ ] Automation/scheduling wired up in `automation/`

Existing campaign content (`CLAUDE.md` and everything it governs) is unaffected by this structure and continues to be the binding source of truth for *The Awakening Code* marketing work.
