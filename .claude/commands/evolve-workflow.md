---
description: Extend the workflow — evolving-the-workflow.md. Coins a new node type, refines or coins a doc template, or defines a new derived-report type — after the three-diamond discriminator (instance horizon, 60% shape coverage, lifecycle distinctness) says coining is justified.
argument-hint: [the artifact shape no existing type covers — and what surfaced it (FRS/FS/absorption/RESEARCH/OQ id)]
---

Extend the SDLC engine itself: coin a node type, refine/coin a template, or define a derived-report type. The discipline is **extend before invent** — and the extension lands in the methodology *before* the artifact that motivates it.

**Shape + trigger:** $ARGUMENTS
(If empty, ask what artifact shape surfaced and where — FRS, FS, absorption pass, RESEARCH-NNN, or OQ-NNN.)

> **Canonical flow:** load `sdlc/workflow/evolving-the-workflow.md` in full before starting —
> CLAUDE.md § Hard rules requires the relevant flow file be loaded at operation entry.
> This command sets scope and names the contract; the flow file governs.
> If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

**HARD-GATE (restate — defense-in-depth):** do NOT coin until the three diamonds have been walked — (1) instance horizon: ≥~3 instances expected across current + next milestone (a single instance files as ADR or DEC via `/author-adr`); (2) shape coverage: if an existing type covers ≥60% of the new shape, **extend that type**, do not coin — for NDFs the walk covers the 16-type catalog PLUS every existing NDF in the component's `node_definitions:` PLUS every shared-promoted NDF (per STD-007); (3) lifecycle distinctness: an almost-fit with the same status vocabulary and index shape is a template refinement, not a new type. Named anti-pattern: "The Motivated Invention."

## Phase & boundaries

Standalone engine-evolution operation — fires from inside any phase or independently. No `/clear` boundary. Edits land in engine files directly (no separate changelog artifact); breaking template changes trigger an audit pass over existing instances per the flow file.

## Produces

Per route — **coin node type:** KB-LAYOUT.md catalog row + `sdlc/_templates/nodes/<TYPE>.md` + lazy per-type `index.md` rule (note: KB-LAYOUT/engine "N-type catalog" count claims must be updated together — engine-lint C5 checks the count against `_templates/nodes/`); **refine template:** in-place edit + instance audit when breaking; **new report type:** `sdlc/_templates/OVERVIEW-<KIND>.md` (or REPORT-<KIND>) + `derived-reports.md` registration; **NDF route:** per `STD-007` + `ndf-edit.md`. New rule history lands per `rule-history.md`.

## On completion

Report the discriminator verdict (coin / extend / drop) with the three diamond answers, every engine file modified, and any instance-audit performed. Run `node sdlc/tools/engine-lint.mjs` and confirm 0 errors before declaring done.

**Commit discipline (HR-COMMIT):** never `git commit` without explicit user authorization, per commit.
