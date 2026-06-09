# Standards Log

> Append-only chronological log of engine-level standards lifecycle events.
> Companion to [`index.md`](index.md) — the index is the content-oriented
> catalog; this file is the timeline.
>
> Format, operation vocabulary, and discipline live in
> [`../workflow/maintenance-discipline.md`](../workflow/maintenance-discipline.md).
> The entry prefix is `## [YYYY-MM-DD] <op> | <ID> <title>`. New entries go at
> the **bottom** of the Entries section; the last 5 are visible via
> `grep "^## \[" log.md | tail -5`.

---

## Entries

<!-- Append new entries here. Oldest first; newest at the bottom. -->

## [2026-05-15] updated | Engine — Added PROJECT.md template

Introduced `sdlc/_templates/PROJECT.md` as the canonical project configuration
manifest template. Projects seed `docs/project.md` from this template.

*Note (annotated 2026-05-22): engine-wide change, off-topic for the standards
log; retained for audit trail. Future engine-wide entries that are not standards
lifecycle events should land in a future engine-meta log rather than here.*

## [2026-05-15] created | STD-005 ABP framework coding conventions

Absorbed from `guidelines/abp-guidelines.md`. Covers 9 rules: built-in entity
catalog check (Rule 1), entity base-class declaration with rationale (Rule 2),
DTO audit-level mirroring (Rule 3), query input/output wrappers (Rule 4),
companion entity pattern for ABP built-in extensions (Rule 5), PascalCase
property naming (Rule 6), C# enums for bounded-value fields (Rule 7), no data
annotations on domain entities (Rule 8), and file/folder/type-suffix/DB-object
naming conventions (Rule 9). Status: accepted. Validation hooks fire at Phase
1.5, Phase 2, and Phase 3 merge gate.

## [2026-05-16] rule-history | Engine + STD-005 — applies_when across stack + framework axes

- **Engine — applies_when introduced.** Added `applies_when:` block to
  `_templates/STANDARD.md` and to the standards `index.md` schema (new
  `Applies when` column). STD-001..004 backfilled to `agnostic`; STD-003
  narrowed to `api`; STD-005 narrowed to `abp-net` initially. STD-005's body
  prose claim "applies to any .NET project using ABP" was dropped — the
  applicability now lives in frontmatter only. Companion change to the
  CLAUDE.md Hard rule ("Four governance sources: STD / ADR / CCC / DEC" —
  historical wording; NDF became the fifth governance kind on 2026-05-19,
  see ADR-039 entry below; note added 2026-06-10) and
  to the 4-way discriminator (now 5-way) in
  [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md). Rationale:
  the prior tension where STD-005 was engine-scoped but ABP-conditional had no
  mechanical home; `applies_when:` generalizes to any future conditional
  engine standard without forking the scope axis.

- **STD-005 — applies_when reshaped to stack + framework axes.** `abp-net`
  was not in `BOUNDARY.md § Stack axis` (which enumerates functional roles:
  `api`, `ui`, `test`, `full-stack`, `infra`, `agnostic`). The shape
  `applies_when.stack: [abp-net]` mixed a framework name into the
  functional-role enum. Resolved by splitting applicability across two axes:
  `applies_when.stack: [api]` (functional role) plus
  `applies_when.framework: [abp-net]` (framework binding). Added new
  `Framework axis` section to `BOUNDARY.md`; updated `_templates/STANDARD.md`
  to include the optional `framework:` line and remove `abp-net` from the
  stack enum comment; updated `standards/index.md` Applies-when column
  description to cover both axes; updated the worked example in
  `workflow/authoring-adr.md`. A consuming artifact intersects on both axes
  when both are declared.

## [2026-05-17] plan-consolidated | STD-005 R10-13 + R9.2 amendment + STD-002 promoted to accepted

Source: plan `review-the-implementation-workflow-greedy-popcorn.md` Phase B.

- **STD-005 — Rules 10–13 + Rule 9.2 amendment (errors slot → keys slot).**
  Appended four rules covering ABP service-layer gaps surfaced during the
  FS-004 retrospective. Rule 10: Auto API Controllers are the default HTTP
  exposure; manual controllers require a backing DEC / ADR. Rule 11:
  FLW / QRY / CMD bodies live in `<AggregateName>Manager` (Domain Service)
  returning `ErrorOr<T>`; CON wire surfaces live in
  `<AggregateName>AppService`, which unwraps and translates the error
  branch to `UserFriendlyException`. Rule 12: `OnModelCreating` is
  restricted to `ApplyConfigurationsFromAssembly` + ABP module configs —
  inline `builder.Entity<X>(...)` is prohibited; every entity has its own
  `<AggregateName>Configuration.cs` file. Rule 13: per-module
  `<Module>Consts.cs` holds non-localization numeric / regex constants
  shared between EF Core configurations and FluentValidation validators.
  Rule 9.2 amendment: renamed the
  `Domain.Shared/<Module>/<ModuleName>Errors.cs` slot to
  `Domain.Shared/<Module>/Localization/<Module>Keys.cs` and broadened it
  to hold every localization-key constant (error codes ARE localization
  keys); added a new `<Module>Consts.cs` slot row in the same table.
  Phase 3 merge-gate enforcement extended to cover the new rules.
  STD-002 § ErrorOr, § FluentValidation, § Localization-key constants is the
  framework-agnostic how-to companion. Anchors: CCC-005, CCC-006, CCC-007
  (all accepted as of 2026-05-17).

