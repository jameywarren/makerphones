#!/usr/bin/env node
/**
 * to-book/render.mjs — headless PDF render for the book.
 *
 * Serves dist/ on an ephemeral port (so the /_astro/* absolute asset paths
 * resolve), runs pagedjs-cli against the assembled book, and — optionally —
 * converts the result to CMYK with Ghostscript.
 *
 *   node scripts/to-book/render.mjs             screen -> book.pdf
 *   node scripts/to-book/render.mjs --press     7x10+bleed -> book-press.pdf
 *   node scripts/to-book/render.mjs --press --cmyk   ...then -> book-press-cmyk.pdf
 *
 * Prereqs (on the author's machine, not this sandbox):
 *   - pagedjs-cli is fetched on first run via `npx` (pulls a headless
 *     Chromium). No global install needed.
 *   - --cmyk needs Ghostscript on PATH (`brew install ghostscript`).
 *
 * Run `npm run book` / `npm run book:press` FIRST to assemble the HTML.
 * Note: this does a CMYK color conversion, not a full PDF/X-1a (which needs
 * the printer's ICC profile + an output-intent def). See PLAN.md Phase 5.
 */

import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon',
};

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

async function main() {
  const server = await serve();
  const port = server.address().port;
  const url = `http://localhost:${port}/${htmlFile}`;
  try {
    console.log(`\n  serving dist/ on :${port}`);
    console.log(`  rendering ${htmlFile} -> ${path.relative(ROOT, rgbPdf)} (first run fetches Chromium)…`);
    await run('npx', ['-y', 'pagedjs-cli', url, '-o', rgbPdf]);
    console.log(`  ✓ ${path.relative(ROOT, rgbPdf)}`);

    if (CMYK) {
      if (!(await hasGhostscript())) {
        console.log('\n  --cmyk skipped: Ghostscript not found. Install with `brew install ghostscript`.');
      } else {
        console.log(`  converting to CMYK -> ${path.relative(ROOT, cmykPdf)}…`);
        await run('gs', [
          '-dBATCH', '-dNOPAUSE', '-dSAFER', '-sDEVICE=pdfwrite',
          '-dProcessColorModel=/DeviceCMYK',
          '-sColorConversionStrategy=CMYK',
          '-dOverrideICC=true', '-dRenderIntent=1',
          `-sOutputFile=${cmykPdf}`, rgbPdf,
        ]);
        console.log(`  ✓ ${path.relative(ROOT, cmykPdf)}`);
        console.log('  NOTE: this is a CMYK conversion, not a validated PDF/X-1a.');
        console.log('        For press, embed the printer\'s ICC + output intent (PLAN.md Phase 5).');
      }
    }
  } finally {
    server.close();
  }
}

main().catch((err) => { console.error('\n  render failed:', err.message); process.exit(1); });
