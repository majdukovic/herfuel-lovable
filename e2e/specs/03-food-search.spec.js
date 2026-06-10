// Food search via the live edge function (USDA + Open Food Facts), Croatian brand
// coverage, and logging a searched food to a meal.
module.exports = {
  name: '03 · Food search + log (USDA/OFF/HR)',
  async run(t) {
    const { page: p, H } = t;

    await t.step('open search from FAB', async () => {
      await H.goHome(p);
      t.data.kcalBefore = H.kcalLeft(await H.bodyText(p));
      await H.fab(p, 'Search');
      const hasInput = await p.evaluate(() => !!document.querySelector('input'));
      t.expect(hasInput, 'search input visible');
    });

    await t.step('generic search hits food-search edge fn and returns results', async () => {
      await p.locator('input').first().fill('greek yogurt');
      await p.waitForTimeout(5000);
      const calls = t.collect.edgeCalls.filter(c => c.fn === 'food-search');
      t.expect(calls.length > 0, 'food-search edge function called');
      t.expect(calls.every(c => c.status === 200), 'food-search returned 200 (got ' + JSON.stringify(calls) + ')');
      const txt = await H.bodyText(p);
      t.expect(/greek|yogurt/i.test(txt) && /kcal/i.test(txt), 'results with kcal rendered');
    });

    await t.step('open a result and log it to a meal', async () => {
      await H.clickText(p, 'Greek', { contains: true, nth: 0 });
      await p.waitForTimeout(1300);
      const detail = await H.bodyText(p);
      t.expect(/serving|portion|Log|Add|per 100/i.test(detail), 'food detail/confirm sheet opened');
      // the sheet's CTA is "Log to <meal>" — the background page keeps its own
      // "Add to breakfast" buttons in the DOM, so match the sheet CTA specifically
      const logged = await p.evaluate(() => {
        const els = [...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0);
        const el = els.find(e => /^log to (breakfast|lunch|dinner|snacks?)$/i.test((e.innerText || '').trim()))
          || els.find(e => /^log\b/i.test((e.innerText || '').trim()) && e.getBoundingClientRect().width > 150);
        if (el) { el.click(); return (el.innerText || '').trim(); }
        return null;
      });
      t.expect(logged, 'tapped a Log/Add button (' + logged + ')');
      await p.waitForTimeout(1500);
    });

    await t.step('calorie ring reflects the logged food', async () => {
      // close any sheet remnants, go home
      await H.goHome(p);
      const after = H.kcalLeft(await H.bodyText(p));
      t.expect(after !== null && after < t.data.kcalBefore, `kcal left decreased (${t.data.kcalBefore} → ${after})`);
    });

    await t.step('Croatian brand search returns OFF products (Vegeta)', async () => {
      await H.fab(p, 'Search');
      t.collect.edgeCalls.length = 0;
      await p.locator('input').first().fill('Vegeta');
      await p.waitForTimeout(5500);
      // cache-on-read design: results may come from the cached foods table with
      // no edge call at all — that's correct. If an edge call happened, it must be 200.
      const calls = t.collect.edgeCalls.filter(c => c.fn === 'food-search');
      t.expect(calls.every(c => c.status === 200), 'any food-search call returned 200');
      const txt = await H.bodyText(p);
      t.expect(/vegeta/i.test(txt) && /kcal/i.test(txt), 'Vegeta products listed with nutrition');
    });

    await t.step('no-match search offers community contribution', async () => {
      await p.locator('input').first().fill('xyzzyfoodnotreal123');
      await p.waitForTimeout(5000);
      const txt = await H.bodyText(p);
      t.expect(/community food|add.*food|no .*results|nothing found/i.test(txt), 'no-match state with community-add offer');
    });
  },
};
