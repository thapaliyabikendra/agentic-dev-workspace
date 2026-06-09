---
id: STD-005
title: ABP framework coding conventions
status: accepted
created: 2026-05-15
updated: 2026-05-28
supersedes: null
superseded_by: null
tags: [abp, dotnet, entity, dto, naming, convention, validation, controllers, manager, constants, localization-keys, exceptions, authorization, soft-delete, audit-logging, mapperly, bff, page-driven]
scope: engine
applies_when:
  stack: [api]
  framework: [abp-net]
source: guidelines/abp-guidelines.md
related_adrs: []
---

# STD-005: ABP framework coding conventions

> **Engine-level technical standard.** Applicability is declared in
> `applies_when:` frontmatter — this standard binds when the consuming
> artifact's `stack:` intersects `[api]` **and** its `framework:`
> intersects `[abp-net]`. Project-specific deviations are component-scoped
> ADRs that back-link here; node-local atomic decisions are DECs. See
> [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) for the
> STD / ADR / CCC / DEC discriminator.
>
> Source material: `guidelines/abp-guidelines.md` — absorbed into this
> standard 2026-05-15 and since removed; see [`log.md`](log.md)
> `[2026-05-15]` entry.
> When this standard and any component ADR disagree, the ADR wins — flag
> the drift back here so the standard can be updated.

## Scope

