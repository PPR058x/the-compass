# agents/

Definitions for the specialized AI agents that make up **The Compass AI Operating System** (composition, lyrics, marketing, branding, release strategy, etc.).

This folder is currently a scaffold — no agents are defined yet. As agents are added, each one should live in its own subfolder (e.g. `agents/lyricist/`, `agents/marketing-strategist/`) and document, at minimum:

- **Role** — what the agent is responsible for
- **Inputs** — what it reads (from `knowledge/`, `prompts/`, upstream agent output, etc.)
- **Outputs** — what it produces and where it goes
- **Tools/permissions** — what it's allowed to touch

See `docs/ARCHITECTURE.md` for how agents relate to `knowledge/`, `prompts/`, `workflows/`, and `memory/`.
