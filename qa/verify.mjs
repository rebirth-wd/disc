// Regression gate. OWNED BY THE ORCHESTRATOR: sub-agents run it, only the orchestrator edits it.
//   npm run verify                 build + compare against the local baseline (qa/baseline/)
//   npm run verify -- --no-build   compare the existing dist
//   npm run verify:baseline        build + record a new baseline (per machine; baselines are not committed)
// Checks per page: top-level [data-section] y/height at 1680/1280/768/390, document height, horizontal
// overflow, console/page errors, and full-page reduced-motion screenshots at 1680 and 390 (pixel diff).
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
const QA = path.dirname(fileURLToPath(import.meta.url)),
  REPO = path.dirname(QA);
const args = process.argv.slice(2),
  mode = args.includes('baseline') ? 'baseline' : 'compare';
const BASE = `${QA}/baseline`,
  out = mode === 'baseline' ? BASE : `${QA}/output`;
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
if (!args.includes('--no-build')) {
  try {
    execSync('npx astro build', { cwd: REPO, stdio: 'pipe' });
  } catch (e) {
    console.log('BUILD FAILED\n' + (e.stdout + '' + e.stderr).slice(-3000));
    process.exit(1);
  }
}
const root = fs.existsSync(`${REPO}/dist/client/index.html`)
  ? `${REPO}/dist/client`
  : `${REPO}/dist`;
const types = {
  html: 'text/html',
  js: 'text/javascript',
  css: 'text/css',
  json: 'application/json',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  woff2: 'font/woff2',
  ico: 'image/x-icon',
  xml: 'application/xml',
  txt: 'text/plain',
};
const srv = http
  .createServer((q, s) => {
    let p = decodeURIComponent(q.url.split('?')[0]);
    let f = path.join(root, p);
    if (!f.startsWith(root)) {
      s.writeHead(403);
      return s.end();
    }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
    if (!fs.existsSync(f)) {
      s.writeHead(404);
      return s.end('404');
    }
    s.writeHead(200, { 'content-type': types[f.split('.').pop()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(s);
  })
  .listen(4455, '127.0.0.1');
const routes = JSON.parse(fs.readFileSync(`${QA}/verify-routes.json`));
const b = await chromium.launch();
const data = {};
for (const [key, route] of Object.entries(routes)) {
  for (const w of [1680, 1280, 768, 390]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 1000 } })).newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160)));
    const r = await p.goto('http://127.0.0.1:4455' + route, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 800) {
      await p.evaluate((v) => scrollTo(0, v), y);
      await p.waitForTimeout(30);
    }
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(200);
    data[`${key}@${w}`] = {
      status: r.status(),
      errs,
      ...(await p.evaluate(() => ({
        doc: document.documentElement.scrollHeight,
        sw: document.documentElement.scrollWidth,
        secs: Object.fromEntries(
          [...document.querySelectorAll('[data-section]')]
            .filter((el) => !el.parentElement.closest('[data-section]'))
            .map((el) => {
              const q = el.getBoundingClientRect();
              return [el.dataset.section, [Math.round(q.y + scrollY), Math.round(q.height)]];
            }),
        ),
      }))),
    };
    await p.close();
  }
  for (const w of [1680, 390]) {
    const p = await (
      await b.newContext({ viewport: { width: w, height: 1000 }, reducedMotion: 'reduce' })
    ).newPage();
    await p.goto('http://127.0.0.1:4455' + route, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 800) {
      await p.evaluate((v) => scrollTo(0, v), y);
      await p.waitForTimeout(60);
    }
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/${key}-${w}.png`, fullPage: true });
    await p.close();
  }
}
await b.close();
srv.close();
fs.writeFileSync(`${out}/data.json`, JSON.stringify(data));
if (mode === 'baseline') {
  console.log('baseline saved');
  process.exit(0);
}
const base = JSON.parse(fs.readFileSync(`${BASE}/data.json`));
let fail = 0;
const say = (m) => {
  fail++;
  console.log('FAIL', m);
};
for (const k of Object.keys(base)) {
  const A = base[k],
    B = data[k];
  if (!B) {
    say(`${k}: missing`);
    continue;
  }
  if (B.status !== 200) say(`${k}: HTTP ${B.status}`);
  if (B.errs.length) say(`${k}: ${B.errs.length} console/page error(s): ${B.errs[0]}`);
  if (B.sw > +k.split('@')[1]) say(`${k}: horizontal overflow ${B.sw}`);
  if (Math.abs(A.doc - B.doc) > 1) say(`${k}: document height ${A.doc} -> ${B.doc}`);
  for (const [n, v] of Object.entries(A.secs)) {
    const t = B.secs[n];
    if (!t) say(`${k}: section "${n}" missing`);
    else if (Math.abs(t[0] - v[0]) > 1 || Math.abs(t[1] - v[1]) > 1)
      say(`${k}: ${n} y/h ${v} -> ${t}`);
  }
}
const LIMIT = +(process.env.PIXEL_LIMIT || 0.3);
for (const key of Object.keys(routes))
  for (const w of [1680, 390]) {
    const a = PNG.sync.read(fs.readFileSync(`${BASE}/${key}-${w}.png`)),
      c = PNG.sync.read(fs.readFileSync(`${out}/${key}-${w}.png`));
    if (a.width !== c.width || a.height !== c.height) {
      say(`${key}-${w}.png size ${a.width}x${a.height} -> ${c.width}x${c.height}`);
      continue;
    }
    const d = new PNG({ width: a.width, height: a.height });
    const n = pixelmatch(a.data, c.data, d.data, a.width, a.height, { threshold: 0.1 });
    const pct = (100 * n) / (a.width * a.height);
    fs.writeFileSync(`${out}/diff-${key}-${w}.png`, PNG.sync.write(d));
    console.log(
      `${pct > LIMIT ? 'FAIL' : 'ok  '} pixels ${key}-${w}: ${pct.toFixed(3)}% differ${pct > LIMIT ? ` (see ${out}/diff-${key}-${w}.png)` : ''}`,
    );
    if (pct > LIMIT) fail++;
  }
console.log(fail ? `\nVERIFY FAILED: ${fail} problem(s)` : '\nVERIFY PASSED');
process.exit(fail ? 1 : 0);
