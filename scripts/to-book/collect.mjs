#!/usr/bin/env node
/**
 * to-book/collect.mjs — assemble the manual into one paginated book document.
 *
 * The book is a third output target alongside the website and the (stubbed)
 * Shopify export: same content, new projection. This script reuses the REAL
 * Astro-built HTML in dist/ — so every chapter's hand-built SVG figures,
 * fonts, and --mp-* tokens come along for free — and concatenates the
 * chapters, in spine order, into a single dist/book.html with a title page,
 * copyright page, and table of contents. Paged.js (loaded in the page)
 * paginates it in the browser; print to PDF, or run pagedjs-cli for a
 * headless PDF.
 *
 * Run via `npm run book` (which does `astro build` first). See
 * scripts/to-book/README.md and project/book/PLAN.md.
 *
 * v0.1 scope / known TODOs:
 *  - SPINE below mirrors the astro.config.mjs sidebar by hand (the canonical
 *    order). Keep them in sync until we can import one from the other.
 *  - The three.js parts viewer is replaced by a printed note; real stills
 *    come in Phase 4.
 *  - TOC has no page numbers yet (Paged.js target-counter) — Phase 2/3.
 */

import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(DIST, 'book.html');
const BOOK_CSS = path.join(ROOT, 'src', 'styles', 'book.css');

const BOOK_TITLE = 'The Art and Science of Headphone Design';
const BOOK_SUBTITLE =
  'Designing and building your own headphones — the real engineering, explained plainly.';
const AUTHOR = 'Jamey Warren';

/**
 * The spine — mirrors the astro.config.mjs sidebar verbatim (the canonical
 * order). Parts 1–6 are numbered; Build Guides and Appendices are unnumbered
 * back sections, exactly as in manual.ts.
 */
const SPINE = [
  { kind: 'part', num: 'One', title: 'Fundamentals', handles: [
    'how-headphones-create-sound', 'understanding-frequency-response',
    'impedance-and-sensitivity', 'open-vs-closed-back-design',
    'headphone-form-factors', 'driver-technologies',
  ] },
  { kind: 'part', num: 'Two', title: 'Components & Materials', handles: [
    'driver-selection-guide', 'sourcing-components',
    'acoustic-chambers-and-enclosures', 'ear-pads-and-comfort',
    'damping-materials', 'cables-connectors-hardware',
  ] },
  { kind: 'part', num: 'Three', title: 'Design & Build', handles: [
    'design-methodology', '3d-design-for-headphones', 'acoustic-chamber-design',
    'driver-mounting-and-assembly', 'damping-strategy-and-application',
  ] },
  { kind: 'part', num: 'Four', title: 'Measurement & Tuning', handles: [
    'why-measure-headphones', 'budget-measurement-setup',
    'taking-and-interpreting-measurements', 'measuring-raw-drivers',
    'tuning-with-damping', 'tuning-with-eq',
    'benchmarking-with-public-measurements', 'advanced-measurement-topics',
  ] },
  { kind: 'part', num: 'Five', title: 'Advanced', handles: [
    'acoustic-modeling', 'resonance-control',
    'manufacturing-for-consistency', 'professional-design-insights',
  ] },
  { kind: 'part', num: 'Six', title: 'Special Topics', handles: [
    'bluetooth-integration', 'active-noise-cancelling',
    'microphone-integration', 'custom-iem-design',
  ] },
  { kind: 'section', title: 'Build Guides', handles: [
    'choosing-a-3d-printer', 'your-first-build', 'simple-open-back-build',
    'closed-back-studio-build', 'daily-driver-design-spec',
    'daily-driver-parts', 'designing-headphones-with-ai',
  ] },
  { kind: 'section', title: 'Appendices', handles: [
    'listening-safely', 'glossary', 'supplier-directory', 'design-resources',
    'sources-and-further-reading', 'troubleshooting-guide', 'community-builds',
  ] },
];

/** Chapters whose web-only widgets need a printed stand-in. */
const WEB_NOTE = {
  'daily-driver-parts':
    '<aside class="book-web-note"><strong>Web-only:</strong> this chapter centers on an ' +
    'interactive 3D parts viewer that can\'t print. Explore the exploded, isolated, and ' +
    'assembled views at <strong>makerphones.com/learn/daily-driver-parts</strong>.</aside>',
};

const exists = (p) => access(p).then(() => true, () => false);

function sliceMain(html) {
  const open = html.indexOf('<main');
  if (open === -1) return null;
  const start = html.indexOf('>', open) + 1;
  const end = html.indexOf('</main>', start);   // <main> does not nest
  if (end === -1) return null;
  return html.slice(start, end);
}

function headOf(html) {
  const a = html.indexOf('<head');
  const b = html.indexOf('</head>');
  return a === -1 || b === -1 ? '' : html.slice(a, b);
}

