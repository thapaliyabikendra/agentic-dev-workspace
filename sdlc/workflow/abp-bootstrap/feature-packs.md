---
name: abp-bootstrap-feature-packs
description: "Step 6 detail of abp-project-bootstrap — opt-in feature packs A-H (Hangfire, RabbitMQ event bus, ConcurrentLogin paired, Swagger ApiKey, Scriban+Smtp, Rate limiting, ExternalSsoLogin)."
applies_when:
  stack: [api]
  framework: [abp-net]
---

# ABP Bootstrap — Feature packs (opt-in)

> **Step 6 detail of [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md).**
> Eight opt-in feature packs (A-H). Each pack is a self-contained
> module-config delta — `DependsOn`, `ConfigureServices`,
> `OnApplicationInitialization`, `appsettings.json` keys, pitfalls,
> and a smoke test. **Pack-LOG (logging / Elasticsearch / Activity
> tracing) lives in its own file**: [`pack-logging.md`](pack-logging.md).

> **Read posture:** wholesale-read once when the operator is selecting
> packs. Re-read each pack section when applying it.

> **Paired-pack rule.** Packs C and G are **paired halves** of
> Concurrent-Login enforcement. Apply both or neither. Split state
> produces silent 401s on the un-paired half that mask the root cause.

---

## Per-pack section template

```
## Pack X: <Name>

**Module(s)**: HttpApi.Host | AuthServer | Both (paired)
**Paired with**: (if applicable)
**DependsOn additions**:
**ConfigureServices additions**:
**OnApplicationInitialization additions** (pipeline order):
**appsettings.json keys**:
**Pitfalls**:
**Smoke test**:
```

---

## Pack A — Hangfire (HttpApi.Host)

**Module(s):** `<Name>.HttpApi.Host`

**DependsOn additions:** `AbpBackgroundJobsHangfireModule`

**ConfigureServices additions:**

- `services.AddHangfire(cfg => cfg.UsePostgreSqlStorage(ConnectionStrings:Hangfire))` — separate connection string from `Default`
- Extend the existing `AddAuthentication(JwtBearerDefaults.AuthenticationScheme)` chain with `.AddCookie("Cookies")` + `.AddOpenIdConnect("oidc", ...)` — these are **additive non-default** schemes; the default remains `JwtBearer`
- `services.AddAuthorization(opts => opts.AddPolicy("HangfireDashboard", ...))` — a dashboard-access policy

**OnApplicationInitialization additions (pipeline order):**

- `app.UseHangfireServer()`
- `app.UseAbpHangfireDashboard("/hangfire", new DashboardOptions { Authorization = new[] { new HangfireAuthorizationFilter() } })` — placed **after** `UseAuthorization`

**appsettings.json keys:**

- `ConnectionStrings:Hangfire`

**Pitfalls:**

- The default authentication scheme stays `JwtBearer`. Cookie / OIDC are added on the chain via `.AddCookie(...)` / `.AddOpenIdConnect(...)`. **Changing the default scheme** here will silently break the existing API JWT path.
- Dashboard authorization must use a filter; the default Hangfire filter allows local-only access, which fails behind a reverse proxy.

**Smoke test:** start the host; `GET /hangfire` redirects to OIDC login; after login, the dashboard renders.

---

## Pack B — RabbitMQ event bus + inbox/outbox (3-project touch)

**Module(s):** `<Name>.HttpApi.Host` + `<Name>.EntityFrameworkCore` + the DB-migration project (`<Name>.DbMigrator`)

**DependsOn additions** (on the Host module):
`AbpEventBusRabbitMqModule`

**ConfigureServices additions (Host module):**

- `Configure<AbpRabbitMqEventBusOptions>(opts => { opts.ConnectionName = ...; opts.ClientName = ...; })`
- `Configure<AbpEventBusBoxesOptions>(opts => { opts.InboxWaitingEventTimeout = TimeSpan.FromHours(1); opts.OutboxWaitingEventTimeout = TimeSpan.FromHours(1); opts.EventCleanupTimeout = TimeSpan.FromDays(7); })`
- `Configure<AbpDistributedEventBusOptions>(opts => { opts.Inboxes.Configure(cfg => { cfg.UseDbContext<<Name>DbContext>(); }); opts.Outboxes.Configure(cfg => { cfg.UseDbContext<<Name>DbContext>(); }); })`

