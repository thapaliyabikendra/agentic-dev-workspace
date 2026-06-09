---
applies_when:
  stack: [agnostic]
---

# FRS Code Extraction Rules

> **Type:** Workflow reference. Consulted at Phase 0 / Phase 1 when the
> milestone scope starts from the existing application's source code
> (the brownfield path). See [`design.md`](design.md) for phase
> mechanics; this file is the rule book it consults. Codifies the
> signal-to-FRS mapping, logical source names, code → business
> translation discipline, one-hop import traversal, and the
> `[inferred from code]` tagging rule that the Phase 1.5 validation
> gate enforces downstream.

## When to Use

**Use when:** the milestone scope explicitly cites existing application
source code as input (brownfield path), an FRS candidate is being
seeded from source files (e.g. `*.tsx`, `*.ts`, `*.cs`, `*.py`) rather than from prose,
or a mixed-source extraction encounters a conflict between prose and
code that needs a tagging decision.

**Do NOT use when:** the FRS source is prose-only (skip the signal
table; the `[inferred from code]` tag does not apply), the artifact is
already past Phase 1 (the gate at Phase 1.5 enforces the tag — see
[`frs-validation-rules.md`](frs-validation-rules.md)), or the extraction
is happening at Phase 2 or later (Phase 2 ingests pre-tagged FRS rows;
it does not re-derive them from code).

**Vs. sibling files:** [`frs-validation-rules.md`](frs-validation-rules.md)
classifies a tagged item's severity at the Phase 1.5 gate; this file
governs how the tag gets attached in the first place. The two operate
at adjacent points in the same brownfield path: extract → tag (here),
then gate → classify (there). Note the asymmetry with the prototype
path: code-as-input is inherently brownfield (you only have existing
code in brownfield); its prototype-sourced peer
([`frs-prototype-extraction-rules.md`](frs-prototype-extraction-rules.md))
is posture-independent.

How to mine the existing application's source code for FRS candidates
without leaking implementation detail into the FRS itself.

> **Stack-neutral signal table.** The signal categories below apply to
> any frontend or backend stack. Parenthetical examples in each row
> illustrate the pattern for common stacks — adapt to your own.

