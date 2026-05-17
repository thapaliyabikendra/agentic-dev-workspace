---
name: abp-project-bootstrap
description: "Standalone operator workflow — scaffold a new ABP api/ solution via `abp new` and apply baseline hardening + opt-in feature packs to HttpApi.Host and AuthServer. Independent of dev/QA pipelines."
applies_when:
  stack: [api]
  framework: [abp-net]
---

# ABP Project Bootstrap

> Bring up a new ABP `api/` solution from zero: scaffold via `abp new`,
> then walk Steps 4-7 to apply Program.cs delta, both modules' baseline
> hardening, the opt-in feature packs the project needs, and the full
> `appsettings.json` schema. Standalone — invoked by the operator,
> independent of the dev-track and QA-track flows.

> **HARD-GATE (workflow-local — not CLAUDE.md Hard rule 12):**
>
> 1. **No auto-`abp new`.** The CLI scaffold call writes a project tree
>    and is irreversible without `git clean`. Operator authorization is
>    required **per invocation**; one authorization = one invocation; no
>    carry-forward. CLAUDE.md Hard rule 12 covers commit-equivalents
>    (`git commit`, `gh pr create`); this op enforces its own gate
>    because `abp new` predates the commit gate in the lifecycle.
> 2. **No split-pack apply.** Paired packs ship together or neither
>    ships. The only paired pair in this op is **Pack C ↔ Pack G**
>    (Concurrent-Login host half + auth half). Splitting them produces
>    silent 401 storms on the un-paired half that mask the root cause —
>    see Anti-Pattern below.

---

## When to Use

**Use when:**

- Bringing up a new ABP api project (`api/*.slnx` absent + scaffolding required).
- Configuring a freshly-scaffolded ABP api project before any business code is written.
- Retroactively closing a baseline-hardening gap — e.g., an audit reveals HSTS missing or `MapHealthChecks` absent — by routing through this op as the canonical procedure.

**Do NOT use when:**

