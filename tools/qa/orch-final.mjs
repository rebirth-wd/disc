import { chromium } from 'playwright';
import fs from 'fs';
const pages = { home: '/', services: '/services', plans: '/plans', careers: '/careers', launch: '/launch' };
const b = await chromium.launch();
const out = {};
for (const [name, path] of Object.entries(pages)) {
  const ref = JSON.parse(fs.readFileSync(`/home/claude/ref/${name}/info.json`));
  const cut = name === 'careers' ? [3172, 6718] : null; // omitted job-listings block
  const refR = ref.outline.filter((o) => o.d <= 3 && o.r[2] >= 1000).map((o) => { let y = o.r[1]; if (cut) { if (y >= cut[0] && y < cut[0] + cut[1]) return null; if (y >= cut[0] + cut[1]) y -= cut[1]; } return [y, o.r[3], o.cls.slice(0, 30)]; }).filter(Boolean);
  const refH = ref.height - (cut ? cut[1] : 0);
  for (const w of [1680, 1280, 768, 390]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 1000 } })).newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 120)));
    await p.goto('http://127.0.0.1:4400' + path, { waitUntil: 'load' }); await p.waitForTimeout(1200);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 700) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(40); }
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
    const d = await p.evaluate(() => ({
      secs: [...document.querySelectorAll('[data-section]')].filter((el) => !el.parentElement.closest('[data-section]') || el.tagName === 'SECTION').map((el) => { const r = el.getBoundingClientRect(); return [el.dataset.section, Math.round(r.y + scrollY), Math.round(r.height), Math.round(r.width)]; }).filter((s) => s[3] >= 1000 || innerWidth < 1000),
      sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, vw: innerWidth }));
    if (w === 1680) {
      let ok = 0, rows = [];
      for (const s of d.secs) { const m = refR.find((r) => Math.abs(r[0] - s[1]) <= 3 && Math.abs(r[1] - s[2]) <= 3); if (m) ok++; rows.push(`${s[0]} y${s[1]} h${s[2]} ${m ? 'OK' : 'NO-MATCH'}`); }
      console.log(`\n== ${name} 1680: doc ${d.sh} vs ref ${refH} (${(100 * (1 - Math.abs(d.sh - refH) / refH)).toFixed(2)}%) | sections matched within 3px: ${ok}/${d.secs.length}`);
      rows.filter((r) => /NO-MATCH/.test(r)).forEach((r) => console.log('   ', r));
      await p.screenshot({ path: `out/orch/final-${name}.png` });
    }
    console.log(`   w${w}: scrollWidth ${d.sw}/${d.vw} ${d.sw > d.vw ? 'OVERFLOW' : 'ok'} | errors ${errs.length} ${errs[0] || ''}`);
    await p.close();
  }
}
await b.close();
