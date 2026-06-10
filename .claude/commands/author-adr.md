---
description: Land an architectural commitment — authoring-adr.md. Runs the 5-way discriminator (STD / CCC / ADR / NDF / DEC) first, then files the artifact, wires cross-references (frs_origin/fs_origin, resolves:, supersedes:), and fires the 2-file touch. Works for all three triggers — standalone, from-FRS, from-FS.
argument-hint: [the decision/rule to record — plus origin (FRS/FS/OQ id) if any]
---

Record an architectural commitment in the right governance store. The discriminator runs **before** any authoring: STD (holds for any project) → CCC (project-wide NFR baseline default) → ADR (project-specific cross-cutting commitment, or a deviation from a CCC) → NDF (per-component custom node-type shape) → DEC (node-local, inline by default). Despite the command's name, the output may be any of the five — the discriminator decides, not the invocation.

**Decision (+ origin):** $ARGUMENTS
(If empty, ask what decision needs recording — and whether it surfaced standalone, from an FRS clarification, from an FS architecture section, or as an OQ resolution.)

> **Canonical flow:** load `sdlc/workflow/authoring-adr.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry.
> `sdlc/workflow/maintenance-discipline.md` is wholesale-read during the op (file-set
> per lifecycle event); `sdlc/standards/index.md` loads if the discriminator routes
> upward to a Standard. This command sets scope and names the contract; the flow
> file governs. If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

**HARD-GATE (restate — defense-in-depth):** do NOT author until the 5-way discriminator has been run — and it is not one-time: re-apply on scope-creep (a DEC's `related:` set grows, an inline DEC gets cited by ID, a CCC commitment broadens). The flow file's named anti-pattern is "The Premature ADR" — filing an ADR because the decision *feels* architectural. Prefer the narrowest classification; lift upward only when genuinely re-applicable.

Component routing: single-component → `docs/<component>/adrs/`; spans ≥2 components → `docs/shared/adrs/`. ADR body ≤ 80 lines — overflow rationale belongs in a deeper artifact.

## Phase & boundaries

Maintenance activity, not a phase — fires from inside Phase 0/1/2 or standalone; the Phase 3 QA gate consumes the result. Standalone ADRs author directly as `accepted` once committed-to; FRS/FS-born ADRs flip `proposed → accepted` at the phase-exit user review.

## Produces

The classified artifact + its 2-file touch (artifact + index row; no `log.md` — git history is the audit): `ADR-NNN` from `sdlc/_templates/ADR.md` + `adrs/index.md` row; origin wiring (`frs_origin:`/`fs_origin:` on the ADR, ADR ID in the origin's `adrs:`, FS prose collapsed to a reference); supersession when applicable (`supersedes:`/`superseded_by:` pair, old index row → Superseded, cross-type per the flow file when an ADR supersedes a DEC); OQ closure via `resolves:` (OQ flips `resolved` + `resolved_by:`, discovery-surface touch). STD/CCC/NDF/DEC routings hand to their own homes per the flow file. The flow file owns the detail.

## On completion

Report the discriminator's classification and why, the artifact ID landed, and every cross-reference wired. If the discriminator routed to STD or CCC, name the file it landed in instead — that is a success, not a deflection.

**Commit discipline (rule 11):** never `git commit` without explicit user authorization, per commit.
