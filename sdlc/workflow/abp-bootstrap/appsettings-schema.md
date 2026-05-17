---
name: abp-bootstrap-appsettings-schema
description: "Step 7 detail of abp-project-bootstrap — full appsettings.json key catalog (baseline + per-pack), required-vs-optional, read-by, defaults, plus the feature-files split convention."
applies_when:
  stack: [api]
  framework: [abp-net]
---

# ABP Bootstrap — appsettings.json schema

> **Step 7 detail of [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md).**
> Single catalog of every key the bootstrap procedure touches —
> baseline hardening, Pack-LOG, and each opt-in pack. Use this as a
> checklist when authoring `appsettings.json` and its environment /
> feature / secret variants.

> **Read posture:** wholesale-read at Step 7. Also re-read when adding
> a new feature pack so its keys land in the right config file.

---

## Key catalog

`Required?` legend:
- **Yes** — host fails to start without it
- **Yes (pack)** — required only when the named pack is applied
- **Optional** — default applies when absent
- **Conditional** — required given a sibling key's value

### `App:*`

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `App:SelfUrl` | string | Yes | host (OpenIddict issuer, Swagger UI base) | `https://api.example.com` |
| `App:ClientUrl` | string | Yes | host (redirect targets) | `https://app.example.com` |
| `App:CorsOrigins` | string (comma) | Yes | host (`AddCors`) | `https://app.example.com,https://admin.example.com` |
| `App:PathBase` | string | Optional | host (`UsePathBase`) | empty; set when behind a reverse-proxy path prefix |
| `App:ConfigureHttpsForwardingBehindProxy` | bool | Optional | baseline #1 (HttpApi.Host + AuthServer) | `false` |
| `App:RedirectAllowedUrls` | string (comma) | Optional | OpenIddict valid post-logout redirects | empty |
| `App:Id` | string | Optional | Pack-LOG (`ElasticsearchSinkOptions.IndexFormat`) | falls back to `<application-slug>-{machine}` when absent |

### `AuthServer:*`

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `AuthServer:Authority` | string | Yes | HttpApi.Host (JWT validation) | `https://auth.example.com` |
| `AuthServer:RequireHttpsMetadata` | bool | Yes | HttpApi.Host | `true` (prod) / `false` (dev) |
| `AuthServer:SwaggerClientId` | string | Yes (HttpApi.Host) | Swagger OAuth config | `<Name>_Swagger` |

### `ConnectionStrings:*`

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `ConnectionStrings:Default` | string | Yes | EF Core | PostgreSQL DSN |
| `ConnectionStrings:Hangfire` | string | Yes (Pack A) | Hangfire storage | separate DB or schema from `Default` |

### `Redis:*`

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `Redis:Configuration` | string | Yes | DistributedCache, data-protection key ring, Pack F counter store | `localhost:6379` |

### `OpenIddict:*`

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `OpenIddict:AccessTokenLifetimeInSeconds` | int | Optional | AuthServer baseline #10 | `7200` |
| `OpenIddict:IdentityTokenLifetimeInSeconds` | int | Optional | AuthServer baseline #10 | `7200` |

### `Elasticsearch:*` (Pack-LOG)

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `Elasticsearch:Uri` | string | Conditional (when `FeatureManagement:FeatureFlags:Logging.Elasticsearch` is on) | `SerilogConfigurationHelper.ConfigureElasticsearchSink` | `http://localhost:9200` |
| `Elasticsearch:UserName` | string | Optional | basic-auth wiring | empty |
| `Elasticsearch:Password` | string | Optional | basic-auth wiring | empty |

### `FeatureManagement:FeatureFlags:*`

Stored as a JSON array of `{ Id, Enabled }` objects (matching the
project-side `FeatureFlag` POCO described in
[`pack-logging.md`](pack-logging.md)).

| Feature Id | Required? | Read by | Default / example |
|------------|-----------|---------|-------------------|
| `Logging.Elasticsearch` | Yes (Pack-LOG) | `SerilogConfigurationHelper` | `false` |
| `ActivityTracing` | Yes (Pack-LOG) | `SerilogConfigurationHelper` | `false` |
| `ConcurrentLogin` | Yes (Pack C + G) | both halves | `false` |
| `RateLimiting` | Optional | (project-defined; not used by Pack F directly — Pack F is config-driven) | `false` |
| `<project-specific>` | Optional | project code | — |

### `ExternalSsoLogin:*` (Pack H — 6 keys)

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `ExternalSsoLogin:Authority` | string | Yes (Pack H) | AuthServer | IdP authority URL |
| `ExternalSsoLogin:ClientId` | string | Yes (Pack H) | AuthServer | IdP client id |
| `ExternalSsoLogin:ClientSecret` | string | Yes (Pack H) | AuthServer | IdP client secret — **belongs in `*.secrets.json`** |
| `ExternalSsoLogin:ByPassSSL` | bool (string) | Optional | AuthServer (controls `RequireHttpsMetadata`) | `false`; `true` only in dev |
| `ExternalSsoLogin:RedirectUri` | string | Yes (Pack H) | AuthServer (`CallbackPath`) | e.g. `/signin-external-sso` |
| `ExternalSsoLogin:Scope` | string (space-separated, **nullable**) | Optional | AuthServer | empty (let the IdP defaults apply); set explicitly only when the provider requires non-default scopes |

