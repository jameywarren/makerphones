#!/usr/bin/env node
/**
 * to-book/collect.mjs — assemble the manual into one paginated book document.
 *
 * The book is a third output target alongside the website and the (stubbed)
 * Shopify export: same content, new projection. This reuses the REAL
 * Astro-built HTML in dist/ and rebuilds each page into the Makerphones Design
 * System's print markup (src/styles/book.css), then concatenates everything,
 * in spine order, into one HTML book. Paged.js (vendored locally) paginates it.
 *
 *   node scripts/to-book/collect.mjs            -> dist/book.html        (screen)
 *   node scripts/to-book/collect.mjs --press    -> dist/book-press.html  (+ bleed + marks)
 *
 * What it builds:
 *   - front matter: title, copyright, dedication, contents (with page numbers),
 *     list of figures (with page numbers), preface
 *   - body: part openers + numbered chapters (Chapter N), build guides,
 *     appendices — figures numbered Fig. N.m, cross-references resolved to
 *     "(Chapter N)"
 *   - back matter: index (glossary-seeded), about the author, colophon
 * Chapter numbers (1..33) and figure numbers (Fig. N.m) are DERIVED from spine
 * position. TOC/LoF page numbers use Paged.js target-counter (resolved at
 * render). The index references chapters (page-accurate index is a later
 * upgrade). See project/book/PLAN.md.
 */

import { readFile, writeFile, access, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const DIST = path.join(ROOT, 'dist');
const STYLES = path.join(ROOT, 'src', 'styles');

const PRESS = process.argv.includes('--press');
const OUT = path.join(DIST, PRESS ? 'book-press.html' : 'book.html');

const BOOK_TITLE = 'The Art and Science of Headphone Design';
const BOOK_SUBTITLE =
  'Designing and building your own headphones — the real engineering, explained plainly.';
const AUTHOR = 'Jamey Warren';             // pen name — byline on the cover + title page
const COPYRIGHT_HOLDER = 'James A. Warren'; // legal name — copyright line + ISBN registrant of record
const IMPRINT = 'Warren Labs';
// Warren Labs ISBN block 979-8-9968299-x (Bowker order #2531268). Each edition
// gets its own ISBN; both are listed on the copyright page.
const ISBN_PAPERBACK = '979-8-9968299-0-3';
const ISBN_EBOOK = '979-8-9968299-1-0';

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
  'daily-driver-design-spec':
    '<aside class="book-web-note"><strong>Web-only:</strong> the rotatable 3D part previews in ' +
    'this spec can\'t print. View and spin every part at ' +
    '<strong>makerphones.com/learn/daily-driver-design-spec</strong>.</aside>',
};

const exists = (p) => access(p).then(() => true, () => false);

/** The daily-driver-parts intro: rendered stills if scripts/to-book/render-parts.mjs
 *  has produced them (public/book/parts/*.png), else a web-only note. */
async function partsBlock() {
  const dir = path.join(ROOT, 'public', 'book', 'parts');
  if (!(await exists(path.join(dir, 'daily-driver.png')))) return WEB_NOTE['daily-driver-parts'];
  const fig = (src, cap) =>
    `<figure class="mp-figure"><img src="${src}" alt="${cap}" style="width:100%;display:block">` +
    `<figcaption class="mp-figcaption">${cap}</figcaption></figure>`;
  let out = fig('/book/parts/daily-driver.png', 'The Daily Driver, assembled.');
  if (await exists(path.join(dir, 'daily-driver-exploded.png'))) {
    out += fig('/book/parts/daily-driver-exploded.png', 'The Daily Driver, exploded into its part groups.');
  }
  return out + '<aside class="book-web-note"><strong>On the web:</strong> rotate, explode, and ' +
    'isolate every part in the interactive viewer at ' +
    '<strong>makerphones.com/learn/daily-driver-parts</strong>.</aside>';
}

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

/* Paged.js 0.4.3 can't parse :is()/:where() in the selectors it scans, which
 * aborts pagination. Drop any style rule whose selector uses them (website
 * chrome the print layer replaces). Brace-aware; keeps @font-face / @keyframes
 * / @page, recurses @media / @supports, preserves :root tokens + diagram CSS. */
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
        out += prelude + '{' + block + '}';
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
/** Plain lowercased text of an HTML fragment (for index term search). */
function plain(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').toLowerCase();
}

/** Remove web-only / interactive markup that has no place in print and that
 *  stalls Paged.js: inline scripts, the three.js <canvas>, and <model-viewer>
 *  3D widgets (tall, empty, and re-executed during pagination). The static
 *  prose around them stays; a "see the website" note is added separately. */
