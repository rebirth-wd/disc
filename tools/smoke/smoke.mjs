// Smoke test: serves the existing build (dist/client) and checks the five routes, the old-URL redirects,
// basic SEO tags and horizontal overflow. Builds nothing: run `npm run build` first.
//   npm run test:smoke
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 4477;
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ROOT = path.join(REPO, 'dist/client');
const ROUTES = ['/', '/services', '/plans', '/careers', '/launch'];
const REDIRECTS = { '/download': '/services', '/nitro': '/plans', '/ads/quests': '/launch' };
const WIDTHS = [320, 390, 768, 1280, 1680];

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error('dist/client/index.html not found: run "npm run build" first.');
  process.exit(1);
}

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
  xml: 'application/xml',
  txt: 'text/plain',
};
const server = http
  .createServer((req, res) => {
    let file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) return res.writeHead(404).end('404');
    res.writeHead(200, { 'content-type': types[file.split('.').pop()] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, '127.0.0.1');

const failures = [];
const ok = (label) => console.log('ok   ' + label);
const fail = (label, why) => {
  failures.push(label + ': ' + why);
  console.log('FAIL ' + label + ': ' + why);
};

// Cloudflare reads dist/client/_redirects: "<from> <to> <status>" per line.
const redirectsFile = path.join(ROOT, '_redirects');
const rules = fs.existsSync(redirectsFile)
  ? fs
      .readFileSync(redirectsFile, 'utf8')
      .split('\n')
      .map((line) => line.trim().split(/\s+/))
      .filter((parts) => parts.length >= 3)
  : [];
for (const [from, to] of Object.entries(REDIRECTS)) {
  const rule = rules.find((r) => r[0] === from);
  if (!rule) fail('redirect ' + from, '_redirects has no rule');
  else if (rule[1] !== to || !/^30[18]$/.test(rule[2])) fail('redirect ' + from, rule.join(' ') + ' (expected ' + to + ' 301)');
  else ok('redirect ' + from + ' -> ' + to + ' (' + rule[2] + ')');
}

const browser = await chromium.launch();
try {
  for (const route of ROUTES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const problems = [];
    page.on('console', (m) => m.type() === 'error' && problems.push('console error: ' + m.text()));
    page.on('pageerror', (e) => problems.push('page error: ' + e.message));
    page.on('requestfailed', (r) => problems.push('request failed: ' + r.url()));
    page.on('response', (r) => r.status() >= 400 && problems.push(r.status() + ' ' + r.url()));

    const response = await page.goto('http://127.0.0.1:' + PORT + route, { waitUntil: 'load' });
    if (response.status() !== 200) fail(route, 'status ' + response.status());
    await page.waitForTimeout(500);
    problems.length ? fail(route + ' loads clean', problems.join('; ')) : ok(route + ' returns 200, no errors or failed requests');

    const seo = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      title: document.title.trim(),
      description: document.querySelector('meta[name="description"]')?.content.trim() ?? '',
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
    }));
    const missing = [];
    if (seo.h1 !== 1) missing.push(seo.h1 + ' h1');
    if (!seo.title) missing.push('no title');
    if (!seo.description) missing.push('no meta description');
    if (!seo.canonical) missing.push('no canonical');
    missing.length ? fail(route + ' SEO', missing.join(', ')) : ok(route + ' SEO: one h1, title, description, canonical');

    const over = [];
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(100);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > width) over.push(width + 'px (scrollWidth ' + sw + ')');
    }
    over.length ? fail(route + ' overflow', over.join(', ')) : ok(route + ' no horizontal overflow at ' + WIDTHS.join('/'));
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log(failures.length ? '\nSMOKE FAILED (' + failures.length + ')' : '\nSMOKE PASSED');
process.exit(failures.length ? 1 : 0);
