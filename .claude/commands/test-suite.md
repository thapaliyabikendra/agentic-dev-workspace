---
description: Generate executable test suites and run the QA gate — test-suite-codegen.md + qa-gate.md (one flow, two stages, no /clear between). Emits runner spec files from TC plans; the gate re-verifies against FS/FRS/ADR/STD/CCC and flips the FS to implemented.
argument-hint: [FS id or feature scope]
---

Generate executable test suites and run the QA gate for the given FS or feature scope. This command launches two flow files in one session — codegen-stage then gate-stage — with no `/clear` between them. It sets scope, states the entry precondition and verification-independence rule, and names the canonical flows; the flows govern all step sequencing, dispatch shapes, and completion details.

**FS or scope:** $ARGUMENTS
(If empty, ask which FS id or feature scope to target before proceeding.)

> **Canonical flow:** load `sdlc/workflow/test-suite-codegen.md` in full, then
> `sdlc/workflow/qa-gate.md` in full — both in this session, in that order.
> CLAUDE.md § Hard rules requires the relevant flow file be loaded at phase entry.
> This command sets scope and names the contract; the flow files govern. If they
> diverge, the flow files win — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Do NOT begin until ALL of the following are true:

- TC files exist and every `(discovered by explorer)` selector placeholder has been replaced with a concrete selector.
- Stage 2 Code (implementation) is complete.
- FS `test_plan_path:` is set.

`/clear` fires on entry to this command (separating from `test-plan-ingest` / `implementation`). This is the only `/clear` boundary — there is **no `/clear`** between codegen-stage and gate-stage.

## Phase & boundaries

QA track, second step. Entered after `/clear` (separating from `/test-plan`). Codegen-stage and gate-stage share one session; the gate-stage inherits codegen-stage's selector-resolved + spec-emitted context.

**Verification-independence rule (restated for defense-in-depth):** session-share does NOT relax it. The gate re-reads FS / FRS / ADRs / STDs / CCCs from disk; codegen-side reads do not substitute. Gate dispatches parallel `Explore` agents per ADR/STD/CCC; outcome routing: DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED.

## Produces

`tests/<test_dir>/<feature>/<use-case>.spec.ts` (codegen-stage). On gate pass: FS `merged: true` + `merge_sha:` + `status: implemented`; each referenced FRS → `implemented`; each consumed CHG → `merged`. The flow files own all detail.

## On completion

Terminal step of the QA track. Exit per `qa-gate.md` outcome routing. Once the gate has passed for every FS in the milestone, milestone close-out follows: `/verify-milestone` (UAT confirmation — see its entry gate for when it applies) → `/close-milestone`.
