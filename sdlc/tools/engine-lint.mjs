#!/usr/bin/env node
// engine-lint — mechanical drift scanner for the sdlc/ engine surfaces.
//
// Spec sources (the checks mechanize what these files specify in prose):
//   sdlc/workflow/cross-ref-guard.md  — audit recipe; GFM anchor rules (C1–C3)
//   sdlc/workflow/lint.md             — report-line format; detection-not-gating doctrine
//   sdlc/BOUNDARY.md                  — stack/framework enums (parsed at runtime, never copied)
//   sdlc/standards/index.md           — STD status enum + frontmatter conventions (C4)
//   REVIEW-SDLC-REPORT.md Rec-02      — check inventory
//
// Scope: ENGINE files only, plus one opt-in docs/ check: CW1 wiki-link
// resolution (--check-wiki-links; spec: sdlc/KB-LAYOUT.md § Wiki-link
// syntax). The five judgment-routed KB debt classes in lint.md
// (orphan-node, stale-proposed, baseline-not-cited, stale-version-ref,
// index-entry-missing) remain a manual, OQ-routed operation by doctrine
// and are NOT implemented here; wiki-link-unresolvable's judgment half
// (forward references) also stays manual.
//
// Zero dependencies. Node >= 18. Exit 0 = clean, 1 = error findings
// (--strict promotes warns to errors). Detection only — never edits files.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const STRICT = process.argv.includes('--strict');

const findings = []; // {check, sev:'error'|'warn', file, line, detail}
const notices = []; // deliberately-skipped surface — logged, never silent
const add = (check, sev, file, line, detail) =>
  findings.push({ check, sev, file: path.relative(REPO, file).replaceAll('\\', '/'), line, detail });

// ---------- file collection ----------

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

const surface = [
  ...walk(path.join(REPO, 'sdlc')),
  path.join(REPO, 'CLAUDE.md'),
  path.join(REPO, 'README.md'),
  ...(fs.existsSync(path.join(REPO, '.claude', 'commands'))
    ? walk(path.join(REPO, '.claude', 'commands'))
    : []),
].filter(fs.existsSync);

