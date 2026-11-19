/**
 * Stale-build guard for the book and ebook assemblers.
 *
 * collect.mjs and to-epub/build.mjs do not read the chapter sources. They read
 * the HTML that `astro build` wrote to dist/. If dist/ is older than the
 * sources, the book is assembled from old chapters and nothing looks wrong:
 * the first press PDF (2026-06-28) was rendered that way, from a dist/ built
 * before the last chapter edits.
 *
 * So: refuse to run when anything the build consumes is newer than the build.
 * "The build" is dated by dist/index.html, which `astro build` rewrites on
 * every run (it empties dist/ first).
 *
 *   node scripts/to-book/collect.mjs --allow-stale    skip the check on purpose
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, DIST } from './paths.mjs';

const STAMP = path.join(DIST, 'index.html');

/** What `astro build` consumes. */
const WATCHED = ['src', 'public', 'astro.config.mjs'];

/** Read straight from src/ by collect.mjs at assembly time, never through
 *  dist/, so editing them cannot make dist/ stale. */
const READ_DIRECT = new Set([
  path.join(ROOT, 'src', 'styles', 'book.css'),
  path.join(ROOT, 'src', 'styles', 'book-press.css'),
]);

async function newestUnder(p, best) {
  let st;
  try { st = await stat(p); } catch { return best; }
  if (st.isDirectory()) {
    for (const name of await readdir(p)) {
      if (name.startsWith('.')) continue;          // .DS_Store and friends
      best = await newestUnder(path.join(p, name), best);
    }
    return best;
  }
  if (READ_DIRECT.has(p)) return best;
  return st.mtimeMs > best.mtimeMs ? { file: p, mtimeMs: st.mtimeMs } : best;
}

/**
 * Exit with a clear message when dist/ is missing or older than the sources.
 * @param {{ allowStale?: boolean, tool?: string }} opts
 */
export async function assertFreshDist({ allowStale = false, tool = 'npm run book' } = {}) {
  let stamp;
  try { stamp = await stat(STAMP); } catch {
    console.error(`\n  dist/ has no build in it (dist/index.html is missing).`);
    console.error(`  Run \`astro build\` first, or use \`${tool}\`, which builds and then assembles.\n`);
    process.exit(1);
  }

  let newest = { file: null, mtimeMs: 0 };
  for (const w of WATCHED) newest = await newestUnder(path.join(ROOT, w), newest);
  if (!newest.file || newest.mtimeMs <= stamp.mtimeMs) return;

  const rel = path.relative(ROOT, newest.file);
  const when = (ms) => new Date(ms).toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
  if (allowStale) {
    console.warn(`\n  WARNING (--allow-stale): dist/ is older than ${rel}.`);
    console.warn(`  The output will NOT contain that change. Do not upload it.\n`);
    return;
  }
  console.error(`\n  STALE BUILD: dist/ is older than the sources. Refusing to assemble the book.`);
  console.error(`    built:   ${when(stamp.mtimeMs)}  (dist/index.html)`);
  console.error(`    changed: ${when(newest.mtimeMs)}  (${rel})`);
  console.error(`  Run \`${tool}\` so \`astro build\` runs first.`);
  console.error(`  To assemble from the old build anyway, pass --allow-stale.\n`);
  process.exit(1);
}
