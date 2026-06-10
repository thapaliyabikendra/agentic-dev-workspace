---
id: STD-008
title: Engine-level UI component architecture conventions
status: accepted
created: 2026-06-10
updated: 2026-06-10
supersedes: null
superseded_by: null
tags: [ui, component-architecture, state-management, module-isolation, scoped-change, convention]
scope: engine
applies_when:
  stack: [ui]
source: harvested-from-ui-prototype-repo
related_adrs: []
---

# STD-008: Engine-level UI component architecture conventions

> **Engine-level technical standard.** Applies to any UI project under
> this methodology — applicability is declared in `applies_when:
> { stack: [ui] }`. Project-specific deviations are component-scoped
> ADRs that back-link here via `related_standards: [STD-008]`;
> node-local atomic decisions are DECs. See
> [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) for the
> STD / ADR / CCC / DEC discriminator.
>
> **Framework bindings are conditional.** Rules reference state
> stores, hooks, and selectors as *shapes*; a React project binds them
> to hooks + store factories, an Angular project to services + signals/
> observables. The pattern — module isolation, state seam, scoped
> change — is framework-agnostic; the concrete API names are not. The
> project's UI-stack ADR (the one
> [`../_templates/UI-REPO-CONTRACT.md`](../_templates/UI-REPO-CONTRACT.md)
> cites for stack choice) records the binding.

## Scope

Client-side architecture discipline for AI-edited UI codebases: where
architecture rules live, how feature modules isolate, where state
changes land, how changes stay scoped, how new modules are born, and
which "helpful" additions are prohibited. Visual design (tokens,
spacing, audience boundaries) is **not** this standard's scope — that
is the project's UI-GUIDELINES copy
([`../_templates/UI-GUIDELINES.md`](../_templates/UI-GUIDELINES.md)).
The repo-contract mechanics (service seam, fixtures, docblocks,
`kb:trace`) are also not restated here — canonical at
[`../_templates/UI-REPO-CONTRACT.md`](../_templates/UI-REPO-CONTRACT.md).

## Standards

### Rule 1 — Single architecture authority

One project file owns the component-architecture rules (store pattern,
hook/selector conventions, directory layout). Every other doc — agent
context files, onboarding files, per-tool rule mirrors — **points to
it and is prohibited from restating it**. When a duplicate is found,
collapse it to a pointer with a tombstone
([`../workflow/maintenance-discipline.md § Pointer-collapse`](../workflow/maintenance-discipline.md#pointer-collapse--tombstone)).
Each rule in the authority file states its **rationale** alongside the
rule — a rule whose "why" is unstated gets cargo-culted or dropped.

**Scan trigger:** grep agent-context files (`CLAUDE.md`, `AGENTS.md`,
tool-specific rule folders) for restated store/hook/layout rule text —
a hit longer than a pointer line is a violation.

---

### Rule 2 — Feature-module isolation

A change stays inside the feature directory it targets. Cross-feature
private imports are blocked **mechanically** (import-restriction lint
or equivalent); shared pieces go through the shared component layer
(the catalog in `UI-REPO-CONTRACT.md § Component catalog`). Rationale:
*modules are AI-editable one at a time — crossing module boundaries is
how regressions spread.*

**Scan trigger:** the import-restriction lint rule exists in the repo
lint config and is enabled; grep feature directories for imports
resolving into a sibling feature's non-public path.

---

### Rule 3 — State changes touch the state seam, not components

Layout shells carry no state and no handlers — each component pulls
from its own hook/selector against the feature's store (or
framework-equivalent state container). A behavior change therefore
lands in the store; component edits are for rendering changes only.
Rationale: one edit surface per concern keeps AI edits reviewable and
keeps re-render behavior predictable.

**Scan trigger:** grep feature layout-shell files (entry/index
components) for local state declarations and inline handler bodies —
hits are findings.

---

### Rule 4 — Scoped change protocol

One module per change. Before editing: run the repo's spec-anchor loop
(find the screen's `@implements` ID → open the spec node → implement
against its criteria — per `UI-REPO-CONTRACT.md`). After editing: the
trace gate (`kb:trace` or equivalent) is green. New modules are born
from the project scaffold, never hand-assembled — uniformity at birth
is cheaper than lint repair later (mirrors
[`../workflow/prototype-generation.md § Anti-regression doctrine`](../workflow/prototype-generation.md#anti-regression-doctrine)
point 1, which governs generation passes; this rule governs *all* UI
edits).

**Scan trigger:** diff touched paths per change against the declared
target module — files outside it are findings; new module directories
missing scaffold-emitted members (per the scaffold manifest) are
findings.

---

### Rule 5 — Derived state is computed, not effect-synced

Values derivable from existing state are computed synchronously in the
state layer (selectors / derivations), not mirrored into secondary
state via effects. Before reaching for an effect, ask: *can this be
done synchronously in the store?* If yes, prefer that. Rationale:
effect-synced mirrors drift, double-render, and hide the data flow.

**Scan trigger:** grep for effect-hook (or framework-equivalent
subscription) bodies whose only action is writing derived values into
local or store state — hits are findings.

---

### Rule 6 — Prohibitions with rationale

Prohibited unless the project ADR justifies otherwise, because each
adds complexity that looks helpful and pays nothing:

- **Preemptive memoization** of components or callbacks without a
  measured re-render problem — optimization noise that hides the real
  dependency graph.
- **Premature abstraction** — shared helpers/wrappers extracted before
  a second concrete consumer exists.
- **Page-specific state in shared/global locations** — feature state
  lives in the feature module (Rule 2's inverse).
- **Error handling, comments, or abstractions beyond what the task
  requires** in AI-authored edits — scope discipline applies to code
  shape, not just file lists.

**Scan trigger:** grep for memoization wrappers introduced in a change
that cites no measured re-render finding; new shared-layer files with a
single consumer.

## Consequences

- **Phase 2 FS authoring** — an FS whose slice touches UI feature
  modules declares `STD-008` in `standards:`.
- **QA gate** ([`../workflow/qa-gate.md`](../workflow/qa-gate.md)
  STD-conformance dispatch) — the scan triggers above are the check
  list, run verbatim per rule:
  - R1: restated architecture rules in agent-context files → flag.
  - R2: import-restriction lint absent/disabled, or cross-feature
    private import → block.
  - R3: state/handlers in layout shells → flag.
  - R4: touched files outside the declared module → block; scaffold
    members missing on a new module → flag.
  - R5: effect bodies that only mirror derived state → flag.
  - R6: unjustified memoization / single-consumer abstractions → flag.

  Blocking hits halt the flip to `implemented`; flags resolve per
  [`../workflow/qa-gate.md § Handling QA Status`](../workflow/qa-gate.md#handling-qa-status).

## Project-specific deviations

Any deviation from a rule in this standard must be recorded in a
component-scoped ADR that back-links via
`related_standards: [STD-008]`, explaining why the deviation is
justified and what the narrower rule is.

## Revisit if

- The project adopts a framework whose idioms invert a rule's premise
  (e.g. a compiler that auto-memoizes makes Rule 6's first prohibition
  moot) — narrow or retire the affected rule via supersession.
- The UI repo stops being AI-edited — Rules 2/4's one-module-at-a-time
  rationale weakens; re-anchor on human-review economics before
  relaxing.
- A second UI component (multi-frontend project) surfaces conventions
  this standard doesn't cover — grow rules here only if cross-project;
  otherwise project ADR.
