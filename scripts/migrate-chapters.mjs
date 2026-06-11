#!/usr/bin/env node
/**
 * One-time migration: _source/maker-phones-chapters-1-13.html
 *   -> src/content/docs/learn/<handle>.md (one file per chapter)
 *
 * Faithful conversion per the Content & Style Guide:
 *  - internal "Part X | Chapter Y | Handle" header lines and the
 *    article-footer (difficulty / prerequisites / related / Shopify
 *    metadata) fold into frontmatter; never rendered as body copy
 *  - /pages/<handle> links rewrite to /learn/<handle>/
 *  - "Common Mistakes"-style sections keep their subhead and wrap
 *    in a :::caution aside
 *  - read_time computed at 150 wpm (the guide's 1,200–1,800 words
 *    ≈ 8–12 min equivalence); source HTML carries no read time
 *  - difficulty outside the Beginner|Intermediate|Advanced enum is
 *    coerced to the upper bound and reported for the editorial pass
 *
 * Anomalies (dangling handles, coerced values, free-text prereqs)
 * print in the report — they belong in CONTENT-TODO.md, not silently
 * fixed here. Kept in the repo for provenance.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const SRC = new URL('../_source/maker-phones-chapters-1-13.html', import.meta.url);
const OUT_DIR = new URL('../src/content/docs/learn/', import.meta.url);

/** Frozen handles from the Content & Style Guide appendix. */
const FROZEN_HANDLES = new Set([
  // Part 1
  'how-headphones-create-sound', 'understanding-frequency-response',
  'impedance-and-sensitivity', 'open-vs-closed-back-design',
  'headphone-form-factors', 'driver-technologies',
  // Part 2
  'driver-selection-guide', 'sourcing-components',
  'acoustic-chambers-and-enclosures', 'ear-pads-and-comfort',
  'damping-materials', 'cables-connectors-hardware',
  // Part 3
  'design-methodology', '3d-design-for-headphones', 'acoustic-chamber-design',
  'driver-mounting-and-assembly', 'damping-strategy-and-application',
  // Part 4
  'why-measure-headphones', 'budget-measurement-setup',
  'taking-and-interpreting-measurements', 'tuning-with-damping',
  'advanced-measurement-topics',
  // Part 5
  'acoustic-modeling', 'resonance-control', 'manufacturing-for-consistency',
  'professional-design-insights',
  // Part 6
  'bluetooth-integration', 'active-noise-cancelling',
  'microphone-integration', 'custom-iem-design',
]);

const DIFFICULTY_ENUM = new Set(['Beginner', 'Intermediate', 'Advanced']);
const WPM = 150;

const report = { chapters: [], anomalies: [] };
const anomaly = (handle, msg) => report.anomalies.push(`[${handle}] ${msg}`);

// ---- inline HTML -> Markdown -------------------------------------------

function decodeEntities(s) {
  return s
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&'); // last, so &amp;nbsp; etc. can't double-decode
}

function rewriteHref(href, handle) {
  const m = href.match(/^\/pages\/([a-z0-9-]+)$/);
  if (!m) return href;
  if (!FROZEN_HANDLES.has(m[1])) {
    anomaly(handle, `link to non-frozen handle "${m[1]}" (kept; will 404 until resolved)`);
  }
  return `/learn/${m[1]}/`;
}

function inline(html, handle) {
  let s = html.replace(/\s+/g, ' ').trim();
  s = s.replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => {
    return `[${text.trim()}](${rewriteHref(href, handle)})`;
  });
  s = s.replace(/<strong>([\s\S]*?)<\/strong>/g, (_, t) => `**${t.trim()}**`);
  s = s.replace(/<em>([\s\S]*?)<\/em>/g, (_, t) => `*${t.trim()}*`);
  s = s.replace(/<code>([\s\S]*?)<\/code>/g, (_, t) => `\`${t.trim()}\``);
  const leftover = s.match(/<[^>]+>/);
  if (leftover) anomaly(handle, `unhandled inline tag ${leftover[0]}`);
  return decodeEntities(s);
}

