#!/usr/bin/env node
/**
 * to-epub/build.mjs — assemble the manual into a reflowable EPUB 3.
 *
 * A fourth output target (web · print · ebook), built from the SAME source: it
 * reuses the Astro-built dist/ chapter HTML and the to-book spine + chapter
 * assembly (collect.mjs exports), then repackages each chapter as a standalone
 * XHTML document inside an EPUB 3 container — reflowable, with the inline SVG
 * diagrams carried over, the three self-hosted fonts embedded, a navigable
 * TOC, and the ebook ISBN in the metadata.
 *
 *   astro build && node scripts/to-epub/build.mjs   -> dist/book.epub
 *
 * Why a separate pipeline from to-book: print is fixed-layout (Paged.js, @page,
 * folios); an ebook is reflowable (no pages). This drops the page geometry and
 * keeps the content + design tokens. Validation: EPUBCheck needs Java (absent
 * here), so each generated XHTML is parsed with @xmldom/xmldom for XML
 * well-formedness — the failure mode that actually breaks readers. Run the real
 * EPUBCheck before wide distribution.
 */

import { readFile, writeFile, mkdir, copyFile, rm, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { DOMParser } from '@xmldom/xmldom';
import {
  SPINE, divInner, sanitizeBody, processFigures, firstH1, metaDesc,
  buildIndex, WEB_NOTE, exists,
  BOOK_TITLE, BOOK_SUBTITLE, AUTHOR, COPYRIGHT_HOLDER, IMPRINT,
  ISBN_EBOOK, DIST, ROOT,
} from '../to-book/collect.mjs';

const STAGE = path.join(DIST, '_epub');
const OEBPS = path.join(STAGE, 'OEBPS');
const OUT = path.join(DIST, 'book.epub');
const ASTRO = path.join(DIST, '_astro');
const EPUB_ISBN = ISBN_EBOOK.replace(/[^0-9]/g, '');   // 979-8-…-1-0 -> 13 digits
const NOW = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

/* latin woff2 (hashed names) -> stable filenames inside the EPUB */
const FONTS = [
  { prefix: 'schibsted-grotesk-latin-wght-normal', out: 'schibsted-grotesk.woff2', family: 'Schibsted Grotesk' },
  { prefix: 'source-serif-4-latin-wght-normal', out: 'source-serif-4.woff2', family: 'Source Serif 4' },
  { prefix: 'jetbrains-mono-latin-wght-normal', out: 'jetbrains-mono.woff2', family: 'JetBrains Mono' },
];

/* named entities -> numeric (XML keeps only amp/lt/gt/quot/apos) */
const ENT = {
  nbsp: 160, mdash: 8212, ndash: 8211, hellip: 8230, copy: 169, reg: 174, trade: 8482,
  rsquo: 8217, lsquo: 8216, ldquo: 8220, rdquo: 8221, sbquo: 8218, bdquo: 8222,
  times: 215, divide: 247, deg: 176, middot: 183, bull: 8226, prime: 8242, Prime: 8243,
  micro: 181, plusmn: 177, frac12: 189, frac14: 188, frac34: 190, minus: 8722, sup2: 178, sup3: 179,
  rarr: 8594, larr: 8592, uarr: 8593, darr: 8595, harr: 8596, infin: 8734, ne: 8800, le: 8804, ge: 8805,
  asymp: 8776, approx: 8776, Omega: 937, omega: 969, pi: 960, mu: 956, ohm: 8486, alpha: 945, beta: 946,
  lambda: 955, theta: 952, phi: 966, Delta: 916, Sigma: 931, ensp: 8194, emsp: 8195, thinsp: 8201,
  shy: 173, hairsp: 8202, dagger: 8224, sect: 167, para: 182, euro: 8364, pound: 163, cent: 162,
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** HTML body -> XML-well-formed XHTML fragment. */
function toXhtml(html) {
  let h = html;
  // named entities -> numeric (leave the 5 XML-predefined)
  h = h.replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) =>
    (['amp', 'lt', 'gt', 'quot', 'apos'].includes(n) ? m : (ENT[n] != null ? `&#${ENT[n]};` : m)));
  // stray bare ampersands (not starting an entity) -> &amp;
  h = h.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;');
  // self-close void elements
  h = h.replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b([^>]*?)\/?>/gi,
    (_m, tag, attrs) => `<${tag.toLowerCase()}${attrs.replace(/\s+$/, '')} />`);
  // SVG (and MathML) need their namespace declared in XHTML
  h = h.replace(/<svg\b(?![^>]*\bxmlns=)/gi,
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ');
  // boolean attrs -> attr="attr" (XML needs a value)
  h = h.replace(/\s(hidden|disabled|checked|selected|readonly|required|open|controls|loop|muted|autoplay)(?=[\s>])(?!=)/gi,
    (_m, a) => ` ${a.toLowerCase()}="${a.toLowerCase()}"`);
  return h;
}

