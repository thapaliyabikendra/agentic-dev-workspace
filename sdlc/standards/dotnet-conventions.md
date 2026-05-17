---
id: STD-002
title: Engine-level .NET implementation conventions
status: accepted
created: 2026-05-13
updated: 2026-05-17
supersedes: null
superseded_by: null
tags: [dotnet, application-layer, errororstd, validation, localization]
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
validation pipeline (FluentValidation), and user-facing string
externalisation (`IStringLocalizer<TResource>` with shared per-module
key constants). Additional framework-agnostic .NET concerns — async /
await naming, DI container conventions, LINQ vs loop guidance,
cancellation-token discipline — remain deferred to follow-up sections.
STD-005 carries the ABP-specific layer (file slots, layer mapping, base
classes); this standard governs the framework-agnostic patterns that
STD-005's rules consume.

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