**EntityFrameworkCore DbContext additions:**

- Implement `IHasEventInbox` + `IHasEventOutbox` on `<Name>DbContext`
- Call `builder.ConfigureEventInbox()` + `builder.ConfigureEventOutbox()` in `OnModelCreating`

**EF migration:** add a migration that creates the `AbpEventInbox` and
`AbpEventOutbox` tables (the configure-calls emit the schema).

**appsettings.json keys:**

- `RabbitMQ:Connections:Default:HostName` etc. (full `AbpRabbitMqOptions` shape)

**Pitfalls:**

- **3-project touch.** Adding the Host module config without the
  `DbContext` interfaces + migration silently swallows publishes — the
  Distributed Event Bus tries to write to non-existent outbox tables
  and logs (or buffers, depending on ABP version) without failing
  loudly.
- **API surface verification.** Verify `Inboxes.Configure(...)` /
  `Outboxes.Configure(...)` signature against your installed ABP 8.x
  version (`Volo.Abp.EventBus.RabbitMQ`). The method names are stable
  but the delegate shape has evolved across versions.

**Smoke test:** start the host; verify `AbpEventInbox` and
`AbpEventOutbox` tables exist post-migration; publish a distributed
event from a test endpoint; verify the row appears in `AbpEventOutbox`
and is dispatched.

---

## Pack C — ConcurrentLogin (host half) — PAIRED with Pack G

**Module(s):** `<Name>.HttpApi.Host`

**Paired with:** Pack G (AuthServer half). Apply both or neither.

**ConfigureServices additions:**

- `Configure<SecurityStampValidatorOptions>(opts => { opts.OnRefreshingPrincipal = context => { /* preserve ConcurrentLoginToken claim */ }; })`
- `services.AddTransient<IAbpClaimsPrincipalContributor, ConcurrentLoginClaimsPrincipalContributor>()` — adds the `ConcurrentLoginToken` claim to the principal
- `services.AddTransient<ConcurrentLoginValidatorMiddleware>()`

**OnApplicationInitialization additions (pipeline order):**

- `app.UseMiddleware<ConcurrentLoginValidatorMiddleware>()` — placed **after** `UseAuthentication`, **before** `UseAuthorization`

**appsettings.json keys:**

- `FeatureManagement:FeatureFlags:ConcurrentLogin` (gate; honored on both halves)

**Pitfalls:**

- **Paired-pack rule.** Without Pack G stamping the token at sign-in,
  the host's validator middleware never finds a token to compare
  against and **every request returns 401**. The failure mode is
  silent at the AuthServer (login succeeds; no token written) and
  noisy at the host (401 storm) — operators chase the wrong end.
- Middleware order. Before `UseAuthentication` → no principal to read;
  after `UseAuthorization` → unauthorized requests bypass the check.

**Smoke test:** with the feature flag on, log in twice from two
browsers as the same user; verify the older session's next request
returns 401.

---

## Pack D — Swagger ApiKey (HttpApi.Host)

**Module(s):** `<Name>.HttpApi.Host`

**ConfigureServices additions:**

Add an additional `AddSwaggerGen(...)` block alongside
`AddAbpSwaggerGenWithOAuth(...)` — **additive, not replacement**:

```csharp
services.AddSwaggerGen(opts =>
{
    opts.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "x-api-key",
        Type = SecuritySchemeType.ApiKey,
        Description = "API key access (machine-to-machine)"
    });
    opts.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [ new OpenApiSecurityScheme { Reference = new OpenApiReference { Id = "ApiKey", Type = ReferenceType.SecurityScheme } } ] = Array.Empty<string>()
    });
});
```

**Pitfalls:**

- The block must be **additive**. Replacing the OAuth security
  definition removes the interactive auth flow from Swagger UI.

**Smoke test:** `GET /swagger` UI renders both an "Authorize" button
for OAuth and an "ApiKey" entry; supplying a header `x-api-key: <value>`
hits an endpoint protected by an API-key auth handler.

---

## Pack E — Scriban templating + SmtpEmailSender (HttpApi.Host)

**Module(s):** `<Name>.HttpApi.Host`

**DependsOn additions:** `AbpTextTemplatingScribanModule` (NuGet:
`Volo.Abp.TextTemplating.Scriban`)

**ConfigureServices additions:**

