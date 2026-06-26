#!/usr/bin/env node
/**
 * to-book/collect.mjs — assemble the manual into one paginated book document.
 *
 * The book is a third output target alongside the website and the (stubbed)
 * Shopify export: same content, new projection. This script reuses the REAL
 * Astro-built HTML in dist/ — so every chapter's hand-built SVG figures,
 * fonts, and --mp-* tokens come along for free — and concatenates the
 * chapters, in spine order, into a single HTML book with title page,
 * copyright, contents, a List of Figures, a preface, and a colophon.
 * Paged.js (loaded in the page) paginates it; print to PDF, or run
 * scripts/to-book/render.mjs for a headless PDF.
 *
 *   node scripts/to-book/collect.mjs            -> dist/book.html        (screen, Letter)
 *   node scripts/to-book/collect.mjs --press    -> dist/book-press.html  (7x10 + bleed + marks)
 *
 * Run via `npm run book` / `npm run book:press` (each does `astro build`
 * first). See scripts/to-book/README.md and project/book/PLAN.md.
 *
 * Done here:
 *  - Document-wide figure numbering (Fig. 1..N) + a generated List of
 *    Figures, fixing the page-local "Fig. 1" repetition.
 *  - Front matter (title, copyright, contents, figures, preface) and a
 *    back-matter colophon.
 *  - Press mode: 7x10 trim, 3mm bleed, crop marks, CMYK-tamed accent.
 *
 * Known TODOs (see PLAN.md):
 *  - SPINE mirrors the astro.config.mjs sidebar by hand — keep in sync.
 *  - The three.js parts viewer is replaced by a note; real stills (Phase 4)
 *    can be rendered from builds/daily-driver/docs/models/*.glb.
 *  - TOC/LoF have no page numbers yet (Paged.js target-counter) — Phase 3.
 */

import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const DIST = path.join(ROOT, 'dist');
const STYLES = path.join(ROOT, 'src', 'styles');

const PRESS = process.argv.includes('--press');
const OUT = path.join(DIST, PRESS ? 'book-press.html' : 'book.html');

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

/**
 * Document-wide figure numbering. Walks every captioned figure in reading
 * order, rewrites its label to a sequential "Fig. N", and returns the list
 * for a generated List of Figures. Replaces the page-local "Fig. 1"
 * repetition (22 figures all read "Fig. 1" on the web). Sequential (not
 * chapter-scoped) keeps the manual's no-"Chapter N" voice intact.
 */
