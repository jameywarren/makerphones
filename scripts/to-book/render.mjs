#!/usr/bin/env node
/**
 * to-book/render.mjs — headless PDF render for the book.
 *
 * Serves dist/ on an ephemeral port (so the /_astro/* absolute asset paths
 * resolve), opens the assembled book in a system Chrome, lets the vendored
 * Paged.js polyfill paginate it, prints to PDF, and — optionally — converts
 * to CMYK with Ghostscript.
 *
 *   node scripts/to-book/render.mjs             screen -> dist/book.pdf
 *   node scripts/to-book/render.mjs --press     7x10+bleed -> dist/book-press.pdf
 *   node scripts/to-book/render.mjs --press --cmyk   ...then -> dist/book-press-cmyk.pdf
 *
 * Why drive Puppeteer directly instead of pagedjs-cli: a 200+ page book
 * paginates in one long CDP call, which trips puppeteer's default
 * protocolTimeout (pagedjs-cli hard-codes its launch opts and can't raise
 * it). Here protocolTimeout is disabled and we await Paged.js's `after` hook.
 *
 * Browser: puppeteer-core never downloads Chromium. We point it at a system
 * Chrome via auto-detection (or CHROME_PATH / PUPPETEER_EXECUTABLE_PATH). On
 * GitHub Actions the runner's preinstalled google-chrome is found
 * automatically; Chrome launches with --no-sandbox so it works in CI.
 *
 * --cmyk needs Ghostscript on PATH (`brew install ghostscript` / apt). It's a
 * CMYK color conversion, not a validated PDF/X-1a (PLAN.md Phase 5).
 *
 * Assemble the HTML first: `node scripts/to-book/collect.mjs [--press]`.
 */

import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const DIST = path.join(ROOT, 'dist');

const PRESS = process.argv.includes('--press');
const CMYK = process.argv.includes('--cmyk');
const htmlFile = PRESS ? 'book-press.html' : 'book.html';
const rgbPdf = path.join(DIST, PRESS ? 'book-press.pdf' : 'book.pdf');
const cmykPdf = path.join(DIST, 'book-press-cmyk.pdf');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.xml': 'application/xml',
};

/** Find a usable Chrome/Chromium without downloading one. */
function findChrome() {
  const env = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (env && existsSync(env)) return env;
  const candidates = process.platform === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
       '/Applications/Chromium.app/Contents/MacOS/Chromium',
       '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
    : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
       '/usr/bin/chromium-browser', '/usr/bin/chromium', '/snap/bin/chromium'];
  return candidates.find((c) => existsSync(c)) ?? null;
}

function serve() {
  const server = http.createServer(async (req, res) => {
    try {
      const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let fp = path.join(DIST, rel);
      if ((await stat(fp)).isDirectory()) fp = path.join(fp, 'index.html');
      res.writeHead(200, { 'content-type': MIME[path.extname(fp)] ?? 'application/octet-stream' });
      createReadStream(fp).pipe(res);
    } catch {
      res.writeHead(404); res.end('not found');
    }
  });
  return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function hasGhostscript() {
  try { await run('gs', ['--version']); return true; } catch { return false; }
}

async function renderPdf(chrome, url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chrome,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    protocolTimeout: 0,          // a 200+ page book paginates in one long call
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
    // Wait for Paged.js: pages appear, then the count holds steady for ~3s.
    // (The polyfill's `after` hook is unreliable here; stability is robust.)
    await page.waitForFunction('document.querySelectorAll(".pagedjs_page").length > 0',
      { timeout: 180000, polling: 500 });
    let last = -1, stable = 0;
    for (let t = 0; t < 1200; t += 1) {
      const c = await page.$$eval('.pagedjs_page', (els) => els.length);
      if (c === last) { if (++stable >= 6) break; } else { stable = 0; last = c; }
      await new Promise((r) => setTimeout(r, 500));
    }
    await page.pdf({ path: rgbPdf, printBackground: true, preferCSSPageSize: true, timeout: 0 });
    return last;
  } finally {
    await browser.close();
  }
}

async function main() {
  if (!existsSync(path.join(DIST, htmlFile))) {
    console.error(`  ${htmlFile} not found — run \`node scripts/to-book/collect.mjs${PRESS ? ' --press' : ''}\` first.`);
    process.exit(1);
  }
  const chrome = findChrome();
  if (!chrome) {
    console.error('\n  No Chrome/Chromium found. Install Google Chrome, or set CHROME_PATH /');
    console.error('  PUPPETEER_EXECUTABLE_PATH to a Chrome executable.');
    process.exit(1);
  }

  const server = await serve();
  const port = server.address().port;
  const url = `http://localhost:${port}/${htmlFile}`;
  try {
    console.log(`\n  chrome:  ${chrome}`);
    console.log(`  serving dist/ on :${port}`);
    console.log(`  rendering ${htmlFile} -> ${path.relative(ROOT, rgbPdf)} (paginating…)`);
    const pages = await renderPdf(chrome, url);
    console.log(`  ✓ ${path.relative(ROOT, rgbPdf)}  (${pages} pages)`);

    if (CMYK) {
      if (!(await hasGhostscript())) {
        console.log('\n  --cmyk skipped: Ghostscript not found. Install with `brew install ghostscript`.');
      } else {
        console.log(`  converting to CMYK -> ${path.relative(ROOT, cmykPdf)}…`);
        await run('gs', [
          '-dBATCH', '-dNOPAUSE', '-dSAFER', '-sDEVICE=pdfwrite',
          '-dProcessColorModel=/DeviceCMYK', '-sColorConversionStrategy=CMYK',
          '-dOverrideICC=true', '-dRenderIntent=1',
          `-sOutputFile=${cmykPdf}`, rgbPdf,
        ]);
        console.log(`  ✓ ${path.relative(ROOT, cmykPdf)}`);
        console.log('  NOTE: CMYK conversion, not a validated PDF/X-1a (PLAN.md Phase 5).');
      }
    }
  } finally {
    server.close();
  }
}

main().catch((err) => { console.error('\n  render failed:', err.message); process.exit(1); });
