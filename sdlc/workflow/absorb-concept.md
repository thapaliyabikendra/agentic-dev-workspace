# Absorb Concept

> **Maintenance operation.** Routes insights discovered during report
> synthesis into the canonical KB as RESEARCH staging nodes, then promotes
> them to canonical DDD nodes after review. Sibling of
> [`derived-reports.md`](derived-reports.md),
> [`authoring-adr.md`](authoring-adr.md), and
> [`legacy-absorption.md`](legacy-absorption.md). Not a phase — fires
> from inside any report regeneration session or standalone when a
> knowledge gap in the wiki becomes apparent.

## When to Use

**Use when:** while generating or reviewing a derived report
(`reports/BUSINESS.md`, `reports/TECHNICAL.md`, or any `<kind>` report),
you notice a concept, relationship, or domain rule that:

- has no corresponding canonical node in `docs/<component>/nodes/`, and
- represents genuine domain knowledge (a real entity, decision, behavior,
  or constraint — not just phrasing variation or a prose observation), and
- would cause a future FRS, FS, or ADR to have to rediscover or re-describe
  it from scratch if left uncaptured.

**Also use when:** reviewing `docs/research/` entries and promoting
synthesized findings to canonical node types.

**Do NOT use when:**

- The concept already has a canonical node — check the per-type `index.md`
  first. Duplicate nodes are worse than uncaptured concepts.
- The concept is a pure wording gap in an existing node — use
  [`maintenance-discipline.md`](maintenance-discipline.md) to update the
  existing node instead.
- The concept belongs in the glossary or a cross-cutting-concern baseline —
  use [`baseline-references.md`](baseline-references.md).
- The concept requires a cross-cutting architectural decision — author an
  ADR via [`authoring-adr.md`](authoring-adr.md).
- The source is a legacy document rather than a synthesized report — use
  [`legacy-absorption.md`](legacy-absorption.md).

## Staging type: RESEARCH nodes

All absorbed concepts land as **RESEARCH staging nodes** first — never
directly as canonical DDD nodes. The RESEARCH type is the deliberate
bridge between "something emerged during synthesis" and "a canonical node
the project can rely on."

```
docs/research/               ← canonical research tree (lazy)
  index.md                   ← Karpathy-style content catalog
  log.md                     ← append-only chronological record
  RESEARCH-NNN-<slug>.md     ← individual pages
```

RESEARCH nodes have lifecycle: `raw` → `synthesized` → `superseded`.
Template: [`sdlc/_templates/RESEARCH.md`](../_templates/RESEARCH.md).

The `## Canonical implications` table inside every RESEARCH node is the
promotion bridge — each row names the target artifact type and tracks
whether it has landed.

## Procedure

### Step 1 — Capture: author the RESEARCH node

1. Check `docs/research/index.md` for the next available `RESEARCH-NNN`
   ID. If `docs/research/` does not exist, lazy-create the folder,
   `index.md`, and `log.md` (see
   [`maintenance-discipline.md → Lazy creation`](maintenance-discipline.md)).
2. Author `docs/research/RESEARCH-NNN-<slug>.md` from
   [`sdlc/_templates/RESEARCH.md`](../_templates/RESEARCH.md).
   Set `status: raw`.
3. In `## Abstract`: two to four sentences — what the concept covers and
   why it matters to the project.
4. In `## Key findings`: one bullet per discrete fact or claim the concept
   introduces.
5. In `## Gaps and conflicts`: call out anything the concept leaves
   unanswered or anything it appears to contradict in existing canonical
   nodes / ADRs. If a conflict is blocking, raise an `OQ-NNN` and cite it
   here.
6. Apply 3-file touch: update `docs/research/index.md` (add a row) and
   append a `created` entry to `docs/research/log.md`.

### Step 2 — Fill the Canonical implications table

In `## Canonical implications`, add one row per artifact the concept
warrants. Use the target-artifact column to name the type
(`ENT-NNN proposed | DEC-NNN proposed | ADR-NNN proposed | glossary term
| CCC category`). Leave `Status` as `proposed`.

If the correct canonical type is unclear, open an `OQ-NNN` under
`docs/discovery/open-questions/` with `origin: synthesis` and cite it in
`## Gaps and conflicts`. Resolve before promotion.

### Step 3 — Review: decide what to promote

For each row in `## Canonical implications`, apply the discriminator:

| Implication warrants… | Route to… |
|---|---|
| A cross-cutting architectural rule | [`authoring-adr.md`](authoring-adr.md) |
| A node-local decision | DEC node via [`maintenance-discipline.md`](maintenance-discipline.md) |
| A canonical DDD node (ENT, CMD, FLW, etc.) | Proceed to Step 4 |
| A glossary entry | [`baseline-references.md`](baseline-references.md) |
| Nothing — the concept is covered by an existing artifact | Mark the row `rejected`; note the covering ID |

