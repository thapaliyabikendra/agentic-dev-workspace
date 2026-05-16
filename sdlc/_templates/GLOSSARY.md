# Glossary

> **Type:** Project-owned reference template. Seed once per project into
> `docs/shared/glossary.md`. Maintained by the project's curator (typically the
> solo developer wearing a curator hat). Format, read contract, and
> Add / Change / Retire / Drift procedures live in
> [`../workflow/baseline-references.md`](../workflow/baseline-references.md).
> **Template path:** `sdlc/_templates/GLOSSARY.md`
> **Seed path:** `docs/shared/glossary.md`

Project-wide domain vocabulary. Each FRS that uses a domain term references
this file rather than restating the definition — terms live here, FRSs link
to them. The glossary is the bridge between business-stakeholder language
and FRS bodies; when a reviewer hits an unfamiliar term in an FRS, they
should be able to find the canonical definition here without hunting across
documents.

---

## Seeding instructions

When seeding this file into a project:

1. Copy the file to `docs/shared/glossary.md`.
2. Replace the seed-path blockquote above with a plain header note; re-anchor
   the `baseline-references.md` link to `../../sdlc/workflow/baseline-references.md`.
3. Keep the Baseline terms section intact — Audit Trail, Audit Trail
   Entry, and Cross-Cutting Concerns are universal across audited
   business domains. Removing any of them warrants a major version bump.
4. Leave the Project-specific terms section empty — it populates as
   domain vocabulary lands.
5. Set the revision-history `Date` to the seeding date and the
   `Author` to your name (or `seeding` if the seed is unattended).

---

## Project glossary

### Baseline terms

*Seeded with the project from the shared template. Universally applicable
across audited business domains. Adding to this subsection is rare and
warrants a major version bump.*

### Audit Trail

An immutable, append-only record of operations performed in the system,
captured for compliance review and incident reconstruction. Every
state-changing operation contributes at least one entry; every entry
attributes the operation to an actor identity, a timestamp, and an outcome.

**See also:** Audit Trail Entry

### Audit Trail Entry

A single record within the Audit Trail capturing one operation attempt.
Includes actor identity, timestamp, outcome (accepted / refused / failed),
and any operation-specific fields the spec mandates be captured verbatim
(e.g., a rationale, a captured policy version).

### Cross-Cutting Concerns

The set of project-wide non-functional requirements, defaults, and
obligations defined as per-CCC pages under
[`docs/shared/ccc/`](../../docs/shared/ccc/index.md) (one file per concern;
index at `docs/shared/ccc/index.md`). Every FRS declares the CCCs it
inherits in its `ccc:` frontmatter; FRS sections that touch NFR territory
reference CCCs by ID rather than restate them. Operation-specific
deviations are filed as ADRs back-linked via `related: [CCC-NNN]`.

### Project-specific terms

*Project-curated domain vocabulary. Add entries via Op 1 — see
[`../workflow/baseline-references.md`](../workflow/baseline-references.md).*

*(empty — populated as the project's domain vocabulary lands.)*

---

## Revision history

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | seeding | Seeded from `_templates/GLOSSARY.md` v1.1. Universal baseline only (Audit Trail, Audit Trail Entry, Cross-Cutting Concerns); Project-specific terms subsection empty. |
