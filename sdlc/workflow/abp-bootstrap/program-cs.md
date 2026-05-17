---
name: abp-bootstrap-program-cs
description: "Step 4 detail of abp-project-bootstrap — Program.cs delta when Pack-LOG is in scope. Two-stage Serilog, multi-file appsettings, helper callback wiring."
applies_when:
  stack: [api]
  framework: [abp-net]
---

# ABP Bootstrap — Program.cs and startup

> **Step 4 detail of [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md).**
> Describes the delta the operator applies on top of the scaffolded
> `Program.cs` when Pack-LOG (Serilog enrichment + Elasticsearch +
> Activity tracing) is in scope. Skip this entire file if Pack-LOG is
> NOT in scope — the default scaffold's single-stage Serilog is
> sufficient for non-Elasticsearch deployments.

> **Read posture:** wholesale-read when the operator reaches Step 4 of
> the orchestrator. Holds for both `<Name>.HttpApi.Host` and
> `<Name>.AuthServer`.

---

## Default scaffold (verify-only — do NOT re-author)

After `abp new`, both host projects already ship a `Program.cs` with:

- Single-stage Serilog `.CreateLogger()` — `MinimumLevel.Debug` (`#if DEBUG`) / `MinimumLevel.Information` (else)
- Level overrides: `Microsoft` → Information, `Microsoft.EntityFrameworkCore` → Warning
- `Enrich.FromLogContext()`
- `WriteTo.Async(c => c.File("Logs/logs.txt"))`
- `WriteTo.Async(c => c.Console())`
- `AddAppSettingsSecretsJson()` extension on `builder.Host`
- `UseAutofac()`
- `UseSerilog()` (parameterless)
- `try` / `catch` / `finally` with `HostAbortedException` re-throw, `Log.Fatal(...)`, and synchronous `Log.CloseAndFlush()`

The five changes below are the **only** edits required to enable Pack-LOG.

---

## Delta to apply (5 changes)

### 1. Stage-1 logger → bootstrap logger

Replace `.CreateLogger()` with `.CreateBootstrapLogger()`. Strip Stage-1
of the File sink, level overrides, and `FromLogContext` — Stage-1
becomes minimal:

```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .CreateBootstrapLogger();
```

Stage-1's only job is to capture pre-DI startup logs in case Stage-2's
config-load fails. The full sink set + enrichers + level overrides
move into Stage-2 (the helper — see [`pack-logging.md`](pack-logging.md)).

### 2. Stage-2 logger via helper callback

Replace parameterless `.UseSerilog()` with the three-arg overload that
calls `SerilogConfigurationHelper.Configure(...)`. Two call-site
variants:

