// Meals hub: recipes, meal plans, create-your-own (food / recipe / meal), shopping list.
module.exports = {
  name: '05 · Meals hub + create food/recipe + shopping list',
  async run(t) {
    const { page: p, H } = t;

    await t.step('Meals hub renders recipes and plans', async () => {
      await H.goHome(p);
      await H.tab(p, 'Meals');
      const txt = await H.waitText(p, /recipe|meal/i, 8000);
      t.data.mealsHub = txt;
      t.expect(/recipe/i.test(txt), 'recipes visible');
    });

    await t.step('open a recipe detail', async () => {
      const opened = await p.evaluate(() => {
        // tap the first card-ish element mentioning kcal below the header
        const els = [...document.querySelectorAll('div,a,button')].filter(e => {
          const r = e.getBoundingClientRect();
          return r.top > 150 && r.width > 200 && r.height > 60 && /kcal/i.test(e.innerText || '') && (e.innerText || '').length < 220;
        });
        if (!els.length) return null;
        els[0].click();
        return (els[0].innerText || '').split('\n')[0];
      });
      t.expect(opened, 'tapped a recipe card: ' + opened);
      await p.waitForTimeout(1400);
      const txt = await H.bodyText(p);
      t.expect(/ingredient|serving|instructions|method|per serving/i.test(txt), 'recipe detail opened');
      await p.goBack().catch(() => {});
      await p.waitForTimeout(800);
      if (!/recipe/i.test(await H.bodyText(p))) { await H.goHome(p); await H.tab(p, 'Meals'); }
    });

    await t.step('create a custom food', async () => {
      await H.clickText(p, 'Create', { contains: true, nth: 0 }).catch(async () => {
        await H.clickText(p, 'Create food', { contains: true });
      });
      await p.waitForTimeout(900);
      const txt = await H.bodyText(p);
      if (/Create food/i.test(txt)) await H.clickText(p, 'Create food', { contains: true }).catch(() => {});
      await p.waitForTimeout(900);
      // fill the form: name + kcal + macros (first inputs)
      const filled = await p.evaluate(() => {
        const inputs = [...document.querySelectorAll('input')].filter(i => i.getBoundingClientRect().width > 0);
        if (!inputs.length) return 0;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const vals = ['E2E Test Food', '250', '20', '20', '8'];
        inputs.slice(0, 5).forEach((i, idx) => {
          setter.call(i, i.type === 'number' || i.inputMode === 'decimal' || i.inputMode === 'numeric' ? (vals[idx] || '5').replace(/\D/g, '') || '5' : vals[idx] || 'x');
          i.dispatchEvent(new Event('input', { bubbles: true }));
        });
        return inputs.length;
      });
      t.expect(filled > 0, 'create-food form has inputs (' + filled + ')');
      await H.clickText(p, 'Save', { contains: true }).catch(() => H.clickText(p, 'Create', { contains: true, nth: -1 }));
      await p.waitForTimeout(1200);
      const after = await H.bodyText(p);
      t.expect(/E2E Test Food|saved|added|My foods/i.test(after), 'custom food saved');
    });

    await t.step('shopping list reachable and accepts a manual item', async () => {
      await H.openMe(p);
      await H.clickText(p, 'Shopping list', { contains: true });
      await p.waitForTimeout(1100);
      const txt = await H.bodyText(p);
      t.expect(/shopping/i.test(txt), 'shopping list opened');
      const hasInput = await p.evaluate(() => !!document.querySelector('input'));
      if (hasInput) {
        await p.locator('input').first().fill('Lentils');
        await p.keyboard.press('Enter').catch(() => {});
        await p.waitForTimeout(400);
        await p.evaluate(() => {
          const el = [...document.querySelectorAll('button')].find(e => /^add$|^\+$/i.test((e.innerText || '').trim()));
          if (el) el.click();
        });
        await p.waitForTimeout(800);
        t.expect(/Lentils/i.test(await H.bodyText(p)), 'manual item added');
      }
    });
  },
};