/** Collect screen stylesheet links (drop Starlight's media="print" sheet). */
function styleLinks(head, into) {
  for (const m of head.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) {
    const tag = m[0];
    if (/media="print"/.test(tag)) continue;
    into.add(tag);
  }
}

/** Collect inline <style> blocks (Astro scoped styles are hash-unique). */
function styleBlocks(head, into) {
  for (const m of head.matchAll(/<style>[\s\S]*?<\/style>/g)) into.add(m[0]);
}

function firstHeading(main) {
  const m = main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : null;
}

async function main() {
  if (!(await exists(DIST))) {
    console.error('dist/ not found — run `astro build` first (or use `npm run book`).');
    process.exit(1);
  }

  const links = new Set();
  const blocks = new Set();
  const chapters = []; // { kind, partTitle, partNum, handle, title, body }
  let missing = 0;

  for (const group of SPINE) {
    for (const handle of group.handles) {
      const file = path.join(DIST, 'learn', handle, 'index.html');
      if (!(await exists(file))) {
        console.warn(`  ! missing built chapter: ${handle}`);
        missing++;
        continue;
      }
      const html = await readFile(file, 'utf8');
      const main = sliceMain(html);
      if (!main) { console.warn(`  ! no <main> in ${handle}`); missing++; continue; }
      styleLinks(headOf(html), links);
      styleBlocks(headOf(html), blocks);
      const note = WEB_NOTE[handle] ?? '';
      chapters.push({
        kind: group.kind,
        partTitle: group.title,
        partNum: group.num ?? null,
        handle,
        title: firstHeading(main) || handle,
        body: note + main,
      });
    }
  }

  // --- table of contents (grouped by spine section) ---
  let toc = '<section class="book-toc"><h2>Contents</h2>';
  for (const group of SPINE) {
    const inGroup = chapters.filter((c) => c.partTitle === group.title);
    if (!inGroup.length) continue;
    const label = group.kind === 'part' ? `Part ${group.num} · ${group.title}` : group.title;
    toc += `<div class="toc-part">${label}</div><ol>`;
    for (const c of inGroup) toc += `<li>${c.title}</li>`;
    toc += '</ol>';
  }
  toc += '</section>';

  // --- body: openers + chapters ---
  let body = '';
  let lastPart = null;
  for (const c of chapters) {
    if (c.partTitle !== lastPart) {
      lastPart = c.partTitle;
      const num = c.partNum
        ? `<div class="po-num">Part ${c.partNum}</div>`
        : '<div class="po-num">Reference</div>';
      body += `<section class="part-opener">${num}` +
        `<h2 class="po-title">${c.partTitle}</h2><hr class="po-rule"></section>`;
    }
    body += `<article class="book-chapter" id="ch-${c.handle}">${c.body}</article>`;
  }

  const bookCss = await readFile(BOOK_CSS, 'utf8');

  const doc = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BOOK_TITLE}</title>
${[...links].join('\n')}
${[...blocks].join('\n')}
<style>
${bookCss}
</style>
</head>
<body>

<section class="book-title-page">
  <div class="bt-kicker">Makerphones</div>
  <hr class="bt-rule">
  <h1 class="bt-title">${BOOK_TITLE}</h1>
  <p class="bt-sub">${BOOK_SUBTITLE}</p>
  <div class="bt-author">${AUTHOR}</div>
</section>

<section class="book-copyright">
  <p>${BOOK_TITLE}</p>
  <p>© ${AUTHOR}. Manual text licensed CC BY-NC 4.0; design files MIT. See the
  license appendix for details.</p>
  <p>This PDF edition is generated from makerphones.com. For interactive
  figures and the live 3D parts viewer, visit the website.</p>
  <p>Draft — generated by scripts/to-book/collect.mjs.</p>
</section>

${toc}

${body}

<!-- Paged.js paginates this document in the browser (and under pagedjs-cli). -->
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
</body>
</html>
`;

  await writeFile(OUT, doc, 'utf8');

  const partCount = SPINE.filter((g) => g.kind === 'part').length;
  console.log(`\n  to-book: wrote ${path.relative(ROOT, OUT)}`);
  console.log(`  chapters assembled: ${chapters.length}  (${partCount} parts + back sections)`);
  console.log(`  stylesheet links: ${links.size}   inline style blocks: ${blocks.size}`);
  if (missing) console.log(`  WARNING: ${missing} entr${missing === 1 ? 'y' : 'ies'} missing from dist/`);
  console.log('\n  Next: `npm run preview`, open http://localhost:4321/book.html in Chrome,');
  console.log('        let Paged.js paginate, then Cmd-P -> Save as PDF.\n');
}

main().catch((err) => { console.error(err); process.exit(1); });
