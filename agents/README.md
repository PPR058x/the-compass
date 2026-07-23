# agents/

Definitions for the specialized AI agents that make up **The Compass AI Operating System** (composition, lyrics, marketing, branding, release strategy, etc.).

Each agent lives in its own subfolder (e.g. `agents/ceo/`, and future agents like `agents/lyricist/`) and documents, at minimum:

- **Role** — what the agent is responsible for
- **Inputs** — what it reads (from `knowledge/`, `prompts/`, upstream agent output, etc.)
- **Outputs** — what it produces and where it goes
- **Tools/permissions** — what it's allowed to touch

## Agents defined so far

- **[`ceo/`](ceo/)** — the CEO Agent: orchestrator for the whole Compass AI Operating System. Coordinates all other agents, delegates work, and tracks studio-wide priorities and long-term goals instead of doing specialist work itself.

See `docs/ARCHITECTURE.md` for how agents relate to `knowledge/`, `prompts/`, `workflows/`, and `memory/`.