Entity and value-object base-class selection; DTO base-class mirroring;
query input/output wrappers; companion entity pattern for ABP built-in
extensions; property naming (PascalCase); bounded-value modelling (C# enums);
data-annotation placement; file, folder, type-suffix, and database object
naming; HTTP exposure default (Auto API Controllers); node-body to
service-layer mapping (Manager vs AppService); `IEntityTypeConfiguration<T>`
enforcement against inline `OnModelCreating` blocks; per-module shared
validation / schema constants; per-module localization-key constants.
STD-001 and STD-002 govern the framework-agnostic DDD and .NET rules; this
standard governs the ABP-specific layer on top — binding is declared in
`applies_when: { stack: [api], framework: [abp-net] }` rather than in prose.

## Standards

### Rule 1 — Built-in entity catalog is consulted before any Entity is synthesised <!-- layers: Domain -->

Every new entity node — whether produced during Phase 1 FRS authoring,
Phase 2 feat-spec synthesis, or Phase 3 brownfield absorption — must
pass the three-step decision flow from `abp-built-in-entities.md`:

1. **Concept appears in the catalog?** → reference the built-in. Do
   not emit a new entity node. Use an Actor, Integration, or
   relationship target on a milestone-specific entity instead.
2. **Concept is a companion to a built-in?** → synthesise a companion
   entity (e.g., `UserProfile`, `TenantConfiguration`) that holds
   only the project-specific fields and references the built-in by
   ID (`UserId`, `TenantId`, etc.).
3. **Concept is ambiguous?** → do **not** emit the entity. Raise a
   `builtin_collision` Conflict in the FRS or FS and surface it in
   Open Blockers with a `resolution_question` pointing at the specific
   catalog row.

A synthesised entity whose name or responsibility duplicates a catalog
entry is a validation defect. The Phase 1.5 gate and the Phase 2
feat-spec validator both block on it.

#### Concrete bindings

| FRS clause mentions… | Action |
|---|---|
| user, account, login, password, email verification, lockout | reference `IdentityUser` — no `User` entity node |
| role, user role | reference `IdentityRole` — no `Role` entity node |
| audit who-changed-what-when, change history | rely on `AuditedAggregateRoot` / `FullAuditedAggregateRoot` + ABP entity-change tracking — no `AuditLog` entity node (auditing baseline: `CCC-004`) |
| tenant, company-as-tenant | reference `Tenant` — no `Company` entity node (multi-tenancy baseline: `CCC-003`) |
| permission, access right | declare in `PermissionDefinitionProvider` — no `Permission` entity node (authorization baseline: `CCC-002`) |
| feature flag, feature quota | declare a `FeatureDefinition` — no `Feature` entity node |
| setting, configuration value | declare a `SettingDefinition` — no `Setting` entity node |
| file upload, document storage, attachment | Integration entry against `BlobContainer` / `BlobInfo`; companion entity only when business metadata beyond the blob is tracked |
| background job, async task | Actor entry `System: BackgroundJob: <JobName>` + reference `AbpBackgroundJobs` — no `BackgroundJob` entity node |
| send email / send SMS | Integration entry against ABP `EmailingModule` / `SmsModule` — no entity |
| current user, logged-in user | use `ICurrentUser` from the application layer — never modelled as an entity |

---

### Rule 2 — Every entity declares its base class and rationale <!-- layers: Domain -->

The entity node template requires two fields immediately above the **Fields** table:

```
**Base class:** <FullAuditedAggregateRoot<TKey> | AuditedAggregateRoot<TKey> | CreationAuditedAggregateRoot<TKey> | AggregateRoot<TKey> | BasicAggregateRoot<TKey> | FullAuditedEntity<TKey> | AuditedEntity<TKey> | CreationAuditedEntity<TKey> | Entity<TKey>>
**Base class rationale:** <one-line citation of the FRS clause or invariant that drove the choice>
**Implements:** <IMultiTenant, IHasConcurrencyStamp, … — omit when none>
```

Formatting rules:
- The base-class name appears **only** as a bold-labeled field value. Never in a code fence, never with `public class …`, never with colon-inheritance syntax.
- `TKey` is `Guid` by default. Use `int` / `long` only when a node-scoped DEC documents why.

#### Decision tree (use top-down)

1. Soft-delete / archive in scope? → `FullAuditedAggregateRoot<Guid>` (root) or `FullAuditedEntity<Guid>` (child).
2. Modifications tracked (who / when)? → `AuditedAggregateRoot<Guid>` or `AuditedEntity<Guid>`.
3. Creation tracked only? → `CreationAuditedAggregateRoot<Guid>` or `CreationAuditedEntity<Guid>`.
4. Lightweight, no extensibility, no audit? → `BasicAggregateRoot<Guid>` (root) or `Entity<Guid>` (child).

Default: when an FRS clause mentions "created by", "updated by", timestamps, history, or any archive/delete flow, pick `FullAudited*` without further deliberation.

#### Mirroring rule

A child entity's audit level must be **equal to or lighter than** its parent root's. `FullAuditedEntity<Guid>` under `AggregateRoot<Guid>` is a defect — either upgrade the parent or downgrade the child.

#### Interface-only behaviours

| Interface | Use when |
|---|---|
| `IMultiTenant` | Aggregate is tenant-scoped (the project default per `CCC-003`). Adds nullable `TenantId`. Omit only on global lookups documented in an ADR back-linked to `CCC-003`. |
| `IHasConcurrencyStamp` | FRS mentions optimistic locking or concurrent edits. |
| `ISoftDelete` | Implicit on `FullAudited*` (baseline `CCC-012`). Add explicitly only on non-`FullAudited` bases with a delete/archive use case. |
| `IHasExtraProperties` | Implicit on `AggregateRoot*`; explicit on `BasicAggregateRoot` when the object-extension system is used. |

---

### Rule 3 — DTOs mirror the entity's audit level <!-- layers: Application.Contracts -->

Phase 2 feat specs must cite a DTO base class for every output DTO, and the level must match the source entity:

| Source entity | Output DTO base |
|---|---|
| `FullAuditedAggregateRoot<TKey>` | `FullAuditedEntityDto<TKey>` (or `ExtensibleFullAuditedEntityDto<TKey>` if extras are exposed) |
| `AuditedAggregateRoot<TKey>` | `AuditedEntityDto<TKey>` (or `ExtensibleAuditedEntityDto<TKey>`) |
| `CreationAuditedAggregateRoot<TKey>` | `CreationAuditedEntityDto<TKey>` |
| `AggregateRoot<TKey>` | `ExtensibleEntityDto<TKey>` |
| `BasicAggregateRoot<TKey>` | `EntityDto<TKey>` |

Use the `…WithUserDto` variant when the API response should embed creator/modifier user details rather than IDs only. Dropping a level silently strips soft-delete fields from the API contract — flag as a Phase 2 defect unless a DEC explains it.

Input DTOs: mutable `public class`, DataAnnotations for field-level validation, cross-field rules in the command handler.

---

### Rule 4 — Query inputs and outputs use the standard request/result wrappers <!-- layers: Application.Contracts -->

Phase 2 feat-specs default to:
- **Query input** extends `PagedAndSortedResultRequestDto`.
- **Query output** is wrapped in `PagedResultDto<TDto>`.

Use `LimitedResultRequestDto` only when paging is explicitly out of scope (a fixed-size lookup). Use `ListResultDto<TDto>` only when the result set is bounded, small, and a total count is unnecessary. Any deviation is recorded in a DEC attached to the query.

---

### Rule 5 — Companion entity pattern for project extensions to built-ins <!-- layers: Domain, Application.Contracts -->

When the project needs fields beyond what an ABP built-in stores:

- Synthesise a milestone entity (e.g., `UserProfile`, `TenantConfiguration`, `AttachmentMetadata`).
- Give it its own primary key.
- Reference the built-in via the appropriate foreign-key field (`UserId: Guid`, `TenantId: Guid`, `BlobId: Guid`).
- Do **not** re-define fields the built-in already owns (`Email`, `UserName`, `Name`, `IsActive`).
- Pick the base class per Rule 2 and the DTO per Rule 3.

A companion entity is a regular aggregate root — it goes through the same template, validation, and Phase 2 staging as any other entity.

---

### Rule 6 — Property names use PascalCase <!-- layers: cross-cutting -->

Every property on an entity, owned-type, value object, or DTO is named in **PascalCase** (`ReferenceNumber`, `BeneficiaryNature`, `BgNumber`).

- **No `snake_case`** on backend entities. Snake-case appears only in the **Brownfield notes** section, recording the legacy source name the PascalCase property maps to.
- **No `camelCase`** on backend properties. JSON serialisation emits `camelCase` over the wire (ABP default), but the C# property name is `PascalCase`.
- **Acronyms ≥ 3 letters are PascalCase** (`BgNumber`, `CbsResponse`, `MT760Body`), not all-caps (`BGNumber`, `CBSResponse`). Two-letter acronyms (`ID`) are uppercase by convention but PascalCase in compound names (`BgId`, `ApplicantPan`).
- **Boolean properties** read as predicates: `IsActive`, `IsDraft`, `HasMargin`. Avoid bare nouns (`Active`, `Draft`).
- **Nullable shape** is on the C# type (`string?`, `Guid?`), not in the property name.

The Phase 2 feat-spec validator flags any non-PascalCase identifier in a staged entity, owned-type, or DTO.

---

### Rule 7 — Bounded-value fields are C# enums <!-- layers: Domain.Shared, Application.Contracts, EntityFrameworkCore -->

Any field whose value is drawn from a closed, named set — more than one value, all known at design time — is modelled as a **C# enum**, not a `string` with a validation list.

#### What qualifies
- Status / state-machine values (`Status`, `CurrentStage`).
- Categorical fields with a fixed dictionary (`BeneficiaryNature`, `GuaranteeType`, `BgFormat`, `ChargesBornBy`, `Origin`).
- Direction / type discriminators on owned types (`CommunicationDirection`, `CommunicationChannel`).
- Action / event kinds on append-only logs (`StageAction`).

#### What does not qualify
- Free-text fields (`Purpose`, `Narration`, `Remarks`).
- Identifiers (`BgNumber`, `LetterNumber`, `CbsReferenceNumber`).
- Currency codes — keep as `string` constrained by ISO 4217 unless a DEC justifies a `CurrencyCode` enum.
- Booleans (use `bool`, not `enum { Yes, No }`).

#### Where enums live
`Domain.Shared` project, under `Enums/<Module>/<EnumName>.cs`. One enum per file. Members are PascalCase.

#### Backing storage
Enums persist as **strings**, not integers:
```csharp
builder.Property(x => x.Status).HasConversion<string>().IsRequired();
```
Rationale: integer-backed columns drift silently when members are reordered. String backing makes the DB self-documenting.

#### DTO and API exposure
- DTOs expose the enum directly. ABP serialises enums as strings in the HTTP API.
- Input DTOs carry `[Required]` on a nullable enum (`BeneficiaryNature? BeneficiaryNature { get; set; }`) when the field must be supplied; never sentinel-coded as `None = 0`.
- Cross-field rules stay in the command handler, not on the enum.

#### How a node declares an enum field
In the entity's **Fields** table the `Type` column names the enum. A separate **Type definitions** section immediately after lists the enum's members. Enums shared across multiple nodes are introduced on the first node that owns them; later nodes reference by name and link to the introducing node.

---

### Rule 8 — No data annotations on domain entities <!-- layers: Domain, EntityFrameworkCore -->

Every persistence concern (table name, column type, max length, owned-type mapping) lives in the `IEntityTypeConfiguration<T>` class in the `EntityFrameworkCore` project. Domain entities stay POCO. DataAnnotations live on **input DTOs only**.

---

### Rule 9 — File and table naming conventions <!-- layers: cross-cutting, EntityFrameworkCore -->

#### 9.1 One C# type per file; file name matches type name

Every public type lives in its own file. The file name is the type name plus `.cs`, PascalCase preserved. Generic types strip the type parameter (`Result<T>` → `Result.cs`). Nested private helpers may share the parent file; partial classes use `<TypeName>.<Suffix>.cs` and must justify the split in a one-line header comment.

#### 9.2 Project folder layout — group-by-type within each module

Folder hierarchy: **`<Module>/<SubModule>/<TypeFamily>/<TypeName>.cs`**. Types are grouped by family (Entities, Managers, Events, Dtos, AppServices, …), not by aggregate.

| Project | Path | Holds |
|---|---|---|
| `Domain` | `<Module>/<SubModule>/Entities/<AggregateName>.cs` | aggregate roots, child entities, owned types |
| `Domain` | `<Module>/<SubModule>/Managers/<AggregateName>Manager.cs` | domain service factories |
| `Domain` | `<Module>/<SubModule>/Events/<AggregateName><Event>Event.cs` | domain events |
| `Domain` | `<Module>/<SubModule>/Specifications/<SpecName>Specification.cs` | specifications |
| `Domain.Shared` | `Enums/<Module>/<EnumName>.cs` | enums (Rule 7) |
| `Domain.Shared` | `<Module>/<Module>Consts.cs` | shared validation / schema constants (Rule 13) |
| `Domain.Shared` | `<Module>/Localization/<Module>Keys.cs` | localization-key string constants (error codes + validation messages + every user-facing key; see note below) |
| `EntityFrameworkCore` | `<Module>/EntityConfigurations/<AggregateName>Configuration.cs` | `IEntityTypeConfiguration<T>` |
| `EntityFrameworkCore` | `<RootNamespace>DbContext.cs` | DbContext — one per solution |
| `EntityFrameworkCore` | `Migrations/<UtcTimestamp>_<DescriptiveName>.cs` | EF Core migrations |
| `Application.Contracts` | `<Portal>/I<Page>AppService.cs` | AppService interfaces — one per portal page (simple) or per page-section (sectioned). Sectioned form: `<Portal>/<Page>/I<Page><Section>AppService.cs` |
| `Application.Contracts` | `<Module>/<SubModule>/Dtos/<DtoName>Dto.cs` | all DTOs (input + output) |
| `Application.Contracts` | `Permissions/<Project>Permissions.cs` | permission constants — single file per project (R15) |
| `Application` | `<Portal>/<Page>AppService.cs` | AppService implementations — one per portal page (simple) or per page-section (sectioned). Sectioned form: `<Portal>/<Page>/<Page><Section>AppService.cs` |
| `Application` | `<Module>/<SubModule>/Mappers/<AggregateName>Mapper.cs` | Mapperly mapper class (default; `[Mapper] partial class`; see mapper-backend note below) |
| `HttpApi` | `Controllers/<Module>/<AggregateName>Controller.cs` | controllers (thin; delegate to AppService — intentionally aggregate-scoped, not page-scoped) |

`<Module>` = bounded-context folder in PascalCase (`BankGuarantee`, `LetterOfCredit`). `<SubModule>` = feature group (`Issuance`, `Claims`). Omit `<SubModule>` when a module has only one feature group. `<Portal>` = UI portal folder in PascalCase (`AdminPortal`, `CustomerPortal`); `<Page>` = a single page (or page-section, when the page is tabbed/sectioned) the AppService backs — see R11 + R11.1 for the page-driven AppService convention. `<Project>` = solution-root PascalCase token (`TradeFinance`) used for the single permission constants file (R15).

> **Mapper backend.** Default is Mapperly (`Volo.Abp.Mapperly`): declare a `[Mapper] partial class <Aggregate>Mapper` (or a single `<Project>ApplicationMappers` class when mappings are few). To use AutoMapper instead, file an ADR referencing STD-005 and use `AutoMapperProfiles/<AggregateName>AutoMapperProfile.cs`.

*Note on `<Module>Keys.cs` (2026-05-17).* The slot replaces the earlier
`<Module>/<ModuleName>Errors.cs` (which was scoped to error-code constants
only). It now holds **every** localization-key string constant for the
module — ErrorOr `<code>` arguments, FluentValidation `.WithMessage(...)`
arguments, and any other user-facing string reference — because error
codes ARE localization keys (see STD-002 § Localization-key constants).
Maintaining two separate constant files duplicated entries; the single
`<Module>Keys.cs` is the per-module home. Resource JSON files live
alongside the project resource (`Domain.Shared/Localization/<Project>/<lang>.json`,
per `CCC-007`); each constant's value is 1:1 with an `en.json` key.

#### 9.3 Type-name suffix conventions

| Type | Suffix | Example |
|---|---|---|
| Aggregate root | (none) | `BgRequest` |
| Domain service / factory | `Manager` | `BgRequestManager` |
| Domain event | `Event` | `BgRequestCreatedEvent` |
| Integration event | `Eto` | `BgRequestCreatedEto` |
| AppService impl | `AppService` | `BgSubmissionAppService` (page-named per R11 / R11.1) |
| AppService interface | `I` + `AppService` | `IBgSubmissionAppService` (page-named per R11 / R11.1) |
| Output DTO | `Dto` | `BgRequestDto`, `BgRequestDetailDto` |
| Input DTO (command) | `Dto` | `CreateBgRequestDto`, `ApproveBgRequestDto` |
| Combined create+update DTO | `Dto` | `CreateUpdateBgRequestDto` |
| Query input DTO | `Dto` | `GetBgRequestListDto` |
| EF configuration | `Configuration` | `BgRequestConfiguration` |
| Mapperly mapper class (default) | `Mapper` | `BgRequestMapper`, `ClinicManagementApplicationMappers` |
| AutoMapper profile (per ADR) | `AutoMapperProfile` | `BgRequestAutoMapperProfile` |
| Specification | `Specification` | `ActiveBgRequestSpecification` |
| Background job | `Job` | `CbsRetryJob` |
| Background worker | `Worker` | `CbsOutboxWorker` |
| Controller | `Controller` | `BgRequestController` |
| Permission constants class | `Permissions` | `TradeFinancePermissions` (single file per project, see R15) |
| Permission definition provider | `PermissionDefinitionProvider` | `TradeFinancePermissionDefinitionProvider` |

ABP suffix conventions (`AppService`, `Controller`, `PermissionDefinitionProvider`, `Eto`, `Mapper` / `AutoMapperProfile`) are non-negotiable — renaming breaks DI registration or endpoint discovery. **All DTOs end in `Dto` — no `Input` or `Request` suffixes.**

#### 9.4 Database object naming

| Object | Convention | Example |
|---|---|---|
| Table | PascalCase, plural of aggregate root | `BgRequests`, `LcAmendments` |
| Column | PascalCase property name (EF Core default) | `ReferenceNumber`, `Status` |
| Primary key | `Id` (Guid); constraint `PK_<TableName>` | `PK_BgRequests` |
| Foreign key column | `<NavigationName>Id` | `TenantId`, `BgRequestId` |
| Foreign key constraint | `FK_<Dependent>_<Principal>_<FkColumn>` (EF Core default) | `FK_BgClaims_BgRequests_BgRequestId` |
| Non-unique index | `IX_<TableName>_<Column(s)>` | `IX_BgRequests_Status` |
| Unique index | `IX_<TableName>_<Column>` with `.IsUnique()` | `IX_BgRequests_ReferenceNumber` |
| Owned-type columns | `<OwnerProperty>_<NestedProperty>` (EF Core default for `OwnsOne`) | `BgFields_Amount` |
| Junction table (M:N) | PascalCase, alphabetical concatenation, plural | `BgRequestRoles` |
| ABP system tables | ABP-provided names — do not rename | `AbpEventOutbox`, `AbpUsers` |
| Enum / status columns | string via `HasConversion<string>()` (Rule 7) | `Status varchar` |

Single `public` schema by default. Module-scoped schemas require an ADR amendment. Table name pluralises the aggregate root (class stays singular).

#### 9.5 Migration file naming

`<UtcTimestamp>_<DescriptiveName>.cs` where `<DescriptiveName>` is PascalCase and starts with a present-tense verb (`Add`, `Drop`, `Rename`, `Alter`, `Backfill`). One migration per schema change — no bundled mega-migrations.

| Good | Bad |
|---|---|
| `20260514093000_AddBgRequestsTable.cs` | `20260514093000_changes.cs` |
| `20260514094500_AddStatusIndexToBgRequests.cs` | `20260514094500_fix.cs` |

#### 9.6 Folder name vs. namespace

The folder hierarchy maps 1:1 to the namespace. The solution root namespace comes from `<RootNamespace>` in the project file — not hardcoded here. Drift between folder path and namespace is a Phase 3 merge-gate defect.

---

### Rule 10 — Auto API Controllers are the default HTTP exposure <!-- layers: Application -->

Every `IApplicationService` in the contracts assembly is auto-exposed as
an HTTP endpoint through ABP's auto API controller pipeline. The host
module registers conventional controllers once:

```csharp
// <Project>HttpApiHostModule.ConfigureServices
Configure<AbpAspNetCoreMvcOptions>(options =>
{
    options.ConventionalControllers.Create(
        typeof(<Project>ApplicationContractsModule).Assembly);
});
```

Manual `[ApiController]` classes are written **only** when one of these
conditions applies:

- Routing or binding semantics cannot be expressed through ABP's auto-route
  conventions (custom verb / path shape, multipart form binding that the
  AppService signature cannot model).
- The response body must diverge from ABP's envelope (e.g., a legacy wire
  contract like `{ "error": "department_not_found" }` carried over from a
  prior API version).
