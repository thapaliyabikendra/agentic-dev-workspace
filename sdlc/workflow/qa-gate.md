---
name: qa-gate
description: "Use after test-suite-codegen has emitted its generation report — runs the QA verification checklist, ADR-conformance check, code-quality gates, and flips the FS to implemented. Same Phase 3 session as implementation.md and test-suite-codegen.md — no /clear between them."
---

# QA Gate

QA gate is the third and final part of Phase 3. It verifies the generated test specs against
the FS's Flow scenarios and acceptance criteria, runs the ADR-conformance check, and flips
the FS to `implemented` once all gates pass. It runs in the same Phase 3 session as
[`implementation.md`](implementation.md) and [`test-suite-codegen.md`](test-suite-codegen.md) —
no context reset between them.

Solo doesn't mean QA is skipped — it means the QA hat is the same human at a deliberate
moment.

---

## When to Use

**Use when:** `test-suite-codegen.md` has completed and emitted its generation report —
all spec files are written and all remaining TODOs are surfaced.

**Do NOT use when:** Stage 2 Code is incomplete, or `test-suite-codegen.md` has not yet
run (load those files first).

**Vs. sibling files:** [`implementation.md`](implementation.md) is Stage 1 Merge + Stage 2 Code;
[`test-suite-codegen.md`](test-suite-codegen.md) generates test specs from TC files; this file
runs the QA gate and flips statuses.

---

## QA Verification Checklist

- Every linked Flow scenario mapped to a passing test (runner conventions
  live in the testing-convention ADR once authored; consult the
  project-owned test-runner cookbook for file-path and invocation
  conventions). An executed scenario without a corresponding test does not
  count. "Mapped to a passing test" means: a test file exists at the path
  the cookbook specifies, its corresponding TC's `Traces to:` line includes
  the scenario anchor, and the test runs green.
- Every FRS acceptance criterion verified.
- **ADR-conformance check** — run as a parallel inline
  `Agent(subagent_type=Explore, ...)` dispatch (one per ADR area, or one
  for the FS-declared ADR set + one for the convention-tagged ADR set from
  the index), each returning the 3-block contract
  (`## Findings / ## Risks / ## Open questions`). For outcome routing, see
  [Handling QA Status](#handling-qa-status) below.
  Code conforms to every `accepted` ADR declared in the FS's `adrs:` plus
  convention-tagged ADRs from the index. Lint, formatter, type-checker, and
  project-specific gates (themselves originating from convention ADRs) green.
  Deviations either documented in the FS's "Architecture decisions" with a
  follow-up ADR update or superseding ADR, or fixed before the flip.
- Affected canonical nodes updated to reflect actual implementation.
- No silent canonical edits outside what the FS declared.
- No silent ADR edits — any ADR change goes through the proper authoring /
  supersession procedure in [`authoring-adr.md`](authoring-adr.md).

---

## Code-Quality Gates

The ADR-conformance check above runs the gate checklist declared in your
project's code-quality ADR. Each gate is a yes / no check; any "no"
blocks the flip to `implemented` until resolved or covered by a
superseding ADR. The gates live in the ADR rather than this flow file so
the workflow stays project-agnostic and the gate list evolves where it
belongs.

> **Your project:** Look up the ADR tagged `code-quality` in
> `docs/<component>/adrs/index.md` and note its ID here as a session
> reference. The gate list lives only in that ADR.

Any relaxation of a gate requires authoring an ADR that supersedes the
code-quality ADR — not a quiet exception. See
[`authoring-adr.md`](authoring-adr.md).

---

## Handling QA Status

The ADR-conformance check dispatches parallel
`Agent(subagent_type=Explore, ...)` subagents, each returning the 3-block
contract (`## Findings / ## Risks / ## Open questions`). Contract canonical
home:
[`../WORKFLOW.md → Inline dispatch shape for gates`](../WORKFLOW.md#inline-dispatch-shape-for-gates).

**DONE** → 0 Findings or only Minor — proceed to complete the QA
verification checklist above.

**DONE_WITH_CONCERNS** → ≥ 1 Major Finding — resolve before flipping
FS → `implemented`. Either fix the code, update the canonical node
to match reality (firing the `updated` lifecycle touch), or — if the
deviation is correct and the ADR is wrong — supersede the ADR via
[`authoring-adr.md`](authoring-adr.md) before the flip.

**NEEDS_CONTEXT** → empty return or self-reported "could not
determine" — re-dispatch with explicit added context (named code
paths, narrower ADR scope, the specific tagged convention to check).
Do NOT retry blindly.

**BLOCKED** → ≥ 1 Blocker Finding, or task-shape mismatch (the ADR
check requires judgment a subagent cannot deliver reliably) —
escalate: split into smaller mechanical checks, route to a stronger
model, or hand back to the main session. The FS does not flip to
`implemented` while a Blocker is open.

---

## Status Updates on Completion

Run the user-review handoff before flipping these statuses.

- FS → `merged: true`, `merge_sha: <HEAD sha>`, `status: implemented`.
- Each FRS in the FS's `frs:` → `implemented`.
- Every CHG node in the FS's `changes:` → `status: merged`.
- Milestone → `done` when all its specs are `merged: true` and
  `status: implemented`.

Before flipping milestone status to `done`, optionally run
[`verify.md`](verify.md) for a structured UAT pass. Invoke when
milestone has ≥3 FSs or when Phase 3 QA was tightly scoped; skip for
single-FS milestones where the QA checklist already walked all criteria.

---

## Common Mistakes

**❌ Retrying the QA subagent dispatch without changing inputs after a NEEDS_CONTEXT or BLOCKED return** — identical dispatch returns identical result.
**✅ Re-dispatch with explicit added context (named code paths, narrower ADR scope); or escalate to a stronger model; or split the check into smaller mechanical queries.**

---

## Integration

- **Called from:** [`test-suite-codegen.md`](test-suite-codegen.md) — runs immediately
  after the generation report is emitted. No `/clear` between them; all three Phase 3
  files share one session.
- **Required before:** [`../WORKFLOW.md → Inline dispatch shape for gates`](../WORKFLOW.md#inline-dispatch-shape-for-gates)
  — the ADR-conformance check dispatch contract lives there.
- **Maintenance ops that may fire:**
  [`authoring-adr.md`](authoring-adr.md) (QA gate surfaces an ADR deviation requiring
  supersession),
  [`derived-reports.md`](derived-reports.md) (regenerate after the FS flips to `implemented`).
- **Routes to (after FS flips to `implemented`):** user-review handoff;
  [`close-milestone.md`](close-milestone.md) if every spec in the milestone is merged;
  optionally [`verify.md`](verify.md) for structured UAT.
- **Sibling flow files:** [`implementation.md`](implementation.md) (Stage 1 Merge + Stage 2 Code),
  [`test-suite-codegen.md`](test-suite-codegen.md) (test spec generation).
