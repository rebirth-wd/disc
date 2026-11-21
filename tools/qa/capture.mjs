// Capture reference pages: screenshots, DOM outline, GSAP/ScrollTrigger inventory.
import { chromium } from 'playwright';
import fs from 'fs';

const pages = {
  home: 'https://discord.com/',
  download: 'https://discord.com/download',
  nitro: 'https://discord.com/nitro',
  careers: 'https://discord.com/careers',
  quests: 'https://discord.com/ads/quests',
};
const only = process.argv[2];
const out = '/home/claude/ref';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  proxy: { server: process.env.HTTPS_PROXY },
  args: ['--ignore-gpu-blocklist', '--use-gl=swiftshader'],
});

for (const [name, url] of Object.entries(pages)) {
  if (only && only !== name) continue;
  const ctx = await browser.newContext({
    viewport: { width: 1680, height: 1000 },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await ctx.newPage();
  const scripts = [];
  page.on('response', (r) => {
    const u = r.url();
    if (/\.(js|css)(\?|$)/.test(u)) scripts.push(u);
  });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(6000);
    const dir = `${out}/${name}`;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/final-url.txt`, page.url() + '\n' + (await page.title()));

    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    // viewport-step screenshots while scrolling (captures scroll-triggered states)
    let i = 0;
    for (let y = 0; y < height; y += 900) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${dir}/vp-${String(i).padStart(2, '0')}.png` });
      i++;
      if (i > 40) break;
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${dir}/full.png`, fullPage: true });

    const info = await page.evaluate(() => {
      const r = (el) => {
        const b = el.getBoundingClientRect();
        return [Math.round(b.x), Math.round(b.y + scrollY), Math.round(b.width), Math.round(b.height)];
      };
      const cs = (el) => {
        const s = getComputedStyle(el);
        return {
          ff: s.fontFamily.split(',')[0], fs: s.fontSize, fw: s.fontWeight, lh: s.lineHeight,
          ls: s.letterSpacing, tt: s.textTransform, c: s.color, bg: s.backgroundColor,
          bgi: s.backgroundImage.slice(0, 160), br: s.borderRadius, pad: s.padding,
          disp: s.display, pos: s.position, gap: s.gap, bf: s.backdropFilter, ta: s.textAlign,
        };
      };
      const outline = [];
      const walk = (el, depth) => {
        if (depth > 7) return;
        for (const ch of el.children) {
          const b = ch.getBoundingClientRect();
          if (b.width < 40 || b.height < 20) continue;
          const tag = ch.tagName.toLowerCase();
          if (['script', 'style', 'noscript'].includes(tag)) continue;
          const txt = [...ch.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').slice(0, 120);
          outline.push({ d: depth, tag, cls: (ch.className && ch.className.toString().slice(0, 90)) || '', id: ch.id || '', r: r(ch), txt, s: depth < 5 || /^h\d|p|a|button$/.test(tag) ? cs(ch) : undefined });
          walk(ch, depth + 1);
        }
      };
      walk(document.body, 0);
      const text = [...document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,label')].map((el) => ({
        tag: el.tagName.toLowerCase(), t: el.innerText?.trim().slice(0, 300), r: r(el), s: cs(el),
      })).filter((x) => x.t);
      const media = [...document.querySelectorAll('img,video,svg,canvas,lottie-player,[data-animation-type]')].map((el) => ({
        tag: el.tagName.toLowerCase(), src: (el.currentSrc || el.src || el.getAttribute('data-src') || '').toString().slice(0, 200),
        alt: el.alt || '', r: r(el), cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 80),
      })).filter((m) => m.r[2] > 30 && m.r[3] > 30);
      // GSAP inventory
      let gs = null;
      try {
        const g = window.gsap;
        if (g) {
          const desc = (t) => ({
            type: t.constructor?.name, dur: t.duration?.(), delay: t.delay?.(), rep: t.repeat?.(),
            vars: t.vars ? JSON.parse(JSON.stringify(t.vars, (k, v) => (typeof v === 'function' ? 'fn' : v instanceof Element ? `<${v.tagName.toLowerCase()} .${(v.className || '').toString().slice(0, 50)}>` : k === 'scrollTrigger' && v && typeof v === 'object' ? { ...v, trigger: v.trigger instanceof Element ? `<${v.trigger.tagName.toLowerCase()} .${(v.trigger.className || '').toString().slice(0, 60)}>` : v.trigger } : v))) : null,
            targets: t.targets ? t.targets().slice(0, 4).map((e) => (e instanceof Element ? `<${e.tagName.toLowerCase()} .${(e.className?.baseVal ?? e.className ?? '').toString().slice(0, 70)}>` : typeof e)) : undefined,
            nTargets: t.targets ? t.targets().length : undefined,
            children: t.getChildren ? t.getChildren(false, true, true).slice(0, 30).map(desc) : undefined,
          });
          const ST = window.ScrollTrigger;
          gs = {
            version: g.version,
            timeline: g.globalTimeline.getChildren(false, true, true).slice(0, 300).map((t) => { try { return desc(t); } catch (e) { return { err: String(e) }; } }),
            scrollTriggers: ST ? ST.getAll().map((st) => ({
              trigger: st.trigger ? `<${st.trigger.tagName.toLowerCase()} .${(st.trigger.className || '').toString().slice(0, 70)}>` : null,
              start: st.start, end: st.end,
              vars: JSON.parse(JSON.stringify(st.vars, (k, v) => (typeof v === 'function' ? 'fn' : v instanceof Element ? 'el' : k === 'animation' ? undefined : v))),
              hasAnim: !!st.animation, pin: !!st.pin,
            })) : 'no ScrollTrigger global',
          };
        }
      } catch (e) { gs = { err: String(e) }; }
      const cssAnims = document.getAnimations ? document.getAnimations().slice(0, 200).map((a) => ({
        name: a.animationName || a.transitionProperty || a.constructor.name,
        target: a.effect?.target ? `<${a.effect.target.tagName.toLowerCase()} .${(a.effect.target.className?.baseVal ?? a.effect.target.className ?? '').toString().slice(0, 60)}>` : null,
        timing: a.effect?.getTiming ? (({ duration, delay, iterations, easing, direction }) => ({ duration, delay, iterations: String(iterations), easing, direction }))(a.effect.getTiming()) : null,
      })) : [];
      const globals = ['gsap', 'ScrollTrigger', 'Webflow', 'lottie', 'bodymovin', 'Lenis', 'SplitText', 'Flip', 'rive', 'THREE', 'jQuery'].filter((k) => k in window);
      const ix = [...document.querySelectorAll('[data-w-id],[data-gsap],[data-animation],[data-scroll]')].length;
      return { height: document.documentElement.scrollHeight, outline, text, media, gs, cssAnims, globals, ixCount: ix, fonts: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`) };
    });
    fs.writeFileSync(`${dir}/info.json`, JSON.stringify(info, null, 1));
    fs.writeFileSync(`${dir}/page.html`, await page.content());
    fs.writeFileSync(`${dir}/assets.txt`, [...new Set(scripts)].join('\n'));
    console.log(name, page.url(), 'height', info.height, 'globals', info.globals.join(','), 'gsap', info.gs?.version, 'ST', Array.isArray(info.gs?.scrollTriggers) ? info.gs.scrollTriggers.length : info.gs?.scrollTriggers, 'tweens', info.gs?.timeline?.length, 'cssAnims', info.cssAnims.length, 'shots', i);
  } catch (e) {
    console.log(name, 'ERROR', String(e).slice(0, 300));
  }
  await ctx.close();
}
await browser.close();
