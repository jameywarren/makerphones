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
 * Both refuse to run on a stale dist/ (any source newer than the build) unless
 * --allow-stale is passed. Use `npm run book` / `npm run book:press`, which
 * build first.
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

import { readFile, writeFile, access, mkdir, copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, DIST } from '../lib/paths.mjs';
import { assertFreshDist } from '../lib/fresh-dist.mjs';
import {
  BOOK_TITLE, BOOK_SUBTITLE, AUTHOR, COPYRIGHT_HOLDER, IMPRINT,
  ISBN_PAPERBACK, ISBN_EBOOK, EDITION, EDITION_YEAR, REVISION,
} from '../lib/edition.mjs';

const STYLES = path.join(ROOT, 'src', 'styles');

const PRESS = process.argv.includes('--press');
const OUT = path.join(DIST, PRESS ? 'book-press.html' : 'book.html');

// Title, author, ISBNs, edition statement: typed once, in lib/edition.mjs.

/** The spine: which pages are in the book, and in what order.
 *
 *  This is the book's OWN list. It follows the site's manual (the sidebar in
 *  astro.config.mjs, the lists in src/data/manual.ts) but it is not a copy of
 *  it: the pages in WEB_ONLY below are on the site and not in the book.
 *  checkSpine() compares the two on every run and stops the build when a site
 *  page is in neither list, so a new page can't be left out of the book by
 *  accident, only on purpose. */
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

/** Site pages that are deliberately NOT in the print or EPUB edition.
 *  Moving one into the book is an edition decision: add it to SPINE, take it
 *  out of here, and give its 3D viewer a printed stand-in (WEB_NOTE below). */
const WEB_ONLY = [
  'first-chair-design-spec',   // on the site since 2026-08-06, after the first printing
  'first-chair-parts',         // on the site since 2026-08-06, after the first printing
  'daily-driver-parts-beta',   // the live work-in-progress view of the parts page
];

const MANUAL_TS = path.join(ROOT, 'src', 'data', 'manual.ts');
const LEARN_DIR = path.join(ROOT, 'src', 'content', 'docs', 'learn');

/** Every manual page the site knows about: the three lists in
 *  src/data/manual.ts plus every learn/*.md(x) file (index is the landing page). */
async function siteManualHandles() {
  const ts = await readFile(MANUAL_TS, 'utf8');
  const strings = (block) => [...block.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
  const listOf = (name) => {
    const m = ts.match(new RegExp(`export const ${name}\\b[^=]*=\\s*\\[([\\s\\S]*?)\\]\\s*(?:as const)?\\s*;`));
    return m ? m[1] : null;
  };
  const partsBlock = listOf('MANUAL_PARTS');
  const lists = {
    MANUAL_PARTS: partsBlock == null ? [] :
      [...partsBlock.matchAll(/handles:\s*\[([\s\S]*?)\]/g)].flatMap((m) => strings(m[1])),
    APPENDIX_HANDLES: strings(listOf('APPENDIX_HANDLES') ?? ''),
    BUILD_GUIDE_HANDLES: strings(listOf('BUILD_GUIDE_HANDLES') ?? ''),
  };
  const unreadable = Object.entries(lists).filter(([, v]) => !v.length).map(([k]) => k);
  const files = (await readdir(LEARN_DIR))
    .filter((f) => /\.mdx?$/.test(f) && !/^index\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ''));
  const where = new Map();   // handle -> where the site lists it
  const note = (h, src) => where.set(h, [...(where.get(h) ?? []), src]);
  for (const [name, hs] of Object.entries(lists)) for (const h of hs) note(h, `manual.ts ${name}`);
  for (const h of files) note(h, 'learn/ file');
  return { where, files: new Set(files), unreadable };
}

/** Stop the build when the spine and the site's manual disagree. Returns
 *  nothing; exits 1 with a list of what to fix. Shared with to-epub. */
