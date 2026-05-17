---
name: abp-bootstrap-baseline-hardening
description: "Step 5 detail of abp-project-bootstrap — 10 baseline hardening items for HttpApi.Host and 10 for AuthServer (with overlap)."
applies_when:
  stack: [api]
  framework: [abp-net]
---

# ABP Bootstrap — Module baseline hardening

> **Step 5 detail of [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md).**
> The baseline items both host modules must carry **before any business
> code is written**. Items are applied inside each module's
> `ConfigureServices` / `OnApplicationInitialization` overrides.

> **Read posture:** wholesale-read when the operator reaches Step 5 of
> the orchestrator. Apply on a fresh scaffold; verify-and-complete on
> an existing project (some items may already be partially present).

---

## `<Name>.HttpApi.Host` baseline (10 items)

| # | Concern | Implementation |
|---|---------|----------------|
| 1 | Reverse-proxy support | `UsePathBase(App:PathBase)` + `UseForwardedHeaders(XForwardedFor \| XForwardedProto)`, both gated on `App:ConfigureHttpsForwardingBehindProxy` |
| 2 | Transport security | `UseHsts(maxAge: 365 days, includeSubDomains: true)` + `UseHttpsRedirection` + `UseErrorPage`, all non-dev only; **`UseHsts` before `UseHttpsRedirection`** |
| 3 | Exception → HTTP mapping | `Configure<AbpExceptionHttpStatusCodeOptions>` mapping `EntityNotFoundException` → 404, `AbpAuthorizationException` → 401/403, `AbpValidationException` → 400. Anchors [`../../standards/STD-005-abp-coding-conventions.md`](../../standards/STD-005-abp-coding-conventions.md) **Rule 14** (typed-exception HTTP mapping *policy*); this is the registration call that wires the policy at the module boundary |
| 4 | Antiforgery (SPA-aware) | `Configure<AbpAntiForgeryOptions>` — `HttpOnly = true`, `Secure = true`, `AutoValidate = false` (SPA submits via XHR with explicit token header) |
| 5 | Clock | `Configure<AbpClockOptions>` → `Kind = DateTimeKind.Utc` |
| 6 | GUID strategy | `Configure<AbpSequentialGuidGeneratorOptions>` → `DefaultSequentialGuidType = SequentialGuidType.SequentialAsString` |
| 7 | Audit application name | `Configure<AbpAuditingOptions>` → `ApplicationName = "<Name>HttpApi.Host"`. Anchors STD-005 **Rule 17** (audit-module *configuration block*); `ApplicationName` is a sub-field of the block, not a rule-level prescription. Operator may also decide on `IsEnabledForGetRequests` here — default off; turn on only if read-path auditing is required |
| 8 | Health checks | `AddHealthChecks()` + `MapHealthChecks("/hc")` (full check set, auth-gated or internal-only) + `MapHealthChecks("/liveness")` (anonymous, liveness probe only — no DB / Redis hit) |
| 9 | Feature management | `AddFeatureManagement()` — required before any feature-flag evaluation runs (including Pack-LOG's pre-DI `IsFeatureEnabled` reader) |
| 10 | Conventional MVC | `Configure<AbpAspNetCoreMvcOptions>` registering the `Application.Contracts` assembly. Anchors STD-005 **Rule 10** (Auto API Controllers default exposure) — already in scaffold; verify-only |

**Note:** `Configure<IdentityOptions>` belongs **only** on the AuthServer
under `--separate-auth-server`. See pitfall below.

---

## `<Name>.AuthServer` baseline (10 items)

| # | Concern | Implementation |
|---|---------|----------------|
| 1 | Reverse-proxy support | Same as HttpApi.Host #1 |
| 2 | Transport security | Same as HttpApi.Host #2 |
| 3 | Exception → HTTP mapping | Same as HttpApi.Host #3 (STD-005 Rule 14) |
| 4 | Antiforgery | Same as HttpApi.Host #4 |
| 5 | Identity password + lockout | `Configure<IdentityOptions>` — password min length 8, require uppercase + digit + non-alphanumeric, `RequireUniqueEmail = true`; `Lockout.MaxFailedAccessAttempts = 3`, `Lockout.DefaultLockoutTimeSpan = 15 minutes`. **Belongs only here** under `--separate-auth-server` |
| 6 | Health checks | Same as HttpApi.Host #8 (with DB + Redis sub-checks under `/hc`) |
| 7 | Audit application name | `Configure<AbpAuditingOptions>` → `ApplicationName = "<Name>AuthServer"` (STD-005 **Rule 17** — audit-module configuration block). Operator decides on `IsEnabledForGetRequests` — default off; turn on if login / token GET paths must be audited. **Verify before add:** the scaffold may already produce this block partially (e.g., a commented `IsEnabledForGetRequests` line) — uncomment / complete in place rather than re-authoring the block |
| 8 | Application cookie | `services.ConfigureApplicationCookie(opts => { opts.SlidingExpiration = true; opts.ExpireTimeSpan = TimeSpan.FromMinutes(15); opts.LoginPath = ...; opts.LogoutPath = ...; opts.AccessDeniedPath = ...; })` with paths matching the AuthServer's Razor Pages routes |
| 9 | Email sender | `Replace<IEmailSender, SmtpEmailSender>()` — the AuthServer sends password-reset, verification, and MFA messages and must have a working sender registered |
| 10 | OpenIddict token lifetimes | `PreConfigure<OpenIddictServerBuilder>(builder => { builder.SetAccessTokenLifetime(...); builder.SetIdentityTokenLifetime(...); })` reading `OpenIddict:AccessTokenLifetimeInSeconds` / `:IdentityTokenLifetimeInSeconds` (default 7200 seconds) |

Plus a `AddTransient<ITokenManagementAppService, ...>` registration for
token-lifecycle administration endpoints.

---

## Pitfalls (explicit)

- **`Configure<IdentityOptions>` on `HttpApi.Host` is a silent no-op
  under `--separate-auth-server`.** Identity is not in the
  `HttpApi.Host` module's `DependsOn` tree; the configure call binds
  but never executes. Apply on `AuthServer` only.
- **Pipeline order matters.** `UseHsts` must run before
  `UseHttpsRedirection`; the scaffold already orders them this way,
  but baseline edits sometimes reorder by accident. CORS and
  authentication middleware placement are governed by the scaffold —
  verify these are not displaced.
- **`MapHealthChecks` placement.** Map both endpoints in
  `OnApplicationInitialization` after `UseConfiguredEndpoints` (or
  `UseEndpoints` if scaffold hasn't migrated). Liveness must remain
  anonymous; full check may sit behind auth or an internal-network
  restriction.
- **`AddFeatureManagement()` precedes feature-flag readers.** Items
  that read feature flags (e.g., Pack-LOG's Elasticsearch and
  Activity-tracing gates) run inside `Program.cs` Stage-2 callback,
  which is **pre-DI**. Those readers go directly against
  `IConfiguration` — `AddFeatureManagement()` enables the DI-scoped
  `IFeatureChecker` used by application services, not the bootstrap
  reader. See [`pack-logging.md`](pack-logging.md) § Pitfalls.

---

## Verification

For each module, confirm the items above appear once and only once.
Scan for known silent-no-ops:

- `Configure<IdentityOptions>` referenced anywhere in HttpApi.Host
  module → remove (silent no-op).
- `UseHttpsRedirection` appearing before `UseHsts` → reorder.
- Multiple `Configure<AbpAuditingOptions>` blocks in one module →
  consolidate to one.

---

## Integration

- **Caller:** [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md) § Step 5.
- **Anchors:** [`../../standards/STD-005-abp-coding-conventions.md`](../../standards/STD-005-abp-coding-conventions.md) Rules 10, 14, 17.
- **Sibling detail files:** [`program-cs.md`](program-cs.md),
  [`pack-logging.md`](pack-logging.md), [`feature-packs.md`](feature-packs.md),
  [`appsettings-schema.md`](appsettings-schema.md).
