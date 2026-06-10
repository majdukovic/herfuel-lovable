// HerFuel e2e harness — playwright-core driving system Chrome against the live Lovable app.
// Mobile viewport 402x874. The Lovable "Edit with" badge overlays the bottom-right nav on
// *.lovable.app, so an init script removes it continuously.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const BASE = process.env.HERFUEL_BASE_URL || 'https://sweet-link-system.lovable.app';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SHOTS = path.join(__dirname, '..', 'report', 'shots');

const BADGE_KILLER = `(() => {
  const kill = () => {
    const b = document.getElementById('lovable-badge'); if (b) b.remove();
    document.querySelectorAll('a[href*="lovable.dev"],a[href*="lovable.app"]').forEach(a => {
      const r = a.getBoundingClientRect();
      if (r.top > innerHeight - 140 && r.height < 90) a.remove();
    });
    document.querySelectorAll('div,a').forEach(el => {
      if (el.childElementCount < 4 && /edit with/i.test(el.textContent || '')) {
        const r = el.getBoundingClientRect();
        if (r.top > innerHeight - 140 && r.height > 0 && r.height < 90) el.remove();
      }
    });
  };
  setInterval(kill, 400);
  document.addEventListener('DOMContentLoaded', kill);
  // pre-dismiss the first-launch walkthrough so specs start on Today.
  // spec 01 opts out by setting the test marker, then clears the flag.
  try {
    if (!localStorage.getItem('herfuel.walkthrough.test')) localStorage.setItem('herfuel.walkthrough.v1', 'done');
  } catch (e) {}
})()`;

async function launch() {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: !process.env.HEADED,
  });
  return browser;
}

async function newPage(browser, collect) {
  const ctx = await browser.newContext({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await ctx.addInitScript(BADGE_KILLER);
  const page = await ctx.newPage();
  if (collect) {
    page.on('console', m => { if (m.type() === 'error') collect.consoleErrors.push(m.text().slice(0, 300)); });
    page.on('pageerror', e => collect.pageErrors.push(String(e.message).slice(0, 300)));
    page.on('response', r => {
      if (r.status() >= 400) collect.httpFailures.push(r.status() + ' ' + r.url().slice(0, 160));
      if (/functions\/v1\/(food-search|food-barcode)/.test(r.url())) {
        collect.edgeCalls.push({ fn: r.url().match(/functions\/v1\/([a-z-]+)/)[1], status: r.status() });
      }
    });
  }
  return { ctx, page };
}

// ---------- page helpers ----------

const bodyText = p => p.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());

async function waitText(p, re, timeoutMs = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const t = await bodyText(p);
    if (re.test(t)) return t;
    await p.waitForTimeout(350);
  }
  throw new Error('waitText timeout: ' + re);
}

// Click the deepest visible element whose trimmed text matches. Uses DOM click()
// (works for React handlers + elements under overlays) with a real-mouse fallback.
async function clickText(p, name, opts = {}) {
  const { contains = false, area = null, nth = -1, mouse = false } = opts;
  const pt = await p.evaluate(({ name, contains, area, nth, mouse }) => {
    const H = innerHeight;
    const inArea = r => {
      if (area === 'bottomnav') return r.bottom > H - 110;
      if (area === 'top') return r.top < 120;
      return true;
    };
    let els = [...document.querySelectorAll('button,a,[role=tab],[role=menuitem],[role=button],input[type=submit],span,div,label,h3,p')].filter(el => {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      const ok = contains ? t.toLowerCase().includes(name.toLowerCase()) && t.length < name.length + 80 : t === name;
      if (!ok) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && inArea(r);
    });
    if (!els.length) return null;
    // prefer interactive ancestors-last (deepest), then the requested index
    const el = els.at(nth);
    el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
    const r = el.getBoundingClientRect();
    if (!mouse) el.click();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  }, { name, contains, area, nth, mouse });
  if (!pt) throw new Error('clickText: not found: ' + name);
  if (mouse) {
    // re-measure after scroll settles — smooth scrolling makes the first rect stale
    await p.waitForTimeout(250);
    const fresh = await p.evaluate(({ name, contains, nth }) => {
      const els = [...document.querySelectorAll('button,a,[role=tab],[role=menuitem],[role=button],span,div,label,h3,p')].filter(el => {
        const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        const ok = contains ? t.toLowerCase().includes(name.toLowerCase()) && t.length < name.length + 80 : t === name;
        if (!ok) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      const el = els.at(nth);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    }, { name, contains, nth });
    await p.mouse.click((fresh || pt).x, (fresh || pt).y);
  }
  await p.waitForTimeout(700);
  return pt;
}

// Bottom-nav tab (Today / Meals / Circle / Progress) — real mouse click on coordinates.
async function tab(p, name) {
  const pt = await p.evaluate((name) => {
    let best = null;
    document.querySelectorAll('button,a').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > innerHeight - 110 && r.width > 0 && (el.innerText || '').trim() === name)
        best = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    return best;
  }, name);
  if (!pt) throw new Error('tab not found: ' + name);
  await p.mouse.click(pt.x, pt.y);
  await p.waitForTimeout(1100);
}

// Me page = avatar button top-right (only on Today — go home first if needed).
async function openMe(p) {
  const findAvatar = () => p.evaluate(() => {
    let best = null;
    document.querySelectorAll('button,a').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < 90 && r.left > innerWidth - 95 && r.width > 0)
        best = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    return best;
  });
  let av = await findAvatar();
  if (!av) { await goHome(p); av = await findAvatar(); }
  if (!av) throw new Error('avatar (Me) button not found');
  await p.mouse.click(av.x, av.y);
  await p.waitForTimeout(1100);
  await waitText(p, /SETTINGS|Connected apps|Profile/i, 6000);
}