// ---- body block conversion ----------------------------------------------

const MISTAKES_RE = /^common\b.*\b(mistakes?|misconceptions?)\b/i;

function bodyToMarkdown(html, handle) {
  const blocks = [];
  const re = /<(h2|h3|p|ul|ol)>([\s\S]*?)<\/\1>|<hr\s*\/?>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!m[1]) continue; // bare <hr> — visual divider, drop
    const [, tag, content] = m;
    if (tag === 'h2') blocks.push({ type: 'h2', text: inline(content, handle) });
    else if (tag === 'h3') blocks.push({ type: 'h3', text: inline(content, handle) });
    else if (tag === 'p') blocks.push({ type: 'p', text: inline(content, handle) });
    else {
      const items = [...content.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((li) =>
        inline(li[1], handle)
      );
      blocks.push({ type: tag, items });
    }
  }

  const out = [];
  let inCaution = false;
  for (const b of blocks) {
    if (b.type === 'h2' && inCaution) {
      out.push(':::');
      inCaution = false;
    }
    if (b.type === 'h2') {
      out.push(`## ${b.text}`);
      if (MISTAKES_RE.test(b.text)) {
        out.push(':::caution');
        inCaution = true;
      }
    } else if (b.type === 'h3') out.push(`### ${b.text}`);
    else if (b.type === 'p') out.push(b.text);
    else if (b.type === 'ul') out.push(b.items.map((i) => `- ${i}`).join('\n'));
    else if (b.type === 'ol')
      out.push(b.items.map((i, n) => `${n + 1}. ${i}`).join('\n'));
  }
  if (inCaution) out.push(':::');
  return out.join('\n\n') + '\n';
}

// ---- footer parsing -------------------------------------------------------