- The endpoint origin is not an AppService — webhook receivers, callback
  endpoints, or static file servers that have no AppService analog.

When written, a manual controller stays **thin** and delegates to an
AppService per Rule 9.2 (line: `HttpApi` Controllers row) — it does not
carry business logic. The decision to deviate from auto-exposure is
recorded in a node-local DEC on the host node (typically a CON node) or
in a component-scoped ADR if it spans multiple CONs.

The Phase 3 merge gate flags any manual controller without a backing DEC
/ ADR justifying the deviation.

---

### Rule 11 — Node-body to service-layer mapping <!-- layers: Domain, Application -->

Every business node has exactly one C# type that carries its body, by
node type:

| Node type | C# type holding the body | Slot |
|---|---|---|
| FLW (flow) | `<AggregateName>Manager` | `Domain/<Module>/<SubModule>/Managers/` |
| QRY (query) | `<AggregateName>Manager` | `Domain/<Module>/<SubModule>/Managers/` |
| CMD (command) | `<AggregateName>Manager` | `Domain/<Module>/<SubModule>/Managers/` |
| CON (wire surface) | `<Page>AppService` (one per portal page; multiple per sectioned/tabbed page — one per section, named `<Page><Section>AppService`) | `Application/<Portal>/` (or `Application/<Portal>/<Page>/` for sectioned pages) |