- **STD-002 — proposed → accepted; ErrorOr / FluentValidation /
  Localization-keys authored.** Promoted STD-002 from `proposed` placeholder
  to `accepted` with three substantive rules:

  - **Rule 1 — ErrorOr Result Pattern.** Domain Manager methods return
    `ErrorOr<T>` and never throw on expected failures; semantic factories
    (`Error.Validation`, `Error.Conflict`, `Error.NotFound`,
    `Error.Forbidden`, `Error.Unexpected`) drive HTTP status mapping at
    the AppService boundary. The `code` argument is a `<Module>Keys`
    constant — error codes ARE localization keys. AppService unwrap
    pattern translates the error branch to `UserFriendlyException`;
    `ErrorOr` never appears in DTOs, controllers, or the wire payload.
    Anchor: CCC-006.
  - **Rule 2 — FluentValidation.** Every input DTO has an
    `AbstractValidator<TDto>` at the
    `Application.Contracts/<Module>/Validators/` slot (STD-005 Rule 9.2),
    auto-discovered by ABP. Numeric / regex arguments read from
    `<Module>Consts.cs` (STD-005 Rule 13); `.WithMessage(...)` reads from
    `_l[<Module>Keys.<Name>]`. Cross-field rules requiring repository
    state live in the Manager as `Error.Validation(...)`. Anchor: CCC-005.
  - **Rule 3 — Localization-key constants.** Per-module
    `<Module>Keys.cs` at `Domain.Shared/<Module>/Localization/` (STD-005
    Rule 9.2 amended slot) holds every localization-key constant, 1:1
    with `en.json` entries. Key naming: `<Module>:<Resource>:<Concern>`.
    Single source of truth for ErrorOr codes and FluentValidation
    messages. Resolution surface: `IStringLocalizer<<Project>Resource>`
    (substitutable on non-ABP projects via the MEL equivalent). Anchor:
    CCC-007.

  `applies_when` narrowed `stack: [agnostic]` → `stack: [api]` because the
  rules collectively bind only to API-shaped projects (the unwrap-to-HTTP
  boundary, validator auto-discovery at HTTP request entry,
  `IStringLocalizer` request-scope). ABP-specific examples
  (`UserFriendlyException`, ABP auto-discovery) are flagged inline as
  conditional bindings rather than narrowed via `framework: [abp-net]` —
  the rules are reusable across non-ABP ASP.NET Core projects with the
  framework equivalent substituted. Async / await naming, DI conventions,
  LINQ vs loop, cancellation-token discipline remain deferred to follow-up
  rules. Tags refreshed (`placeholder` removed).

## [2026-05-17] plan-consolidated | STD-005 R14-17 + STD-006 created + tag norm + implementation.md Stage 0 checkpoint

Source: plan `improve-implement-workflow-output-encapsulated-eagle.md`.

- **STD-005 — Rules 14–17 added.** Added Rule 14 (typed ABP exceptions +
  HTTP status mapping table — prohibits raw `Exception` /
  `ApplicationException`, restricts global exception middleware to ABP's
  `ExceptionHandlingMiddleware`), Rule 15 (Authorization placement and
  grouping — `[Authorize]` on AppService only, never on Domain Managers;
  `<Project>Permissions` constants are the only call-site argument), Rule
  16 (Soft-delete data-filter discipline — manual `IsDeleted` predicates
  prohibited, explicit `IDataFilter.Disable<ISoftDelete>()` is the only
  override path), and Rule 17 (Audit logging via ABP audit module, not
  `ILogger` — structural mirror to STD-006 R6 on the logging-discipline
  side). § Consequences gains four new merge-gate scans
  (R14/R15/R16/R17). Tags bumped: `+exceptions, +authorization,
  +soft-delete, +audit-logging`. Anchors: CCC-002 (R15), CCC-004 (R17),
  CCC-006 (R14), CCC-012 (R16) — all lifted to `accepted` in the same wave.

- **STD-006 created — Engine-level logging conventions.** New engine-level
  standard binding `applies_when: { stack: [api] }` with tag `convention`
  (singular, scanner-aligned). Six rules: R1 — `ILogger<T>` injection
  only (MEL abstraction; `Serilog.ILogger` / static `Log.*` prohibited
  outside the host module); R2 — Per-layer log levels (Domain: none;
  Application: `Information` for significant ops, `Warning` for
  recoverable rule violations; Infrastructure: `Debug` for routine
  queries, `Error` with exception for external/DB failures); R3 —
  Structured logging with named properties (`$"…"` / `string.Format` /
  `+` concatenation inside log calls prohibited); R4 — Never log
  sensitive data (passwords, tokens, OTPs, session IDs, raw card
  numbers, CVVs, `Authorization` headers, full auth-endpoint request
  bodies); R5 — Correlation / tenant / user enrichment via ABP's
  `IAbpSerilogEnricher` (manual push prohibited); R6 — Audit logging
  via ABP audit module, not `ILogger` (logging-discipline mirror to
  STD-005 R17). § Consequences lists six grep-driven merge-gate scans;
  advisory-only flags on R5 (manual push) and R6 (`Audit…` template
  prefix). Companion CCC lifts: CCC-004 / CCC-012 / CCC-013 all moved
  from `proposed` (TBD baselines) to `accepted` with one-paragraph
  baselines pointing at STD-006 + STD-005 R14/R16/R17.

- **STD-005 — tag normalised `conventions` → `convention` (scanner
  alignment).** STD-005's frontmatter tag (and matching
  `sdlc/standards/index.md` row's Tags cell) was `conventions` (plural);
  the convention-autoload fallback declared in
  `sdlc/workflow/implementation.md:231,389`, `sdlc/workflow/plan.md:236`,
  `sdlc/workflow/retrieval-discipline.md:229`, and
  `sdlc/workflow/qa-gate.md:120` reads `convention` (singular). Every FS
  to date (FS-001..004) declared STD-005 explicitly in `standards:`, so
  the fallback had been dead code for STD-005 — observable impact zero.
  Renamed both occurrences to singular to make the fallback work as
  documented and to match STD-006 (which was authored against the
  singular form). No body changes; no rule semantics changed.

- **Engine — implementation.md Stage 0 load-completeness checkpoint.**
  Stage 0 retrieval-evidence emission (`sdlc/workflow/implementation.md`)
  gained a load-completeness checkpoint: the convention / task-ordering
  / code-quality slots must be enumerated from
  `sdlc/standards/index.md` + `docs/<component>/adrs/index.md`, not
  derived from the FS frontmatter alone. Motivation: the FS-004 session
  silently coded against an out-of-date STD-005 because the
  convention-tagged set was never enumerated. Paired with the STD-005
  tag normalisation above so the autoload fallback works as documented.

## [2026-05-17] updated | STD-005 — Rule 15 cross-ref to PERM authoring threshold

