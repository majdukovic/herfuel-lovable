// Meals section: recipe logging actually logs (with Today/Tomorrow choice),
// meal-plan day-1 apply actually logs, plan-for-tomorrow works, no fake ratings.
module.exports = {
  name: '12 · Meals: recipe log, plan apply, plan tomorrow',
  async run(t) {
    const { page: p, H } = t;

    await t.step('Meals hub shows recipes without fabricated ratings', async () => {
      await H.goHome(p);
      t.data.kcal0 = H.kcalLeft(await H.bodyText(p));
      await H.tab(p, 'Meals');
      const txt = await H.waitText(p, /recipe|meal/i, 10000);
      t.expect(!/4\.[5-9]\b/.test(txt), 'no fake rating numbers (4.5–4.9) on cards');
    });

    await t.step('recipe → Add to meal actually logs to Today', async () => {
      const opened = await p.evaluate(() => {
        const els = [...document.querySelectorAll('div,a,button')].filter(e => {
          const r = e.getBoundingClientRect();
          return r.top > 150 && r.width > 200 && r.height > 60 && /kcal/i.test(e.innerText || '') && (e.innerText || '').length < 220;
        });
        if (!els.length) return null;
        els[0].scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = els[0].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, name: (els[0].innerText || '').split('\n')[0] };
      });
      t.expect(opened, 'opened recipe: ' + (opened && opened.name));
      await p.mouse.click(opened.x, opened.y);
      await p.waitForTimeout(1400);
      t.data.recipeName = (await H.bodyText(p)).match(/([A-Z][^\n]{3,40})/)?.[1];
      await H.clickText(p, 'Add to meal', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(900);
      const dlg = await H.bodyText(p);
      t.expect(/Plan for tomorrow/i.test(dlg), 'day toggle (Today / Plan for tomorrow) present');
      await H.clickText(p, 'Add to lunch', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(900);
      t.expect(/Added to lunch/i.test(await H.bodyText(p)), 'success banner confirms real log');
      await H.goHome(p);
      const after = H.kcalLeft(await H.bodyText(p));
      t.expect(after < t.data.kcal0, `ring decreased (${t.data.kcal0} → ${after})`);
    });

    await t.step('meal plan: "Log day 1 to Today" actually logs all meals', async () => {
      t.data.kcalBeforePlan = H.kcalLeft(await H.bodyText(p));
      await H.tab(p, 'Meals');
      await p.waitForTimeout(1200);
      await H.clickText(p, 'Meal plans', { nth: -1, mouse: true });
      await H.waitText(p, /\d+ days ·/, 8000);
      // open the first plan card (tagged "N days · …")
      const plan = await p.evaluate(() => {
        const els = [...document.querySelectorAll('div,a,button,p,span,li,article,h3')].filter(e => {
          const r = e.getBoundingClientRect();
          return r.width > 100 && r.height > 10 && /\d+ days ·/i.test(e.innerText || '') && (e.innerText || '').length < 400;
        }).sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
        if (!els.length) return null;
        els[0].scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = els[0].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      t.expect(plan, 'plan card found');
      await p.mouse.click(plan.x, plan.y);
      await H.waitText(p, /Sample days|Log day 1/i, 8000);
      await H.clickText(p, 'Log day 1 to Today', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1100);
      t.expect(/Day 1 logged to Today/i.test(await H.bodyText(p)), 'honest confirmation banner');
      await H.goHome(p);
      const txt = await H.bodyText(p);
      const after = H.kcalLeft(txt);
      t.expect(after < t.data.kcalBeforePlan - 500, `plan meals actually logged (${t.data.kcalBeforePlan} → ${after})`);
      // items naming a cited recipe log with REAL published macros ("1 serving");
      // only unmatched items fall back to honest "plan estimate" labels
      t.expect(/Overnight oats|Teriyaki|Broiled salmon|black bean|chili|curry/i.test(txt), 'plan items visible on Today by name');
    });

    await t.step('meal plan: "Plan for tomorrow" lands on tomorrow, not today', async () => {
      const todayKcal = H.kcalLeft(await H.bodyText(p));
      await H.tab(p, 'Meals');
      await p.waitForTimeout(1200);
      await H.clickText(p, 'Meal plans', { nth: -1, mouse: true });
      await H.waitText(p, /\d+ days ·/, 8000);
      const plan = await p.evaluate(() => {
        const els = [...document.querySelectorAll('div,a,button,p,span,li,article,h3')].filter(e => {
          const r = e.getBoundingClientRect();
          return r.width > 100 && r.height > 10 && /\d+ days ·/i.test(e.innerText || '') && (e.innerText || '').length < 400;
        }).sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
        if (!els.length) return null;
        els[0].scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = els[0].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      await p.mouse.click(plan.x, plan.y);
      await H.waitText(p, /Sample days|Plan for tomorrow/i, 8000);
      await H.clickText(p, 'Plan for tomorrow', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1100);
      t.expect(/planned for tomorrow/i.test(await H.bodyText(p)), 'tomorrow confirmation banner');
      await H.goHome(p);
      t.expect(H.kcalLeft(await H.bodyText(p)) === todayKcal, "today's ring unchanged");
      const switched = await p.evaluate(() => {
        const chips = [...document.querySelectorAll('button')].filter(b => /^\d{1,2}$/.test((b.innerText || '').replace(/\D/g, '')) && b.getBoundingClientRect().top < 220);
        if (chips.length < 7) return false;
        chips[chips.length - 1].click(); // tomorrow = last chip (strip is −5…+1)
        return true;
      });
      t.expect(switched, 'switched to tomorrow');
      await p.waitForTimeout(1200);
      t.expect(/Overnight oats|Teriyaki|Broiled salmon|black bean|chili|curry|plan estimate/i.test(await H.bodyText(p)), "plan entries visible on tomorrow");
    });

    await t.step('plan adds a shopping list', async () => {
      await H.tab(p, 'Meals');
      await p.waitForTimeout(1200);
      await H.clickText(p, 'Meal plans', { nth: -1, mouse: true });
      await H.waitText(p, /\d+ days ·/, 8000);
      const plan = await p.evaluate(() => {
        const els = [...document.querySelectorAll('div,a,button,p,span,li,article,h3')].filter(e => {
          const r = e.getBoundingClientRect();
          return r.width > 100 && r.height > 10 && /\d+ days ·/i.test(e.innerText || '') && (e.innerText || '').length < 400;
        }).sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
        if (!els.length) return null;
        els[0].scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = els[0].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      await p.mouse.click(plan.x, plan.y);
      await H.waitText(p, /shopping list/i, 8000);
      await H.clickText(p, 'Add to shopping list', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1100);
      t.expect(/Added \d+ items|Already on your list/i.test(await H.bodyText(p)), 'grocery confirmation');
    });
  },
};
