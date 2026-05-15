#!/usr/bin/env bash
#
# regenerate-roadmap.sh — Advisory helper for the Roadmap derived report.
#
# Computes the five "stuck" signal classes (v3 Δ10) from frontmatter and
# file timestamps, and emits a draft `docs/ROADMAP.md` for the
# author to review and commit.
#
# Authoritative procedure: sdlc/workflow/regenerate-roadmap.md.
# Template: sdlc/_templates/OVERVIEW-ROADMAP.md.
#
# Usage (from workspace root):
#   ./sdlc/scripts/regenerate-roadmap.sh
#
# Output: prints to stdout. Pipe / redirect:
#   ./sdlc/scripts/regenerate-roadmap.sh > docs/ROADMAP.md

set -euo pipefail

today=$(date +%Y-%m-%d)
sha=$(git rev-parse --short HEAD 2>/dev/null || echo "filesystem-snapshot")

# Age in days from a YYYY-MM-DD date string to today.
age_days() {
    local d="${1:-}"
    if [[ -z "$d" ]]; then echo "?"; return; fi
    # Cross-platform date math via python (commonly available); fall back to coreutils on Linux.
    python -c "import datetime,sys; a=datetime.date.fromisoformat('$d'); print((datetime.date.today()-a).days)" 2>/dev/null \
        || date -d "$today - $d days ago" >/dev/null 2>&1 && echo "?" \
        || echo "?"
}

read_yaml_field() {
    local file="$1" field="$2"
    awk -v field="$field" '
        /^---/ { fm = !fm; next }
        fm && $1 == field":" {
            sub(/^[^:]+:[[:space:]]*/, "")
            gsub(/^[[:space:]]+|[[:space:]]+$/, "")
            print
            exit
        }
    ' "$file"
}

cat <<EOF
---
generated_at: $today
source_commit: $sha
audience: planning
---

# Project Overview — Roadmap