Appended a one-sentence cross-reference at the end of Rule 15 pointing
at `sdlc/_templates/nodes/PERMISSION.md` for the PERM authoring
threshold (when to inline a permission claim on the actor vs. promote
to a PERM node). Paired with a new hard anti-rule in the PERMISSION
template immediately under the existing promotion-threshold blockquote:
a PERM whose guard reduces to the CCC-002 baseline
(`CurrentUser.IsAuthenticated`) MUST NOT be created — the permission
name lives in `<Project>Permissions.cs` per STD-005 R15 and the claim
belongs inline on the actor's `Permissions:` bullet. Promotion to PERM
is reserved for guards that add content beyond the baseline (ownership /
tenancy / state predicates, attribute combinations, or the same
non-trivial expression cited from multiple commands). Existing
PERM-001..003 are not retrofitted (CLAUDE.md rule 4). No rule
renumbering; no merge-gate change; `standards/index.md` schema
unchanged. Source: plan `is-perm-nodes-overkill-expressive-brooks.md`.

## [2026-05-17] rule-history | Engine — log squashed under per-plan consolidation policy

`maintenance-discipline.md § Append-only` amended: one entry per plan
execution (not one per rule change), with a retroactive consolidation
carve-out. Op vocabulary gained `plan-consolidated`. Log-entry format
section now describes single-line vs. multi-line shapes. Applied the
carve-out to this log in the same operation:

- Dropped 4 placeholder `created` entries (2026-05-13: STD-001, STD-002,
  STD-003, STD-004). STD-002's substantive history is captured in the
  2026-05-17 promotion sub-bullet above; the others will get a real
  `created` or `updated` entry when populated.
- Squashed the 2026-05-16 framework-axis pair (`Engine — applies_when`
  + `STD-005 — stack + framework axes`) into one `rule-history` entry.
- Squashed the 2026-05-17 `review-the-implementation-workflow-greedy-popcorn.md`
  pair (`STD-005 R10-13 + R9.2` + `STD-002 promotion`) into one
  `plan-consolidated` entry.
- Squashed the 2026-05-17 `improve-implement-workflow-output-encapsulated-eagle.md`
  quartet (`STD-005 R14-17` + `STD-006 created` + `tag norm` +
  `implementation.md Stage 0`) into one `plan-consolidated` entry.

Net: 14 → 7 entries. Absorbed bodies preserved verbatim inside the
absorbing entries — no information loss.

## [2026-05-17] plan-consolidated | STD-002 R4 + R5 + R2.5 enforcement; STD-005 R11 IQueryable cross-ref; file rename

Source: plan `abp-standards-is-not-cheerful-nebula.md` (Phase A).
Diagnosis surfaced by the PatientPortal slice code review — three rule
gaps STD-002/STD-005 did not yet enforce.

- **STD-002 — Rule 4 added: Repository query discipline (`IQueryable`
  + `WhereIf`).** Manager / repository code that filters, orders, or
  paginates rows composes the query server-side via
  `await _repo.GetQueryableAsync()` → `.WhereIf(...)` → `.OrderBy(...)`
  → `.PageBy(input)` → `AsyncExecuter.ToListAsync` /
  `LongCountAsync`. `GetListAsync(predicate)` is prohibited when the
  predicate is conditional, the result is paginated, or the row count
  is unbounded; bounded lookup tables may use `GetListAsync()` with a
  `// bounded:` row-count budget comment. Materialise-then-test
  patterns collapse to repository `*Async` short-cuts
  (`AnyAsync` / `CountAsync` / `FirstOrDefaultAsync`). Phase 3
  merge-gate scan: `\.GetListAsync\(<predicate>\)` followed by
  `.Skip` / `.Take` / `.Where` / `.OrderBy` / `.Any` / `.Count` on the
  materialised result. ABP-conditional binding: `WhereIf` / `PageBy` /
  `GetQueryableAsync` are ABP extensions; non-ABP projects substitute
  the equivalent.

- **STD-002 — Rule 5 added: Aggregate-root encapsulation
  (builder-style mutation).** Every property on an `AggregateRoot` /
  `Entity` / owned-type is `{ get; private set; }` or `{ get; init; }`.
  Mutation goes through named methods on the aggregate
  (`TimeSlot.Book(Guid)`, `Department.Activate()`,
  `DoctorSchedule.AddWorkingHours(...)`) that enforce invariants and
  return `ErrorOr<Success>` when failure is possible. Collection
  properties expose `IReadOnlyCollection<T>` / `IReadOnlyList<T>`;
  the backing field stays private and is wired via
  `SetPropertyAccessMode(PropertyAccessMode.Field)`. The
  parameterless constructor stays private for EF Core
  materialisation; public constructors carry every invariant.
  Direct `entity.Property = value` from outside the aggregate is
  prohibited in `Managers/`, `AppServices/`, `Controllers/`,
  `DataSeedContributors/`. Phase 3 merge-gate scan: public setters on
  domain types; external property assignment to a domain-entity
  reference. Anchor: future STD-001 (DDD standards placeholder) — the
  rule lands in STD-002 until STD-001 is authored, then migrates.

- **STD-002 — Rule 2.5 added: mandatory-validator enforcement.**
  Existing Rule 2 already required validators; 2.5 closes the
  merge-gate gap by enumerating input-DTO surfaces by name
  (`Create…Dto`, `Update…Dto`, `Book…Dto`, `Cancel…Dto`,
  `Approve…Dto`, `Reject…Dto`, `Submit…Dto`, `Assign…Dto`,
  `…ListDto`) and requiring a matching
  `<DtoName>Validator.cs` at the STD-005 R9.2 slot. Output DTOs
  (`<Aggregate>Dto`, `…SummaryDto`, `…DetailDto`) are exempt. Field-
  level `[Required]` / `[StringLength]` / `[RegularExpression]`
  annotations are acceptable in addition to but not in place of the
  validator. Landed inside Rule 2 (not a new top-level rule) to avoid
  parallel rule paths covering the same surface.