function parseFooter(footerHtml, handle) {
  const diffMatch = footerHtml.match(
    /<strong>Difficulty:<\/strong>\s*([^<&]+?)\s*&nbsp;/
  );
  let difficulty = diffMatch ? diffMatch[1].trim() : null;
  if (difficulty && !DIFFICULTY_ENUM.has(difficulty)) {
    const coerced = difficulty.includes('Intermediate') ? 'Intermediate' : 'Beginner';
    anomaly(handle, `difficulty "${difficulty}" coerced to "${coerced}"`);
    difficulty = coerced;
  }

  const prereqSeg = footerHtml.match(
    /<strong>Prerequisites:<\/strong>([\s\S]*?)<\/p>/
  )?.[1] ?? '';
  const prerequisites = [...prereqSeg.matchAll(/href="\/pages\/([a-z0-9-]+)"/g)].map(
    (x) => x[1]
  );
  const prereqText = decodeEntities(prereqSeg.replace(/<[^>]+>/g, '').trim());
  if (prerequisites.length === 0 && !/^none/i.test(prereqText)) {
    anomaly(handle, `free-text prerequisite kept out of frontmatter: "${prereqText}"`);
  }

  const relatedSeg = footerHtml.match(/<h3>Related Articles<\/h3>\s*<ul>([\s\S]*?)<\/ul>/)?.[1] ?? '';
  const related = [...relatedSeg.matchAll(/href="\/pages\/([a-z0-9-]+)"/g)].map((x) => x[1]);
  for (const r of [...prerequisites, ...related]) {
    if (!FROZEN_HANDLES.has(r))
      anomaly(handle, `frontmatter references non-frozen handle "${r}" (kept)`);
  }

  const metaHandle = footerHtml.match(/Handle:\s*<code>([a-z0-9-]+)<\/code>/)?.[1];
  const tags = (footerHtml.match(/Tags:\s*([^<]+)<br>/)?.[1] ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const description = decodeEntities(
    (footerHtml.match(/Meta description:\s*([^<]+)<br>/)?.[1] ?? '').trim()
  );
  const excerpt = decodeEntities(
    (footerHtml.match(/Excerpt:\s*([\s\S]*?)<\/p>/)?.[1] ?? '').replace(/\s+/g, ' ').trim()
  );

  return { difficulty, prerequisites, related, metaHandle, tags, description, excerpt };
}

// ---- YAML emit -------------------------------------------------------------

const yStr = (s) => `"${s.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
const yList = (a) => `[${a.join(', ')}]`;

function frontmatter(f) {
  return [
    '---',
    `title: ${yStr(f.title)}`,
    `handle: ${f.handle}`,
    `part: ${f.part}`,
    `chapter: ${f.chapter}`,
    `difficulty: ${f.difficulty}`,
    `prerequisites: ${yList(f.prerequisites)}`,
    `related: ${yList(f.related)}`,
    `read_time: ${f.read_time}`,
    `tags: ${yList(f.tags)}`,
    `description: ${yStr(f.description)}`,
    `excerpt: ${yStr(f.excerpt)}`,
    '---',
  ].join('\n');
}

// ---- main -------------------------------------------------------------------

const html = await readFile(SRC, 'utf8');
await mkdir(OUT_DIR, { recursive: true });

const chapterRe =
  /<div class="chapter-section" id="ch(\d+)">\s*<div class="chapter-header">\s*<h2>([\s\S]*?)<\/h2>\s*<p>([\s\S]*?)<\/p>\s*<\/div>([\s\S]*?)<\/article>\s*<\/div>/g;

let count = 0;
let m;
while ((m = chapterRe.exec(html)) !== null) {
  const [, , rawTitle, headerLine, rest] = m;
  const title = decodeEntities(rawTitle.trim());

  const hl = decodeEntities(headerLine).replace(/\s+/g, ' ');
  const hm = hl.match(/Part (\d+):.*?\| Chapter (\d+) \| Handle: \/pages\/([a-z0-9-]+)/);
  if (!hm) throw new Error(`Unparseable chapter header: ${hl}`);
  const [, part, chapter, handle] = hm;
  if (!FROZEN_HANDLES.has(handle)) throw new Error(`Header handle not frozen: ${handle}`);

  const articleMatch = rest.match(
    /<article class="maker-phones-chapter">([\s\S]*)$/
  );
  if (!articleMatch) throw new Error(`No article body for ${handle}`);
  const split = articleMatch[1].split(/<hr>\s*<div class="article-footer">/);
  if (split.length !== 2) throw new Error(`Footer split failed for ${handle}`);
  const [bodyHtml, footerHtml] = split;

  const footer = parseFooter(footerHtml, handle);
  if (footer.metaHandle !== handle)
    anomaly(handle, `footer handle mismatch: ${footer.metaHandle}`);

  const body = bodyToMarkdown(bodyHtml, handle);
  const words = body
    .replace(/[#*`[\]():-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const read_time = Math.max(1, Math.round(words / WPM));

  if (/\b30 years\b/i.test(body))
    anomaly(handle, 'body contains outdated "30 years" bio (migrated faithfully — CONTENT-TODO)');

  const md =
    frontmatter({
      title,
      handle,
      part: Number(part),
      chapter: Number(chapter),
      difficulty: footer.difficulty,
      prerequisites: footer.prerequisites,
      related: footer.related,
      read_time,
      tags: footer.tags,
      description: footer.description,
      excerpt: footer.excerpt,
    }) +
    '\n\n' +
    body;

  await writeFile(new URL(`${handle}.md`, OUT_DIR), md);
  report.chapters.push({ handle, part: Number(part), chapter: Number(chapter), words, read_time });
  count++;
}

if (count !== 13) throw new Error(`Expected 13 chapters, converted ${count}`);

console.log('Converted chapters:');
for (const c of report.chapters)
  console.log(
    `  P${c.part} ch${String(c.chapter).padStart(2)}  ${c.handle.padEnd(34)} ${String(c.words).padStart(5)} words  ${c.read_time} min`
  );
console.log(`\nAnomalies (${report.anomalies.length}) — track in CONTENT-TODO.md, do not fix in migration:`);
for (const a of [...new Set(report.anomalies)]) console.log(`  - ${a}`);
