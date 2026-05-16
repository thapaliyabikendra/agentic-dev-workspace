# open-milestone.md — Open a Milestone

> **Maintenance operation.** Consolidates all steps for opening a new milestone:
> ID allocation, folder creation, portal doc and state-file initialization, and
> roadmap surfacing. Replaces the scattered Phase 0 folder-setup instructions
> that previously lived only in `design.md`.
>
> Run this operation **before** entering Phase 0 (Milestone Scoping) in
> [`design.md`](design.md). Phase 0 picks up from a pre-created milestone folder.

## When to Use

**Use when:** starting any new milestone — feature, accumulator, refactor, or
absorption. Any milestone work that begins without a `docs/milestones/M-NN-<slug>/`
folder must run this operation first.

**Do NOT use when:**
- The milestone folder already exists (use `phase-state.md` to pick up where
  the last session left off).
- You are reopening a closed (`status: done`) milestone for a follow-on scope —
  open a new milestone for the new scope instead.

## Completion marker

When all steps below complete successfully, emit:

```
## MILESTONE OPENED
```

H2 level, exact string, no inline content. Detectable by
`^## MILESTONE OPENED$`. Consumed by orchestrators and close-milestone.md
pre-condition checks.

---

## Procedure

### O-1 — Allocate the M-NN ID

1. Scan `docs/milestones/` for existing `M-NN-*` folders. Identify the
   highest N in use.
2. Claim the next ID (e.g., M-03). There is no root-level milestone
   ID ledger — `id-claims.md` lives inside each milestone folder and is
   lazy-created by `plan.md` for intra-milestone IDs. The milestone ID
   itself is established by folder-scan only.
4. Choose a slug (lowercase, hyphen-separated, ≤ 4 words):
   `M-NN-<slug>` (e.g., `M-03-payment-processing`).

### O-2 — Create folder structure

Create these paths (all lazy — create only when needed in later phases):

```
docs/milestones/M-NN-<slug>/
  M-NN-<slug>.md          ← created in O-3
  MILESTONE-STATE.md      ← created in O-4
  id-claims.md            ← leave absent; lazy-created by plan.md Phase 2
  discovery/              ← leave absent; created by Phase 0 in design.md
  frs/                    ← leave absent; created by Phase 1 in design.md
  specs/                  ← leave absent; created by Phase 2 in plan.md
```

Only the root folder, `M-NN-<slug>.md`, and `MILESTONE-STATE.md` are created
here. All other sub-folders are lazy.

### O-3 — Instantiate the milestone portal

Copy `sdlc/_templates/MILESTONE.md` to
`docs/milestones/M-NN-<slug>/M-NN-<slug>.md`.

Fill frontmatter:
- `id:` — the allocated M-NN value
- `title:` — short name for the milestone
- `kind:` — `feature | accumulator | refactor | absorption`
- `extends:` — IDs of milestones this builds on (leave `[]` if none)
- `status:` — `planning` (always at open time)
- `discovery:` — `discovery/milestone-scope.md` (leave as-is; the file is
  created by Phase 0 in `design.md`)
- `frs:` — `[]` (filled iteratively in Phase 1)
- `specs:` — `[]` (filled in Phase 2)
- `created:` — today's date (`YYYY-MM-DD`)
- `target_quarter:` — optional target quarter, e.g. `"2026-Q3"`. Leave `""`
  if not yet known.

Leave body sections (`## Scope`, `## FRSs in this milestone`, etc.) at their
template prose — they are filled during Phase 0 and Phase 1.

### O-4 — Lazy-create MILESTONE-STATE.md

Follow the `### Lazy create` procedure in [`phase-state.md`](phase-state.md):

1. Copy `sdlc/_templates/MILESTONE-STATE.md` to
   `docs/milestones/M-NN-<slug>/MILESTONE-STATE.md`.
2. Fill `milestone_id: M-NN-<slug>`.
3. Set `dev_phase: 0`, `qa_phase: not-started`, and `phase_entered: <today>`.
4. Set `next_action:` to "Begin Phase 0 — author milestone-scope.md discovery."
5. Set `progress_percent: 0`.

### O-5 — Update docs/home.md (if it exists)

If `docs/home.md` exists, add a row for the new milestone in its
`## Milestones` table:

| ID | Title | Kind | Status |
| -- | ----- | ---- | ------ |
| M-NN | \<title\> | \<kind\> | planning |

If `docs/home.md` does not yet exist, skip — it is created by the
[`HOME.md`](../_templates/HOME.md) template when a human first runs the
home-page initialization.

### O-6 — Surface in roadmap

Run [`regenerate-roadmap.md`](regenerate-roadmap.md) so the new milestone
appears in the "Milestones in flight" table of `docs/ROADMAP.md`.

If `docs/ROADMAP.md` does not yet exist, the regen creates it.
If no stakeholder review is imminent and you prefer to defer the regen, note
it in `MILESTONE-STATE.md → session_notes`.

---

## Integration

- **Precedes:** [`design.md`](design.md) Phase 0 — which picks up from a
  pre-existing milestone folder.
- **Reads:** `docs/milestones/` (for ID allocation); `sdlc/_templates/MILESTONE.md`;
  `sdlc/_templates/MILESTONE-STATE.md`.
- **Writes:** `docs/milestones/M-NN-<slug>/M-NN-<slug>.md`;
  `docs/milestones/M-NN-<slug>/MILESTONE-STATE.md`; optionally
  `docs/home.md` (milestone row); triggers `docs/ROADMAP.md` regen.
- **No tiered touch** — milestone portal and state file are not canonical
  DDD artifacts. No `index.md` / `log.md` pair required.
- **Sibling ops:** [`close-milestone.md`](close-milestone.md) (the inverse);
  [`phase-state.md`](phase-state.md) (session-continuity procedure for the
  opened milestone).