/** Expressive Code (Starlight's highlighter) renders each code line as
 *  <div class="ec-line"><div class="code">…</div></div> INSIDE <pre><code> — but
 *  <pre>/<code> are phrasing-content only, so EPUBCheck rejects every div (RSC-005).
 *  Rebuild each block as a clean <pre><code> of the plain (already-escaped) text. */
function flattenCodeBlocks(html) {
  return html.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, (block) => {
    const lines = [];
    const re = /<div class="code">([\s\S]*?)<\/div>/gi;
    let m;
    while ((m = re.exec(block)) !== null) lines.push(m[1].replace(/<[^>]+>/g, ''));
    if (!lines.length) return block;                   // plain <pre>, no EC lines — leave as-is
    return `<pre><code>${lines.join('\n')}</code></pre>`;
  });
}

/** Strip web-only chrome that has no place in an ebook. */
function epubClean(html) {
  let h = sanitizeBody(html);                          // scripts, canvas, model-viewer, viewers
  h = h.replace(/<form\b[\s\S]*?<\/form>/gi, '');       // feedback form
  h = h.replace(/<button\b[\s\S]*?<\/button>/gi, '');   // copy-code / UI buttons
  h = h.replace(/<dialog\b[\s\S]*?<\/dialog>/gi, '');
  h = h.replace(/<link\b[^>]*>/gi, '');                 // Expressive Code injects <link ec.css> into the body (RSC-007)
  h = flattenCodeBlocks(h);                             // ec-line divs inside <pre><code> (RSC-005)
  // Starlight wraps each <starlight-*> web component; unwrap unknown custom elements'
  // is risky — leave them (valid as well-formed elements). Drop empty <a> anchor icons:
  h = h.replace(/<a\b[^>]*class="[^"]*sl-anchor-link[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
  return h;
}

/** Rewrite internal /learn/<handle> links to their chapter file; keep #frags. */
function rewriteInternalLinks(html, fileOf) {
  let h = html.replace(/href="([^"]*\/learn\/([a-z0-9-]+)\/?([^"]*))"/gi, (m, _full, handle, rest) => {
    const file = fileOf.get(handle);
    if (!file) return m;                                // not an in-EPUB chapter — handled below
    const frag = rest && rest.startsWith('#') ? rest : '';
    return `href="${file}${frag}"`;
  });
  // Any remaining site-absolute link (/learn/<not-in-epub>, /license/, …) "leaks
  // outside the OCF container" per EPUBCheck (RSC-026) — point it at the live site.
  h = h.replace(/href="\/(?!\/)([^"]*)"/gi, 'href="https://makerphones.com/$1"');
  return h;
}

function xhtmlDoc(title, bodyHtml, { svg = false } = {}) {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<link rel="stylesheet" type="text/css" href="epub.css" />
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

/* ── EPUB stylesheet (reflowable, hex-resolved; tokens for the diagram SVGs) ── */
const EPUB_CSS = `@font-face{font-family:'Schibsted Grotesk';font-weight:400 800;font-display:swap;src:url(fonts/schibsted-grotesk.woff2) format('woff2')}
@font-face{font-family:'Source Serif 4';font-weight:400 700;font-display:swap;src:url(fonts/source-serif-4.woff2) format('woff2')}
@font-face{font-family:'JetBrains Mono';font-weight:400 700;font-display:swap;src:url(fonts/jetbrains-mono.woff2) format('woff2')}
:root{--mp-ink:#111827;--mp-charcoal:#2d3748;--mp-accent:#ea580c;--cover-accent:#ea580c;--mp-accent-text:#c2410c;
--mp-meta:#6b7280;--mp-faint:#9ca3af;--mp-hair:#d1d5db;--mp-ground:#faf8f5;--mp-line:#e7e5e0;--mp-bg:#faf8f5;
--mp-surface:#ffffff;--fr-grid:#d9d6d0;--fr-ink:#2d3748;}
html{font-size:100%}
body{font-family:'Source Serif 4',Georgia,serif;color:#111827;line-height:1.62;margin:0 4%;padding:0;-webkit-hyphens:auto;hyphens:auto}
h1,h2,h3,h4,h5,h6{font-family:'Schibsted Grotesk','Helvetica Neue',sans-serif;color:#2d3748;line-height:1.18;font-weight:700;-webkit-hyphens:none;hyphens:none}
h1{font-size:1.75em;margin:.3em 0 .5em}h2{font-size:1.4em;margin:1.5em 0 .5em}h3{font-size:1.15em;margin:1.3em 0 .4em}h4{font-size:1em}
p{margin:0 0 .9em;orphans:2;widows:2}
a{color:#c2410c;text-decoration:none}
strong{font-weight:700}em{font-style:italic}
code,kbd,samp{font-family:'JetBrains Mono',monospace;font-size:.88em;background:#f1efec;padding:.08em .3em;border-radius:3px}
pre{font-family:'JetBrains Mono',monospace;font-size:.82em;background:#f1efec;padding:.8em 1em;border-radius:6px;white-space:pre-wrap;word-wrap:break-word;line-height:1.45;margin:1em 0}
pre code{background:none;padding:0;font-size:1em}
blockquote{border-left:3px solid #c2410c;margin:1.1em 0;padding:.1em 0 .1em 1em;color:#374151}
ul,ol{margin:0 0 .9em 1.4em;padding:0}li{margin:.3em 0}
hr{border:none;border-top:1px solid #e7e5e0;margin:1.6em 0}
table{border-collapse:collapse;width:100%;margin:1.1em 0;font-size:.9em}
th,td{border:1px solid #e7e5e0;padding:.4em .6em;text-align:left;vertical-align:top}
th{background:#f1efec;font-family:'Schibsted Grotesk',sans-serif;font-weight:600}
img,svg{max-width:100%;height:auto}
figure,.mp-figure{margin:1.5em 0;page-break-inside:avoid;break-inside:avoid;text-align:center}
figure svg,.mp-dgm{display:block;width:100%;height:auto;margin:0 auto}
figcaption,.mp-figcaption{font-family:'JetBrains Mono',monospace;font-size:.74em;color:#6b7280;line-height:1.5;margin-top:.5em;border-top:1px solid #e7e5e0;padding-top:.4em;text-align:left}
.fig-num{color:#c2410c;font-weight:700}
.ch-eyebrow{font-family:'JetBrains Mono',monospace;font-size:.72em;letter-spacing:.14em;text-transform:uppercase;color:#c2410c;margin-bottom:.4em}
.ch-lede{font-size:1.08em;color:#374151;font-style:italic;margin-bottom:.6em}
.ch-meta{font-family:'JetBrains Mono',monospace;font-size:.72em;color:#9ca3af;margin-bottom:.4em}
.ch-meta span{margin-right:1em}
.ch-rule{border-top:2px solid #2d3748;margin:.6em 0 1.4em;width:2.5em}
.xref{color:#6b7280;font-style:italic}
.part-opener{text-align:center;padding:18% 0;page-break-before:always;break-before:page}
.po-kicker{font-family:'JetBrains Mono',monospace;letter-spacing:.22em;text-transform:uppercase;color:#9ca3af;font-size:.8em}
.po-num{font-family:'Schibsted Grotesk',sans-serif;font-size:3em;font-weight:800;color:#c2410c;line-height:1}
.po-title{font-size:1.6em;margin:.2em 0}
.po-rule{width:3em;margin:1.1em auto;border-top:2px solid #2d3748}
.book-chapter,.book-appendix{page-break-before:always;break-before:page}
.book-title-page{text-align:center;padding:16% 0}
.bt-kicker{font-family:'JetBrains Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:#9ca3af;font-size:.8em}
.bt-title{font-size:2.2em;margin:.4em 0}.bt-sub{color:#6b7280;font-style:italic;font-size:1.05em}
.bt-author{font-family:'Schibsted Grotesk',sans-serif;font-weight:600;margin-top:2.4em;font-size:1.15em}
.book-dedication{font-style:italic;text-align:center;padding:14% 0;color:#374151;line-height:1.9}
.cr-isbn{font-family:'JetBrains Mono',monospace;font-size:.85em}
.book-copyright,.book-colophon{font-size:.9em;color:#374151}
.book-index{font-size:.92em}
.ix-group{font-family:'Schibsted Grotesk',sans-serif;font-weight:700;color:#c2410c;margin:1.1em 0 .3em;font-size:1.1em}
.ix-entry{display:flex;justify-content:space-between;gap:1em;border-bottom:1px dotted #e7e5e0;padding:.15em 0}
.ix-folios{color:#6b7280;font-family:'JetBrains Mono',monospace;white-space:nowrap}
.ix-note{color:#6b7280;font-style:italic;font-size:.9em}
.book-web-note{background:#fff4ec;border-left:3px solid #c2410c;padding:.6em 1em;margin:1.1em 0;font-size:.92em}
.cover-img{margin:0;padding:0;text-align:center}
.cover-img img{width:100%;height:auto}
[hidden]{display:none}`;

/* ── front / back matter ───────────────────────────────────────────────── */
const FM = {
  cover: () => xhtmlDoc('Cover',
    `<section class="cover-img" epub:type="cover"><img src="cover.png" alt="${esc(BOOK_TITLE)} — cover" /></section>`),
  title: () => xhtmlDoc('Title Page',
    `<section class="book-title-page"><p class="bt-kicker">Warren Labs</p><h1 class="bt-title">${esc(BOOK_TITLE)}</h1>` +
    `<p class="bt-sub">${esc(BOOK_SUBTITLE)}</p><p class="bt-author">${esc(AUTHOR)}</p></section>`),
  copyright: () => xhtmlDoc('Copyright',
    `<section class="book-copyright"><p>${esc(BOOK_TITLE)}</p><p>First edition &#8226; 2026</p>` +
    `<p>&#169; ${esc(COPYRIGHT_HOLDER)}. Manual text licensed Creative Commons BY-NC 4.0; design files MIT. ` +
    `Full terms in the license appendix and at makerphones.com.</p><p>Published by ${esc(IMPRINT)}.</p>` +
    `<p class="cr-isbn">ISBN ${ISBN_EBOOK} (ebook)</p>` +
    `<p>Set in Schibsted Grotesk, Source Serif 4, and JetBrains Mono.</p>` +
    `<p>Generated from the live manual at makerphones.com. For interactive figures and the 3D parts viewer, visit the website.</p></section>`),
  dedication: () => xhtmlDoc('Dedication',
    `<section class="book-dedication"><p>For Piper and Jessica.</p><p>For my parents, Curt and Margie, and my sister, Jennifer.</p>` +
    `<p>And for all my family, near and far.</p></section>`),
  preface: () => xhtmlDoc('How to use this book',
    `<section class="book-preface"><h2>How to use this book</h2>` +
    `<p>This is a reference manual you can read two ways. Read it front to back and it builds an argument: how headphones make ` +
    `sound, what the parts do, how to design and build an enclosure, how to measure what you made, and how to tune it. Or treat ` +
    `it as a reference &#8212; each chapter names what you should have read first, so you can come in from any direction and find your footing.</p>` +
    `<p>The six numbered parts climb from beginner to advanced. After them, the build guides walk through real headphones end to ` +
    `end, and the appendices collect a glossary, suppliers, resources, sources, troubleshooting, and a standing note on listening ` +
    `safely. Figures are numbered by chapter &#8212; Fig. 4.2 is the second figure in Chapter 4.</p>` +
    `<p>Nothing here is theory for its own sake. Every claim that can be measured is, and the curve is shown. Where a value is a ` +
    `judgment call, it says so.</p>` +
    `<p>A few things live only on the website &#8212; most of all the interactive 3D parts viewer. Where the page can&#8217;t carry them, the book points you to makerphones.com.</p></section>`),
  acknowledgments: () => xhtmlDoc('Acknowledgments',
    `<section class="book-acknowledgments"><h2>Acknowledgments</h2><p>This book carries a lot of other people&#8217;s teaching.</p>` +
    `<p>I owe my understanding of headphones, specifically, to <strong>Tyll Hertsens</strong> of HeadRoom. So much of what&#8217;s in ` +
    `these pages traces back to him. Thank you, Tyll.</p>` +
    `<p>My real audio-engineering education came from <strong>Michael and Eben Grace</strong>. Seven years at Grace Design, working ` +
    `directly under the two brothers, taught me more than any classroom could &#8212; I&#8217;ve always called it my University of ` +
    `Rock &amp; Roll. Before that, the Conservatory of Recording Arts &amp; Sciences gave me the formal grounding to build on.</p>` +
    `<p>And to the others &#8212; mentors, colleagues, and friends in this small field &#8212; whose names I&#8217;ll keep adding as I remember them: thank you.</p></section>`),
  about: () => xhtmlDoc('About the author',
    `<section class="book-about-author"><h2>About the author</h2>` +
    `<p><strong>${esc(AUTHOR)}</strong> has spent more than twenty-five years in professional audio and the headphone industry. He ` +
    `was employee #1 at Grace Design (1997&#8211;2001) and consulted for the company through 2003 &#8212; seven years he calls his ` +
    `University of Rock &amp; Roll. From 2003 to 2017 he was VP of Operations and then President &amp; CEO of HeadRoom, where he ` +
    `relaunched the entire headphone-amplifier line and oversaw the testing of thousands of headphones.</p>` +
    `<p>He is now designing his own open-back headphone, the Daily Driver, in the open &#8212; with AI as a design partner &#8212; ` +
    `using the same methods this book teaches. The work, and its measurements, are published at makerphones.com.</p></section>`),
  colophon: () => xhtmlDoc('Colophon',
    `<section class="book-colophon"><h2>Colophon</h2>` +
    `<p>${esc(BOOK_TITLE)} was generated from the Makerphones reference manual, an open Astro + Starlight site, by a single build ` +
    `step that reuses the same content, diagrams, and design tokens as the website &#8212; one source, many outputs.</p>` +
    `<p>The text is set in <strong>Source Serif 4</strong>; headings in <strong>Schibsted Grotesk</strong>; technical labels and ` +
    `captions in <strong>JetBrains Mono</strong>. Every figure is a hand-built vector diagram, drawn for this manual.</p>` +
    `<p>${esc(IMPRINT)} &#8226; makerphones.com</p></section>`),
};

async function findFont(prefix) {
  const files = await readdir(ASTRO);
  return files.find((f) => f.startsWith(prefix) && f.endsWith('.woff2'));
}

function validate(name, xml) {
  const errs = [];
  new DOMParser({ onError: (level, msg) => { if (level === 'error' || level === 'fatalError') errs.push(msg); } })
    .parseFromString(xml, 'application/xhtml+xml');
  return errs.map((e) => `${name}: ${String(e).split('\n')[0].slice(0, 120)}`);
}

async function main() {
  if (!(await exists(DIST))) { console.error('  dist/ not found — run `astro build` first.'); process.exit(1); }
  await rm(STAGE, { recursive: true, force: true });
  await mkdir(path.join(OEBPS, 'fonts'), { recursive: true });
  await mkdir(path.join(STAGE, 'META-INF'), { recursive: true });

  // ── collect chapter entries (spine order) ──
  const entries = [];
  for (const group of SPINE) {
    for (const handle of group.handles) {
      const file = path.join(DIST, 'learn', handle, 'index.html');
      if (!(await exists(file))) continue;
      const html = await readFile(file, 'utf8');
      const inner = divInner(html, '<div class="sl-markdown-content"');
      if (inner == null) continue;
      entries.push({ group, kind: group.kind, handle, title: firstH1(html) || handle, desc: metaDesc(html), bodyInner: inner });
    }
  }
  let chapterNum = 0;
  const handleNum = new Map();
  for (const e of entries) { e.chapterNum = e.kind === 'part' ? (chapterNum += 1) : null; if (e.chapterNum) handleNum.set(e.handle, e.chapterNum); }

  // chapter -> xhtml filename
  const fileOf = new Map();
  entries.forEach((e, i) => fileOf.set(e.handle, `ch-${String(i + 1).padStart(2, '0')}-${e.handle}.xhtml`));

  // ── process each chapter body ──
  const lof = [];
  const notes = WEB_NOTE;          // text-only web notes (no broken /book/parts images)
  for (const e of entries) {
    let body = epubClean(e.bodyInner);
    body = processFigures(body, e.chapterNum, lof);
    body = rewriteInternalLinks(body, fileOf);
    e.body = toXhtml(body);
    e.hasSvg = /<svg\b/.test(e.body);
  }

  // ── build the ordered document list (spine) ──
  const docs = [];     // { id, file, title, props, nav, group }
  const add = (file, title, props, nav, group) => docs.push({ id: file.replace(/\.xhtml$/, '').replace(/[^a-z0-9]/gi, '-'), file, title, props, nav, group });

  add('cover.xhtml', 'Cover', '', null);
  await writeFile(path.join(OEBPS, 'cover.xhtml'), FM.cover());
  for (const [key, title] of [['title', 'Title Page'], ['copyright', 'Copyright'], ['dedication', 'Dedication'], ['preface', 'How to use this book'], ['acknowledgments', 'Acknowledgments']]) {
    const file = `${key}.xhtml`;
    await writeFile(path.join(OEBPS, file), FM[key]());
    add(file, title, '', { label: title, level: 0 });
  }

  // body: a part-opener doc per group, then its chapters
  let partArabic = 0;
  let lastGroup = null;
  for (const e of entries) {
    if (e.group !== lastGroup) {
      lastGroup = e.group;
      const g = e.group;
      const poFile = `po-${docs.length}.xhtml`;
      let opener;
      if (g.kind === 'part') {
        partArabic += 1;
        opener = `<section class="part-opener"><p class="po-kicker">Part</p><p class="po-num">${partArabic}</p>` +
          `<h2 class="po-title">${esc(g.title)}</h2><hr class="po-rule" /></section>`;
      } else {
        opener = `<section class="part-opener"><p class="po-kicker">Reference</p>` +
          `<h2 class="po-title">${esc(g.title)}</h2><hr class="po-rule" /></section>`;
      }
      await writeFile(path.join(OEBPS, poFile), xhtmlDoc(g.title, opener));
      add(poFile, g.kind === 'part' ? `Part ${partArabic} · ${g.title}` : g.title, '', { label: g.kind === 'part' ? `Part ${partArabic}: ${g.title}` : g.title, level: 0, part: true });
    }
    const file = fileOf.get(e.handle);
    const note = notes[e.handle] ? toXhtml(notes[e.handle]) : '';
    let head;
    if (e.kind === 'part') {
      head = `<p class="ch-eyebrow">Chapter ${e.chapterNum}</p><h1>${esc(e.title)}</h1>` +
        (e.desc ? `<p class="ch-lede">${esc(e.desc)}</p>` : '') + `<div class="ch-rule"></div>`;
    } else if (e.kind === 'guides') {
      head = `<p class="ch-eyebrow">Build Guide</p><h1>${esc(e.title)}</h1>` +
        (e.desc ? `<p class="ch-lede">${esc(e.desc)}</p>` : '') + `<div class="ch-rule"></div>`;
    } else {
      head = `<p class="ch-eyebrow">Appendix</p><h1>${esc(e.title)}</h1><div class="ch-rule"></div>`;
    }
    const sect = `<section class="book-chapter" id="${e.handle}">${head}${note}` +
      `<div class="sl-markdown-content">${e.body}</div></section>`;
    await writeFile(path.join(OEBPS, file), xhtmlDoc(e.title, sect, { svg: e.hasSvg }));
    const label = e.kind === 'part' ? `${e.chapterNum}. ${e.title}` : e.title;
    add(file, e.title, e.hasSvg ? 'svg' : '', { label, level: 1 });
  }

  // back matter: index, about, colophon
  const indexHtml = toXhtml(await buildIndex(entries));
  if (indexHtml.trim()) {
    await writeFile(path.join(OEBPS, 'index.xhtml'), xhtmlDoc('Index', indexHtml));
    add('index.xhtml', 'Index', '', { label: 'Index', level: 0 });
  }
  await writeFile(path.join(OEBPS, 'about.xhtml'), FM.about());
  add('about.xhtml', 'About the author', '', { label: 'About the author', level: 0 });
  await writeFile(path.join(OEBPS, 'colophon.xhtml'), FM.colophon());
  add('colophon.xhtml', 'Colophon', '', { label: 'Colophon', level: 0 });

  // ── stylesheet + fonts ──
  await writeFile(path.join(OEBPS, 'epub.css'), EPUB_CSS);
  const fontItems = [];
  for (const f of FONTS) {
    const src = await findFont(f.prefix);
    if (src) { await copyFile(path.join(ASTRO, src), path.join(OEBPS, 'fonts', f.out)); fontItems.push(f.out); }
    else console.warn(`  ! font not found: ${f.prefix}`);
  }

  // ── cover image (rendered by render-cover.mjs --front-png) ──
  const coverSrc = path.join(DIST, 'epub-cover.png');
  let hasCover = false;
  if (await exists(coverSrc)) { await copyFile(coverSrc, path.join(OEBPS, 'cover.png')); hasCover = true; }
  else console.warn('  ! dist/epub-cover.png missing — run `npm run book:cover:epub` first (cover will be a text page)');

  // ── nav.xhtml (EPUB 3 TOC + landmarks) ──
  let toc = '';
  let openPart = false;
  for (const d of docs) {
    if (!d.nav) continue;
    if (d.nav.part) { if (openPart) toc += '</ol></li>'; toc += `<li><a href="${d.file}">${esc(d.nav.label)}</a><ol>`; openPart = true; continue; }
    if (d.nav.level === 1 && openPart) { toc += `<li><a href="${d.file}">${esc(d.nav.label)}</a></li>`; continue; }
    if (openPart) { toc += '</ol></li>'; openPart = false; }
    toc += `<li><a href="${d.file}">${esc(d.nav.label)}</a></li>`;
  }
  if (openPart) toc += '</ol></li>';
  const firstChapter = docs.find((d) => d.nav && d.nav.level === 1)?.file || docs[1].file;
  const nav = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head><meta charset="utf-8" /><title>Contents</title><link rel="stylesheet" type="text/css" href="epub.css" /></head>
<body>
<nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${toc}</ol></nav>
<nav epub:type="landmarks" hidden="hidden"><ol>
<li><a epub:type="cover" href="cover.xhtml">Cover</a></li>
<li><a epub:type="toc" href="nav.xhtml">Contents</a></li>
<li><a epub:type="bodymatter" href="${firstChapter}">Start of content</a></li>
</ol></nav>
</body>
</html>`;
  await writeFile(path.join(OEBPS, 'nav.xhtml'), nav);

  // ── toc.ncx (EPUB 2 fallback) ──
  let np = 0;
  const navPoints = docs.filter((d) => d.nav).map((d) => {
    np += 1;
    return `<navPoint id="np-${np}" playOrder="${np}"><navLabel><text>${esc(d.nav.label)}</text></navLabel><content src="${d.file}" /></navPoint>`;
  }).join('\n');
  const ncx = `<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head>
<meta name="dtb:uid" content="urn:isbn:${EPUB_ISBN}" /><meta name="dtb:depth" content="2" />
<meta name="dtb:totalPageCount" content="0" /><meta name="dtb:maxPageNumber" content="0" /></head>
<docTitle><text>${esc(BOOK_TITLE)}</text></docTitle>
<navMap>${navPoints}</navMap></ncx>`;
  await writeFile(path.join(OEBPS, 'toc.ncx'), ncx);

  // ── content.opf ──
  const manifest = [];
  manifest.push('<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />');
  manifest.push('<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />');
  manifest.push('<item id="css" href="epub.css" media-type="text/css" />');
  for (const f of fontItems) manifest.push(`<item id="font-${f.replace(/\W/g, '-')}" href="fonts/${f}" media-type="font/woff2" />`);
  if (hasCover) manifest.push('<item id="cover-image" href="cover.png" media-type="image/png" properties="cover-image" />');
  for (const d of docs) {
    const props = d.props ? ` properties="${d.props}"` : '';
    manifest.push(`<item id="${d.id}" href="${d.file}" media-type="application/xhtml+xml"${props} />`);
  }
  // nav doc is referenced by the toc landmark, so it must be a spine item (linear="no"
  // keeps it out of the linear reading order) — otherwise EPUBCheck raises RSC-011.
  const spine = [...docs.map((d) => `<itemref idref="${d.id}" />`), '<itemref idref="nav" linear="no" />'].join('\n');
  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="en"
  prefix="schema: http://schema.org/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="pub-id">urn:isbn:${EPUB_ISBN}</dc:identifier>
<dc:title id="t1">${esc(BOOK_TITLE)}</dc:title>
<meta refines="#t1" property="title-type">main</meta>
<dc:title id="t2">${esc(BOOK_SUBTITLE)}</dc:title>
<meta refines="#t2" property="title-type">subtitle</meta>
<dc:creator id="creator">${esc(AUTHOR)}</dc:creator>
<meta refines="#creator" property="role" scheme="marc:relators">aut</meta>
<dc:publisher>${esc(IMPRINT)}</dc:publisher>
<dc:language>en</dc:language>
<dc:date>2026</dc:date>
<dc:rights>© ${esc(COPYRIGHT_HOLDER)}. Text licensed CC BY-NC 4.0.</dc:rights>
<dc:description>${esc(BOOK_SUBTITLE)}</dc:description>
<meta property="dcterms:modified">${NOW}</meta>
<meta property="schema:accessMode">textual</meta>
<meta property="schema:accessMode">visual</meta>
<meta property="schema:accessModeSufficient">textual</meta>
<meta property="schema:accessibilityFeature">structuralNavigation</meta>
<meta property="schema:accessibilityFeature">readingOrder</meta>
<meta property="schema:accessibilityHazard">none</meta>
<meta property="schema:accessibilitySummary">Reflowable text with a navigable table of contents; diagrams are inline SVG with text captions.</meta>
${hasCover ? '<meta name="cover" content="cover-image" />' : ''}
</metadata>
<manifest>
${manifest.join('\n')}
</manifest>
<spine toc="ncx">
${spine}
</spine>
</package>`;
  await writeFile(path.join(OEBPS, 'content.opf'), opf);

  // ── container + mimetype ──
  await writeFile(path.join(STAGE, 'mimetype'), 'application/epub+zip');
  await writeFile(path.join(STAGE, 'META-INF', 'container.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles>
</container>`);

  // ── validate XML well-formedness of every XHTML/XML doc ──
  const problems = [];
  for (const d of [...docs.map((x) => x.file), 'nav.xhtml', 'content.opf', 'toc.ncx']) {
    const p = path.join(OEBPS, d);
    if (await exists(p)) problems.push(...validate(d, await readFile(p, 'utf8')));
  }

  // ── zip per OCF: mimetype stored first, then the rest deflated ──
  await rm(OUT, { force: true });
  const z1 = spawnSync('zip', ['-X', '-0', OUT, 'mimetype'], { cwd: STAGE });
  const z2 = spawnSync('zip', ['-X', '-rg', OUT, 'META-INF', 'OEBPS'], { cwd: STAGE });
  if (z1.status !== 0 || z2.status !== 0) { console.error('  zip failed', z1.stderr?.toString(), z2.stderr?.toString()); process.exit(1); }

  console.log(`\n  to-epub: wrote ${path.relative(ROOT, OUT)}`);
  console.log(`  ${docs.length} documents · ${entries.length} chapters · ${lof.length} figures · ${fontItems.length} fonts embedded · cover: ${hasCover ? 'png' : 'MISSING'}`);
  if (problems.length) {
    console.log(`\n  ⚠ ${problems.length} XML well-formedness issue(s):`);
    for (const p of problems.slice(0, 25)) console.log(`     ${p}`);
  } else {
    console.log('  ✓ all XHTML/OPF/NCX parsed as well-formed XML');
  }
  console.log('  (run the Java EPUBCheck before wide distribution for full EPUB-spec validation)\n');
}

main().catch((err) => { console.error(err); process.exit(1); });
