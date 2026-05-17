---
name: abp-bootstrap-pack-logging
description: "Step 6 detail of abp-project-bootstrap — Pack-LOG: Serilog enrichment helper, Console / File / Elasticsearch sinks, Activity tracing, durable buffer, ESv8 auto-template."
applies_when:
  stack: [api]
  framework: [abp-net]
---

# ABP Bootstrap — Pack-LOG: Serilog enrichment + Elasticsearch + Activity tracing

> **Step 6 detail of [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md).**
> Defines the `SerilogConfigurationHelper` referenced by Stage-2 of
> [`program-cs.md`](program-cs.md), plus its sink composition, feature
> gating, and the two project-side helper classes Pack-LOG depends on.

> **Read posture:** wholesale-read when Pack-LOG is in scope. Skip
> entirely otherwise.

> **Pairing:** Pack-LOG applies to **both** `HttpApi.Host` and
> `AuthServer`. The helper lives in `<Name>.Domain.Shared` so neither
> host project takes a cross-reference dependency on the other.

---

## Helper class location

`<Name>.Domain.Shared\Helpers\SerilogConfigurationHelper.cs` (or a
dedicated Logging assembly if the project keeps observability concerns
separate). Reasons:

- Both `HttpApi.Host` and `AuthServer` call the helper. Placing it in
  `Domain.Shared` keeps each host's `csproj` clean of the other's
  reference.
- The Stage-2 `UseSerilog` callback runs **pre-DI** — the helper must
  be reachable from a static call site with only an `IConfiguration`
  on hand.

---

## Helper class structure

Define `SerilogConfigurationHelper` as a `public static class` with:

- `private const string _logDirName = "Logs"`
- `private static string _outputTemplate = ...` (the default verbose
  template — framework fields only, operator-extensible — see below)
- `public static void Configure(LoggerConfiguration loggerConfig, IConfiguration configuration, bool isAuth = false)` — the only public entry point

### Default verbose output template (framework-universal fields)

```
{MachineName} {Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{SourceContext:l}] CorrId: {CorrelationId} TraceId: {TraceId} SpanId: {SpanId} | Tenant: {TenantId} User: {UserId} | {Message}{NewLine}{Exception}
```

This template carries **only** framework-universal fields:

- `{MachineName}` — enriched via `WithProperty`
- `{Timestamp}`, `{Level:u3}`, `{SourceContext:l}` — Serilog standard
- `{CorrelationId}` — ABP correlation enricher (via `FromLogContext`)
- `{TraceId}`, `{SpanId}` — System.Diagnostics.Activity (via
  `Enrich.WithSpan()`, when Activity tracing is enabled)
- `{TenantId}`, `{UserId}` — ABP tenant / user enrichers (via
  `FromLogContext`)
- `{Message}`, `{Exception}` — log event payload

**Operator extension point.** Project-specific structured fields
(e.g., business workflow identifiers, request type codes) may be added
by appending placeholders **before** `| {Message}` and enriching the
corresponding `LogContext` properties at the relevant call sites.
Document the extension in the project's logging conventions; do NOT
mutate this default template in the published file when porting the
helper.

### Auth-variant output template (compact)

When `isAuth: true`, the helper substitutes a compact template that
drops operator-added extensions and keeps only the framework-universal
fields **excluding** Activity span fields (auth flow is typically
synchronous and rarely benefits from span tracing):

```
{MachineName} {Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{SourceContext:l}] CorrId: {CorrelationId} | Tenant: {TenantId} User: {UserId} | {Message}{NewLine}{Exception}
```

### Internal call order (inside `Configure`)

1. **If `isAuth`** — swap `_outputTemplate` to the compact variant.
2. **`ConfigureLogDir()`** — create the `Logs/` directory if absent.
3. **`#if DEBUG ConfigureDiagnostics()`** — `SelfLog.Enable(...)`
   writing to `Logs/serilog-self-log.txt`.
4. **`ConfigureBase(loggerConfig, configuration)`** — minimum level,
   level overrides, `Enrich.FromLogContext`, `WithProperty("MachineName", ...)`,
   Activity tracing layer (feature-flagged).
5. **`ConfigureFileSink(loggerConfig)`** — async, rolling daily.
6. **`ConfigureElasticsearchSink(loggerConfig, configuration)`** —
   feature-flagged.
7. **`ConfigureConsoleSink(loggerConfig)`** — async, `AnsiConsoleTheme.Code`.

The console sink is registered **last** so its async wrapper composes
on top of any prior failures — keeping stdout the most reliable sink
during sink-misconfiguration triage.

---

## Base configuration (always applied)

```csharp
loggerConfiguration
#if DEBUG
    .MinimumLevel.Debug()
#else
    .MinimumLevel.Information()
#endif
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("MachineName", Environment.MachineName);
```

---

## Activity tracing layer (feature-flagged)

**Gate:** `FeatureManagement:FeatureFlags:ActivityTracing` (read via the
pre-DI `IsFeatureEnabled` reader — see Pitfalls).

**Setup:** call `ActivityListenerSetup.Initialize()` (project-side
helper — see § Project-side helpers below). Without a listener,
`ActivitySource.StartActivity()` returns `null` and span enrichment
emits no values.