// Open the center FAB, then one of its fan-out actions (Search/Scan/Voice/Barcode/Eating out/Saved/Water/Fast).
async function fab(p, action) {
  const f = await p.evaluate(() => {
    const H = innerHeight, W = innerWidth;
    let b = null, bd = 1e9;
    [...document.querySelectorAll('button')].forEach(x => {
      const r = x.getBoundingClientRect();
      // must be IN the viewport's bottom bar — off-screen buttons below the fold also have bottom > H-110
      if (r.width < 40 || r.bottom < H - 110 || r.bottom > H + 2 || r.top < H - 160) return;
      const d = Math.abs((r.left + r.width / 2) - W / 2) + (H - r.bottom);
      if (d < bd) { bd = d; b = { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }; }
    });
    return b;
  });
  if (!f) throw new Error('FAB not found');
  await p.mouse.click(f.x, f.y);
  await p.waitForTimeout(800);
  // verify the fan actually opened (fan buttons get pointer-events once open); retry once
  const isOpen = () => p.evaluate(() => {
    const s = [...document.querySelectorAll('button')].find(e => (e.innerText || '').trim() === 'Search');
    return s ? getComputedStyle(s).pointerEvents !== 'none' : false;
  });
  if (!(await isOpen())) { await p.mouse.click(f.x, f.y); await p.waitForTimeout(800); }
  if (!(await isOpen())) throw new Error('FAB fan did not open');
  if (action) {
    // Fan-out action buttons need real mouse events — DOM click() is ignored.
    const pt = await p.evaluate((action) => {
      let best = null;
      [...document.querySelectorAll('button')].forEach(el => {
        const r = el.getBoundingClientRect();
        if ((el.innerText || '').trim() === action && r.width > 0 && r.top > 300)
          best = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      return best;
    }, action);
    if (!pt) throw new Error('FAB action not found: ' + action);
    await p.mouse.click(pt.x, pt.y);
    await p.waitForTimeout(1100);
  }
}

async function goHome(p) {
  await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 45000 });
  await p.waitForTimeout(1600);
  // generous timeout: local dev servers compile routes on first hit
  await waitText(p, /kcal left|kJ left|kcal/i, 25000);
}

function kcalLeft(text) {
  const m = text.match(/([\d,]+)\s*(?:kcal|kJ)\s*left/i);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
}

// Click something, then wait for resulting content — retry the click once if the
// content doesn't appear (guards against clicks landing during re-renders).
async function clickFor(p, name, re, opts = {}) {
  await clickText(p, name, opts);
  try { return await waitText(p, re, 5000); }
  catch (e) {
    await clickText(p, name, opts);
    return waitText(p, re, 6000);
  }
}

async function shot(p, name) {
  fs.mkdirSync(SHOTS, { recursive: true });
  const file = path.join(SHOTS, name.replace(/[^a-z0-9-]+/gi, '_') + '.png');
  await p.screenshot({ path: file, fullPage: true }).catch(() => {});
  return file;
}

module.exports = { BASE, launch, newPage, bodyText, waitText, clickText, clickFor, tab, openMe, fab, goHome, kcalLeft, shot, SHOTS };