function sanitizeBody(html) {
  let h = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<canvas\b[\s\S]*?<\/canvas>/gi, '')
    .replace(/<model-viewer\b[\s\S]*?<\/model-viewer>/gi, '')
    .replace(/<model-viewer\b[^>]*\/?>/gi, '');
  // drop the whole interactive-viewer containers (their innards stall Paged.js)
  for (const cls of ['parts-viewer', 'parts-gallery']) h = stripDivByClass(h, cls);
  return h;
}

/** Remove every <div class="…cls…">…</div> (depth-aware) from the HTML. */
function stripDivByClass(html, cls) {
  const re = new RegExp(`<div\\b[^>]*class="[^"]*\\b${cls}\\b[^"]*"`);
  let out = html, guard = 0;
  while (guard++ < 50) {
    const m = out.match(re);
    if (!m) break;
    const open = m.index;
    let depth = 1;
    const dre = /<\/?div\b[^>]*>/g; dre.lastIndex = out.indexOf('>', open) + 1;
    let mm, end = -1;
    while ((mm = dre.exec(out))) {
      if (mm[0].charAt(1) === '/') { depth -= 1; if (depth === 0) { end = dre.lastIndex; break; } }
      else depth += 1;
    }
    if (end === -1) break;
    out = out.slice(0, open) + out.slice(end);
  }
  return out;
}

/** Strip the author's baked-in "Fig. N — " label and inject the derived
 *  chapter-scoped number; record the caption for the List of Figures, and id
 *  the caption so target-counter can page-number it. */
function processFigures(inner, chapterNum, lof) {
  let fig = 0;
  return inner.replace(/<figcaption class="mp-figcaption">([\s\S]*?)<\/figcaption>/g, (_m, cap) => {
    fig += 1;
    const stripped = cap.replace(/^\s*<b>[\s\S]*?<\/b>\s*[—–-]\s*/, '').trim();
    if (chapterNum != null) {
      const num = `${chapterNum}.${fig}`;
      lof.push({ num, text: stripped.replace(/<[^>]+>/g, '').trim() });
      return `<figcaption class="mp-figcaption" id="fig-${num.replace('.', '-')}">` +
        `<b class="fig-num">Fig. ${num}</b> — ${stripped}</figcaption>`;
    }
    return `<figcaption class="mp-figcaption">${stripped}</figcaption>`;
  });
}

/** Resolve in-prose cross-references: a link to /learn/<handle> for a numbered
 *  chapter gets a "(Chapter N)" tag appended (print isn't clickable). */
function linkChapterRefs(html, handleNum) {
  return html.replace(
    /<a\b[^>]*href="[^"]*\/learn\/([a-z0-9-]+)\/?[^"]*"[^>]*>[\s\S]*?<\/a>/g,
    (m, handle) => {
      const n = handleNum.get(handle);
      return n ? `${m}<span class="xref"> (Chapter ${n})</span>` : m;
    },
  );
}

