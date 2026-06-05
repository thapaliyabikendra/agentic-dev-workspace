<!--
Prototype disposition discipline:
- Routine edit: 1-file touch (just this descriptor).
- Lifecycle event (status → adopted | stale | rejected | dormant):
    2-file touch (this file + docs/prototypes/index.md catalog).
- No log.md for the prototype surface — git history + the index
    status column are the audit trail.
- A prototype is a Phase-0/1 INPUT disposition, NOT a canonical node:
    no `related:` enforcement, no ID counter (slug-based, EXP precedent).
- `stack:`/`framework:` HARD-GATE does NOT bind this descriptor — PROTO
    is not in the STD/ADR/FRS/FS/DEC/CCC enum (CLAUDE.md). `target_stack:`
    below records the reimplementation target as plain provenance, not a
    governed declaration.
- Operation doctrine: sdlc/workflow/prototype-first.md (bidirectional).
- Signal-extraction rule book: sdlc/workflow/frs-prototype-extraction-rules.md.
-->

---
id: PROTO-<slug>             # slug, not a counter (EXP precedent)
title:                      # one-line label (required)
created: YYYY-MM-DD         # required
status: draft               # required: draft | adopted | stale | rejected | dormant

# Provenance — which direction motivated this prototype:
#   empty []        → prototype-sourced: it exists FIRST and seeds a milestone
#   CR / CHG / M-NN → change-driven: a brief existed first; this validates it
motivated_by: []
adopted_into: []            # FRS IDs that consumed this prototype at Phase 1.5 exit

# The verbatim prototype artifact (exempt from stack:/framework: HARD-GATE):
artifact:
  format:                   # e.g. react-spa | figma | wireframe | clickable-html
  path:                     # repo-relative path under this slug's raw/ folder
  size_note:                # human note on size / self-containment
  tech_note:                # build/runtime note (e.g. "React 18 + Babel CDN, no build step")

# Reimplementation target (plain provenance, NOT a governed declaration):
target_stack:
  framework:                # e.g. angular
  version_note:             # e.g. "Angular 20 + ABP Angular v10 + Lepton X (ADR-040)"
  posture:                  # reimplement | port | reference-only

# Screen inventory — stable <Module>.<Area>.<Screen> IDs (see
# frs-prototype-extraction-rules.md § Stable screen identifiers):
screens: []                 # [{id: "<Module>.<Area>.<Screen>", route: "/path", label: "Label"}]
---

# <title>

> A **Prototype** (`PROTO-<slug>`) is a Phase-0/1 input disposition homed at
> `docs/prototypes/`. It is **not** a canonical node and **not** a Survey —
> it is a clickable artifact that either seeds a milestone (prototype-sourced)
> or validates an existing brief (change-driven). Operation doctrine:
> [`../workflow/prototype-first.md`](../workflow/prototype-first.md). Lifecycle:
> `draft` (authoring + stakeholder iteration) → `adopted` (consuming FRS reaches
> `approved` at Phase 1.5 exit; cite the FRS in `adopted_into:`) →
> `stale | rejected | dormant`.

## Purpose

<!-- Why this prototype exists; what it lets stakeholders react to. If
     change-driven, name the motivating CR/CHG/milestone. -->

## Screen inventory

<!-- Mirror the `screens:` frontmatter. Mark `[partial]` if detail/edit/
     version routes are not yet enumerated, so it is not mistaken for complete. -->

| Screen ID | Route | Label |
|-----------|-------|-------|
| <Module>.<Area>.<Screen> | /path | Label |

## Stakeholder iteration log

<!-- Dated rows of feedback → revision. The prototype → review → revise loop. -->

| Date | Feedback | Revision |
|------|----------|----------|
|      |          |          |

## Extraction notes

<!-- Signals mined toward FRS candidates; `[inferred from prototype]` items
     and the OQs they raised. Rule book:
     ../workflow/frs-prototype-extraction-rules.md. -->

## Reimplementation notes

<!-- Throwaway-prototype reimplementation guidance: target repo (per the repo
     registry in docs/project.md § Repo layout) + target stack (ADR-040). The
     prototype is a spec of intended shape, not code to be ported verbatim. -->
