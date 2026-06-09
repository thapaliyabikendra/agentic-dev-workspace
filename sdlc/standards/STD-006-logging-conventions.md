---
id: STD-006
title: Engine-level logging conventions
status: accepted
created: 2026-05-17
updated: 2026-05-22
supersedes: null
superseded_by: null
tags: [logging, observability, structured-logging, convention, pii, abp]
scope: engine
applies_when:
  stack: [api]
source: seed
related_adrs: []
---

# STD-006: Engine-level logging conventions

> **Engine-level technical standard.** Applies to any API project under
> this methodology — applicability is declared in `applies_when:
> { stack: [api] }`. Project-specific deviations are component-scoped
> ADRs that back-link here via `related_standards: [STD-006]`;
> node-local atomic decisions are DECs. See
> [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) for the
> STD / ADR / CCC / DEC discriminator.
>
> **ABP-specific bindings.** Where this standard references ABP types
> (`IAbpSerilogEnricher`, `IAuditingStore`, `[Audited]`), the binding is
> conditional: an ABP project consumes the example verbatim; a vanilla
> ASP.NET Core project substitutes its framework's equivalent (custom
> Serilog enricher, OpenTelemetry trace sink, manual audit pipeline).
> The pattern — MEL `ILogger<T>` abstraction, structured templates,
> PII discipline, correlation enrichment — is framework-agnostic; the
> concrete API names are not.

## Scope

