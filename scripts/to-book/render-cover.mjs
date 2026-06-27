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
 *   node scripts/to-book/render-cover.mjs            -> dist/cover-kdp.pdf
 *   node scripts/to-book/render-cover.mjs --cmyk     ...then dist/cover-kdp-cmyk.pdf
 *
 * The preview/edit surface stays the Claude Design Cover.html; this is the
 * headless print target driven off the same engine. Re-run after a cover or
 * page-count change (recompute the spine in cover-print.html's --spine).
 */

import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const COVER_DIR = path.join(ROOT, 'project', 'book', 'cover');
const DIST = path.join(ROOT, 'dist');
const CMYK = process.argv.includes('--cmyk');
const rgbPdf = path.join(DIST, 'cover-kdp.pdf');
const cmykPdf = path.join(DIST, 'cover-kdp-cmyk.pdf');
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
  await mkdir(DIST, { recursive: true });
  const server = await serve();
  const port = server.address().port;
  const browser = await puppeteer.launch({
    headless: true, executablePath: chrome,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    protocolTimeout: 0,
  });
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}/cover-print.html`, { waitUntil: 'networkidle0', timeout: 60000 });
    // wait for the cover engine to fill the panels, then for webfonts to load
    await page.waitForFunction(
      "document.getElementById('wrap-front') && document.getElementById('wrap-front').children.length > 0 && document.getElementById('wrap-back').children.length > 0",
      { timeout: 20000, polling: 200 });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await new Promise((r) => setTimeout(r, 600));
    await page.pdf({ path: rgbPdf, printBackground: true, preferCSSPageSize: true, timeout: 0 });
    console.log(`  ✓ ${path.relative(ROOT, rgbPdf)}`);
  } finally {
    await browser.close(); server.close();
  }

  if (CMYK) {
    if (!(await hasGhostscript())) { console.log('  CMYK skipped: no Ghostscript.'); return; }
    if (!existsSync(ICC)) { console.log(`  CMYK skipped: ICC missing at ${path.relative(ROOT, ICC)}.`); return; }
    await run('gs', [
      '-dBATCH', '-dNOPAUSE', '-dSAFER', '-sDEVICE=pdfwrite',
      '-dProcessColorModel=/DeviceCMYK', '-sColorConversionStrategy=CMYK',
      '-dOverrideICC=true', '-dRenderIntent=1',
      `-sOutputFile=${cmykPdf}`, rgbPdf,
    ]);
    console.log(`  ✓ ${path.relative(ROOT, cmykPdf)}  (CMYK — KDP-ready)`);
  }
}

main().catch((err) => { console.error('\n  render-cover failed:', err.message); process.exit(1); });
