---
name: workflow-graph
description: "On-demand cross-phase Process Flow dot graph. Follow the pointer from WORKFLOW.md ## Integration only when orientation to the full pipeline is wanted; not auto-loaded."
---

# WORKFLOW-GRAPH.md — Process Flow

Cross-phase dot graph for the dev track and the QA track. Visual orientation
only — the graph names which flow file owns each step; it does not substitute
for opening that file. Per-flow procedure lives in
[`workflow/`](workflow/); always-loaded summary lives in
[`WORKFLOW.md`](WORKFLOW.md).

## Process Flow

```dot
digraph workflow_phases {
    rankdir=TB;
    node [fontname="Helvetica"];

    inputs    [shape=oval,  label="Inputs:\nraw requirements\n+ existing DDD nodes"];

    subgraph cluster_dev {
        label="Dev track";
        phase0    [shape=box,   label="Phase 0\nMilestone Scoping"];
        phase1    [shape=box,   label="Phase 1\nFRS + FLW\n+ CHG (if touches_nodes)\nAuthoring"];
        gate15    [shape=diamond, label="Phase 1.5\nValidation Gate?"];
        phase2    [shape=box,   label="Phase 2\nFS + Node Ingest\n+ CHG consumption"];
        fsval     [shape=diamond, label="FS validation?"];
        phase3a   [shape=box,   label="Phase 3\nMerge + Code"];
    }

    subgraph cluster_qa {
        label="QA track";
        style=dashed;
        phase2tp  [shape=box,   label="QA track\nTest plan ingest"];
        phase3b   [shape=box,   label="QA track\nTest suite codegen"];
        phase3c   [shape=box,   label="QA track\nQA Gate"];
    }

    out_ms        [shape=doublecircle, label="Milestone portal\n+ scope discovery"];
    out_frs       [shape=doublecircle, label="Validated FRSs\n+ proposed FLW\n+ draft CHG (if any)\n+ OQs"];
    out_fs        [shape=doublecircle, label="FS + proposed nodes\n+ consumed/enriched CHG\n(if any)"];
    out_tc        [shape=doublecircle, label="TC files staged"];
    out_impl_code [shape=doublecircle, label="Stage 2 Code complete\n(dev track exit)"];
    out_impl      [shape=doublecircle, label="Active canonical\n+ code + test specs\n+ FS implemented (after QA gate)"];

    inputs -> phase0;
    phase0 -> out_ms;
    phase0 -> phase1;
    phase1 -> gate15;
    gate15 -> phase1   [label="fail — revise FRS"];
    gate15 -> out_frs  [label="pass"];
    out_frs -> phase2  [label="/clear (context reset)"];
    phase2 -> fsval;
    fsval -> phase2    [label="fail — repair"];
    fsval -> out_fs    [label="pass"];
    out_fs -> phase2tp [label="/clear (QA track entry)"];
    out_fs -> phase3a  [label="/clear (context reset)"];
    phase2tp -> out_tc;
    out_tc -> phase3b;
    phase3a -> out_impl_code;
    out_impl_code -> phase3b [label="/clear (QA track entry)"];
    phase3b -> phase3c [label="/clear"];
    phase3c -> out_impl;
}
```

Steps `[shape=box]` are phase or flow work; gates `[shape=diamond]` are
non-skippable validation; terminal artifacts `[shape=doublecircle]` are the
durable outputs each phase or flow emits. The `/clear` labels mark canonical
`HARD-GATE` instances (see [`WORKFLOW.md`](WORKFLOW.md) HARD-GATE block);
QA-track flows are independent of the dev track. `/clear` between
`test-plan-ingest` ↔ `test-suite-codegen`; `test-suite-codegen` ↔ `qa-gate`
share a session per CLAUDE.md Rule 5.

The milestone is **the planning container**, top-down or retroactive — it
holds its discoveries, FRSs, and FSs under one path. Multiple FSs can be
generated from one milestone, each aggregating a subset of the milestone's
FRSs.

## Integration

**Parent:** [`WORKFLOW.md`](WORKFLOW.md) — phase-pipeline index.
**Pointed at from:** [`WORKFLOW.md ## Integration`](WORKFLOW.md#integration) and
[`WORKFLOW.md ### Router vs. reader discipline`](WORKFLOW.md#router-vs-reader-discipline) —
on-demand only.