> **Derived report — draft from regenerate-roadmap.sh.** Review and
> commit alongside the work that motivated the regen. See
> [\`../sdlc/workflow/regenerate-roadmap.md\`](../sdlc/workflow/regenerate-roadmap.md).

EOF

# --- Stuck: Stale FRSs (≥30 days in draft or review) -----------------
echo "## Stuck"
echo ""
echo "### Stale FRSs (≥30 days in \`draft\` or \`review\`)"
echo ""
echo "| FRS | Milestone | Status | Last edit | Age (days) |"
echo "| --- | --------- | ------ | --------- | ---------- |"
found=0
for f in docs/milestones/M-*/frs/FRS-*.md; do
    [[ -f "$f" ]] || continue
    status=$(read_yaml_field "$f" status)
    if [[ "$status" == "draft" || "$status" == "review" ]]; then
        last_edit=$(date -r "$f" +%Y-%m-%d 2>/dev/null || stat -c %y "$f" 2>/dev/null | cut -d' ' -f1 || echo "?")
        age=$(age_days "$last_edit")
        if [[ "$age" =~ ^[0-9]+$ ]] && (( age >= 30 )); then
            frs_id=$(basename "$f" .md | sed 's/^\(FRS-[0-9]*\).*/\1/')
            milestone=$(echo "$f" | sed 's|.*/M-\([^/]*\)/.*|M-\1|')
            echo "| $frs_id | $milestone | $status | $last_edit | $age |"
            found=$((found+1))
        fi
    fi
done
[[ "$found" -eq 0 ]] && echo "| _none_ |  |  |  |  |"
echo ""

# --- Stuck: Stale OQs (≥60 days, no resolution_path) -----------------
echo "### Stale OQs (≥60 days with no resolution path declared)"
echo ""
echo "| OQ | Origin | Gate effect | Created | Age (days) |"
echo "| -- | ------ | ----------- | ------- | ---------- |"
found=0
for f in docs/discovery/open-questions/OQ-*.md; do
    [[ -f "$f" ]] || continue
    resolution=$(read_yaml_field "$f" resolution_path)
    created=$(read_yaml_field "$f" created)
    if [[ -z "$resolution" || "$resolution" == "null" || "$resolution" == "[]" ]]; then
        age=$(age_days "$created")
        if [[ "$age" =~ ^[0-9]+$ ]] && (( age >= 60 )); then
            oq=$(basename "$f" .md | sed 's/^\(OQ-[0-9]*\).*/\1/')
            origin=$(read_yaml_field "$f" origin)
            gate=$(read_yaml_field "$f" gate_effect)
            echo "| $oq | $origin | $gate | $created | $age |"
            found=$((found+1))
        fi
    fi
done
[[ "$found" -eq 0 ]] && echo "| _none_ |  |  |  |  |"
echo ""

# --- Stuck: Stalled milestones (≥90 days in-progress, no merged FS) --
echo "### Stalled milestones (≥90 days \`in-progress\` with no FS merged)"
echo ""
echo "| Milestone | Status | Started | Age (days) | Specs merged |"
echo "| --------- | ------ | ------- | ---------- | ------------ |"
found=0
for m in docs/milestones/M-*/M-*.md; do
    [[ -f "$m" ]] || continue
    status=$(read_yaml_field "$m" status)
    if [[ "$status" == "in-progress" ]]; then
        created=$(read_yaml_field "$m" created)
        age=$(age_days "$created")
        merged_count=0
        for fs in "$(dirname "$m")"/specs/FS-*/FS-*.md; do
            [[ -f "$fs" ]] || continue
            m_flag=$(read_yaml_field "$fs" merged)
            [[ "$m_flag" == "true" ]] && merged_count=$((merged_count+1))
        done
        if [[ "$age" =~ ^[0-9]+$ ]] && (( age >= 90 )) && (( merged_count == 0 )); then
            mid=$(basename "$m" .md | sed 's/^\(M-[0-9]*\).*/\1/')
            echo "| $mid | $status | $created | $age | $merged_count |"
            found=$((found+1))
        fi
    fi
done
[[ "$found" -eq 0 ]] && echo "| _none_ |  |  |  |  |"
echo ""

# --- Stuck: Stuck CHGs (≥14 days approved) ---------------------------
echo "### Stuck CHGs (≥14 days \`approved\`)"
echo ""
echo "| CHG | Status | Last edit | Age (days) |"
echo "| --- | ------ | --------- | ---------- |"
found=0
for c in docs/milestones/M-*/specs/FS-*/nodes/changes/CHG-*.md; do
    [[ -f "$c" ]] || continue
    status=$(read_yaml_field "$c" status)
    if [[ "$status" == "approved" ]]; then
        last_edit=$(date -r "$c" +%Y-%m-%d 2>/dev/null || stat -c %y "$c" 2>/dev/null | cut -d' ' -f1 || echo "?")
        age=$(age_days "$last_edit")
        if [[ "$age" =~ ^[0-9]+$ ]] && (( age >= 14 )); then
            chg=$(basename "$c" .md | sed 's/^\(CHG-[0-9]*\).*/\1/')
            echo "| $chg | $status | $last_edit | $age |"
            found=$((found+1))
        fi
    fi
done
[[ "$found" -eq 0 ]] && echo "| _none_ |  |  |  |  |"
echo ""

# --- Stuck: Blocked-by-OQ artifacts ----------------------------------
echo "### Blocked-by-OQ artifacts (FS with unresolvable blocking OQs)"
echo ""
echo "| FS | Blocking OQs |"
echo "| -- | ------------ |"
found=0
for fs in docs/milestones/M-*/specs/FS-*/FS-*.md; do
    [[ -f "$fs" ]] || continue
    # Pull OQ IDs cited in an "Open blockers" section (best-effort, grep-based).
    blockers=$(awk '/^## Open blockers/{p=1; next} p && /^## /{p=0} p' "$fs" \
        | grep -oE 'OQ-[0-9]+' | sort -u | tr '\n' ' ')
    if [[ -n "$blockers" ]]; then
        # Verify at least one cited OQ lacks resolution_path.
        unresolved=""
        for oq in $blockers; do
            oqf=$(ls docs/discovery/open-questions/${oq}-*.md 2>/dev/null | head -1)
            if [[ -n "$oqf" ]]; then
                rp=$(read_yaml_field "$oqf" resolution_path)
                if [[ -z "$rp" || "$rp" == "null" || "$rp" == "[]" ]]; then
                    unresolved="$unresolved $oq"
                fi
            fi
        done
        if [[ -n "$unresolved" ]]; then
            fs_id=$(basename "$fs" .md | sed 's/^\(FS-[0-9]*\).*/\1/')
            echo "| $fs_id |$unresolved |"
            found=$((found+1))
        fi
    fi
done
[[ "$found" -eq 0 ]] && echo "| _none_ |  |  |"
echo ""

cat <<'EOF'
---

## Milestones in flight

> Hand-fill from `docs/milestones/M-*/M-*.md` (status: planning | in-progress).
> Script only emits the Stuck section.

## FRSs in flight

> Hand-fill from each milestone's `frs/FRS-*.md` (non-implemented).

## Feature specs in flight

> Hand-fill from `milestones/M-*/specs/FS-*/FS-*.md` (merged: false).

## Shipped

> Hand-fill from milestones with `status: done`.

## Open questions (cross-feature)

> Hand-fill from `docs/discovery/open-questions/index.md` and the
> legacy `docs/discovery/open-questions.md`.
EOF
