---
name: generate-test-suite
description: "Use when Stage 2 Code is complete and TC files exist under the FS's test-plans/ folder with selectors resolved — second flow of the QA track. Generates test spec files from TC markdown, one spec per use-case sub-folder, targeting tests/{test_dir}/<feature>/<use-case>.<ext>."
---

# Test Suite Codegen

Generates Playwright (or runner-equivalent) spec files from the Phase 2 TC markdown files for a given FS. This is the **second flow of the QA track** — runs in its own session after `implementation.md`'s Stage 2 Code is complete and the developer has resolved selectors against the real DOM. Independent of any prior `implementation.md` session. Each TC becomes one test case; each use-case sub-folder becomes one spec file. Spec files are disposable — regenerated end-to-end each run; hand edits are lost.

---

## When to Use

**Use when:** These are the **entry contract** for this QA-track flow — verify on disk before loading; do not rely on session state from a prior `implementation.md` run:
- Stage 2 Code is complete or substantially complete for the FS's Implementation tasks.
- TC files exist under `docs/milestones/M-NN-<slug>/specs/FS-NNN-<slug>/test-plans/<use-case>/` from Phase 2's Test plan ingest, and the FS's `test_plan_path:` frontmatter is set.
- The developer has run an explorer pass and replaced `(discovered by explorer)` selectors in each TC's Steps table with concrete CSS or role-based selectors.

**Do NOT use when:**
- Every interaction step in every TC still reads `(discovered by explorer)` — resolve selectors against the real DOM first, update the TC, then invoke this operation.
- TC files have not yet been authored (Phase 2 Test plan ingest is incomplete).

**Vs. sibling flows:** This is the second flow of the QA track. [`test-plan-ingest.md`](test-plan-ingest.md) (first flow) authors TCs; this file generates executable specs from them; [`qa-gate.md`](qa-gate.md) (third flow) runs the verification checklist and flips the FS to implemented.

---

## The Process

### Step 1: Resolve inputs

Collect the following before generating any file:

- **TC files** under the FS's `test-plans/` folder — one sub-folder per use-case, each containing one or more TC markdown files.
- **Runner config** (e.g., `playwright.config.ts`) — the `testDir` setting resolves to `{test_dir}`. If the config does not exist, this is the **one-time test runner bootstrap** moment: the first FS to reach Phase 3 scaffolds the `tests/` directory with the runner's config, package descriptor, `.gitignore`, and (optionally) a `tests/.env.example` for credential env vars. See [`test-runner-cookbook.md`](test-runner-cookbook.md) for the exact files. Add the bootstrap as an Implementation task in the FS rather than treating it as ambient work.
- **Environment variables:** `TEST_EMAIL`, `TEST_PASSWORD`, plus any feature-specific secrets the TC's Test Data declares. Sourced from `tests/.env` (gitignored) or the developer's shell — never hardcoded.

TCs where every interaction step is still `(discovered by explorer)` are flagged and skipped. The fix is to resolve the selectors against the real DOM, update the TC, and rerun codegen — not to invent a selector that looks plausible.

**Verify:** You can name the `test_plan_path:` value from the FS frontmatter, the `testDir` value from the runner config, and the count of TC files with at least one resolved selector.

### Step 2: Print resolution summary and wait for confirmation

Before writing any file, print the resolution summary:

```
─────────────────────────────────────────────────────────────
Test suite codegen — resolution summary
─────────────────────────────────────────────────────────────
test_plan_path:    {docs}/milestones/.../specs/FS-NNN/test-plans/
tests_dir:         tests/{test_dir}
feature_slug:      <feature>
target branch:     <current FS implementation branch>
spec files to emit: <N>
TCs skipped:       <M> (all-`(discovered by explorer)`)
─────────────────────────────────────────────────────────────
```

Wait for explicit "proceed" or a corrected value before writing any file. Silence, "looks good", or unrelated messages do not count as acknowledgment.

**On failure:** If a value is wrong (e.g., wrong `tests_dir`), accept the corrected value and reprint the summary before proceeding.

### Step 3: Generate spec files

Apply these rules for every TC file in scope:

- One test spec per use-case sub-folder (file name and extension per the cookbook).
- One test case per TC, in TC number order.
- Raw runner calls only — per the cookbook's code emission table. No page objects. No helper wrappers. No polling waits. No retry logic.
- Every step produces a code line or a `// TODO` — no silent drops.
- Every test has at least one `expect()`; if a TC has zero assertions emit `// TODO: no assertions found — add expected result to TC`.
- `createdRecords` array + `afterEach` block always present (even on read-only use cases — uniformity beats per-spec divergence).

Output target:

```
tests/{test_dir}/<feature>/<use-case>.<ext>
```

where `<feature>` matches the FS folder slug, `<use-case>` matches the kebab-case verb of the TC sub-folder, and `.<ext>` is the file extension defined by the test-runner cookbook (e.g. `.spec.ts` for Playwright).

**Branch strategy.** Phase 3 already runs on the FS's implementation branch. Spec files land on the same branch alongside production code — no `test/<feature-name>` sub-branching. No auto-commit, no auto-push. The developer reviews the generated specs, fills the `afterEach` TODO bodies, and commits alongside the cohort's code.

See [`test-runner-cookbook.md`](test-runner-cookbook.md) for the full action-inference table, code emission table, selector resolution, value substitution, auth/SSO patterns, and the spec file template.

**Verify:** Every TC maps to exactly one generated test case; no steps were silently dropped; every spec file has a `createdRecords` array and `afterEach` block.

**On failure:** If a step cannot be mapped (ambiguous action, missing selector), emit a `// TODO` with the raw step text — never invent a call.

### Step 4: Emit generation report

After writing all spec files, emit a summary table grouped by use-case sub-folder:

| Use-case | TC title | Steps | TODOs | Result |
|----------|----------|-------|-------|--------|
| `<use-case>` | `<TC title>` | N | M | ✅ generated / ⚠ skipped |

Surface any remaining TODOs (unresolved selectors, ambiguous step text) explicitly so the developer knows what to fill before committing.

---

## Integration

- **Triggered after:** [`implementation.md`](implementation.md) Stage 2 Code is complete. Runs in its own QA-track session — `/clear` between `implementation.md` exit and this flow.
- **Routes to:** [`qa-gate.md`](qa-gate.md) — load in a fresh QA-track session after the generation report is emitted. `/clear` between this flow and the QA gate.
- **Rule book:** [`test-runner-cookbook.md`](test-runner-cookbook.md) — action-inference table, code emission table, selector resolution, value substitution, auth/SSO patterns, and the full spec file template including the mandatory `createdRecords + afterEach` cleanup pattern.
- **Test data:** [`test-data-generation.md`](test-data-generation.md) — directive interpolation for TC Test Data fields.
