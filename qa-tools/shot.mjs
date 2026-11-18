// Usage: node shot.mjs <url> <out.png> [--y=0] [--w=1680] [--h=1000] [--full] [--wait=1500] [--sel=css] [--hover=css]
// Works for both the live reference (https://discord.com/...) and the local build (http://127.0.0.1:4321/...).
import { chromium } from 'playwright';
const [url, out, ...rest] = process.argv.slice(2);
const o = Object.fromEntries(rest.map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const local = /127\.0\.0\.1|localhost/.test(url);
const b = await chromium.launch(local ? {} : { proxy: { server: process.env.HTTPS_PROXY } });
const p = await (await b.newContext({ viewport: { width: +(o.w || 1680), height: +(o.h || 1000) }, locale: 'en-US',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' })).newPage();
p.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 300)));
p.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text().slice(0, 300)));
await p.goto(url, { waitUntil: local ? 'load' : 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(local ? 800 : 5000);
if (o.y) { // scroll in steps so scroll-triggered animations fire like a real visit
  const y = +o.y; for (let s = 0; s <= y; s += 300) { await p.evaluate((v) => scrollTo(0, v), Math.min(s, y)); await p.waitForTimeout(60); }
  await p.evaluate((v) => scrollTo(0, v), y);
}
if (o.hover) await p.hover(o.hover);
await p.waitForTimeout(+(o.wait || 1500));
if (o.sel) await p.locator(o.sel).first().screenshot({ path: out });
else await p.screenshot({ path: out, fullPage: !!o.full });
console.log('saved', out, 'docHeight', await p.evaluate(() => document.documentElement.scrollHeight));
await b.close();