- **STD-005 — Rule 11 cross-refs STD-002 R4 + R5.** Patched the
  "Managers carry the body" paragraph: QRY bodies that filter / order
  / paginate use `IQueryable` composition (STD-002 R4); aggregate
  mutation from inside the Manager uses the aggregate's named methods
  (STD-002 R5), never direct property assignment. No rule
  renumbering; merge-gate enforcement table inherits the new STD-002
  scans by reference.

- **File rename.** `sdlc/standards/dotnet-conventions.md` →
  `sdlc/standards/STD-002-dotnet-coding-conventions.md` to match the
  `STD-NNN-<slug>.md` filename convention already used by STD-005 and
  STD-006. Cross-references updated in `sdlc/standards/index.md`
  (the only file that named the old path).

- **Frontmatter / index.md.** STD-002 `updated: 2026-05-17`; tags
  gained `repository-query, encapsulation`; rule count in the index
  row bumped `3 rules → 5 rules`. STD-002 `applies_when` unchanged
  (`stack: [api]`).

## [2026-05-19] plan-consolidated | ADR-039 NDF rollout — STD-004 NDF analog paragraph + 9 engine-file extensions + 2 HARD-GATEs

Source: plan `validate-or-refine-the-warm-yeti.md` (Stage 6 execution
of the NDF-introduction plan). Stage 1 landings (`sdlc/_templates/NDF.md`,
`docs/shared/adrs/ADR-039`, 5-way discriminator in
`sdlc/workflow/authoring-adr.md`) are verified intact; this entry
covers the Stage 6 engine-file diffs only.

- **STD-004 — NDF as per-component analog paragraph + bidirectional
  escalation (NDF ↔ STD-004) + filename rename (D2 applied).** Appended
  two paragraphs to the `## Standards` body of
  `sdlc/standards/STD-004-node-definitions.md` (renamed in the same
  atomic operation from `sdlc/standards/node-definitions.md` per D2
  user authorization at Stage 6 close — consistency with STD-002 /
  STD-005 / STD-006 filename convention). Paragraph 1 explains NDF
  (per ADR-039) is the operative per-component path that fires now
  while STD-004 remains deferred for cross-project contracts.
  Paragraph 2 records the bidirectional escalation rule — when an
  NDF's contract surfaces a generalization that should apply across
  projects, STD-004 absorbs it per the file's own `## Revisit if`
  clause; the NDF remains as the per-component instance, STD-004
  holds the cross-project contract. STD-004 stays `status: deferred`;
  `sdlc/standards/index.md` row re-synced — link target changed to
  `STD-004-node-definitions.md`, Status drift fixed `proposed →
  deferred`, Tags drift fixed `placeholder → deferred`, title
  parenthetical refreshed to cite NDF as the per-component analog.
  Pre-existing status / tags drift was discovered during the
  defense-in-depth audit and folded into this atomic operation.
  `git mv` used for the rename to preserve history.

