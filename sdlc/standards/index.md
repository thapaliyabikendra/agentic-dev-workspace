# Standards Index

> The Karpathy-style index for **engine-level technical standards**. The only
> standards file generators wholesale-read. Phase 0 / 1 / 2 / 3 scan this table
> to identify relevant standards, then narrow-load the individual standard
> pages declared in the consuming artifact's `standards:` frontmatter.
>
> See [`../workflow/retrieval-discipline.md`](../workflow/retrieval-discipline.md)
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
- **Applies when** — frontmatter `applies_when` declares conditional
  applicability across two axes. `applies_when.stack` narrows by stack
  axis (canonical enum in [`../BOUNDARY.md § Stack axis`](../BOUNDARY.md#stack-axis-frontmatter-enum) —
  `api`, `ui`, `test`, `full-stack`, `infra`, `agnostic`).
  `applies_when.framework` narrows by framework (e.g., `abp-net`,
  enumerated in [`../BOUNDARY.md § Framework axis`](../BOUNDARY.md#framework-axis-frontmatter-enum)).
  A consuming artifact's `stack:` (and `framework:` if declared) must
  intersect each declared axis for the standard to bind.
- **Source** — `seed` · `harvested-from-ADR-NNN` · `proposal`. Where the
  standard originated.

---

## Active Standards

| ID  | Title (one line) | Status | Applies when | Tags | Source |
| --- | ---------------- | ------ | ------------ | ---- | ------ |
| [STD-001](ddd-standards.md) | Engine-level DDD constraints — aggregate encapsulation, entity vs VO, identity rules, domain-event semantics (placeholder pending first FRS that touches the domain layer) | proposed | agnostic | placeholder, ddd, domain-layer | seed |
| [STD-002](dotnet-conventions.md) | Engine-level .NET implementation conventions — Result Pattern, exception policy, async naming (placeholder pending first FRS that touches application-layer code) | proposed | agnostic | placeholder, dotnet, application-layer | seed |
| [STD-003](api-design.md) | Engine-level API design rules — verb / status code, REST/RPC choice rationale, pagination shape (placeholder pending first FRS that touches an HTTP boundary) | proposed | api | placeholder, api, http | seed |
| [STD-004](node-definitions.md) | Engine-level per-node-type contract guarantees — what each node type's frontmatter and body must carry (placeholder pending first contract codification) | proposed | agnostic | placeholder, methodology, node-types | seed |
| [STD-005](STD-005-abp-coding-conventions.md) | ABP framework coding conventions — built-in entity catalog check, base-class declarations, DTO audit mirroring, query wrappers, companion entity pattern, PascalCase naming, C# enums for bounded values, no data annotations on domain entities, file/folder/type-suffix and DB naming | accepted | api + framework: abp-net | abp, dotnet, entity, dto, naming, conventions, validation | guidelines/abp-guidelines.md |

---

## Superseded / deprecated

Kept for audit trail. Reference, do not delete — superseding standards link back
via `supersedes:` and the originals carry `superseded_by:`.

| ID  | Title (one line) | Status | Applies when | Superseded by | Date |
| --- | ---------------- | ------ | ------------ | ------------- | ---- |
| _none yet_ |  |  |  |  |  |