### `IpRateLimiting:*` + `IpRateLimitPolicies:*` (Pack F)

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `IpRateLimiting:EnableEndpointRateLimiting` | bool | Yes (Pack F) | `IpRateLimitOptions` | `true` |
| `IpRateLimiting:StackBlockedRequests` | bool | Optional | `IpRateLimitOptions` | `false` |
| `IpRateLimiting:RealIpHeader` | string | Optional | `IpRateLimitOptions` | `X-Real-IP` |
| `IpRateLimiting:ClientIdHeader` | string | Optional | `IpRateLimitOptions` | `X-ClientId` |
| `IpRateLimiting:GeneralRules` | array | Yes (Pack F) | `IpRateLimitOptions` | per-endpoint rules |
| `IpRateLimitPolicies:IpRules` | array | Optional | `IpRateLimitPolicies` | per-IP overrides |

### `RabbitMQ:*` (Pack B)

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `RabbitMQ:Connections:Default:HostName` | string | Yes (Pack B) | `AbpRabbitMqOptions` | `localhost` |
| `RabbitMQ:Connections:Default:Port` | int | Optional | `AbpRabbitMqOptions` | `5672` |
| `RabbitMQ:Connections:Default:UserName` | string | Yes (Pack B) | `AbpRabbitMqOptions` | — |
| `RabbitMQ:Connections:Default:Password` | string | Yes (Pack B) | `AbpRabbitMqOptions` | — **belongs in `*.secrets.json`** |

### `Settings:*` (ABP-managed settings, including SMTP — Pack E)

| Key path | Type | Required? | Read by | Default / example |
|----------|------|-----------|---------|-------------------|
| `Settings:Abp.Mailing.Smtp.Host` | string | Yes (Pack E or AuthServer baseline #9) | `SmtpEmailSender` | — |
| `Settings:Abp.Mailing.Smtp.Port` | int | Optional | `SmtpEmailSender` | `587` |
| `Settings:Abp.Mailing.Smtp.UserName` | string | Optional | `SmtpEmailSender` | — |
| `Settings:Abp.Mailing.Smtp.Password` | string | Optional | `SmtpEmailSender` | — **`*.secrets.json`** |
| `Settings:Abp.Mailing.Smtp.EnableSsl` | bool | Optional | `SmtpEmailSender` | `true` |
| `Settings:Abp.Mailing.Smtp.Domain` | string | Optional | `SmtpEmailSender` | — |
| `Settings:Abp.Mailing.DefaultFromAddress` | string | Yes (Pack E) | `SmtpEmailSender` | — |
| `Settings:Abp.Mailing.DefaultFromDisplayName` | string | Optional | `SmtpEmailSender` | — |

---

## Feature-files split convention

`Program.cs` Stage-2 loads five JSON files in addition to base
`appsettings.json` and `appsettings.{env}.json` (see
[`program-cs.md`](program-cs.md) § Multi-file appsettings loading).
The split convention:

| File | Belongs in this file | Excluded from this file |
|------|----------------------|--------------------------|
| `appsettings.json` | `App:*`, `AuthServer:*`, `ConnectionStrings:Default` (non-secret), `Redis:Configuration` (non-secret), `OpenIddict:*`, `IpRateLimiting:*` | `FeatureManagement:*`, all secrets |
| `appsettings.{env}.json` | Environment-specific overrides of the above (e.g., dev `App:SelfUrl`) | Secrets |
| `appsettings.{env}.secrets.json` | All secret values: `ConnectionStrings:Default` password segment if not gitignored elsewhere, `Redis:Configuration` password, SMTP password, RabbitMQ password, `ExternalSsoLogin:ClientSecret`, `Elasticsearch:Password` | Anything non-secret |
| `appsettings.features.json` | `FeatureManagement:FeatureFlags:*` (the default for the application) | Per-env overrides; secrets |
| `appsettings.features.{env}.json` | Per-env feature-flag overrides (e.g., enable `Logging.Elasticsearch` in `Staging`, disable in `Development`) | Secrets |
| `appsettings.features.{env}.secrets.json` | Per-env feature-flag *credentials* — currently the Elasticsearch credentials when the `Logging.Elasticsearch` flag is on per-env. Use sparingly | Non-secret values |

All five additional files are loaded with `optional: true` and
`reloadOnChange: true`. None of them are committed in a state that
includes real secrets; `*.secrets.json` patterns are gitignored.

---

## Verification

Before completing Step 7:

- Every key required by an enabled pack has a value (or a documented
  fallback) in one of the loaded files.
- Every secret-classed value is in a `*.secrets.json` file, not in
  the base `appsettings.json`.
- Feature flags consumed by Pack-LOG (`Logging.Elasticsearch`,
  `ActivityTracing`) and Pack C+G (`ConcurrentLogin`) are present
  even when set to `false`, so the pre-DI reader can find and parse
  the entries.

---

## Integration

- **Caller:** [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md) § Step 7.
- **Read with:** [`program-cs.md`](program-cs.md) (loads the files),
  [`pack-logging.md`](pack-logging.md) (consumes `App:Id`,
  `Elasticsearch:*`, `FeatureManagement:FeatureFlags:*`),
  [`feature-packs.md`](feature-packs.md) (each pack section enumerates
  the keys it consumes).
