---
applies_when:
  stack: [agnostic]
---

# Required Coverage Matrix

> Reference table for TC completeness checking at Phase 2 test-plan
> ingest. Walk the per-use-case tables (Display, View/Modal, Create,
> Update, Delete, State Transition, Toggle, Reorder, Search, Export,
> Bulk, Multi-Tenancy, Session) to identify which TCs apply to this
> FS, then emit TCs for the rows that apply. The matrix is what the
> source — FRS acceptance criteria and FLW scenarios — leaves
> implicit.

## When to Use

**Use when:** ingesting a test plan during Phase 2 (consult per use
case the FS exercises), authoring a self-review checklist at Phase 2
close ("did I miss a matrix row that applies?"), or evaluating
test-suite completeness for a regulated or security-critical surface
where full coverage discipline applies.

**Do NOT use when:** the work is Test Data generation (use
[`test-data-generation.md`](test-data-generation.md) — generates the
concrete values for the TCs this matrix identifies), runner code
emission (use [`test-runner-cookbook.md`](test-runner-cookbook.md) —
maps step text to runnable code), or the artifact is not a TC under
an FS's `test-plans/<use-case>/` folder (this matrix governs TC
emission only; ADR / node / FRS validation has its own rule book).

**Vs. sibling files:** [`test-data-generation.md`](test-data-generation.md)
governs the values; this file governs whether a given TC should exist
at all. [`test-runner-cookbook.md`](test-runner-cookbook.md) governs
how a TC's steps become executable code. The three are the **TC
authoring trio** at Phase 2 / Phase 3 — matrix (completeness) → test
data (values) → action map (code).

Apply the tables below according to which use cases the FS exercises
(Display, View/Modal, Create, Update, Delete, State Transition, Toggle,
Reorder, Search, Export, Bulk, Multi-Tenancy, Session, Notifications).

## Anti-Pattern: "The Matrix-First Approach"

Reaching for the coverage matrix before the FRS / FLW scenarios are
clear, then emitting every applicable matrix row as a TC regardless
of whether the FRS exercises the surface — "if it's in the matrix,
write a TC". The cost: the test plan balloons with TCs for behaviour
the FRS doesn't actually specify ("max length exceeded" TC for a
field with no declared max length; "concurrent edit" TC for an
entity that doesn't carry the concurrency token); the matrix becomes
an FRS-replacement rather than a completeness check; the reviewer
spends time triaging unwarranted TCs. **The matrix is the
completeness check, not the FRS substitute.** Walk the FRS and the
FLW scenarios first; the matrix is consulted after, to surface what
the source leaves implicit. A row whose preconditions don't hold for
this FS is **skipped**, not emitted as a TC with a "TODO — verify
applies" note. Doctrinal anchor:
[`../PRINCIPLES.md`](../PRINCIPLES.md) — the canonical artifacts (FRS,
FLW) are authoritative; reference materials inform, they do not
supplant.

---

**Display / List**

| TC type | When to generate | Priority |
|---|---|---|
| Display populated list | Always | High |
| Display empty state | Always | Medium |
| Pagination — first / middle / last page | If pagination in scope | Medium |
| Sorting — each sortable column ascending and descending | If sorting in scope | Medium |
| Filtering — each filter applied independently | If filters in scope | Medium |
| Search — match found, no match, special chars, empty query | If search in scope | Medium |
| Loading state visible during fetch | Always | Low |
| Server error during fetch — error message + retry | Always | Medium |
| Unauthorized user attempts list view | When access control applies | High |

**View / Preview / Modal Detail (read-only views and dialogs)**

| TC type | When to generate | Priority |
|---|---|---|
| Trigger opens the view (happy path) | Always | High |
| Verify expected content is displayed (count, fields, labels) | Always | High |
| Verify content labelling is correct and unambiguous | Always | High |
| Read-only enforcement — no editable inputs, no submit, no annotation tools | Always | High |
| Dismiss via primary close button | Always | High |
| Dismiss via ESC key | Always | Medium |
| Dismiss via backdrop click — verify behaviour matches design (close OR no-op) | Always | Medium |
| After dismissal — parent view returns to prior state | Always | High |
| Re-open the same target — content matches the first open | Always | Medium |
| Open view A, dismiss, open view B — view B shows B's content (no leakage) | When the trigger is on a list with multiple targets | Medium |
| Missing data — placeholder shown gracefully without breaking layout | When the source identifies a missing-data exception | High |
| Partial data — some fields present, some missing — view stays usable | When partial-failure is plausible | Medium |
| Unauthorized target — view does not open, error shown | When access control applies | High |
| Session expires while view is open — view closes gracefully with notice | When session lifetime applies | Medium |

