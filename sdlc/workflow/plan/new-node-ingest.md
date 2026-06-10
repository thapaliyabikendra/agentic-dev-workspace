---
name: plan-new-node-ingest
description: "Detail file of plan.md §3 — new node canonical ingest + Phase-1-born FLW enrichment, full procedure. Load when executing §3."
applies_when:
  stack: [agnostic]
---

# §3 detail — New node canonical ingest + Phase-1-born FLW enrichment

> Detail file of [`plan.md`](../plan.md) (Phase 2 flow). Load when executing
> §3. The core file's HARD-GATEs (no syntax; Phase 2 type-validity) apply.

**Two operations fire here.** (a) New Phase-2-born node files are written to canonical
(ACT — when `produced_actor:` is set — plus ENT, CMD, STA, CON, INT, DEC, PERM, QRY).
(b) The Phase-1-born FLW (declared in the FRS's `produced_flw:`) is **enriched in
place** — same file, body content added, `related:` populated, `status:` unchanged
(`proposed`). Both fire the 2-file touch independently.

**(a) New Phase-2-born nodes.** For every node ID in the FRSs' `produces_nodes:`
(ENT / CMD / STA / CON / INT / DEC / PERM / QRY — plus any NDF-declared
custom-type abbreviations registered in the target component's
`node_definitions:`) and for the ACT-NNN claimed in `produced_actor:` (when
set), write the node file **directly to canonical** with `status: proposed`:

```
docs/<component>/nodes/<type>/<ID>-<slug>.md
```

Use the templates in [`../../_templates/nodes/`](../../_templates/nodes/). Set
`status: proposed` in frontmatter.

**Existing nodes are authoritative — adapt the template, don't retrofit**
(canonical detail of [`CLAUDE.md HR-NODE-AUTH`](../../../CLAUDE.md#hard-rules)).
When existing canonical nodes of a type diverge from the current template
shape (extra sections, established field order, legacy-but-consistent
conventions), the new node follows the **established shape** of its
canonical siblings; template gaps are fixed forward in
[`../../_templates/nodes/`](../../_templates/nodes/), never by rewriting
existing nodes to match a template change. Retrofitting existing nodes is
a canonical edit outside an active Phase 3 merge — a process violation. Every new node carries `source_ref` pointing back to
the FRS and FS:

```yaml
status: proposed
source_ref:
  - frs: FRS-NNN
    fs: FS-NNN
    op: introduce
```

**Note.** `fs: FS-NNN` is a forward reference at ingest — the FS file may not yet exist
on disk. The ID is valid because it was claimed in §2 (ID-claim protocol); the FS shell
(frontmatter + empty section headers) is drafted at the start of §5, so the reference
resolves within the same flow. Shape is consistent across all node templates:
`source_ref: [{frs:, fs:, op:}]` (list-of-objects).

**ACT-NNN authoring at Phase 2 (when `produced_actor:` is set).** Write the ACT file
in full at this stage — there is no Phase-1-bare ACT body shape; the entire ACT body
is authored here using structural language. Body shape: **Description** + **Goals**
(reference the FRS by ID) + **Preconditions to act** (with PERM-NNN refs when
applicable) + **Flows they initiate** (FLW-NNN IDs — real because the FLW is
Phase-1-born) + **Commands they trigger** (CMD-NNN IDs from this FS's
`produces_nodes:` or existing canonical) + **Queries they issue** (QRY-NNN, optional).
`related:` populated (CMD / QRY / FLW / PERM IDs). 2-file touch (ACT file +
`nodes/actors/index.md`). (R-NEW-2a retired 2026-05-17 — the Phase-1-bare ACT body
shape no longer applies because the ACT is born at Phase 2.)

**Phase-2 node frontmatter / body contract additions (project = APP component,
ABP / .NET stack).** Two additions per
[`STD-005 § Rule 11`](../../standards/STD-005-abp-coding-conventions.md#rule-11--node-body-to-service-layer-mapping)
and
[`STD-005 § Rule 13`](../../standards/STD-005-abp-coding-conventions.md#rule-13--shared-validation--schema-constants-per-module):

- **FLW / QRY / CMD** nodes declare `service_layer:` in frontmatter, value
  `domain` or `application` (default `domain`). The default is the home
  declared by STD-005 R11 — the body lives in the `<AggregateName>Manager`
  returning `ErrorOr<T>`. The `application` value flags an exceptional
  AppService-resident body and requires a node-local DEC or component ADR
  justifying the deviation (the Phase 2 validator surfaces an unjustified
  `application` value as a Blocker).
- **ENT** nodes declare each persisted property's validation constants
  (max-length, range, decimal-precision, regex-pattern) in the body,
  named to match the `<Module>Consts.cs` constants Cohort A of
  [`ADR-009`](../../../docs/app/adrs/ADR-009-implementation-task-cohort-ordering.md)
  will author. The ENT body names the constant (e.g.,
  `DepartmentNameMaxLength = 128`); the actual `.cs` file is Phase 3 Cohort
  1's deliverable. Phase 2 stops at the names + values. Numeric literals
  in the ENT body without a constant name are a Blocker per STD-005 R13.

**(b) Phase-1-born FLW enrichment.** The FLW (per `produced_flw:`) already exists in
canonical with `status: proposed` and Phase-1-bare body shape (`related: []`, Trigger
+ Scenarios). At Phase 2:

- **FLW enrichment** — open the canonical file, populate `related:` (CMD / STA / ACT
  IDs sequenced or referenced by this flow), restore the Trigger's `Initiating command:
  CMD-NNN` line, and fill the Phase-2 sections: **Sequence** (ordered CMD-NNN / DEC-NNN
  steps), **Branches and gates** (referencing Sequence step numbers), **Compensating
  actions** (when `mode: async`), **Postconditions** (structural — ENT/STA/downstream
  FLW refs), and **Decisions** (optional inline DEC). Scenarios stay business-language
  from Phase 1 — do NOT rewrite them with node IDs. Fire the 2-file touch (FLW file +
  `nodes/flows/index.md`); `status:` stays `proposed`.
- **Source ref append** — FLW enrichment appends a Phase-2 entry to `source_ref:`
  (`{frs: FRS-NNN, fs: FS-NNN, op: detail}`) recording the FS that enriched it,
  leaving the Phase-1 `{frs: FRS-NNN, op: introduce}` entry intact.

For FLW Scenarios specifically: the three slots (happy / edge / fault) are already
filled at Phase 1; Phase 2 does NOT rewrite their bodies. If they're underspecified for
the FS's coverage needs, that's a `R-NEW-10` loop-back to Phase 1.5 (core §4a) — not a
silent rewrite here.

**Fire the 2-file node touch at ingest** (see [`maintenance-discipline.md`](../maintenance-discipline.md)):

- [ ] Each Phase-2-born canonical node file in place at
      `docs/<component>/nodes/<type>/<ID>-<slug>.md` with `status: proposed`.
- [ ] Row added to `docs/<component>/nodes/<type>/index.md` showing Status = `proposed`.
      Create the file from [`../../_templates/INDEX.md`](../../_templates/INDEX.md) if this is
      the first node of the type. The index row's Source column (FRS/FS) carries the
      originating audit trail; the node frontmatter `source_ref:` carries the
      structured form; git history carries the chronology. No `id-claims.md`
      introduce row fires (R-NEW-9 amended 2026-05-17) and no canonical `log.md`
      fires (see [`maintenance-discipline.md → Rule history`](../maintenance-discipline.md#rule-history--canonical-logmd-retired-2026-05-16)).
- [ ] Bidirectional `related:` back-links fired against each target in this node's
      `related:` list (the (2 + N) touch — every target fires its own 2-file
      touch regardless of canonical type — see `maintenance-discipline.md`).
- [ ] For the Phase-1-born FLW enriched here: `related:` populated; Phase-2
      sections filled (per the bullets above); `nodes/flows/index.md` Status column
      unchanged (still `proposed`); 2-file touch fires because frontmatter `updated:`
      and the body change are non-trivial. Status flip is Phase 3's job alone
      (R-NEW-4).
- [ ] For the Phase-2-born ACT (when `produced_actor:` is set): file authored
      in full at `docs/<component>/nodes/actors/ACT-NNN-<slug>.md` with
      `status: proposed`; row added to `nodes/actors/index.md`.

**For `touches_nodes` (existing canonical nodes any constituent FRS intends to modify):
do NOT write to canonical at Phase 2.** The canonical file is left untouched; the
Phase-1-born CHG (consumed via `consumes_chgs:` per core §4) records the intended delta
and is enriched here with structural before/after. Phase 3 applies it.

**Cross-FS dependencies.** If a new node references a `proposed` sibling-FS node that
hasn't merged yet, declare the dependency in this FS's frontmatter:

```yaml
depends_on_specs: [FS-006]
```

Phase 3 enforces merge order from this field. An FS may **read** a sibling-FS proposed
node via `depends_on_specs:`, but may **not** include it in its own `touches_nodes` /
CHG `modifies[]` — proposed nodes are provisional, not modify targets.

**No reciprocal back-link.** `depends_on_specs:` is one-way. At Phase 3 merge, the merger
globs `depends_on_specs:` across all FSs in the milestone to detect dependents before
retiring or reordering an FS. A generated "Spec dependencies" table on the milestone
portal is a future enhancement (track in [`evolving-the-workflow.md`](../evolving-the-workflow.md)).

**Verify:** every `produces_nodes` ID has a canonical file at the expected path with
`status: proposed` and an index row showing Status = `proposed`. No canonical node body
for a `touches_nodes` ID has been touched.

**On failure:** if a 2-file node touch is incomplete, complete it before moving on. If a
`touches_nodes` ID was edited, revert — it belongs in the CHG, not in canonical yet.
