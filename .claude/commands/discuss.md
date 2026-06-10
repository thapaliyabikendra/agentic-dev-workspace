---
description: Pre-plan discussion — discuss.md. Captures architectural decisions surfaced after Phase 1.5 gate closure, before the /clear that opens Phase 2. Locks them into durable DISCUSSION-LOG.md + FS-NNN-CONTEXT.md files that survive the context reset.
argument-hint: [milestone slug, e.g. M-03-checkout — defaults to the milestone whose Phase 1.5 just closed in this session]
---

Lock high-architectural-impact decisions from the validated FRS set into durable files before this session's `/clear`. Decisions captured here bind Phase 2 FS authoring; contradicting a locked decision later requires an `OQ-NNN` with `origin: discuss-override`.

**Milestone:** $ARGUMENTS
(If empty, use the milestone whose Phase 1.5 gate closed in this session; ask if ambiguous.)

> **Canonical flow:** load `sdlc/workflow/discuss.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at operation entry.
> This command sets scope and names the contract; the flow file governs.
> If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

**Session-internal invoke, NOT a session starter.** Phase 1.5 must have exited in the **current** session — the FRS set validated, the cross-FRS sweep clean. Do NOT invoke while Phase 1.5 is still running (decisions may change), and do NOT invoke when no deferred FRS finding carries high architectural impact (skip — no value-add). The flow file's hard rule: **file-based output only** — a decision recorded only in session memory is lost at `/clear`.

## Phase & boundaries

Optional gate between Phase 1.5 exit and the `/clear` that opens Phase 2. Fires inside the `design.md` session — no `/clear` on entry; every output file must be written **before** the outer `/clear` fires. Invocation triggers (any one suffices): a deferred finding with `gate_effect: blocking`; ≥2 FRSs touching the same canonical node without a locked resolution direction; a Phase-1-authored ADR not yet `accepted`; an unresolved Cross-FRS conflicts row.

## Produces

`docs/milestones/M-NN-<slug>/discovery/DISCUSSION-LOG.md` (from `sdlc/_templates/DISCUSSION-LOG.md`, `status: active` — gray-areas table + one locked decision per entry, no bundling, no TBD); one `FS-NNN-CONTEXT.md` per anticipated Phase 2 FS (from `sdlc/_templates/CONTEXT.md`, citing locked decisions by entry number — pre-creates the `specs/FS-NNN-<slug>/` folders).

## On completion

Report every locked decision (entry number + one line), every CONTEXT.md path written, and confirm the flow file's exit checklist. Then the session proceeds to `/clear` + `/author-fs`.

**Commit discipline (rule 11):** never `git commit` without explicit user authorization, per commit.
