---
description: Generate or incrementally update a mock-mode ui prototype from KB nodes (FLW/SCR/ACT) — prototype-generation.md Sub-flows A/B. Scoped, catalog-first, shared-fixture, overwrite-guarded; registers/updates the PROTO-<slug> descriptor. Reverse direction of /create-prototype; raw requirements route through /ba-intake first.
argument-hint: [FLW-NNN ... | SCR-NNN ["plain-language change"] | M-NN (initial gen only) | raw: <brief>]
---

Generate a clickable mock-mode prototype from business-facing KB nodes, or apply a scoped update to an existing one. This is the KB→prototype direction (`/create-prototype` registers an externally-built prototype — the reverse). Anti-regression doctrine is mandatory: one journey/screen scope per pass, catalog-first component reuse, shared per-entity fixtures, overwrite guard on manually-edited files.

**Scope:** $ARGUMENTS
- `FLW-NNN ...` — generate/update the screens of these journeys (Sub-flow A or B).
- `SCR-NNN ["plain-language change"]` — scoped single-screen update (Sub-flow B); with a change description, the SCR node body is updated first (KB before artifact), then the screen regenerates.
- `M-NN` — initial generation of all the milestone's journeys; **blocked** if any screen file already exists (use per-FLW/SCR scopes instead).
- `raw: <brief>` — no nodes yet: run `/ba-intake` (Sub-flow C) first, then Sub-flow A.
(If empty, ask for the scope before starting.)

> **Canonical flow:** load `sdlc/workflow/prototype-generation.md` in full before starting — CLAUDE.md § Hard rules requires the relevant flow file at phase entry. Supporting files on demand: `sdlc/_templates/PROTOTYPE.md` (descriptor), `sdlc/_templates/UI-REPO-CONTRACT.md` → the project copy `ui/docs/PROTOTYPE-API-INTEGRATION.md` (ui conventions — project copy wins). This command sets scope; the flow file governs. If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

**Precondition:** the scoped FLW/SCR nodes exist at `status: proposed` or better (else route through `/ba-intake`). The `ui/` repo must exist with its contract file (`ui/docs/PROTOTYPE-API-INTEGRATION.md`); **without a ui repo**, generation is still legal but targets a static clickable artifact under `docs/prototypes/<slug>/raw/` — say which mode applies before generating.

**HARD-GATE (restate — defense-in-depth):** never regenerate outside the stated scope; never overwrite a manually-edited screen file without surfacing the diff; never inline mock data in a component (shared entity fixtures only); read the component catalog before scaffolding anything new.

## Phase & boundaries

Phase-0/1 (pre-FRS, stable `<Module>.<Area>.<Screen>` file identity) through post-adoption (SCR-keyed; CR-routed). After PROTO adoption the KB nodes — not the descriptor — are the generation source. The Phase-2 back-patch (`@implements` → SCR-NNN, `code_ref:`, screen-index `scr` column) is part of the Phase 2 ingest pass, not this command. Page-by-page; do not batch unrelated journeys in one run.

## Produces

- `PROTO-<slug>` descriptor (new, Sub-flow A) or updated `screens[]` + Stakeholder iteration log rows (Sub-flow B), with the `docs/prototypes/index.md` catalog row.
- Mock screens in `ui/` per the contract: screen file (`@implements`, four display states) + service interface + mock implementation + shared entity fixtures + screen-index entries + catalog rows for new components.
- A `kb:trace` pass (0 broken / 0 dangling) when the ui repo carries the gate.

## On completion

Report the scope generated, catalog reuse vs. new components, and trace result. Next: BA reviews in the browser and iterates (re-invoke with a scoped change), then `/author-frs` for the canonical contract; `draft → adopted` flips at Phase 1.5 exit there. Mock→real wiring per page is `/api-integration` (Phase 3).

**Commit discipline:** commits (workspace or `ui/`) need explicit user authorization, per commit (rule 11).
