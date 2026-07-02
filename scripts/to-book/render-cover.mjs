#!/usr/bin/env node
/**
 * to-book/render-cover.mjs — headless render of the full-wrap print cover.
 *
 * Serves project/book/cover/ (so cover-print.html can load covers.js +
 * fr-svgs.js + the Google fonts), opens the print wrap in a system Chrome,
 * waits for the cover engine + webfonts, prints one page at the exact KDP
 * sheet size (14.885 × 10.25 in, spine 0.635 in @ 282 pp), then — with
 * Ghostscript — converts to CMYK.
 *
 *   node scripts/to-book/render-cover.mjs            -> artifacts/cover-kdp.pdf
 *   node scripts/to-book/render-cover.mjs --cmyk     ...then artifacts/cover-kdp-cmyk.pdf
 *
 * The preview/edit surface stays the Claude Design Cover.html; this is the
 * headless print target driven off the same engine. Re-run after a cover or
 * page-count change (recompute the spine in cover-print.html's --spine).
 */

import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat, mkdir, readFile, rename, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { ROOT, ARTIFACTS } from '../lib/paths.mjs';

const COVER_DIR = path.join(ROOT, 'project', 'book', 'cover');
const CMYK = process.argv.includes('--cmyk');
const FRONT_PNG = process.argv.includes('--front-png'); // front-cover raster for the EPUB
// Ingram's white paper is thicker: spine = 282 x 0.0025 = 0.705in (wrap 14.955in),
// vs KDP's 282 x 0.002252 = 0.635in (wrap 14.885in). --ingram rewrites both on the fly.
const INGRAM = process.argv.includes('--ingram');
const rgbPdf = path.join(ARTIFACTS, INGRAM ? 'cover-ingram.pdf' : 'cover-kdp.pdf');
const cmykPdf = path.join(ARTIFACTS, INGRAM ? 'cover-ingram-cmyk.pdf' : 'cover-kdp-cmyk.pdf');
const ICC = path.join(ROOT, 'scripts', 'to-book', 'pdfx', 'cmyk.icc');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2',
};

function findChrome() {
  const env = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (env && existsSync(env)) return env;
  const c = process.platform === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
       '/Applications/Chromium.app/Contents/MacOS/Chromium']
    : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium-browser', '/usr/bin/chromium'];
  return c.find((p) => existsSync(p)) ?? null;
}

function serve() {
  const server = http.createServer(async (req, res) => {
    try {
      const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const fp = path.join(COVER_DIR, rel);
      await stat(fp);
      res.writeHead(200, { 'content-type': MIME[path.extname(fp)] ?? 'application/octet-stream' });
      if (INGRAM && fp.endsWith('cover-print.html')) {
        const html = (await readFile(fp, 'utf8'))
          .replace('--spine:0.635in', '--spine:0.705in')
          .replace('size:14.885in 10.25in', 'size:14.955in 10.25in');
        res.end(html);
        return;
      }
      createReadStream(fp).pipe(res);
    } catch { res.writeHead(404); res.end('nf'); }
  });
  return new Promise((r) => server.listen(0, () => r(server)));
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}
async function hasGhostscript() { try { await run('gs', ['--version']); return true; } catch { return false; } }

async function main() {
  const chrome = findChrome();
  if (!chrome) { console.error('  No Chrome found (set CHROME_PATH).'); process.exit(1); }
  await mkdir(ARTIFACTS, { recursive: true });
  const server = await serve();
  const port = server.address().port;
  const browser = await puppeteer.launch({
    headless: true, executablePath: chrome,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    protocolTimeout: 0,
  });
  // Chrome embeds subsetted CID/TrueType web fonts in page.pdf() output.
  // IngramSpark's RIP mishandles those subsets and drops glyphs in the cover
  // preview (title vanishes, WARREN LABS -> "ARN ABS", etc). So we render to a
  // raw intermediate, then flatten ALL text to vector outlines with
  // Ghostscript's -dNoOutputFonts: no fonts left to choke on, art unchanged.
  let rawPdf = null;
  try {
    const page = await browser.newPage();
    if (FRONT_PNG) await page.setViewport({ width: 1600, height: 1120, deviceScaleFactor: 2.6 });
    await page.goto(`http://localhost:${port}/cover-print.html`, { waitUntil: 'networkidle0', timeout: 60000 });
    // wait for the cover engine to fill the panels, then for webfonts to load
    await page.waitForFunction(
      "document.getElementById('wrap-front') && document.getElementById('wrap-front').children.length > 0 && document.getElementById('wrap-back').children.length > 0",
      { timeout: 20000, polling: 200 });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await new Promise((r) => setTimeout(r, 600));
    if (FRONT_PNG) {
      const out = path.join(ARTIFACTS, 'epub-cover.png');
      await (await page.$('.panel.front')).screenshot({ path: out });
      console.log(`  ✓ ${path.relative(ROOT, out)}  (front cover, EPUB)`);
    } else {
      rawPdf = rgbPdf.replace(/\.pdf$/, '.raw.pdf');
      await page.pdf({ path: rawPdf, printBackground: true, preferCSSPageSize: true, timeout: 0 });
    }
  } finally {
    await browser.close(); server.close();
  }
  if (!rawPdf) return; // FRONT_PNG path is complete

  const gsOK = await hasGhostscript();

  // RGB deliverable — text flattened to outlines (no embedded fonts).
  if (gsOK) {
    await run('gs', [
      '-dBATCH', '-dNOPAUSE', '-dSAFER', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
      '-dNoOutputFonts',                         // convert all text to vector paths
      `-sOutputFile=${rgbPdf}`, rawPdf,
    ]);
    console.log(`  ✓ ${path.relative(ROOT, rgbPdf)}  (text outlined)`);
  } else {
    await rename(rawPdf, rgbPdf);
    console.log(`  ⚠ ${path.relative(ROOT, rgbPdf)} — Ghostscript missing: text NOT outlined (fonts embedded)`);
  }

  // CMYK deliverable — outline + CMYK conversion in one pass.
  if (CMYK) {
    if (!gsOK) console.log('  CMYK skipped: no Ghostscript.');
    else if (!existsSync(ICC)) console.log(`  CMYK skipped: ICC missing at ${path.relative(ROOT, ICC)}.`);
    else {
      await run('gs', [
        '-dBATCH', '-dNOPAUSE', '-dSAFER', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
        '-dNoOutputFonts',                         // convert all text to vector paths
        '-dProcessColorModel=/DeviceCMYK', '-sColorConversionStrategy=CMYK',
        '-dOverrideICC=true', '-dRenderIntent=1',
        '-dTransferFunctionInfo=/Remove',          // strip transfer curves (IngramSpark preflight warning)
        `-sOutputFile=${cmykPdf}`, rawPdf,
      ]);
      console.log(`  ✓ ${path.relative(ROOT, cmykPdf)}  (CMYK, text outlined — print-ready)`);
    }
  }

  if (existsSync(rawPdf)) await rm(rawPdf, { force: true });
}

main().catch((err) => { console.error('\n  render-cover failed:', err.message); process.exit(1); });
