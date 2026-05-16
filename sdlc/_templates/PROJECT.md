# Project Configuration

> **Type:** Project-owned reference document. Seed once per project into
> `docs/project.md`. This is the **single source of truth** for all
> project-specific information that engine files reference as examples or
> defaults (product name, company, tech stack, component names, ADR ranges,
> cross-cutting constants, Phase A verification terms).
>
> When adopting the framework for a new project, copy this template to
> `docs/project.md` and replace every `[slot]` with the project's values
> before running any other SETUP step.
>
> **Template path:** `sdlc/_templates/PROJECT.md`
> **Seed path:** `docs/project.md`

---

## Seeding instructions

Replace every `[bracketed slot]` below with the project's chosen value.
Surface any open question (e.g., "what is the correct data retention period?")
as an `OQ-NNN` under `docs/discovery/open-questions/` rather than guessing.

Slots to fill:

- `[product name]` — the marketed product or system name
- `[company / team]` — owning organization or team
- `[business domain]` — the business domain in one phrase
- `[project type]` — `brownfield` or `greenfield`
- Component table — one row per bounded component; repeat as needed
- Repo layout table — one row per git repository (multi-repo projects only; delete section for single-repo)
- Tech stack table — one row per layer; remove irrelevant rows; add layers
- Cross-cutting constants — four values that also seed baseline prose in the relevant CCC pages under `docs/shared/ccc/`
- Phase A grep terms — project-specific search terms used during
  [`sdlc/BOUNDARY.md`](../BOUNDARY.md) Phase A boundary checks
- Milestones table — one row per planned or active milestone

After seeding, record the seeding event in the Revision history table.

---

## Identity

| Field | Value |
|---|---|
| Product name | [product name] |
| Company / team | [company / team] |
| Business domain | [business domain] |
| Project type | [brownfield \| greenfield] |

---

## Components

One row per bounded component registered in this workspace. The `ID prefix`
and `ADR range` columns are used by index generators and ID-collision checks.
See [`sdlc/LAYOUT.md`](../LAYOUT.md) for component folder layout.

| Slug | Description | Tech stack | ID prefix | ADR range |
|---|---|---|---|---|
| [component-slug] | [Product name — one-line tech description] | [runtime / framework] | [PREFIX] | ADR-NNN..NNN |

---

## Repo layout

> **Multi-repo projects only.** Delete this section for single-repo workspaces.
> See [`sdlc/LAYOUT.md § Multi-Repo Strategy`](../sdlc/LAYOUT.md#multi-repo-strategy)
> for directory layout rules, commit rule, and verification checklist.

| Concern | Local path | Remote |
|---|---|---|
| Planning / DDD knowledge base | `[workspace-root]/` | `github.com/[org]/[workspace-repo]` |
| Docs / Wiki | `[workspace-root]/docs/` | `github.com/[org]/[docs-repo]` |
| API | `[workspace-root]/api/` | `github.com/[org]/[api-repo]` |
| UI | `[workspace-root]/ui/` | `github.com/[org]/[ui-repo]` |

Add or remove rows to match the project's actual repo count.

---

## Tech Stack Summary

Remove rows that do not apply. Add rows for layers not listed.

| Layer | Technology |
|---|---|
| Application framework | [e.g. .NET 9 + ABP 8.x, Node 22 + NestJS, Python 3.12 + FastAPI] |
| Streaming / processing | [e.g. Apache Kafka / Apache Flink / Apache Druid — or N/A] |
| Message broker | [e.g. RabbitMQ, Azure Service Bus — or same as streaming row] |
| Test runner | [e.g. Playwright, pytest, Jest, xUnit] |
| CI/CD | [e.g. GitLab CI, GitHub Actions, Azure DevOps] |

---

## Cross-Cutting Constants

These values seed baseline prose in the relevant CCC pages under
`docs/shared/ccc/` (timezone → CCC-007 localization context; locale → CCC-007;
retention → CCC-012 / CCC-004; audit-read role → CCC-004). A change here
requires updating the affected CCC pages and bumping each one's
`updated:` frontmatter + revision history entry.

| Constant | Value |
|---|---|
| Operating timezone | [e.g. Asia/Kathmandu, UTC, America/New_York] |
| Primary locale | [e.g. en-US, ja-JP, fr-FR] |
| Default data retention | [e.g. 7 years, 5 years] |
| Audit-read role | [e.g. Compliance Officer, Privacy Officer, Internal Audit] |

---

## Phase A Boundary Verification

Project-specific grep terms used when running the Phase A checks in
[`sdlc/BOUNDARY.md`](../BOUNDARY.md). Organize into two lists: terms that
identify the tech stack, and terms that identify domain vocabulary specific
to this project.

These terms form the basis of the verification commands that confirm no
project-specific content has leaked into engine files.

### Tech-stack terms

```
[e.g. dotnet build, ABP, IMultiTenant, IStringLocalizer, ConcurrencyStamp]
```

### Domain-vocabulary terms

```
[e.g. company name, product-specific entity names, role names, locale
strings, currency, retention period as a literal string]
```

---

## Milestones

| ID | Slug | Description | Status |
|---|---|---|---|
| M-NN | [slug] | [one line] | planned \| active \| done |

---

## Revision history

| Version | Date | Changes |
|---|---|---|
| 1.0 | YYYY-MM-DD | Seeded from `sdlc/_templates/PROJECT.md` v1.0. |