### Step 4 — Promote: author the canonical node

For each row marked for promotion:

1. Choose the correct node type from the 16 canonical types (ACT, ENT,
   CMD, QRY, FLW, STA, DEC, INT, MOD, SCR, CON, PERM, SVC, FA, EVT, CHG).
   If the type is still unclear after the RESEARCH review, raise an `OQ-NNN`
   — do not guess.
2. Check the per-type `index.md` for the next free ID. Claim the ID in the
   milestone `id-claims.md` if a milestone is in flight.
3. Author the canonical node at `docs/<component>/nodes/<type>/<ID>-<slug>.md`
   using the appropriate template from
   [`sdlc/_templates/nodes/`](../_templates/nodes/).
   - Nodes introduced outside an active FS phase: set `status: active`.
   - Nodes introduced inside Phase 2 (FS in flight): set `status: proposed`;
     Phase 3 merge will flip to `active`.
4. Apply **2-file node touch** per
   [`maintenance-discipline.md`](maintenance-discipline.md):
   - Update the per-type `index.md` (add/update the row).
5. Add `absorbed_from: RESEARCH-NNN` in the canonical node's frontmatter
   `related:` list so the provenance chain is traceable.

### Step 5 — Mark the implication landed; advance RESEARCH status

1. In the RESEARCH node's `## Canonical implications` table, update the
   row's `Status` from `proposed` to `landed` (or `rejected` if you decided
   not to promote).
2. Add the canonical node ID to `adrs_produced:` or the relevant
   frontmatter list in the RESEARCH node.
3. Flip the RESEARCH node's `status:` from `raw` to `synthesized`.
4. Apply 2-file touch: update `docs/research/index.md` (status column)
   and append a `status-change` entry to `docs/research/log.md`.

### Step 6 — Supersede the RESEARCH node when done

When **all** rows in `## Canonical implications` are either `landed` or
`rejected`:

1. Set the RESEARCH node's `status: superseded`.
2. Apply 2-file touch: update `docs/research/index.md` and append a
   `superseded` entry to `docs/research/log.md`.

The RESEARCH node is never deleted — the provenance record (`absorbed from
this concept`) persists for audit.

### Step 7 — Regenerate the report

After absorption, regenerate the relevant derived report so the newly
canonical concept appears in its proper section:

```
"regenerate the <business|technical|…> overview"
```

The report now picks up the new node via its `Pulls from:` source list.

## Tiered touch summary

| Action | Files touched |
|---|---|
| Create RESEARCH node | RESEARCH node + `docs/research/index.md` + `docs/research/log.md` |
| Promote to canonical node | Canonical node + `docs/<component>/nodes/<type>/index.md` |
| Mark RESEARCH `synthesized` | `docs/research/index.md` + `docs/research/log.md` |
| Mark RESEARCH `superseded` | `docs/research/index.md` + `docs/research/log.md` |

## Anti-Pattern: "The Direct Patch"

Report synthesis surfaces a missing concept. Instead of following the
absorption pathway, the operator inlines a description of the concept
directly into `reports/BUSINESS.md` (or another derived report). The
cost: the concept never enters the canonical KB; the next report
regeneration **silently removes** the inline description (because the
KB still has no node for it); the concept must be rediscovered from
scratch in every future report or FS that needs it. **The derived
report is the wrong home for new knowledge.** Author the RESEARCH node,
then let the regeneration surface it.

## Integration

- **Required before:**
  [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) —
  "Reference, never copy" and the tiered touch rule govern every step.
- **Required before:**
  [`maintenance-discipline.md`](maintenance-discipline.md) —
  the 2-file touch procedure for creating canonical nodes (and 3-file for
  ADRs).
- **Trigger source:**
  [`derived-reports.md`](derived-reports.md) — calls this operation
  when synthesis surfaces a new concept.
- **Staging template:**
  [`../_templates/RESEARCH.md`](../_templates/RESEARCH.md) — the
  RESEARCH node template used in Step 1.
- **Node templates:**
  [`../_templates/nodes/`](../_templates/nodes/) — 16 canonical node
  templates used in Step 4.
- **Sibling maintenance ops:**
  [`authoring-adr.md`](authoring-adr.md) — when the implication is
  cross-cutting and warrants an ADR;
  [`legacy-absorption.md`](legacy-absorption.md) — same RESEARCH staging
  pattern, different trigger source (legacy doc vs. report synthesis).
- **Routes findings to:**
  `docs/research/RESEARCH-NNN-<slug>.md` (staging) →
  `docs/<component>/nodes/<type>/<ID>-<slug>.md` (canonical).
