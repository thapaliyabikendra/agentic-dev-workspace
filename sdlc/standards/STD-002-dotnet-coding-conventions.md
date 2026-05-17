---
id: STD-002
title: Engine-level .NET implementation conventions
status: accepted
created: 2026-05-13
updated: 2026-05-17
supersedes: null
superseded_by: null
tags: [dotnet, application-layer, errororstd, validation, localization, repository-query, encapsulation]
scope: engine
applies_when:
  stack: [api]
source: seed
related_adrs: []
---

# STD-002: Engine-level .NET implementation conventions

> **Engine-level technical standard.** Applies to any .NET API project
> using this methodology — applicability is declared in `applies_when:
> { stack: [api] }`. Project-specific deviations are ADRs that back-link
> here; node-local atomic decisions are DECs. See
> [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) for the
> STD / ADR / CCC / DEC discriminator.
>
> **ABP-specific bindings.** Where this standard references ABP types
> (`UserFriendlyException`, `IStringLocalizer<TResource>`, AppService
> auto-discovery), the binding is conditional: an ABP project consumes
> the example verbatim; a vanilla ASP.NET Core project substitutes its
> framework's equivalent (custom exception filter, MEL
> `IStringLocalizer`, manual validator registration). The pattern is
> framework-agnostic; the concrete API names are not.

## Scope

Result-pattern contract for the application layer (`ErrorOr<T>`), input
validation pipeline (FluentValidation), user-facing string externalisation
(`IStringLocalizer<TResource>` with shared per-module key constants),
repository query composition (`IQueryable` + `WhereIf` — no in-memory
filter / page / sort), and aggregate-root encapsulation (private-write
properties + named mutation methods). Additional framework-agnostic .NET
concerns — async / await naming, DI container conventions, LINQ vs loop
guidance, cancellation-token discipline — remain deferred to follow-up
sections. STD-005 carries the ABP-specific layer (file slots, layer
mapping, base classes); this standard governs the framework-agnostic
patterns that STD-005's rules consume.

## Standards

### Rule 1 — ErrorOr Result Pattern (Domain Service contract)

**Anchor:** [CCC-006](../../docs/shared/ccc/CCC-006-exception-handling.md)
(baseline). Companion STD-005 rules: Rule 11 (Manager carries node body),
Rule 9.2 amended slot (`<Module>Keys.cs`).

#### 1.1 Manager return type

Every Domain Manager method that can fail on **expected** outcomes
(business rule violation, conflict, not-found, forbidden) returns
`ErrorOr<T>`. Manager methods do not throw on expected failures —
exceptions are reserved for infrastructure faults and programmer error.

```csharp
public class DepartmentManager : DomainService
{
    private readonly IRepository<Department, Guid> _repo;

    public DepartmentManager(IRepository<Department, Guid> repo) => _repo = repo;

    public async Task<ErrorOr<Department>> CreateAsync(
        string name, string description, CancellationToken ct = default)
    {
        if (await _repo.AnyAsync(d => d.Name == name, ct))
        {
            return Error.Conflict(
                code: PatientPortalKeys.DepartmentNameAlreadyExists,
                description: "Department name already exists.");
        }

        var department = new Department(GuidGenerator.Create(), name, description);
        await _repo.InsertAsync(department, cancellationToken: ct);
        return department;
    }
}
```

#### 1.2 Semantic factory methods

Construct errors via `ErrorOr`'s semantic factories. The choice of
factory drives the HTTP status the AppService boundary projects (see
Rule 1.4):

| Factory | When | AppService maps to |
|---|---|---|
| `Error.Validation(code, description)` | input shape passes validators but fails a domain rule | HTTP 400 |
| `Error.Conflict(code, description)` | invariant violated (duplicate, optimistic-concurrency clash) | HTTP 409 |
| `Error.NotFound(code, description)` | referenced entity absent | HTTP 404 |
| `Error.Forbidden(code, description)` | authorization passed but operation forbidden by policy | HTTP 403 |
| `Error.Unexpected(code, description)` | unreachable / coding-error branch | HTTP 500 |

