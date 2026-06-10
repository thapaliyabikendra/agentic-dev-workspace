---
description: Register + iterate a UI prototype disposition (PROTO-<slug>) for a milestone — prototype-first.md. Lazy-creates docs/prototypes/<slug>/ from PROTOTYPE.md, copies the verbatim artifact to raw/, seeds the index catalog. Change-driven (milestone/CR in motivated_by) or prototype-sourced (empty). Does NOT author FRSs (that is /author-frs).
argument-hint: [milestone id/slug or CR — plus prototype artifact path or a brief describing the UI surface]
---

Register and stakeholder-iterate a UI prototype as a `PROTO-<slug>` disposition homed at `docs/prototypes/`, then hand it forward to FRS authoring. This is the prototype-first operation: build (or capture) a clickable prototype, drive FRS authoring from it, reimplement later in the UI repo. **Bidirectional** — when invoked *for a milestone/CR* it is the change-driven direction (`motivated_by:` cites that milestone/CR); when no brief exists yet it is prototype-sourced (`motivated_by: []`, the prototype seeds a future milestone). This command owns steps 1–2 of the flow (register → stakeholder iterate); extraction (step 3+) belongs to `/author-frs`. Do NOT author FRSs, FLWs, CHGs, or canonical nodes here.

**Milestone/CR + prototype seed:** $ARGUMENTS
(If empty, ask for the milestone id/slug — or CR — and a prototype artifact path or brief before starting. A bare prototype with no milestone/CR is allowed: it is prototype-sourced, `motivated_by: []`.)

> **Canonical flow:** load `sdlc/workflow/prototype-first.md` in full before starting — CLAUDE.md
> § Hard rules requires the relevant flow file be loaded at phase entry. Supporting
> files load on demand: template `sdlc/_templates/PROTOTYPE.md`; the rule book
> `sdlc/workflow/frs-prototype-extraction-rules.md` is consulted only at extraction
> (by `/author-frs`), not here. This command sets scope and names the contract; the
> flow file governs. If they diverge, the flow file wins — reconcile, don't fork.

---

## Entry gate (HARD-GATE)

Pre-FRS input-disposition utility — no upstream phase gates it. Precondition: a prototype artifact (a path to copy verbatim into `raw/`) **or** a brief specific enough to build/describe one. The disposition home is lazy-created per CLAUDE.md § Project KB — confirm `docs/prototypes/index.md` exists (create from the catalog shape if first prototype).

**HARD-GATE (restate — defense-in-depth):** the engine-prescribed Prototype disposition lives at `docs/prototypes/<slug>/PROTO-<slug>.md` (`BOUNDARY.md § Toolchain assumptions`, repointed 2026-06-05). Do NOT author it under `docs/exploration/` or tag it `tag: prototype` — that is the retired pre-2026-06-05 home (generic Exploration only now lives there).

**Scope boundary:** PROTO descriptors and `PROTOTYPE.md` are **exempt** from the `stack:`/`framework:` frontmatter HARD-GATE (not in the STD/ADR/FRS/FS/DEC/CCC enum). `target_stack:` is plain provenance, not a governed declaration.

## Phase & boundaries

Phase-0 / pre-Phase-1 input disposition. No `/clear` required on entry. The prototype stays `status: draft` throughout this command (authoring + stakeholder iteration). The `draft → adopted` flip is NOT done here — it happens at the Phase 1.5 exit checklist inside `/author-frs`, the moment the consuming FRS reaches `approved` (`adopted_into:` cites that FRS). On completion `/clear` fires at the flow boundary into FRS authoring (CLAUDE.md rule 5); the durable handoff is the `PROTO-<slug>` ID + its on-disk files, not session context.

## Produces

- `docs/prototypes/<slug>/PROTO-<slug>.md` — descriptor from `sdlc/_templates/PROTOTYPE.md` (`status: draft`; `motivated_by:` = the milestone/CR for change-driven, `[]` for prototype-sourced; `artifact{...}`; `target_stack{...}`; `screens[]` with stable `<Module>.<Area>.<Screen>` IDs — mark `[partial]` if detail/edit routes are not yet enumerated).
- `docs/prototypes/<slug>/raw/<artifact>` — the verbatim prototype artifact, copied as-is (note size in the descriptor; commit directly unless genuinely large).
- A catalog row in `docs/prototypes/index.md` (Active table). Lifecycle transitions are a 2-file touch (descriptor + index); routine edits are 1-file.
- Stakeholder iteration log rows in the descriptor for each review → revise round.

The flow file owns the detail of each artifact.

## On completion

Flow has registered `PROTO-<slug>` (`draft`) with its screen inventory and the artifact in `raw/`. Next: `/clear` → `/author-frs <milestone> PROTO-<slug>` — Phase 0/1 then routes on input medium = prototype, consults `sdlc/workflow/frs-prototype-extraction-rules.md`, and cites the prototype via SURVEY `prototype_ref: [PROTO-<slug>]`. The `draft → adopted` flip and `adopted_into:` are set there at Phase 1.5 exit.

Command chain for reference:
`/open-milestone` → [`/create-prototype` → `/clear`] → `/author-frs` →[`/clear`]→ `/author-fs` →[`/clear`]→ `/implement-milestone`
QA track: `/test-plan` →[`/clear`]→ `/test-suite` → `/verify-milestone` → `/close-milestone`
Standalone: `/change-request` · `/bug-fix` · `/api-integration` (cross-repo `ui/` ↔ `api/` + KB)
Reimplementation (React → Angular, ADR-040) is a Phase-3 concern, deferred to the implementation track; it is not produced here.

## Related operations

- `/generate-prototype` — the **reverse direction** (KB→prototype, `sdlc/workflow/prototype-generation.md`): the prototype is generated from FLW/SCR/ACT nodes rather than captured from an external artifact. Same `PROTO-<slug>` identity and disposition home.
- `/ba-intake` — raw BA requirements → draft FLW/SCR/ACT nodes (feeds `/generate-prototype`).

BA-first chain: `/ba-intake` → `/generate-prototype` → stakeholder review → `/author-frs` →[`/clear`]→ `/author-fs` →[`/clear`]→ `/implement-milestone` → `/api-integration`