/** Glossary-seeded, chapter-referenced index. */
async function buildIndex(entries) {
  const gPath = path.join(DIST, 'learn', 'glossary', 'index.html');
  if (!(await exists(gPath))) return '';
  const gInner = divInner(await readFile(gPath, 'utf8'), '<div class="sl-markdown-content"') ?? '';
  const terms = [...new Set(
    [...gInner.matchAll(/<strong>([^<]{2,40})<\/strong>/g)].map((m) => m[1].trim()),
  )].filter((t) => /[a-z]/i.test(t));

  const chapters = entries.filter((e) => e.chapterNum).map((e) => ({ num: e.chapterNum, text: plain(e.bodyInner) }));
  const rows = [];
  for (const term of terms) {
    const key = term.replace(/\s*\([^)]*\)\s*/g, ' ').trim().toLowerCase();
    if (key.length < 2) continue;
    const re = new RegExp(`(^|[^a-z0-9])${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`);
    const chs = [...new Set(chapters.filter((c) => re.test(c.text)).map((c) => c.num))].sort((a, b) => a - b);
    if (chs.length) rows.push({ term, chs });
  }
  if (!rows.length) return '';
  rows.sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()));

  let html = '<section class="book-index"><h2>Index</h2>' +
    '<p class="ix-note">Numbers refer to chapters.</p>';
  let letter = '';
  for (const r of rows) {
    const L = r.term[0].toUpperCase();
    if (L !== letter) { letter = L; html += `<div class="ix-group">${L}</div>`; }
    html += `<div class="ix-entry"><span class="ix-term">${r.term}</span>` +
      `<span class="ix-folios">${r.chs.join(', ')}</span></div>`;
  }
  html += '</section>';
  return html;
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

  // pass 1: derive chapter numbers + handle→number map
  let chapterNum = 0;
  const handleNum = new Map();
  for (const e of entries) {
    e.chapterNum = e.kind === 'part' ? (chapterNum += 1) : null;
    if (e.chapterNum) handleNum.set(e.handle, e.chapterNum);
  }
  // pass 2: number figures + resolve cross-references
  const lof = [];
  for (const e of entries) {
    const clean = sanitizeBody(e.bodyInner);
    const withFigs = processFigures(clean, e.chapterNum, lof);
    e.body = `<div class="sl-markdown-content">${linkChapterRefs(withFigs, handleNum)}</div>`;
  }

  // ── body: part/section openers + articles (each section id'd for the TOC) ──
  const notes = { ...WEB_NOTE, 'daily-driver-parts': await partsBlock() };
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
    const note = notes[e.handle] ?? '';
    const id = `sec-${e.handle}`;
    if (e.kind === 'part') {
      const meta = [e.minutes ? `${e.minutes} min read` : null, `makerphones.com/learn/${e.handle}`]
        .filter(Boolean).map((b) => `<span>${b}</span>`).join('');
      body += `<article class="book-chapter" id="${id}"><div class="ch-eyebrow">Chapter ${e.chapterNum}</div>` +
        `<h1>${e.title}</h1>${e.desc ? `<p class="ch-lede">${e.desc}</p>` : ''}` +
        `<div class="ch-meta">${meta}</div><div class="ch-rule"></div>${note}${e.body}</article>`;
    } else if (e.kind === 'guides') {
      body += `<article class="book-chapter book-guide" id="${id}"><div class="ch-eyebrow">Build Guide</div>` +
        `<h1>${e.title}</h1>${e.desc ? `<p class="ch-lede">${e.desc}</p>` : ''}` +
        `<div class="ch-rule"></div>${note}${e.body}</article>`;
    } else {
      body += `<section class="book-appendix" id="${id}"><div class="ch-eyebrow">Appendix</div>` +
        `<h1>${e.title}</h1><div class="ch-rule"></div>${note}${e.body}</section>`;
    }
  }

  // ── table of contents (links carry page numbers via target-counter) ──
  let toc = '<section class="book-toc"><h2>Contents</h2>';
  let tnum = 0;
  for (const group of SPINE) {
    const inGroup = entries.filter((e) => e.group === group);
    if (!inGroup.length) continue;
    const label = group.kind === 'part' ? `Part ${group.num} · ${group.title}` : group.title;
    toc += `<div class="toc-part">${label}</div><ol>`;
    for (const e of inGroup) {
      const left = group.kind === 'part' ? `${(tnum += 1)}. ${e.title}` : e.title;
      toc += `<li><a class="toc-link" href="#sec-${e.handle}">${left}</a></li>`;
    }
    toc += '</ol>';
  }
  toc += '</section>';

  // ── list of figures (page numbers via target-counter) ──
  let lofHtml = '';
  if (lof.length) {
    lofHtml = '<section class="book-lof"><h2>Figures</h2><ol>';
    for (const f of lof) {
      lofHtml += `<li><a class="lof-link" href="#fig-${f.num.replace('.', '-')}">` +
        `<span class="lof-n">Fig. ${f.num}</span><span class="lof-cap">${f.text}</span></a></li>`;
    }
    lofHtml += '</ol></section>';
  }

  // ── index (glossary-seeded, chapter-referenced) ──
  const indexHtml = await buildIndex(entries);

  // ── styles: inline the site CSS (minus :is()/:where()) + scoped + design ──
  let bundled = '';
  for (const href of cssHrefs) {
    const p = path.join(DIST, href.replace(/^\//, ''));
    if (await exists(p)) bundled += stripModernSelectors(await readFile(p, 'utf8')) + '\n';
  }
  for (const b of cssBlocks) bundled += stripModernSelectors(b) + '\n';
  const bookCss = await readFile(path.join(STYLES, 'book.css'), 'utf8');
  const pressCss = PRESS ? await readFile(path.join(STYLES, 'book-press.css'), 'utf8') : '';

  // vendor the Paged.js polyfill into dist (no CDN at render/print time)
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
  <p>© ${COPYRIGHT_HOLDER}. Manual text licensed Creative Commons BY-NC 4.0; design
  files MIT. Full terms in the license appendix and at makerphones.com.</p>
  <p>Published by ${IMPRINT}.</p>
  <p class="cr-isbn">ISBN ${ISBN_PAPERBACK} (paperback)<br>ISBN ${ISBN_EBOOK} (ebook)</p>
  <p>Set in Schibsted Grotesk, Source Serif 4, and JetBrains Mono.</p>
  <p>This edition is generated from the live manual at makerphones.com via
  the project's <code>to-book</code> pipeline. For interactive figures and
  the 3D parts viewer, visit the website.</p>
</section>

<section class="book-dedication">
  <p>For Piper and Jessica.</p>
  <p>For my parents, Curt and Margie, and my sister, Jennifer.</p>
  <p>And for all my family, near and far.</p>
</section>

${toc}

${lofHtml}

<section class="book-preface">
  <h2>How to use this book</h2>
  <p>This is a reference manual you can read two ways. Read it front to back
  and it builds an argument: how headphones make sound, what the parts do, how
  to design and build an enclosure, how to measure what you made, and how to
  tune it. Or treat it as a reference — each chapter names what you should have
  read first, so you can come in from any direction and find your footing.</p>
  <p>The six numbered parts climb from beginner to advanced. After them, the
  build guides walk through real headphones end to end, and the appendices
  collect a glossary, suppliers, resources, sources, troubleshooting, and a
  standing note on listening safely. Figures are numbered by chapter — Fig. 4.2
  is the second figure in Chapter 4 — and gathered in the list of figures up
  front.</p>
  <p>Nothing here is theory for its own sake. Every claim that can be measured
  is, and the curve is shown. Where a value is a judgment call, it says so. The
  aim is a book you can trust at the bench: specific, unit-bearing, and honest
  about what's still uncertain.</p>
  <p>A few things live only on the website — most of all the interactive 3D
  parts viewer. Where the page can't carry them, the book points you to
  makerphones.com.</p>
</section>

<section class="book-acknowledgments">
  <h2>Acknowledgments</h2>
  <p>This book carries a lot of other people's teaching.</p>
  <p>I owe my understanding of headphones, specifically, to
  <strong>Tyll Hertsens</strong> of HeadRoom. So much of what's in these pages
  traces back to him. Thank you, Tyll.</p>
  <p>My real audio-engineering education came from <strong>Michael and Eben
  Grace</strong>. Seven years at Grace Design, working directly under the two
  brothers, taught me more than any classroom could — I've always called it my
  University of Rock &amp; Roll. Before that, the Conservatory of Recording
  Arts &amp; Sciences gave me the formal grounding to build on.</p>
  <p>And to the others — mentors, colleagues, and friends in this small field —
  whose names I'll keep adding as I remember them: thank you.</p>
</section>

${body}

${indexHtml}

<section class="book-about-author">
  <h2>About the author</h2>
  <p><strong>Jamey Warren</strong> has spent more than twenty-five years in
  professional audio and the headphone industry. He was employee #1 at Grace
  Design (1997–2001) and consulted for the company through 2003 — seven years
  he calls his University of Rock &amp; Roll. From 2003 to 2017 he was VP of
  Operations and then President &amp; CEO of HeadRoom, where he relaunched the
  entire headphone-amplifier line and oversaw the testing of thousands of
  headphones.</p>
  <p>He is now designing his own open-back headphone, the Daily Driver, in the
  open — with AI as a design partner — using the same methods this book
  teaches. The work, and its measurements, are published at makerphones.com.</p>
</section>

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
  <p>${IMPRINT} · makerphones.com</p>
</section>

<!-- Paged.js paginates this document in the browser and under the headless renderer. -->
<script src="${pagedSrc}"></script>
</body>
</html>
`;

  await writeFile(OUT, doc, 'utf8');

  const parts = SPINE.filter((g) => g.kind === 'part').length;
  const idxTerms = (indexHtml.match(/ix-entry/g) || []).length;
  console.log(`\n  to-book (${PRESS ? 'PRESS 7x10+bleed' : 'screen 7x10'}): wrote ${path.relative(ROOT, OUT)}`);
  console.log(`  chapters: ${chapterNum} numbered (${parts} parts) + ` +
    `${entries.filter((e) => e.kind === 'guides').length} guides + ` +
    `${entries.filter((e) => e.kind === 'appendix').length} appendices`);
  console.log(`  figures: ${lof.length} (Fig. N.m) · index entries: ${idxTerms} · ` +
    `TOC + LoF page numbers via target-counter`);
  console.log(`  inlined css: ${cssHrefs.size} bundle(s) + ${cssBlocks.size} scoped block(s)`);
  if (missing) console.log(`  WARNING: ${missing} entr${missing === 1 ? 'y' : 'ies'} missing from dist/`);
  console.log('');
}

/* Shared with scripts/to-epub (the EPUB build reuses the spine + the same
 * chapter assembly so web, print, and ebook stay one source). */
export {
  SPINE, WEB_NOTE, partsBlock, divInner, plain, exists,
  firstH1, metaDesc, readMinutes, sanitizeBody, stripDivByClass,
  processFigures, linkChapterRefs, buildIndex, stripModernSelectors,
  BOOK_TITLE, BOOK_SUBTITLE, AUTHOR, COPYRIGHT_HOLDER, IMPRINT,
  ISBN_PAPERBACK, ISBN_EBOOK, DIST, ROOT, STYLES,
};

// Run the assembler only when invoked directly — not when imported by to-epub.
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