The `code` argument is a **localization-key string constant** from the
module's `<Module>Keys.cs` file (Rule 3 — Localization-key constants).
Inline string literals as the `code` are prohibited; the merge gate
flags them.

The `description` argument is an internal-developer-facing diagnostic
string (used in logs, never shown to end users) and may be a plain
inline literal.

#### 1.3 ErrorOr boundary — never past the AppService

`ErrorOr<T>` types do **not** appear in:

- `Application.Contracts/` DTOs (input or output) — DTOs carry the
  success-branch shape only.
- AppService interfaces (`I<Aggregate>AppService`) — the interface
  return type is `T` (or `Task<T>`), not `ErrorOr<T>`. The unwrap
  happens inside the AppService implementation.
- `HttpApi/` controllers — auto-controllers consume the AppService
  return type directly; manual controllers re-throw the
  `UserFriendlyException` raised at the AppService boundary.
- The wire payload — clients receive ABP's `UserFriendlyException`
  envelope (`{ error: { code, message, details } }`), not an `ErrorOr`
  shape.

#### 1.4 AppService unwrap pattern

The AppService delegates to the Manager, unwraps the `ErrorOr<T>`, and
translates the error branch:

```csharp
public class DepartmentAppService : ApplicationService, IDepartmentAppService
{
    private readonly DepartmentManager _manager;
    private readonly IStringLocalizer<PatientPortalResource> _l;

    public DepartmentAppService(
        DepartmentManager manager,
        IStringLocalizer<PatientPortalResource> l)
    {
        _manager = manager;
        _l = l;
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto input)
    {
        var result = await _manager.CreateAsync(input.Name, input.Description);

        if (result.IsError)
        {
            var error = result.FirstError;
            throw new UserFriendlyException(
                message: _l[error.Code],
                code: error.Code);
        }

        return ObjectMapper.Map<Department, DepartmentDto>(result.Value);
    }
}
```

Notes:

- `_l[error.Code]` resolves the localization key to the user-facing
  string (Rule 3); the error code is the key.
- `UserFriendlyException`'s `code` parameter surfaces in ABP's response
  envelope and gives the frontend a stable machine-readable identifier
  independent of locale.
- HTTP status comes from ABP's mapping of `UserFriendlyException` plus
  any explicit `HttpStatusCode` overload — or, in custom exception
  filters, from inspecting the `ErrorType`.

On non-ABP ASP.NET Core projects, substitute `UserFriendlyException`
with a project-defined exception type whose filter translates it to the
matching HTTP status.

#### 1.5 Multiple errors

When the Manager surfaces multiple errors in one call (e.g., a batch
operation), iterate `result.Errors` instead of `FirstError` and project
each onto a localized message. AppService still throws a single
exception — bundle them into a `ValidationException`-shaped payload or
fold to the most severe.

---

### Rule 2 — FluentValidation (AppService input validation)

**Anchor:** [CCC-005](../../docs/shared/ccc/CCC-005-validation.md)
(baseline). Companion STD-005 rules: Rule 13 (`<Module>Consts.cs` for
length / range / pattern values), Rule 9.2 amended slot
(`<Module>Keys.cs` for message keys).

#### 2.1 Validator type and slot

Every input DTO carries a FluentValidation validator inheriting
`AbstractValidator<TDto>`. The validator lives at:

`<Project>.Application.Contracts/<Module>/Validators/<Dto>Validator.cs`

(per STD-005 Rule 9.2 — the `Application.Contracts` / `Validators/`
slot). ABP auto-discovers validators registered in the contracts module
— no manual registration is required.