Server-side observability discipline: logger injection through the MEL
abstraction (`Microsoft.Extensions.Logging.ILogger<TConsumer>`), per-layer
log-level guidance, structured-template discipline (named properties,
no string interpolation), PII prohibition, correlation / tenant / user
enrichment via the ABP Serilog integration, and the audit-vs-logging
boundary (entity-change audit is the ABP audit module's responsibility,
not `ILogger`'s). Front-end telemetry, sampling rates, sink
configuration, and alerting thresholds remain outside this standard's
scope — they are deferred to the first production-observability FRS
(see CCC-013).

## Standards

### Rule 1 — `ILogger<T>` injection only <!-- layers: Domain, Application, EntityFrameworkCore -->

**Anchor:** [CCC-013](../../docs/shared/ccc/CCC-013-observability.md).

Inject `Microsoft.Extensions.Logging.ILogger<TConsumer>` via the
constructor. Never reference `Serilog.ILogger`, `Serilog.Log.*`,
`LoggerFactory`, or any other concrete logger implementation in
application, domain, or infrastructure code. ABP's Serilog
integration runs as a logging provider **behind** the MEL abstraction —
swapping providers (Serilog → OpenTelemetry → Console) is a host-
module configuration change, not a per-class refactor.

The Phase 3 merge gate greps for `using Serilog;` in non-host code,
for `Serilog.ILogger` as a field or parameter type, and for static
`Log.*` calls outside the host module — hits block the merge.

---

### Rule 2 — Per-layer log levels <!-- layers: Domain, Application, EntityFrameworkCore -->

**Anchor:** [CCC-013](../../docs/shared/ccc/CCC-013-observability.md).
Companion to STD-002 R1 (Domain Manager returns `ErrorOr<T>` rather
than logging failure context).

| Layer | Default level | Use |
|---|---|---|
| Domain (`Managers/`, `Entities/`, `Events/`, `Specifications/`) | _no logging_ | Failure context flows via `ErrorOr<T>` (STD-002 R1). Domain code is logger-free; injection of `ILogger<T>` into a Manager is a defect. |
| Application (`AppServices/`, `AutoMapperProfiles/`) | `Information` for significant successful operations; `Warning` for recoverable rule violations / negative outcomes that still complete the request | The AppService is the operational-narrative layer. One `Information` per externally meaningful operation, no per-line tracing. |
| Infrastructure (`EntityFrameworkCore/`, integration adapters, `BackgroundJobs/`, `Workers/`) | `Debug` for routine queries and operational steps; `Error` (with full exception via the `exception` parameter) for external-service / DB failures | Production log volume is bounded by `Information+` at the application layer; `Debug` is the verbose-mode dial. |

The Phase 3 merge gate greps for `_logger.Log*` calls inside files
under any `Domain/` (or `*.Domain/`) folder — hits block the merge.

---

### Rule 3 — Structured logging with named properties <!-- layers: Application, EntityFrameworkCore -->

**Anchor:** [CCC-013](../../docs/shared/ccc/CCC-013-observability.md).

Message templates use **named placeholders**:

```csharp
_logger.LogInformation(
    "Department {DepartmentId} created by {UserId}",
    department.Id, _currentUser.Id);
```

Interpolated strings (`$"…"`), `string.Format`, and string
concatenation **inside log calls** are prohibited — they defeat
Serilog's structured-property capture, collapse every event into an
unsearchable text blob, and break correlation across log sinks.

The Phase 3 merge gate greps for `_logger\.Log\w+\(\$"`, for
`_logger\.Log\w+\(string\.Format\(`, and for `_logger\.Log\w+\(` followed by
a `+`-concatenated template literal — hits block the merge. (Patterns are
regex: `Log\w+` matches `LogInformation`, `LogError`, etc.; a glob-style
`Log*` would match nothing useful.)

---

### Rule 4 — Never log sensitive data <!-- layers: Application, EntityFrameworkCore -->

**Anchor:** [CCC-013](../../docs/shared/ccc/CCC-013-observability.md);
companion to CCC-001 (Authentication & Identity) and CCC-002
(Authorization).

The following are **never** log arguments at any level, in any layer,
in any environment:

- Passwords, password hashes, password-reset tokens
- Bearer tokens, refresh tokens, API keys, JWT contents (including
  decoded claims that carry secrets)
- OTP / TOTP codes, MFA seeds
- Session IDs, cookie values
- Raw payment instruments — full card numbers, CVVs, expiry-and-PAN
  pairs
- `Authorization` headers, raw request bodies of authentication
  endpoints

Domain-specific PII (national IDs, beneficiary bank account numbers,
counter-party correspondent details) is logged **only** at `Debug`
level and **only** with explicit redaction (`{NationalIdMasked}` where
the masked value is computed at the call site). A `Debug`-level PII
log line in production is acceptable only when the production
log-level dial sits at `Information+`; a deployment that raises
production log level to `Debug` without revisiting PII coverage is a
deployment-time finding, not a code finding.

The Phase 3 merge gate greps log-call argument lists for property
names matching the regex
`(?i)(password|secret|cardNumber|cvv|authorizationHeader|bearer|refresh_?token|\btoken\b|\botp\b)`
— hits block the merge. The short alternatives `token` and `otp` are
word-boundary-anchored: bare substrings would flag `CancellationToken`,
`tokenizer`, `footprint`-class identifiers and train reviewers to
ignore the gate. The longer alternatives stay substring-matched so
compounds (`PasswordHash`, `ClientSecret`, `BearerToken` via `bearer`)
still fire.

---

### Rule 5 — Correlation enrichment via ABP Serilog <!-- layers: Application -->

**Anchor:** [CCC-013](../../docs/shared/ccc/CCC-013-observability.md).

Correlation ID, current tenant, and current user are enriched
**automatically** by ABP's Serilog integration (`IAbpSerilogEnricher`
+ the correlation-ID middleware that reads the inbound `X-Correlation-Id`
header or synthesises a fresh GUID per request). Application code
does **not** manually push these fields onto log events.

One-off enrichment for an in-scope value that the ambient enricher
does not cover uses `LogContext.PushProperty`:

```csharp
using (LogContext.PushProperty("BgRequestId", request.Id))
{
    // every log event inside this scope carries BgRequestId
}
```

