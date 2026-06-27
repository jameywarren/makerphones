#!/usr/bin/env node
/**
 * Voice lint — catches "AI tells": prose that drifted from Jamey's workshop
 * voice into generic LLM cadence. Scans the source Markdown (not dist), so it
 * runs before build and can gate a chapter before it ships.
 *
 * Two tiers:
 *   HARD  — Style-Guide "don'ts" and content-free templates. Cut on sight.
 *           `--ci` makes the script exit 1 if any HARD hit survives.
 *   SOFT  — devices that are fine once but tic-y in aggregate (antithesis,
 *           aphoristic closers, recurring metaphors). Reported for review,
 *           never fails the build. The point is density, not any one line.
 *
 * Brand-sanctioned phrases (Content & Style Guide) are whitelisted so a single
 * blessed use never flags. The recurrence ledger at the end is the real signal:
 * a phrase in 2+ files is the generation fingerprint, even when each use reads
 * fine alone.
 *
 *   node scripts/voice-lint.mjs [--ci] [path ...]
 *
 * With no paths, scans src/content/docs. Exit 0 unless --ci + HARD hits.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DEFAULT_DIR = join(ROOT, 'src/content/docs');

// Phrases the Style Guide explicitly blesses — a single use is the voice, not a tell.
const WHITELIST = [
  /here'?s what i learned the hard way/i,
  /this is where it gets interesting/i,
  /won'?t be perfect/i,
  /here'?s the thing nobody tells you about driver selection/i,
];

// HARD: Style-Guide "don'ts" + content-free templates. Cut on sight.
const HARD = [
  // NB: "elevated" is excluded — it's correct audio terminology ("elevated bass"),
  // not the marketing "elevate". Match only the hype forms.
  { id: 'banned-word', re: /\b(simply|fundamentally|robust|revolutionary|game[- ]changing|seamless|leverage|unlock(?:s|ed|ing)?|elevate(?:s|ing)?|delve|cutting[- ]edge|industry[- ]leading)\b/i,
    note: 'banned hype/filler word' },
  { id: 'restated-conclusion', re: /\b(now that you (?:understand|know|have)|you'?re ready to learn|with this chapter|in this chapter we'?ll|in short|to sum up|the bottom line|at the end of the day)\b/i,
    note: 'restated-conclusion / academic wrap-up (Style Guide bans these)' },
  { id: 'signpost', re: /\b(let'?s (?:dive|break it down|get into|explore)|let me walk you through|let me show you|dive deeper|deep dive)\b/i,
    note: 'generic signpost — start with the claim instead' },
];

// SOFT: fine once, tic-y in aggregate. Report, never fail.
const SOFT = [
  { id: 'antithesis', re: /\b\w+,\s+not\s+(?:a |the |just |only |merely )?\w+/i,
    note: '"X, not Y" antithesis — keep only when "not Y" names a real mistake; thin structural uses' },
  { id: 'isnt-just', re: /\b(isn'?t just|not just|more than just|isn'?t (?:only|merely)|it'?s not about)\b/i,
    note: 'elevation reframe' },
  { id: 'aphorism-metaphor', re: /\b(the map|the territory|the compass|wiggly line|the rest(?:,| is) (?:as ever|as always|is) reps|best of both worlds|the whole game|the magic (?:is|lives|happens))\b/i,
    note: 'aphoristic/metaphor closer — dedupe verbatim recurrences corpus-wide' },
  { id: 'this-is-where', re: /\bthis is where\b/i,
    note: '"This is where ___" transition frame — keep the strongest, vary the rest' },
  { id: 'lexical-tic', re: /\b(earns its (?:keep|place)|pays off|the fun part|here'?s the thing|trust your ears|genuinely useful|for good reason|earn their keep|that actually matter)\b/i,
    note: 'recurring lexical tic' },
  { id: 'rule-of-three-opener', re: /^(?:Three|Two|Four) (?:things|reasons|ways|concrete)\b/,
    note: 'pre-announced count opener — vary the near-twin shapes' },
  { id: 'hollow-enthusiasm', re: /\b(where the magic|the clever part|the beauty (?:is|of)|the elegant part|here'?s the beautiful)\b/i,
    note: 'hollow enthusiasm — name the concrete thing instead' },
];

// Intensifiers: too common to list line-by-line; reported as a density count.
const INTENSIFIERS = /\b(actually|genuinely|incredibly|dramatically|significantly|really|truly|essentially)\b/gi;

function whitelisted(line, index) {
  // Suppress a match if it falls inside a sanctioned phrase on the same line.
  return WHITELIST.some((w) => {
    const m = line.match(w);
    if (!m) return false;
    const start = m.index ?? 0;
    return index >= start && index <= start + m[0].length;
  });
}

async function mdFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await mdFiles(full)));
    else if (/\.mdx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const args = process.argv.slice(2);
const ci = args.includes('--ci');
const asJson = args.includes('--json');
const paths = args.filter((a) => !a.startsWith('--'));

let files = [];
if (paths.length) files = paths.map((p) => (p.startsWith('/') ? p : join(process.cwd(), p)));
else files = await mdFiles(DEFAULT_DIR);
files.sort();

const recurrence = new Map(); // normalized phrase -> Set(file)
const perPattern = new Map(); // pattern id -> total count
let hardTotal = 0;
let intensifierTotal = 0;
const report = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const src = await readFile(file, 'utf8');
  const lines = src.split('\n');
  // Skip YAML frontmatter for prose checks (but keep real line numbers).
  let bodyStart = 0;
  if (lines[0] === '---') {
    const close = lines.indexOf('---', 1);
    if (close !== -1) bodyStart = close + 1;
  }

  const hits = [];
  for (let i = bodyStart; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('import ')) continue;
    for (const { id, re, note } of [...HARD, ...SOFT]) {
      const m = line.match(re);
      if (!m) continue;
      if (whitelisted(line, m.index ?? 0)) continue;
      const hard = HARD.some((h) => h.id === id);
      if (hard) hardTotal++;
      perPattern.set(id, (perPattern.get(id) || 0) + 1);
      const phrase = m[0].toLowerCase().trim();
      if (!recurrence.has(phrase)) recurrence.set(phrase, new Set());
      recurrence.get(phrase).add(rel);
      hits.push({ line: i + 1, id, hard, note, snippet: line.trim().slice(0, 110), match: m[0] });
    }
    const ints = line.match(INTENSIFIERS);
    if (ints) intensifierTotal += ints.length;
  }
  if (hits.length) report.push({ rel, hits });
}

// ---- Output ----
if (asJson) {
  const ledgerJson = [...recurrence.entries()]
    .map(([p, set]) => ({ phrase: p, files: [...set] }))
    .filter((x) => x.files.length >= 2)
    .sort((a, b) => b.files.length - a.files.length);
  process.stdout.write(JSON.stringify({ report, ledger: ledgerJson, perPattern: Object.fromEntries(perPattern), hardTotal, intensifierTotal }, null, 2));
  process.exit(0);
}
console.log(`\nVoice lint — ${files.length} files scanned\n${'='.repeat(60)}`);
for (const { rel, hits } of report) {
  const hard = hits.filter((h) => h.hard).length;
  console.log(`\n${rel}  (${hits.length} hits${hard ? `, ${hard} HARD` : ''})`);
  for (const h of hits.sort((a, b) => a.line - b.line)) {
    const tag = h.hard ? 'HARD' : 'soft';
    console.log(`  L${String(h.line).padEnd(4)} [${tag} ${h.id}]  "${h.match}"`);
  }
}

console.log(`\n${'='.repeat(60)}\nPATTERN TOTALS`);
for (const [id, n] of [...perPattern.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${id}`);
}
console.log(`  ${String(intensifierTotal).padStart(4)}  intensifier-density (count only)`);

console.log(`\nRECURRENCE LEDGER — phrases in 2+ files (the generation fingerprint)`);
const ledger = [...recurrence.entries()]
  .map(([p, set]) => ({ phrase: p, files: [...set] }))
  .filter((x) => x.files.length >= 2)
  .sort((a, b) => b.files.length - a.files.length);
for (const { phrase, files: fs } of ledger) {
  console.log(`  ${String(fs.length).padStart(2)}×  "${phrase}"`);
}

console.log(`\nSUMMARY: ${hardTotal} HARD, ${[...perPattern.values()].reduce((a, b) => a + b, 0) - hardTotal} soft, ${intensifierTotal} intensifiers across ${report.length} files.`);

if (ci && hardTotal > 0) {
  console.error(`\nFAILED (--ci): ${hardTotal} HARD voice tell(s) must be fixed before ship.`);
  process.exit(1);
}
