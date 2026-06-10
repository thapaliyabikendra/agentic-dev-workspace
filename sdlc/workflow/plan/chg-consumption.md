---
name: plan-chg-consumption
description: "Detail file of plan.md §4/§4a — CHG consumption + enrichment and the retroactive touches_nodes loop-back (R-NEW-10), full procedure. Load when any constituent FRS has non-empty touches_nodes:."
applies_when:
  stack: [agnostic]
---

# §4 detail — CHG node consumption + enrichment

> Detail file of [`plan.md`](../plan.md) (Phase 2 flow). Load before
> executing §4 — i.e., when any constituent FRS has non-empty
> `touches_nodes:`. The core file's HARD-GATEs apply.

**Birth shift (R-CHG-1).** Post-2026-05-17 cutover: CHG-NNN is born at
**Phase 1** by the FRS whose `touches_nodes:` is non-empty — one CHG per
FRS, parallel to `produced_flw:` / `produced_actor:`. Phase 2 **consumes**
and **enriches**; it does not emit. The CHG file already exists at its
permanent milestone-scoped home:

```
milestones/M-NN-<slug>/chg/CHG-NNN-<slug>.md
# CR track:
docs/change-requests/CR-NNN-<slug>/chg/CHG-NNN-<slug>.md
```

(Pre-cutover CHGs at `specs/FS-NNN-<slug>/nodes/changes/` are
grandfathered and stay where they are — see
[`change-request.md`](../change-request.md) for the frozen-layout callout.)

**Five-step procedure.**

1. **Phase 1 FRS authoring** (covered in
   [`design.md § Phase 1`](../design.md#phase-1--frs-authoring)) births the
   per-FRS CHG at the path above with `status: draft`,
   `source_ref: [{frs: FRS-NNN, op: modify}]`, behavior-language
   `modifies[]`, optional milestone-level `invariants_before/after`, and
   optional `removes[]` / `supersedes[]`. No `adds[]`, no
   `migration_steps[]`, no structural before/after at Phase 1.
2. **Phase 2 FS authoring declares `consumes_chgs:`** in frontmatter,
   listing the per-FRS-born CHGs this FS owns. **Default at Phase 2:**
   consume every CHG born by the FS's constituent FRSs. Two adjustments
   per R-CHG-3:
   - **Subset consumption** — consume only a subset when splitting
     heuristics fire (different bounded context, different risk profile,
     different reviewer). The unconsumed CHGs route to a sibling FS in the
     same milestone. Each CHG ends up consumed by exactly one FS before
     milestone close.
   - **CHG merging** — at FS-authoring time, two sibling CHGs (born by
     sibling FRSs in the same milestone) may be merged into one when they
     target the same bounded context with matching risk and reviewer
     profile. Procedure: retain one CHG ID; fold the other's `modifies[]`
     and invariant deltas into it; flip the unused ID to `status:
     deprecated` (do NOT reuse). The retained CHG's `source_ref:`
     accumulates both originating FRS IDs.
3. **Phase 2 FS enrichment** of each consumed CHG:
   - **Structural before/after on each `modifies[]` entry** — the
     business-language behavior delta the Phase 1 author wrote stays;
     the FS author adds the structural before/after columns naming ENT
     fields, CMD signatures, FLW Sequence step numbers, etc.
   - **`adds[]` populated** — mirrors the new canonical nodes this FS
     introduces under §3 (one entry per `new_nodes:` ID).
   - **`migration_steps[]` populated** — ordered data / schema migration
     steps required at Phase 3 merge.
   - 2-file touch on enrichment fires the CHG file's `updated:`
     timestamp; the milestone-scoped `chg/index.md` row (when one
     exists — none today, per row-12 gap note) is re-synced.
4. **Phase 2 FS validation exit** (core §6) flips each consumed CHG's
   `status: draft → approved`. The CHG remains at the milestone path
   permanently.
5. **Phase 3 merge** applies the CHG's `modifies[]` / `removes[]` /
   `supersedes[]` deltas to canonical targets (each fires its own 2-file
   node touch — node file + per-type `index.md` re-sync) and flips the
   CHG's status `approved → merged` in place.

**Splitting heuristics — applied at FS-consumption time** (reframed from
the prior FRS-birth granularity table). When deciding whether sibling
CHGs from sibling FRSs fold into one FS's `consumes_chgs:` (merge them
into a single CHG per R-CHG-3) or route to separate FSs, apply the same
heuristics as before:

| Situation | Same bounded context? | Same risk profile? | Same reviewer? | Decision |
|---|---|---|---|---|
| Two FRS-born CHGs both targeting the `orders` module, both data-shape changes | ✅ | ✅ | ✅ | **Merge into one CHG** (one FS consumes; per R-CHG-3 procedure) |
| FRS-born CHG against ENT + FRS-born CHG against CMD, same module, same reviewer | ✅ | ✅ | ✅ | **Merge into one CHG** (the type difference is not load-bearing) |
| Config-flag CHG + DB-schema-migration CHG from sibling FRSs in same milestone | ✅ | ❌ (reversible vs destructive) | ✅ | **Keep separate** — risk profiles differ; route to separate FSs; each FS consumes its own |
| CHG against `orders` MOD + CHG against `billing` MOD | ❌ | — | typically ❌ | **Keep separate** — unrelated bounded contexts; different stakeholder review; separate FSs |
| Critical-path security CHG + cosmetic-copy CHG | ✅ | ❌ | typically ❌ | **Keep separate** — critical-path delta deserves its own review record |

The driving heuristic: a CHG should be **atomically reviewable** — a
reviewer should be able to approve or reject it without paging in a
second unrelated context. If you can't summarize the CHG in one sentence
without "and also," keep the FRS-born CHGs separate (route to different
FSs) rather than merging them.

If the FS's constituent FRSs all have empty `touches_nodes:` (pure
additions), `consumes_chgs:` is empty. Pure additions are already
audited by new nodes' `source_ref`, their per-type `index.md` rows,
and git history (R-NEW-9 amended 2026-05-17 — no `id-claims.md`
introduce row).