The Phase 3 merge gate greps for application-code calls that manually
push `CorrelationId`, `TenantId`, or `UserId` properties — hits flag
the call site (ABP's enricher already covers these; the manual push
is dead code that disagrees with the enricher's source of truth).

---

### Rule 6 — Audit logging via ABP audit module, not `ILogger` <!-- layers: Application -->

**Anchor:** [CCC-004](../../docs/shared/ccc/CCC-004-auditing.md).
Structural mirror: [STD-005 Rule 17](STD-005-abp-coding-conventions.md#rule-17--audit-logging-via-abp-audit-module-not-ilogger).
*(`deferred_until` — project bootstrap creates this CCC at
`docs/shared/ccc/`; engine cite is a forward reference until then.)*

Entity-change audit trails (who-changed-what-when) go through the ABP
audit module — `IAuditingStore`, `[Audited]`, module-level
`Configure<AbpAuditingOptions>(...)`. Manual
`_logger.LogInformation("Audit: User {UserId} changed Department…")`
or `_logger.LogInformation("Audit: …")` lines are **prohibited** —
they bypass the audit-store retention / query / export pipeline and
silently drift from the official audit trail.

Rule 6 is the **logging-discipline** rule (the symptom — a log call
that should not exist). STD-005 R17 is the **structural** rule (the
fix — wire up the audit module). The Phase 3 merge gate
cross-references both to avoid duplicate flagging on the same code
path.

The Phase 3 merge gate greps for log-template strings that begin with
the literal word `Audit` (case-insensitive) — hits are flagged for
human review (advisory, not blocking — the literal word `Audit` is
too easy to false-positive on legitimate operational logging that
mentions an audit table or audit job).

## Consequences

This standard binds every layer of an ABP API project under the
methodology. Specifically:

- **Phase 2 feat-spec authoring** — when the FS slice touches the
  application layer (AppService, AutoMapperProfile, BackgroundJob,
  Worker, integration adapter), the FS's `standards:` frontmatter
  must declare `STD-006`. The convention-autoload at Stage 2 Code
  picks it up regardless, but explicit declaration is the FS author's
  signal that the standard was scanned.
- **Phase 3 merge gate** — the grep-driven scans in Rules 1, 2, 3, 4,
  5, and 6 fire layer-by-layer:
  - `using Serilog;` / `Serilog.ILogger` / static `Log.*` outside the
    host module → block (Rule 1).
  - `_logger.Log*` in any `Domain/` folder → block (Rule 2).
  - `_logger.Log*\(\$"`, `string.Format` inside log calls, `+`-concatenated
    templates → block (Rule 3).
  - Log-call arguments referencing `password|token|otp|secret|cardNumber|
    cvv|authorizationHeader|bearer|refreshToken` → block (Rule 4).
  - Manual `LogContext.PushProperty("CorrelationId" | "TenantId" |
    "UserId", …)` in application code → flag (Rule 5; advisory unless
    paired with a missing enricher registration).
  - Log templates starting with `Audit` (case-insensitive) → flag for
    human review (Rule 6; cross-referenced with STD-005 R17).

  Blocking hits halt the merge.

## Project-specific deviations

Any deviation from a rule in this standard must be recorded in a
component-scoped ADR that back-links to STD-006 via
`related_standards: [STD-006]` in its frontmatter. The ADR explains
why the deviation is justified and what the narrower rule is.

## Revisit if

- The project migrates from MEL `ILogger<T>` to a different logging
  abstraction (OpenTelemetry-only, custom tracer) — Rule 1's MEL
  premise no longer holds and the per-layer / structured / PII rules
  re-anchor on the new abstraction.
- The project migrates from ABP Framework to vanilla ASP.NET Core or
  another .NET application framework — Rules 5 and 6 narrow or retire
  with the ABP-specific enrichers and audit module; the framework-
  agnostic core (Rules 1–4) survives.
- The first production-observability FRS lifts CCC-013 from its
  current baseline-only state to a fully specified
  sinks / sampling / alerting surface — STD-006 may grow rules for
  the new surface or shed rules that fold into the production
  configuration.