```csharp
public class CreateDepartmentDtoValidator : AbstractValidator<CreateDepartmentDto>
{
    public CreateDepartmentDtoValidator(IStringLocalizer<PatientPortalResource> l)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(l[PatientPortalKeys.DepartmentNameRequired])
            .MaximumLength(PatientPortalConsts.DepartmentNameMaxLength)
                .WithMessage(l[PatientPortalKeys.DepartmentNameTooLong]);

        RuleFor(x => x.Description)
            .MaximumLength(PatientPortalConsts.DepartmentDescriptionMaxLength)
                .WithMessage(l[PatientPortalKeys.DepartmentDescriptionTooLong])
            .When(x => x.Description is not null);

        RuleFor(x => x.PhoneNumber)
            .Matches(PatientPortalConsts.PhoneNumberPattern)
                .WithMessage(l[PatientPortalKeys.DepartmentPhoneInvalid])
            .When(x => x.PhoneNumber is not null);
    }
}
```

#### 2.2 No magic numbers; no inline messages

Every numeric / pattern argument to a FluentValidation rule reads from
the module's `<Module>Consts.cs` (STD-005 Rule 13). Every
`.WithMessage(...)` argument reads from `_l[<Module>Keys.<Name>]`
(Rule 3 below). Inline integer literals or inline string messages
inside validators are prohibited — the Phase 3 merge gate scans
`Application.Contracts/<Module>/Validators/` for hits and blocks the
merge.

#### 2.3 Cross-field rules