**Create / Add**

| TC type | When to generate | Priority |
|---|---|---|
| Happy path — all valid input | Always | High |
| Required field missing — **one TC per required field** | Always | High |
| Maximum length exceeded — **one TC per text field with a length cap** | Always | High |
| Minimum length violation — one TC per field with a minimum | When a minimum exists | Medium |
| Duplicate value — **one TC per uniqueness constraint** | Always for unique fields | High |
| Duplicate with whitespace variants — `"Admin"` vs `" admin "` | Always for unique text fields | Medium |
| Duplicate with case variants — `"Admin"` vs `"ADMIN"` | When uniqueness is case-insensitive per spec | Medium |
| Invalid format — email / phone / URL / date / number / decimal precision | One TC per typed or formatted field | High |
| Whitespace-only value for required text field | Always | Medium |
| Special characters / injection-style payload in free-text fields | Always for free-text fields | Medium |
| Out-of-range numeric value (negative when not allowed, exceeds upper bound) | When numeric ranges apply | Medium |
| Foreign-key reference to non-existent parent | When FK fields exist | Medium |
| Cross-field comparison violation — `End < Start`, `Discount > Subtotal` | When the FRS or scoped Entity specifies a cross-field rule | High |
| Conditional required — Field B required only when Field A = X | When conditional rules exist | High |
| Either-or rule — at least one of A or B must be provided | When stated | High |
| Sum / total constraint — line totals must equal header total | When applicable | High |
| Unauthorized user attempts create | When access control applies | High |

**Update / Edit**

| TC type | When to generate | Priority |
|---|---|---|
| Happy path — valid edit | Always | High |
| Edit creates a duplicate value — **one TC per uniqueness constraint** | Always for unique fields | High |
| All Create validations re-apply on Edit (required, max length, format, cross-field, conditional) | Always | (varies) |
| Edit non-existent record (record deleted by another user / wrong ID) | Always | Medium |
| Concurrent edit / stale record (optimistic concurrency) | **Always when the entity carries the project's concurrency token** (declared in the persistence ADR); skip only when explicitly disabled | High |
| Unauthorized user attempts edit | When access control applies | High |
| Cancel without saving — verify no changes persisted | Always | Low |

**Delete**

| TC type | When to generate | Priority |
|---|---|---|
| Happy path — delete with confirmation | Always | High |
| Cancel deletion — confirm record still exists | Always | Medium |
| Delete non-existent record | Always | Medium |
| Delete with dependent records — FK constraint blocks or cascades | When dependencies exist | High |
| Soft-delete verification — record hidden from list but retrievable | When soft delete is the policy | Medium |
| Restore after soft delete — record returns to list | When restore is in scope | Medium |
| Recreate after soft delete — uniqueness constraint behaviour | When uniqueness applies and soft delete is the policy | Medium |
| Unauthorized user attempts delete | When access control applies | High |

**State / Workflow transitions** (for entities with a STA-NNN node)

| TC type | When to generate | Priority |
|---|---|---|
| Each valid transition (e.g. Draft → Submitted) | One TC per valid transition | High |
| Each invalid transition is rejected | One TC per invalid transition | High |
| Terminal state — record is read-only (no edit, no further transitions) | When a terminal state exists | High |
| Pre-condition state check — action only allowed when entity is in correct state | One TC per state-gated action | High |
| Concurrent transition by another actor — second actor sees current state | When workflow is multi-actor | Medium |
| Audit trail — transitions recorded with actor, timestamp, from/to-state | When auditability is in scope | Medium |

**Toggle**

| TC type | When to generate | Priority |
|---|---|---|
| Toggle on → off | Always | High |
| Toggle off → on | Always | High |
| Cascade effect on dependents | When toggle has cascade semantics | High |
| Unauthorized user attempts toggle | When access control applies | High |

