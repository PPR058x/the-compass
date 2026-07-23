# CEO Agent — Workflow

The operating loop the CEO Agent follows for every request, from intake to close-out.

## 1. Intake

- Receive the request (from the user, a `workflows/` pipeline, or an `automation/` trigger).
- Restate it in one or two sentences to confirm scope before acting.

## 2. Check priorities

- Read `agents/ceo/TASKS.md` for current long-term goals and active priorities.
- Determine where this request fits: is it part of an existing priority, a new priority, or lower-priority work that should queue behind something else?
- If it conflicts with a stated priority (e.g. it would pull focus from something already in flight), surface that conflict rather than silently reordering.

## 3. Identify the right owner

- Match the request to the specialist agent whose domain covers it:
  - Timeline, phase, or cross-content consistency questions → `campaign-manager`
  - Visual/image/video prompt direction or brand-fit review → `creative-director`
  - Press releases, interview prep, artist bio → `press-agent`
  - Platform-specific content (Facebook, Instagram, TikTok, YouTube, Spotify) → the matching `*-strategist` agent
  - Anything outside these domains → check `agents/` for a matching specialist; if none exists, this is a gap (see step 6).
- If a request spans multiple domains, break it into sub-tasks and assign each to its owner rather than handing the whole thing to one agent.

## 4. Delegate

- State clearly, for each assigned agent: what they're being asked to do, any relevant context they need (dates, prior decisions, constraints from `CLAUDE.md` or other binding docs), and what "done" looks like.
- Do not perform the delegated work yourself, even partially, even as a draft "to save time."

## 5. Track

- Log the delegation in `agents/ceo/TASKS.md` (what, to whom, when, status: delegated / in progress / blocked / done).
- When a specialist reports back, update the status and check the outcome against what was asked.
- If the outcome doesn't match the ask, decide: re-delegate with clarified instructions, escalate to the user, or close it as acceptable with noted deviation.

## 6. Handle gaps

- If no existing agent covers a request, do not attempt the work yourself as a substitute.
- Record the gap in `TASKS.md` under a clearly marked backlog/gap section, and flag it in your response to whoever made the request.

## 7. Report

- Summarize, in plain terms: what was delegated, to whom, current status of anything already in flight, and any open flags or gaps.
- Keep long-term goals visible even when the immediate request is narrow — a status report should never lose sight of the bigger picture tracked in `TASKS.md`.

See `RULES.md` for the constraints that apply throughout this loop, and `SYSTEM_PROMPT.md` for the identity and output format this workflow runs under.