The principle: **code reveals structure, prose reveals intent.** Extract
structure aggressively, but flag every business rule, edge path, fault
path, actor, or precondition you infer from code alone with
`[inferred from code — confirm with stakeholder]`. The Phase 1.5
validation gate enforces the tag — see
[`frs-validation-rules.md → [inferred from code] propagation`](frs-validation-rules.md#inferred-from-code-propagation-brownfield).

---

## Signal-to-FRS mapping

For each code source, walk these signals top-to-bottom. A single file may
produce multiple FRS candidates (multiple user-journeys). Target columns
refer to the project's FRS template
([`../_templates/FRS.md`](../_templates/FRS.md)) and the canonical DDD
wiki at `docs/<component>/nodes/`. Birth phases are type-keyed: FLW and
ACT are born at Phase 1 alongside their FRS (per R-NEW-1); ENT, CMD, STA,
CON, INT, DEC, PERM, QRY are born at Phase 2; Phase 3 flips all
proposed-state nodes to `active`.

| Signal in code | Lands in |
|---|---|
| Form submission trigger (e.g. HTML/React: `<form onSubmit>`, Django: `<form method="POST">`, .NET: `[HttpPost]` action) | One FRS candidate (one user-journey). The Phase-1-born FLW carries the Trigger + Scenarios; the FRS body carries Use case + ACs + BRs + Brownfield impact. |
| Form field declarations inside a form (inputs, selects, textareas) | Form fields go into a canonical Entity (ENT) node (existing, or Phase-2-born with `status: proposed` per the FRS's `produces_nodes:`), not into the FRS body directly. The FRS references the ENT ID inline. |
| Data shape / schema types on form or handler (e.g. TypeScript interfaces, Python dataclasses, .NET DTOs) | Strengthen the data shape of the canonical ENT — translate to business language; never leak type primitives to the FRS or the node body. |
| Non-form action trigger (e.g. button click → async operation) | Candidate operation. FRS Use case + FLW Trigger + FLW Scenarios. |
| Async / system-boundary call (e.g. React: `fetch` / `useMutation`; Django: `requests`; .NET: `HttpClient`) | System boundary; the FRS Edge cases / Brownfield notes name the fault domain; the Phase-1-born FLW's `#fault` Scenario carries the observable terminal state. |
| Validation schema (e.g. JS: `zod`, `yup`, `joi`; .NET: `class-validator`; Python: Pydantic validators) | Business rules in the FRS Business rules section or constraints on the canonical ENT (Phase-2-born), tagged `[inferred from code]`. |
| Inline error / early return in submit paths (`if` / `throw` / `return error`) | Fault paths on the Phase-1-born FLW's `#fault` Scenario; tagged `[inferred from code]`. |
| Error UI (inline error component, `try/catch` display block) | Fault paths on the Phase-1-born FLW's `#fault` Scenario. |
| Role / permission check (guard clause on actor identity, e.g. `hasRole`, `isAdmin`, `Can`) | Actors + Preconditions in the FRS, with the actor ID resolving to an ACT-NNN node — either an existing canonical ACT (cited by ID) or the new ACT this FRS introduces via `produced_actor:` (Phase-1-born with `status: proposed`). Tagged `[inferred from code]`. |
| Route definition (path-based or file-based routing) | Module-grouping hint — informs whether a milestone needs splitting (see [`design.md → Phase 0 Scope check`](design.md#before-any-questions)). |
| Loading / pending / submitting state | Hints at the trigger → postcondition path; lands on the Phase-1-born FLW's Scenarios (business language) and gets enriched at Phase 2 with Sequence wiring. |
| Notification / feedback call (toast, alert, queue dispatch) | The FRS Notifications table carries the recipient / trigger / channel / reason policy; the Phase-1-born FLW's Scenarios reference the actor outcome ("the actor is informed of the outcome"). |
| Guard clauses with edge/null value checks (early return on null or out-of-range values) | Edge paths on the Phase-1-born FLW's `#edge` Scenario; tagged `[inferred from code]`. |

**Output of extraction per candidate:** Use case title; source location
(file path + logical name — see below); pre-populated FLW Scenarios
(happy / edge / fault, business language, each tagged `[inferred from
code]`); inferred actor list resolving to ACT-NNN (existing canonical or
new via `produced_actor:`); pre-populated `touches_nodes:` declaration
when existing canonical nodes match the domain (check
`docs/<component>/nodes/*/index.md`); pre-populated `produced_flw:`
scalar (the FLW this FRS births at Phase 1 — real, not claim) and
`produced_actor:` scalar (when introducing a new actor); pre-populated
`produces_nodes:` **claim** for Phase-2-born nodes the candidate will
introduce (ENT / CMD / STA / CON / INT / DEC / PERM / QRY only — claim
language stays here because these IDs are not yet allocated). **Tag every
inferred business-level item that came from code — no exceptions.**

## Anti-Pattern: "The Code-First FRS"

Reading a `*.tsx` source aggressively, producing a polished FRS draft
from it (Use case + Actors + Business rules + AC all populated), and then
**stripping or omitting the `[inferred from code — confirm with
stakeholder]` tag** on the populated items because the draft "reads
well as-is" or because the human author can vouch for the intent. The
cost: the Phase 1.5 gate has no signal to fire on (no tag → no `OQ`
trigger), the FRS enters Phase 2 with code-inferred business rules
masquerading as stakeholder-confirmed ones, and the brownfield
"surface, never absorb" rule is silently violated at extraction time.
**Tagging is unconditional; if it came from code alone, the tag goes
on, full stop.** The tag is stripped only after the corresponding OQ
resolves to Confirm or Revise — never at extraction. Doctrinal anchor:
[`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules) — every
artifact has an ID and links upstream + downstream; un-tagged
code-inferred items break the upstream link to stakeholder intent.

---

## Logical source names

In addition to the file path, emit a **logical name** for each source —
a stable, refactor-resilient identifier composed as
`<Module>.<Area>.<Name>`:

- `Admin.Settings.Update`
- `Admin.Settings.Store`
- `Onboarding.Checklist.Verify`

The logical name is independent of the file's path on disk; renaming or
moving the file does not break traceability. Both the file path and the
logical name go into the canonical node's `source_ref` frontmatter
(the node is canonical from Phase 2 ingest onward):

```yaml
source_ref:
  - path: modules/admin/settings/UpdateSettings.tsx
    logical: Admin.Settings.Update
  - path: modules/admin/settings/settingsStore.ts
    logical: Admin.Settings.Store
```

**How to derive a logical name:**

- `<Module>` — project-level module the file participates in (typically
  the directory name two levels up, normalised to PascalCase:
  `admin/settings` → `Admin.Settings`).
- `<Area>` — functional grouping within the module (typically the
  immediate parent directory or the file's purpose category:
  `Settings`, `Checklist`, `Store`).
- `<Name>` — the operation, store, or component name (typically the
  default export or principal component name without the file
  extension).

When the directory structure doesn't cleanly yield the components, use a
best-effort PascalCase composition and surface the choice in the FRS's
Brownfield impact section so a reviewer can sanity-check.

---

## Translation discipline (code → business language)

The extraction output should already be one translation step away from
business language:

| Code surface | Drop in extraction output |
|---|---|
| Type names (`string`, `number`, `Date`) | "free text", "numeric", "date" — or omit |
| Validator names (`.email()`, `.min(3)`, `regex(...)`) | "must be a valid email", "must contain at least 3 characters" |
| Field names (`firstName`, `dob`) | Title case with spaces: "First Name", "Date of Birth" |
| Component names (`<UserForm>`, `<AdminPanel>`) | Operation name: "User Registration", "Admin Configuration" |
| Endpoint paths (`/api/v1/users`) | Drop from FRS body. The path lands on a `CON-NNN` node (the canonical wire surface). The FRS Use case Trigger MAY name the path **once** as a single-line surface identifier; further occurrences in Behavior / AC / BR are a `protocol-surface-leak` finding — reference `CON-NNN` by ID instead. |
| HTTP verb + path tokens (`POST /api/v1/users`) | Same as endpoint paths — Trigger only; everywhere else, `CON-NNN`. |
| HTTP status codes (`200`, `302`, `400`, `404`) | Drop from FRS body. Recast outcomes in business language: "the operation succeeds", "the actor is redirected", "the operation is rejected with the corresponding rejection outcome". Wire mapping (status code per outcome) lives in `CON-NNN` and is verified by integration tests. |
| Query-string syntax (`?key=value&token=...`) | Drop syntax from FRS body. The query schema belongs in `CON-NNN`; reference by ID. |
| Response payload shapes (fenced JSON / XML body examples) | Drop from FRS body. The response shape lives in `CON-NNN`. |
| Protocol literals (`grant_type=password`, `error: "invalid_grant"`, `Bearer`) | Drop from FRS body. Business-level claims like "an authenticated session is established" or "authentication is rejected with the generic rejection outcome" are the FRS-level form. The protocol vocabulary lives in `CON-NNN`. |
| Error codes (`ERR_AUTH_FAILED`, framework error-code strings like `IdentityErrors.DuplicateEmail`) | Exception name in business language: "Unauthorised Access", "Operation Could Not Complete", "Duplicate Email Outcome". The wire-level error-code literal lives in `CON-NNN`'s error map. |
| Outbound framework abstraction (`IAccountEmailer`, `IEmailSender`, `ISmsSender`, `IPushNotificationService`, named `IHttpClientFactory` clients, vendor SDK adapters like `IStripeClient` / `IS3Client` / `ISendGridClient`) | The abstraction is the **seam**, not the boundary. Declare an `INT-NNN` node for the external system the abstraction reaches (SMTP relay, SMS gateway, push-notification provider, payment processor, object store) and list it in the FRS's `produces_nodes:` (new boundary) or cite the existing canonical `INT-NNN` inline in body prose (consumer-of-existing-INT). The abstraction symbol name remains permitted by ADR-001; the missing boundary declaration is the leak. |
| Distributed-event publish (`IDistributedEventBus.PublishAsync` to external Kafka topic / RabbitMQ exchange) | Route to `EVT-NNN` + `linked_contract: CON-NNN` per [`../KB-LAYOUT.md → Node-type discriminators`](../KB-LAYOUT.md#node-type-discriminators) — NOT to INT-NNN. In-process framework-local events stay in the CMD's "Domain events raised" subsection. |

If you cannot translate a piece of code into business language, leave the
question in the candidate's per-FRS discovery.

The right-column relocations above are not optional style — they are
enforced at the Phase 1.5 gate by two complementary sanity sub-flavors:
[`frs-validation-rules.md → Rule: protocol-surface-leak`](frs-validation-rules.md#rule-protocol-surface-leak)
(introduced 2026-05-17 — covers HTTP / JSON / query / protocol literal
rows) and
[`frs-validation-rules.md → Rule: external-boundary-undeclared`](frs-validation-rules.md#rule-external-boundary-undeclared)
(introduced 2026-05-17, v1.2 — covers the outbound framework abstraction
row). ABP public-API symbol names (classes, methods, configuration option
keys, entity property names) remain governed by ADR-001 and are not
protocol-wire surface; the symbol name being permitted does not exempt
the FRS from declaring the external boundary the symbol reaches.

---

## One-hop import traversal

When a code source imports another **local file** (relative path like
`./checklist-store`, `../hooks/useFoo`, not a third-party package), read
the imported file and apply the signal table to it as well.

- **Cap depth at 1.** Do not recurse into files imported by the imported
  file.
- **Skip third-party imports** (anything from a package registry — e.g.
  `node_modules`, pip, NuGet — identified by a bare package name, scoped
  namespace, or package-manager path).
- **Skip type-only imports** when they're trivially aliases
  (`import type { Foo } from './types'` where `types.ts` is just type
  aliases). Read them only if they contain validation schemas or
  value-bearing constants.

Every traversed file contributes to the canonical node's `source_ref`
(each with file path and logical name).

---

## Mixed-source reconciliation

When both code and prose are provided (the typical brownfield case):

- **Code → structure**: form fields, fault paths, the operation
  manifest, actor inference from role checks.
- **Prose → intent**: Use case, why-it-matters, policy rules that drive
  business behaviour, actors named explicitly by stakeholder.
- **Conflicts** (e.g., prose says "only managers can submit" but code
  has no role check, or code branches on a condition prose never
  mentions): raise an `OQ-NNN` under `docs/discovery/open-questions/`
  with `origin: frs-authoring, origin_ref: FRS-NNN` (cited from the
  per-FRS discovery); **do NOT silently choose one source.** This is
  the project's "Brownfield conflicts are surfaced, not absorbed"
  hard rule applied at extraction time.

Prose-only or code-only inputs each have their own gaps. Mixed sources
usually produce the strongest FRS — but only when conflicts are surfaced
rather than smoothed over.

---

## Code-only caveat

When code is the sole source (no prose, no meeting notes, no brief), be
**aggressive about surfacing open questions.** Code reveals structure
(what operations exist, what fields they take) but rarely intent (why,
policy, edge-case handling).

Every business-level item inferred from code alone is tagged
`[inferred from code — confirm with stakeholder]` and raised as an
`OQ-NNN` under `docs/discovery/open-questions/` with
`origin: frs-authoring, origin_ref: FRS-NNN`. The tag is stripped only
after stakeholder confirmation — see
[`frs-validation-rules.md → [inferred from code] propagation`](frs-validation-rules.md#inferred-from-code-propagation-brownfield).

---

## Revision history

| Version | Date | Source |
|---------|------|--------|
| 1.0 | 2026-05-11 | Absorbed from the shared FRS code-extraction reference (v3.0) during workflow absorption, remapped to the project's FRS template and `source_ref` frontmatter convention. Subagent dispatch contract, `source_manifest` payload shape, "frs-template.md Canonical Section List" hardcode, and runbook phase references dropped — the project is filesystem-based with a different orchestration shape. Signal mapping, logical source names, translation discipline, one-hop traversal, mixed-source reconciliation, and code-only caveat retained. |
| 1.1 | 2026-05-17 | Translation discipline table extended with HTTP/JSON/query/protocol-literal rows alongside the introduction of `protocol-surface-leak` in `frs-validation-rules.md` v1.1. |
| 1.2 | 2026-05-17 | Translation discipline table extended with two more rows: **outbound framework abstraction** (`IAccountEmailer`, `IEmailSender`, named `IHttpClientFactory` clients, vendor SDK adapters) → `INT-NNN` boundary declaration; **distributed-event publish** (`IDistributedEventBus.PublishAsync` to external Kafka / RabbitMQ) → `EVT-NNN` + linked `CON-NNN` per KB-LAYOUT, NOT INT. Enforced at Phase 1.5 by `external-boundary-undeclared` sanity sub-flavor introduced in `frs-validation-rules.md` v1.2 on the same date. |

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Existing nodes are authoritative" and "Reference, never copy"
  govern the `touches_nodes` / `produces_nodes` claims this file
  pre-populates.
- **Required before:** [`../WORKFLOW.md → Legacy absorption`](../WORKFLOW.md#legacy-absorption)
  — "Surface conflicts, never absorb" is the doctrinal anchor of the
  mixed-source reconciliation rule.
- **Caller:** [`design.md → Phase 1`](design.md#phase-1--frs-authoring)
  (and Phase 0 scoping when source code is the milestone-scoping
  signal) — fires this rule book when an FRS candidate is being
  derived from source.
- **Adjacent (not callers but consulted):**
  [`frs-validation-rules.md`](frs-validation-rules.md) — enforces the
  `[inferred from code]` tag at the Phase 1.5 gate;
  [`legacy-absorption.md`](legacy-absorption.md) — when the source is
  documented legacy material rather than live code, route there
  instead.
- **Routes findings to:** OQ-NNN files under
  [`../../docs/discovery/open-questions/`](../../docs/discovery/open-questions/)
  with `origin: frs-authoring` when stakeholder confirmation is owed
  for a code-inferred item.
- **Sibling rule books:**
  [`frs-validation-rules.md`](frs-validation-rules.md),
  [`coverage-matrix.md`](coverage-matrix.md),
  [`test-data-generation.md`](test-data-generation.md),
  [`lint.md`](lint.md).
