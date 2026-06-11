#!/usr/bin/env node
/**
 * Quality gate — numbering rule (v2, post-design-integration):
 *
 *   - Chapter H1s and page <title>s stay clean: no "Chapter N" / "Part N".
 *   - Body prose and content headings: no "Chapter N" / "Part N" or
 *     part-references (cross-references are natural language).
 *   - NAV CHROME IS EXEMPT: sidebar, contents page, breadcrumb,
 *     prev/next, on-page TOC may show decimal numbers (1.1–6.4) and
 *     part labels. Chrome lives outside .sl-markdown-content (or in
 *     .mp-foot after it), so the scan covers the markdown body only.
 *
 * Known issues already tracked in CONTENT-TODO.md are allowlisted and
 * reported as warnings — the gate fails only on NEW violations.
 *
 * Run after `npm run build`. Exits 1 on any non-allowlisted violation.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;
const PATTERN = /\b(Chapter|Part)\s+\d+\b/i;

/** Landing/nav pages — entirely navigation chrome, not manual content. */
const SKIP = new Set(['index.html', 'contents/index.html', '404.html']);

/** Known violations tracked in CONTENT-TODO.md — warn, don't fail. */
const ALLOWLIST = new Set([
  // "You've now completed Part 2..." in the What's Next prose; queued
  // for the editorial pass (see CONTENT-TODO.md).
  'learn/cables-connectors-hardware/index.html',
]);

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const text = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const failures = [];
const warnings = [];

let files;
try {
  files = await htmlFiles(DIST);
} catch {
  console.error(`No dist/ at ${DIST} — run \`npm run build\` first.`);
  process.exit(1);
}

let checked = 0;
for (const file of files) {
  const rel = relative(DIST, file);
  if (SKIP.has(rel)) continue;
  checked++;
  const html = await readFile(file, 'utf8');
  const sink = ALLOWLIST.has(rel) ? warnings : failures;

  // 1. <title> and every <h1> must be clean — always a hard failure.
  for (const m of [
    ...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi),
    ...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi),
  ]) {
    const t = text(m[1]);
    if (PATTERN.test(t)) failures.push(`${rel} [title/h1]: "${t}"`);
  }

  // 2. Markdown body (content headings + prose). Chrome before
  //    .sl-markdown-content and the .mp-foot block after it are exempt.
  const start = html.indexOf('sl-markdown-content');
  if (start === -1) continue;
  let body = html.slice(start);
  const footAt = body.indexOf('class="mp-foot');
  if (footAt !== -1) body = body.slice(0, footAt);
  const endMain = body.indexOf('</main>');
  if (endMain !== -1) body = body.slice(0, endMain);

  const bodyText = text(body);
  const hit = bodyText.match(new RegExp(`.{0,60}${PATTERN.source}.{0,60}`, 'i'));
  if (hit) sink.push(`${rel} [body]: "…${hit[0].trim()}…"`);
}

for (const w of warnings)
  console.warn(`WARN (allowlisted, tracked in CONTENT-TODO.md): ${w}`);

if (failures.length > 0) {
  console.error('\nQuality gate FAILED — visible chapter/part numbers outside nav chrome:\n');
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log(
  `Quality gate passed — ${checked} pages checked (titles/H1s + body prose; nav chrome exempt), ${warnings.length} allowlisted warning(s).`
);
