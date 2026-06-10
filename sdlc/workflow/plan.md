---
name: generate-feat-spec
description: "Use when Phase 1.5 has closed and you need to author a Feature Spec, ingest new DDD nodes to canonical (status: proposed), consume + enrich the Phase-1-born CHG nodes the FRSs introduced (via FS consumes_chgs:), and run the FS validation loop. Do NOT use for Test plan ingest (test-plan-ingest.md) or implementation (implementation.md). Discoverability alias: authoring-fs."
applies_when:
  stack: [agnostic]
---

# Plan Flow

Plan flow turns a milestone's validated FRSs into a Feature Spec and the new DDD nodes
the spec introduces. It writes every new node directly to canonical with `status: proposed`,
fires the 2-file node touch (canonical node + per-type `index.md`), and consumes the
Phase-1-born CHGs the FRSs introduced (via FS `consumes_chgs:` per R-CHG-3) — enriching
each with structural before/after, `adds[]`, and `migration_steps[]`. Phase 3 applies the
CHG deltas, flips new nodes `proposed → active`, and flips consumed CHGs `approved →
merged`.

> **Core/detail layout.** This is the core file — wholesale-read at Phase 2
> entry. Step-level procedure detail lives in [`plan/`](plan/) detail files,
> loaded on demand per the [Detail files](#detail-files-load-on-demand--not-at-phase-entry)
> table. Every binding gate (HARD-GATEs, Checklist, §6) is in this file.

<HARD-GATE>
Do NOT write **method bodies, brace-delimited blocks, SQL bodies, YAML payloads,
implementation file paths, or line-level code** in the FS, the new canonical nodes, or
any CHG node. **Structural names ARE the deliverable** — class names, method signatures,
event names, table names, route paths. Phase 1 names FLW (Trigger + Scenarios) and CHG
(behavior-language `modifies[]` when the FRS declares non-empty `touches_nodes:`)
structures. Phase 2 names ACT (when the FRS declares `produced_actor:` — Description +
Goals + business Preconditions + Flows initiated + Commands triggered + Queries issued +
PERM-NNN refs all authored at birth) + ENT / CMD / STA / CON / INT / DEC / PERM / QRY
structures — plus any NDF-declared custom-type nodes whose abbreviation appears in the
target component's `node_definitions:` (per
[`STD-007`](../standards/STD-007-ndf-governance.md)) —
enriches the Phase-1-born FLW with wiring (`related:` populated, Sequence,
Branches, Compensating actions, structural Postconditions), and consumes the
Phase-1-born CHGs via FS `consumes_chgs:` for structural enrichment (`modifies[]`
before/after, `adds[]`, `migration_steps[]`). Phase 3 writes code, applies CHG deltas,
and flips `proposed → active` / `approved → merged`. This applies regardless of how
obvious the implementation looks. (Structural YAML in frontmatter and templates is not
what this forbids — payload bodies are.)
**Phase 2 reload reads the Phase-1-born FLW + CHG from disk — never from Phase 1
session memory; the `/clear` between Phase 1.5 and Phase 2 enforces this.**
Cross-cutting rule canonical home: [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
"Plans contain no syntax".
</HARD-GATE>

<HARD-GATE>
**HARD-GATE — Phase 2 type-validity check.** Do NOT ingest a
Phase-2-born canonical node whose type abbreviation is in **neither** (a)
the 15 Phase-2-born canonical types in KB-LAYOUT.md's 16-type catalog
(ACT / ENT / CMD / QRY / FLW / STA / DEC / INT / MOD / SCR / CON / PERM /
SVC / FA / EVT — CHG is Phase-1-born and milestone-scoped, per
[`../KB-LAYOUT.md`](../KB-LAYOUT.md)) **nor** (b) the target component's
`node_definitions:` frontmatter on its `COMPONENT.md` (NDF-declared per
[`STD-007`](../standards/STD-007-ndf-governance.md)).
A node whose type-abbreviation is unknown to both surfaces is rejected at
Phase 2 FS validation as a **Blocker**. Pre-existing canonical nodes that
predate NDF introduction (2026-05-19) carry no `declared_via:` pointer and
are grandfathered (per STD-007 R8). This is the **canonical enforcement home**;
the wording is identical to its restatement in `WORKFLOW.md § Validation
gates` and `ndf-edit.md` per CLAUDE.md HR-STYLE defense-in-depth.
(`maintenance-discipline.md § Files to touch on an NDF edit` summarizes
the two HARD-GATEs but carries no wording copy — corrected 2026-06-10,
the prior claim named it as a restatement site.)
</HARD-GATE>

---

## Overview

This flow runs after the Design flow ([`design.md`](design.md)) has produced a validated
FRS set and a `/clear` has happened. It covers `generate-feat-spec`: FS authoring +
canonical node ingest (status: proposed) + CHG consumption + enrichment (via FS
`consumes_chgs:`) + FS validation loop. Test plan
ingest is the first **QA-track** flow ([`test-plan-ingest.md`](test-plan-ingest.md)) — it
runs in its own session after `/clear`, on the QA-track operator's cadence (not
necessarily immediately). See [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
— QA-track entry is a flow boundary (with intra-track session-share for `test-suite-codegen` ↔ `qa-gate`).

**Mode: Ingest.** Existing canonical nodes are NOT modified here. When the FS
consumes a Phase-1-born CHG (via `consumes_chgs:`), this flow enriches that
CHG in place at its milestone-scoped permanent home —
`milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md` (CR track:
`docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md`) — by adding
structural before/after on `modifies[]`, populating `adds[]`, and
populating `migration_steps[]`. The CHG itself was born at Phase 1 by the
FRS (R-CHG-1); Phase 2 enriches but does not create. Phase 3 implementation
applies the deltas.

**Phase mode boundaries:** [`design.md`](design.md) is mixed-mode at Phase 1 —
Queries canonical (validates the FRS) **and** Ingests journey + modify-intent
(FLW born to canonical with `status: proposed`; CHG born to milestone with
`status: draft` when `touches_nodes:` is non-empty). This file (Phase 2)
Ingests structure + wiring. [`implementation.md`](implementation.md) (Phase 3)
Merges + Codes. Each phase boundary requires a `/clear` at entry — Phase 1.5 →
Phase 2 and Phase 2 → Phase 3.

**Prerequisites:** the Design flow has produced a milestone with `status: planning`,
its validated FRSs in `milestones/M-NN-<slug>/frs/`, every FRS's "Validation findings"
resolved or deferred, and the milestone-scope discovery's "Cross-FRS conflicts" section
clean. A context reset has happened between Phase 1.5 and this flow.

**Core principle:** Phase 2 names structures; Phase 3 writes them.

---

## Anti-Pattern: "The Obvious Path"

Writing a method body, SQL statement, or YAML block in the FS or a new node because
the implementation looks "obvious." Phase 2 names structures; Phase 3 writes them.
→ Full narrative + disguised variants: [`plan/anti-pattern.md`](plan/anti-pattern.md)
(load at first-time Phase 2 entry).

---

## When to Use

**Use when:** the Design flow has produced a validated FRS set, a `/clear` has happened,
and the next operation is `generate-feat-spec` (write the FS + ingest new nodes + emit
the CHG) followed by the Phase 2 Test plan ingest.

**Do NOT use when:** still in Phase 1 / 1.5 (load [`design.md`](design.md)), or after
Phase 2 validation has closed (load [`implementation.md`](implementation.md)). This flow
Ingests new nodes to canonical — it does **not** apply CHG deltas to existing canonical
nodes (that is Phase 3's job).

**Vs. sibling files:** [`design.md`](design.md) Queries canonical;
[`implementation.md`](implementation.md) Merges + Codes; this file Ingests. The three
are file-disjoint mode boundaries; each requires a `/clear` at entry.

---

## Section routing

If you've loaded this file for a specific issue mid-Phase-2 (rather
than at Phase 2 entry), read the linked section only. The HARD-GATE
callout at the top and
[Anti-Pattern: "The Obvious Path"](#anti-pattern-the-obvious-path)
carry the doctrinal frame the per-op sections assume — first-time
readers should re-read those on each new Phase 2.

| Operation | Sections to read |
|---|---|
| Phase 2 entry (first time) | [Checklist](#checklist) → [Process Flow](#process-flow) → [The Process](#the-process) + first-time detail loads per the table below |
| Resume mid-FS authoring | [The Process → Authoring sequence](#authoring-sequence--3-4-5-interleave) + the §3/§4/§5 stubs (load their detail files as the step fires) |
| Context loading question | [The Process → 1. Context loading](#1-context-loading) |
| ID-claim collision / cross-FS modify-intent conflict | [The Process → 2. ID-claim protocol](#2-id-claim-protocol) |
| New-node canonical ingest + Phase-1-born FLW enrichment (ACT born here too) | §3 stub + [`plan/new-node-ingest.md`](plan/new-node-ingest.md) |
| CHG consumption + enrichment (FS consumes a Phase-1-born CHG) | §4 stub + [`plan/chg-consumption.md`](plan/chg-consumption.md) |
| Phase-2 surfaced an undeclared modify-intent | §4a stub + [`plan/chg-consumption.md`](plan/chg-consumption.md) |
| FS body authoring (Architecture / Data / Interface / Tasks) | §5 stub + [`plan/fs-authoring.md`](plan/fs-authoring.md) |
| Checking Phase 2 exit readiness | [Checklist](#checklist) + [The Process → 6. FS validation loop](#6-fs-validation-loop) |
| Common Phase 2 mistakes (mid-flow check) | [`plan/common-mistakes.md`](plan/common-mistakes.md) + [Red Flags](#red-flags) |
| Cross-file dependencies / handoff to QA or Phase 3 | [Integration](#integration) |

If your operation is not in the table or you are entering Phase 2 for
the first time, read the full file in order: Overview → Anti-Pattern
→ When to Use → Checklist → Process Flow → The Process.

## Detail files (load on demand — not at phase entry)

| When | Load |
|---|---|
| First-time Phase 2 entry (doctrinal frame + orientation graph) | [`plan/anti-pattern.md`](plan/anti-pattern.md) + [`plan/process-flow.md`](plan/process-flow.md) |
| Executing §3 (new node ingest / FLW enrichment) | [`plan/new-node-ingest.md`](plan/new-node-ingest.md) |
| Any constituent FRS has non-empty `touches_nodes:` (§4), or an undeclared modify-intent surfaces (§4a) | [`plan/chg-consumption.md`](plan/chg-consumption.md) |
| Authoring FS body prose (§5) | [`plan/fs-authoring.md`](plan/fs-authoring.md) |
| Mid-Phase-2 quality check / reviewer audit | [`plan/common-mistakes.md`](plan/common-mistakes.md) |

---

## Checklist

Scan-level gate before diving into The Process. All six must hold before Phase 3 begins.
FRS-coverage validation lives in §6 (the formal Phase-2 close gate) — not duplicated here.

1. Every new node is written to canonical (`docs/<component>/nodes/<type>/<ID>-<slug>.md`)
   with `status: proposed` and the 2-file node touch fired (node + per-type `index.md`
   row with Status = `proposed`).
2. Every new node has `source_ref` tracing to a specific FRS criterion or body section (Use case / Business rules / Edge cases) or Phase-1-born FLW Scenario.
3. Every Phase-1-born CHG produced by the FS's constituent FRSs is listed
   in the FS's `consumes_chgs:` (subset consumption / merging per R-CHG-3
   noted in the FS's "Change maps"); each consumed CHG has been
   structurally enriched (`modifies[]` before/after, `adds[]`,
   `migration_steps[]` filled); each `modifies[]` target's ID is recorded
   in `id-claims.md` as `op: modify` (R-NEW-9 amended 2026-05-17 —
   `op: introduce` rows no longer written; per-type `index.md` is the
   introduce audit).
4. No syntax (method bodies, SQL, YAML) appears anywhere in the FS or new nodes.
5. Every architecture decision is routed: promoted to ADR, filed as DEC, or kept inline.
6. FS validation loop passes: zero Blockers, zero Majors.

---

## Process Flow

Inputs → context loading → ID-claims → §3/§4/§5 interleave → FS-validation
diamond (the **node ingest gate** — zero Blockers / zero Majors; repair is
surgical, not full re-draft) → outputs (FS + proposed nodes + enriched CHGs)
→ `/clear` to Phase 3; QA track enters separately on its own cadence.
→ Full DOT graph: [`plan/process-flow.md`](plan/process-flow.md) (load once at orientation).

---

## The Process

### 1. Context loading

Read **only** the nodes and ADRs the milestone's FRSs declare:

1. Open each linked FRS in `milestones/M-NN-<slug>/frs/` and collect every node ID in
   `touches_nodes` and `produces_nodes`, every ADR ID in `adrs:`, every STD ID in
   `standards:`, and every CCC ID in `ccc:`.
2. Check for `FS-NNN-CONTEXT.md` at
   `milestones/M-NN-<slug>/specs/FS-NNN-<slug>/FS-NNN-CONTEXT.md`. If present, load it
   before drafting — it carries locked decisions that bind this FS's architecture choices.
   If absent, proceed without it ([`discuss.md`](discuss.md) is optional).
3. Read the relevant component ADR index — one-line summaries only.
   `docs/<component>/adrs/index.md` for each component in scope; for cross-component work
   also check `docs/shared/adrs/index.md`. Cross-check the FRS-declared ADR list against
   the index for anything plainly relevant that an FRS missed; if you find a gap, surface
   it (update the FRS, do not silently load).
4. Read [`../standards/index.md`](../standards/index.md) and
   [`../../docs/shared/ccc/index.md`](../../docs/shared/ccc/index.md) — one-line summaries
   only, both indexes are bounded by design. Narrow-load every STD declared in the
   collected FRSs' `standards:` set whose `applies_when.stack:` intersects the FS's
   declared `stack:` plus every STD tagged `convention` or `task-ordering` that the FS
   missed. Narrow-load every CCC declared in `ccc:`. If you find a relevant STD or CCC
   missing from the FRS's declared sets, surface it (update the FRS, do not silently
   load); the FS inherits `standards:` and `ccc:` from its FRSs.
5. Read the canonical node files for IDs in `touches_nodes`. Follow `related` exactly
   one hop and read those too (per R-LOAD-1, canonical home
   [`retrieval-discipline.md § Phase 2/3 — ingest and merge reads`](retrieval-discipline.md#phase-23--ingest-and-merge-reads);
   no transitive expansion past 1 hop). For IDs in `produces_nodes`, there is no
   canonical node yet — they will be created at the ingest step.
6. Narrow-load the declared ADR pages. No transitive expansion.
7. Do **not** glob `docs/*/nodes/**` or pre-load wholesale. If a node, ADR, STD, or CCC
   not on the list turns out necessary mid-draft, stop, update the source FRS to declare
   it, and re-enter Phase 1.5 (for a node) or update the FRS's `adrs:` / `standards:` /
   `ccc:` (for a governance artifact).

This is the workflow's primary token lever — see [`retrieval-discipline.md`](retrieval-discipline.md).

**Verify:** every node and ADR you have loaded is traceable to a declared ID in an FRS.
No unlisted files open.

**On failure:** if you discover a needed node mid-draft, stop. Surface the gap. Update
the FRS. Re-enter Phase 1.5 before continuing. The same applies if an AC itself is
unworkable — ambiguous, contradictory, or undefined. Do not paper over by inventing
structure that doesn't trace to a clear AC.

**Rollback procedure (when re-entering Phase 1.5).** The FS shell on disk is durable —
do not delete it. Leave the frontmatter intact and the section headers in place. In any
body section that referenced the now-missing node or unworkable AC, replace the prose
with a `TBD — pending Phase 1.5 re-pass on FRS-NNN` marker so the next session knows
exactly which sections need re-authoring. `/clear`, load [`design.md`](design.md),
re-run Phase 1.5 on the updated FRS. After Phase 1.5 exit, `/clear` + load this file
and resume the FS — re-walking only the TBD sections. New canonical nodes already
ingested (`status: proposed`) stay where they are unless the re-pass explicitly retires
them via the abandonment procedure in
[`in-flight-nodes.md`](in-flight-nodes.md). CHG and TC files stay at their milestone
paths. Existing rows in `id-claims.md` stay (the re-pass may add `op: modify` /
`op: released` rows, never silently retire pre-cutover `op: introduce` grandfathers).

---

### 2. ID-claim protocol

`id-claims.md` is the **modify-intent + released-claim ledger**. Post-2026-05-17
(R-NEW-9 amended), the file carries `op: modify` and `op: released` rows only.
`op: introduce` rows are no longer written — every introduce has an authoritative
home elsewhere (see ID-ceiling table below), so a mirroring ledger entry adds
nothing but drift surface. Pre-cutover `op: introduce` rows are **grandfathered**:
they stay in existing files as audit, and no migration is required.

**Lazy-create timing** (per R-NEW-9 amended): the file is created on the **first
claim that produces a row** — i.e., the first `op: modify` (Phase 2 FS authoring,
when an FS consumes a Phase-1-born CHG whose `modifies[]` cites a canonical ID)
or the first `op: released` (Phase 1 / 1.5 FRS abandonment that retires an
ACT-NNN claim under `produced_actor:`). If neither fires through milestone close,
the file is never created — and that is fine.

**ID-ceiling table — where to read before allocating:**

| ID type | Authoritative home (read this for ceiling) |
| ------- | ------------------------------------------ |
| FLW, ENT, CMD, STA, CON, INT, DEC, PERM, QRY, ACT (after Phase 2 file birth) | per-type `docs/<component>/nodes/<type>/index.md` |
| ACT (Phase 1 claim, before file birth) | FRS frontmatter `produced_actor:` glob across the milestone's `frs/` folder |
| CHG | milestone `chg/` folder glob (filenames are `CHG-NNN-<slug>.md`); CR track: `docs/change-requests/CR-NNN-<slug>/chg/`; pre-cutover grandfathered: `specs/FS-NNN-<slug>/nodes/changes/` |
| TC | milestone `specs/**/test-plans/**/TC-*.md` glob (TCs nest under `specs/FS-NNN-<slug>/test-plans/<use-case>/`) |
| NDF | `docs/<component>/node-definitions/index.md` (per-component); `docs/shared/node-definitions/index.md` (cross-component promotions) |
| NDF-declared instance types (per-component custom types — e.g., `{PREFIX}-ALG-NNN`, `{PREFIX}-SCN-NNN`) | per-type `docs/<component>/nodes/<folder>/index.md` where `<folder>` matches the declaring NDF's `folder:` field |

Counters are per-(component, type); see [`../KB-LAYOUT.md → Counter scope`](../KB-LAYOUT.md).
Retired IDs are not reused. Across milestones, IDs are globally unique.

| ID | Source | Op | Date |
| -- | ------ | -- | ---- |
| CMD-010 | FS-007 | modify   | YYYY-MM-DD |
| ENT-014 | FS-009 | modify   | YYYY-MM-DD |
| ACT-005 | FRS-011 | released | YYYY-MM-DD |

**Op enum.** Valid values: `modify` | `released`.

- **`modify`** — a Phase-1-born CHG consumed by this FS lists the ID in its
  `modifies[]`. The Source column carries the consuming FS-NNN. One row per
  (canonical target, consuming FS) pair. Records the cross-FS modify-intent
  collision lookup that the CHG-side `modifies[]` glob doubles as.
- **`released`** — a claimed ID is given up before the file materializes — most
  commonly an ACT-NNN claim under `produced_actor:` retired at Phase 1 / 1.5
  FRS abandonment, or a CHG-NNN flipped to `status: deprecated` via R-CHG-3
  CHG-merging. Released IDs are never reused; the row is the audit trail.

(Pre-cutover `op: introduce` rows in existing `id-claims.md` files are
grandfathered and stay as-is; do not strip them. New post-cutover files
carry only `modify` and `released` rows.)

**Source column** (per R-NEW-9 — column renamed from `FS` pre-cutover) accepts
either an FRS-NNN (released claim under FRS abandonment) or an FS-NNN (modify
intent under FS consumption). **Grandfathered entries:** pre-cutover rows with
`FS` as the column header are valid as-is. The header rename uses **next-touch
eventual consistency**: a milestone's `id-claims.md` keeps its old `FS` header
until the next claim allocation, at which point it is renamed in the same edit.
Closed milestones with no further allocations keep the old header indefinitely.

Two collision signals to surface (never silently resolve):

- **Cross-FS modify-intent collision** — a sibling FS has already recorded an
  `op: modify` row for the same canonical ID. Coordinate which FS owns the
  change or merge the modify-intents into a single CHG (R-CHG-3).
- **New-ID collision at allocation** — when reading the authoritative home in
  the ID-ceiling table, two sibling artifacts have claimed the same ID for
  different concepts. Merge or re-coordinate.

**Verify:** every CHG `modifies[]` entry consumed by this FS has a matching
`op: modify` row in `id-claims.md`. No row duplicates a sibling FS's claim.

**On failure:** surface the collision immediately. Do not allocate a conflicting ID.

---

### Authoring sequence — §3, §4, §5 interleave

**Do not execute §3 → §4 → §5 in linear order.** The three sections
interleave in practice. The stub presentation below is for completeness,
not execution order. Authoring sequence:

1. **Draft the FS shell first** — frontmatter (with the FS-NNN ID
   claimed in §2) plus empty section headers. This shell lets §3's
   `source_ref: [{frs:, fs:, op:}]` reference resolve in-flow even
   though the FS body is still empty.
2. **Name a structure in the FS body**, then immediately ingest the
   matching new node to canonical with `status: proposed` (§3).
   Fire the 2-file node touch as part of that ingest. Repeat per
   structure named.
3. **Declare `consumes_chgs:` and enrich each consumed CHG** (§4).
4. **Fill the remaining FS sections** (§5) using the now-canonical
   node IDs as references rather than restating their behavior.

**First-time authors who linearize §3 → §4 → §5 hit the
forward-reference problem:** a node with `fs: FS-NNN` written before
the FS shell exists.

### 3. New node canonical ingest + Phase-1-born FLW enrichment

→ Load [`plan/new-node-ingest.md`](plan/new-node-ingest.md) for the full procedure.

**Summary:** (a) write each Phase-2-born node (ACT when `produced_actor:` is set,
plus ENT / CMD / STA / CON / INT / DEC / PERM / QRY and NDF-declared types) directly
to canonical with `status: proposed` + `source_ref: [{frs:, fs:, op: introduce}]`,
firing the 2-file touch and `related:` back-links; (b) enrich the Phase-1-born FLW
in place (populate `related:`, Sequence, Branches, Compensating actions, structural
Postconditions; Scenarios stay business-language; `status:` stays `proposed`).
`touches_nodes` targets are NEVER edited at Phase 2 — their deltas live in the
consumed CHG (§4). Sibling-FS proposed-node references go in `depends_on_specs:`.

### 4. CHG node consumption + enrichment

→ Load [`plan/chg-consumption.md`](plan/chg-consumption.md) for the full procedure
(five steps + splitting heuristics table).

**Summary:** CHG-NNN is Phase-1-born (R-CHG-1) at the milestone-scoped `chg/` home.
The FS declares `consumes_chgs:` (default: every CHG from its constituent FRSs;
subset/merge per R-CHG-3 — each CHG consumed by exactly one FS) and enriches each
in place: structural before/after on `modifies[]`, `adds[]` mirroring this FS's
`new_nodes:`, `migration_steps[]` filled. §6 exit flips `draft → approved`;
Phase 3 applies the deltas and flips `approved → merged`.

### 4a. Retroactive `touches_nodes:` loop-back (R-NEW-10)

→ Load [`plan/chg-consumption.md`](plan/chg-consumption.md) (§4a detail) for the procedure.

**Summary:** a modify-intent surfacing at Phase 2 that is NOT in the FRS's
`touches_nodes:` is a claim change. Halt, revise the FRS, run a Phase 1.5 **delta**
re-run on the new entry, then resume Phase 2. Never retro-declare from Phase 2 —
that routes around the gate.

### 5. FS authoring

→ Load [`plan/fs-authoring.md`](plan/fs-authoring.md) for the full procedure.

**Summary:** the FS answers *how*; it references node IDs, never restates their
behavior, and contains no syntax. Generate 2–3 real alternatives before converging
(honor `FS-NNN-CONTEXT.md` locks). Route every architecture decision on the spot:
future-spec-constraining → ADR; single-node rationale → DEC; small + FS-scoped →
inline. Draft section-by-section, pausing at the four section-group boundaries
(CLAUDE.md HR-ONE-Q, one question per round). Order Implementation tasks by the
project's `task-ordering`-tagged ADR cohorts.

---

### 6. FS validation loop

**Which gate is this?** This is the **Phase-2 close gate**. The top-of-doc Checklist is
its scan-level subset (use it first). The template's `## QA verification` section is the
**Phase-3 `implemented`-flip gate** — do not run it here.

Findings carry the same **Blocker / Major / Minor** severity vocabulary used at Phase
1.5 (see
[`frs-validation-rules.md → Severity classification`](frs-validation-rules.md#severity-classification)).
Zero Blockers and zero Majors is the exit bar; Minors are noted, not blocking.

**Targeted repair, not full re-draft.** Fix only the flagged items and re-check only
those — not the whole FS.

**Severity of the checkboxes below.** All boxes are **Blocker-tier** — any unchecked box
prevents Phase 2 close. Major and Minor findings emerge from the self-review pass (the
first verification box, §6c) and are recorded inline; Minors are noted, Majors must be
repaired before close.

**Ordering (2026-06-10).** The boxes are grouped: the **entry gate** (§6a), then
**writes** (§6b — each box confirms a §5 write landed; if unchecked, perform the
write now), then **verifications** (§6c — read-only audits of the finished
FS + node + CHG state). Complete every §6b box before starting §6c — an audit
that runs before its write either fails spuriously or silently passes against
a stale state. Four hard sequence dependencies exist (the §6b list order
respects them); everything else within a group is order-free:

1. Canonical-state reconnaissance precedes every §5 body section that names a
   modify-intent — it is the gate's entry condition, not a close-out check.
2. New nodes land at canonical before CHG `adds[]` can mirror `new_nodes:` and
   before the type-validity verification can run.
3. `consumes_chgs:` is settled, then CHG `modifies[]` structural deltas are
   enriched, **then** their `op: modify` rows are recorded in `id-claims.md` —
   a claims row pointing at an unenriched delta is an unauditable claim.
4. A promoted ADR is filed and indexed before the FS's `adrs:` frontmatter
   declares it.

#### §6a Entry gate

- [ ] **Canonical-state reconnaissance (Phase-2-entry).** Before §5 commits to body
      sections that name modify-intents, walk every canonical node ID the FS will
      reference structurally (from `related:` populations on new nodes, from FLW
      Sequence step references, from CHG `modifies[]` candidates). Every modify-intent
      the FS requires must already be in some FRS's `touches_nodes:`. If a new one
      surfaces, fire the R-NEW-10 loop-back (§4a) before continuing — do not retro-add
      from Phase 2. Per R-NEW-10.
#### §6b Writes — confirm landed; perform now if unchecked

- [ ] Every new node has been written to canonical at
      `docs/<component>/nodes/<type>/<ID>-<slug>.md` with `status: proposed`; the FS's
      "New nodes" section lists each ID and one-line summary.
- [ ] Every new node has `source_ref` populated (`frs:`, `fs:`, `op: introduce`). Optional
      `section:` key naming the specific FRS heading improves traceability.
- [ ] Every Phase-1-born FLW this FS enriches now carries non-empty `related:`
      (per R-NEW-8 — narrowed to FLW only 2026-05-17; empty `related:` is the
      Phase-1-bare body-shape signal; an enriched node MUST move past that).
      Catches a malformed Phase-2 enrichment that forgets to populate `related:`.
      Phase-2-born ACT carries `related:` populated at birth (no separate
      enrichment step).
- [ ] If this FS has any constituent FRS with non-empty `touches_nodes:`,
      every such FRS's Phase-1-born CHG appears in this FS's
      `consumes_chgs:` (or is documented as merged/routed in "Change maps"
      per R-CHG-3). The CHG is **not** applied to canonical here — only
      enriched.
- [ ] Every consumed CHG has structural before/after on its `modifies[]`
      entries (not just the Phase-1 business-language delta), `adds[]`
      mirroring this FS's `new_nodes:`, and `migration_steps[]` filled.
- [ ] Every CHG `modifies[]` entry consumed by this FS is recorded as `op: modify`
      in `id-claims.md` (R-NEW-9 amended 2026-05-17 — introduce rows no longer
      written; the per-type `index.md` row for each new node is the introduce
      audit). No `op: modify` row duplicates a sibling FS's claim.
- [ ] Any ADR promoted from this FS is filed under
      `docs/<component>/adrs/ADR-NNN-<slug>.md`, indexed in `adrs/index.md`
      (2-file touch — no `adrs/log.md`), has `fs_origin: FS-NNN`, and is
      back-linked from the FS's `adrs:` list.
- [ ] `adrs:` frontmatter declares every ADR consulted.
- [ ] `standards:` frontmatter declares every STD this FS consumes (inherited
      from the constituent FRSs plus any STD newly surfaced during FS drafting).
      Engine-universal STDs (`applies_when.stack: [agnostic]`) listed when the
      FS's behavior depends on a specific rule; stack-conditional STDs listed
      only when their `applies_when.stack:` intersects the FS's `stack:`.
- [ ] `ccc:` frontmatter declares every CCC this FS cites (inherited from
      the constituent FRSs). For each CCC, body prose cites by ID rather than
      restating the baseline. Any operation-specific deviation from a CCC is
      filed as an ADR (with `related: [CCC-NNN]`) whose ID is in `adrs:`.
- [ ] `depends_on_specs:` declares every sibling FS whose proposed nodes this FS references.
- [ ] FS frontmatter: `merged: false`, `merge_sha:` left blank.
- [ ] FS frontmatter: `test_plan_path:` left blank — filled by Test plan ingest.

#### §6c Verifications — read-only; run after every §6b box is checked

- [ ] Author self-review pass — look at the FS with fresh eyes:
  1. Placeholder scan — any "TBD", incomplete sections, or vague requirements?
  2. Internal consistency — does the FS contradict itself or upstream inputs (FRSs, nodes)?
  3. Scope — single coherent slice? No scope creep from adjacent FRSs?
  4. Ambiguity — any task interpretable to build the wrong thing? Pick one interpretation and make it explicit.
  Fix inline. No separate review file, no dispatched reviewer.
- [ ] Every FRS acceptance criterion is **fully covered** in the Coverage table — one row
      per Flow scenario it spans; no AC partially covered or duplicated within a scenario.
      Criteria that cannot be mapped to a Flow scenario are raised as `OQ-NNN` files under
      `docs/discovery/open-questions/` with `origin: fs-authoring, origin_ref: FS-NNN,
      gate_effect: blocking` — not absorbed as loose FS prose.
- [ ] Every covered criterion links to a Flow scenario in a canonical FLW node (new FLW
      nodes carry `status: proposed`).
- [ ] No node behavior or ADR text is restated in the FS prose — only referenced.
- [ ] No syntax in the FS or in any new node (method bodies, brace bodies, SQL, YAML).
- [ ] No unresolved design questions.
- [ ] No invented new nodes — every new node's `source_ref` traces to a specific FRS
      acceptance criterion, FRS body section (Use case / Business rules / Edge cases),
      or Phase-1-born FLW Scenario. Nodes without a traceable clause are removed,
      promoted to a DEC, or raised as `OQ-NNN`.
- [ ] **Phase 2 type-validity check** (per §A.2 HARD-GATE). Every node-type
      abbreviation in `produces_nodes:` is in **either** the engine-default
      catalog's 15 Phase-2-born canonical types (see §A.2 HARD-GATE for the
      enumeration; CHG is Phase-1-born and out of scope here) **or** the
      target component's `node_definitions:`
      frontmatter. Unknown type-abbreviations are **Blockers**. Pre-existing
      canonical nodes are grandfathered (per STD-007 R8).
- [ ] **`consumes_chgs:` cardinality check** (per R-CHG-3). Every CHG-NNN
      in this milestone is consumed by exactly **one** FS — globbing
      `consumes_chgs:` across the milestone's FSs returns a flat list with
      no duplicates. Double-consumption (one CHG listed in two FSs) is a
      **Blocker**. Zero-consumption (a Phase-1-born CHG no FS owns) is a
      **Blocker** unless the CHG was explicitly merged into another via
      R-CHG-3 (in which case the unused ID is `status: deprecated`).
- [ ] No edits to existing canonical node bodies during Phase 2.
- [ ] Every architecture decision has been routed: ADR, DEC, or inline.

**Phase 2 fires the 2-file node touch for each new node's `created` event (canonical
node + per-type `index.md` row with Status = `proposed`). It does NOT modify
existing canonical node bodies, nor add index rows for `touches_nodes` targets — those
operations fire at Phase 3 merge when the CHG deltas are applied.**

FS validation passed; the QA track may now run [`test-plan-ingest.md`](test-plan-ingest.md) in a fresh session. The QA track is independent — no shared session, no mandate to run immediately, but milestone close depends on `qa-gate.md` (the QA track's final flow) eventually running.

---

## Common Mistakes

→ Full ❌/✅ pairs: [`plan/common-mistakes.md`](plan/common-mistakes.md) (load for a
mid-Phase-2 quality check). Compact form: the [Red Flags](#red-flags) list below.

---

## Red Flags

**Never:**
- Write syntax (method bodies, SQL, YAML payloads) in the FS or new canonical nodes
- Glob `docs/*/nodes/**` — load only what FRSs declare by ID
- Edit existing canonical node bodies during Phase 2
- Allocate a node ID without reading its authoritative home (per-type `index.md`
  for canonical types; `chg/` glob for CHG; `specs/**/test-plans/**` glob for TC; FRS `produced_actor:`
  glob for Phase-1 ACT claims) — see §2 ID-ceiling table
- Proceed to `test-plan-ingest.md` before zero Blockers and zero Majors
- Emit a CHG node when the FS has no `touches_nodes` entries
- Silently broaden the context load when a mid-draft gap is found — stop and update the FRS

---

## Integration

- **Required before:** same as all dev-track flows —
  [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) (here especially:
  "Plans contain no syntax", "Read the per-type `index.md` before globbing",
  tiered touch), [`../WORKFLOW.md`](../WORKFLOW.md), [`../PRINCIPLES.md`](../PRINCIPLES.md).
- **Required before (entry):** [`design.md`](design.md) — produces the validated FRS set
  this flow consumes.
- **Routes to (QA track):** [`test-plan-ingest.md`](test-plan-ingest.md) — runs as an independent flow in the QA track, in its own session. Logical sequencing only: this file's FS validation must pass before the QA track's first flow can begin. No same-session requirement; no `/clear` exception.
- **Maintenance ops that may fire:**
  [`maintenance-discipline.md`](maintenance-discipline.md) (every 2-file node touch on
  new node ingest; the (2+N) touch when new nodes carry `related:` back-links — (3+N)
  if any target is an ADR),
  [`authoring-adr.md`](authoring-adr.md) (FS architecture decision promoted to ADR),
  [`new-component-bootstrap.md`](new-component-bootstrap.md) (FS introduces nodes for a
  new component — runs FIRST, before any ingest),
  [`evolving-the-workflow.md`](evolving-the-workflow.md) (Phase 2 surfaces a missing node
  type or template gap).
- **Routes to (after `/clear`):** [`implementation.md`](implementation.md) — Phase 3
  Merge + Code + QA. After review and `/clear`, the QA track may begin with
  [`test-plan-ingest.md`](test-plan-ingest.md). The QA track runs independently — its
  first flow is the entry point for executable test coverage.
- **Sibling flow files:** [`design.md`](design.md), [`implementation.md`](implementation.md),
  [`bug-fix.md`](bug-fix.md).
