// Full lifecycle of a logged food: add → edit macros → copy to tomorrow → remove.
// Uses the ⋯ ItemMenu on Today (aria-label "Item options").
module.exports = {
  name: '11 · Log lifecycle: add, edit, copy, remove',
  async run(t) {
    const { page: p, H } = t;

    await t.step('log a food via search', async () => {
      await H.goHome(p);
      t.data.kcal0 = H.kcalLeft(await H.bodyText(p));
      await H.fab(p, 'Search');
      await p.locator('input').first().fill('greek yogurt');
      await p.waitForTimeout(5000);
      await H.clickText(p, 'Greek', { contains: true, nth: 0 });
      await p.waitForTimeout(1300);
      const logged = await p.evaluate(() => {
        const els = [...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0);
        const el = els.find(e => /^log to (breakfast|lunch|dinner|snacks?)$/i.test((e.innerText || '').trim()));
        if (el) { el.click(); return (el.innerText || '').trim(); }
        return null;
      });
      t.expect(logged, 'logged via sheet CTA: ' + logged);
      await H.goHome(p);
      t.expect(H.kcalLeft(await H.bodyText(p)) < t.data.kcal0, 'ring decreased');
    });

    await t.step('edit the logged item (kcal → 333)', async () => {
      await p.locator('[aria-label="Item options"]').first().click();
      await p.waitForTimeout(800);
      await H.clickText(p, 'Edit', { nth: -1, mouse: true });
      await p.waitForTimeout(700);
      await p.evaluate(() => {
        const inp = [...document.querySelectorAll('input[type=number]')][0];
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(inp, '333');
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await H.clickText(p, 'Save changes', { nth: -1, mouse: true });
      await p.waitForTimeout(1000);
      const txt = await H.bodyText(p);
      t.expect(/333/.test(txt), 'edited kcal visible on Today');
    });

    await t.step('copy the item to tomorrow', async () => {
      await p.locator('[aria-label="Item options"]').first().click();
      await p.waitForTimeout(800);
      await H.clickText(p, 'Copy to another meal / day', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(700);
      await H.clickText(p, 'tomorrow', { nth: -1, mouse: true });
      await p.waitForTimeout(400);
      await H.clickText(p, 'Copy', { nth: -1, mouse: true });
      await p.waitForTimeout(1000);
      // switch to tomorrow on the day strip (−5…+1 → tomorrow = last chip)
      const switched = await p.evaluate(() => {
        const chips = [...document.querySelectorAll('button')].filter(b => /^\d{1,2}$/.test((b.innerText || '').replace(/\D/g, '')) && b.getBoundingClientRect().top < 220);
        if (chips.length < 7) return false;
        chips[chips.length - 1].click(); // tomorrow = last chip (strip is −5…+1)
        return true;
      });
      t.expect(switched, 'day strip found');
      await p.waitForTimeout(1200);
      const txt = await H.bodyText(p);
      t.expect(/Greek/i.test(txt), 'copied item visible on tomorrow');
    });

    await t.step('remove the item (back on today)', async () => {
      await H.goHome(p);
      const before = H.kcalLeft(await H.bodyText(p));
      await p.locator('[aria-label="Item options"]').first().click();
      await p.waitForTimeout(800);
      await H.clickText(p, 'Remove', { nth: -1, mouse: true });
      await p.waitForTimeout(1100);
      const after = H.kcalLeft(await H.bodyText(p));
      t.expect(after > before, `ring restored after remove (${before} → ${after})`);
    });
  },
};
