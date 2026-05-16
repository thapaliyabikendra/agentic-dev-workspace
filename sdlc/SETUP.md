# SETUP.md — New Project Bootstrap

> Run this checklist once when adopting the `sdlc/` engine for a new
> project. Each step is a one-time action. After the checklist is
> complete, the project operates through `CLAUDE.md` and the normal
> workflow phases.
>
> Consult [`BOUNDARY.md`](BOUNDARY.md) if you are unsure whether a file
> belongs in `sdlc/` (engine) or `docs/` (project).

---

## Before you start

Confirm:
- [ ] The `sdlc/` engine is present (as a submodule, subtree, or copy).
- [ ] You have decided: `project_type: brownfield` or `project_type: greenfield`.
- [ ] You have a project name, company / team, and a short slug — you will record these in `docs/project.md` (Step 2).

---

## Checklist

### 1. Author the project `CLAUDE.md`

Create `CLAUDE.md` at the repo root. Copy the structure from
[`sdlc/CLAUDE.md`](CLAUDE.md) if an engine template exists, or scaffold
from scratch with these required sections:

- `## Project framing` — project name, `project_type`, domain summary,
  solo-dev vs. team note.
- `## Where to look` — pointers to `sdlc/WORKFLOW.md`,
  `sdlc/PRINCIPLES.md`, `sdlc/LAYOUT.md`, `sdlc/BOUNDARY.md`, and the
  project's `docs/` artifacts.
- `## Hard rules` — the non-negotiable retrieval and maintenance
  discipline rules (copy from the engine's CLAUDE.md; trim any that
  don't apply).

### 2. Seed `docs/project.md`

Copy [`sdlc/_templates/PROJECT.md`](_templates/PROJECT.md) to
`docs/project.md` and fill in every `[bracketed slot]`:

- **Identity** — product name, company / team, business domain, project type.
- **Components** — one row per bounded component (slug, type, ID prefix,
  title, ADR range). Add rows as components are introduced; the table
  is the single source of truth engine files link to via
  `docs/project.md § Components`.
- **Tech stack** — one row per layer; remove irrelevant rows.
- **Cross-cutting constants** — timezone, locale, data retention, audit-read
  role. These values inform the CCC baselines under `docs/shared/ccc/`
  seeded in Step 6; keep `docs/project.md § Cross-Cutting Constants` and
  the relevant CCC pages in sync.
- **Phase A grep terms** — project-specific search terms used to verify
  no project content has leaked into `sdlc/` engine files
  (see [`sdlc/BOUNDARY.md § Change history`](BOUNDARY.md#change-history)).
- **Milestones** — stub one row per planned milestone; expand as planning
  progresses.

Record the seeding event in the file's Revision history table.

### 3. Initialize `docs/`

Create the following stub files (copy from `sdlc/_templates/` where a
template exists):

```
docs/
  project.md                 ← already seeded in Step 2
  shared/
    COMPONENT.md             ← from sdlc/_templates/COMPONENT.md (shared variant)
    glossary.md              ← from sdlc/_templates/GLOSSARY.md
    ccc/                     ← lazy-created on first CCC (see Step 6); no log.md
                                (canonical `log.md` retired 2026-05-16)
    tech-stack.md            ← author manually per `BOUNDARY.md` § Engine-vs-project axis
                                (no template; 8-section structure is engine-prescribed)
    adrs/                    ← cross-component ADR store (≥2-component ADRs only)
      index.md               ← from sdlc/_templates/INDEX.md  (ADR variant)
                                (no log.md — canonical `log.md` retired 2026-05-16)
                                Component-scoped `docs/<component>/adrs/index.md` is
                                lazy-created on first component ADR — do not pre-seed.
  home.md                    ← stub; will be derived once nodes exist
```

### 4. Author the founding ADRs

At minimum, author one ADR before Phase 1 work begins:

| # | What to capture | Why first |
|---|---|---|
| ADR-001 | Tech stack + framework choice | Every future node and spec cites this |
| ADR-002 | Application-layer pattern (CQRS, MVC, etc.) | Constrains CMD/QRY node shape |
| ADR-003 | Code-quality gates | Phase 3 QA checklist depends on this |

Use [`sdlc/workflow/authoring-adr.md`](workflow/authoring-adr.md).
Tag conventions-ADRs with `convention` in `docs/shared/adrs/index.md` — the
workflow's implementation phase resolves the convention set by tag.

### 5. Populate `docs/shared/glossary.md`

Add at minimum:
- The project's primary domain terms (aggregates, bounded contexts).
- Any abbreviations used in node IDs or ADR titles.

### 6. Populate `docs/shared/ccc/` (lazy — only as FRSs surface real baselines)

The CCC tree is lazy-created on first CCC, same as ADR folders. **Do not
pre-seed empty placeholder CCCs at setup.** Let FRSs surface concrete NFR
baselines, then author the corresponding CCC at that point using
[`sdlc/_templates/CROSS-CUTTING-CONCERNS.md`](_templates/CROSS-CUTTING-CONCERNS.md)
as the per-CCC template. For each new CCC:

1. Create `docs/shared/ccc/CCC-NNN-<slug>.md` from the template. If this
   is the first CCC, also create `docs/shared/ccc/index.md` from
   [`sdlc/_templates/INDEX.md`](_templates/INDEX.md) (CCC variant — columns:
   `ID | Status | Title | Stack | Tags | Source | Updated`).
2. Add a row to `docs/shared/ccc/index.md` (Active table). 2-file touch —
   no `ccc/log.md` (canonical `log.md` retired 2026-05-16).

Anything project-specific that deviates from a CCC baseline gets its own
ADR back-linked via `related: [CCC-NNN]` in the ADR's frontmatter — the
CCC baseline stays put and the ADR captures the override.

### 7. Create `docs/<component>/nodes/` on first node

Do not pre-create `docs/<component>/nodes/` subfolders. They are lazy-created on
first instance per
[`sdlc/workflow/maintenance-discipline.md → Lazy creation`](workflow/maintenance-discipline.md).

### 8. Kick off Phase 0

Open the first milestone:
```
docs/milestones/M-01-<slug>/
  M-01-<slug>.md             ← from sdlc/_templates/MILESTONE.md
  discovery/
    milestone-scope.md       ← from sdlc/_templates/SURVEY.md
```

Brownfield projects: run the legacy-absorption pass before Phase 1.
See [`sdlc/workflow/legacy-absorption.md`](workflow/legacy-absorption.md).

Greenfield projects: skip legacy absorption; begin with
[`sdlc/workflow/design.md`](workflow/design.md) Phase 1.

---

## After the checklist

The project is ready for normal workflow operation. The agent reads
`CLAUDE.md` at the start of every session. No further setup is needed
unless the project type is `brownfield` and legacy absorption is still
in progress.

For methodology questions during setup, consult:
- [`sdlc/BOUNDARY.md`](BOUNDARY.md) — what lives where
- [`sdlc/workflow/evolving-the-workflow.md`](workflow/evolving-the-workflow.md) — how to extend the framework or coin new node types