async function checkSpine() {
  const { where, files, unreadable } = await siteManualHandles();
  const spine = SPINE.flatMap((g) => g.handles);
  const inSpine = new Set(spine);
  const webOnly = new Set(WEB_ONLY);
  const problems = [];

  for (const name of unreadable) {
    problems.push(`could not read ${name} from src/data/manual.ts (the list changed shape; update siteManualHandles)`);
  }
  for (const h of spine.filter((x, i) => spine.indexOf(x) !== i)) {
    problems.push(`"${h}" is in SPINE twice`);
  }
  for (const h of spine) {
    if (webOnly.has(h)) problems.push(`"${h}" is in both SPINE and WEB_ONLY: pick one`);
    if (!files.has(h)) problems.push(`"${h}" is in SPINE but there is no src/content/docs/learn/${h}.md(x)`);
  }
  for (const h of WEB_ONLY) {
    if (!where.has(h)) problems.push(`"${h}" is in WEB_ONLY but the site has no such page: remove it`);
  }
  for (const [h, src] of where) {
    if (!inSpine.has(h) && !webOnly.has(h)) {
      problems.push(`"${h}" is on the site (${src.join(', ')}) but in neither SPINE nor WEB_ONLY`);
    }
  }
  if (!problems.length) return;

  console.error('\n  SPINE CHECK FAILED: the book\'s page list and the site\'s manual disagree.');
  for (const p of problems) console.error(`    - ${p}`);
  console.error('  Every manual page must be in SPINE (in the book) or in WEB_ONLY (site only).');
  console.error('  Both lists are at the top of scripts/to-book/collect.mjs.\n');
  process.exit(1);
}

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
 *  prose around them stays; a "see the website" note is added separately.
 *
 *  Two leftovers go with a stripped widget, because without it they point at
 *  nothing (see stripWidgetLeftovers): the paragraph that tells the reader how
 *  to operate it, and a heading that sat directly on top of it. */
function sanitizeBody(html) {
  let h = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<canvas\b[\s\S]*?<\/canvas>/gi, '')
    .replace(/<model-viewer\b[\s\S]*?<\/model-viewer>/gi, WIDGET_GONE)
    .replace(/<model-viewer\b[^>]*\/?>/gi, WIDGET_GONE)
    // Stylesheets linked from INSIDE the body (Expressive Code puts its own next
    // to every code block). They load late, after Paged.js has already measured
    // the page, so the code block grows and pushes the last lines of the page
    // past the bottom edge, where they are clipped and lost. book.css styles
    // code blocks itself.
    .replace(/<link\b[^>]*rel="stylesheet"[^>]*>/gi, '')
    // Starlight's heading anchors: a chain-link icon plus a screen-reader label
    // after every section heading. A click target on the web; on paper it
    // printed as a stray icon beside each heading.
    .replace(/<a\b[^>]*class="[^"]*\bsl-anchor-link\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
  // drop the whole interactive-viewer containers (their innards stall Paged.js)
  for (const cls of ['parts-viewer', 'parts-gallery']) h = stripDivByClass(h, cls, WIDGET_GONE);
  return stripWidgetLeftovers(h);
}

/** Left where an interactive widget was stripped, so the cleanup below can see
 *  where it used to be. Never reaches the output. */
const WIDGET_GONE = '<!--book:widget-gone-->';

/** Words that only make sense with a pointer on a live widget. */
const POINTER_VERBS = ['drag', 'click', 'scroll', 'toggle', 'slide'];

/** On a page that HAD an interactive widget:
 *   - drop a paragraph that is operating instructions for it (two or more
 *     different pointer verbs: "drag to orbit, scroll to zoom, click a part…");
 *   - drop a section heading that sat directly on the widget (the heading
 *     titled the widget, and would print with nothing under it).
 *  Pages without a widget are returned untouched. */
function stripWidgetLeftovers(html) {
  if (!html.includes(WIDGET_GONE)) return html;
  let h = html.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, (p) => {
    const text = p.replace(/<[^>]+>/g, ' ').toLowerCase();
    const verbs = POINTER_VERBS.filter((v) => new RegExp(`\\b${v}\\b`).test(text));
    return verbs.length >= 2 ? '' : p;
  });
  const gone = WIDGET_GONE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  h = h.replace(new RegExp(
    `<div class="sl-heading-wrapper[^"]*">\\s*<h[2-6]\\b[^>]*>[\\s\\S]*?<\\/h[2-6]>\\s*<\\/div>(\\s*${gone})`, 'gi'), '$1');
  return h.split(WIDGET_GONE).join('');
}