**Enrichers:**

```csharp
loggerConfiguration
    .Enrich.WithSpan()                       // from Serilog.Enrichers.Span
    .Enrich.With<ActivityTagsEnricher>();    // project-side
```

`Enrich.WithSpan()` populates `{TraceId}` and `{SpanId}`.
`ActivityTagsEnricher` promotes the project's namespaced
`Activity.Current.Tags` (e.g., `<project-prefix>.*`) into log-event
properties — the prefix is the operator's choice and is **not**
hardcoded in the helper.

Emit a `Console.WriteLine` informational line on whether the gate is
on or off, so operators see the state at process start without
attaching a debugger.

---

## Console sink (always applied)

```csharp
loggerConfiguration.WriteTo.Async(c => c.Console(
    theme: AnsiConsoleTheme.Code,
    outputTemplate: _outputTemplate));
```

---

## File sink (always applied)

```csharp
var machineName = Environment.MachineName;
var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmm");
var logFilePath = Path.Combine(_logDirName, $"logs-{machineName}-{timestamp}-.txt");

loggerConfiguration.WriteTo.Async(c => c.File(
    path: logFilePath,
    rollingInterval: RollingInterval.Day,
    outputTemplate: _outputTemplate));
```

The machine-name component in the filename prevents collision when
multiple replicas write to a shared volume. The timestamp prefix is
the process-start timestamp; daily rolling appends date segments.

---

## Elasticsearch sink (feature-flagged)

**Gate:** `FeatureManagement:FeatureFlags:Logging.Elasticsearch`.

**Config keys read** (see [`appsettings-schema.md`](appsettings-schema.md)):

- `App:Id` (fallback `<application-slug>-{machine}` if absent)
- `Elasticsearch:Uri` (required when gate on; emit a misconfig warning
  to `Console` if absent)
- `Elasticsearch:UserName` (optional)
- `Elasticsearch:Password` (optional; basic auth wired only if both
  username and password are present)

**`ElasticsearchSinkOptions`:**

