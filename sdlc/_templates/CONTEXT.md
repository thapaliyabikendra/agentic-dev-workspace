---
fs_id: FS-NNN
milestone_id: M-NN-<slug>
produced_by: discuss
status: active
created: YYYY-MM-DD
---

# FS-NNN Context — <FS title>

Per-FS agent briefing produced by [`sdlc/workflow/discuss.md`](../workflow/discuss.md).
Load this file at Phase 2 session start alongside the FRSs — it carries locked
decisions from `DISCUSSION-LOG.md` that bind this FS's architecture choices.

## Domain

2–4 sentences: which domain / component this FS touches; which canonical nodes
are in scope (cite IDs); any component-boundary considerations for this FS.

## Decisions

Locked decisions from DISCUSSION-LOG.md that apply to this FS. Cite by entry
number — do not restate the rationale (it lives in DISCUSSION-LOG.md).

- **Entry 1:** <one-line summary of decision> — see DISCUSSION-LOG.md #1.
- **Entry N:** <one-line summary of decision> — see DISCUSSION-LOG.md #N.

If no locked decisions apply to this FS, state: "No locked decisions from
discuss.md apply to this FS."

## Canonical refs

Explicit list of node IDs and ADR IDs that Phase 2 must load before drafting
this FS. Derived from the FRS `touches_nodes`, `produces_nodes`, and `adrs:`
fields — listed here so the Phase 2 session can verify its context load.

**Nodes (touches):**
- NODE-NNN — <one-line reason it's in scope>

**Nodes (produces):**
- NODE-NNN — <one-line description of intended new node>

**ADRs:**
- ADR-NNN — <one-line reason it's relevant>

## Code context

Optional. Brownfield module / area references when this FS extends existing code.
Reference by logical name (e.g., `Domain.WatchlistManagement`) — do not paste code.
Omit when the FS introduces only new nodes with no existing-code surface.

## Specifics

FS-specific constraints, edge cases, or implementation notes surfaced during
discuss.md that don't fit cleanly in the FRS but must not be lost at `/clear`.

- <constraint or edge case>

## Deferred

Items deferred to Phase 2 or Phase 3 with target phase noted.

| Item | Target phase | Notes |
| ---- | ------------ | ----- |
| <decision or question> | Phase 2 \| Phase 3 | <brief note> |