/** Remove every <div class="…cls…">…</div> (depth-aware) from the HTML,
 *  leaving `marker` (default: nothing) where each one was. */
function stripDivByClass(html, cls, marker = '') {
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
    out = out.slice(0, open) + marker + out.slice(end);
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

/** The built HTML of one spine page. A spine page with no built page, or with
 *  no content block, is an ERROR: skipping it would renumber every chapter
 *  after it and the book would still build. Shared with to-epub. */
async function readBuiltPage(handle) {
  const file = path.join(DIST, 'learn', handle, 'index.html');
  const fail = (why) => {
    console.error(`\n  MISSING CHAPTER: "${handle}" is in SPINE but ${why}.`);
    console.error(`  Looked for ${path.relative(ROOT, file)}. Nothing was written.\n`);
    process.exit(1);
  };
  if (!(await exists(file))) fail('the build has no page for it');
  const html = await readFile(file, 'utf8');
  if (divInner(html, '<div class="sl-markdown-content"') == null) fail('its built page has no content block (sl-markdown-content)');
  return html;
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
  // dist/ must exist AND be newer than the sources (see lib/fresh-dist.mjs).
  await assertFreshDist({
    allowStale: process.argv.includes('--allow-stale'),
    tool: PRESS ? 'npm run book:press' : 'npm run book',
  });

  await checkSpine();

  const cssHrefs = new Set();
  const cssBlocks = new Set();
  const entries = [];   // { group, kind, handle, title, desc, bodyInner }

  for (const group of SPINE) {
    for (const handle of group.handles) {
      const html = await readBuiltPage(handle);
      const inner = divInner(html, '<div class="sl-markdown-content"');
      linkHrefs(headOf(html), cssHrefs);
      styleInners(headOf(html), cssBlocks);
      entries.push({
        group, kind: group.kind, handle,
        title: firstH1(html) || handle,
        desc: metaDesc(html),
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
      // The web page's "N min read" is not carried over: reading time is web chrome.
      const meta = `<span>makerphones.com/learn/${e.handle}</span>`;
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
  const guards = await readFile(path.join(ROOT, 'scripts', 'to-book', 'paged-guards.js'), 'utf8');

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
  <div class="bt-kicker">makerphones</div>
  <hr class="bt-rule">
  <h1 class="bt-title">${BOOK_TITLE}</h1>
  <p class="bt-sub">${BOOK_SUBTITLE}</p>
  <div class="bt-author">${AUTHOR}</div>
</section>

<section class="book-copyright">
  <p class="cr-title">${BOOK_TITLE}</p>
  <p>${EDITION} · ${EDITION_YEAR}</p>${REVISION ? `\n  <p>${REVISION}</p>` : ''}
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
  <p>${BOOK_TITLE} was generated from the makerphones reference manual, an
  open Astro + Starlight site, by a single build step that reuses the same
  content, diagrams, and design tokens as the website — one source, many
  outputs.</p>
  <p>The text is set in <strong>Source Serif 4</strong>; headings in
  <strong>Schibsted Grotesk</strong>; technical labels, captions, and folios
  in <strong>JetBrains Mono</strong>. Every figure is a hand-built vector
  diagram, drawn for this manual.</p>
  <p>${IMPRINT} · makerphones.com</p>
</section>

<!-- Paged.js paginates this document in the browser and under the headless renderer.
     auto:false so paged-guards.js can register its handler first; it starts the preview. -->
<script>window.PagedConfig = { auto: false };</script>
<script src="${pagedSrc}"></script>
<script>
${guards}
</script>
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
  console.log('');
}

/* Shared with scripts/to-epub (the EPUB build reuses the spine + the same
 * chapter assembly so web, print, and ebook stay one source). */
export {
  SPINE, WEB_ONLY, checkSpine, readBuiltPage, WEB_NOTE, partsBlock, divInner, plain, exists,
  firstH1, metaDesc, sanitizeBody, stripDivByClass,
  processFigures, linkChapterRefs, buildIndex, stripModernSelectors,
  BOOK_TITLE, BOOK_SUBTITLE, AUTHOR, COPYRIGHT_HOLDER, IMPRINT,
  ISBN_PAPERBACK, ISBN_EBOOK, DIST, ROOT, STYLES,
};

// Run the assembler only when invoked directly — not when imported by to-epub.
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
