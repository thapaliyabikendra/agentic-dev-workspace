---
name: qa-gate
description: "Use after test-suite-codegen has emitted its generation report and Stage 2 Code is complete — third and final flow of the QA track. Runs the QA verification checklist, ADR-conformance check, code-quality gates, and flips the FS to implemented. Shares session with test-suite-codegen (back-to-back; inherits codegen context) — no `/clear` between them."
applies_when:
  stack: [agnostic]
---

# QA Gate

QA gate is the **third and final flow of the QA track**. It verifies the generated test specs against
the FS's Flow scenarios and acceptance criteria, runs the ADR-conformance check, and flips
the FS to `implemented` once all gates pass. **Shares session with
[`test-suite-codegen.md`](test-suite-codegen.md)** — runs back-to-back on the
selector-resolved + spec-emitted context; no `/clear` between them. Logical
dependency on `implementation.md` Stage 2 Code completion stays (the FS-to-implemented
flip is meaningless without code); the test-suite-codegen → qa-gate boundary is now
session-shared per CLAUDE.md Rule 5.

Solo doesn't mean QA is skipped — it means the QA hat is the same human at a deliberate
moment.

---

## When to Use

**Use when:** `test-suite-codegen.md` has completed and emitted its generation report —
all spec files are written and all remaining TODOs are surfaced.

**Do NOT use when:** Stage 2 Code is incomplete, or `test-suite-codegen.md` has not yet
run (load those files first).

**Vs. sibling flows:** [`implementation.md`](implementation.md) (dev track) does Stage 1 Merge + Stage 2 Code; [`test-plan-ingest.md`](test-plan-ingest.md) (QA track flow 1) authors TCs; [`test-suite-codegen.md`](test-suite-codegen.md) (QA track flow 2) generates executable specs; this file (QA track flow 3) runs the gate and flips statuses.

---

## QA Verification Checklist

> **Session-share does NOT relax verification independence.** The gate
> re-reads FS / FRS / ADRs / STDs / CCCs from disk as if from a fresh
> session — codegen-side reads do not substitute. The /clear was dropped
> for token economy on back-to-back runs, not to soften the gate.

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
- **STD-conformance check** — parallel inline `Agent(subagent_type=Explore, ...)`
  dispatch covering every STD declared in the FS's `standards:` whose
  `applies_when.stack:` intersects the FS's `stack:`, plus every STD tagged
  `convention` / `code-quality` / `task-ordering` from `sdlc/standards/index.md`.
  Returns the same 3-block contract. **Dispatch contract — scans, not
  judgment.** For each in-scope STD, the subagent's check list IS the STD's
  `## Consequences` section (or the equivalently named enforcement section),
  run verbatim — the subagent does NOT re-derive rules from body prose. An
  in-scope STD whose Consequences subsection is prose-only (no concrete scan
  triggers — file globs, grep patterns, or named structural checks) returns
  `NEEDS_CONTEXT`; the cure is to sharpen the STD, not to invent checks at
  QA-gate time. Code conforms to every `accepted` STD's rules; deviations
  either fixed in code, captured in a project-scoped ADR back-linked to the
  STD via `related_adrs:`, or flagged as a finding before the flip. Same
  outcome routing as ADR-conformance (DONE / DONE_WITH_CONCERNS /
  NEEDS_CONTEXT / BLOCKED).
- **CCC-deviation check** — parallel inline `Agent(subagent_type=Explore, ...)`
  dispatch covering every CCC declared in the FS's `ccc:`. For each CCC, verify
  the implementation honors the Baseline default UNLESS the FS's `adrs:` carries
  an ADR with `related: [CCC-NNN]` declaring the operation-specific deviation.
  A silent override of a CCC default is a finding; resolution is to either back
  out the override in code, or author/file the back-linking ADR before the flip.
  Same 3-block contract and outcome routing.
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
[`agent-contracts.md → Contract Layer 1`](agent-contracts.md#contract-layer-1--subagent-dispatch-return-shape).

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
- Every CHG node in the FS's `consumes_chgs:` (or `changes:` for
  pre-cutover FSs — grandfathered) → `status: merged`.
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

- **Triggered after:** [`test-suite-codegen.md`](test-suite-codegen.md) emits its generation report.
  **Shares session with `test-suite-codegen.md`** (back-to-back; no `/clear` between them, per
  CLAUDE.md Rule 5). The logical dependency on `implementation.md` Stage 2 Code completion
  is preserved through codegen's own entry contract.
- **Required before:** [`agent-contracts.md → Contract Layer 1`](agent-contracts.md#contract-layer-1--subagent-dispatch-return-shape)
  — the ADR-conformance check dispatch contract lives there.
- **Maintenance ops that may fire:**
  [`authoring-adr.md`](authoring-adr.md) (QA gate surfaces an ADR deviation requiring
  supersession),
  [`derived-reports.md`](derived-reports.md) (regenerate after the FS flips to `implemented`).
- **Routes to (after FS flips to `implemented`):** user-review handoff;
  [`close-milestone.md`](close-milestone.md) if every spec in the milestone is merged;
  optionally [`verify.md`](verify.md) for structured UAT.
- **Sibling flow files:** [`test-plan-ingest.md`](test-plan-ingest.md) and [`test-suite-codegen.md`](test-suite-codegen.md) (QA track flows 1 and 2); [`implementation.md`](implementation.md) (dev track, produces the code this gate verifies).