- **Engine file extensions — 9 files updated for ADR-039.** Wiring
  passes anchored by ADR-039:
  - `sdlc/_templates/COMPONENT.md` — `node_definitions: []` frontmatter
    field added; `## Node definitions` body section added after
    `## Depends on`.
  - `sdlc/_templates/FRS.md` — `produces_nodes:` and `touches_nodes:`
    field comments extended to cover NDF-declared custom-type
    abbreviations; Phase 2 type-validity HARD-GATE referenced.
  - `sdlc/KB-LAYOUT.md` — engine-default 15-type catalog note added
    after the lazy-folders paragraph; new `## Node definitions
    (per-component custom types)` section added with per-component +
    cross-component-promotion folder trees.
  - `sdlc/WORKFLOW.md` — FRS-flow narrative extended (line 33-34 in the
    Overview paragraph; corrected from input plan's 35-37 — see E1);
    `### Validation gates` subsection gained both HARD-GATE
    defense-in-depth restatements.
  - `sdlc/workflow/plan.md` — five edits: (1) Phase 2 ingest paragraph
    extended; (2) ID-ceiling table gained NDF + NDF-declared-instance
    rows; (3) `(a) New Phase-2-born nodes` paragraph extended; (4) new
    Phase 2 type-validity `<HARD-GATE>` callout (canonical home);
    (5) `## 6. FS validation loop` checklist gained type-validity row.
  - `sdlc/workflow/new-component-bootstrap.md` — three edits: Step 1
    COMPONENT.md authoring instruction gained `node_definitions:` field;
    Phase 2 trigger description extended; Component bootstrap checklist
    gained `node_definitions:` populated row. Lines 109-117 dropped per
    E9 (prefix-schema block, not a type catalog).
  - `sdlc/workflow/evolving-the-workflow.md` — three edits: anti-pattern
    body fixed 13→15 drift (per E3); discriminator step 2 fixed 13→15
    drift + extended to walk NDFs; top HARD-GATE block extended to
    apply equally to NDF coining.
  - `sdlc/workflow/maintenance-discipline.md` — new `## Files to touch
    on an NDF edit` section added after `## Files to touch on a CCC
    edit`, before `## Cross-reference guard at edit time`. Section
    carries both HARD-GATE defense-in-depth restatements.
  - `docs/home.md` — IDs convention list gained NDF-NNN (unqualified
    for shared promotions) and `{PREFIX}-NDF-NNN` (per-component).

- **Two top-of-tree HARD-GATEs landed per CLAUDE.md Rule 12
  (Output style — framework HARD-GATE defense-in-depth exception).** Wording identical at each landing site (only
  relative-link paths differ). Canonical home is single per gate;
  restatements at ≥2 additional files.
  - **HARD-GATE — NDF shape-coverage walk required.** Canonical home:
    `sdlc/workflow/evolving-the-workflow.md` (top HARD-GATE block
    extension). Restatements: `sdlc/WORKFLOW.md § Validation gates`,
    `sdlc/workflow/maintenance-discipline.md § Files to touch on an
    NDF edit`.
  - **HARD-GATE — Phase 2 type-validity check.** Canonical home:
    `sdlc/workflow/plan.md` (new top-of-file `<HARD-GATE>` callout
    naming itself as the canonical enforcement home). Restatements:
    `sdlc/WORKFLOW.md § Validation gates`,
    `sdlc/workflow/maintenance-discipline.md § Files to touch on an
    NDF edit`.

- **Errata applied (corrections to the input plan, captured in
  `docs/exploration/EXP-NDF-engine-diffs.md` § E).** E1 WORKFLOW.md
  line range 35-37 → 33-34; E2 STD-004 path
  `STD-004-node-definitions.md` → `node-definitions.md`; E3 engine
  type-count drift 13 → 15 fixed at both occurrences in
  `evolving-the-workflow.md`; E9 new-component-bootstrap.md lines
  109-117 confirmed as prefix-schema (no diff); plus a
  validation-discovered missing field on `COMPONENT.md` template
  (`node_definitions:`) added in the same pass.

- **EXP-NDF-engine-diffs.md status flip.** `status: proposed →
  applied`; the file remains as Stage-6 audit trail.

## [2026-05-20] updated | STD-001/003 renamed + STD-001..006 deferred-CCC pass

- **STD-001/003 filename + frontmatter conformance.** Renamed
  `ddd-standards.md` → `STD-001-ddd-standards.md` and
  `api-design.md` → `STD-003-api-design.md` to match the
  `STD-NNN-<slug>.md` convention used by STD-002/004/005/006. Added
  `deferred_until:` (STD-001: first FRS touches the domain layer;
  STD-003: first FRS touches an HTTP boundary) and `operative_source:`
  frontmatter — pattern from STD-004. `status: proposed` retained
  (placeholder posture, not the `status: deferred` STD-004 uses).
  Index rows updated to point at the new filenames.

- **STD-002/005/006 inline CCC-deferral annotations.** Added a one-line
  italic `*(`deferred_until` — project bootstrap creates this CCC at
  `docs/shared/ccc/`; engine cite is a forward reference until then.)*`
  immediately below each formal `**Anchor:**` block citing
  CCC-004/005/006/007. Six insertions: STD-002 R1 (CCC-006), R2
  (CCC-005), R3 (CCC-007); STD-005 R14 (CCC-006), R17 (CCC-004); STD-006
  R6 (CCC-004). Preserves forward-reference semantics until project
  bootstrap lazy-creates the cited CCCs.

## [2026-05-22] plan-consolidated | STD-002/005/006 layer tags + by-layer pointer files + workflow wiring

Source: plan `can-you-review-the-encapsulated-kitten.md`.

- **STD-002 — `convention` tag added + 5 rule-heading layer comments.** Added
  `convention` to `tags:` frontmatter (aligns with the convention-autoload
  scanner). Appended `<!-- layers: ... -->` inline comments to all 5 rule
  headings: R1 (Domain, Application.Contracts, Application), R2
  (Application.Contracts, Domain), R3 (Domain.Shared), R4 (Domain), R5
  (Domain). Comments are invisible to lint and do not change rule semantics.

- **STD-005 — 17 rule-heading layer comments.** Appended `<!-- layers: ... -->`
  to R1–R17. R9 covers cross-cutting + EntityFrameworkCore (sub-rules
  9.1/9.2/9.3/9.6 are cross-cutting; 9.4/9.5 are EntityFrameworkCore); R11
  covers Domain + Application (Manager half + AppService half); R16 covers
  Domain + Application + EntityFrameworkCore. No rule text changed.

- **STD-006 — 6 rule-heading layer comments.** R1/R3/R4 →
  Application + EntityFrameworkCore; R2 → Domain + Application +
  EntityFrameworkCore; R5/R6 → Application only.

- **NEW — `sdlc/standards/by-layer/` (7 pointer files).** Per-layer pointer
  files for the 5 ABP layers + 1 cross-cutting file + 1 index file:
  `cross-cutting.md` (all layers), `shared.md` (Cohort A), `domain.md`
  (Cohort A), `contracts.md` (Cohort B), `application.md` (Cohort B),
  `infrastructure.md` (Cohort C), `index.md` (routing table). Each pointer
  file cites rule IDs only — no rule-text restatement. Cohort D
  (`HttpApi.Host`) is out of scope; pointer file added when an FRS requires
  host code.

- **`sdlc/standards/index.md` — `## By layer` section + STD-002 row tag.**
  Added `## By layer` section linking to `by-layer/index.md`. STD-002 Tags
  cell updated to include `convention` (sync with frontmatter).

- **Workflow wiring (no rule-semantic changes):**
  - `sdlc/workflow/implementation.md` — Stage 2 Code convention paragraph
    rewritten to name STD-002/005/006 explicitly + add per-layer narrow-load
    bullet + routing link; new `### Stage 2 Code — per-layer dispatch`
    sub-section with round structure and precondition; stale
    `ADR-002-abp-layer-cohort-ordering.md` link fixed to
    `ADR-009-implementation-task-cohort-ordering.md` at four locations
    (`implementation.md` × 2 + `plan.md` × 2); accompanying numeric-cohort
    references updated to ADR-009's A/B/C/D vocabulary (`Cohort 3` → `Cohort C`
    in `implementation.md`; `Cohort 1` → `Cohort A` and the six-cohort prose
    block compressed to "see ADR-009 § Decision" in `plan.md`).
  - `sdlc/workflow/agent-contracts.md` — new `### Code-writing dispatch`
    sub-section under `## Dispatch shapes` (envelope, outputs, forbidden,
    verification).
  - `sdlc/workflow/retrieval-discipline.md` — Phase 3 row addendum: per-layer
    narrow-load step + orchestrator reads `by-layer/index.md`.
  - `sdlc/workflow/planning-conventions.md` — `### Phase 3 layer dispatch`
    paragraph under `## Sub-agent dispatch`.

## [2026-05-22] plan-consolidated | Standards-folder hygiene pass — tag typo + anchor repair, date sync, schema reconciliation, status enum, layer-comment widening, engine/project path leak, log-topic annotation

Source: plan `review-the-d-projects-amnil-secure-flux-enumerated-raven.md`.
Metadata + boundary hygiene only — no rule renumbering, no rule-text edits,
no file additions / deletions.

