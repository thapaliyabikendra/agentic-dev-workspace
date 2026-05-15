---
id: STD-005
title: ABP framework coding conventions
status: accepted
created: 2026-05-15
updated: 2026-05-15
supersedes: null
superseded_by: null
tags: [abp, dotnet, entity, dto, naming, conventions, validation]
scope: engine
source: guidelines/abp-guidelines.md
related_adrs: []
---

# STD-005: ABP framework coding conventions

> **Engine-level technical standard.** Applies to any .NET project using
> ABP Framework under this methodology. Project-specific deviations are
> component-scoped ADRs that back-link here; node-local atomic decisions
> are DECs. See [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md)
> for the Standard / ADR / DEC discriminator.
>
> Source material: [`../../guidelines/abp-guidelines.md`](../../guidelines/abp-guidelines.md).
> When this standard and any component ADR disagree, the ADR wins — flag
> the drift back here so the standard can be updated.

## Scope

Entity and value-object base-class selection; DTO base-class mirroring;
query input/output wrappers; companion entity pattern for ABP built-in
extensions; property naming (PascalCase); bounded-value modelling (C# enums);
data-annotation placement; file, folder, type-suffix, and database object
naming. Applies to all ABP/.NET projects using this methodology. STD-001
and STD-002 govern the framework-agnostic DDD and .NET rules; this standard
governs the ABP-specific layer on top.

## Standards

### Rule 1 — Built-in entity catalog is consulted before any Entity is synthesised

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
| audit who-changed-what-when, change history | rely on `AuditedAggregateRoot` / `FullAuditedAggregateRoot` + ABP entity-change tracking — no `AuditLog` entity node |
| tenant, company-as-tenant | reference `Tenant` — no `Company` entity node |
| permission, access right | declare in `PermissionDefinitionProvider` — no `Permission` entity node |
| feature flag, feature quota | declare a `FeatureDefinition` — no `Feature` entity node |
| setting, configuration value | declare a `SettingDefinition` — no `Setting` entity node |
| file upload, document storage, attachment | Integration entry against `BlobContainer` / `BlobInfo`; companion entity only when business metadata beyond the blob is tracked |
| background job, async task | Actor entry `System: BackgroundJob: <JobName>` + reference `AbpBackgroundJobs` — no `BackgroundJob` entity node |
| send email / send SMS | Integration entry against ABP `EmailingModule` / `SmsModule` — no entity |
| current user, logged-in user | use `ICurrentUser` from the application layer — never modelled as an entity |

---

### Rule 2 — Every entity declares its base class and rationale

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
| `IMultiTenant` | Aggregate is tenant-scoped (the project default). Adds nullable `TenantId`. Omit only on global lookups documented in an ADR. |
| `IHasConcurrencyStamp` | FRS mentions optimistic locking or concurrent edits. |
| `ISoftDelete` | Implicit on `FullAudited*`. Add explicitly only on non-`FullAudited` bases with a delete/archive use case. |
| `IHasExtraProperties` | Implicit on `AggregateRoot*`; explicit on `BasicAggregateRoot` when the object-extension system is used. |

---

### Rule 3 — DTOs mirror the entity's audit level

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

### Rule 4 — Query inputs and outputs use the standard request/result wrappers

Phase 2 feat-specs default to:
- **Query input** extends `PagedAndSortedResultRequestDto`.
- **Query output** is wrapped in `PagedResultDto<TDto>`.

Use `LimitedResultRequestDto` only when paging is explicitly out of scope (a fixed-size lookup). Use `ListResultDto<TDto>` only when the result set is bounded, small, and a total count is unnecessary. Any deviation is recorded in a DEC attached to the query.

---

### Rule 5 — Companion entity pattern for project extensions to built-ins

When the project needs fields beyond what an ABP built-in stores:

- Synthesise a milestone entity (e.g., `UserProfile`, `TenantConfiguration`, `AttachmentMetadata`).
- Give it its own primary key.
- Reference the built-in via the appropriate foreign-key field (`UserId: Guid`, `TenantId: Guid`, `BlobId: Guid`).
- Do **not** re-define fields the built-in already owns (`Email`, `UserName`, `Name`, `IsActive`).
- Pick the base class per Rule 2 and the DTO per Rule 3.

A companion entity is a regular aggregate root — it goes through the same template, validation, and Phase 2 staging as any other entity.

---

### Rule 6 — Property names use PascalCase

Every property on an entity, owned-type, value object, or DTO is named in **PascalCase** (`ReferenceNumber`, `BeneficiaryNature`, `BgNumber`).

- **No `snake_case`** on backend entities. Snake-case appears only in the **Brownfield notes** section, recording the legacy source name the PascalCase property maps to.
- **No `camelCase`** on backend properties. JSON serialisation emits `camelCase` over the wire (ABP default), but the C# property name is `PascalCase`.
- **Acronyms ≥ 3 letters are PascalCase** (`BgNumber`, `CbsResponse`, `MT760Body`), not all-caps (`BGNumber`, `CBSResponse`). Two-letter acronyms (`ID`) are uppercase by convention but PascalCase in compound names (`BgId`, `ApplicantPan`).
- **Boolean properties** read as predicates: `IsActive`, `IsDraft`, `HasMargin`. Avoid bare nouns (`Active`, `Draft`).
- **Nullable shape** is on the C# type (`string?`, `Guid?`), not in the property name.

The Phase 2 feat-spec validator flags any non-PascalCase identifier in a staged entity, owned-type, or DTO.

---

### Rule 7 — Bounded-value fields are C# enums

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

### Rule 8 — No data annotations on domain entities

Every persistence concern (table name, column type, max length, owned-type mapping) lives in the `IEntityTypeConfiguration<T>` class in the `EntityFrameworkCore` project. Domain entities stay POCO. DataAnnotations live on **input DTOs only**.

---

### Rule 9 — File and table naming conventions

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
| `Domain.Shared` | `<Module>/<ModuleName>Errors.cs` | error code constants |
| `EntityFrameworkCore` | `<Module>/EntityConfigurations/<AggregateName>Configuration.cs` | `IEntityTypeConfiguration<T>` |
| `EntityFrameworkCore` | `<RootNamespace>DbContext.cs` | DbContext — one per solution |
| `EntityFrameworkCore` | `Migrations/<UtcTimestamp>_<DescriptiveName>.cs` | EF Core migrations |
| `Application.Contracts` | `<Module>/<SubModule>/AppServices/I<AggregateName>AppService.cs` | AppService interfaces |
| `Application.Contracts` | `<Module>/<SubModule>/Dtos/<DtoName>Dto.cs` | all DTOs (input + output) |
| `Application.Contracts` | `Permissions/<Module>Permissions.cs` | permission constants |
| `Application` | `<Module>/<SubModule>/AppServices/<AggregateName>AppService.cs` | AppService implementations |
| `Application` | `<Module>/<SubModule>/AutoMapperProfiles/<AggregateName>AutoMapperProfile.cs` | AutoMapper profiles |
| `HttpApi` | `Controllers/<Module>/<AggregateName>Controller.cs` | controllers (thin; delegate to AppService) |

`<Module>` = bounded-context folder in PascalCase (`BankGuarantee`, `LetterOfCredit`). `<SubModule>` = feature group (`Issuance`, `Claims`). Omit `<SubModule>` when a module has only one feature group.

#### 9.3 Type-name suffix conventions

| Type | Suffix | Example |
|---|---|---|
| Aggregate root | (none) | `BgRequest` |
| Domain service / factory | `Manager` | `BgRequestManager` |
| Domain event | `Event` | `BgRequestCreatedEvent` |
| Integration event | `Eto` | `BgRequestCreatedEto` |
| AppService impl | `AppService` | `BgRequestAppService` |
| AppService interface | `I` + `AppService` | `IBgRequestAppService` |
| Output DTO | `Dto` | `BgRequestDto`, `BgRequestDetailDto` |
| Input DTO (command) | `Dto` | `CreateBgRequestDto`, `ApproveBgRequestDto` |
| Combined create+update DTO | `Dto` | `CreateUpdateBgRequestDto` |
| Query input DTO | `Dto` | `GetBgRequestListDto` |
| EF configuration | `Configuration` | `BgRequestConfiguration` |
| AutoMapper profile | `AutoMapperProfile` | `BgRequestAutoMapperProfile` |
| Specification | `Specification` | `ActiveBgRequestSpecification` |
| Background job | `Job` | `CbsRetryJob` |
| Background worker | `Worker` | `CbsOutboxWorker` |
| Controller | `Controller` | `BgRequestController` |
| Permission constants class | `Permissions` | `BankGuaranteePermissions` |
| Permission definition provider | `PermissionDefinitionProvider` | `TradeFinancePermissionDefinitionProvider` |

ABP suffix conventions (`AppService`, `Controller`, `PermissionDefinitionProvider`, `Eto`, `AutoMapperProfile`) are non-negotiable — renaming breaks DI registration or endpoint discovery. **All DTOs end in `Dto` — no `Input` or `Request` suffixes.**

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

## Consequences

This standard constrains every ENT, CMD, QRY, and CON node authored in any ABP/.NET
project under this methodology. Specifically:

- **Phase 1.5 FRS validation** — the validator checks the built-in catalog before any
  FRS declares a new entity. Catalog hits become `builtin_collision` conflicts that halt
  progression.
- **Phase 2 feat-spec validator** — every staged entity node must carry `Base class:`
  and `Base class rationale:`. Every query must specify compliant input/output wrappers.
  Every output DTO must mirror its entity's audit level. Non-PascalCase identifiers and
  duplicate enum declarations block gate passage.
- **Phase 3 merge gate** — the implementation's base class must match the staged node's
  declaration. File names, folder paths, namespace alignment, ABP suffixes, DTO suffixes,
  table names, FK columns, and migration names are all scanned. Any hit blocks the merge.

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
