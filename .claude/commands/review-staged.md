---
description: Review the staged changes in a target git repo for regressions and report findings. Never commits. Runs on Sonnet; user-invoked only.
argument-hint: [path to git repo] (optional — defaults to current dir)
model: sonnet
disable-model-invocation: true
---

Review the staged changes in a git repository for regressions and report the findings. **Never commit** — this command is read-only with respect to repo history.

**Target repo:** $ARGUMENTS
(If empty, use the current working directory — but first confirm it is a git repo. The repo may live *outside* this workspace; do not assume it equals the workspace root.)

---

## Authorization note

This command is review-only. It does **not** commit, push, amend, or stage anything — regardless of how clean the review comes out. If the user wants the changes committed after reading the review, that is a separate, explicit authorization (e.g. the `commit-staged` command) per `CLAUDE.md` rule 11.

## Procedure

1. **Resolve the repo.**
   - Take the path from `$ARGUMENTS`; if empty, use the current directory.
   - The git repo path can differ from this workspace. Run every git command against that repo — pass `-C "<repo>"` to git (e.g. `git -C "<repo>" status`) rather than relying on the shell's working directory. This avoids `cd` permission prompts and keeps the workspace dir intact.
   - Verify it is a git work tree: `git -C "<repo>" rev-parse --is-inside-work-tree`. If not, stop and report.

2. **Inspect what is staged.**
   - `git -C "<repo>" status --short` — confirm there *are* staged changes. If nothing is staged, stop and tell the user; do not stage anything yourself.
   - `git -C "<repo>" diff --cached` — read the full staged diff. This is the review surface. Do **not** review unstaged changes as part of the verdict, but note them if they look related (a half-staged change is a regression risk worth flagging).

3. **Regression review.** Read the staged diff critically and check for:
   - Logic errors, off-by-one, inverted conditions, broken control flow.
   - Removed/altered behavior that callers still depend on (signature changes, deleted branches, changed return shapes).
   - Debug leftovers: stray prints/logs, commented-out code, `TODO`/`FIXME` introduced, hard-coded secrets, credentials, tokens, or local paths.
   - Partial edits: a function changed in one place but not its call sites; an import added but unused or used but not imported.
   - Tests or types that the change would break.
   - Anything that looks accidentally staged (unrelated files, large binaries, lockfile churn that doesn't match the diff).
   - If the repo has a fast lint/typecheck/test command and it is safe and quick to run, run it and factor the result in. If unsure, skip and say so.

4. **Report the findings.** This is the deliverable — there is no commit step.
   - **Clean** → say so plainly, and summarize what the staged changes do (so the user can confirm intent matches). Optionally suggest the `commit-staged` command as the next step, but do not run it.
   - **Concerns found** → report each concern with `file:line` and a one-line explanation, ordered by severity. Group into blocking vs. nice-to-fix where useful.
   - Either way, end with a one-line verdict: clean / minor concerns / do-not-commit.

## Guardrails

- **Never** commit, push, stage, amend, or otherwise mutate repo state. The only git commands you run are read-only inspection (`status`, `diff`, `log`, `show`, `rev-parse`, etc.).
- If the diff is too large to review responsibly, say so and review what you can, flagging the parts you could not cover — do not rubber-stamp it.
- When in doubt about whether something is a regression, flag it.
