#!/usr/bin/env node
/**
 * to-book/render-parts.mjs — render static stills of the Daily Driver from the
 * GLBs, so the print book can show the parts that the interactive 3D viewer
 * shows on the web.
 *
 *   node scripts/to-book/render-parts.mjs
 *
 * Renders, into public/book/parts/ (served by Astro at /book/parts/*, so both
 * the site and the book can use them):
 *   - daily-driver.png          assembled, 3/4 view
 *   - daily-driver-exploded.png exploded along each group's outward direction
 *                               (from builds/daily-driver/docs/models/daily-driver.groups.json)
 *
 * collect.mjs uses these automatically: if the stills exist, the
 * daily-driver-parts chapter shows them as figures (plus a "see the website"
 * line); otherwise it falls back to a web-only note. Regenerate after a CAD
 * change; the author can also hand-replace these PNGs with nicer renders.
 *
 * Browser: puppeteer-core + a system Chrome, with software WebGL (SwiftShader)
 * so it runs headless / in CI. three.js + GLTFLoader load from a CDN at render
 * time (needs network). Models: builds/daily-driver/docs/models/.
 */

import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const MODELS = path.join(ROOT, 'builds', 'daily-driver', 'docs', 'models');
const OUTDIR = path.join(ROOT, 'public', 'book', 'parts');
const THREE = 'https://unpkg.com/three@0.160.0';

const MIME = { '.glb': 'model/gltf-binary', '.json': 'application/json', '.html': 'text/html' };

function findChrome() {
  const env = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (env && existsSync(env)) return env;
  const c = process.platform === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
       '/Applications/Chromium.app/Contents/MacOS/Chromium']
    : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium-browser', '/usr/bin/chromium'];
  return c.find((p) => existsSync(p)) ?? null;
}

function serveModels() {
  const server = http.createServer(async (req, res) => {
    try {
      const fp = path.join(MODELS, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      await stat(fp);
      res.writeHead(200, {
        'content-type': MIME[path.extname(fp)] ?? 'application/octet-stream',
        'access-control-allow-origin': '*',   // the setContent page is about:blank origin
      });
      createReadStream(fp).pipe(res);
    } catch { res.writeHead(404); res.end('nf'); }
  });
  return new Promise((r) => server.listen(0, () => r(server)));
}

/** The in-page render routine (runs in Chrome). Returns when the frame is drawn. */
function pageHtml(glbUrl, groups, explode) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}</style>
<script type="importmap">{"imports":{"three":"${THREE}/build/three.module.js","three/addons/":"${THREE}/examples/jsm/"}}</script>
</head>
<body><canvas id="c" width="1600" height="1200"></canvas>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
window.__done = false; window.__err = null;
const GROUPS = ${JSON.stringify(groups)};
const EXPLODE = ${explode ? 'true' : 'false'};
(async () => {
  try {
    const W = 1600, H = 1200;
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(W, H, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#faf8f5');
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa0a6, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(3, 4, 5); scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5); fill.position.set(-4, 1, -2); scene.add(fill);
    const gltf = await new GLTFLoader().loadAsync('${glbUrl}');
    const root = gltf.scene;
    // center the model
    let box = new THREE.Box3().setFromObject(root);
    const center0 = box.getCenter(new THREE.Vector3());
    root.position.sub(center0);
    root.updateMatrixWorld(true);
    if (EXPLODE && GROUPS && GROUPS.length) {
      const worldCenter = new THREE.Vector3(0, 0, 0);
      for (const g of GROUPS) {
        // group centroid (world)
        const gc = new THREE.Vector3(); let n = 0;
        for (const name of g.nodes) {
          const o = root.getObjectByName(name);
          if (o) { gc.add(o.getWorldPosition(new THREE.Vector3())); n++; }
        }
        if (!n) continue;
        gc.multiplyScalar(1 / n);
        const dir = gc.clone().sub(worldCenter); if (dir.lengthSq() < 1e-6) continue;
        dir.normalize().multiplyScalar(box.getSize(new THREE.Vector3()).length() * 0.22);
        // move each node in the group outward (parents are identity transforms)
        for (const name of g.nodes) { const o = root.getObjectByName(name); if (o) o.position.add(dir); }
      }
      root.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(root);
      const c2 = box.getCenter(new THREE.Vector3()); root.position.sub(c2);
    }
    scene.add(root);
    box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const cam = new THREE.PerspectiveCamera(32, W / H, 0.01, 1000);
    const maxDim = Math.max(size.x, size.y, size.z);
    const dist = (maxDim / 2) / Math.tan((Math.PI * cam.fov) / 360) * 1.5;
    cam.position.set(dist * 0.85, dist * 0.5, dist * 1.0); cam.lookAt(0, 0, 0);
    renderer.render(scene, cam);
    window.__done = true;
  } catch (e) { window.__err = String(e && e.stack || e); window.__done = true; }
})();
</script></body></html>`;
}

async function renderOne(browser, server, glb, groups, explode, outPath) {
  const port = server.address().port;
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 1 });
  await page.setContent(pageHtml(`http://localhost:${port}/${glb}`, groups, explode), { waitUntil: 'load' });
  await page.waitForFunction('window.__done === true', { timeout: 60000, polling: 200 });
  const err = await page.evaluate(() => window.__err);
  if (err) throw new Error(err);
  await mkdir(path.dirname(outPath), { recursive: true });
  const el = await page.$('#c');
  await el.screenshot({ path: outPath });
  await page.close();
  console.log(`  ✓ ${path.relative(ROOT, outPath)}`);
}

async function main() {
  if (!existsSync(path.join(MODELS, 'daily-driver.glb'))) {
    console.error(`  daily-driver.glb not found in ${path.relative(ROOT, MODELS)}.`);
    process.exit(1);
  }
  const chrome = findChrome();
  if (!chrome) { console.error('  No Chrome found (set CHROME_PATH / PUPPETEER_EXECUTABLE_PATH).'); process.exit(1); }

  let groups = [];
  const gp = path.join(MODELS, 'daily-driver.groups.json');
  if (existsSync(gp)) { try { groups = JSON.parse(await readFile(gp, 'utf8')).groups ?? []; } catch {} }

  const server = await serveModels();
  const browser = await puppeteer.launch({
    headless: true, executablePath: chrome,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle',
      '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
    protocolTimeout: 0,
  });
  try {
    console.log(`\n  chrome: ${chrome}\n  rendering Daily Driver stills -> ${path.relative(ROOT, OUTDIR)}/`);
    await renderOne(browser, server, 'daily-driver.glb', groups, false, path.join(OUTDIR, 'daily-driver.png'));
    // --explode is opt-in: the group node names in daily-driver.groups.json
    // need to be reconciled with the GLB's actual (mirrored L/R) node names
    // before the offsets separate the parts. Off by default until then.
    if (process.argv.includes('--explode')) {
      await renderOne(browser, server, 'daily-driver.glb', groups, true, path.join(OUTDIR, 'daily-driver-exploded.png'));
    }
    console.log('\n  Done. Re-run `npm run book` to embed; hand-replace the PNGs for nicer renders.\n');
  } finally {
    await browser.close(); server.close();
  }
}

main().catch((err) => { console.error('\n  render-parts failed:', err.message); process.exit(1); });