**Verify:** every Phase-1-born CHG from this FS's constituent FRSs is
either listed in this FS's `consumes_chgs:` (consumed here) or
documented in the FS's "Change maps" as merged-in or routed-to-sibling.
Every `modifies[]` entry in each consumed CHG carries structural
before/after at Phase 2 close. Every consumed CHG's `adds[]` mirrors
this FS's `new_nodes:` and `migration_steps[]` is filled.

**On failure:** if a Phase-1-born CHG is not consumed by any FS in the
milestone, that's a Blocker — fix at FS authoring (consume it) or merge
it per R-CHG-3 before Phase 2 close.

---

# §4a detail — Retroactive `touches_nodes:` loop-back (R-NEW-10)

If FS authoring surfaces a modify-intent on a canonical node that is **not** declared in
the FRS's Phase-1 `touches_nodes:`, this is a **claim change** — the FRS's claim surface
is incomplete. The Phase-2 author MUST halt and loop back to Phase 1.5 rather than
silently widen the claim from Phase 2 (which would route around the gate).

**Procedure:**

1. **Halt Phase 2 enrichment** at the moment the missing modify-intent is identified.
   Do not stage the modify in the CHG yet; do not edit canonical.
2. **Revise the FRS** — add the missing canonical ID to `touches_nodes:`. Update any
   FRS body section that references the now-declared modify-intent (Brownfield impact,
   Business rules, etc.).
3. **Phase 1.5 delta re-run** — `/clear`, load [`design.md`](../design.md), re-run **only**
   Pass 1's existence + sanity checks on the new `touches_nodes:` entry (not a full
   Phase 1.5 re-gate; the deltas only).
4. **Resume Phase 2** — once the Phase 1.5 delta re-run clears, `/clear`, reload
   [`plan.md`](../plan.md), and continue FS authoring from where you halted. The new
   `touches_nodes:` entry feeds into §4's CHG `modifies[]`.

**Why loop-back rather than retro-declare with audit marker.** Phase-2 retro-declaration
would let Phase 2 silently widen the FRS's claim surface — exactly the failure mode
Phase 1.5 exists to prevent. The loop-back cost is a small Phase 1.5 delta re-run; the
cost of silent widening is a silently expanded FS that downstream readers can't audit
against the FRS's original claims.

**Mitigation against loop-back churn.** Core §6 FS validation includes a Phase-2-entry
canonical-state reconnaissance checklist item — every modify-intent the FS will require
should already be in the FRS's `touches_nodes:` before §5 authoring commits to a body
section that names it. The reconnaissance is the cheap catch; the loop-back is the
correctness backstop.
