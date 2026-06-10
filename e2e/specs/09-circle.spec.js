// Circle: learn content with professional attribution, search and category filter.
module.exports = {
  name: '09 · Circle: content, search, attribution',
  async run(t) {
    const { page: p, H } = t;

    await t.step('Circle opens with Learn content', async () => {
      await H.goHome(p);
      await H.tab(p, 'Circle');
      const txt = await H.waitText(p, /Learn|Watch|Challenges|Groups/i, 8000);
      t.data.circle = txt;
      t.expect(/Learn/i.test(txt), 'Learn section present');
    });

    await t.step('articles carry RD/MD attribution', async () => {
      const txt = await H.bodyText(p);
      t.expect(/RD|MD|Dr\./.test(txt), 'professional attribution visible in article cards');
    });

    await t.step('search filters content', async () => {
      const hasInput = await p.evaluate(() => !!document.querySelector('input'));
      t.expect(hasInput, 'search input present');
      await p.locator('input').first().fill('iron');
      await p.waitForTimeout(1500);
      const txt = await H.bodyText(p);
      t.expect(/iron/i.test(txt), 'iron-related results shown');
      await p.locator('input').first().fill('');
      await p.waitForTimeout(800);
    });

    await t.step('open an article and verify attribution + evidence framing', async () => {
      // article cards are <article> elements with "· N min" + "By <author>, RD/MD"
      const target = await p.evaluate(() => {
        const els = [...document.querySelectorAll('article,li')].filter(e => {
          const r = e.getBoundingClientRect();
          return r.width > 200 && r.height > 60 && /min/i.test(e.innerText || '') && /RD|MD|Dr\./.test(e.innerText || '');
        });
        if (!els.length) return null;
        els[0].scrollIntoView({ block: 'center' });
        const r = els[0].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, label: (els[0].innerText || '').replace(/\n/g, ' ').slice(0, 60) };
      });
      t.expect(target, 'found an article card');
      await p.mouse.click(target.x, target.y);
      await p.waitForTimeout(1400);
      const txt = await H.bodyText(p);
      t.expect(/RD|MD|Dr\.|Reviewed/i.test(txt), 'article detail carries attribution (opened: ' + target.label + ')');
    });
  },
};
