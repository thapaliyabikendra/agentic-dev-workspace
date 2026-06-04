---
description: Emit a paste-ready session handover block (Task / Progress / Next step / Re-load first / Open threads) per CLAUDE.md § Session handover.
argument-hint: [optional focus/scope note]
---

Generate a session handover prompt so work can continue in a fresh session.

> **Canonical procedure:** `CLAUDE.md § Session handover` (already loaded as project memory — do not re-read). The contract below mirrors it; if they diverge, CLAUDE.md wins.

**Optional focus:** $ARGUMENTS
(If empty, capture the full session state. If set, bias Progress / Next step / Open threads toward this scope — but never drop a blocking thread just because it is off-scope.)

## Output contract — follow exactly

Emit **one fenced code block and nothing else** — no prose before or after. The user pastes it verbatim as the first prompt of the next session.

Inside the block use plain-text labels (`Task:`, `Progress:`, …), not markdown bold — code blocks do not render markdown, so `**` would paste literally.

The block contains exactly these five fields, in order:

1. **Task** — one sentence: what we're working on.
2. **Progress** — bullets: what's done this session (files created or edited, decisions reached, commands run that matter).
3. **Next step** — the exact first action for the new session.
4. **Re-load first** — ordered list of files to read at the start of the new session.
5. **Open threads** — unresolved questions, blocked work, disagreements; one empty bullet (`- none`) if there are none.

Do not add, rename, or reorder fields — the five above are canonical. Do not wrap the block in explanation.
