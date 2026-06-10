---
name: plan-process-flow
description: "Detail file of plan.md — Phase 2 Process Flow DOT graph. Load once at orientation when entering Phase 2 for the first time."
applies_when:
  stack: [agnostic]
---

# Process Flow — Phase 2 (generate-feat-spec)

> Detail file of [`plan.md`](../plan.md) (Phase 2 flow). Load once at
> orientation; the core file's Checklist and §6 gate carry the binding rules.

```dot
digraph plan_flow {
    rankdir=TB;
    node [fontname="Helvetica"];

    inputs    [shape=oval,  label="Validated FRSs\n+ touched/produced nodes\n+ ADRs"];
    ctxload   [shape=box,   label="Context loading\n(narrow-load only)"];
    idclaim   [shape=box,   label="ID-claim protocol"];

    subgraph cluster_interleave {
        label = "§3/§4/§5 interleave in practice";
        style = dashed;
        color = gray;
        fontsize = 10;
        fsauthor  [shape=box,   label="FS authoring\n+ new node ingest\n(canonical, status: proposed)"];
        chgemit   [shape=diamond, label="Any constituent FRS\ndeclared touches_nodes?"];
        chgnode   [shape=box,   label="Consume Phase-1-born\nCHG(s) via\nconsumes_chgs:\n+ enrich structurally"];
    }

    fsval     [shape=diamond, label="FS validation\n(zero Blockers/Majors)?"];

    out_fs    [shape=doublecircle, label="FS-NNN.md\n+ proposed nodes in canonical\n+ CHG (if any)"];
    qatrack   [shape=doublecircle, label="QA track\n(independent session)\n→ test-plan-ingest.md"];
    next      [shape=doublecircle, label="Phase 3 begins\n(after /clear)"];

    inputs -> ctxload;
    ctxload -> idclaim;
    idclaim -> fsauthor;
    fsauthor -> chgemit;
    chgemit -> chgnode [label="yes"];
    chgemit -> fsval   [label="no"];
    chgnode -> fsval;
    fsval -> fsauthor [label="fail — repair only flagged items"];
    fsval -> out_fs   [label="pass"];
    out_fs -> next    [label="/clear + load implementation.md"];
    out_fs -> qatrack [label="/clear (separate QA-track cadence)", style=dashed];
}
```

The FS-validation diamond is the **node ingest gate** — Phase 2 is not complete
until zero Blockers and zero Majors remain. Repair is surgical, not full re-draft.
Test plan ingest is in the QA track and runs in its own session after a separate
`/clear` — see [`CLAUDE.md ## Hard rules`](../../../CLAUDE.md#hard-rules)
(QA-track entry is a flow boundary; intra-track session-share only between `test-suite-codegen` ↔ `qa-gate`).
