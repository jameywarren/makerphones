/**
 * Shared filesystem roots for the build/output pipeline. One knob, imported by
 * every book/ebook/cover script, so "where the web build lives" and "where
 * products land" are defined once instead of in each script.
 *
 * The split is deliberate:
 *
 *   DIST       Astro's web build AND the GitHub Pages publish root. Disposable —
 *              `astro build` empties it on every run. Book tools READ from here
 *              (the built chapter HTML + /_astro assets) and may stage scratch
 *              that must be served from the web root (e.g. dist/book.html for the
 *              headless PDF render) — but must NEVER write finished products here,
 *              or they'd (a) be published on makerphones.com and (b) be wiped by
 *              the next build.
 *
 *   ARTIFACTS  Where book/ebook/cover PRODUCTS land (book.pdf, cover-*.pdf,
 *              book.epub, epub-cover.png, …). Outside the publish root, so they
 *              are never served on the site and never clobbered by `astro build`.
 *              Gitignored.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(HERE, '..', '..');
export const DIST = path.join(ROOT, 'dist');
export const ARTIFACTS = path.join(ROOT, 'artifacts');