- **STD-002 + index.md + 2 pointer files — `errororstd` typo cleanup.**
  Fixed the `errororstd` concatenation artifact at three call sites
  (`STD-002:9` frontmatter `tags:`, `index.md:46` Tags cell) → canonical
  `erroror`. Discovered during the pass that the same typo had propagated
  into two broken anchor links: `by-layer/application.md:25` and
  `by-layer/contracts.md:27` both linked to
  `#13-errororstd-boundary--never-past-the-appservice`. Repaired both to
  the correct GitHub-auto anchor
  `#13-erroror-boundary--never-past-the-appservice` (sourced from
  STD-002:112 heading `#### 1.3 ErrorOr boundary — never past the
  AppService`). The plan named only the two tag sites; the anchor repair
  was a within-scope extension.

- **STD-005 / STD-006 — `updated:` date sync.** Both frontmatters carried
  `updated: 2026-05-17` despite the 2026-05-22 layer-comment additions
  (logged at the preceding `plan-consolidated` entry). Bumped to
  `2026-05-22`.

- **STD-004 — tag bidirectional sync.** `ndf-pilot-log` was present on
  the index row (`index.md:48`) but missing from STD-004's frontmatter
  `tags:`. Added to the frontmatter to restore bidirectional sync.

- **STANDARD.md template — field reconciliation with live STDs.**
  Removed the unused `resolves: []` field from the template (no live STD
  uses it; re-add when a future STD actually closes an OQ). Added two
  optional commented fields: `deferred_until:` (required when `status:
  proposed` or `status: deferred` — names the firing condition) and
  `operative_source:` (companion path that fills the gap until the
  standard graduates). Pattern in active use at STD-001, STD-003,
  STD-004 — the template now documents it. Status comment extended
  `proposed | accepted | deferred | deprecated | superseded`.

