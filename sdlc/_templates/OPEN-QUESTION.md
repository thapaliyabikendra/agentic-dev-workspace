---
id: OQ-NNN
title: <The specific answerable question, not the topic>
status: open                  # open | deferred | resolved
origin: discovery             # discovery | research | frs-authoring | validation-gate | fs-authoring | implementation | legacy-absorption | workflow-evolution
origin_ref: null              # FRS-NNN | FS-NNN | RESEARCH-NNN | DISCOVERY-NNN | "legacy" | "workflow"
needed_by: phase-1            # phase-N | M-NN | <artifact-id> | indefinite
gate_effect: null             # blocking | post-approval — ONLY when origin ∈ {validation-gate, fs-authoring}; null otherwise
nodes: []                     # ENT-NNN, FLW-NNN, ... — nodes the question touches; may be empty for workflow-evolution
related_adrs: []              # ADR-NNN that constrain or context this question
resolved_by: null             # FRS-NNN | FS-NNN | DEC-NNN | ADR-NNN | STD-NNN | CHG-NNN | RESEARCH-NNN — required when status=resolved
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# OQ-NNN: <Title>

> **Title is the specific answerable question, not the topic.** "Does the
> Phase-1 alert pipeline ingest tenant scoping at FLW-115 or upstream?" —
> not "Tenant scoping". The index row should read as a one-sentence
> question.
>
> Choices with a clear default belong as inline DECs, not OQs. OQs are for
> ambiguities with no safe default; if the default is obvious, document
> via a DEC instead. An OQ closed without producing a DEC / ADR /
> FRS revision / FS revision / RESEARCH doc is not closed — link the
> resolving artifact in `resolved_by` or keep the entry open.

## Context

What was observed and where. What artifact (FRS / FS / DISCOVERY /
RESEARCH / legacy text / workflow rule) surfaced the question, and what
constraint or contradiction made it answerable rather than open-ended.

Two short paragraphs. Cite the source artifact and the canonical nodes
or ADRs in tension.

## The question

State the question. Must be specific, answerable by a named role, and
bounded — no fishing expeditions.

- …

## Resolution path

What kind of artifact will close this OQ, and who answers. One of:

- **FRS revision** — the originating FRS or a new FRS revises an
  acceptance criterion
- **DEC** — a node-local atomic decision (inline or standalone) settles
  the ambiguity
- **ADR** — the answer constrains future nodes in this project, not just
  the node(s) in `nodes:`
- **STD** — the answer is engine-level (applies to any project using
  this methodology)
- **CHG** — a Phase 3 change-request node applies the resolution to
  canonical targets
- **RESEARCH doc** — a finalized RESEARCH-NNN with citations is itself
  the answer
Pick one. If two are plausible, name the discriminator that will choose
between them.

## Resolved by

> Filled at close. Leave blank while `status: open` or `deferred`.

- **Artifact**: <ID>
- **Date**: YYYY-MM-DD
- **Summary**: One sentence describing how the resolver answered the
  question. The resolver's frontmatter cites this OQ via
  `resolves: [OQ-NNN]`.
