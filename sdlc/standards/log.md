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

## [2026-05-13] created | STD-001 Engine-level DDD constraints

Placeholder. Populate when the first FRS touches the domain layer.

## [2026-05-13] created | STD-002 Engine-level .NET implementation conventions

Placeholder. Populate when the first FRS touches application-layer code.

## [2026-05-13] created | STD-003 Engine-level API design rules

Placeholder. Populate when the first FRS touches an HTTP boundary.

## [2026-05-13] created | STD-004 Engine-level per-node-type contract guarantees

Placeholder. Populate when the first node-type contract needs codification.

## [2026-05-15] updated | Engine — Added PROJECT.md template

Introduced `sdlc/_templates/PROJECT.md` as the canonical project configuration
manifest template. Projects seed `docs/project.md` from this template.

## [2026-05-15] created | STD-005 ABP framework coding conventions

Absorbed from `guidelines/abp-guidelines.md`. Covers 9 rules: built-in entity
catalog check (Rule 1), entity base-class declaration with rationale (Rule 2),
DTO audit-level mirroring (Rule 3), query input/output wrappers (Rule 4),
companion entity pattern for ABP built-in extensions (Rule 5), PascalCase
property naming (Rule 6), C# enums for bounded-value fields (Rule 7), no data
annotations on domain entities (Rule 8), and file/folder/type-suffix/DB-object
naming conventions (Rule 9). Status: accepted. Validation hooks fire at Phase
1.5, Phase 2, and Phase 3 merge gate.

## [2026-05-16] rule-history | Engine — Standards now declare `applies_when:` for stack-conditional applicability

Added `applies_when:` block to `_templates/STANDARD.md` and to the standards
`index.md` schema (new `Applies when` column). STD-001..004 backfilled to
`agnostic`; STD-003 narrowed to `api`; STD-005 narrowed to `abp-net`. STD-005's
body prose claim "applies to any .NET project using ABP" was dropped — the
applicability now lives in frontmatter only. Companion change to the
CLAUDE.md Hard rule ("Four governance sources: STD / ADR / CCC / DEC")
and to the 4-way discriminator in
[`../workflow/authoring-adr.md`](../workflow/authoring-adr.md). Rationale: the
prior tension where STD-005 was engine-scoped but ABP-conditional had no
mechanical home; `applies_when:` generalizes to any future conditional engine
standard without forking the scope axis.

## [2026-05-16] rule-history | STD-005 — applies_when reshaped to stack + framework axes

`abp-net` was not in `BOUNDARY.md § Stack axis` (which enumerates functional
roles: `api`, `ui`, `test`, `full-stack`, `infra`, `agnostic`). The shape
`applies_when.stack: [abp-net]` mixed a framework name into the functional-role
enum. Resolved by splitting applicability across two axes:
`applies_when.stack: [api]` (functional role) plus
`applies_when.framework: [abp-net]` (framework binding). Added new `Framework
axis` section to `BOUNDARY.md`; updated `_templates/STANDARD.md` to include the
optional `framework:` line and remove `abp-net` from the stack enum comment;
updated `standards/index.md` Applies-when column description to cover both
axes; updated the worked example in `workflow/authoring-adr.md`. A consuming
artifact intersects on both axes when both are declared.

## [2026-05-17] updated | STD-005 — Rules 10–13 + Rule 9.2 amendment (errors slot → keys slot)

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
(all accepted as of 2026-05-17). Source: plan
`review-the-implementation-workflow-greedy-popcorn.md` Phase B.

## [2026-05-17] status-change | STD-002 — proposed → accepted; ErrorOr / FluentValidation / Localization-keys authored

Promoted STD-002 from `proposed` placeholder to `accepted` with three
substantive rules:

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
rules. Tags refreshed (`placeholder` removed). Source: plan
`review-the-implementation-workflow-greedy-popcorn.md` Phase B.

## [2026-05-17] updated | STD-005 ABP framework coding conventions