- `services.Replace(ServiceDescriptor.Transient<IEmailSender, SmtpEmailSender>())`
- `Configure<AbpVirtualFileSystemOptions>(opts => opts.FileSets.AddEmbedded<<Name>HttpApiHostModule>())` — embeds `*.tpl` Scriban templates from the host assembly
- Register Scriban templates via `Configure<AbpTextTemplatingOptions>` mapping template names to embedded resource paths

**appsettings.json keys:**

- `Settings:Abp.Mailing.Smtp.Host`, `:Port`, `:UserName`, `:Password`, `:EnableSsl`, `:Domain`
- `Settings:Abp.Mailing.DefaultFromAddress`, `:DefaultFromDisplayName`

**Pitfalls:**

- Both `AuthServer` and `HttpApi.Host` may need `SmtpEmailSender`. The
  AuthServer registers it in its own baseline (see
  [`baseline-hardening.md`](baseline-hardening.md) AuthServer #9). This
  pack handles the HttpApi.Host registration plus Scriban template
  bindings.

**Smoke test:** trigger an outbound notification (e.g., feature-flag
toggle email); verify SMTP delivery and the Scriban-rendered body.

---

## Pack F — Rate limiting (AuthServer)

**Module(s):** `<Name>.AuthServer`

**ConfigureServices additions:**

- Bind `services.Configure<IpRateLimitOptions>(configuration.GetSection("IpRateLimiting"))`
- Bind `services.Configure<IpRateLimitPolicies>(configuration.GetSection("IpRateLimitPolicies"))`
- `services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>()`
- `services.AddSingleton<IIpPolicyStore, DistributedCacheIpPolicyStore>()`
- `services.AddSingleton<IRateLimitCounterStore, DistributedCacheRateLimitCounterStore>()`
- `services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>()`
- `services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>()`

**OnApplicationInitialization additions (pipeline order):**

- `app.UseIpRateLimiting()` — placed **early**, before routing

**`OnPostApplicationInitializationAsync` (if available; else override):**

```csharp
public override async Task OnPostApplicationInitializationAsync(ApplicationInitializationContext context)
{
    var ipPolicyStore = context.ServiceProvider.GetRequiredService<IIpPolicyStore>();
    await ipPolicyStore.SeedAsync();
}
```

If the installed ABP version does not expose the async override,
fall back to `.GetAwaiter().GetResult()` on the synchronous
initialization path — document the compromise in the module file.

**appsettings.json keys:**

- `IpRateLimiting:*` — full `IpRateLimitOptions` shape (EnableEndpointRateLimiting, StackBlockedRequests, RealIpHeader, ClientIdHeader, GeneralRules)
- `IpRateLimitPolicies:*` — per-IP overrides

**Pitfalls:**

- `UseIpRateLimiting()` placement. After routing → routes already
  matched; the limiter only sees post-route requests.
- Distributed-cache backing. Without a configured Redis (`Redis:Configuration`),
  the rate-limit counter store falls back to in-memory — replicas
  enforce independent buckets.

**Smoke test:** with a tight per-IP policy, hammer a login endpoint;
verify the 429 response after the configured threshold.

---

## Pack G — ConcurrentLogin (auth half) — PAIRED with Pack C

**Module(s):** `<Name>.AuthServer`

**Paired with:** Pack C (HttpApi.Host half). Apply both or neither.

**ConfigureServices additions:**

- `services.AddScoped<SignInManager<IdentityUser>, PasswordExpirySignInManager>()` — the project-side `PasswordExpirySignInManager` stamps a `ConcurrentLoginToken` claim at sign-in success
- `services.AddSingleton<IFeatureManagementService, FeatureManagementService>()`
- Wrap registrations in the feature gate `FeatureManagement:FeatureFlags:ConcurrentLogin`

**appsettings.json keys:**

- `FeatureManagement:FeatureFlags:ConcurrentLogin` (gate; honored on both halves — same key as Pack C)

**Pitfalls:**

- **Paired-pack rule (reverse direction).** Without Pack C reading and
  validating the token on the host, Pack G stamps tokens that nothing
  ever checks — concurrent-login enforcement is a no-op. Failure is
  silent (everything appears to work).
- `SignInManager<TUser>` swap. The project-side subclass must call
  `base.SignInAsync(...)` and then stamp the token, in that order, so
  the token is included in the cookie principal.

**Smoke test:** combined with Pack C smoke test above.

---

## Pack H — ExternalSsoLogin (AuthServer)

**Module(s):** `<Name>.AuthServer`

**DependsOn additions:** `AbpAspNetCoreAuthenticationOpenIdConnectModule`

**ConfigureServices additions:**

```csharp
services
    .AddAuthentication()
    .AddAbpOpenIdConnect("ExternalSso", opts =>
    {
        opts.Authority    = configuration["ExternalSsoLogin:Authority"];
        opts.ClientId     = configuration["ExternalSsoLogin:ClientId"];
        opts.ClientSecret = configuration["ExternalSsoLogin:ClientSecret"];
        opts.RequireHttpsMetadata = !bool.Parse(configuration["ExternalSsoLogin:ByPassSSL"] ?? "false");
        opts.CallbackPath = configuration["ExternalSsoLogin:RedirectUri"];

        var scopes = configuration["ExternalSsoLogin:Scope"];   // nullable
        if (!string.IsNullOrWhiteSpace(scopes))
        {
            foreach (var scope in scopes.Split(' ', StringSplitOptions.RemoveEmptyEntries))
            {
                opts.Scope.Add(scope);
            }
        }

        opts.SignInScheme = IdentityConstants.ExternalScheme;
    });
```

**Cookie hardening (environment-conditional):**

```csharp
if (!env.IsDevelopment())
{
    services.Configure<CookiePolicyOptions>(opts =>
    {
        opts.MinimumSameSitePolicy = SameSiteMode.None;
        opts.Secure = CookieSecurePolicy.Always;
    });
}
```

**appsettings.json keys:**

- `ExternalSsoLogin:Authority`
- `ExternalSsoLogin:ClientId`
- `ExternalSsoLogin:ClientSecret`
- `ExternalSsoLogin:ByPassSSL` (bool string — only `true` in dev)
- `ExternalSsoLogin:RedirectUri`
- `ExternalSsoLogin:Scope` (nullable — space-separated)

**Pitfalls:**

- **`AddAbpOpenIdConnect` wrapper.** Use ABP's wrapper, not the raw
  `AddOpenIdConnect(...)` from Microsoft. The wrapper normalizes
  inbound claim names to `AbpClaimTypes.*` so downstream
  `IAbpClaimsPrincipalContributor` chains see the expected shape.
- **`SameSite=None` on HTTP dev.** Browsers silently reject
  `SameSite=None` cookies over plain HTTP. The cookie-hardening block
  is **environment-conditional** — apply only when `!env.IsDevelopment()`.
- **`SignInScheme = IdentityConstants.ExternalScheme`.** Required for
  ABP's external-login flow to pick up the principal. Changing the
  scheme silently breaks the post-redirect login completion.
- **Scope nullable.** Hardcoding a scope in the published file would
  bind to one provider's expectations. The configuration value is
  nullable; the publisher must leave it un-set when the provider
  ships sensible defaults.

**Smoke test:** click "External login" on the AuthServer login page;
get redirected to the IdP; complete login; return to a logged-in
session at the AuthServer.

---

## Pack catalog at a glance

| Pack | Module(s) | Paired? | Feature flag |
|------|-----------|---------|--------------|
| A — Hangfire | HttpApi.Host | — | — |
| B — RabbitMQ event bus + inbox/outbox | HttpApi.Host + EFCore + DbMigrator | — | — |
| C — ConcurrentLogin (host half) | HttpApi.Host | with G | `ConcurrentLogin` |
| D — Swagger ApiKey | HttpApi.Host | — | — |
| E — Scriban + SmtpEmailSender | HttpApi.Host | — | — |
| F — Rate limiting | AuthServer | — | (none — config-driven) |
| G — ConcurrentLogin (auth half) | AuthServer | with C | `ConcurrentLogin` |
| H — ExternalSsoLogin | AuthServer | — | — |

For Pack-LOG (logging / Elasticsearch / Activity tracing) see
[`pack-logging.md`](pack-logging.md).

---

## Integration

- **Caller:** [`../abp-project-bootstrap.md`](../abp-project-bootstrap.md) § Step 6.
- **Read with:** [`pack-logging.md`](pack-logging.md) (Pack-LOG lives
  there), [`appsettings-schema.md`](appsettings-schema.md) (full key
  catalog), [`baseline-hardening.md`](baseline-hardening.md) (baseline
  items that some packs extend).