function numberFigures(html) {
  const figures = [];
  let n = 0;
  const out = html.replace(
    /<figcaption class="mp-figcaption">([\s\S]*?)<\/figcaption>/g,
    (_m, inner) => {
      n += 1;
      let text = inner.replace(/<[^>]+>/g, '').trim();          // drop the <b>label</b> + tags
      text = text.replace(/^Fig\.?\s*[\dA-Za-z.]*\s*[—–-]\s*/, '').trim(); // drop old "Fig. X — "
      figures.push({ n, text });
      return `<figcaption class="mp-figcaption"><b>Fig. ${n}</b> — ${text}</figcaption>`;
    },
  );
  return { html: out, figures };
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
        missing += 1;
        continue;
      }
      const html = await readFile(file, 'utf8');
      const inner = sliceMain(html);
      if (!inner) { console.warn(`  ! no <main> in ${handle}`); missing += 1; continue; }
      styleLinks(headOf(html), links);
      styleBlocks(headOf(html), blocks);
      chapters.push({
        kind: group.kind,
        partTitle: group.title,
        partNum: group.num ?? null,
        handle,
        title: firstHeading(inner) || handle,
        body: (WEB_NOTE[handle] ?? '') + inner,
      });
    }
  }

  // --- body: part openers + chapters (assemble first, then number figures) ---
  let rawBody = '';
  let lastPart = null;
  for (const c of chapters) {
    if (c.partTitle !== lastPart) {
      lastPart = c.partTitle;
      const eyebrow = c.partNum ? `Part ${c.partNum}` : 'Reference';
      rawBody += `<section class="part-opener"><div class="po-num">${eyebrow}</div>` +
        `<h2 class="po-title">${c.partTitle}</h2><hr class="po-rule"></section>`;
    }
    rawBody += `<article class="book-chapter" id="ch-${c.handle}">${c.body}</article>`;
  }
  const { html: body, figures } = numberFigures(rawBody);

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

  // --- list of figures ---
  let lof = '';
  if (figures.length) {
    lof = '<section class="book-lof"><h2>Figures</h2><ol>';
    for (const f of figures) lof += `<li><span class="lof-n">Fig. ${f.n}</span> ${f.text}</li>`;
    lof += '</ol></section>';
  }

  // --- styles ---
  const bookCss = await readFile(path.join(STYLES, 'book.css'), 'utf8');
  const pressCss = PRESS ? await readFile(path.join(STYLES, 'book-press.css'), 'utf8') : '';

  const doc = `<!doctype html>
<html lang="en" data-theme="light" data-book-mode="${PRESS ? 'press' : 'screen'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BOOK_TITLE}</title>
${[...links].join('\n')}
${[...blocks].join('\n')}
<style>
${bookCss}
${pressCss}
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
  <p class="cr-title">${BOOK_TITLE}</p>
  <p>First edition · 2026</p>
  <p>© ${AUTHOR}. Manual text licensed Creative Commons BY-NC 4.0; design
  files MIT. Full terms in the license appendix and at makerphones.com.</p>
  <p>Published by <span class="cr-fill">[imprint]</span>. ISBN
  <span class="cr-fill">[ISBN]</span>.</p>
  <p>Set in Schibsted Grotesk, Source Serif 4, and JetBrains Mono.</p>
  <p>This edition is generated from the live manual at makerphones.com via
  the project's <code>to-book</code> pipeline. For interactive figures and
  the 3D parts viewer, visit the website.</p>
</section>

${toc}

${lof}

<section class="book-preface">
  <h2>How to use this book</h2>
  <p class="pf-draft">[Draft — preface to be written by the author.]</p>
  <p>This is a reference manual you can read two ways. Read it front to back
  and it builds an argument: how headphones make sound, what the parts do,
  how to design and build an enclosure, how to measure what you made, and how
  to tune it. Or treat it as a reference — every chapter stands on its own,
  with prerequisites and related chapters noted so you can find your way in
  from any direction.</p>
  <p>The six numbered parts move from beginner to advanced. After them, the
  build guides walk through real headphones end to end, and the appendices
  collect the glossary, suppliers, resources, sources, troubleshooting, and a
  standing note on listening safely.</p>
  <p>Some things on the website can't fit on a page — most of all the
  interactive 3D parts viewer. Where that happens, the book points you to
  makerphones.com.</p>
</section>

${body}

<section class="book-colophon">
  <h2>Colophon</h2>
  <p>${BOOK_TITLE} was generated from the Makerphones reference manual, an
  open Astro + Starlight site, by a single build step that reuses the same
  content, diagrams, and design tokens as the website — one source, many
  outputs.</p>
  <p>The text is set in <strong>Source Serif 4</strong>; headings in
  <strong>Schibsted Grotesk</strong>; technical labels, captions, and folios
  in <strong>JetBrains Mono</strong>. Every figure is a hand-built vector
  diagram, drawn for this manual.</p>
  <p>makerphones.com</p>
</section>

<!-- Paged.js paginates this document in the browser (and under pagedjs-cli). -->
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
</body>
</html>
`;

  await writeFile(OUT, doc, 'utf8');

  const partCount = SPINE.filter((g) => g.kind === 'part').length;
  console.log(`\n  to-book (${PRESS ? 'PRESS 7x10+bleed' : 'screen Letter'}): wrote ${path.relative(ROOT, OUT)}`);
  console.log(`  chapters assembled: ${chapters.length}  (${partCount} parts + back sections)`);
  console.log(`  figures numbered: ${figures.length}  (Fig. 1..${figures.length}) + List of Figures`);
  console.log(`  stylesheet links: ${links.size}   inline style blocks: ${blocks.size}`);
  if (missing) console.log(`  WARNING: ${missing} entr${missing === 1 ? 'y' : 'ies'} missing from dist/`);
  const how = PRESS
    ? 'scripts/to-book/render.mjs --press [--cmyk]  (or open dist/book-press.html in Chrome)'
    : '`npm run preview`, open http://localhost:4321/book.html, Cmd-P -> Save as PDF';
  console.log(`\n  Next: ${how}\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
