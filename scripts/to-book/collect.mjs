#!/usr/bin/env node
/**
 * to-book/collect.mjs — assemble the manual into one paginated book document.
 *
 * The book is a third output target alongside the website and the (stubbed)
 * Shopify export: same content, new projection. This reuses the REAL
 * Astro-built HTML in dist/ (every chapter's hand-built SVG figures, fonts,
 * and --mp-* tokens come along for free) and rebuilds each page into the
 * Makerphones Design System's print markup, then concatenates everything, in
 * spine order, into one HTML book. Paged.js (vendored locally) paginates it.
 *
 *   node scripts/to-book/collect.mjs            -> dist/book.html        (screen)
 *   node scripts/to-book/collect.mjs --press    -> dist/book-press.html  (+ bleed + marks)
 *
 * The print design system lives in src/styles/book.css (delivered) and is
 * documented in project/book/design-system/. This script emits the markup
 * that stylesheet expects:
 *   - part openers      .part-opener  (po-kicker / po-num / po-title)
 *   - numbered chapters .book-chapter (ch-eyebrow "Chapter N" / h1 / ch-lede /
 *                       ch-meta / ch-rule), figures numbered by CSS counter
 *   - build guides      .book-chapter.book-guide  (unnumbered)
 *   - appendices        .book-appendix
 * Chapter numbers (1..33) and chapter-scoped figure numbers (Fig. N.m) are
 * DERIVED from spine position — reorder a chapter and everything renumbers.
 *
 * Known TODOs (see project/book/PLAN.md): the spine mirrors the
 * astro.config.mjs sidebar by hand; the parts viewer is replaced by a note;
 * TOC/LoF have no page-number folios yet (Paged.js target-counter).
 */

import { readFile, writeFile, access, mkdir, copyFile } from 'node:fs/promises';
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

