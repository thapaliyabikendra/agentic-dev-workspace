---
description: Post-implementation UAT — verify.md. Walks every FRS acceptance criterion in aggregate (confirmed-passing / failed / not-yet-verified), routes gaps to bug-fix or new-FRS, emits durable UAT.md. Confirmation pass, not a second QA gate. Run after Phase 3 QA passed for every FS.
argument-hint: [milestone id/slug]
---

Run the post-implementation verification pass for a milestone. Classifies every FRS acceptance criterion against what Phase 3 QA actually covered, routes each gap (code-only → bug-fix track; requires-design → OQ + new FRS; deferred → recorded), and emits the durable `UAT.md` record. This is **confirmation, not remediation** — the Phase 3 QA checklist is the canonical gate; this pass audits its coverage (flow file's named anti-pattern: "The Second Gate").

**Milestone:** $ARGUMENTS
(If empty, ask which milestone before starting.)

> **Canonical flow:** load `sdlc/workflow/verify.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. This
> command sets scope and names the contract; the flow file governs. If they
> diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Do NOT begin until Phase 3 QA (`qa-gate.md`) has passed for **every** FS in the milestone — verify.md is confirmation, not remediation. The flow file's "Do NOT use when" list also exempts single-FS milestones whose QA walked every criterion exhaustively, and `kind: refactor` / `kind: absorption` milestones (no FRS acceptance criteria) — check before running.

**Posture (restate — defense-in-depth):** read specs and criteria only — do NOT re-read implementation code, re-run tests, or re-open Phase 3. Gaps route to their track; they are not fixed here.

## Phase & boundaries

Post-QA, pre-close. Flow boundary — `/clear` on entry (separating from the QA track). Steps V-1…V-5 are owned by the flow file.

## Produces

`docs/milestones/M-NN-<slug>/UAT.md` (template `sdlc/_templates/UAT.md`; `status: passed | partial | failed`; every FRS criterion in the `## Acceptance criteria status` table — no omissions); optional per-FS `VERIFICATION.md` for each FS with ≥ 1 gap; gap routings (`routing: bug-fix` entries, `OQ-NNN` with `origin: verify` for requires-design gaps). The flow file owns the detail.

## On completion

All criteria confirmed-passing → flow emits `## VERIFICATION PASSED` → next command: `/close-milestone`. `partial` / `failed` → no marker; UAT.md records the state and milestone close becomes an explicit human decision (the close command's entry gate handles the partial-accept path).
