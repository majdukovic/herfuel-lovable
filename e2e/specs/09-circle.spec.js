// Circle: honest editorial content — articles by "HerFuel Editorial" with cited
// real sources (no invented experts), real YouTube videos by credentialed
// creators, groups without fabricated member counts.
module.exports = {
  name: '09 · Circle: honest content, search, sources',
  async run(t) {
    const { page: p, H } = t;

    await t.step('Circle opens with Learn content', async () => {
      await H.goHome(p);
      await H.tab(p, 'Circle');
      const txt = await H.waitText(p, /Learn|Watch|Challenges|Groups/i, 8000);
      t.expect(/Learn/i.test(txt), 'Learn section present');
    });

    await t.step('articles: honest editorial byline + evidence grades, no invented experts', async () => {
      const txt = await H.bodyText(p);
      t.expect(/HerFuel Editorial/i.test(txt), 'editorial byline present');
      t.expect(/●●●|●●○|●○○/.test(txt), 'evidence grade chips on cards');
      t.expect(!/Asha Mehta|Maya Cole|Lina Park/i.test(txt), 'no fabricated expert authors');
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

    await t.step('article expands with full body, sources and RD-review note', async () => {
      const target = await p.evaluate(() => {
        const els = [...document.querySelectorAll('article')].filter(e => {
          const r = e.getBoundingClientRect();
          return r.width > 200 && r.height > 60 && /HerFuel Editorial/i.test(e.innerText || '');
        });
        if (!els.length) return null;
        els[0].scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = els[0].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, label: (els[0].innerText || '').replace(/\n/g, ' ').slice(0, 50) };
      });
      t.expect(target, 'found an article card');
      await p.mouse.click(target.x, target.y);
      await p.waitForTimeout(1200);
      const txt = await H.bodyText(p);
      t.expect(/Sources/i.test(txt), 'sources section shown (opened: ' + target.label + ')');
      t.expect(/ACOG|NICE|NIH|Cochrane|WHO|BDA|Obesity Reviews|PLoS/i.test(txt), 'real guideline/review sources cited');
      t.expect(/Pending review by a registered dietitian/i.test(txt), 'honest pending-RD-review note');
    });

    await t.step('videos are real YouTube links by credentialed creators', async () => {
      await H.clickText(p, 'watch', { contains: true, nth: -1, mouse: true }).catch(() => H.clickText(p, 'Watch', { nth: -1, mouse: true }));
      await p.waitForTimeout(1200);
      const links = await p.evaluate(() => [...document.querySelectorAll('a[href*="youtube.com/watch"]')].filter(a => a.getBoundingClientRect().width > 0).length);
      t.expect(links >= 2, 'YouTube links present (' + links + ')');
      const txt = await H.bodyText(p);
      t.expect(/Registered Dietitian|OB-GYN|Stanford|lactation consultant|Medical doctor/i.test(txt), 'creator credentials shown');
    });

    await t.step('groups carry no fabricated member counts', async () => {
      await H.clickText(p, 'groups', { contains: true, nth: -1, mouse: true }).catch(() => H.clickText(p, 'Groups', { nth: -1, mouse: true }));
      await p.waitForTimeout(1200);
      const txt = await H.bodyText(p);
      t.expect(/Join group|Open chat/i.test(txt), 'groups listed');
      t.expect(!/\d{3,}\s*members|members\s*\d{3,}/i.test(txt) && !/1,?284|2,?156|1,?789/.test(txt), 'no fake member counts');
    });
  },
};