- Adding business features to an already-bootstrapped, already-hardened api project.
- The target is non-ABP / non-.NET. This workflow binds only when `applies_when: { stack: [api], framework: [abp-net] }`.
- Upgrading ABP version or .NET SDK runtime — a dedicated upgrade procedure handles those (TBD; outside this op's scope).

**Vs. sibling files:**

- [`new-component-bootstrap.md`](new-component-bootstrap.md) declares a docs-side component (`COMPONENT.md`, `id_prefix:`) — the **planning surface**. This file bootstraps the **runtime surface** (csproj projects, module config, logging). Independent of each other; both may apply to the same project, but neither requires the other.
- [`open-milestone.md`](open-milestone.md) opens a planning container; this file builds runtime substrate. Independent.
- [`maintenance-discipline.md`](maintenance-discipline.md) governs canonical-doc edits. This file produces new project files **outside the doc-canonical tree** (`api/src/<Name>.*`) and is its own discipline.

---

## Step 1 — Detection

Probe the target workspace in this order:

1. `api/*.slnx`
2. `api/src/*HttpApi.Host/`
3. `api/src/*AuthServer/`
4. `ui/angular.json`

Emit a classification banner:

| Banner | Meaning | Next |
|--------|---------|------|
| `SCAFFOLD_NEEDED` | All four probes absent | Proceed to Step 2, then Step 3 |
| `CONFIGURE_ONLY` | Solution + host directories present; host modules unhardened | Skip Step 3; jump to Step 4 |
| `NO_OP` | All present + already hardened | Verify the checklist at the end of this file; exit |
| `ANOMALY` | Mixed (e.g., `HttpApi.Host` present, `AuthServer` absent) | **Stop.** Surface the discrepancy; manual remediation required before this op can continue |

---

## Step 2 — Toolchain preflight

| Tool | Required version | Source of truth |
|------|------------------|-----------------|
| `dotnet` | ≥ 9.x | https://abp.io/get-started |
| `abp` (CLI) | ≥ 8.x | NuGet `Volo.Abp.Cli` |
| `node` | LTS (≥ 20) | Angular 17+ requirement |
| `npm` or `yarn` | present | Either suffices |

**Hard-fail on miss.** Do NOT install or upgrade tools inline — surface
the gap and require the operator to install before continuing.

---

## Step 3 — Scaffold (gated)

Print the exact command in a fenced block and **wait for explicit
per-invocation authorization** (HARD-GATE clause 1):

```
abp new <Name> -u angular -dbms PostgreSQL -m none --separate-auth-server --theme basic -csf
```

Flag explanation:

| Flag | Meaning |
|------|---------|
| `-u angular` | UI tier |
| `-dbms PostgreSQL` | Database |
| `-m none` | No extra ABP modules |
| `--separate-auth-server` | Two host projects (HttpApi.Host + AuthServer) |
| `--theme basic` | Lightest Razor theme for AuthServer pages |
| `-csf` | Create solution folder |

**Post-scaffold sanity** (all must pass before Step 4):

- `api/<Name>.slnx` exists
- `api/src/<Name>.HttpApi.Host/` and `api/src/<Name>.AuthServer/` both exist
- `dotnet build api/<Name>.slnx` exits 0

If any check fails, **stop and surface**; do not paper over scaffold
errors with manual edits.

---

## Step 4 — Program.cs and startup

Apply the five-change delta over each module's scaffolded `Program.cs`
when Pack-LOG is in scope.

→ See [`abp-bootstrap/program-cs.md`](abp-bootstrap/program-cs.md) for the
complete delta (two-stage Serilog bootstrap, multi-file appsettings
loading, helper callback wiring, async close).

If Pack-LOG is **not** in scope, skip this step — the scaffolded
single-stage Serilog is sufficient for non-Elasticsearch deployments.

---

## Step 5 — Module baseline hardening

Apply 10 items to `<Name>.HttpApi.Host` and 10 items to
`<Name>.AuthServer` (some items overlap; the detail file accounts for
overlap).

→ See [`abp-bootstrap/baseline-hardening.md`](abp-bootstrap/baseline-hardening.md).

Baseline items anchor three rules in
[`../standards/STD-005-abp-coding-conventions.md`](../standards/STD-005-abp-coding-conventions.md):

- **Rule 10** — Auto API Controllers default exposure (HttpApi.Host #10)
- **Rule 14** — Typed-exception HTTP mapping *policy* registration (HttpApi.Host + AuthServer #3)
- **Rule 17** — Audit-module *configuration block* (HttpApi.Host #7 + AuthServer #7)

---

## Step 6 — Feature packs (opt-in)

Select the packs the project needs. **Pack-LOG** (Serilog enrichment +
Elasticsearch + Activity tracing) is in its own file:

→ See [`abp-bootstrap/pack-logging.md`](abp-bootstrap/pack-logging.md).

All other packs (A-H) are in one file:

→ See [`abp-bootstrap/feature-packs.md`](abp-bootstrap/feature-packs.md).

| Pack | One-line summary |
|------|------------------|
| A — Hangfire | Background jobs + dashboard |
| B — RabbitMQ event bus + inbox/outbox | Distributed events with durable in/outbox |
| C — ConcurrentLogin (host half) | Validates the auth-stamped token on each request |
| D — Swagger ApiKey | Additive ApiKey security definition alongside OAuth |
| E — Scriban templating + SmtpEmailSender | Templated outbound email |
| F — Rate limiting | Per-IP rate limiting on AuthServer |
| G — ConcurrentLogin (auth half) | Stamps the token at sign-in |
| H — ExternalSsoLogin | Inbound OIDC SSO via ABP wrapper |
| LOG — Logging + Elasticsearch + Activity tracing | Two-stage Serilog, durable buffer, span tracing |

**Paired-pack rule (HARD-GATE clause 2):** Packs C + G ship together or
neither ships.

---

## Step 7 — appsettings.json schema

Author `appsettings.json` and its environment / feature / secret
variants using the full key catalog.

→ See [`abp-bootstrap/appsettings-schema.md`](abp-bootstrap/appsettings-schema.md).

The schema covers `App:*`, `AuthServer:*`, `ConnectionStrings:*`,
`Redis:*`, `OpenIddict:*`, `Elasticsearch:*`,
`FeatureManagement:FeatureFlags:*`, `ExternalSsoLogin:*` (Pack H),
`IpRateLimiting:*` + `IpRateLimitPolicies:*` (Pack F), `RabbitMQ:*`
(Pack B), and `Settings:*` (SMTP — Pack E / AuthServer baseline #9).
The detail file also carries the feature-files split convention (which
keys belong in `appsettings.json` vs. `appsettings.features.json` vs.
`*.secrets.json`).

---

## Step 8 — Verification

Run after Steps 4-7 are applied:

- `dotnet build api/<Name>.slnx` → exit 0.
- `dotnet run --project api/src/<Name>.DbMigrator` → completes. If
  **Pack B** is applied, verify `AbpEventInbox` and `AbpEventOutbox`
  tables exist post-migration.
- Start `AuthServer` and `HttpApi.Host`.
- `GET /hc` and `GET /liveness` on both → both return 200; `/liveness`
  is anonymous.
- `GET /swagger` on `HttpApi.Host` → UI loads, v1 spec renders.
- OAuth code flow: Swagger UI → AuthServer login → token → an
  authenticated call against `HttpApi.Host` succeeds.
- **Pack-LOG smoke tests** (when applied) — see
  [`abp-bootstrap/pack-logging.md`](abp-bootstrap/pack-logging.md) §
  Pack-LOG smoke tests.
- **Per-pack smoke tests** — each pack section in
  [`abp-bootstrap/feature-packs.md`](abp-bootstrap/feature-packs.md) and
  in `pack-logging.md` ends with its own smoke test; run each for
  packs applied.

If any check fails, **return to the relevant step** rather than
patching forward — bootstrap failures compound silently.

---

## Anti-Pattern: "Feature Pack Drift"

Applying one half of a paired pack — or the host-module piece of a
multi-project pack without the DbContext / migration piece — because
the work feels close to done and the second half can be picked up
later. The temptation: Pack C "looks complete on its own" because the
host-side middleware compiles and the project builds; the operator
plans to come back for Pack G. The cost:

- **Pack C without Pack G** — the host's `ConcurrentLoginValidatorMiddleware` reads a `ConcurrentLoginToken` claim that is never written; every request returns 401 against the configured user. The AuthServer log is silent (sign-in succeeded); the host log is noisy (401 storm). Operators chase routing, CORS, and reverse-proxy configuration before realizing the token was never stamped.
- **Pack G without Pack C** — sign-in stamps a token that nothing ever validates. Concurrent-login enforcement is a no-op; the operator believes the protection is on, audits pass, and the failure surfaces only when an incident review traces a second-session reuse the system was supposed to block.
- **Pack B host config without DbContext + migration** — the host writes events to non-existent outbox tables; ABP's distributed bus logs (or buffers, depending on version) without failing loudly. Publishes silently swallow.

**Rule:** paired packs ship together or neither ships. Multi-project
packs apply across all named projects in one work session. The
bootstrap checklist below enforces this with explicit "both halves
applied" gates.

Doctrinal anchor: [`../PRINCIPLES.md`](../PRINCIPLES.md) — see the
*half-applied configuration* family of failure modes.

---

## Bootstrap checklist

**Step 1 — Detection**

- [ ] Detection banner emitted: `SCAFFOLD_NEEDED` / `CONFIGURE_ONLY` / `NO_OP` / `ANOMALY`
- [ ] If `ANOMALY`, stopped and surfaced to operator

**Step 2 — Toolchain**

- [ ] `dotnet` ≥ 9.x present
- [ ] `abp` CLI ≥ 8.x present
- [ ] `node` LTS (≥ 20) present
- [ ] `npm` or `yarn` present

**Step 3 — Scaffold** (skip if `CONFIGURE_ONLY`)

- [ ] Exact `abp new` command printed
- [ ] Operator authorization received (per HARD-GATE clause 1)
- [ ] `api/<Name>.slnx` exists
- [ ] `api/src/<Name>.HttpApi.Host/` + `api/src/<Name>.AuthServer/` exist
- [ ] `dotnet build api/<Name>.slnx` exits 0

**Step 4 — Program.cs (Pack-LOG in scope)**

- [ ] `program-cs.md` read
- [ ] Stage-1 logger → bootstrap logger (minimal)
- [ ] Stage-2 logger via helper callback — `HttpApi.Host` omits `isAuth:`; `AuthServer` passes `isAuth: true`
- [ ] Multi-file `ConfigureAppConfiguration` block inserted between `AddAppSettingsSecretsJson()` and `UseAutofac()`
- [ ] `Log.CloseAndFlush()` → `await Log.CloseAndFlushAsync()`
- [ ] Scaffold default chain order preserved

**Step 5 — Baseline hardening**

- [ ] `baseline-hardening.md` read
- [ ] HttpApi.Host items 1-10 applied (no `Configure<IdentityOptions>` here)
- [ ] AuthServer items 1-10 applied (`Configure<IdentityOptions>` here only)
- [ ] `UseHsts` ordered before `UseHttpsRedirection` in both
- [ ] STD-005 Rules 10 / 14 / 17 anchored in code

**Step 6 — Feature packs**

- [ ] `pack-logging.md` read (if Pack-LOG applied)
- [ ] `feature-packs.md` read (if any of Packs A-H applied)
- [ ] Per pack applied: `[ ] Pack A` `[ ] Pack B` `[ ] Pack D` `[ ] Pack E` `[ ] Pack F` `[ ] Pack H` `[ ] Pack-LOG`
- [ ] **Paired-pack gate:** if Pack C applied, Pack G applied (and vice versa); else neither
- [ ] Pack B: DbContext interfaces + migration applied alongside Host config (3-project touch verified)

**Step 7 — appsettings**

- [ ] `appsettings-schema.md` read
- [ ] Every required key present (per-pack `Required?` column)
- [ ] Secrets confined to `*.secrets.json` files
- [ ] Feature flags consumed by Pack-LOG / Pack C+G present even when `false`

**Step 8 — Verification**

- [ ] `dotnet build` exits 0
- [ ] `DbMigrator` runs to completion
- [ ] `/hc` + `/liveness` return 200 on both hosts
- [ ] Swagger UI loads on HttpApi.Host
- [ ] OAuth code flow succeeds end-to-end
- [ ] Pack-LOG smoke tests pass (when applied)
- [ ] Per-pack smoke tests pass for each applied pack

---

## Integration

- **Required before:** [`../standards/STD-005-abp-coding-conventions.md`](../standards/STD-005-abp-coding-conventions.md) — Rules 10, 14, 17 are anchored by Step 5 baseline items. Rule 14 governs the typed-exception HTTP mapping **policy** registered by item #3; Rule 17 governs the audit-module **configuration block** whose `ApplicationName` sub-field is item #7.
- **Callers:** **NONE.** This op is invoked directly by the operator when bringing up a new ABP project. Independent of every dev-track and QA-track flow registered in [`index.md`](index.md).
- **Routes to (situational):** none in the dev / QA pipeline. Each detail file under [`abp-bootstrap/`](abp-bootstrap/) is read on traversal as the operator reaches Steps 4-7.
- **Sibling utility ops:** [`open-milestone.md`](open-milestone.md), [`new-component-bootstrap.md`](new-component-bootstrap.md), [`evolving-the-workflow.md`](evolving-the-workflow.md) — independent peers; none is upstream or downstream of this op.