#### 11.1 Page-AppService composition invariant

A `<Page>AppService` is the BFF-like thin boundary for exactly one portal
page (or one section of a sectioned/tabbed page). It:

- Accepts the page's input DTO(s), authorizes, delegates to one or more
  `<Aggregate>Manager` methods (DomainServices), unwraps each
  `ErrorOr<T>`, and projects to the page's composite output DTO.
- MAY call multiple `<Aggregate>Manager` methods within a single
  AppService method when the page spans more than one aggregate.
- MUST NOT contain business rules, cross-aggregate invariant enforcement,
  or coordination logic that determines which mutations must co-succeed
  — that belongs in a Manager (see [STD-002 § Rule 5](STD-002-dotnet-coding-conventions.md#rule-5--aggregate-root-encapsulation-builder-style-mutation)
  for aggregate-root mutation; cross-aggregate coordination is the
  Manager's responsibility, not the AppService's).

**Simple page:** one `<Page>AppService` composes across all relevant
DomainServices.
**Sectioned/tabbed page:** one `<Page><Section>AppService` per
tab/section, each aligned to a single aggregate's DomainService.

Managers (Domain Services per Rule 9.3) carry the body: entity invariant
enforcement, cross-aggregate coordination, and policy decisions. They
return `ErrorOr<T>` (see STD-002 § ErrorOr Result Pattern) and never throw
on expected failures. QRY bodies that filter, order, or paginate rows
compose them server-side via `IQueryable` (STD-002 Rule 4 — Repository
query discipline) — never via `GetListAsync(predicate)` with in-memory
filtering. Mutation of an aggregate goes through the aggregate's named
methods (STD-002 Rule 5 — Aggregate-root encapsulation) — direct
`entity.Property = value` from inside a Manager is prohibited.

Application Services are **thin orchestration boundaries** — they accept
the input DTO, delegate to the appropriate Manager method(s), unwrap the
returned `ErrorOr<T>`, translate the error branch to `UserFriendlyException`
(per CCC-006), and project the success branch onto the output DTO. They
do not contain business rules. Logging, authorization attributes, and
unit-of-work boundaries belong here; logic does not.

This rule closes the gap left by Rule 9.3, which named the types but did
not bind each node family to a layer. The Phase 2 feat-spec validator
inspects each FLW / QRY / CMD node for a `service_layer:` frontmatter
field (default `domain`); the Phase 3 merge gate scans the implementation
for a Manager method bearing the node's name and flags AppService methods
that carry logic beyond unwrap-and-project.

---

### Rule 12 — `IEntityTypeConfiguration<T>` enforcement (tightens Rule 8 + Rule 9.2) <!-- layers: EntityFrameworkCore -->

Every entity has its own configuration class at the slot Rule 9.2
declares:

`<Project>.EntityFrameworkCore/<Module>/EntityConfigurations/<AggregateName>Configuration.cs`

The DbContext's `OnModelCreating` is restricted to ABP module
configurations plus the assembly-scan registration — nothing else:

```csharp
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);

    builder.ConfigureAbpConventions();      // and other ABP ConfigureXxx() calls
    builder.ApplyConfigurationsFromAssembly(typeof(<Project>DbContext).Assembly);
}
```

Inline `builder.Entity<X>(b => b.ToTable(...).Property(...).HasMaxLength(...))`
blocks inside `OnModelCreating` are **prohibited**. Every persistence
concern (table name, column type, max-length, indexes, owned-type
mapping, value conversions, enum-to-string conversion per Rule 7) moves
into the per-entity configuration class.

The Phase 3 merge gate scans `OnModelCreating` for inline
`builder.Entity<...>` calls and blocks the merge on any hit. Each new
entity also requires its own `<AggregateName>Configuration.cs` file —
missing configuration files block the merge.

---

### Rule 13 — Shared validation / schema constants per module <!-- layers: Domain.Shared, EntityFrameworkCore -->

Each module declares one `Domain.Shared/<Module>/<Module>Consts.cs` file
holding the numeric and pattern literals shared between persistence and
validation:

```csharp
namespace <Project>.<Module>;

public static class <Module>Consts
{
    public const int DepartmentNameMaxLength = 128;
    public const int DepartmentDescriptionMaxLength = 512;
    public const int DoctorPhoneMaxLength = 20;
    public const string PhoneNumberPattern = @"^\+?[1-9]\d{1,14}$";
    public const decimal AppointmentFeeMaxValue = 999_999.99m;
    // ...
}
```

Both layers read from these constants:

- **EF Core** `IEntityTypeConfiguration<T>` classes (per Rule 12) —
  `HasMaxLength`, `HasPrecision`, length-bounded indexes.
- **FluentValidation** validators (per STD-002 § FluentValidation) —
  `MaximumLength`, `Matches`, `InclusiveBetween`, `PrecisionScale`.

Inline numeric literals or regex strings in either layer are
**prohibited** — the Phase 3 merge gate scans both `EntityConfigurations/`
and `Application.Contracts/<Module>/Validators/` for hardcoded
`HasMaxLength(<int-literal>)`, `MaximumLength(<int-literal>)`, and
`Matches("<regex-literal>")` and blocks the merge on hits.

`<Module>Consts.cs` holds **non-localization** values only — pure
numbers, ranges, and regex patterns. User-visible strings live in
`<Module>Keys.cs` (Rule 9.2 amended slot). A module with no shared
constants does not require the file until the first constant is
introduced.

---

### Rule 14 — Typed ABP exceptions only; HTTP status mapping <!-- layers: Application -->

**Anchor:** [CCC-006](../../docs/shared/ccc/CCC-006-exception-handling.md)
(baseline; companion to STD-002 R1 — ErrorOr is the preferred path,
this rule governs the residual direct-throw cases).
*(`deferred_until` — project bootstrap creates this CCC at
`docs/shared/ccc/`; engine cite is a forward reference until then.)*

Raw `throw new Exception(...)` and `throw new ApplicationException(...)`
are **prohibited solution-wide**. When code must throw directly (e.g.,
a guard clause on a repository miss where no Manager sits between the
AppService and the data, or a framework-imposed exception type),
exactly one of the typed exceptions below applies — and the HTTP
status is fixed by the exception type, never overridden.

| Exception type | HTTP status | Use when |
|---|---|---|
| `UserFriendlyException` | 400 | AppService unwrap of an `ErrorOr<T>` error branch (per STD-002 R1) or any other AppService-boundary message intended for the end user |
| `BusinessException` | constructor `code` arg drives 4xx | Codified business error with a stable `code` resolved to a `<Module>Keys` constant; status set by the exception's `Code`-keyed mapping |
| `AbpValidationException` | 400 | DTO-level validation failure (raised by ABP's validation filter — never thrown by hand) |
| `AbpAuthorizationException` | 403 | Authorization check failed at any layer (raised by ABP — do not catch and re-wrap) |
| `EntityNotFoundException` | 404 | Repository `GetAsync` miss surfaced directly (no Manager between AppService and repo) |
| `AbpDbConcurrencyException` | 409 | Optimistic concurrency stamp mismatch (raised by ABP — do not catch) |
| _unhandled_ | 500 | Anything else falls through ABP's `ExceptionHandlingMiddleware` and is logged as an unexpected fault |

ABP's `ExceptionHandlingMiddleware` is the **only** global exception
middleware. Custom `IMiddleware` implementations that catch all
exceptions, transform the response, or duplicate the
status-code-mapping table are prohibited; extensions go through ABP's
filter pipeline or `IExceptionSubscriber`.

The Phase 3 merge gate greps for `throw new (System\.)?Exception\(`,
`throw new ApplicationException\(`, and any custom `IMiddleware`
implementation whose body inspects the catch-all `Exception` type —
hits block the merge.

---

### Rule 15 — Authorization placement and grouping <!-- layers: Application.Contracts, Application -->

**Anchor:** [CCC-002](../../docs/shared/ccc/CCC-002-authorization.md).

`[Authorize(<Project>Permissions.<Name>)]` applies at the
**AppService method or class level only** — never on a Domain Manager
method, an entity, a specification, or any domain-layer type. Domain
Managers stay authorization-agnostic; the AppService is the
authorization boundary.

Permission constants live in a **single per-project file** at the Rule 9.2
slot (`Application.Contracts/Permissions/<Project>Permissions.cs`),
organised into nested static sub-classes one level per portal, one level
per page, with leaf string constants per action. The wire pattern is
`<Project>.<Portal>.<Page>.<Action>` (e.g.
`TradeFinance.AdminPortal.Users.Create`) — symmetric with the page-driven
AppService shape (R9.2, R11, R11.1):

```csharp
public static class TradeFinancePermissions
{
    public const string GroupName = "TradeFinance";

    public static class AdminPortal
    {
        public static class Users
        {
            public const string Default = GroupName + ".AdminPortal.Users";
            public const string Create  = Default + ".Create";
            public const string Edit    = Default + ".Edit";
            public const string Delete  = Default + ".Delete";
        }

        public static class BgRequests
        {
            public const string Default = GroupName + ".AdminPortal.BgRequests";
            public const string Submit  = Default + ".Submit";
            public const string Approve = Default + ".Approve";
        }
    }
}
```

Inline string literals at `[Authorize("...")]` call sites are
**prohibited** — every attribute argument resolves to a constant.

The `<Project>PermissionDefinitionProvider` (e.g.
`TradeFinancePermissionDefinitionProvider`) registers every group and
permission definition and **is** the canonical authorization surface.
Scattered `IAuthorizationService.AuthorizeAsync(...)` checks inside
Domain Managers are prohibited; AppService methods declare their
permission via the attribute, and granular per-resource policy checks
that cannot be expressed as an attribute use the AppService-injected
`IAuthorizationService` (still at the AppService layer, never deeper).

Anonymous endpoints opt in explicitly with `[AllowAnonymous]`.

The Phase 3 merge gate greps for `[Authorize` on any class or method
whose containing type ends in `Manager`, and for
`[Authorize("<string-literal>")]` (inline literal). Hits block the
merge.

**PERM authoring threshold.** The bare presence of a permission name does
not by itself warrant a PERM node — see
[`../_templates/nodes/PERMISSION.md`](../_templates/nodes/PERMISSION.md)
for when to inline on the actor vs. promote to PERM.

---

### Rule 16 — Soft-delete data filter discipline <!-- layers: Domain, Application, EntityFrameworkCore -->

**Anchor:** [CCC-012](../../docs/shared/ccc/CCC-012-soft-delete-and-retention.md).
Companion to Rule 2 (`FullAudited*` base classes implicitly enable
`ISoftDelete`).

ABP's `ISoftDelete` data filter is **automatic** — repository queries
against an `ISoftDelete`-implementing entity (implicit on `FullAudited*`)
exclude soft-deleted rows without the caller writing a predicate.
Manual `.Where(x => !x.IsDeleted)` or `.Where(x => x.IsDeleted == false)`
in repository, Manager, or AppService code is **prohibited** — it
duplicates filter logic the framework already provides and silently
breaks the explicit-include path.

The only sanctioned escape is the explicit-disable block, used when a
query must see soft-deleted rows (administrative exports, restore
flows, retention-audit reports):

```csharp
using (_dataFilter.Disable<ISoftDelete>())
{
    var allRequests = await _repository.GetListAsync();
    // allRequests includes soft-deleted rows
}
```

The Phase 3 merge gate greps repository / Manager / AppService code
for the `IsDeleted` token inside a LINQ `Where` clause that is **not**
contained in an `IDataFilter.Disable<ISoftDelete>()` `using` block —
hits block the merge.

---

### Rule 17 — Audit logging via ABP audit module, not `ILogger` <!-- layers: Application, EntityFrameworkCore -->

**Anchor:** [CCC-004](../../docs/shared/ccc/CCC-004-auditing.md).
Logging-side mirror: [STD-006 Rule 6](STD-006-logging-conventions.md).
*(`deferred_until` — project bootstrap creates this CCC at
`docs/shared/ccc/`; engine cite is a forward reference until then.)*

Entity-change audit trails (who changed what, when, with what
before/after values) flow through ABP's audit-logging module —
`IAuditingStore` (default DB-backed via the audit-logging EF module),
the `[Audited]` attribute on application services or specific entity
properties, and module-level `Configure<AbpAuditingOptions>(...)`.
Application Services are audited by default per ABP convention; the
configuration declares which entities also record property-level
diffs.

Manual `_logger.LogInformation("User {UserId} changed entity {Id}…")`
lines written for audit purposes are **prohibited** — see STD-006 R6
for the logging-side enforcement. Rule 17 is the **structural** rule
(use the audit module's pipeline); STD-006 R6 is the logging-discipline
mirror that fires when the `_logger` call site is the symptom.

The Phase 3 merge gate cross-references STD-006 R6 to avoid duplicate
flagging — Rule 17 fires when a class is structurally
`[Audited]`-eligible (an AppService touching an aggregate root marked
for audit per the FRS) but the module's `AbpAuditingOptions` block is
missing the corresponding `EntityHistorySelectors.AddAllEntities()` /
selector entry.

## Consequences

This standard constrains every ENT, CMD, QRY, FLW, and CON node authored in any ABP/.NET
project under this methodology. Specifically:

- **Phase 1.5 FRS validation** — the validator checks the built-in catalog before any
  FRS declares a new entity. Catalog hits become `builtin_collision` conflicts that halt
  progression.
- **Phase 2 feat-spec validator** — every staged entity node must carry `Base class:`
  and `Base class rationale:`. Every query must specify compliant input/output wrappers.
  Every output DTO must mirror its entity's audit level. Every FLW / QRY / CMD node
  carries `service_layer:` (Rule 11). Non-PascalCase identifiers and duplicate enum
  declarations block gate passage.
- **Phase 3 merge gate** — the implementation's base class must match the staged node's
  declaration. File names, folder paths, namespace alignment, ABP suffixes, DTO suffixes,
  table names, FK columns, and migration names are all scanned. Additionally:
  - Manual `[ApiController]` classes without a backing DEC / ADR are flagged
    (Rule 10).
  - FLW / QRY / CMD bodies that live in an AppService rather than a Manager — or
    AppService methods carrying logic beyond unwrap-and-project — are flagged
    (Rule 11).
  - Inline `builder.Entity<X>(...)` blocks inside `OnModelCreating` are flagged;
    missing `<AggregateName>Configuration.cs` files are flagged (Rule 12).
  - Hardcoded `HasMaxLength(<int>)`, `MaximumLength(<int>)`, `Matches("<regex>")`
    in EF configurations or FluentValidation validators are flagged (Rule 13).
  - String literals inside ErrorOr `Error.<Factory>(...)` calls or FluentValidation
    `.WithMessage(...)` calls that don't reference `<Module>Keys` constants are
    flagged (Rule 9.2 amended slot — see STD-002 § Localization-key constants).
  - `throw new Exception(...)`, `throw new ApplicationException(...)`, and
    custom global exception middleware impls are flagged (Rule 14). Direct-throw
    cases must use one of the typed ABP exceptions in the Rule 14 mapping table.
  - `[Authorize]` on a `<Aggregate>Manager`-suffixed class or method is flagged;
    `[Authorize("<string-literal>")]` with an inline literal (rather than a
    `<Project>Permissions.<Name>` constant) is flagged (Rule 15).
  - `IsDeleted` referenced inside a LINQ `Where` clause in repository / Manager /
    AppService code that is not contained in an
    `IDataFilter.Disable<ISoftDelete>()` `using` block is flagged (Rule 16).
  - An AppService structurally eligible for `[Audited]` (touching an aggregate
    root the FRS marks for audit) with no matching
    `Configure<AbpAuditingOptions>(...)` entry is flagged (Rule 17, cross-
    referenced with STD-006 R6 on the logging side).

  Any hit blocks the merge.

## Project-specific deviations

Any deviation from a rule in this standard must be recorded in a component-scoped ADR
that back-links to STD-005 via `related_standards: [STD-005]` in its frontmatter. The
ADR explains why the deviation is justified and what the narrower rule is.

## Revisit if

- The project migrates from ABP Framework to vanilla ASP.NET Core or another .NET
  application framework (at that point STD-002 becomes the primary standard and this
  one narrows or retires).
- The upstream catalogs (`abp-built-in-entities.md`, `abp-base-classes.md` in the
  `generate-feat-spec` skill) gain new built-ins or base classes — update Rule 1 and
  Rule 2 accordingly and log a `status-change` entry in `sdlc/standards/log.md`.
