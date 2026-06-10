// Progress upgrade: nutrition trends derived from the food log (no manual
// re-entry), weekly-averages card, and the honest cycle-day setup (real
// last-period date replaces the fabricated default).
module.exports = {
  name: '13 · Progress: log-derived trends + honest cycle day',
  async run(t) {
    const { page: p, H } = t;

    const logFood = async (query, match) => {
      await H.fab(p, 'Search');
      await p.locator('input').first().fill(query);
      await p.waitForTimeout(5000);
      await H.clickText(p, match, { contains: true, nth: 0 });
      await p.waitForTimeout(1300);
      await p.evaluate(() => {
        const els = [...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0);
        const el = els.find(e => /^log to (breakfast|lunch|dinner|snacks?)$/i.test((e.innerText || '').trim()));
        if (el) el.click();
      });
      await p.waitForTimeout(1500);
    };

    await t.step('log food today and yesterday', async () => {
      await H.goHome(p);
      await logFood('greek yogurt', 'Greek');
      await H.goHome(p);
      // switch to yesterday (chip before today on the −5…+1 strip) and log there too
      const switched = await p.evaluate(() => {
        const chips = [...document.querySelectorAll('button')].filter(b => /^\d{1,2}$/.test((b.innerText || '').replace(/\D/g, '')) && b.getBoundingClientRect().top < 220);
        if (chips.length < 7) return false;
        chips[chips.length - 3].click(); // yesterday (last = tomorrow, second-last = today)
        return true;
      });
      t.expect(switched, 'switched to yesterday');
      await p.waitForTimeout(1200);
      await H.clickText(p, 'Add to breakfast', { contains: true, nth: -1, mouse: true });
      await p.waitForTimeout(1200);
      await p.locator('input').first().fill('banana');
      await p.waitForTimeout(5000);
      await H.clickText(p, 'Banana', { contains: true, nth: 0 });
      await p.waitForTimeout(1300);
      await p.evaluate(() => {
        const els = [...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0);
        const el = els.find(e => /^log to (breakfast|lunch|dinner|snacks?)$/i.test((e.innerText || '').trim()));
        if (el) el.click();
      });
      await p.waitForTimeout(1500);
    });

    await t.step('Trends: weekly averages card derived from the log', async () => {
      await H.goHome(p);
      await H.tab(p, 'Progress');
      const txt = await H.waitText(p, /Daily averages/i, 10000);
      t.expect(/From your food log/i.test(txt), '"From your food log" provenance shown');
      t.expect(/updates as you log/i.test(txt), 'zero-entry copy present');
      const m = txt.replace(/\s+/g, ' ').match(/Calories (\d+)/i);
      t.expect(m && parseInt(m[1], 10) > 0, 'average calories > 0 (' + (m && m[1]) + ')');
    });

    await t.step('Trends: calories chart appears with 2+ logged days', async () => {
      const txt = await H.bodyText(p);
      t.expect(/Calories · from your food log/i.test(txt.replace(/\s+/g, ' ')), 'calories trend card labelled from-log');
    });

    await t.step('cycle day is honest: estimate until the period date is set', async () => {
      // enable cycle module
      await H.openMe(p);
      await H.clickText(p, 'Life-stage modules', { contains: true });
      await p.waitForTimeout(900);
      const card = await p.evaluate(() => {
        const els = [...document.querySelectorAll('button,a,div,li,article')].filter(e => {
          const txt2 = (e.innerText || '').replace(/\s+/g, ' ').trim();
          return /^🌙 ?Cycle/.test(txt2) && txt2.length < 200 && e.getBoundingClientRect().width > 100;
        }).sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
        if (!els.length) return null;
        els[0].scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = els[0].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      t.expect(card, 'Cycle module card found');
      await p.mouse.click(card.x, card.y);
      await p.waitForTimeout(1000);
      await H.goHome(p);
      const today = await H.bodyText(p);
      t.expect(/day \d+ · est\./i.test(today.replace(/\s+/g, ' ')), 'chip marked as estimate before setup');
    });

    await t.step('setting the last-period date computes the real cycle day', async () => {
      await H.tab(p, 'Progress');
      await H.clickFor(p, 'Cycle & body', /last period|HORMONAL CONTRACEPTION/i);
      const dateStr = await p.evaluate(() => {
        const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 7);
        // format locally — toISOString() shifts to UTC and lands on the wrong day
        const v = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const inp = [...document.querySelectorAll('input[type=date]')][0];
        if (!inp) return null;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(inp, v);
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        return v;
      });
      t.expect(dateStr, 'date input found and set to 7 days ago');
      await p.waitForTimeout(1100);
      const txt = await H.bodyText(p);
      t.expect(/Cycle day 8/i.test(txt), 'computed cycle day 8 shown (7 days since start)');
      await H.goHome(p);
      const today = (await H.bodyText(p)).replace(/\s+/g, ' ');
      t.expect(/day 8(?! · est)/i.test(today), 'Today chip shows real day 8, no estimate tag');
    });
  },
};
