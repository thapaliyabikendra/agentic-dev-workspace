# Standards — By-Layer Pointer Index

> Karpathy-style index for `sdlc/standards/by-layer/`. Each entry is a
> **pointer file** — it cites rule IDs only, never restates rule text.
> Phase 3 code-writing sub-agents load their per-layer pointer file **plus**
> `cross-cutting.md` per
> `sdlc/workflow/implementation.md § Stage 2 Code — per-layer dispatch`.
>
> Orchestrators load `sdlc/standards/index.md` and this file (two reads)
> to confirm routing before dispatching. Per-rule body text is narrow-loaded
> from the source STD page only when authoring code that touches that rule's
> surface.

---

## Conventions

- **Layer** — the ABP project / layer name (matches the pointer file name).
- **ABP project** — the `.csproj`-level project this pointer governs.
- **Cohort** — ADR-009 cohort (`A` / `B` / `C`). Cohort D (`HttpApi.Host`) is
  out of scope; that project gets a pointer file when an FRS requires host code.
- **Pointer file** — relative path inside `by-layer/`.

---

## Pointer files

| Layer | ABP project | Cohort | Pointer file |
| ----- | ----------- | ------ | ------------ |
| Cross-cutting | _all projects_ | n/a | [cross-cutting.md](cross-cutting.md) |
| Domain.Shared | `<Project>.<Module>.Domain.Shared` | A | [shared.md](shared.md) |
| Domain | `<Project>.<Module>.Domain` | A | [domain.md](domain.md) |
| Application.Contracts | `<Project>.<Module>.Application.Contracts` | B | [contracts.md](contracts.md) |
| Application | `<Project>.<Module>.Application` | B | [application.md](application.md) |
| EntityFrameworkCore | `<Project>.<Module>.EntityFrameworkCore` | C | [infrastructure.md](infrastructure.md) |

---

## Cohort dispatch summary

Mirrors `docs/<component>/adrs/ADR-009-implementation-task-cohort-ordering.md` §
cohort table — see ADR-009 for the authoritative ordering rationale.
`<component>` resolves to the project's primary code-emitting component, declared
in `docs/project.md`.

| Round | Cohort | Parallel agents | Build-gate |
| ----- | ------ | --------------- | ---------- |
| 1 | A | `shared` + `domain` | ✓ after round |
| 2 | B | `contracts` + `application` | ✓ after round |
| 3 | C | `infrastructure` | ✓ after round |

File-disjointness holds within each round: each agent writes only to its
ABP project root (STD-005 R9.2). Cross-layer references use already-merged
code from earlier cohort projects.
