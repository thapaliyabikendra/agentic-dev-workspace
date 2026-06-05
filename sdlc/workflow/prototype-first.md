---
applies_when:
  stack: [ui]
---

# Prototype-First Operation

> **Type:** Operation doctrine. The prototype-first practice: build a
> clickable UI prototype, drive FRS authoring from it, then reimplement it
> in the UI repo. **Bidirectional** — it runs whether the prototype exists
> *before* any brief (prototype-sourced) or is *built to validate* a brief
> that already exists (change-driven). Both directions converge on one home
> (`docs/prototypes/`), one identity (`PROTO-<slug>`), one rule book
> ([`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md)),
> and one Phase-1.5 `adopted` flip. `motivated_by:` records which direction
> produced the prototype.

## Two directions

A prototype is an **input medium** (a *prototype-sourced* path), independent
of project posture. Its peer rule book,
[`frs-code-extraction-rules.md`](frs-code-extraction-rules.md), is the
*code-sourced* path: **code-sourced is inherently brownfield (you only have
existing code in brownfield); prototype-sourced is posture-independent.** The
asymmetry is intentional — do not symmetrize it.

| Direction | Provenance | `motivated_by:` | Entry point |
|-----------|------------|-----------------|-------------|
| **prototype → milestone** (prototype-sourced) | The prototype exists *first*, with no prior brief. Stakeholders react to clickable screens before written specs exist. The prototype is the **source** that *seeds* milestone scope + FRS authoring. | empty `[]` (raw idea) | [`design.md` → Phase 0](design.md#phase-0--milestone-scoping) prototype-seeding |
| **milestone/CR → prototype** (change-driven) | A change / CR / milestone brief exists *first*; a prototype is built to **visualize / validate** it before FRS + implementation, then still feeds FRS extraction. | cites the CR / CHG / `M-NN` | [`change-request.md` → CR-0.5](change-request.md) or [`design.md` → Phase 0](design.md#phase-0--milestone-scoping) when a brief already exists |

Both directions run the **same steps** below — they differ only at step 1
(what `motivated_by:` cites) and where they enter.

## When to Use

**Use when** significant new UI surface is in play and stakeholders will
react to clickable screens faster than to prose — either because a prototype
already exists (prototype-sourced) or because a brief warrants visual
validation before specs are written (change-driven).

**Do NOT use when** the change has no meaningful UI surface (route via the
ordinary brief → FRS path), or the input medium is existing application
**source code** rather than a prototype — that is the code-sourced peer,
[`frs-code-extraction-rules.md`](frs-code-extraction-rules.md).

## Trigger & Entry

- **prototype-sourced:** a clickable prototype lands with no prior brief →
  enter at [`design.md` Phase 0](design.md#phase-0--milestone-scoping).
- **change-driven:** a CR / milestone brief is raised for new UI surface →
  enter at [`change-request.md` CR-0.5](change-request.md), which delegates
  here; the same step 1 below records the brief in `motivated_by:`.

## Steps

1. **Register the prototype.** Create `docs/prototypes/<slug>/PROTO-<slug>.md`
   from [`../_templates/PROTOTYPE.md`](../_templates/PROTOTYPE.md) (`status:
   draft`), drop the verbatim artifact under `docs/prototypes/<slug>/raw/`,
   and add a row to [`../../docs/prototypes/index.md`](../../docs/prototypes/index.md).
   Set `motivated_by:` per direction — **empty** for prototype-sourced;
   **cite the CR/CHG/`M-NN`** for change-driven.
2. **Stakeholder iterate.** Run the prototype → review → revise loop; log each
   round in the descriptor's Stakeholder iteration log. The prototype stays
   `draft` throughout.
3. **Seed FRS candidates.** Mine the prototype for FRS candidates per
   [`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md) —
   screen-to-FRS signal mapping, stable `<Module>.<Area>.<Screen>` identifiers,
   and the `[inferred from prototype — confirm with stakeholder]` tagging rule
   on every inferred business-level item.
4. **Phase 1 FRS authoring.** Author each FRS; cite the prototype from the
   milestone SURVEY via `prototype_ref: [PROTO-<slug>]` and carry the stable
   screen identifiers into canonical node `source_ref:` at Phase 2.
5. **Phase 1.5 gate → `adopted`.** When the consuming FRS reaches `approved`
   at the Phase 1.5 exit checklist, flip the prototype `draft → adopted` and
   cite the FRS in `adopted_into:` (2-file touch: descriptor + index).
6. **Phase 2 / Phase 3.** Ingest nodes (Phase 2); write code and flip CHG/node
   lifecycles (Phase 3).
7. **Reimplementation (Phase 3).** Reimplement the throwaway prototype in the
   UI repo — see Reimplementation note below.

## Reimplementation note

The prototype is a **throwaway** spec of intended shape, not code to be ported
verbatim. Reimplement it in the UI repo registered in the component/repo registry
([`../../docs/project.md` § Components](../../docs/project.md#components))
using the project's UI stack (ADR-040). A React-in-browser prototype targeting
an Angular UI is a **React → Angular reimplementation**; reference the registry
and ADR-040 rather than hardcoding a path, so a repo move does not break this
doctrine. *(The UI repo exists on disk but is not yet a registered component —
register it in `§ Components` when the reimplementation milestone opens.)*

## Integration

- **Callers:** [`change-request.md`](change-request.md) (CR-0.5, change-driven
  entry) and [`design.md` Phase 0](design.md#phase-0--milestone-scoping)
  (both directions).
- **Rule book consulted:**
  [`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md)
  (signal extraction + tagging), enforced at Phase 1.5 by
  [`frs-validation-rules.md`](frs-validation-rules.md).
- **Disposition home & classification:**
  [`../BOUNDARY.md § Toolchain assumptions`](../BOUNDARY.md#toolchain-assumptions)
  (engine-prescribed Prototype disposition); catalog at
  [`../../docs/prototypes/index.md`](../../docs/prototypes/index.md);
  template [`../_templates/PROTOTYPE.md`](../_templates/PROTOTYPE.md).
- **Peer:** [`frs-code-extraction-rules.md`](frs-code-extraction-rules.md) —
  the code-sourced path (inherently brownfield), peer to this
  posture-independent prototype-sourced path.
