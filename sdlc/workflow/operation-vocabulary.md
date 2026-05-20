---
name: operation-vocabulary
description: "Closed set of lifecycle vocabulary terms (created / updated / status-change / superseded / deprecated / linked / renamed / rule-history / plan-consolidated), the surviving log entry format, and append-only discipline."
applies_when:
  stack: [agnostic]
---

# Operation vocabulary (closed set)

Lifecycle vocabulary used in prose, in `status:` field values, in commit
messages, and in the surviving research / standards logs (see
[Log entry format](#log-entry-format)):

- `created` — new page landed.
- `updated` — significant content edit. Routine typos skipped.
- `status-change` — `proposed → accepted`, `active → superseded`, etc.
- `superseded` — superseded by another ID. The new artifact's body names
  the old; the old artifact's `superseded_by:` names the new.
- `deprecated` — no longer authoritative, no successor.
- `linked` — a new FRS or FS started consuming the page (back-link landed
  via `adrs:` or `source_ref`).
- `renamed` — fires when an ID prefix or core identity changes
  (precedent: EP → CON, 2026-05-14). The page itself moves to the new
  prefix/folder.
- `rule-history` — lifecycle-rule change that doesn't fit the
  per-artifact ops; subject is the rule itself (e.g., a tier-touch
  change, a vocabulary amendment, a tag normalisation, a log-policy
  amendment). Lives in the surviving research / standards logs.
- `plan-consolidated` — single entry summarising every change flowing
  from one plan execution. Body uses sub-bullets per change. See
  [Append-only, oldest first](#append-only-oldest-first) for when to
  use this op vs. `updated` / `status-change` / etc.

Reserved (named in the vocabulary but not yet fired — deferred per §6 of
the MVS execution plan):

- `merged-into` — fires when CHG `merges[]` op lands (deferred).
- `derived-genesis` — fires when CHG `derives[]` op lands (deferred).

For canonical artifacts (node, ADR, CCC), these terms describe events
auditable via the per-type `index.md` Status column and git history; they
do not trigger separate log entries. The surviving research and standards
logs use the same vocabulary for their entries.

## Log entry format

> **Scope:** applies to the surviving append-only logs only —
> `docs/research/log.md` (research discovery surface) and
> `sdlc/standards/log.md` (engine standards). Canonical artifacts (nodes,
> ADRs, CCCs) do **not** use this format — they audit via index Status
> column + git history.

Single-line for atomic events; multi-line block for per-plan entries with a
sub-bullet per change.

```
## [YYYY-MM-DD] <op> | <node-id> — <one-line note>
```

Single-line examples:

```
## [2026-05-13] created | RESEARCH-004 — IaC spike per FRS-018
## [2026-05-15] superseded | RESEARCH-002 — folded into RESEARCH-004
## [2026-06-02] updated | STD-005 — added analyzer rule for nullable refs
```

Multi-line per-plan example (op `plan-consolidated`, one block, one
sub-bullet per change):

```
## [YYYY-MM-DD] plan-consolidated | <umbrella heading naming every affected ID>

Source: plan `<plan-filename>.md`.

- **<ID> — <change heading>.** Body of the change, indented as a
  sub-bullet so the whole entry parses as one log row.
- **<ID> — <change heading>.** Same shape.
```

Parseable via `grep "^## \[" log.md | tail -5` — the umbrella heading is
the single grep hit per plan, regardless of how many sub-bullets the body
carries.

## Append-only, oldest first

> **Scope:** the surviving research and standards logs only — see
> [Log entry format](#log-entry-format).

Never edit or reorder existing log entries except under the retroactive
consolidation carve-out below. New entries go at the **bottom** of the file.

**One entry per plan execution.** Multiple lifecycle changes flowing from
the same plan land as a single `plan-consolidated` entry that names every
affected ID in its umbrella heading and lists each change as a sub-bullet
(see [Log entry format](#log-entry-format)). A plan that touches three
standards produces one log entry, not three. Op selection: use the atomic
op (`updated`, `status-change`, `created`, `rule-history`, etc.) when the
plan made exactly one lifecycle change; use `plan-consolidated` when it
made two or more.

**Retroactive consolidation carve-out.** Existing per-change entries from
the same plan MAY be squashed into a single `plan-consolidated` entry in
one atomic operation. The squash itself produces a `rule-history` entry
at the bottom of the log naming the absorbed entry headings and the
absorbing entry's date. Absorbed entries' content is preserved verbatim
inside the absorbing entry's body — no information loss. Placeholder
`created` rows whose subject has since been superseded by a substantive
entry MAY be dropped in the same operation.

## Integration

**Parent:** [`maintenance-discipline.md`](maintenance-discipline.md) — routing gate.
**Surviving logs:** `docs/research/log.md`, `sdlc/standards/log.md`.
**Related:** [`rule-history.md`](rule-history.md) (canonical `log.md`
retired 2026-05-16; the two surviving logs use this vocabulary).
