#!/usr/bin/env node
// rewrite-legacy-wikilinks — repairs name-form wiki links left by legacy
// absorption, e.g. [[CMD-ActivateAccountWhitelist]] -> [[CMD-001]].
//
// Spec: sdlc/KB-LAYOUT.md § Wiki-link syntax (valid form is <PREFIX>-NNN) and
// sdlc/workflow/lint.md `wiki-link-unresolvable` action (a). Resolution is
// structural, like CW1: the name part is kebab-cased and matched against the
// slug of exactly one <PREFIX>-NNN-<slug>.md under the scanned tree. Zero or
// several matches -> left untouched and reported. Anchors (#x) and labels
// (|y) are preserved. Aliases: FLOW -> FLW, STATE -> STA.
//
// Scope: docs/<component>/nodes/** (index.md / log.md skipped). Body wiki
// links are display-only (no `related:` touch) and a link repair changes no
// semantics, so no version bump (node-versioning.md "pure formatting").
//
// Usage: node sdlc/tools/rewrite-legacy-wikilinks.mjs [--write] [--verbose] [--root <dir>]
// Default is a dry run. Zero dependencies. Node >= 18. Preserves BOM / CRLF.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const WRITE = process.argv.includes('--write');
const rootArg = process.argv.indexOf('--root');
const ROOT = rootArg > -1 ? path.resolve(process.argv[rootArg + 1]) : path.join(REPO, 'docs', 'app', 'nodes');
const ALIAS = { FLOW: 'FLW', STATE: 'STA' };
const VERBOSE = process.argv.includes('--verbose');
const seen = new Map();

const walk = (d, o = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, o);
    else if (e.name.endsWith('.md') && e.name !== 'index.md' && e.name !== 'log.md') o.push(p);
  }
  return o;
};
const files = walk(ROOT);

// "<PREFIX>:<slug>" -> [ID, ...]
const bySlug = new Map();
for (const f of files) {
  const m = path.basename(f, '.md').match(/^([A-Z]+)-(\d+)-(.+)$/);
  if (!m) continue;
  const k = `${m[1]}:${m[3]}`;
  bySlug.set(k, [...(bySlug.get(k) ?? []), `${m[1]}-${m[2]}`]);
}
const kebab = (s) => s
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
  .toLowerCase();

const WIKI_RE = /\[\[([^\]|#\n]+)((?:#[^\]|\n]+)?(?:\|[^\]\n]+)?)\]\]/g;
const ID_RE = /^[A-Za-z]+-\d+$/;
let scanned = 0, fixed = 0, filesChanged = 0;
const unresolved = new Map();

for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  let n = 0;
  const out = text.replace(WIKI_RE, (whole, target, tail) => {
    const t = target.trim();
    if (ID_RE.test(t)) return whole;
    scanned++;
    const m = t.split('/').pop().match(/^([A-Z]+)-(.+)$/);
    const hits = m ? bySlug.get(`${ALIAS[m[1]] ?? m[1]}:${kebab(m[2])}`) ?? [] : [];
    if (hits.length !== 1) {
      const why = hits.length ? 'ambiguous' : 'no match';
      unresolved.set(`${t} (${why})`, (unresolved.get(`${t} (${why})`) ?? 0) + 1);
      return whole;
    }
    n++;
    if (VERBOSE) seen.set(t, hits[0]);
    return `[[${hits[0]}${tail}]]`;
  });
  if (n) {
    fixed += n; filesChanged++;
    if (WRITE) fs.writeFileSync(f, out, 'utf8');
  }
}

console.log(`${WRITE ? 'rewrote' : 'dry run — would rewrite'} ${fixed} of ${scanned} name-form links in ${filesChanged} files under ${path.relative(REPO, ROOT).replaceAll('\\', '/')}`);
const top = [...unresolved].sort((a, b) => b[1] - a[1]);
console.log(`unresolved: ${top.reduce((s, [, c]) => s + c, 0)} links, ${top.length} distinct targets`);
for (const [k, c] of top.slice(0, 20)) console.log(`  ${String(c).padStart(4)}  ${k}`);
if (VERBOSE) for (const [k, v] of [...seen].sort()) console.log(`  map  ${k} -> ${v}`);
