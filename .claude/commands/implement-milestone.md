---
description: Implement a milestone — implementation.md Phase 3. Stage 1 Merge (flip proposed->active, apply CHG deltas, approved->merged) then Stage 2 Code (write production code), orchestrated per the /execute-plan posture. Run after Phase 2 + /clear.
argument-hint: [milestone id/slug, or FS id to implement]
---

Implement a milestone's approved Feature Specs. Stage 1 (Merge) flips all proposed nodes to active, applies CHG deltas to canonical with matching `index.md` rows re-synced, and flips every consumed CHG from `approved` to `merged`. Stage 2 (Code) writes production code against the now-active nodes. Orchestration follows the `/execute-plan` posture — delegate file I/O to sub-agents, protect main-thread context, verify mutations by diff/grep before marking steps done.

**Milestone / FS scope:** $ARGUMENTS
(If empty, ask which milestone or FS before starting — never begin without a clear scope.)

> **Canonical flow:** load `sdlc/workflow/implementation.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Preconditions before starting: approved FS (`merged: false`), all nodes at `proposed`, all CHGs at `approved`, all `depends_on_specs:` at `merged: true`. Entered after a `/clear` + reload following Phase 2 (`/author-fs`).

**HARD-GATE — Stage 1 → Stage 2 boundary:** do NOT begin Stage 2 (Code) until every Stage 1 (Merge) exit criterion is green — every node `proposed → active`, every CHG delta applied to canonical with matching `index.md` rows re-synced, every CHG `approved → merged`. The flow file owns the full exit checklist.

## Phase & boundaries

Phase 3. Entered after `/clear` (separating from Phase 2). A `/clear` follows on exit into the QA track. Orchestration posture: delegate as described in `/execute-plan` — do not re-distill the dispatch table here; point to it.

## Produces

Active nodes; applied CHG deltas; FS `merged: true` + `merge_sha:`; production code under the component paths named in the FS. The flow file owns artifact-level detail.

## On completion

See `sdlc/workflow/implementation.md` for the exit criteria and completion marker. Hands to the QA track: `/test-plan` (then `/clear` → `/test-suite`).

**Commit discipline (rule 11):** never `git commit` without explicit user authorization, per commit. Authorization for one commit does not carry forward to the next.
