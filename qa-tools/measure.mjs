// Usage: node measure.mjs <url> '<css selector>' [more selectors...]
// Prints page-absolute rect [x,y,w,h] + key computed styles for each match (max 12 per selector).
import { chromium } from 'playwright';
const [url, ...sels] = process.argv.slice(2);
const local = /127\.0\.0\.1|localhost/.test(url);
const b = await chromium.launch(local ? {} : { proxy: { server: process.env.HTTPS_PROXY } });
const p = await (await b.newContext({ viewport: { width: 1680, height: 1000 }, locale: 'en-US',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' })).newPage();
await p.goto(url, { waitUntil: local ? 'load' : 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(local ? 800 : 5000);
const res = await p.evaluate((sels) => sels.map((sel) => ({ sel, m: [...document.querySelectorAll(sel)].slice(0, 12).map((el) => {
  const r = el.getBoundingClientRect(), s = getComputedStyle(el);
  return { r: [r.x, r.y + scrollY, r.width, r.height].map(Math.round), t: (el.innerText || '').trim().slice(0, 50),
    ff: s.fontFamily.split(',')[0], fs: s.fontSize, fw: s.fontWeight, lh: s.lineHeight, ls: s.letterSpacing, c: s.color,
    bg: s.backgroundColor, bgi: s.backgroundImage.slice(0, 200), br: s.borderRadius, pad: s.padding, mar: s.margin, gap: s.gap,
    disp: s.display, pos: s.position, tf: s.transform, op: s.opacity, bf: s.backdropFilter, tr: s.transition.slice(0, 120) };
}) })), sels);
console.log(JSON.stringify(res, null, 1));
await b.close();
