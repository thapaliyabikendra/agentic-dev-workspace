---
applies_when:
  stack: [agnostic]
---

# Pre-Planning Discussion Operation

> Pre-plan discussion — captures architectural decisions surfaced after Phase 1.5
> gate closure and before the `/clear` that opens Phase 2. Outputs are durable
> files that survive the context reset. Part of the workflow defined in
> [`../WORKFLOW.md`](../WORKFLOW.md).

## When to Use

**Use when:** the Phase 1.5 validation gate has closed, the FRS set is validated,
and one or more deferred FRS findings carry high architectural impact on Phase 2
FS authoring. Invoke to lock decisions in a durable file before the context reset.

**Do NOT use when:** Phase 1.5 is still in progress (decisions may change), no
high-impact deferred findings exist (skip — no value-add), or the decision can be
resolved during Phase 2 FS authoring without architectural risk.

**Vs. sibling files:** [`design.md`](design.md) is the FRS flow (Phases 0, 1, 1.5);
[`plan.md`](plan.md) is the FS ingest flow (Phase 2); this operation is an optional
gate between them — it fires inside the design.md session, after Phase 1.5 exits,
before `/clear`. It does not replace either flow.

## Hard rule: file-based output only

Context does not survive `/clear`. Every decision captured in this operation must
land in a durable file — `DISCUSSION-LOG.md` and/or `FS-NNN-CONTEXT.md` — before
the context reset fires. Decisions recorded only in session memory are lost.

## Process Flow

```
FRS set validated → gray-area identification (D-1) → decision capture (D-2)
  → lock decisions (D-3) → emit DISCUSSION-LOG.md (D-4)
  → emit FS-NNN-CONTEXT.md per anticipated FS (D-5) → /clear
```

All output files must be written before `/clear` fires.

## Procedure

### D-1 — Gray-area identification

Walk each FRS's deferred findings (from "Validation findings" section) and each FRS's
"Brownfield impact" section. For each finding or impact item, classify:

- **high-impact-on-FS-architecture** — decision would constrain data model, service
  boundary, integration pattern, or layering. Must be locked before Phase 2 to avoid
  costly mid-FS pivots.
- **resolvable-during-plan** — decision is FS-local, low-impact, or can be made
  incrementally during FS authoring without risk.

Record all items in the "Gray areas identified" table in `DISCUSSION-LOG.md`.

### D-2 — Decision capture

For each item classified `high-impact-on-FS-architecture`, conduct a focused discussion:

- Present the ambiguity clearly.
- List 2–3 genuine resolution paths with trade-offs.
- Capture the chosen path and rationale in DISCUSSION-LOG.md under "Locked decisions".

One decision per entry. Do not bundle multiple architectural choices in one entry.

### D-3 — Lock decisions

Decisions recorded in DISCUSSION-LOG.md bind Phase 2. A decision is locked when it
has a chosen path and a non-blank rationale. Contradicting a locked decision in
Phase 2 requires raising an `OQ-NNN` with `origin: discuss-override` before deviating.

### D-4 — Emit `docs/milestones/M-NN-<slug>/discovery/DISCUSSION-LOG.md`

Create the DISCUSSION-LOG.md from
[`../_templates/DISCUSSION-LOG.md`](../_templates/DISCUSSION-LOG.md). Fill all
sections before `/clear`. Mark `status: active`.

### D-5 — Emit `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/FS-NNN-CONTEXT.md`

For each FS anticipated in Phase 2, emit an `FS-NNN-CONTEXT.md` from
[`../_templates/CONTEXT.md`](../_templates/CONTEXT.md). This also pre-creates the
`specs/FS-NNN-<slug>/` folder structure for Phase 2 ingest.

One CONTEXT.md per anticipated FS. Cite locked decisions by entry number from
DISCUSSION-LOG.md — do not restate the rationale.

## Checklist — discuss exit (before /clear)

- [ ] `DISCUSSION-LOG.md` written to `docs/milestones/M-NN-<slug>/discovery/`.
- [ ] Every high-impact gray-area item appears in "Locked decisions" with a
      non-blank rationale.
- [ ] No "TBD" in locked-decision fields.
- [ ] Every anticipated FS has an `FS-NNN-CONTEXT.md` written to its folder.
- [ ] `DISCUSSION-LOG.md` `status: active`.
- [ ] All decisions are file-based — no decision lives only in session memory.

## Integration

- **Required after:** Phase 1.5 exit — the FRS set must be validated before
  decisions are locked. Do not invoke during an active Phase 1.5 run.
- **Required before:** `/clear` + [`plan.md`](plan.md) load — all file outputs
  must exist before the context reset fires. Phase 2 reads these files at session
  start.
- **Maintenance ops that may fire during this flow:** none — this operation does
  not ingest canonical nodes or fire ADR lifecycle events.
- **Sibling flow files:** [`design.md`](design.md) (hosts this operation's
  session), [`plan.md`](plan.md) (consumes this operation's outputs).
