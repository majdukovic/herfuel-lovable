// Croatian-engagement package: first-week starter card, one-tap re-log
// (Recents/Frequents), household portion presets, contribution auth gate.
module.exports = {
  name: '17 · Engagement: first-week card, quick re-log, portions, contribute gate',
  async run(t) {
    const { page: p, H } = t;

    await t.step('first-week starter card shows for a new user', async () => {
      await H.goHome(p);
      const txt = await H.waitText(p, /Getting started/i, 15000);
      t.expect(/Log one real meal/i.test(txt), 'task: log a meal');
      t.expect(/Scan a barcode/i.test(txt), 'task: scan');
      t.expect(/life-stage modules/i.test(txt), 'task: modules');
      t.expect(/no streaks, no pressure/i.test(txt), 'no-shame framing');
    });

    await t.step('logging a meal removes that task from the card', async () => {
      await p.evaluate(() => {
        const KEY = 'herfuel.logs.v1';
        // match the app's logs-store ymd(): local midnight -> toISOString (UTC-shifted key)
        const d = new Date(); d.setHours(0,0,0,0);
        const ymd = d.toISOString().slice(0, 10);
        const logs = JSON.parse(localStorage.getItem(KEY) || '{}');
        logs[ymd] = { meals: { breakfast: [{ id: 'qa-1', name: 'QA Jogurt', emoji: '🥛', kcal: 120, protein: 9, carbs: 12, fat: 3, serving: '1 šalica (~240 g)' }], lunch: [], dinner: [], snack: [] }, waterMl: 0 };
        localStorage.setItem(KEY, JSON.stringify(logs));
      });
      await p.reload({ waitUntil: 'networkidle' });
      const txt = await H.waitText(p, /Getting started/i, 15000);
      t.expect(!/Log one real meal/i.test(txt), 'meal task gone after logging');
      t.expect(/1 of 3 done/i.test(txt), 'progress line shows 1 of 3');
    });

    await t.step('quick re-log: Recent list offers the logged food, one tap re-logs', async () => {
      await H.fab(p);
      await H.clickText(p, 'Search', { contains: true, mouse: true });
      const txt = await H.waitText(p, /Recent/i, 15000);
      t.expect(/QA Jogurt/i.test(txt), 'recent food listed before typing');
      t.expect(/One tap logs it again/i.test(txt), 'helper copy present');
      await H.clickText(p, 'QA Jogurt', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1200);
      const today = await H.bodyText(p);
      const count = (today.match(/QA Jogurt/g) || []).length;
      t.expect(count >= 2, `food now logged twice (saw ${count})`);
    });

    await t.step('household portion presets appear for a searched food', async () => {
      await H.fab(p);
      await H.clickText(p, 'Search', { contains: true, mouse: true });
      await p.waitForTimeout(600);
      const input = p.locator('input[placeholder*="oats"], input[placeholder*="zob"]').first();
      await input.fill('oats');
      // poll for an actual result row — /kcal/ alone matches the page behind the sheet
      let pt = null;
      for (let i = 0; i < 40 && !pt; i++) {
        pt = await p.evaluate(() => {
          const rows = [...document.querySelectorAll('button')].filter(b => /kcal\/100g/i.test(b.innerText) && b.innerText.length < 200 && b.getBoundingClientRect().width > 0);
          if (!rows.length) return null;
          rows[0].scrollIntoView({ block: 'center', behavior: 'instant' });
          const r = rows[0].getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
        if (!pt) await p.waitForTimeout(500);
      }
      t.expect(pt, 'search result row found');
      await p.mouse.click(pt.x, pt.y);
      const txt = await H.waitText(p, /100 g/i, 10000);
      t.expect(/tbsp \(~15 g\)|žlica/i.test(txt), 'tablespoon preset offered');
      t.expect(/cup \(~240 g\)|šalica/i.test(txt), 'cup preset offered');
      // close the sheet
      await p.keyboard.press('Escape').catch(() => {});
    });

    await t.step('contribution requires an account (honest gate)', async () => {
      await H.goHome(p);
      await H.fab(p);
      await H.clickText(p, 'Search', { contains: true, mouse: true });
      await p.waitForTimeout(600);
      const input = p.locator('input[placeholder*="oats"], input[placeholder*="zob"]').first();
      await input.fill('xyzzy-nonexistent-food-qa');
      await H.waitText(p, /community food/i, 20000);
      await H.clickText(p, 'Add "xyzzy-nonexistent-food-qa" as a community food', { contains: true, nth: -1, mouse: true });
      const txt = await H.waitText(p, /needs an account/i, 10000);
      t.expect(/real contributor behind it/i.test(txt), 'honest reason given');
      t.expect(/Sign in or create account/i.test(txt), 'sign-in CTA offered');
    });
  },
};
