# Standards Index

> The Karpathy-style index for **engine-level technical standards**. The only
> standards file generators wholesale-read. Phase 0 / 1 / 2 / 3 scan this table
> to identify relevant standards, then narrow-load the individual standard
> pages declared in the consuming artifact's `standards:` frontmatter.
>
> See [`../WORKFLOW.md → Retrieval discipline`](../WORKFLOW.md#retrieval-discipline)
> and [`../workflow/authoring-adr.md`](../workflow/authoring-adr.md) (the
> Standard / ADR / DEC discriminator lives there).
>
> One row per standard. Title is **one line** — full rules belong in the
> standard page itself, not here.

---

## Conventions

- **ID** — `STD-NNN`. Increment from the highest existing ID. Retired IDs are
  not reused.
- **Status** — `proposed` · `accepted` · `deprecated` · `superseded`.
- **Tags** — free-form, comma-separated.
- **Scope** — always `engine`. Standards apply to any project using this
  methodology. Project-specific cross-cutting commitments live as ADRs in
  [`../../docs/<component>/adrs/`](../../docs/<component>/adrs/); node-local atomic decisions live as
  DECs (inline under a host node's `## Decisions` heading, or standalone under
  `../../docs/<component>/nodes/decisions/`).
- **Source** — `seed` · `harvested-from-ADR-NNN` · `proposal`. Where the
  standard originated.

---

## Active Standards

| ID  | Title (one line) | Status | Tags | Source |
| --- | ---------------- | ------ | ---- | ------ |
| [STD-001](ddd-standards.md) | Engine-level DDD constraints — aggregate encapsulation, entity vs VO, identity rules, domain-event semantics (placeholder pending first FRS that touches the domain layer) | proposed | placeholder, ddd, domain-layer | seed |
| [STD-002](dotnet-conventions.md) | Engine-level .NET implementation conventions — Result Pattern, exception policy, async naming (placeholder pending first FRS that touches application-layer code) | proposed | placeholder, dotnet, application-layer | seed |
| [STD-003](api-design.md) | Engine-level API design rules — verb / status code, REST/RPC choice rationale, pagination shape (placeholder pending first FRS that touches an HTTP boundary) | proposed | placeholder, api, http | seed |
| [STD-004](node-definitions.md) | Engine-level per-node-type contract guarantees — what each node type's frontmatter and body must carry (placeholder pending first contract codification) | proposed | placeholder, methodology, node-types | seed |

---

## Superseded / deprecated

Kept for audit trail. Reference, do not delete — superseding standards link back
via `supersedes:` and the originals carry `superseded_by:`.

| ID  | Title (one line) | Status | Superseded by | Date |
| --- | ---------------- | ------ | ------------- | ---- |
| _none yet_ |  |  |  |  |
