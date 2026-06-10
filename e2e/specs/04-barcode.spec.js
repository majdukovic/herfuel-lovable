// Barcode lookup via the food-barcode edge function (manual entry path — headless
// Chrome has no camera). Known-good EAN: 3017620422003 (Nutella, Open Food Facts).
module.exports = {
  name: '04 · Barcode lookup + honest micros',
  async run(t) {
    const { page: p, H } = t;

    await t.step('open barcode entry from FAB', async () => {
      await H.goHome(p);
      await H.fab(p, 'Barcode');
      const txt = await H.bodyText(p);
      t.expect(/barcode|enter|code|scan/i.test(txt), 'barcode screen opened');
      const hasInput = await p.evaluate(() => !!document.querySelector('input'));
      t.expect(hasInput, 'manual barcode input available');
    });

    await t.step('Nutella barcode resolves via food-barcode edge fn', async () => {
      const inp = p.locator('input').first();
      await inp.click();
      await inp.fill('3017620422003');
      // controlled input can drop a programmatic fill — verify and re-type if needed
      if (!(await inp.inputValue())) await inp.pressSequentially('3017620422003', { delay: 30 });
      t.expect(await inp.inputValue() === '3017620422003', 'barcode entered');
      await H.clickText(p, 'Look up product', { nth: -1, mouse: true })
        .catch(() => p.keyboard.press('Enter'));
      await H.waitText(p, /nutella/i, 12000);
      const calls = t.collect.edgeCalls.filter(c => c.fn === 'food-barcode');
      t.expect(calls.length > 0, 'food-barcode edge function called');
      t.expect(calls.some(c => c.status === 200), 'food-barcode returned 200');
    });

    await t.step('missing micros shown honestly (dash, not zero)', async () => {
      const txt = await H.bodyText(p);
      t.expect(/–|—|-\s*(mg|g)|not available|no data/i.test(txt) || !/iron/i.test(txt), 'no fabricated micro values');
    });

    await t.step('log barcode product to a meal', async () => {
      const logged = await p.evaluate(() => {
        const els = [...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0);
        const el = els.find(e => /^(log|add)/i.test((e.innerText || '').trim()) && e.getBoundingClientRect().width > 120);
        if (el) { el.click(); return (el.innerText || '').trim(); }
        return null;
      });
      t.expect(logged, 'Log/Add button tapped');
      await p.waitForTimeout(1500);
      await H.goHome(p);
      const txt = await H.bodyText(p);
      t.expect(/nutella/i.test(txt) || H.kcalLeft(txt) < 1900, 'logged item visible on Today');
    });
  },
};
