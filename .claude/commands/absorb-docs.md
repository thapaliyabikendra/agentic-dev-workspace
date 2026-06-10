---
description: Absorb a legacy document into the canonical KB — legacy-absorption.md. Classifies a docs-backup/ (or any prior-project) artifact against the signal-to-target map, routes content to nodes/ADRs/CCCs/glossary at status:active, surfaces every conflict before writing. Peer to /absorb-codebase (which reads live code instead of prose).
argument-hint: [path(s) to the legacy doc(s) to absorb]
---

Absorb a legacy document into the canonical wiki by **classifying and routing** — never copying verbatim. The legacy text is a quarry, not an authority: the absorb pass extracts structure and behavior and re-authors against the canonical templates. Signal-to-target map (flow file owns it): architecture/topology → MOD + INT + ADR + glossary; API spec → CMD + QRY + CON + SCR; convention doc → ADR or CCC; integration deep-dive → INT (+ ADR); deployment/infra → MOD + CCC; feature tracker → FRS + milestone status (this is the one FRS-producing row — unlike `/absorb-codebase`, the doc path keeps it).

**Legacy doc(s):** $ARGUMENTS
(If empty, ask which `docs-backup/` file or prior-project artifact to absorb — one doc per pass; never fan out unscoped.)

> **Canonical flow:** load `sdlc/workflow/legacy-absorption.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry.
> `sdlc/workflow/authoring-adr.md` loads when a classified target is an ADR
> (discriminator call routes there); `sdlc/workflow/maintenance-discipline.md` governs
> the 2-file touch on every promoted artifact. This command sets scope and names the
> contract; the flow file governs. If they diverge, the flow file wins — reconcile,
> don't fork.

---

## Entry gate (HARD-GATE)

**HARD-GATE (restate — defense-in-depth):** do NOT write canonical content until the legacy artifact has been classified against the signal-to-target map AND every conflict with an existing canonical node or ADR has been surfaced. The conflict diamond is the **brownfield gate** — existing canonical wins; on contradiction, halt and surface (FRS Brownfield impact / OQ-NNN); silent override is the failure mode this gate exists to prevent. The flow file's named anti-pattern is "The Verbatim Import" — legacy phrasing worth preserving goes in a `> source:` provenance callout, never in the body proper.

**HARD-GATE (restate — defense-in-depth):** if the absorption brings in nodes for a previously-undeclared component, `/new-component` runs FIRST — before any node ingest (CLAUDE.md HARD-GATE).

## Phase & boundaries

Standalone maintenance activity. Dispatch posture: forked Explore subagent (≤ 600-word return contract per the flow file) classifies and surfaces routing; the main session authors canonical and fires the 2-file touch on every promoted artifact. Absorbed nodes land straight at `status: active` — existing reality, no `proposed` stage.

## Produces

Canonical nodes / ADRs / CCCs / glossary terms at `status: active`, each with its 2-file touch; FRS + milestone rows when the source is a feature tracker; OQ-NNN per surfaced conflict; target-side rewrites (repoint stale slugs, grep-empty gate before pass-complete); derived-report regen if applicable; an "absorbed" footer line on the legacy file (legacy retained for audit). The flow file owns the detail.

## On completion

Summarize: artifacts promoted (by type), conflicts halted on, OQs raised, the footer marked. Call `advisor()` before declaring the absorption complete (CLAUDE.md Advisor gate — completing an operation).

**Commit discipline (HR-COMMIT):** never `git commit` without explicit user authorization, per commit.