| Field | Value | Note |
|-------|-------|------|
| `AutoRegisterTemplate` | `true` | Sink auto-registers the index template on first connect |
| `AutoRegisterTemplateVersion` | `AutoRegisterTemplateVersion.ESv8` | ES 8.x requires |
| `TypeName` | `null` | ES 8.x removed mapping types |
| `CustomFormatter` | `new ExceptionAsObjectJsonFormatter(renderMessage: true)` | Renders exceptions as nested JSON objects, not strings |
| `IndexFormat` | `appName + "-index-{0:yyyy.MM.dd}"` | Daily index rotation |
| `BufferBaseFilename` | `Path.Combine(_logDirName, $"elastic-buffer-{machineName}")` | **Durable buffer per-machine** — prevents log loss during ES outage; per-machine suffix prevents collision on shared volumes |
| `EmitEventFailure` (#if DEBUG) | `WriteToSelfLog \| RaiseCallback` | DEBUG-only |
| `FailureCallback` (#if DEBUG) | `(e, ex) => Console.Error.WriteLine(...)` | DEBUG-only |
| `ModifyConnectionSettings` | Lambda applying `BasicAuthentication(...)` when both creds present | Skip if either missing |

Emit `Console` informational lines on whether the gate is on / off and
whether the URL is configured. The sink itself is silent on failure
(by design — log loss during outage is buffered, not thrown).

---

## NuGet packages required

Add to both host projects (or to `Domain.Shared` if the helper lives
there):

- `Serilog.AspNetCore`
- `Serilog.Enrichers.Span`
- `Serilog.Sinks.Async`
- `Serilog.Sinks.Console`
- `Serilog.Sinks.File`
- `Serilog.Sinks.Elasticsearch`
- `Serilog.Formatting.Elasticsearch`

---

## Project-side helpers

Two helper classes live alongside `SerilogConfigurationHelper` in
`<Name>.Domain.Shared\Helpers\`. The helper file ships them as
project-agnostic skeletons; the operator chooses the namespace prefix
for `ActivitySource` filtering and tag promotion.

### `ActivityListenerSetup` (static)

Registers a process-wide `ActivityListener`. Without it,
`ActivitySource.StartActivity()` returns `null` and the
`Enrich.WithSpan()` enricher produces empty `{TraceId}` / `{SpanId}`
values.

Skeleton shape:

```csharp
public static class ActivityListenerSetup
{
    private static ActivityListener? _listener;
    private const string TagPrefix = "<project-prefix>.";   // operator chooses

    public static void Initialize()
    {
        _listener = new ActivityListener
        {
            ShouldListenTo = source => source.Name.StartsWith("<PROJECT-PREFIX>."),
            Sample = (ref ActivityCreationOptions<ActivityContext> _)
                => ActivitySamplingResult.AllDataAndRecorded,
            SampleUsingParentId = (ref ActivityCreationOptions<string> _)
                => ActivitySamplingResult.AllDataAndRecorded,
            ActivityStopped = LogActivityCompletion
        };
        ActivitySource.AddActivityListener(_listener);
    }

    private static void LogActivityCompletion(Activity activity) { /* … */ }

    public static void Dispose() { _listener?.Dispose(); _listener = null; }
}
```

The `ActivityStopped` callback may optionally log activity-completion
events with `Activity.Duration`, the `<project-prefix>.*` tag set, and
the activity's status. This is project-specific; document the choice
in the project's logging conventions.

### `ActivityTagsEnricher` (`ILogEventEnricher`)

Reads `Activity.Current.Tags` and promotes the namespaced subset to
`LogEventProperty` instances on each event:

```csharp
public sealed class ActivityTagsEnricher : ILogEventEnricher
{
    private const string TagPrefix = "<project-prefix>.";   // operator chooses

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        var activity = Activity.Current;
        if (activity is null) return;

        foreach (var tag in activity.Tags)
        {
            if (tag.Key.StartsWith(TagPrefix))
            {
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty(tag.Key, tag.Value));
            }
        }
    }
}
```

### Pre-DI feature-flag reader

The Stage-2 `UseSerilog` callback runs before DI is built, so it
cannot resolve `IFeatureChecker`. Provide an `IsFeatureEnabled` reader
that goes directly against `IConfiguration`:

```csharp
private static bool IsFeatureEnabled(IConfiguration configuration, string featureId)
{
    var flags = configuration.GetSection("FeatureManagement:FeatureFlags")
                              .Get<List<FeatureFlag>>();
    return flags?.FirstOrDefault(f => string.Equals(f.Id, featureId, StringComparison.OrdinalIgnoreCase))?.Enabled ?? false;
}
```

`FeatureFlag` is a project-side POCO (`{ Id, Enabled, … }`) matching
the shape stored in `appsettings.features*.json`. Place it under
`<Name>.Domain.Shared\Features\` or wherever the project keeps feature
descriptors.

---

## Auth-server differences

- **`HttpApi.Host`** calls `SerilogConfigurationHelper.Configure(cfg, config)` — `isAuth:` omitted; the helper's default `false` applies. Verbose template (with any operator-added extensions) is used.
- **`AuthServer`** calls `SerilogConfigurationHelper.Configure(cfg, config, isAuth: true)`. The compact auth-variant template is used; operator-added extensions are dropped for the auth flow.

The asymmetry exists because the AuthServer's hot path (token issuance,
login, MFA) emits high-cardinality events where verbose templates
become noise; the compact variant keeps correlation + tenant / user
fields and discards the rest.

---

## Pitfalls

- **`IsFeatureEnabled` runs pre-DI.** It reads
  `FeatureManagement:FeatureFlags` directly from `IConfiguration` and
  cannot rely on `IFeatureChecker` (DI-scoped, per-request). Wiring
  `IFeatureChecker` here will compile but throw at startup when
  ServiceProvider is not yet built.
- **Helper class location.** Place `SerilogConfigurationHelper` in
  `Domain.Shared` (or a dedicated Logging assembly), NOT in
  `HttpApi.Host`. Both host projects call it; cross-project references
  between hosts are an anti-pattern.
- **`BufferBaseFilename` per-machine.** Including `Environment.MachineName`
  in the buffer path prevents two replicas from corrupting a shared
  buffer file when both write to a shared volume.
- **`AutoRegisterTemplateVersion = ESv8` + `TypeName = null`.** ES 7.x
  to 8.x removed mapping types. Mismatched options here silently fail
  template registration and produce mapping conflicts in the index.
- **Activity listener prerequisite.** Without
  `ActivityListenerSetup.Initialize()`, `ActivitySource.StartActivity()`
  returns `null` and Activity tracing emits no spans. The
  `Enrich.WithSpan()` registration is not enough on its own.
- **Output template extension drift.** Operator-added structured fields
  on the verbose template must be enriched by some upstream code path
  (e.g., middleware pushing properties to `LogContext`). Adding the
  placeholder without the enricher produces empty columns in every
  log line.

---

## Pack-LOG smoke tests

| Sink / feature | Verification |
|----------------|--------------|
| Console + File (always) | Emit a test log at startup; verify the line appears on stdout matching the template, and that `Logs/logs-<machine>-<ts>-*.txt` is created |
| Elasticsearch (gate on) | Emit a test log; verify a document lands in `{appName}-index-YYYY.MM.DD`. Stop the ES instance; emit logs; verify `Logs/elastic-buffer-<machine>*` files appear; restart ES; verify buffered events flush |
| Activity tracing (gate on) | Start a request; verify `TraceId` and `SpanId` populate in the log output template; verify any `<project-prefix>.*` tags promoted to log properties |

---

## Integration

- **Caller:** [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md) § Step 6.
- **Read with:** [`program-cs.md`](program-cs.md) — calls the helper
  defined here.
- **Anchors:** [`appsettings-schema.md`](appsettings-schema.md) carries
  the key catalog for `App:*`, `Elasticsearch:*`, and
  `FeatureManagement:FeatureFlags:*`.
- **Sibling detail files:** [`baseline-hardening.md`](baseline-hardening.md),
  [`feature-packs.md`](feature-packs.md), [`appsettings-schema.md`](appsettings-schema.md).