/** The spine — mirrors the astro.config.mjs sidebar verbatim. */
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
  { kind: 'guides', num: null, title: 'Build Guides', handles: [
    'choosing-a-3d-printer', 'your-first-build', 'simple-open-back-build',
    'closed-back-studio-build', 'daily-driver-design-spec',
    'daily-driver-parts', 'designing-headphones-with-ai',
  ] },
  { kind: 'appendix', num: null, title: 'Appendices', handles: [
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

function headOf(html) {
  const a = html.indexOf('<head'); const b = html.indexOf('</head>');
  return a === -1 || b === -1 ? '' : html.slice(a, b);
}
function linkHrefs(head, into) {
  for (const m of head.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) {
    if (/media="print"/.test(m[0])) continue;
    const h = m[0].match(/href="([^"]+)"/);
    if (h) into.add(h[1]);
  }
}
function styleInners(head, into) {
  for (const m of head.matchAll(/<style>([\s\S]*?)<\/style>/g)) into.add(m[1]);
}

/* Paged.js 0.4.3 can't parse :is()/:where() in the selectors it scans (it
 * splits selector lists on commas and chokes on the inner commas), which
 * aborts pagination. Drop any style rule whose selector uses them — these are
 * website-chrome rules the print layer (book.css) replaces anyway. Brace-aware:
 * keeps @font-face / @keyframes / @page, recurses into @media / @supports, and
 * preserves :root tokens and the diagram CSS the figures need. */
function stripModernSelectors(css) {
  let out = '', i = 0;
  while (i < css.length) {
    if (css.startsWith('/*', i)) { const e = css.indexOf('*/', i + 2); i = e === -1 ? css.length : e + 2; continue; }
    let j = i;
    while (j < css.length && css[j] !== '{' && css[j] !== '}' && css[j] !== ';') {
      if (css.startsWith('/*', j)) { const e = css.indexOf('*/', j + 2); j = e === -1 ? css.length : e + 2; continue; }
      j += 1;
    }
    if (j >= css.length) { out += css.slice(i); break; }
    if (css[j] === ';' || css[j] === '}') { out += css.slice(i, j + 1); i = j + 1; continue; }
    const prelude = css.slice(i, j);
    let depth = 1, k = j + 1;
    while (k < css.length && depth > 0) {
      if (css.startsWith('/*', k)) { const e = css.indexOf('*/', k + 2); k = e === -1 ? css.length : e + 2; continue; }
      if (css[k] === '{') depth += 1; else if (css[k] === '}') depth -= 1;
      k += 1;
    }
    const block = css.slice(j + 1, k - 1);
    const trimmed = prelude.trim();
    if (trimmed.startsWith('@')) {
      const name = trimmed.slice(1).split(/[\s({]/)[0].toLowerCase();
      if (['media', 'supports', 'layer', 'container'].includes(name)) {
        out += prelude + '{' + stripModernSelectors(block) + '}';
      } else {
        out += prelude + '{' + block + '}';   // @font-face, @keyframes, @page, …
      }
    } else if (!/:is\(|:where\(/i.test(prelude)) {
      out += prelude + '{' + block + '}';
    }
    i = k;
  }
  return out;
}
function firstH1(html) {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : null;
}
function metaDesc(html) {
  const m = html.match(/<meta name="description" content="([^"]*)"/);
  return m ? m[1] : '';
}
function readMinutes(html) {
  const m = html.match(/(\d+)\s*min read/i);
  return m ? m[1] : null;
}
/** Balanced inner HTML of the first element matching `marker` (div-depth aware). */
function divInner(html, marker) {
  const open = html.indexOf(marker);
  if (open === -1) return null;
  const i = html.indexOf('>', open) + 1;
  const re = /<\/?div\b[^>]*>/g; re.lastIndex = i;
  let depth = 1, m;
  while ((m = re.exec(html))) {
    if (m[0].charAt(1) === '/') { depth -= 1; if (depth === 0) return html.slice(i, m.index); }
    else depth += 1;
  }
  return html.slice(i);
}
/** Strip the author's baked-in "Fig. N — " label (CSS counters add the real one);
 *  for numbered chapters, record the caption for the List of Figures. */
function processFigures(inner, chapterNum, lof) {
  let fig = 0;
  return inner.replace(/<figcaption class="mp-figcaption">([\s\S]*?)<\/figcaption>/g, (_m, cap) => {
    fig += 1;
    const stripped = cap.replace(/^\s*<b>[\s\S]*?<\/b>\s*[—–-]\s*/, '').trim();
    if (chapterNum != null) {
      const num = `${chapterNum}.${fig}`;
      lof.push({ num, text: stripped.replace(/<[^>]+>/g, '').trim() });
      return `<figcaption class="mp-figcaption"><b class="fig-num">Fig. ${num}</b> — ${stripped}</figcaption>`;
    }
    return `<figcaption class="mp-figcaption">${stripped}</figcaption>`;
  });
}

async function main() {
  if (!(await exists(DIST))) {
    console.error('dist/ not found — run `astro build` first (or use `npm run book`).');
    process.exit(1);
  }

  const cssHrefs = new Set();
  const cssBlocks = new Set();
  const entries = [];   // { group, kind, handle, title, desc, minutes, bodyInner }
  let missing = 0;

  for (const group of SPINE) {
    for (const handle of group.handles) {
      const file = path.join(DIST, 'learn', handle, 'index.html');
      if (!(await exists(file))) { console.warn(`  ! missing built chapter: ${handle}`); missing += 1; continue; }
      const html = await readFile(file, 'utf8');
      const inner = divInner(html, '<div class="sl-markdown-content"');
      if (inner == null) { console.warn(`  ! no sl-markdown-content in ${handle}`); missing += 1; continue; }
      linkHrefs(headOf(html), cssHrefs);
      styleInners(headOf(html), cssBlocks);
      entries.push({
        group, kind: group.kind, handle,
        title: firstH1(html) || handle,
        desc: metaDesc(html),
        minutes: readMinutes(html),
        bodyInner: inner,
      });
    }
  }

  // assign derived chapter numbers + process figures
  const lof = [];
  let chapterNum = 0;
  for (const e of entries) {
    const cn = e.kind === 'part' ? (chapterNum += 1) : null;
    e.chapterNum = cn;
    e.body = `<div class="sl-markdown-content">${processFigures(e.bodyInner, cn, lof)}</div>`;
  }

  // ── body: part/section openers + articles ──
  let body = '';
  let lastGroup = null;
  let partArabic = 0;
  for (const e of entries) {
    if (e.group !== lastGroup) {
      lastGroup = e.group;
      if (e.kind === 'part') {
        partArabic += 1;
        body += `<section class="part-opener"><div class="po-kicker">Part</div>` +
          `<div class="po-num">${partArabic}</div><h2 class="po-title">${e.group.title}</h2>` +
          `<hr class="po-rule"></section>`;
      } else {
        body += `<section class="part-opener"><div class="po-kicker">Reference</div>` +
          `<h2 class="po-title">${e.group.title}</h2><hr class="po-rule"></section>`;
      }
    }
    const note = WEB_NOTE[e.handle] ?? '';
    if (e.kind === 'part') {
      const meta = [e.minutes ? `${e.minutes} min read` : null, `makerphones.com/learn/${e.handle}`]
        .filter(Boolean).map((b) => `<span>${b}</span>`).join('');
      body += `<article class="book-chapter"><div class="ch-eyebrow">Chapter ${e.chapterNum}</div>` +
        `<h1>${e.title}</h1>${e.desc ? `<p class="ch-lede">${e.desc}</p>` : ''}` +
        `<div class="ch-meta">${meta}</div><div class="ch-rule"></div>${note}${e.body}</article>`;
    } else if (e.kind === 'guides') {
      body += `<article class="book-chapter book-guide"><div class="ch-eyebrow">Build Guide</div>` +
        `<h1>${e.title}</h1>${e.desc ? `<p class="ch-lede">${e.desc}</p>` : ''}` +
        `<div class="ch-rule"></div>${note}${e.body}</article>`;
    } else {
      body += `<section class="book-appendix"><div class="ch-eyebrow">Appendix</div>` +
        `<h1>${e.title}</h1><div class="ch-rule"></div>${note}${e.body}</section>`;
    }
  }

  // ── table of contents ──
  let toc = '<section class="book-toc"><h2>Contents</h2>';
  let tnum = 0;
  for (const group of SPINE) {
    const inGroup = entries.filter((e) => e.group === group);
    if (!inGroup.length) continue;
    const label = group.kind === 'part' ? `Part ${group.num} · ${group.title}` : group.title;
    toc += `<div class="toc-part">${label}</div><ol>`;
    for (const e of inGroup) {
      const left = group.kind === 'part' ? `${(tnum += 1)}. ${e.title}` : e.title;
      toc += `<li><span>${left}</span><span class="toc-folio"></span></li>`;
    }
    toc += '</ol>';
  }
  toc += '</section>';

  // ── list of figures ──
  let lofHtml = '';
  if (lof.length) {
    lofHtml = '<section class="book-lof"><h2>Figures</h2><ol>';
    for (const f of lof) lofHtml += `<li><span class="lof-n">Fig. ${f.num}</span><span>${f.text}</span></li>`;
    lofHtml += '</ol></section>';
  }

  // ── styles: inline the site CSS (minus :is()/:where(), which Paged.js can't
  //    parse) + the scoped component styles + the print design system ──
  let bundled = '';
  for (const href of cssHrefs) {
    const p = path.join(DIST, href.replace(/^\//, ''));
    if (await exists(p)) bundled += stripModernSelectors(await readFile(p, 'utf8')) + '\n';
  }
  for (const b of cssBlocks) bundled += stripModernSelectors(b) + '\n';
  const bookCss = await readFile(path.join(STYLES, 'book.css'), 'utf8');
  const pressCss = PRESS ? await readFile(path.join(STYLES, 'book-press.css'), 'utf8') : '';
  let pagedSrc = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
  const polyfill = path.join(ROOT, 'node_modules', 'pagedjs', 'dist', 'paged.polyfill.js');
  if (await exists(polyfill)) {
    await mkdir(path.join(DIST, '_book'), { recursive: true });
    await copyFile(polyfill, path.join(DIST, '_book', 'paged.polyfill.js'));
    pagedSrc = '/_book/paged.polyfill.js';
  }

  const doc = `<!doctype html>
<html lang="en" data-theme="light" data-book-mode="${PRESS ? 'press' : 'screen'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BOOK_TITLE}</title>
<style>
${bundled}
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

${lofHtml}

<section class="book-preface">
  <h2>How to use this book</h2>
  <p class="pf-draft">[Draft — preface to be written by the author.]</p>
  <p>This is a reference manual you can read two ways. Read it front to back
  and it builds an argument: how headphones make sound, what the parts do,
  how to design and build an enclosure, how to measure what you made, and how
  to tune it. Or treat it as a reference — each chapter states its
  prerequisites, so you can find your way in from any direction.</p>
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

<!-- Paged.js paginates this document in the browser and under the headless renderer. -->
<script src="${pagedSrc}"></script>
</body>
</html>
`;

  await writeFile(OUT, doc, 'utf8');

  const parts = SPINE.filter((g) => g.kind === 'part').length;
  console.log(`\n  to-book (${PRESS ? 'PRESS 7x10+bleed' : 'screen 7x10'}): wrote ${path.relative(ROOT, OUT)}`);
  console.log(`  chapters: ${chapterNum} numbered (${parts} parts) + ` +
    `${entries.filter((e) => e.kind === 'guides').length} guides + ` +
    `${entries.filter((e) => e.kind === 'appendix').length} appendices`);
  console.log(`  figures: ${lof.length} numbered Fig. N.m (chapter-scoped) + List of Figures`);
  console.log(`  inlined css: ${cssHrefs.size} bundle(s) + ${cssBlocks.size} scoped block(s) (:is()/:where() stripped)`);
  if (missing) console.log(`  WARNING: ${missing} entr${missing === 1 ? 'y' : 'ies'} missing from dist/`);
  console.log('');
}

main().catch((err) => { console.error(err); process.exit(1); });
