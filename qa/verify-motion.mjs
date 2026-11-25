// Motion-liveness gate. OWNED BY THE ORCHESTRATOR: sub-agents run it, only the orchestrator edits it.
//   npm run verify:motion             compare the current dist (run `npm run verify` or `npm run build` first)
//   npm run verify:motion -- baseline record qa/motion-baseline.json (committed: element counts, not pixels)
// For every top-level [data-section] on every page (1680px, normal motion): scroll it to the viewport centre,
// sample computed transform + opacity of every descendant 10 times over ~5s (with a small scroll nudge so
// scroll-scrubbed objects move), and count the elements that changed. Counts are compared with the
// pre-restructure site. A section whose animations stopped (or started) shows up as a count change.
import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const QA = path.dirname(fileURLToPath(import.meta.url)),
  REPO = path.dirname(QA);
const args = process.argv.slice(2);
const base = args.includes('baseline');
const root0 = args.find((a) => a.startsWith('--root='))?.slice(7) || `${REPO}/dist`;
const root = fs.existsSync(`${root0}/client/index.html`) ? `${root0}/client` : root0;
const routes = JSON.parse(
  fs.readFileSync(
    args.find((a) => a.startsWith('--routes='))?.slice(9) || `${QA}/verify-routes.json`,
  ),
);
const BASELINE = `${QA}/motion-baseline.json`,
  file = base
    ? args.find((a) => a.startsWith('--out='))?.slice(6) || BASELINE
    : `${QA}/output/motion.json`;
fs.mkdirSync(path.dirname(file), { recursive: true });
const types = {
  html: 'text/html',
  js: 'text/javascript',
  css: 'text/css',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  woff2: 'font/woff2',
};
const srv = http
  .createServer((q, s) => {
    let f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) {
      s.writeHead(404);
      return s.end();
    }
    s.writeHead(200, { 'content-type': types[f.split('.').pop()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(s);
  })
  .listen(4466, '127.0.0.1');
const b = await chromium.launch();
const res = {};
for (const [key, route] of Object.entries(routes)) {
  const p = await (await b.newContext({ viewport: { width: 1680, height: 1000 } })).newPage();
  await p.goto('http://127.0.0.1:4466' + route, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  const names = await p.evaluate(() =>
    [...document.querySelectorAll('[data-section]')]
      .filter((el) => !el.parentElement.closest('[data-section]'))
      .map((el) => el.dataset.section),
  );
  for (const name of names) {
    const y = await p.evaluate((n) => {
      const el = document.querySelector(`[data-section="${n}"]`),
        r = el.getBoundingClientRect();
      return Math.max(0, Math.round(r.top + scrollY + r.height / 2 - innerHeight / 2));
    }, name);
    await p.evaluate((v) => scrollTo(0, v), y);
    await p.waitForTimeout(700);
    const snap = () =>
      p.evaluate(
        (n) =>
          [...document.querySelector(`[data-section="${n}"]`).querySelectorAll('*')].map((el) => {
            const s = getComputedStyle(el);
            return s.transform + '|' + s.opacity;
          }),
        name,
      );
    const first = await snap();
    const moved = new Set();
    for (let i = 0; i < 10; i++) {
      await p.waitForTimeout(500);
      if (i === 4) await p.evaluate((v) => scrollTo(0, v + 60), y);
      const cur = await snap();
      cur.forEach((v, k) => v !== first[k] && moved.add(k));
    }
    res[`${key}/${name}`] = moved.size;
  }
  await p.close();
}
await b.close();
srv.close();
fs.writeFileSync(file, JSON.stringify(res, null, 1));
if (base) {
  console.log('motion baseline saved', file);
  process.exit(0);
}
const A = JSON.parse(fs.readFileSync(BASELINE));
let fail = 0;
for (const [k, a] of Object.entries(A)) {
  const c = res[k];
  const tol = Math.max(2, Math.round(a * 0.15));
  const bad = c === undefined || Math.abs(c - a) > tol || (a > 0 && c === 0);
  if (bad) fail++;
  console.log(`${bad ? 'FAIL' : 'ok  '} ${k}: animating elements ${a} -> ${c}`);
}
console.log(fail ? `\nMOTION VERIFY FAILED: ${fail} section(s)` : '\nMOTION VERIFY PASSED');
process.exit(fail ? 1 : 0);