**Reorder / Sort**

| TC type | When to generate | Priority |
|---|---|---|
| Move item up | Always | High |
| Move item down | Always | High |
| Move first item up — boundary, no-op or disabled | Always | Medium |
| Move last item down — boundary, no-op or disabled | Always | Medium |
| Reorder persists across page reload | Always | Medium |

**Search / Filter**

| TC type | When to generate | Priority |
|---|---|---|
| Exact match returns the record | Always | High |
| Partial match returns the record | If partial / fuzzy matching is supported | High |
| No match returns empty result with appropriate message | Always | Medium |
| Empty query — return all records or prompt | Always | Medium |
| Special characters in query do not break the search | Always | Medium |
| Case sensitivity behaviour matches spec | Always | Medium |

**Export / Download**

| TC type | When to generate | Priority |
|---|---|---|
| Export with data — file downloads with correct format | Always | High |
| Export with empty result set — file format still valid | Always | Medium |
| Export respects active filters | When filters are in scope | High |
| Unauthorized user attempts export | When access control applies | High |

**Bulk operations**

| TC type | When to generate | Priority |
|---|---|---|
| Bulk select all — verify count and selection state | When bulk select is in scope | High |
| Bulk action on full selection — happy path | When bulk action is in scope | High |
| Bulk action with no selection — disabled or appropriate error | When bulk action is in scope | Medium |
| Bulk action partial failure — some succeed, some fail, summary reported | When bulk action could fail per-row | High |
| Bulk action authorization — unauthorized user blocked or partial success per-row | When access control applies | High |

**Multi-tenancy** (entities scoped to a tenant boundary, per the project's multi-tenancy ADR)

| TC type | When to generate | Priority |
|---|---|---|
| Tenant A user cannot read Tenant B's record | Always for tenant-scoped entities | High |
| Tenant A user cannot edit / delete Tenant B's record | Always for tenant-scoped entities | High |
| Cross-tenant duplicate is allowed — same value in Tenant A and Tenant B does not collide | Always for tenant-scoped entities with unique fields | High |
| Host-level user accessing tenant data — behaviour matches access policy | When host vs tenant boundaries are in scope | Medium |

**Session / authentication lifecycle**

| TC type | When to generate | Priority |
|---|---|---|
| Action while session is active — succeeds | Always (covered by happy path) | High |
| Action while session is expired — redirected to login or rejected | Always | High |
| Session expires DURING an in-flight action — graceful handling | When the operation has a non-trivial duration | High |
| Concurrent session limit — second login behaviour matches policy | When concurrent-session policy is in scope | Medium |
| Insufficient role / permission — request rejected with appropriate error | Always when access control applies | High |

---

The FRS or canonical nodes (existing or `proposed`) may add scenarios beyond
these — emit those too. But don't skip a matrix entry whose conditions apply
by saying "the FRS doesn't mention it" — the matrix is what the source leaves implicit.

---

## Integration

- **Required before:** [`../../CLAUDE.md ## Hard rules`](../../CLAUDE.md#hard-rules)
  — "Existing nodes are authoritative" governs precedence between
  FRS / FLW scenarios and matrix rows when both apply.
- **Required before:** [`plan.md → Test plan ingest`](plan.md#test-plan-ingest-after-fs-validation)
  — Phase 2 caller; this matrix is consulted during test-plan ingest.
- **Caller:** [`plan.md`](plan.md) — Phase 2 test-plan ingest reads
  this file per use case the FS exercises.
- **Adjacent (not callers but consulted):**
  [`test-data-generation.md`](test-data-generation.md) — once a TC is
  emitted, this file's sibling generates the values;
  [`test-runner-cookbook.md`](test-runner-cookbook.md) — Phase 3
  codegen consumes the matrix-emitted TC files;
  [`frs-validation-rules.md`](frs-validation-rules.md) — a bundling
  finding may force an FRS split that changes which matrix tables
  apply to which FRS.
- **Sibling rule books:**
  [`test-data-generation.md`](test-data-generation.md),
  [`test-runner-cookbook.md`](test-runner-cookbook.md),
  [`frs-validation-rules.md`](frs-validation-rules.md).