Cross-field validation rules (one DTO field's value constrains
another's) belong on the validator if the rule is purely structural
(field A required when field B present). When the rule references
domain state (e.g., "department code is unique"), move it into the
Manager and surface as `Error.Validation(...)` per Rule 1 — the
validator runs before the Manager sees the call and cannot read
repository state safely.

#### 2.4 Validation failure path

ABP's pipeline catches validator failures and surfaces them as
`AbpValidationException` → HTTP 400 with a structured error body. This
is the **input-shape** error path; **domain-rule** errors travel via
`ErrorOr → UserFriendlyException` per Rule 1. The two paths produce
different envelope shapes; do not blur them.

#### 2.5 Mandatory-validator enforcement

Every input DTO in `<Project>.Application.Contracts/<Module>/Dtos/` has
a corresponding validator. An "input DTO" is any DTO whose class name
starts with `Create`, `Update`, `Book`, `Cancel`, `Approve`, `Reject`,
`Submit`, `Assign`, or ends with `…ListDto` (query input request).
Output DTOs (`<Aggregate>Dto`, `<Aggregate>SummaryDto`,
`<Aggregate>DetailDto`) are exempt — they carry no input shape.

| Input-DTO surface | Required sibling validator |
|---|---|
| `BookAppointmentDto` | `BookAppointmentDtoValidator : AbstractValidator<BookAppointmentDto>` |
| `GetAppointmentsByPhoneDto` (query input) | `GetAppointmentsByPhoneDtoValidator` |
| `CreateDepartmentDto` | `CreateDepartmentDtoValidator` |

The validator slot is fixed by STD-005 Rule 9.2:
`<Project>.Application.Contracts/<Module>/Validators/<DtoName>Validator.cs`.

Field-level `[Required]` / `[StringLength]` / `[RegularExpression]`
annotations on the DTO are acceptable **in addition to** the validator
but do not replace it — cross-field structural rules (per 2.3) and
`<Module>Consts` / `<Module>Keys` constant references (per 2.2) only
live in the validator. The merge gate enumerates each input DTO under
`Application.Contracts/<Module>/Dtos/` and blocks the merge when no
matching `<DtoName>Validator.cs` exists in
`Application.Contracts/<Module>/Validators/`.

---

### Rule 3 — Localization-key constants

**Anchor:** [CCC-007](../../docs/shared/ccc/CCC-007-localization.md)
(baseline). Companion STD-005 rule: Rule 9.2 amended slot
(`Domain.Shared/<Module>/Localization/<Module>Keys.cs`).

#### 3.1 The constants file

Each module declares one localization-keys class at
`Domain.Shared/<Module>/Localization/<Module>Keys.cs`:

```csharp
namespace <Project>.<Module>.Localization;

public static class <Module>Keys
{
    public const string DepartmentNotFound          = "PatientPortal:Department:NotFound";
    public const string DepartmentNameAlreadyExists = "PatientPortal:Department:NameAlreadyExists";
    public const string DepartmentNameRequired      = "PatientPortal:Department:NameRequired";
    public const string DepartmentNameTooLong       = "PatientPortal:Department:NameTooLong";
    public const string DepartmentDescriptionTooLong= "PatientPortal:Department:DescriptionTooLong";
    public const string DepartmentPhoneInvalid      = "PatientPortal:Department:PhoneInvalid";
    public const string DoctorNotFound              = "PatientPortal:Doctor:NotFound";
    // ...
}
```

Every constant **value** is the same string used as a key in the
project's resource JSON files (`en.json`, `np.json`, …).

#### 3.2 Key-naming convention

`<Module>:<Resource>:<Concern>` — colon-separated, PascalCase segments
matching the domain noun.

- `<Module>` matches the bounded-context folder name from STD-005
  Rule 9.2 (e.g., `PatientPortal`, `BankGuarantee`).
- `<Resource>` is the aggregate or entity name in singular form
  (`Department`, `Doctor`, `BgRequest`).
- `<Concern>` is the failure / validation / message kind in PascalCase
  (`NotFound`, `AlreadyExists`, `NameTooLong`, `PhoneInvalid`,
  `Created`, `Approved`).

Examples:

```
PatientPortal:Department:NotFound
PatientPortal:Doctor:NameTooLong
BankGuarantee:BgRequest:AlreadyApproved
```

#### 3.3 Resource files (1:1 with constants)

Every constant value has a corresponding entry in `en.json` (the base
resource), and every `en.json` entry backs a constant. The English
file lives alongside the project resource declared in CCC-007 —
typically `<Project>.Domain.Shared/Localization/<Project>/en.json`.

```json
{
  "culture": "en",
  "texts": {
    "PatientPortal:Department:NotFound": "Department not found.",
    "PatientPortal:Department:NameAlreadyExists": "A department with this name already exists.",
    "PatientPortal:Department:NameRequired": "Department name is required.",
    "PatientPortal:Department:NameTooLong": "Department name cannot exceed {0} characters.",
    "PatientPortal:Department:DescriptionTooLong": "Description cannot exceed {0} characters.",
    "PatientPortal:Department:PhoneInvalid": "Phone number is not in a recognized format."
  }
}
```

Additional locales (`np.json`, `hi.json`, …) translate the values and
keep the same keys.

#### 3.4 Dynamic values via `{0}` placeholders

Runtime values (lengths, counts, identifiers) flow through `{0}`,
`{1}`, … placeholders — never via string concatenation against a
translated fragment. The placeholder arguments are passed positionally
to `IStringLocalizer`:

```csharp
_l[PatientPortalKeys.DepartmentNameTooLong, PatientPortalConsts.DepartmentNameMaxLength]
// → "Department name cannot exceed 128 characters."
```

#### 3.5 Resolution surface

The single resolution mechanism is
`IStringLocalizer<<Project>Resource>` (per CCC-007). On ABP, the
project declares one `<Project>Resource` class registered with the
`AbpLocalizationOptions`. On non-ABP ASP.NET Core, the Microsoft
Extensions Localization `IStringLocalizer<T>` substitutes — the
indexing API and key resolution semantics are identical.

#### 3.6 Single source of truth for error codes

Because `ErrorOr` error codes (Rule 1.2) and FluentValidation messages
(Rule 2.2) both index into the same `<Module>Keys` class, **error
codes ARE localization keys**. There is no parallel `<Module>Errors.cs`
file (the pre-2026-05-17 STD-005 Rule 9.2 slot was renamed and
broadened — see STD-005 Rule 9.2 note).

The Phase 3 merge gate scans:

- `Error.<Factory>(code: <string-literal>, ...)` — flagged unless the
  literal is `nameof(<Module>Keys.<Member>)` or a direct reference to
  a `<Module>Keys.<Member>` constant.
- `.WithMessage("<string-literal>")` — flagged unless the argument is
  an `_l[<Module>Keys.<Member>]` indexer call.

---

### Rule 4 — Repository query discipline (`IQueryable` + `WhereIf`)

**Anchor:** none — engine convention. Companion STD-005 rule: Rule 11
(Manager carries node body). Companion STD-005 Rule 16 (soft-delete
data-filter discipline) — `IQueryable` composition respects the ABP
data filter exactly as `GetListAsync` does.

#### 4.1 Read path — server-side composition then materialise

Manager / repository code that **filters, orders, or paginates** rows
composes the query server-side via `IQueryable<T>`. The materialising
call is the last step.

```csharp
public async Task<ErrorOr<PagedResultDto<Appointment>>> GetByPhoneAsync(
    GetAppointmentsByPhoneDto input, CancellationToken ct = default)
{
    var query = await _appointmentRepo.GetQueryableAsync();

    query = query
        .Where(a => a.PatientProfileId == input.PatientProfileId)
        .WhereIf(input.FilterMode == "date-window",
            a => a.AppointmentDateTime >= input.From!.Value &&
                 a.AppointmentDateTime <= input.To!.Value)
        .WhereIf(input.FilterMode == "active",
            a => a.Status == AppointmentStatus.Pending ||
                 a.Status == AppointmentStatus.Confirmed);

    var totalCount = await AsyncExecuter.LongCountAsync(query, ct);
    var items = await AsyncExecuter.ToListAsync(
        query.OrderBy(input.Sorting ?? nameof(Appointment.AppointmentDateTime))
             .PageBy(input),
        ct);

    return new PagedResultDto<Appointment>(totalCount, items);
}
```

#### 4.2 Prohibited shapes

- `GetListAsync(<predicate>)` where the predicate is **conditional**,
  the result is paginated, or the row count is unbounded.
- `.ToList()` / `.Where(...)` / `.OrderBy(...)` / `.Skip(...)` /
  `.Take(...)` applied to a **materialised** `List<T>` to implement
  filter / order / page semantics. Materialisation is the last step,
  not the first.
- Multiple round-trips that fetch and then re-query in memory when one
  composed `IQueryable` expresses the same intent (e.g.,
  `GetListAsync()` followed by `.Select(x => x.Id).ToList()` followed
  by another `GetListAsync(x => ids.Contains(x.Id))`).

#### 4.3 Bounded-lookup exemption

Bounded reference / lookup tables — fixed small row count by design,
documented in the entity node body — may use `GetListAsync()`
(no predicate). Record the row-count budget in a one-line code comment
on the call:

```csharp
// bounded: ≤ 50 active departments (FRS-004 § Reference data)
var departments = await _departmentRepo.GetListAsync();
```

Anything else uses the `IQueryable` path.

#### 4.4 Existence / count short-cuts

Replace materialise-then-test patterns with the repository's
`*Async` overloads:

| Anti-pattern | Use instead |
|---|---|
| `(await _repo.GetListAsync(p)).Any()` | `await _repo.AnyAsync(p)` |
| `(await _repo.GetListAsync(p)).Count > 0` | `await _repo.AnyAsync(p)` |
| `(await _repo.GetListAsync(p)).Count` | `await _repo.CountAsync(p)` |
| `(await _repo.GetListAsync(p)).FirstOrDefault()` | `await _repo.FirstOrDefaultAsync(p)` |
| `(await _repo.GetListAsync(p)).Single()` | `await _repo.GetAsync(p)` |

#### 4.5 Repository API binding

- `await _repo.GetQueryableAsync()` returns ABP's `IRepository<T>`
  queryable — extend with LINQ-to-EF operators.
- `.WhereIf(condition, predicate)` is the ABP extension that
  conditionally composes the predicate. On non-ABP projects substitute
  the equivalent helper or write `if (condition) query = query.Where(...)`.
- `.PageBy(input)` consumes `IPagedResultRequest` from the input DTO
  (typically `PagedAndSortedResultRequestDto`); avoid hand-rolling
  `Skip / Take` from `int Page` / `int PageSize` fields.
- `AsyncExecuter.LongCountAsync` / `AsyncExecuter.ToListAsync`
  materialise through ABP's provider-aware async executor; plain
  `ToListAsync()` directly on the queryable also works under EF Core.

#### 4.6 Merge-gate scan

The Phase 3 merge gate scans `<Project>.Application/` and
`<Project>.Domain/`:

- `\.GetListAsync\s*\([^)]+\)` (predicate variant) followed within the
  same statement / await-result by `.Skip(`, `.Take(`, `.Where(`,
  `.OrderBy(`, `.Select(`, `.Any(`, `.Count` — collapse to the
  composed `IQueryable` path or to a repository `*Async` short-cut.
- `\.GetListAsync\s*\(\s*\)` (no-predicate variant) without an
  adjacent `// bounded:` comment — flagged.

Hits block the merge.

---

### Rule 5 — Aggregate-root encapsulation (builder-style mutation)

**Anchor:** future STD-001 (DDD standards, placeholder). Companion
STD-005 rules: Rule 11 (Manager carries node body), Rule 9.2 (Domain
project folder layout). When STD-001 is authored, this rule migrates
into it and STD-002 back-links.

Every property on an `AggregateRoot`, `Entity`, or owned-type is
**private-write at the language level**. Mutation goes through named
methods on the aggregate that enforce the invariant they protect.

#### 5.1 Property exposure

- Computed projections: `{ get; }`.
- Set-at-construction: `{ get; init; }` (preferred) or `{ get; private set; }`.
- `public` setters on a domain type are prohibited.

```csharp
public class TimeSlot : AggregateRoot<Guid>
{
    public Guid DoctorId { get; private set; }
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }
    public TimeSlotStatus Status { get; private set; }

    private TimeSlot() { }   // EF Core materialisation

    public TimeSlot(Guid id, Guid doctorId,
        DateTime startTime, DateTime endTime)
    {
        Id = id;
        DoctorId = doctorId;
        StartTime = startTime;
        EndTime = endTime;
        Status = TimeSlotStatus.Available;
    }

    public ErrorOr<Success> Book()
    {
        if (Status != TimeSlotStatus.Available)
            return Error.Conflict(PatientPortalKeys.TimeSlotUnavailable);

        Status = TimeSlotStatus.Booked;
        return Result.Success;
    }

    public void Free() => Status = TimeSlotStatus.Available;
}
```

#### 5.2 Mutation method naming

Method names read as the transition (`Book`, `Free`, `Cancel`,
`Activate`, `Deactivate`, `Approve`, `Reject`, `MoveToDepartment`),
not as the mechanic (`SetStatus`, `UpdateStatus`, `ChangeStatus`).

A mutation method that can fail a domain invariant returns
`ErrorOr<Success>` (or `ErrorOr<T>` when it surfaces a value) — see
Rule 1.

#### 5.3 Collection encapsulation

Public surface exposes a read-only view; the backing field is private;
mutation goes through named methods.

```csharp
public class DoctorSchedule : AggregateRoot<Guid>
{
    public Guid DoctorId { get; private set; }

    private readonly List<WorkingHoursEntry> _workingHours = new();
    public IReadOnlyCollection<WorkingHoursEntry> WorkingHours => _workingHours;

    public void AddWorkingHours(
        int dayOfWeek, TimeOnly start, TimeOnly end, int slotMinutes)
    {
        _workingHours.Add(new WorkingHoursEntry(dayOfWeek, start, end, slotMinutes));
    }

    public void ClearWorkingHours() => _workingHours.Clear();
}
```

EF Core configuration points the navigation at the backing field:

```csharp
builder.Metadata.FindNavigation(nameof(DoctorSchedule.WorkingHours))!
    .SetPropertyAccessMode(PropertyAccessMode.Field);
```

#### 5.4 Constructors

- One private parameterless constructor — EF Core's materialisation
  surface; no domain logic.
- One public constructor (or static factory method) per legitimate
  birth path; accepts every value needed to satisfy invariants on
  construction.
- Public mutator methods (per 5.2) are the only other write path.

#### 5.5 External write prohibition

Direct `entity.Property = value` from outside the aggregate is
prohibited in `Managers/`, `AppServices/`, `Controllers/`, and
`DataSeedContributors/`. The Manager calls the named method:

```csharp
// PROHIBITED
slot.Status = TimeSlotStatus.Booked;

// REQUIRED
var booking = slot.Book();
if (booking.IsError) return booking.Errors;
```

#### 5.6 Merge-gate scan

The Phase 3 merge gate scans `<Project>.Domain/**/*.cs`:

- `public\s+[\w<>?]+\s+\w+\s*\{\s*get;\s*set;\s*\}` on any type whose
  base is an `AggregateRoot` / `Entity` / owned-type — flagged.
- Property assignment to a domain-entity-typed reference inside
  `<Project>.Application/`, `<Project>.HttpApi/`,
  `<Project>.Domain/**/Managers/`, `<Project>.Domain/**/DataSeed*` —
  flagged unless the LHS is a property defined on the assigning type
  itself (a Manager mutating its own private field is fine).

Hits block the merge.

---

## Consequences

This standard binds every Domain Manager and AppService authored in a
.NET API project under this methodology. Specifically:

- **Phase 2 feat-spec validator** — each FLW / QRY / CMD node carries
  `service_layer: domain` (default) per STD-005 Rule 11; node bodies
  describe the Manager's `ErrorOr<T>` contract. Each input DTO node
  carries a `validator:` reference. The validator surfaces the
  `<Module>Keys` constants and `<Module>Consts` values it consumes.
- **Phase 3 merge gate** — see STD-005 § Consequences for the full
  set of merge-gate scans; STD-005's gate enforces the STD-002 rules
  on ABP projects. For non-ABP projects, the gate substitutes the
  project's equivalent exception type and validator-discovery shape.
  The new Rule 2.5 (mandatory-validator), Rule 4 (repository query
  discipline), and Rule 5 (aggregate-root encapsulation) scans
  enumerated in each rule's body extend the merge gate's coverage.

## Project-specific deviations

Any deviation from a rule in this standard is recorded in a
component-scoped ADR that back-links to STD-002 via
`related_standards: [STD-002]`. The ADR explains why the deviation is
justified and what the narrower rule is.

## Revisit if

- The methodology expands to non-API .NET projects (desktop, MAUI,
  background-only workers) that need analogous patterns. At that point
  the `applies_when: stack: [api]` binding narrows or the STD splits.
- The result-pattern library standard shifts away from `ErrorOr` (e.g.,
  a custom `Result<T, TError>` adopted across the engine). Rule 1 is
  rewritten against the new contract; the underlying contract (Manager
  returns; AppService unwraps; never leaks past contracts) survives.
- FluentValidation is replaced (e.g., by a source-generator-driven
  validator). Rule 2's tooling changes; the boundary between input
  shape (validator) and domain rule (Manager `ErrorOr`) does not.
- ABP's `IRepository<T>.GetQueryableAsync()` / `.WhereIf` / `.PageBy`
  / `AsyncExecuter` shape changes (e.g., the engine adopts a different
  query-composition primitive). Rule 4's call-site surface changes;
  the underlying contract (server-side composition; materialisation
  is the last step) survives.
- STD-001 (engine-level DDD constraints) is authored. Rule 5
  (aggregate-root encapsulation) migrates from STD-002 to STD-001 and
  this file back-links — Rule 5's substance survives the move
  unchanged. STD-002's domain-layer scope narrows back to the
  framework-agnostic application-layer patterns.
