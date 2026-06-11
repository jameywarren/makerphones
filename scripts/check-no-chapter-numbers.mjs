#!/usr/bin/env node
/**
 * Quality gate: no rendered page title or heading may contain
 * "Chapter N" or "Part N". Part/chapter labels are internal-only
 * (frontmatter), never visible copy.
 *
 * Scans dist/ HTML: <title> tags and <h1>–<h6> contents.
 * Run after `npm run build`. Exits 1 on any violation.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;
const PATTERN = /\b(Chapter|Part)\s+\d+\b/i;

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const violations = [];
let files;
try {
  files = await htmlFiles(DIST);
} catch {
  console.error(`No dist/ directory found at ${DIST} — run \`npm run build\` first.`);
  process.exit(1);
}

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const checks = [
    ...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi),
    ...html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi),
  ];
  for (const match of checks) {
    const text = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (PATTERN.test(text)) {
      violations.push({ file: file.replace(DIST + '/', ''), text });
    }
  }
}

if (violations.length > 0) {
  console.error('Quality gate FAILED — visible chapter/part numbers found:\n');
  for (const v of violations) console.error(`  ${v.file}: "${v.text}"`);
  process.exit(1);
}

console.log(`Quality gate passed — ${files.length} pages checked, no visible chapter/part numbers.`);
