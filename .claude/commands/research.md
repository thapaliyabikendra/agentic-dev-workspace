---
description: Research gate — research.md. Resolves blocking-frs open questions via RESEARCH-NNN + Exploration (spike) artifacts before FRS body sections and FLW Scenarios can be authored. Fires inside Phase 1; hands back to FRS authoring in the same session.
argument-hint: [OQ ID(s) to resolve, e.g. OQ-014 OQ-015 — defaults to every blocking-frs OQ from the current per-FRS Survey]
---

Resolve every `blocking-frs` open question through durable resolver artifacts — `RESEARCH-NNN` (external/vendor research, the canonical OQ resolver) and `Exploration` spikes (hypothesis-driven, supporting evidence) — then resume FRS authoring with the OQs flipped to `resolved`.

**OQ scope:** $ARGUMENTS
(If empty, classify the current Survey's OQs per the 4-tier table in the flow file and take every `blocking-frs` one.)

> **Canonical flow:** load `sdlc/workflow/research.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at operation entry.
> This command sets scope and names the contract; the flow file governs.
> If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

**HARD-GATE (restate — defense-in-depth):** do NOT begin unless the per-FRS Survey is authored and ≥1 OQ is classified `blocking-frs`. Do NOT exit until every `blocking-frs` OQ has `status: resolved` with `resolved_by:` pointing at a concrete RESEARCH-NNN — partial resolution is not resolution. A RESEARCH artifact still `raw` (unfilled Canonical-implications table) does not resolve its OQ. Out of scope: free-standing domain research with no OQ context — author an Exploration directly (`sdlc/_templates/EXPLORATION.md`) instead of invoking this gate.

## Phase & boundaries

Phase-1-internal — no `/clear` to enter or exit; sessions 0/1/1.5 keep sharing one conversation. `docs/research/` and `docs/exploration/` live outside the milestone path. The Phase 1.5 → Phase 2 `/clear` boundary is unchanged.

## Produces

`docs/research/RESEARCH-NNN-<slug>.md` with `resolves: [OQ-NNN, …]` (3-file touch: file + `research/index.md` + `research/log.md` — research is a surviving log.md surface); optional `docs/exploration/EXP-<slug>.md` spikes (`hypothesis:` / `outcome:` frontmatter, Verdict section); OQ flips (`status: resolved`, `resolved_by: RESEARCH-NNN`, OQ-index row move — 2-file touch); any architectural commitment routes to `/author-adr`, never absorbed into the RESEARCH body.

## On completion

Report every OQ closed (ID → resolver artifact), every artifact created, and any ADRs spawned. Confirm zero `blocking-frs` OQs remain open, then hand back to FRS authoring (design.md Phase 1 step 3).

**Commit discipline (HR-COMMIT):** never `git commit` without explicit user authorization, per commit.