- **`standards/index.md § Conventions` — Status enum + `deferred`
  definition.** Extended the Status bullet to enumerate `deferred`
  alongside the existing four values, with a one-sentence definition
  ("scope clear, content not yet authored because the trigger condition
  has not fired; reference the operative substitute via
  `operative_source:`"). STD-004 already uses `deferred`; the docs now
  match.

- **STD-006 R1 layer comment — widened to include Domain.** R1
  prohibits `Serilog.ILogger` / `Serilog.Log.*` outside the host module
  in **any** non-host layer including Domain (which is logger-free per
  R2 but still inside the prohibition's reach). Layer comment changed
  from `<!-- layers: Application, EntityFrameworkCore -->` to
  `<!-- layers: Domain, Application, EntityFrameworkCore -->` so the
  per-layer pointer-sync routing is correct if/when the
  pointer-sync lint is built.

- **`by-layer/index.md` — engine/project path leak.** The Cohort
  dispatch summary preamble cited `../../../docs/app/adrs/ADR-009-...`
  (project-specific `app/` segment in an engine file). Replaced with
  `docs/<component>/adrs/ADR-009-...` plus a footnote naming
  `docs/project.md` as the canonical resolver for `<component>`.

- **`log.md:19` — topic discipline annotation.** The 2026-05-15
  PROJECT.md template entry is engine-wide, not a standards-lifecycle
  event. Annotated in place with an italic note flagging it as
  off-topic for the standards log and signalling that future
  engine-wide entries should land in a future engine-meta log rather
  than here. No new log file created in this pass (deferred).

- **T1f skipped — premise was incorrect.** The plan flagged
  `status-change` (cited at `STD-005:689`) as an undefined op and
  recommended removing the reference. `status-change` IS in the
  closed-set op vocabulary
  (`sdlc/workflow/operation-vocabulary.md:16`,
  `sdlc/workflow/maintenance-discipline.md:142`); STD-005:689 is
  already correct. No edit applied. Captured here for audit so future
  reviewers do not re-raise the false positive.

- **Tier-3 deferred items — no body changes, captured in this entry +
  the plan file.** STD-005 split, STD-002 split (both gated on STD-001
  graduation, triggers already named in each file's § Revisit if);
  `log.md` archival (threshold: >12 entries or >700 lines; current 8 /
  483); pointer-file ↔ source-STD reconciliation lint (own plan);
  `framework:` axis intersection-default change (own plan); separate
  engine-meta log (annotation suffices for now).

## [2026-05-22] rule-history | cross-ref-guard.md — pointer-file rule-anchor lint folded into periodic dangling-reference audit

Source: plan `standards-folder-deferred-followups.md` item #1. The audit
recipe in `sdlc/workflow/cross-ref-guard.md § Periodic dangling-reference
audit` was extended in two places: step 1's grep block gained a third
line targeting `\[STD-\d{3} § Rule [\d.]+\]` citations under
`sdlc/standards/by-layer/`; step 2 gained a "Pointer-file sub-check"
paragraph requiring both file-existence **and** anchor-fragment
resolution under GitHub-flavored auto-anchor rules (lowercase; spaces
and `:` → `-`; `.`, `(`, `)`, `'` stripped). The 2026-05-22 `errororstd`
anchor regression (named at the preceding `plan-consolidated` entry) is
the documented failure mode that motivated the lint. Lint surface area:
57 rule-anchor citations currently spread across the six pointer files
(`cross-cutting.md`, `shared.md`, `domain.md`, `contracts.md`,
`application.md`, `infrastructure.md`). Closes plan item #1; the
remaining five items in the same plan are tracked in
`c:\Users\bikendrathapaliya\.claude\plans\standards-folder-deferred-followups.md`.

## [2026-05-22] plan-consolidated | BOUNDARY.md + FRS.md + FS.md + retrieval-discipline.md + frs-validation-rules.md + CLAUDE.md — `framework:` promoted to mandatory consumer-side declaration (HARD-GATE)

Source: plan `standards-folder-deferred-followups.md` item #2. The
intersection-default decision landed on **option (a) — always-mandatory
with `agnostic` fallback** (the literal "if `docs/project.md` declares
`framework:`" trigger from the plan didn't fit this multi-component
project, where APP=ABP and FDE=Kafka/Flink; the symmetric "always
mandatory" matches `stack:`'s posture in BOUNDARY.md § Stack axis).
Pre-2026-05-22 FRSs / FSs are grandfathered to avoid a brownfield mass
backfill; the next substantive edit to any of them MUST backfill both
`stack:` and `framework:` in the same operation.

- **`sdlc/BOUNDARY.md § Framework axis` — mandatory-on-consumer promotion.**
  Dropped the "(if any)" carve-out from the consumer-side intersection
  prose. Added a per-section note dating the promotion to 2026-05-22 and
  pointing at the CLAUDE.md HARD-GATE. Reworded the intersection rule to
  state both axes are mandatory ("Every consuming FRS / FS declares
  `framework:`... and intersects on both axes"). Annotated the `agnostic`
  enum value as the explicit fallback for stack-bound-but-not-framework-bound
  specs (e.g., FDE component until an FDE-specific framework token is added).
  Final paragraph: "Consumers no longer have that option — omission is a
  Phase 1.5 Blocker."

- **`sdlc/_templates/FRS.md` + `sdlc/_templates/FS.md` — `framework: []`
  field added adjacent to `stack:`.** Inline comment names the enum,
  flags MANDATORY since 2026-05-22, names `[agnostic]` as the fallback,
  and points at the Phase 1.5 Blocker + grandfather clause. Field
  position: directly after the existing `stack:` line so authors see
  both axes together.

- **`sdlc/workflow/retrieval-discipline.md § STDs and CCCs` — Phase 1.5
  retrieval row updated.** Row now says "STDs whose `applies_when.stack:`
  matches FRS `stack:` **and** whose `applies_when.framework:` (when
  declared) matches FRS `framework:` — intersection on both axes" with
  a cross-link to BOUNDARY.md § Framework axis. Closes the silent-miss
  class where STD-005 (`applies_when.framework: [abp-net]`) fell out
  whenever the consuming FS omitted `framework:`.

- **`sdlc/workflow/frs-validation-rules.md` Blockers table — new clause.**
  Appended to the Blockers cell (the long pipe-separated list at the
  PASS / PASS_WITH_MAJORS / FAIL severity table): "FRS authored on or
  after 2026-05-22 omits `framework:` in frontmatter or declares it
  with an out-of-enum value... (`type: frontmatter-presence`;
  pre-2026-05-22 FRSs grandfathered, but the next substantive edit MUST
  backfill both `stack:` and `framework:`)." First explicit
  frontmatter-presence Blocker in the gate vocabulary; `type:` token
  `frontmatter-presence` introduced here.

- **`CLAUDE.md ## Hard rules` — new HARD-GATE.** Placed after the
  `docs/shared/ccc/` baseline HARD-GATE and before the "Retrieval
  discipline" pointer. Wording follows the existing imperative shape
  ("do not / MUST") and back-links to BOUNDARY.md + frs-validation-rules.md.

- **Tier-3 deferred sub-bullet — pre-2026-05-22 backfill.** 9 milestone
  artifacts lack `stack:`, `framework:`, `standards:`, and `ccc:`
  frontmatter (FRS-001..006 in M-01 minus FRS-005; FRS-002 in M-02; FS-001..003
  in M-01; FS-002 in M-02). These were authored before the 2026-05-16
  stack-axis addition and are silently grandfathered today. Trigger
  for backfill: any substantive edit to one of these files (the
  HARD-GATE wording forces in-edit backfill of both `stack:` and
  `framework:` together). No separate plan spawned; precedent
  follows the 2026-05-22 hygiene-pass entry's Tier-3 deferred items
  list. Closes plan item #2; remaining four items in the same plan
  (#3 STD-001 authoring, #4 STD-005 split, #5 STD-002 split, #6 / #7 /
  #8 trigger-gated) tracked in
  `c:\Users\bikendrathapaliya\.claude\plans\standards-folder-deferred-followups.md`.

## [2026-05-22] rule-history | cross-ref-guard.md — pointer-file sub-check normalization rules tightened (em-dash + HTML-comment handling)

Source: amendment to the prior `rule-history` entry on the same day. Spot-verification of the new lint surfaced that the original normalization list (`lowercase; spaces and ':' → '-'; '.', '(', ')', "'" stripped`) was incomplete — it missed em-dash `—` / en-dash `–` stripping and the trailing layer-comment tail `<!-- layers: ... -->` on STD-002 / 005 / 006 headings, both of which appear throughout the live STDs. A future auditor following the unamended recipe would generate false MISSes (the citations resolve correctly on GitHub-rendered preview; the recipe under-described the algorithm). Recipe step 2 in `sdlc/workflow/cross-ref-guard.md § Periodic dangling-reference audit` now lists the four normalization steps in order (HTML-comment strip → lowercase → punctuation strip including em-/en-dash → whitespace + `:` → `-`) plus a "gotcha" note on space-em-dash-space → `--` collapse. Original log entry's parenthetical left intact as historical record.

## [2026-05-22] rule-history | STD-001 — trigger check executed; graduation deferred (nominal but not operational)

Source: plan `standards-folder-deferred-followups.md` item #3. Trigger
check per the plan's procedure: any FRS with Domain-layer body content
(aggregate-root design, entity vs VO, identity strategy, domain-event
semantics) demanding STD-001 doctrine that the `operative_source:`
fallback (domain-layer-tagged ADRs) can't answer. Verdict: **nominally
satisfied, operationally not**. FRS-001 (`docs/milestones/M-01-...`)
touches Domain (ENT-001 reshape to `ScreeningList` aggregate) but the
aggregate-root design choice is owned by ADR-001 and the encapsulation
pattern by STD-002 R5 — no new doctrine question raised. FRS-002
(`docs/milestones/M-02-...`) is streaming infrastructure (Kafka / Flink
/ Druid via the FDE component) and produces no Domain entities at all.
STD-001 remains `status: proposed` with body empty; STD-002 R5 stays in
place as the operative aggregate-root anchor (cited by
`by-layer/domain.md:31, 49`). Re-trigger condition: any future FRS that
surfaces a doctrine question across entity-vs-VO selection, identity
strategy (GUID vs long; sequential vs random; external vs internal),
domain-event semantics (LocalEventBus vs DistributedEventBus discriminator),
or invariant-placement (constructor vs named mutation method). Closes
plan item #3 by deferral (not by authoring); item #5 (STD-002 R5 split
to STD-001) remains blocked on STD-001 graduation per the original
dependency chain.

## [2026-05-28] plan-consolidated | STD-005 R9.2/R11/R15 + R11.1 — page-driven AppService

Source: plan `is-this-rule-being-purring-liskov.md`. Codifies the
codebase + KB convention (AppService = portal page, BFF-like;
DomainService = aggregate; AppService composes DomainServices) that
STD-005 still contradicted. Universal — applies to all new features,
not prototype-conditional. No new ADR; STD-005 amend only.

- **R9.2 — AppService folder rows + Permissions row.** Replaced both
  AppService rows (interface + impl) with page-driven shape
  `<Portal>/<Page>AppService.cs` (simple page) /
  `<Portal>/<Page>/<Page><Section>AppService.cs` (sectioned). Permissions
  row updated `<Module>Permissions.cs` → `<Project>Permissions.cs` (R15
  alignment). Placeholder gloss extended to define `<Portal>`, `<Page>`,
  and `<Project>`.
- **R11 — CON row.** Maps to `<Page>AppService` (page-scoped, not
  aggregate-scoped); sectioned pages name `<Page><Section>AppService`.
  Slot moved to `Application/<Portal>/` (or
  `Application/<Portal>/<Page>/` for sectioned pages).
- **R11.1 added — Page-AppService composition invariant.** Sub-rule
  formalises the BFF-like boundary: accepts page input, authorises,
  delegates to one-or-more `<Aggregate>Manager` methods, unwraps each
  `ErrorOr<T>`, projects to a composite output DTO. MAY span multiple
  aggregates; MUST NOT carry business rules or cross-aggregate
  coordination — that stays in a Manager (cross-link to STD-002 R5).
  Simple page = one `<Page>AppService`; sectioned/tabbed page = one
  `<Page><Section>AppService` per tab/section, each aligned to a single
  aggregate's DomainService.
- **R15 — Permission constants reshape.** Single per-project file
  `<Project>Permissions.cs` with nested portal → page → action
  sub-classes; wire pattern `<Project>.<Portal>.<Page>.<Action>`
  (e.g. `TradeFinance.AdminPortal.Users.Create`). Example replaced
  (`BankGuaranteePermissions` → `TradeFinancePermissions`). Provider
  named `<Project>PermissionDefinitionProvider`. The earlier
  `<Module>Permissions.cs` parenthetical mismatch removed.
- **R9.3 — AppService and Permission examples updated** (non-normative).
  `BgRequestAppService` / `IBgRequestAppService` → `BgSubmissionAppService`
  / `IBgSubmissionAppService` (page-named). `BankGuaranteePermissions` →
  `TradeFinancePermissions` (single per-project class).
- **Frontmatter / index.md.** STD-005 `updated: 2026-05-22 → 2026-05-28`;
  tags gained `bff, page-driven` (frontmatter + index row, bidirectional
  sync).
- **Cascading edits.** `by-layer/application.md` + `by-layer/contracts.md`
  Key-folders rows and common-defects bullets re-shaped to `<Page>` /
  `<Project>` placeholders. `_templates/nodes/PERMISSION.md` prose
  updated `<Module>Permissions.cs` → `<Project>Permissions.cs`.
  `_templates/nodes/CONTRACT.md` verified — no rule-text reference to
  AppService naming; left untouched.

Cascading fix: `STD-002-dotnet-coding-conventions.md` R1.3 prose
(`I<Aggregate>AppService` → `I<Page>AppService`, line 118) and its
illustrative code block (class renamed to `DepartmentManagementAppService`
/ `IDepartmentManagementAppService`) updated in the same operation.

Grandfathering:
- CON nodes created before 2026-05-28 (CON-012..CON-017) retain
  aggregate-named AppService titles. Next substantive edit MUST backfill
  page-driven naming in the same operation.
- CMD/QRY nodes created before 2026-05-28 that contain permission string
  references using the two-level `TradeFinancePermissions.<Resource>.<Action>`
  pattern (without portal level) are also grandfathered. Next substantive
  edit to any such node MUST backfill the three-level
  `<Project>.<Portal>.<Page>.<Action>` wire pattern in the same operation.
  (Mirrors the 2026-05-22 `framework:` HARD-GATE grandfather pattern in
  CLAUDE.md.)
No CLAUDE.md edit — grandfather clause captured here to keep scope
contained.

## [2026-06-10] created | STD-007 NDF governance — spec promoted from project ADR-039 to engine

Source: REVIEW-SDLC-REPORT.md Rec-01 (engine-purity finding F-006/F-007
class). The NDF specification lived only in the originating project's
`docs/shared/adrs/ADR-039-ndf-fifth-governance-kind.md` while ~24
engine sites across 13 files cited it as binding authority — a fresh
deployment (no `docs/`) had the fifth governance kind specified
nowhere. `STD-007-ndf-governance.md` (status: accepted,
`source: harvested-from-ADR-039`) now carries the normative content:
definition (R1), placement/ID (R2), `node_definitions:` registration
(R3), template-as-contract (R4), coining + ingest gate pointers (R5/R6
— canonical homes unchanged: `evolving-the-workflow.md` / `plan.md`),
`declared_via:` binding (R7), pre-2026-05-19 grandfathering (R8 — new
canonical home for the former "ADR-039 § Brownfield impact";
`grandfather-registry.md` row added), STD-004 escalation (R9), 5-way
discriminator pointer (R10). All engine cites re-pointed
ADR-039 → STD-007 in the same operation (CLAUDE.md, KB-LAYOUT.md,
WORKFLOW.md, `_templates/{COMPONENT,FRS,NDF}.md`,
`workflow/{authoring-adr,evolving-the-workflow,new-component-bootstrap,ndf-edit,plan}.md`,
STD-004, this index's STD-004 row). The originating project's ADR-039
is demoted to adoption record (STD-007 § Provenance / § Project-specific
deviations); historical ADR-039 mentions in this append-only log are
intentionally left intact. Doctrine narrative:
`workflow/rule-history.md` § NDF spec promoted (2026-06-10).
