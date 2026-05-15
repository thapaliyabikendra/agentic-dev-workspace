#!/usr/bin/env bash
#
# check-version-bump.sh — Advisory check for the node-versioning bump rule.
#
# For every canonical DDD node file changed in the staged set (or in the
# diff between two refs), this script flags candidates where the body or
# cross-reference frontmatter changed but the `version:` integer did not
# bump. Used as a pre-commit advisory and as part of the manual lint
# pass — does NOT block commits, just surfaces likely misses for the
# author to review.
#
# Bump rule lives in `sdlc/workflow/maintenance-discipline.md`. See also
# the `stale-version-ref` debt class in `sdlc/workflow/lint.md`.
#
# Usage:
#   ./sdlc/scripts/check-version-bump.sh               # check staged changes
#   ./sdlc/scripts/check-version-bump.sh HEAD~1 HEAD   # check a diff range
#
# Exit code is non-zero only on internal errors; bump misses are
# reported as advisories. The script is meant to be run by a human or
# in CI as a soft warning.

set -euo pipefail

if [[ $# -eq 0 ]]; then
    diff_cmd="git diff --cached --name-only --diff-filter=AM"
    show_cmd_old() { git show ":$1" 2>/dev/null || true; }
    show_cmd_new() { cat "$1"; }
    label="staged"
elif [[ $# -eq 2 ]]; then
    diff_cmd="git diff --name-only --diff-filter=AM $1 $2"
    base="$1"
    head="$2"
    show_cmd_old() { git show "$base:$1" 2>/dev/null || true; }
    show_cmd_new() { git show "$head:$1" 2>/dev/null || true; }
    label="$base..$head"
else
    echo "usage: $0 [<base-ref> <head-ref>]" >&2
    exit 2
fi

extract_version() {
    awk '/^---/{fm=!fm; next} fm && $1=="version:" {gsub(/[^0-9]/,"",$2); print $2; exit}'
}

# A change is "version-relevant" (i.e., the bump rule should fire) if the
# body or the cross-reference frontmatter fields changed. Pure status
# flips, pure date updates, and pure formatting edits do not require a
# bump.
is_substantive_change() {
    local old_text="$1" new_text="$2"
    # Strip volatile metadata: status, updated, version, log-only lines.
    local strip_re='^(status|updated|version):'
    local o n
    o=$(printf '%s\n' "$old_text" | grep -vE "$strip_re" || true)
    n=$(printf '%s\n' "$new_text" | grep -vE "$strip_re" || true)
    if [[ "$o" == "$n" ]]; then
        return 1  # not substantive
    fi
    return 0  # substantive
}

misses=0
checked=0

while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    # Only canonical DDD node files. Skip indexes, logs, planning artifacts.
    if [[ ! "$f" =~ ^docs/nodes/[^/]+/[A-Z]+-[0-9]+ ]]; then
        continue
    fi
    if [[ "$f" =~ /index\.md$ || "$f" =~ /log\.md$ ]]; then
        continue
    fi

    old_text=$(show_cmd_old "$f")
    new_text=$(show_cmd_new "$f")

    [[ -z "$new_text" ]] && continue  # deleted

    checked=$((checked + 1))

    # If old version is empty (newly added file), no miss possible — first version is 1.
    old_version=$(printf '%s\n' "$old_text" | extract_version || true)
    new_version=$(printf '%s\n' "$new_text" | extract_version || true)

    if [[ -z "$old_text" ]]; then
        continue  # newly created file
    fi

    if [[ -z "$new_version" ]]; then
        echo "MISSING: $f has no version: field (add 'version: 1' to frontmatter)" >&2
        misses=$((misses + 1))
        continue
    fi

    if [[ -z "$old_version" ]]; then
        continue  # baseline didn't have it; new edit added; not a miss
    fi

    if is_substantive_change "$old_text" "$new_text"; then
        if [[ "$old_version" -ge "$new_version" ]]; then
            echo "BUMP_MISSING: $f — content changed but version stayed at $new_version (was $old_version)" >&2
            misses=$((misses + 1))
        fi
    fi
done < <(eval "$diff_cmd")

echo ""
if (( misses > 0 )); then
    echo "Advisory: $misses bump-rule miss(es) flagged across $checked node file(s) in $label." >&2
    echo "Review each — bump the version where the edit changed semantic content for a consumer." >&2
    echo "See sdlc/workflow/maintenance-discipline.md → Node versioning." >&2
else
    echo "ok: $checked node file(s) in $label respect the bump rule."
fi

exit 0