Added Rule 14 (typed ABP exceptions + HTTP status mapping table —
prohibits raw `Exception` / `ApplicationException`, restricts global
exception middleware to ABP's `ExceptionHandlingMiddleware`), Rule 15
(Authorization placement and grouping — `[Authorize]` on AppService
only, never on Domain Managers; `<Project>Permissions` constants are
the only call-site argument), Rule 16 (Soft-delete data-filter
discipline — manual `IsDeleted` predicates prohibited, explicit
`IDataFilter.Disable<ISoftDelete>()` is the only override path), and
Rule 17 (Audit logging via ABP audit module, not `ILogger` — structural
mirror to STD-006 R6 on the logging-discipline side). § Consequences
gains four new merge-gate scans (R14/R15/R16/R17). Tags bumped:
`+exceptions, +authorization, +soft-delete, +audit-logging`. Anchors:
CCC-002 (R15), CCC-004 (R17), CCC-006 (R14), CCC-012 (R16) — all
lifted to `accepted` in the same wave. Source: plan
`improve-implement-workflow-output-encapsulated-eagle.md`.

## [2026-05-17] created | STD-006 Engine-level logging conventions

New engine-level standard binding
`applies_when: { stack: [api] }` with tag `convention` (singular,
scanner-aligned). Six rules: R1 — `ILogger<T>` injection only (MEL
abstraction; `Serilog.ILogger` / static `Log.*` prohibited outside
the host module); R2 — Per-layer log levels (Domain: none; Application:
`Information` for significant ops, `Warning` for recoverable rule
violations; Infrastructure: `Debug` for routine queries, `Error` with
exception for external/DB failures); R3 — Structured logging with
named properties (`$"…"` / `string.Format` / `+` concatenation inside
log calls prohibited); R4 — Never log sensitive data (passwords,
tokens, OTPs, session IDs, raw card numbers, CVVs, `Authorization`
headers, full auth-endpoint request bodies); R5 — Correlation /
tenant / user enrichment via ABP's `IAbpSerilogEnricher` (manual
push prohibited); R6 — Audit logging via ABP audit module, not
`ILogger` (logging-discipline mirror to STD-005 R17). § Consequences
lists six grep-driven merge-gate scans; advisory-only flags on R5
(manual push) and R6 (`Audit…` template prefix). Companion CCC lifts:
CCC-004 / CCC-012 / CCC-013 all moved from `proposed` (TBD baselines)
to `accepted` with one-paragraph baselines pointing at STD-006 +
STD-005 R14/R16/R17. Source: plan
`improve-implement-workflow-output-encapsulated-eagle.md`.

## [2026-05-17] rule-history | STD-005 — tag normalised `conventions` → `convention` (scanner alignment)

STD-005's frontmatter tag (and matching `sdlc/standards/index.md` row's
Tags cell) was `conventions` (plural); the convention-autoload fallback
declared in `sdlc/workflow/implementation.md:231,389`,
`sdlc/workflow/plan.md:236`, `sdlc/workflow/retrieval-discipline.md:229`,
and `sdlc/workflow/qa-gate.md:120` reads `convention` (singular). Every
FS to date (FS-001..004) declared STD-005 explicitly in `standards:`,
so the fallback had been dead code for STD-005 — observable impact
zero. Renamed both occurrences to singular to make the fallback work
as documented and to match STD-006 (which was authored against the
singular form). No body changes; no rule semantics changed. Surfaced
during the
`improve-implement-workflow-output-encapsulated-eagle.md` plan
execution.

## [2026-05-17] updated | Engine — implementation.md Stage 0 load-completeness checkpoint

Stage 0 retrieval-evidence emission (`sdlc/workflow/implementation.md`)
gained a load-completeness checkpoint: the convention / task-ordering /
code-quality slots must be enumerated from `sdlc/standards/index.md` +
`docs/<component>/adrs/index.md`, not derived from the FS frontmatter
alone. Motivation: the FS-004 session silently coded against an
out-of-date STD-005 because the convention-tagged set was never
enumerated. Paired with the STD-005 tag normalisation above so the
autoload fallback works as documented. Source: plan
`improve-implement-workflow-output-encapsulated-eagle.md`.
