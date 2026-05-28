---
applies_when:
  stack: [agnostic]
---

# FS QA Verification Checklist

> **Type:** Workflow reference. Sibling to
> [`frs-validation-rules.md`](frs-validation-rules.md) and
> [`coverage-matrix.md`](coverage-matrix.md) — rule books loaded on
> demand by the relevant flow phase.
>
> **Loaded by:** the FS template's `## QA verification` section
> ([`../_templates/FS.md`](../_templates/FS.md)). The FS instance
> renders only a one-line link to this file plus per-instance `[ ]`
> checkboxes that vary by case (e.g., the CHG-vs-pure-addition rows).

## When to Use

**Use when:** an FS is ready to flip from `approved` to `implemented`
at the end of Phase 3 — the QA-hat sweep that verifies every spec
obligation cleared before merge. Loaded on demand, not auto-loaded at
phase entry.

**Do NOT use when:** the artifact is an FRS at Phase 1.5 (use
[`frs-validation-rules.md`](frs-validation-rules.md)) or a TC file
(QA-track ingest cookbook — see
[`test-plan-ingest.md`](test-plan-ingest.md)).

---

## Checklist — gate before flipping FS `implemented`

Solo means QA hat ≠ skipped. Before marking the spec `implemented`,
every row below holds. Where a row does not apply (e.g., the FS is a
pure-addition with no `consumes_chgs:`), mark with `n/a` and note why
in a one-line annotation in the FS body — do not silently skip.

- [ ] Every linked Flow scenario (happy / edge / fault) has been executed.
- [ ] Every FRS acceptance criterion in the Coverage table has passed.
- [ ] TC files exist for every use-case sub-folder declared in the
      FS's `## Test plan` section.
- [ ] Every FRS acceptance criterion traces to at least one TC via the
      TC's `**Traces to:**` line.
- [ ] Every FLW scenario (happy / edge / fault) traces to at least one TC.
- [ ] Test spec files generated under `tests/{test_dir}/<feature>/`
      and run green for every use case with resolved selectors. See
      [`test-runner-cookbook.md`](test-runner-cookbook.md) and
      [`test-suite-codegen.md`](test-suite-codegen.md).
- [ ] Every node in the FS's `new_nodes:` has had its canonical status
      flipped `proposed → active` and the per-type index row's Status
      column re-synced (2-file node touch — see
      [`maintenance-discipline.md`](maintenance-discipline.md)).
- [ ] Every consumed CHG's `modifies[]` entry has been applied to its
      canonical target, with the per-type index row re-synced as needed
      (2-file node touch).
- [ ] Every CHG node listed in `consumes_chgs:` had its status flipped
      `approved → merged` in place at its milestone path (no canonical
      promotion).
- [ ] No silent edits to canonical nodes outside what `new_nodes:` or CHG
      `modifies[]` declared, irrespective of phase.
- [ ] No invented new nodes — every node in `new_nodes:` has a populated
      `source_ref` that traces to a specific FRS acceptance criterion, FRS
      body section (Use case, Business rules, Edge cases), or
      Phase-1-born FLW Scenario. Nodes without a clause to back them are
      removed or promoted to a DEC.
- [ ] No `OQ-NNN` is marked `resolved` without a non-null `resolved_by:`
      pointing at a DEC / ADR / FRS revision / FS revision / CHG /
      RESEARCH doc, and the resolver carries `resolves: [OQ-NNN]`
      reciprocally.
- [ ] `merged: true` and `merge_sha:` set on this FS.

---

## Integration

- **Loaded by:** [`../_templates/FS.md`](../_templates/FS.md) — the
  template's `## QA verification` section renders a one-line link to
  this file rather than embedding the checklist body.
- **Sibling rule books:** [`frs-validation-rules.md`](frs-validation-rules.md),
  [`coverage-matrix.md`](coverage-matrix.md),
  [`frs-code-extraction-rules.md`](frs-code-extraction-rules.md),
  [`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md),
  [`lint.md`](lint.md),
  [`test-data-generation.md`](test-data-generation.md).
- **Required before:** [`maintenance-discipline.md`](maintenance-discipline.md)
  — the canonical 2-file touch the `new_nodes:` and CHG-merged rows
  invoke.