const isTemplate = (f) => path.relative(REPO, f).replaceAll('\\', '/').startsWith('sdlc/_templates/');
// CRLF normalized once — every downstream regex/startsWith assumes \n
const raw = new Map(surface.map((f) => [f, fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')]));

// ---------- scrubbing (index/line preserving: replaced spans become spaces) ----------

const blank = (s) => s.replace(/[^\n]/g, ' ');

function scrubFences(text) {
  const lines = text.split('\n');
  let inFence = false;
  return lines
    .map((l) => {
      const fence = /^\s*(```|~~~)/.test(l);
      if (fence) { inFence = !inFence; return blank(l); }
      return inFence ? blank(l) : l;
    })
    .join('\n');
}

const scrubInlineCode = (t) => t.replace(/``[^`]*``|`[^`\n]*`/g, blank);
const scrubHtmlComments = (t) => t.replace(/<!--[\s\S]*?-->/g, blank);

// scrubbed = fences + html comments + inline code removed; same length as raw
const scrubbed = new Map(
  [...raw].map(([f, t]) => [f, scrubInlineCode(scrubHtmlComments(scrubFences(t)))])
);
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

// ---------- GFM anchors (cross-ref-guard.md § audit recipe step 2) ----------
// HTML-comment/tag strip -> lowercase -> drop all chars except letters,
// numbers, space, '-', '_' -> spaces become '-'. Em-dash gotcha preserved:
// "a — b" -> "a--b" (dash drops, both surrounding spaces become hyphens).
// Duplicate headings get -1, -2 … suffixes (GitHub behavior).

function anchorsOf(file) {
  // anchor targets may live outside the scan surface (e.g. docs/ files
  // linked from sdlc/ once a project KB exists) — read those from disk
  const content = raw.get(file) ?? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const text = scrubFences(content); // keep inline code: backtick chars drop in slug, inner text survives
  const seen = new Map();
  const set = new Set();
  for (const m of text.matchAll(/^#{1,6}[ \t]+(.+)$/gm)) {
    let s = m[1].replace(/<!--[\s\S]*?-->/g, '');
    // GitHub slugs the RENDERED text: code-span content is literal
    // (`ILogger<T>` keeps its T) while raw <tags> outside code spans strip.
    s = s.replace(/`([^`]*)`/g, (_, inner) => inner.replaceAll('<', '').replaceAll('>', ''));
    s = s.replace(/<[^>]*>/g, '').trim().toLowerCase();
    let slug = '';
    for (const ch of s) {
      if (/[\p{L}\p{N}_-]/u.test(ch)) slug += ch;
      else if (ch === ' ' || ch === '\t') slug += '-';
    }
    const n = seen.get(slug) ?? 0;
    seen.set(slug, n + 1);
    set.add(n === 0 ? slug : `${slug}-${n}`);
  }
  return set;
}
const anchorCache = new Map();
const anchors = (f) => anchorCache.get(f) ?? anchorCache.set(f, anchorsOf(f)).get(f);

// ---------- minimal frontmatter parser (flat keys + one nesting level + [a, b] lists) ----------

function frontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---', 4);
  if (end === -1) return null;
  const fm = {};
  let parent = null;
  for (const lineRaw of text.slice(4, end).split('\n')) {
    if (!lineRaw.trim() || lineRaw.trim().startsWith('#')) continue;
    const indented = /^\s+\S/.test(lineRaw);
    const m = lineRaw.trim().match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, valRaw] = m;
    let val = valRaw.replace(/\s+#.*$/, '').trim().replace(/^["']|["']$/g, '');
    if (val.startsWith('[')) val = val.replace(/^\[|\]$/g, '').split(',').map((s) => s.trim()).filter(Boolean);
    if (indented && parent) fm[parent][key] = val;
    else if (val === '' || val === null) { fm[key] = {}; parent = key; }
    else { fm[key] = val; parent = null; }
  }
  return fm;
}

// ---------- BOUNDARY.md enum extraction (single canonical home — no copies here) ----------

function boundaryEnum(sectionTitle) {
  const text = raw.get(path.join(REPO, 'sdlc', 'BOUNDARY.md'));
  const start = text.indexOf(`## ${sectionTitle}`);
  if (start === -1) throw new Error(`BOUNDARY.md section not found: ${sectionTitle}`);
  const rest = text.slice(start + 3);
  const end = rest.search(/\n## /);
  const section = end === -1 ? rest : rest.slice(0, end);
  const vals = [...section.matchAll(/^- \*\*`([a-z0-9-]+)`\*\*/gm)].map((m) => m[1]);
  if (vals.length === 0) throw new Error(`BOUNDARY.md enum parse returned empty for: ${sectionTitle}`);
  return new Set(vals);
}
const STACK_ENUM = boundaryEnum('Stack axis (frontmatter enum)');
const FW_ENUM = boundaryEnum('Framework axis (frontmatter enum)');
// STD status enum per sdlc/standards/index.md § Conventions
const STD_STATUS = new Set(['proposed', 'accepted', 'deferred', 'deprecated', 'superseded']);

// ---------- C1 link-resolve + C2 anchor-resolve ----------

const LINK_RE = /\[((?:[^\]\\]|\\[^\n])*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;

let docsSlotSkips = 0;
for (const file of surface) {
  if (isTemplate(file)) continue; // template links are instantiation-relative by design
  const text = scrubbed.get(file);
  for (const m of text.matchAll(LINK_RE)) {
    const target = m[2];
    const line = lineOf(text, m.index);
    if (/^(https?:|mailto:|tel:)/i.test(target)) continue;
    const [p, frag] = target.split('#');
    let resolved;
    if (p === '') resolved = file; // same-file anchor
    else {
      resolved = p.startsWith('/') ? path.join(REPO, p) : path.resolve(path.dirname(file), decodeURIComponent(p));
      if (!fs.existsSync(resolved)) {
        // Project-slot links: the engine prescribes docs/ paths the project
        // lazy-creates (SETUP.md steps 3/6/7). docs/ absent => skip; docs/
        // present but target missing => warn (lazy creation makes absence
        // legitimate; cross-ref-guard.md slot-vs-load-bearing distinction
        // is not mechanically decidable).
        const rel = path.relative(REPO, resolved).replaceAll('\\', '/');
        if (rel.startsWith('docs/')) {
          if (fs.existsSync(path.join(REPO, 'docs')))
            add('C1-link', 'warn', file, line, `project-slot target missing: ${target}`);
          else docsSlotSkips++;
          continue;
        }
        add('C1-link', 'error', file, line, `target does not exist: ${target}`);
        continue;
      }
    }
    if (frag !== undefined && resolved.endsWith('.md') && fs.existsSync(resolved)) {
      const targetAnchors = raw.has(resolved) ? anchors(resolved) : anchorsOf(resolved);
      if (!targetAnchors.has(decodeURIComponent(frag).toLowerCase()))
        add('C2-anchor', 'error', file, line, `#${frag} not a heading anchor in ${path.basename(resolved)}`);
    }
  }
}
notices.push('C1/C2: sdlc/_templates/** exempt — template links resolve from instantiation site, not the template');
if (docsSlotSkips) notices.push(`C1: ${docsSlotSkips} links into docs/ skipped — docs/ does not exist in this workspace (project-slot links)`);

// ---------- C3 STD-cite existence ----------

const stdFiles = fs.readdirSync(path.join(REPO, 'sdlc', 'standards')).filter((f) => /^STD-\d{3}-.+\.md$/.test(f));
const stdIds = new Set(stdFiles.map((f) => f.match(/^(STD-\d{3})/)[1]));

for (const file of surface) {
  const text = scrubbed.get(file);
  for (const m of text.matchAll(/\bSTD-(\d{3})\b/g)) {
    if (!stdIds.has(`STD-${m[1]}`))
      add('C3-std-cite', 'error', file, lineOf(text, m.index), `STD-${m[1]} cited but no sdlc/standards/STD-${m[1]}-*.md exists`);
  }
}
if (!fs.existsSync(path.join(REPO, 'docs'))) {
  notices.push('C3: project-ID classes (ADR/CCC/FRS/FS/CHG/TC/OQ, node IDs) skipped — docs/ does not exist in this workspace');
}

// ---------- C4 frontmatter contracts ----------

for (const fname of stdFiles) {
  const file = path.join(REPO, 'sdlc', 'standards', fname);
  const fm = frontmatter(raw.get(file));
  if (!fm) { add('C4-frontmatter', 'error', file, 1, 'no frontmatter block'); continue; }
  for (const req of ['id', 'title', 'status', 'created', 'scope', 'applies_when'])
    if (!(req in fm)) add('C4-frontmatter', 'error', file, 1, `missing required field: ${req}`);
  if (fm.id && !fname.startsWith(`${fm.id}-`)) add('C4-frontmatter', 'error', file, 1, `id ${fm.id} does not match filename`);
  if (fm.status && !STD_STATUS.has(fm.status)) add('C4-frontmatter', 'error', file, 1, `status "${fm.status}" not in standards/index.md enum`);
  if (fm.status === 'deferred')
    for (const req of ['deferred_until', 'operative_source'])
      if (!(req in fm)) add('C4-frontmatter', 'error', file, 1, `status: deferred requires ${req}: (standards/index.md § Conventions)`);
  const stack = fm.applies_when?.stack ?? [];
  for (const v of Array.isArray(stack) ? stack : [stack])
    if (v && !STACK_ENUM.has(v)) add('C4-frontmatter', 'error', file, 1, `applies_when.stack "${v}" not in BOUNDARY.md stack enum`);
  const fw = fm.applies_when?.framework ?? [];
  for (const v of Array.isArray(fw) ? fw : [fw])
    if (v && !FW_ENUM.has(v)) add('C4-frontmatter', 'error', file, 1, `applies_when.framework "${v}" not in BOUNDARY.md framework enum`);
}

for (const file of walk(path.join(REPO, 'sdlc', 'workflow'))) {
  const fm = frontmatter(raw.get(file));
  const stack = fm?.applies_when?.stack;
  if (!stack || (Array.isArray(stack) && stack.length === 0))
    add('C4-frontmatter', 'error', file, 1, 'workflow file missing applies_when.stack (BOUNDARY.md § Stack axis)');
  else
    for (const v of Array.isArray(stack) ? stack : [stack])
      if (!STACK_ENUM.has(v)) add('C4-frontmatter', 'error', file, 1, `applies_when.stack "${v}" not in BOUNDARY.md stack enum`);
}

// ---------- C5 index coverage ----------

function indexTargets(indexFile) {
  const out = new Set();
  for (const m of scrubbed.get(indexFile).matchAll(LINK_RE)) out.add(path.basename(m[2].split('#')[0]));
  return out;
}

const wfDir = path.join(REPO, 'sdlc', 'workflow');
const wfIndex = path.join(wfDir, 'index.md');
const wfTargets = indexTargets(wfIndex);
for (const e of fs.readdirSync(wfDir, { withFileTypes: true })) {
  if (e.isDirectory()) { notices.push(`C5: workflow subdirectory ${e.name}/ not index-coverage-checked (direct children only)`); continue; }
  if (!e.name.endsWith('.md') || e.name === 'index.md') continue;
  if (!wfTargets.has(e.name)) add('C5-index', 'error', path.join(wfDir, e.name), 1, 'no link from sdlc/workflow/index.md');
}

const stdIndexTargets = indexTargets(path.join(REPO, 'sdlc', 'standards', 'index.md'));
for (const fname of stdFiles)
  if (!stdIndexTargets.has(fname)) add('C5-index', 'error', path.join(REPO, 'sdlc', 'standards', fname), 1, 'no row link in sdlc/standards/index.md');

const blDir = path.join(REPO, 'sdlc', 'standards', 'by-layer');
if (fs.existsSync(blDir)) {
  const blTargets = indexTargets(path.join(blDir, 'index.md'));
  for (const f of fs.readdirSync(blDir))
    if (f.endsWith('.md') && f !== 'index.md' && !blTargets.has(f))
      add('C5-index', 'error', path.join(blDir, f), 1, 'no link from by-layer/index.md');
}

// "16-type catalog" count claims vs actual template count (F-001 drift class)
const nodeTemplateCount = fs.readdirSync(path.join(REPO, 'sdlc', '_templates', 'nodes')).filter((f) => f.endsWith('.md')).length;
const APPEND_ONLY = new Set([path.join(REPO, 'sdlc', 'standards', 'log.md')]); // historical entries state period-true counts
for (const file of surface) {
  if (APPEND_ONLY.has(file)) continue;
  const text = scrubbed.get(file);
  for (const m of text.matchAll(/\b(\d+)-type catalog\b/g))
    if (Number(m[1]) !== nodeTemplateCount)
      add('C5-index', 'error', file, lineOf(text, m.index), `claims ${m[1]}-type catalog; _templates/nodes/ has ${nodeTemplateCount} templates`);
}

// ---------- C6 derived-view staleness (warn) ----------
// Derived views regenerated by hand drift behind their upstreams (the
// WORKFLOW-GRAPH.md failure mode, review finding F-G01..G07).

const DERIVED = { 'sdlc/WORKFLOW-GRAPH.md': ['sdlc/WORKFLOW.md', 'sdlc/workflow/index.md'] };
for (const [view, upstreams] of Object.entries(DERIVED)) {
  const viewPath = path.join(REPO, view);
  if (!fs.existsSync(viewPath)) continue;
  const m = fs.readFileSync(viewPath, 'utf8').match(/last_updated:\s*(\d{4}-\d{2}-\d{2})/);
  if (!m) { add('C6-staleness', 'warn', viewPath, 1, 'derived view has no last_updated: marker'); continue; }
  for (const up of upstreams) {
    try {
      const d = execSync(`git log -1 --format=%cs -- "${up}"`, { cwd: REPO, encoding: 'utf8' }).trim();
      if (d && d > m[1])
        add('C6-staleness', 'warn', viewPath, 1, `last_updated ${m[1]} older than ${up} last commit ${d}`);
    } catch { notices.push(`C6: git unavailable — staleness check skipped for ${view}`); break; }
  }
}

// ---------- C7 grandfather-registry sync (warn) ----------

const registryFile = path.join(REPO, 'sdlc', 'workflow', 'grandfather-registry.md');
const registryDates = new Set([...raw.get(registryFile).matchAll(/^\|\s*\d+\s*\|\s*(\d{4}-\d{2}-\d{2})/gm)].map((m) => m[1]));
const C7_EXEMPT = new Set(
  ['sdlc/workflow/grandfather-registry.md', 'sdlc/workflow/rule-history.md', 'sdlc/standards/log.md'].map((p) => path.join(REPO, p))
);
for (const file of surface) {
  if (C7_EXEMPT.has(file)) continue;
  const text = scrubbed.get(file);
  text.split('\n').forEach((l, i) => {
    if (!/grandfather/i.test(l)) return;
    for (const dm of l.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g))
      if (!registryDates.has(dm[1]))
        add('C7-registry', 'warn', file, i + 1, `grandfather clause dated ${dm[1]} has no grandfather-registry.md row`);
  });
}

// ---------- CW1 docs/ wiki-link resolution (opt-in: --check-wiki-links) ----------
// Mechanical twin of lint.md's `wiki-link-unresolvable` manual debt class.
// Convention spec: sdlc/KB-LAYOUT.md § Wiki-link syntax (docs/ only).
// Off by default — docs/ may legitimately not exist (lazy-created KB) and
// unresolvable links can be forward references; the manual class carries
// the judgment half. Resolution is structural (glob docs/** for
// <PREFIX>-NNN*.md), never index-mediated.

const CHECK_WIKI = process.argv.includes('--check-wiki-links');
const docsDir = path.join(REPO, 'docs');
if (!CHECK_WIKI) {
  notices.push('CW1: docs/ wiki-link resolution requires --check-wiki-links (off by default)');
} else if (!fs.existsSync(docsDir)) {
  notices.push('CW1: --check-wiki-links set but docs/ does not exist — nothing to scan');
} else {
  const docsFiles = walk(docsDir);
  // basename stem -> full path(s); a wiki ID resolves when exactly one stem is `${id}` or starts with `${id}-`
  const resolveId = (id) => docsFiles.filter((p) => {
    const b = path.basename(p, '.md');
    return b === id || b.startsWith(`${id}-`);
  });
  const WIKI_RE = /\[\[([^\]|#\n]+)(?:#([^\]|\n]+))?(?:\|([^\]\n]+))?\]\]/g;
  const ID_RE = /^(?:[A-Za-z]+-\d+|PROTO-[A-Za-z0-9][A-Za-z0-9-]*)$/;
  for (const file of docsFiles) {
    const text = scrubFences(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
    for (const m of text.matchAll(WIKI_RE)) {
      const [, id, frag] = m;
      const line = lineOf(text, m.index);
      if (!ID_RE.test(id.trim())) {
        add('CW1-wiki', 'error', file, line, `[[${id}]] is not a valid ID form (KB-LAYOUT.md § Wiki-link syntax)`);
        continue;
      }
      const hits = resolveId(id.trim());
      if (hits.length === 0) { add('CW1-wiki', 'error', file, line, `[[${id.trim()}]] resolves to no file under docs/`); continue; }
      if (hits.length > 1) { add('CW1-wiki', 'error', file, line, `[[${id.trim()}]] is ambiguous — ${hits.length} matches under docs/`); continue; }
      if (frag !== undefined && !anchorsOf(hits[0]).has(decodeURIComponent(frag).toLowerCase()))
        add('CW1-wiki', 'error', file, line, `#${frag} not a heading anchor in ${path.basename(hits[0])}`);
    }
  }
}

// ---------- report (format per lint.md § Output format) ----------

findings.sort((a, b) => a.check.localeCompare(b.check) || a.file.localeCompare(b.file) || a.line - b.line);
for (const f of findings) console.log(`${f.check.padEnd(14)} | ${f.sev.padEnd(5)} | ${f.file}:${f.line} | ${f.detail}`);
if (findings.length) console.log('');
for (const n of notices) console.log(`notice         |       | ${n}`);

const errors = findings.filter((f) => f.sev === 'error').length;
const warns = findings.length - errors;
console.log(`\nengine-lint — ${new Date().toLocaleDateString('sv')} | files scanned: ${surface.length} | errors: ${errors} | warns: ${warns}${STRICT ? ' (strict)' : ''}`);
process.exit(errors || (STRICT && warns) ? 1 : 0);