**`<Name>.HttpApi.Host`** — omit `isAuth:` entirely (relies on the
helper's default `false`):

```csharp
.UseSerilog((context, services, loggerConfig) =>
    SerilogConfigurationHelper.Configure(loggerConfig, context.Configuration));
```

**`<Name>.AuthServer`** — pass `isAuth: true`:

```csharp
.UseSerilog((context, services, loggerConfig) =>
    SerilogConfigurationHelper.Configure(loggerConfig, context.Configuration, isAuth: true));
```

The asymmetry matters. The helper's `isAuth: true` branch swaps the
verbose default output template for a compact auth-variant template —
see [`pack-logging.md`](pack-logging.md) § Auth-server differences.
`HttpApi.Host` always uses the verbose template via the default.

### 3. Multi-file appsettings loading

Insert a `ConfigureAppConfiguration((_, config) => { ... })` block on
the `Host` builder, adding these optional + `reloadOnChange: true` JSON
files (all `optional: true`):

| File | Role |
|------|------|
| `appsettings.{ASPNETCORE_ENVIRONMENT}.json` | Env-specific overrides |
| `appsettings.{env}.secrets.json` | Env-specific secrets (gitignored) |
| `appsettings.features.json` | Feature-flag config split |
| `appsettings.features.{env}.json` | Env-specific feature-flag overrides |
| `appsettings.features.{env}.secrets.json` | Env-specific feature-flag secrets |

Place the `ConfigureAppConfiguration` block **between**
`AddAppSettingsSecretsJson()` and `UseAutofac()` on the fluent chain so
Serilog's Stage-2 callback sees the merged configuration.

### 4. Async close

Replace synchronous `Log.CloseAndFlush()` with
`await Log.CloseAndFlushAsync()` in the `finally` block. This requires
the `Main` signature to be `async Task<int>` (the scaffold already
provides this).

### 5. Preserve scaffold default order

Default scaffold chains `builder.Host.AddAppSettingsSecretsJson().UseAutofac().UseSerilog();`
— preserve this order; insert `ConfigureAppConfiguration` between
`AddAppSettingsSecretsJson` and `UseAutofac`. Do NOT reorder
`UseAutofac` after `UseSerilog`.

---

## Stage-1 vs. Stage-2 trade-offs

| Concern | Stage 1 (bootstrap) | Stage 2 (helper) |
|---------|---------------------|------------------|
| Lifetime | Process start → host built | Host built → process end |
| Catches | Pre-DI startup failure (e.g., config-load throw) | Normal runtime + framework logs |
| Sinks | Console only | Console + File + Elasticsearch (Pack-LOG) |
| Enrichers | None | `FromLogContext`, `MachineName`, optional Activity |

Both stages share the static `Log.Logger`. Stage 2 replaces Stage 1
transparently when the host starts; no manual handoff.

---

## Pitfalls

- **Double-configuration.** Do NOT keep level overrides + File sink in
  Stage-1 AND in the helper — duplicate log entries result. Stage-1
  stays minimal (Console + Information).
- **`isAuth:` style consistency.** `HttpApi.Host` omits `isAuth:` and
  relies on the default `false`. Do NOT pass `isAuth: false`
  explicitly. `AuthServer` always passes `isAuth: true`.
- **Operator-extensible template.** The verbose default template (used
  on `HttpApi.Host`) carries framework-universal fields only
  (correlation, trace/span, ABP tenant/user). Operators MAY extend by
  appending placeholders before `| {Message}` for project-specific
  structured fields. The `isAuth: true` variant drops extensions for
  compactness — see [`pack-logging.md`](pack-logging.md) § Helper class
  structure.
- **`ConfigureAppConfiguration` callback signature.**
  `(WebHostBuilderContext, IConfigurationBuilder)` — use the underscore
  for the host-builder context when only `config` is needed.

---

## Sample `Program.cs` skeleton (delta-marked)

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Threading.Tasks;
using <RootNamespace>.Helpers;          // + ADD: SerilogConfigurationHelper namespace

namespace <RootNamespace>;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        // ~ CHANGE: single-stage CreateLogger() → minimal CreateBootstrapLogger()
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .WriteTo.Console()
            .CreateBootstrapLogger();

        try
        {
            Log.Information("Starting Host.");
            var builder = WebApplication.CreateBuilder(args);
            builder
                .Host
                .AddAppSettingsSecretsJson()
                // + ADD: multi-file appsettings loading
                .ConfigureAppConfiguration((_, config) =>
                {
                    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                    config.AddJsonFile($"appsettings.{env}.json",                 optional: true, reloadOnChange: true);
                    config.AddJsonFile($"appsettings.{env}.secrets.json",         optional: true, reloadOnChange: true);
                    config.AddJsonFile("appsettings.features.json",               optional: true, reloadOnChange: true);
                    config.AddJsonFile($"appsettings.features.{env}.json",        optional: true, reloadOnChange: true);
                    config.AddJsonFile($"appsettings.features.{env}.secrets.json", optional: true, reloadOnChange: true);
                })
                .UseAutofac()
                // ~ CHANGE: parameterless UseSerilog() → helper callback
                // HttpApi.Host variant — omit isAuth:
                .UseSerilog((context, services, loggerConfig) =>
                    SerilogConfigurationHelper.Configure(loggerConfig, context.Configuration));
                // AuthServer variant (use instead on the AuthServer project):
                // .UseSerilog((context, services, loggerConfig) =>
                //     SerilogConfigurationHelper.Configure(loggerConfig, context.Configuration, isAuth: true));

            await builder.AddApplicationAsync<<Name>HttpApiHostModule>();
            var app = builder.Build();
            await app.InitializeApplicationAsync();
            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            if (ex is HostAbortedException) throw;
            Log.Fatal(ex, "Host terminated unexpectedly!");
            return 1;
        }
        finally
        {
            await Log.CloseAndFlushAsync();   // ~ CHANGE: sync CloseAndFlush() → async
        }
    }
}
```

Placeholders: `<Name>`, `<RootNamespace>`. The marked lines (`// + ADD`,
`// ~ CHANGE`) call out each of the five delta items above.

---

## Integration

- **Caller:** [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md) § Step 4.
- **Read with:** [`pack-logging.md`](pack-logging.md) — defines the
  `SerilogConfigurationHelper` referenced here.
- **Sibling detail files:** [`baseline-hardening.md`](baseline-hardening.md),
  [`feature-packs.md`](feature-packs.md), [`appsettings-schema.md`](appsettings-schema.md).
