---
description: Tag a checkpoint, start a `--no-commit --no-ff` merge of a source branch, then review the merged-but-uncommitted result for regressions and conflicts. Never commits. Runs on Sonnet; user-invoked only.
argument-hint: [source branch to merge] [path to git repo] (branch defaults to develop; repo defaults to current dir)
model: sonnet
disable-model-invocation: true
---

Create a backup checkpoint tag, start a paused (`--no-commit --no-ff`) merge of a source branch into the current branch, then review the merged result for regressions and conflicts. **Never commit** — the in-progress merge is left in place for the user to commit (or abort) manually.

**Arguments:** $ARGUMENTS
Parse as: first token = **source branch to merge** (default `develop`); the remainder = **path to git repo** (default current working directory). The repo may live *outside* this workspace; do not assume it equals the workspace root.

---

## Authorization note

Invoking this command authorizes exactly two mutating actions: creating the backup tag and starting the **paused** merge (`--no-commit --no-ff`). It does **not** authorize the commit. Per `CLAUDE.md` rule 11, committing the merge is a separate, explicit step the user takes afterward (e.g. the `commit-staged` command). This command never pushes, amends, or commits — regardless of how clean the review comes out.

## Procedure

1. **Resolve repo + source branch.**
   - Parse `$ARGUMENTS`: source branch (default `develop`), repo path (default current dir).
   - Run every git command against that repo — pass `-C "<repo>"` to git (e.g. `git -C "<repo>" status`) rather than relying on the shell's working directory. This avoids `cd` permission prompts and keeps the workspace dir intact.
   - Verify it is a git work tree: `git -C "<repo>" rev-parse --is-inside-work-tree`. If not, stop and report.
   - Verify the source branch exists: `git -C "<repo>" rev-parse --verify "<src>"`. If not, stop and report.
   - Capture the current branch: `git -C "<repo>" rev-parse --abbrev-ref HEAD`.

2. **Pre-flight safety — both checks must pass before any mutation.**
   - **Clean work tree:** `git -C "<repo>" status --short`. If there are staged or unstaged changes, **stop and ask** — never start a merge on top of uncommitted work (it tangles the user's changes with the merge and makes `--abort` lossy).
   - **No merge already in progress:** `git -C "<repo>" rev-parse -q --verify MERGE_HEAD` must *fail* (no output). If a merge is already in progress, stop and report — do not start a second one.

3. **Checkpoint tag.**
   - Compute the tag name: `backup/<current-branch>/merge-<source>-<today>` where `<today>` is the current date as `YYYY-MM-DD` (e.g. `backup/feat-bff/merge-develop-2026-06-05`).
   - Check it does not already exist: `git -C "<repo>" rev-parse -q --verify "refs/tags/<tag>"`. If it exists, stop and report — do **not** clobber an existing checkpoint.
   - Create it: `git -C "<repo>" tag "<tag>"`.

4. **Start the paused merge.**
   - `git -C "<repo>" merge "<src>" --no-commit --no-ff`.
   - A clean pause (exit 0, "Automatic merge went well; stopped before committing as requested") and conflicts (non-zero exit) are **both** expected outcomes. In either case, do **not** commit and do **not** auto-resolve conflicts.

5. **Review the merged result.** This is the review surface — what *would* be committed.
   - **Conflicts first:** `git -C "<repo>" diff --name-only --diff-filter=U` lists conflicted files. Read each one and its conflict hunks.
   - **Staged merge diff:** `git -C "<repo>" diff --cached` — the combined changes staged by the merge.
   - Read the diff critically and check for:
     - Logic errors, off-by-one, inverted conditions, broken control flow.
     - Removed/altered behavior that callers still depend on (signature changes, deleted branches, changed return shapes).
     - Debug leftovers: stray prints/logs, commented-out code, `TODO`/`FIXME` introduced, hard-coded secrets, credentials, tokens, or local paths.
     - Partial edits: a function changed in one place but not its call sites; an import added but unused or used but not imported.
     - Tests or types that the change would break.
     - Anything that looks accidentally pulled in (unrelated files, large binaries, lockfile churn that doesn't match the diff).
   - **Merge-specific caution:** a clean auto-merge is *not* proof of correctness. Git merges by line, not by meaning — review auto-merged regions for **semantic** conflicts (two sides that each merged cleanly but together change behavior, e.g. a renamed symbol on one side still referenced by the other).
   - If the repo has a fast lint/typecheck/test command and it is safe and quick to run, run it and factor the result in. If unsure, skip and say so.

6. **Report — there is no commit step.**
   - End with a one-line verdict: **clean** / **conflicts to resolve** / **concerns — do not commit**.
   - Report each concern and each conflict with `file:line` and a one-line explanation, ordered by severity.
   - State plainly that the merge is **staged and paused** (in-progress), and name the backup tag that was created.
   - Give the user their next-step options explicitly:
     - **Commit:** `git -C "<repo>" commit` (or the `commit-staged` command). Resolve any conflicts first.
     - **Bail out:** `git -C "<repo>" merge --abort` to restore the pre-merge state, and optionally `git -C "<repo>" tag -d "<tag>"` to drop the checkpoint.

## Guardrails

- **Never** commit, push, or amend. The paused merge is the deliverable's stopping point — leave it in place for the user.
- **Never** auto-resolve conflicts unless the user explicitly asks. Report them and stop.
- Never bypass hooks (`--no-verify`) or signing.
- If the pre-flight clean-tree check fails, **do not** start the merge — and do not create the tag either (no mutation until both pre-flight checks pass).
- If the diff is too large to review responsibly, say so and review what you can, flagging the parts you could not cover — do not rubber-stamp it.
- When in doubt about whether something is a regression or a real conflict, flag it.
